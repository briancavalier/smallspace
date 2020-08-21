import { cartesian } from './array'
import { Source, Sources } from './source'

export type Property<N, A, R> = Source<N, Result<N, A, R>>

export type Result<N, A, R> = { depth: N, input: A, result: R, ok: boolean }

export const prop = <N, Args extends readonly unknown[], R>(f: (...args: Args) => R, p: (r: R, ...args: Args) => boolean, ...sources: Sources<N, Args>): Property<N, Args, R> =>
  (n: N) => cartesian(sources.map(s => s(n))).map(args => {
    const result = f(...(args as any))
    return { depth: n, input: args, result, ok: p(result, ...(args as any)) }
  }) as unknown as readonly Result<N, Args, R>[]
