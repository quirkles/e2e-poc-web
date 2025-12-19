import type { ReactNode } from 'react';

export function NoteContainer({ children }: { children: ReactNode }) {
  return <div className="border rounded-lg p-4 shadow-sm bg-white relative">{children}</div>;
}
