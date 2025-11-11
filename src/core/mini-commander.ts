import {  CommanderError } from '~/errors'

export type ActionFn = (...args: any[]) => any

export class Command {
  private $name = ''
  private $description = ''
  private $version = ''
  private argName: string | null = null
  private options: Array<{ flags: string; description?: string; arg?: string }> = []
  private actionFn: ActionFn | null = null
  private exitOverrideEnabled = false

  name(n: string) {
    this.$name = n
    return this
  }

  description(d: string) {
    this.$description = d
    return this
  }

  version(v: string) {
    this.$version = v
    return this
  }

  argument(arg: string, _desc?: string) {
    // Only support a single optional argument like [project-name]
    const cleaned = arg.replace(/[[\]]/g, '')
    this.argName = cleaned
    return this
  }

  option(flags: string, description?: string) {
    // flags like '-t, --template <template>' or '--async'
    const match = flags.match(/<([^>]+)>/)
    const arg = match ? match[1] : undefined
    this.options.push({ flags, description, arg })
    return this
  }

  action(fn: ActionFn) {
    this.actionFn = fn
    return this
  }

  exitOverride() {
    this.exitOverrideEnabled = true
    return this
  }

  private throwExit(exitCode: number, code?: string) {
    if (this.exitOverrideEnabled) {
      throw new CommanderError('process.exit unexpectedly called', exitCode, code)
    }
    process.exit(exitCode)
  }

  parse(argv?: string[]) {
    const args = argv ? argv.slice() : process.argv.slice()
    // Normalize: if it's full node argv include node+script, remove first two
    if (args.length > 0 && args[0].endsWith('node')) {
      // assume node style
    }
    // Find position where real args start: if argv looks like process.argv, drop first 2
    let start = 0

    if (args.length >= 2 && args[0].endsWith('node')) {
      start = 2
    } else if (args.length >= 2 && args[0].includes('node')) {
      start = 2
    } else if (args.length >= 2 && args[1].endsWith('.js')) {
      start = 2
    }

    const real = args.slice(start)

    // simple help/version handling
    if (real.includes('--help') || real.includes('-h')) {
      // simulate help output by throwing with exitCode 0
      this.throwExit(0, 'commander.helpDisplayed')
    }

    if (real.includes('-V') || real.includes('--version')) {
      console.log(this.$version)
      this.throwExit(0, 'commander.version')
    }

    // parse options and argument
    const options: Record<string, any> = {}
    const nonOptionArgs: string[] = []

    for (let i = 0; i < real.length; i++) {
      const token = real[i]
      if (token.startsWith('--')) {
        const eq = token.indexOf('=')
        if (eq !== -1) {
          const key = token.substring(2, eq)
          options[key] = token.substring(eq + 1)
        } else {
          const key = token.substring(2)
          // see if option expects a value
          const optDef = this.options.find((o) => o.flags.includes(`--${key}`))
          if (optDef && optDef.arg) {
            options[key] = real[i + 1]
            i++
          } else {
            options[key] = true
          }
        }
      } else if (token.startsWith('-') && token.length > 1) {
        const letters = token.substring(1).split('')
        // support only single-letter options possibly with value like -t value
        if (letters.length === 1) {
          const letter = letters[0]
          const optDef = this.options.find((o) => o.flags.includes(`-${letter}`))
          if (optDef && optDef.arg) {
            const long = (optDef.flags.match(/--([a-zA-Z0-9-]+)/) || [])[1]
            options[long || letter] = real[i + 1]
            i++
          } else {
            const long = (this.options.find((o) => o.flags.includes(`-${letter}`))?.flags.match(/--([a-zA-Z0-9-]+)/) || [])[1]
            options[long || letter] = true
          }
        } else {
          // combined flags like -xy -> set each true
          for (const l of letters) {
            options[l] = true
          }
        }
      } else {
        nonOptionArgs.push(token)
      }
    }

    const projectName = nonOptionArgs.length > 0 ? nonOptionArgs[0] : undefined

    if (this.actionFn) {
      // Call action with (projectName, options)
      return this.actionFn(projectName, options)
    }
  }
}

export default Command
