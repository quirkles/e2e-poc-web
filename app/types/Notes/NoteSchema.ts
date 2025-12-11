import { z, type ZodType } from 'zod';

import type { Note, NoteWithUid } from '~/types/Notes/Note';
import { NoteTypes } from '~/types/Notes/Note';
import { firebaseTimestamp } from '~/types/schema.utils';
import { withRequiredUid } from '~/utils/schema.utils';

const baseSchema = z.object({
  authorId: z.string(),
  title: z.string(),
  content: z.string().optional(),
  createdAt: firebaseTimestamp(),
  updatedAt: firebaseTimestamp().nullable(),
  deletedAt: firebaseTimestamp().nullable(),
});

const todoNoteSchema = baseSchema.extend({
  type: z.literal(NoteTypes.TODO),
  done: z.boolean(),
  dueDate: firebaseTimestamp().nullable(),
  completedAt: firebaseTimestamp().nullable(),
});

const textNoteSchema = baseSchema.extend({
  type: z.literal(NoteTypes.TEXT),
});

const reminderNoteSchema = baseSchema.extend({
  type: z.literal(NoteTypes.REMINDER),
  reminderAt: firebaseTimestamp(),
});

const imageNoteSchema = baseSchema.extend({
  type: z.literal(NoteTypes.IMAGE),
  imageUrl: z.string(),
});

const bookmarkNoteSchema = baseSchema.extend({
  type: z.literal(NoteTypes.BOOKMARK),
  url: z.string(),
});

const checklistNoteSchema = baseSchema.extend({
  type: z.literal(NoteTypes.CHECKLIST),
  items: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      done: z.boolean(),
    })
  ),
});

export const noteSchema = z.discriminatedUnion('type', [
  todoNoteSchema,
  textNoteSchema,
  reminderNoteSchema,
  imageNoteSchema,
  bookmarkNoteSchema,
  checklistNoteSchema,
]) satisfies ZodType<Note>;

export const noteWithUidSchema = withRequiredUid(noteSchema) satisfies ZodType<NoteWithUid>;
