import { cartesian } from './array'
import { Nat, Source, Values } from './source'

export type Property<A, R> = Source<Result<A, R>>

export type Result<A, R> = { depth: Nat, input: A, result: R }

export const prop = <S extends readonly Source<any>[], R>(f: (...args: Values<S>) => R, ...sources: S): Source<Result<Values<S>, R>> =>
  (n: Nat) => cartesian(sources.map(s => s(n))).map(input =>
    ({ depth: n, input, result: f(...(input as any)) })) as unknown as readonly Result<Values<S>, R>[]
