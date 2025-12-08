import type { Timestamp } from '@firebase/firestore';

import type { WithUid } from '~/types/utils';

export interface Note {
  authorId: string;
  createdAt: Timestamp;

  updatedAt?: Timestamp;
  deleteAt?: Timestamp;

  title: string;
  content?: string;
}

export type CreateNotePayload = Omit<Note, 'authorId' | 'createdAt' | 'updatedAt' | 'deleteAt'>;

export type NoteWithUid = WithUid<Note>;
