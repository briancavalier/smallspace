import {
  array, bigint, boolean, defaultTestConfig, float, int, nat, number, oneof, record, show, string,
  tuple
} from '../src'

console.log('Up to depth', defaultTestConfig.maxDepth)

console.log(`boolean\n${show(boolean)}\n`)
console.log(`nat\n${show(nat)}\n`)
console.log(`int\n${show(int)}\n`)
console.log(`bigint\n${show(bigint)}\n`)
console.log(`float\n${show(float)}\n`)
console.log(`number\n${show(number)}\n`)
console.log(`string\n${show(string())}\n`)

// Products

console.log(`array\n${show(array(number))}\n`)
console.log(`tuple\n${show(tuple(number, string(), int))}\n`)
console.log(`record\n${show(record({ foo: string(), bar: int }))}\n`)

// Sums

console.log(`oneof\n${show(oneof(number, string()))}\n`)
