import { format } from 'date-fns';

// Convert a date to a string in the format expected by the input
//  eg: 2025-12-18T18:46
export function dateToInputFormat(date: Date | undefined): string {
  if (!date) {
    return '';
  }
  return format(date, "yyyy-MM-dd'T'HH:mm");
}
