import { Property, Result } from './property'
import { Nat, Source } from './source'

export type TestBounds = { minDepth: Nat, maxDepth: Nat, maxExamples: number }

export const defaultTestBounds: TestBounds = {
  minDepth: parseInt(process?.env?.SMALLS_MIN_DEPTH ?? '') || 0,
  maxDepth: parseInt(process?.env?.SMALLS_MAX_DEPTH ?? '') || 5,
  maxExamples: parseInt(process?.env?.SMALLS_MAX_EXAMPLES ?? '', 10) || 100
}

export type Counterexample<A> = Result<A, false>

export const isCounterexample = <A>(r: Result<A, boolean>): r is Counterexample<A> =>
  r.result === false

export const check = <A>(p: Property<A, boolean>, { maxExamples, minDepth, maxDepth }: TestBounds = defaultTestBounds): Counterexample<A> | undefined => {
  let n = minDepth, examples = 0
  while (examples < maxExamples && n < maxDepth) {
    const rs = p(n)
    for (const ri of rs) if (isCounterexample(ri)) return ri
    examples += rs.length
    n += 1
  }
}

export class CounterexampleError<A> extends Error {
  constructor(public readonly counterexample: Counterexample<A>, public readonly bounds: TestBounds, message?: string) {
    super(message)
  }
}

export const assert = <A>(p: Property<A, boolean>, b: TestBounds = defaultTestBounds): void => {
  const ri = check(p, b)
  if (ri) throw new CounterexampleError(ri, b, `Counterexample: ${ri.input} -> ${ri.result}`)
}

export function* sample<A>(s: Source<A>, { minDepth, maxDepth, maxExamples } = defaultTestBounds): Iterable<A> {
  let i = 0
  let n = minDepth
  while (i < maxExamples && n < maxDepth) {
    const rs = s(n)
    yield* rs
    i += rs.length
    n += 1
  }
}
