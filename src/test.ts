import { inspect } from 'util'

import { prop, Property } from './property'
import { Nat, Source, Sources, Values } from './source'

export type TestConfig<N> = {
  minDepth: N,
  maxDepth: N,
  maxExamples: number
}

export const defaultTestConfig: TestConfig<Nat> = {
  minDepth: parseInt(process?.env?.SMALLS_MIN_DEPTH ?? '') || 0,
  maxDepth: parseInt(process?.env?.SMALLS_MAX_DEPTH ?? '') || 5,
  maxExamples: parseInt(process?.env?.SMALLS_MAX_EXAMPLES ?? '', 10) || 100
}

export const check = <A>(p: Property<Nat, A, boolean>, { maxExamples, minDepth, maxDepth }: TestConfig<Nat> = defaultTestConfig): void => {
  let n = minDepth, examples = 0
  while (examples < maxExamples && n < maxDepth) {
    const rs = p(n)
    const ri = rs.find(r => !r.result)
    if (ri) throw new Error(`Counterexample: ${ri.input} -> ${ri.result}`)
    examples += rs.length
    n += 1
  }
}

export function* sample<A>(s: Source<Nat, A>, { minDepth, maxDepth, maxExamples } = defaultTestConfig): Iterable<A> {
  let i = 0
  let n = minDepth
  while (i < maxExamples && n < maxDepth) {
    const rs = s(n)
    yield* rs
    i += rs.length
    n += 1
  }
}

export const collect = <A>(s: Source<Nat, A>, c: TestConfig<Nat> = defaultTestConfig): readonly A[] => {
  const results = []
  for (const r of sample(s, c)) results.push(r)
  return results
}

export const show = <A>(s: Source<Nat, A>, c: TestConfig<Nat> = defaultTestConfig): string =>
  collect(s, c).map(s => `(${inspect(s)})`).join(' ')
