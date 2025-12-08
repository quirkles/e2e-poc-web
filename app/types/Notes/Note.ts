import type { Timestamp } from '@firebase/firestore';

import type { WithUid } from '~/types/utils';

export interface Note {
  authorId: string;
  createdAt: Timestamp;

  updatedAt: Timestamp | null;
  deletedAt: Timestamp | null;

  title: string;
  content?: string;
}

export type CreateNotePayload = Omit<Note, 'authorId' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type NoteWithUid = WithUid<Note>;
