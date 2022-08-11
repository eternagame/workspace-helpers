/**
 * Given an object of an unknown type, check if it's an object that contains a particular key
 */
export function inOperator<K extends string, T>(
  k: K,
  o: T,
): o is T & Record<K, unknown> {
  return o && typeof o === 'object' && k in o;
}

/**
 * Given an item that may or may not be in a const array, determine whether it
 * is indeed one of the items in that array, changing the type accordingly
 */
export function isArrayMember<T, U extends T>(
  x: T,
  arr: readonly U[],
): x is typeof arr[number] {
  return arr.includes(x as U);
}
