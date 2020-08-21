import { describe, it } from 'mocha'

import { assert, char, prop, string } from '../../src'

const reverse = (s: string): string => [...s].reverse().join('')

describe('reverse', () => {
  it('invariant length', () => {
    assert(prop(reverse, (r, s) => r.length === s.length, string(char('abc'))))
  })
})
