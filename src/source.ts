import { cartesian, chain } from './array'

export type Nat = number

export type Source<A> = (n: Nat) => readonly A[]

export type Sources<A extends readonly unknown[]> = {
  readonly [I in keyof A]: Source<A[I]>
}

export type Value<S> = S extends Source<infer A> ? A : never

export type Values<S extends readonly Source<any>[]> = {
  readonly [I in keyof S]: Value<S[I]>
}

export const map = <A, B>(s: Source<A>, f: (a: A) => B): Source<B> =>
  n => s(n).map(f)

export const mapDepth = <A>(f: (n: Nat) => Nat, s: Source<A>): Source<A> =>
  n => s(f(n))

export const shift = <A>(n: Nat, s: Source<A>): Source<A> =>
  mapDepth(n0 => Math.max(0, n0 + n), s)

export const scale = <A>(n: number, s: Source<A>): Source<A> =>
  mapDepth(n0 => Math.max(0, Math.trunc(n0 * n)), s)

export const filterDepth = <A>(p: (n: Nat) => boolean, s: Source<A>): Source<A> =>
  n => p(n) ? s(n) : []

// Basic Sources

export const always = <A>(a: A): Source<A> => _ => [a]

export const boolean: Source<boolean> = n => n === 0 ? [] : [false, true]

export const nat: Source<Nat> = n => [n]

export const int: Source<number> = n => [n, -n]

export const bigint: Source<bigint> = map(int, BigInt)

export const float: Source<number> = n => n === 0 ? [0, -0] : n === 1 ? [1, -1] : withNegatives(2 ** (n - 1))

export const number: Source<number> = n => n === 0 ? [0, -1, NaN, Infinity, -Infinity] : n === 1 ? [-1, 1] : withNegatives(2 ** (n - 1))

const withNegatives = (x: number, y = 1 / x): [number, number, number, number] => [x, y, -x, -y]

export const defaultChars = 'abcdefghijklmnopqrstuvwxyz'

export const char = (chars: string = defaultChars): Source<string> =>
  n => chars.slice(0, n + 1).split('')

export const string = (chars: string = defaultChars): Source<string> =>
  n => [chars.slice(0, n)]

export const date = (origin: Date, offset: Source<number> = int): Source<Date> =>
  map(offset, t => new Date(origin.getTime() + t))

// Products

export const array = <A>(s: Source<A>): Source<readonly A[]> =>
  n => n === 0 ? [[]] : cartesian(Array(n).fill(s(n - 1)))

export type TupleOf<Sources extends readonly Source<any>[]> = Source<Values<Sources>>

export const tuple = <SS extends readonly Source<any>[]>(...sources: SS): TupleOf<SS> =>
  n => n === 0 ? [[]] as any : unsafeTuple(n - 1, sources)

const unsafeTuple = <SS extends readonly Source<any>[]>(n: Nat, sources: SS): Values<SS> =>
  cartesian(sources.map(s => s(n))) as unknown as Values<SS>

export type RecordOf<Sources extends Record<PropertyKey, Source<any>>> = {
  [K in keyof Sources]: Value<Sources[K]>
}
export type RecordsOf<Sources extends Record<PropertyKey, Source<any>>> = Source<RecordOf<Sources>>

export const record = <SS extends Record<PropertyKey, Source<any>>>(rs: SS): RecordsOf<SS> => {
  const ks = Object.keys(rs) as readonly (keyof SS)[]
  return filterDepth(n => n > 0, map(tuple(...Object.values(rs)), t => {
    const r = {} as RecordOf<SS>
    for (let i = 0; i < ks.length; i++) r[ks[i]] = t[i]
    return r
  }))
}

// Coproducts

export type OneOf<Sources extends readonly Source<any>[]> = Source<Values<Sources>[number]>

export const oneof = <SS extends readonly Source<any>[]>(...sources: SS): OneOf<SS> =>
  n => chain(sources, s => s(n))
