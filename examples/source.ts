import {
  array, bigint, boolean, char, defaultTestConfig, float, int, nat, number, show, string, tuple
} from '../src'

console.log('Up to depth', defaultTestConfig.maxDepth)

console.log('boolean', show(boolean))
console.log('nat', show(nat))
console.log('int', show(int))
console.log('bigint', show(bigint))
console.log('float', show(float))
console.log('number', show(number))
console.log('char', show(char('abc')))
console.log('string', show(string(char('abc'))))
console.log('array', show(array(number)))
console.log('tuple', show(tuple(number, char('abc'), int)))
