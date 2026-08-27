import { describe, it, expect } from 'vitest'
import { escapeHtml } from '../src/js/escapeHtml.js'

describe('escapeHtml', () => {
  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  })

  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('passes through safe strings unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('escapes mixed dangerous content', () => {
    expect(escapeHtml('<img onerror="alert(1)">')).toBe('&lt;img onerror="alert(1)"&gt;')
  })
})
