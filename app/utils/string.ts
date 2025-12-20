export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
