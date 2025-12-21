export function toKeyMirror<T extends readonly string[]>(keys: T): { [K in T[number]]: K } {
  return keys.reduce(
    (acc: { [K in T[number]]: K }, key: string) => {
      acc[key as T[number]] = key;
      return acc;
    },
    {} as { [K in T[number]]: K }
  );
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function uniqueWith<T>(arr: T[], toComparable: (a: T) => string | number): T[] {
  const seen = new Set<string | number>();
  return arr.reduce((toReturn: T[], item: T) => {
    const comparable = toComparable(item);
    if (!seen.has(comparable)) {
      seen.add(comparable);
      toReturn.push(item);
    }
    return toReturn;
  }, []);
}

export function uniqueConcat<T>(...arrs: T[][]): T[] {
  return unique(arrs.flat());
}
