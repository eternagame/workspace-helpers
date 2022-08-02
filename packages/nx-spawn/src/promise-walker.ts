/**
 * Wrap an array of promises so that you can wait for each promise to complete,
 * handling them one at a time as they finish
 */
export default class PromiseWalker<T> {
  /**
   * Register some promises to be included in the set that's being walked through
   *
   * @param promises
   */
  add(...promises: Promise<T>[]) {
    this._promises.push(...promises);
  }

  /**
   * Wait for one of the registered promises to complete then de-register it so that
   * the next time this function is run, we get the next completed promise
   *
   * @returns The result of the completed promise
   */
  async next(): Promise<T> {
    const wrapper = await Promise.race(
      this._promises.map(async (promise) => {
        const result = await promise;
        return { promise, result };
      })
    );
    this._promises.splice(this._promises.indexOf(wrapper.promise));
    return wrapper.result;
  }

  /** The number of promises left to complete */
  get length(): number {
    return this._promises.length;
  }

  /** The promises left to complete */
  private _promises: Promise<T>[] = [];
}
