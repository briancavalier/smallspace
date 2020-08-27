import { cartesian } from './array'
import { Source, Sources, Values } from './source'

export type Property<N, A, R> = Source<N, Result<N, A, R>>

export type Result<N, A, R> = { depth: N, input: A, result: R }

export const prop = <N, S extends readonly Source<any, any>[], R>(f: (...args: Values<S>) => R, ...sources: S): Source<N, Result<N, Values<S>, R>> =>
  (n: N) => cartesian(sources.map(s => s(n))).map(input =>
    ({ depth: n, input, result: f(...(input as any)) })) as unknown as readonly Result<N, Values<S>, R>[]
