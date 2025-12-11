export default function toKeyMirror<T extends readonly string[]>(keys: T): { [K in T[number]]: K } {
  return keys.reduce(
    (acc: { [K in T[number]]: K }, key: string) => {
      acc[key as T[number]] = key;
      return acc;
    },
    {} as { [K in T[number]]: K }
  );
}
