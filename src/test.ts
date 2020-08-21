import { Property, Result } from './property'
import { Nat, Source } from './source'

export type TestConfig<N> = {
  minDepth: N,
  maxDepth: N,
  maxExamples: number,
  evaluateResult: <A, R>(r: Result<N, A, R>, i: number) => void
}

export const defaultTestConfig: TestConfig<Nat> = {
  minDepth: parseInt(process?.env?.SMALLS_MIN_DEPTH ?? '') || 0,
  maxDepth: parseInt(process?.env?.SMALLS_MAX_DEPTH ?? '') || 4,
  maxExamples: parseInt(process?.env?.SMALLS_MAX_EXAMPLES ?? '', 10) || 100,
  evaluateResult: <N, A, R>(r: Result<N, A, R>, i: number): void => {
    if (!r.ok) throw new Error(`Counterexample (tries: ${i + 1}, depth: ${r.depth})
      ${JSON.stringify(r.input)} -> result: ${JSON.stringify(r.result)}`)
  }
}

export const assert = <A, R>(p: Property<Nat, A, R>, { maxExamples, minDepth: startDepth, maxDepth, evaluateResult }: TestConfig<Nat> = defaultTestConfig): void => {
  let n = startDepth, examples = 0
  while (examples < maxExamples && n < maxDepth) {
    const rs = p(n)
    rs.forEach((r, i) => evaluateResult(r, examples + i))
    examples += rs.length
    n += 1
  }
}

export const enumerate = <A>(s: Source<Nat, A>, { maxExamples, minDepth: startDepth, maxDepth, evaluateResult }: TestConfig<Nat> = defaultTestConfig): readonly A[] => {
  const results = []
  let n = startDepth
  while (results.length < maxExamples && n < maxDepth) {
    results.push(...s(n))
    n += 1
  }
  return results
}

export const show = <A>(s: Source<Nat, A>, config: TestConfig<Nat> = defaultTestConfig): string =>
  enumerate(s, config).map(s => `(${s})`).join(', ')
