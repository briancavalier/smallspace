// Cartesian product helper
export const cartesian = <Args extends readonly (readonly unknown[])[]>(args: Args): readonly Args[number][number][][] => {
  const r = [] as Args[number][number][][]
  function helper(max: number, r: Args[number][number][][], arr: Args[number][number][][], i: number) {
    for (let j = 0, l = args[i].length; j < l; j++) {
      const a = arr.slice(0) // clone arr
      a.push(args[i][j] as Args[number][number][])
      if (i === max)
        r.push(a)
      else
        helper(max, r, a, i + 1)
    }
  }
  helper(args.length - 1, r, [], 0)
  return r
}
