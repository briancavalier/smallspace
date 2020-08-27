import { cartesian, chain } from './array'

export type Nat = number

export type Source<N, A> = (n: N) => readonly A[]

export type Sources<N, A extends readonly unknown[]> = {
  readonly [I in keyof A]: Source<N, A[I]>
}

export type Value<S> = S extends Source<any, infer A> ? A : never
export type Depth<S> = S extends Source<infer N, any> ? N : never

export type Values<S extends readonly Source<any, any>[]> = {
  readonly [I in keyof S]: Value<S[I]>
}

export type Depths<S extends readonly Source<any, any>[]> = {
  readonly [I in keyof S]: Depth<S[I]>
}

export const mapDepth = <N, M, A>(f: (n: N) => M, s: Source<M, A>): Source<N, A> =>
  n => s(f(n))

export const shift = <A>(n: Nat, s: Source<Nat, A>): Source<Nat, A> =>
  mapDepth(n0 => Math.max(0, n0 + n), s)

export const scale = <A>(n: number, s: Source<Nat, A>): Source<Nat, A> =>
  mapDepth(n0 => Math.max(0, Math.trunc(n0 * n)), s)

export const map = <N, A, B>(s: Source<N, A>, f: (a: A) => B): Source<N, B> =>
  n => s(n).map(f)

export const filterDepth = <A>(p: (n: Nat) => boolean, s: Source<Nat, A>): Source<Nat, A> =>
  n => p(n) ? s(n) : []

// Basic Sources

export const always = <N, A>(a: A): Source<N, A> => _ => [a]

export const boolean: Source<Nat, boolean> = n => n === 0 ? [false] : n === 1 ? [true] : []

export const nat: Source<Nat, Nat> = n => [n]

export const int: Source<Nat, number> = n => [-n, n]

export const bigint: Source<Nat, bigint> = map(int, BigInt)

export const float: Source<Nat, number> = n => n === 0 ? [-0, 0] : n === 1 ? [-1, 1] : withNegatives(2 ** (n - 1))

export const number: Source<Nat, number> = n => n === 0 ? [NaN, -Infinity, Infinity, -0, 0] : n === 1 ? [-1, 1] : withNegatives(2 ** (n - 1))

const withNegatives = (x: number, y = 1 / x): [number, number, number, number] => [-x, -y, x, y]

export const char = (chars: string = 'abc'): Source<Nat, string> =>
  n => chars.slice(0, n + 1).split('')

export const string = (s: Source<Nat, string> = char(), sep: string = ''): Source<Nat, string> =>
  map(array(s), chars => chars.join(sep))

// Products

export const array = <A>(s: Source<Nat, A>): Source<Nat, readonly A[]> =>
  n => n === 0 ? [[]] : cartesian(Array(n).fill(s(n - 1)))

export type TupleOf<Sources extends readonly Source<any, any>[]> = Source<Depths<Sources>[number], Values<Sources>>

export const tuple = <SS extends readonly Source<Nat, any>[]>(...sources: SS): TupleOf<SS> =>
  n => n === 0 ? [[]] as any : cartesian(sources.map(s => s(n - 1))) as unknown as Values<SS>

export type RecordOf<Sources extends Record<PropertyKey, Source<Nat, any>>> = {
  [K in keyof Sources]: Value<Sources[K]>
}
export type RecordsOf<Sources extends Record<PropertyKey, Source<Nat, any>>> = Source<Nat, RecordOf<Sources>>

export const record = <SS extends Record<PropertyKey, Source<any, any>>>(rs: SS): RecordsOf<SS> => {
  const ks = Object.keys(rs) as readonly (keyof SS)[]
  return filterDepth(n => n > 0, map(tuple(...Object.values(rs)), t => {
    const r = {} as RecordOf<SS>
    for (let i = 0; i < ks.length; i++) {
      r[ks[i]] = t[i]
    }
    return r
  }))
}

// Coproducts

export type OneOf<Sources extends readonly Source<any, any>[]> = Source<Depths<Sources>[number], Values<Sources>[number]>

export const oneof = <SS extends readonly Source<any, any>[]>(...sources: SS): OneOf<SS> =>
  n => chain(sources, s => s(n))
