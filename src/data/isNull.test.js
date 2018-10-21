import isNull from './isNull'

describe('isNull', () => {
  test('returns true for null', () => {
    expect(isNull(null)).toBe(true)
  })

  test('returns false for all other values', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull('abc')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull(true)).toBe(false)
    expect(isNull(0)).toBe(false)
    expect(isNull(-1)).toBe(false)
    expect(isNull(1)).toBe(false)
    expect(isNull(NaN)).toBe(false)
    expect(isNull(Infinity)).toBe(false)
    expect(isNull(-Infinity)).toBe(false)
    expect(isNull({})).toBe(false)
    expect(isNull([])).toBe(false)
    expect(isNull(new Array(0))).toBe(false)
    expect(isNull([0])).toBe(false)
    expect(isNull(/abc/)).toBe(false)
    expect(isNull(async () => {})).toBe(false)
    expect(isNull(() => {})).toBe(false)
    expect(isNull(function() {})).toBe(false)
    expect(isNull((function*() {})())).toBe(false)
    expect(isNull(new ArrayBuffer(2))).toBe(false)
    expect(isNull(new Boolean(false))).toBe(false)
    expect(isNull(new Boolean(true))).toBe(false)
    expect(isNull(new Date())).toBe(false)
    expect(isNull(new Error())).toBe(false)
    expect(isNull(new Map())).toBe(false)
    expect(isNull(new Number(1))).toBe(false)
    expect(isNull(new Promise(() => {}))).toBe(false)
    expect(isNull(new Proxy({}, {}))).toBe(false)
    expect(isNull(new Set())).toBe(false)
    expect(isNull(new String('abc'))).toBe(false)
    expect(isNull(Symbol('abc'))).toBe(false)
    expect(isNull(new WeakMap())).toBe(false)
    expect(isNull(new WeakSet())).toBe(false)
  })
})