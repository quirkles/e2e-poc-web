export function errorFromCatch(e: unknown, msg = 'Unknown Error'): Error {
  if (e instanceof Error) {
    return e;
  }
  if (typeof e === 'string') {
    return new Error(e);
  }
  return new Error(msg);
}
