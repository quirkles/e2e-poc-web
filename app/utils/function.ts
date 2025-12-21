export function memoize<T extends (...args: never[]) => unknown>(
  fn: T,
  getCacheKey: (args: Parameters<T>) => string
) {
  const cache = new Map<string, ReturnType<T>>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const cacheKey = getCacheKey(args);
    if (cache.has(cacheKey)) {
      const result = cache.get(cacheKey);
      if (result) {
        return result;
      }
    }
    const result: ReturnType<T> = fn(...args) as ReturnType<T>;
    cache.set(cacheKey, result);
    return result;
  };
}
