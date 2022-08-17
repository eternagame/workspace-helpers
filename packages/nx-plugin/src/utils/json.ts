type RecordKey = string | number | symbol;

/**
 * Given a variable of an unknown type, check if it's an object that contains a particular key
 *
 * @param k The key to check for in o
 * @param o The variable to check for k in
 */
export function inOperator<K extends RecordKey, T>(
  k: K,
  o: T,
): o is T & Record<K, unknown> {
  return o && typeof o === 'object' && k in o;
}

/**
 * Given a variable of an unknown type, check if it's an object that contains a particular key.
 * If it does, return it. Otherwise, return a default value.
 *
 * @param o The variable to check for k in
 * @param defaultValue The default value to return if k is not in o
 * @param key The key to check for in o
 */
export function getValue(
  o: unknown,
  defaultValue: unknown,
  key: string
): unknown;
/**
 * Given a variable of an unknown type, check if it's an object that contains a particular key.
 * If it does, return it. Otherwise, return a default value.
 *
 * @param o The variable to check for k in
 * @param defaultValue The default value to return if k is not in o
 * @param keys A chain of keys to check for in o (eg, (o, null, 'foo', 'bar') will check for
 *  o.foo.bar)
 */
export function getValue(
  o: unknown,
  defaultValue: unknown,
  ...keys: [RecordKey, ...RecordKey[]]
): unknown;
export function getValue(
  o: unknown,
  defaultValue: unknown,
  ...keys: [RecordKey, ...RecordKey[]]
): unknown {
  let currVal = o;
  for (const key of keys) {
    if (!inOperator(key, currVal)) return defaultValue;
    currVal = currVal[key];
  }
  return defaultValue;
}

/**
 * Given an item that may or may not be in a const array, determine whether it
 * is indeed one of the items in that array, changing the type accordingly
 *
 * @param x The value to check arr for
 * @param arr The array to check for x in
 */
export function isArrayMember<T, U extends T>(
  x: T,
  arr: readonly U[],
): x is typeof arr[number] {
  return arr.includes(x as U);
}

/**
 * Determines whether the parameter is a string-keyed Record
 *
 * @param o The possibly-record to check
 * @returns Whether or not o is a string-keyed  Record
 */
export function isRecord(o: unknown): o is Record<string, unknown> {
  return typeof o === 'object' && o !== null && Object.keys(o).every((k) => typeof k === 'string');
}

/**
 * Check if an object appears at a key of another object. If it does not, create an empty object
 * at that key. Return either the existing or new object
 *
 * @param o The object to check for an object value
 * @param k The key where the object value should be
 * @returns The existing object if it already exists, the new object if it doesn't, or null if
 *  the key exists but the value is not an object
 */
export function maybeInitObject<K extends string>(
  o: Record<string, unknown>,
  k: K,
): Record<string, unknown> | null {
  if (k in o) {
    const value = o[k];
    if (isRecord(value)) {
      return value;
    }
    return null;
  }
  const newObject = {};
  // eslint-disable-next-line no-param-reassign
  o[k] = newObject;
  return newObject;
}
