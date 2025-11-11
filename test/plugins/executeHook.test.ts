import { describe, it, expect, vi } from 'vitest'
import { PluginManager } from '../../src/plugins/plugin-manager.js'

describe('PluginManager executeHook', () => {
  it('passes arguments to hooks when provided', async () => {
    const pm = new PluginManager()
    const hook = vi.fn()
    await pm.install({ name: 'p', version: '1.0.0', hooks: { beforeGenerate: hook } })

    await pm.executeHook('beforeGenerate', { x: 1 })

    expect(hook).toHaveBeenCalledWith({ x: 1 })
  })

  it('awaits promise-returning hooks', async () => {
    const pm = new PluginManager()
    const hook = vi.fn().mockImplementation(async (ctx) => {
      return new Promise((res) => setTimeout(() => res(ctx), 10))
    })
    await pm.install({ name: 'p2', version: '1.0.0', hooks: { beforeGenerate: hook } })

    await pm.executeHook('beforeGenerate', { ok: true })

    expect(hook).toHaveBeenCalled()
  })

  it('handles rejected promise from hooks and calls onError', async () => {
    const pm = new PluginManager()
    const hook = vi.fn().mockImplementation(() => Promise.reject(new Error('boom')))
    const onError = vi.fn()

    await pm.install({ name: 'p3', version: '1.0.0', hooks: { beforeGenerate: hook, onError } })

    await pm.executeHook('beforeGenerate', { test: true })

    expect(hook).toHaveBeenCalled()
    expect(onError).toHaveBeenCalled()
  })

  it('awaits async onError handlers', async () => {
    const pm = new PluginManager()
    const hook = vi.fn().mockImplementation(() => Promise.reject(new Error('boom2')))
    const onError = vi.fn().mockImplementation(async (err) => {
      return new Promise((res) => setTimeout(() => res(err.message), 5))
    })

    await pm.install({ name: 'p4', version: '1.0.0', hooks: { beforeGenerate: hook, onError } })

    await pm.executeHook('beforeGenerate', { t: 1 })

    expect(onError).toHaveBeenCalled()
  })
})
