import type { UITheme } from '../types/index.d.js'

/**
 * Collection of predefined UI themes for CLI applications.
 * Each theme defines colors for different UI elements like success, error, warning, etc.
 *
 * @example
 * ```typescript
 * const cli = createCLI({
 *   // ... other config
 *   theme: themes.vibrant
 * });
 * ```
 */
export const themes = {
  /**
   * Default blue-based theme with professional colors.
   * Suitable for most business and development applications.
   */
  default: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    muted: '#9ca3af',
  } as UITheme,

  /**
   * Dark theme with lighter colors for better contrast on dark backgrounds.
   * Ideal for developers who prefer dark terminal themes.
   */
  dark: {
    primary: '#60a5fa',
    secondary: '#9ca3af',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#22d3ee',
    muted: '#6b7280',
  } as UITheme,

  /**
   * Minimal black and white theme for clean, distraction-free interfaces.
   * Perfect for simple CLIs or when color accessibility is a concern.
   */
  minimal: {
    primary: '#000000',
    secondary: '#666666',
    success: '#008000',
    error: '#ff0000',
    warning: '#ffa500',
    info: '#0000ff',
    muted: '#999999',
  } as UITheme,

  /**
   * Vibrant theme with bright, energetic colors.
   * Great for creative tools or applications targeting younger audiences.
   */
  vibrant: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    success: '#06d6a0',
    error: '#f72585',
    warning: '#ffbe0b',
    info: '#3a86ff',
    muted: '#adb5bd',
  } as UITheme,
}

function verifyHexValidity(hexstr: string): (3 | 6) | Error {
  const length = hexstr.length

  if (length !== 3 && length !== 6) {
    return new Error(`The hexadecimal length is not valid. The length is of ${length}`)
  }

  if (!/^[0-9A-Fa-f]+$/.test(hexstr)) {
    return new Error('The Hexadecimal contains invalid characters')
  }

  return length as 3 | 6
}

export function hex(color: `#${string}`, txt: string) {
  const input = color.startsWith('#') ? color : `#${color}`
  const validation = verifyHexValidity(input)
  if (validation instanceof Error) throw validation
  const hexValue = input.substring(1)
  const fullHex =
    validation === 3
      ? hexValue
          .split('')
          .map(c => c + c)
          .join('')
      : hexValue
  const r = parseInt(fullHex.substring(0, 2), 16)
  const g = parseInt(fullHex.substring(2, 4), 16)
  const b = parseInt(fullHex.substring(4, 6), 16)
  const output = `\x1b[38;2;${r};${g};${b}m${txt}\x1b[0m`
  return output
}
