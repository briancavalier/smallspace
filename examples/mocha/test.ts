import assert from 'assert'
import { describe, it } from 'mocha'

import { check, prop, sample, string } from '../../src'

const reverse = (s: string): string => [...s].reverse().join('')

describe('reverse', () => {
  it('invariant length', () => {
    for (const s of sample(string())) {
      assert.strictEqual(s.length, reverse(s).length)
    }
  })

  it('invariant length', () =>
    check(prop(s => reverse(s).length === s.length, string())))
})
