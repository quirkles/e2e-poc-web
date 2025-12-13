import type { Timestamp } from '@firebase/firestore';

import type { WithUid } from '~/types/utils';
import toKeyMirror from '~/utils/array';

export const NoteTypes = toKeyMirror([
  'TODO',
  'TEXT',
  'REMINDER',
  'IMAGE',
  'BOOKMARK',
  'CHECKLIST',
] as const);

type NoteType = keyof typeof NoteTypes;

interface Base {
  type: NoteType;
  authorId: string;
  createdAt: Timestamp;

  updatedAt: Timestamp | null;
  deletedAt: Timestamp | null;

  title: string;
  content: string | null;
}

type TodoNote = Base & {
  type: typeof NoteTypes.TODO;
  done: boolean;
  dueDate: Timestamp | null;
  completedAt: Timestamp | null;
};

type TextNote = Base & {
  type: typeof NoteTypes.TEXT;
};

type ReminderNote = Base & {
  type: typeof NoteTypes.REMINDER;
  reminderAt: Timestamp;
};

type ImageNote = Base & {
  type: typeof NoteTypes.IMAGE;
  imageUrl: string;
};

type BookmarkNote = Base & {
  type: typeof NoteTypes.BOOKMARK;
  url: string;
};

type ChecklistNote = Base & {
  type: typeof NoteTypes.CHECKLIST;
  items: {
    id: string;
    text: string;
    done: boolean;
  }[];
};

export type Note = TodoNote | TextNote | ReminderNote | ImageNote | BookmarkNote | ChecklistNote;

export type CreateNotePayload = Omit<Note, 'authorId' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type NoteWithUid = WithUid<Note>;
