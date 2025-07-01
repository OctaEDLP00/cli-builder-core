import { beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  process.env.NODE_ENV = 'test'
});

afterEach(() => {
  if (console.log.mockRestore) {
    console.log.mockRestore()
  }
  if (console.error.mockRestore) {
    console.error.mockRestore()
  }
  if (console.warn.mockRestore) {
    console.warn.mockRestore()
  }
});
