export function inOperator<K extends string, T>(
  k: K,
  o: T
): o is T & Record<K, unknown> {
  return o && typeof o === 'object' && k in o;
}

export function isArrayMember<T, U extends T>(
  x: T,
  arr: readonly U[]
): x is typeof arr[number] {
  return arr.includes(x as U);
}
