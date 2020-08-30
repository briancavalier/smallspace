import { inspect } from 'util'

import {
  array, bigint, boolean, char, date, defaultTestBounds, float, int, nat, number, oneof, record,
  sample, scale, Source, string, tuple
} from '../src'

console.log('Up to depth', defaultTestBounds.maxDepth)

const show = <A>(name: string, s: Source<A>): void => {
  process.stdout.write(`\n${name}\n`)
  process.stdout.write(`${[...sample(s)].map(a => inspect(a)).join('\n')}\n`)
}

show('boolean', boolean)
show('nat', nat)
show('int', int)
show('bigint', bigint)
show('float', float)
show('number', number)
show('char', char())
show('string', string())
show('date', date(new Date(), scale(60 * 60 * 1000, int)))

// Products

show('array(number)', array(number))
show('tuple(number, string, int)', tuple(number, string(), int))
show('record({ foo: string, bar: int })', record({ foo: string(), bar: int }))

// Sums

show('oneof(number, char)', oneof(number, char()))
