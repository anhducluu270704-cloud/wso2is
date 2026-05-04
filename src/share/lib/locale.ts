
export function pickLocales<
  const Base extends string,
  T extends Record<`${Base}Vi`, string> & Record<`${Base}En`, string>,
>(node: T, base: Base, isVi: boolean): string {
  const viKey = `${base}Vi` as keyof T
  const enKey = `${base}En` as keyof T
  return isVi ? (node[viKey] as string) : (node[enKey] as string)
}
