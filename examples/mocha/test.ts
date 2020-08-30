import { strictEqual } from 'assert'
import { describe, it } from 'mocha'

import { assert, prop, sample, string } from '../../src'

const reverse = (s: string): string => [...s].reverse().join('')

describe('reverse', () => {
  it('invariant length', () => {
    for (const s of sample(string())) {
      strictEqual(s.length, reverse(s).length)
    }
  })

  it('invariant length', () => {
    assert(prop(s => reverse(s).length === s.length, string()))
  })
})
