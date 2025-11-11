import { describe, it, expect } from 'vitest'
import { hex } from '../../src/utils/themes.js'

describe('hex', () => {
  it('colors text with 6-digit hex with leading #', () => {
    const out = hex('#112233', 'hello')
    // 0x11=17, 0x22=34, 0x33=51
    expect(out).toContain('38;2;17;34;51')
    expect(out).toContain('hello')
  })

  it('supports 3-digit shorthand', () => {
    const out = hex('#abc', 'x')
    // a->aa=170, b->bb=187, c->cc=204
    expect(out).toContain('38;2;170;187;204')
    expect(out).toContain('x')
  })

  it('accepts color without #', () => {
    const out = hex('00ff00' as any, 'ok')
    expect(out).toContain('38;2;0;255;0')
    expect(out).toContain('ok')
  })

  it('throws on invalid characters', () => {
    expect(() => hex('#ggg', 'x')).toThrow()
  })

  it('throws on wrong length', () => {
    expect(() => hex('#1234', 'x')).toThrow()
  })
})
