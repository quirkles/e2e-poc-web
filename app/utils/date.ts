// Convert a dat to a string in the format expected by the input
//  eg: 2025-12-18T18:46
export function dateToInputFormat(date: Date): string {
  return date.toISOString().slice(0, 16);
}