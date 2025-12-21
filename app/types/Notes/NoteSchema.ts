import { type output, z, type ZodType } from 'zod';

import type { CreateNotePayload, Note, NoteWithUid } from '~/types/Notes/Note';
import { NoteTypes } from '~/types/Notes/Note';
import { firebaseTimestamp } from '~/types/schema.utils';
import { withRequiredUid } from '~/utils/schema.utils';

const baseSchema = z.object({
  authorUid: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  createdAt: firebaseTimestamp(),
  updatedAt: firebaseTimestamp().nullable(),
  deletedAt: firebaseTimestamp().nullable(),
  tagUids: z.array(z.string()),
});

const baseCreateSchema = baseSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const todoNoteSchema = {
  type: z.literal(NoteTypes.TODO),
  done: z.boolean(),
  dueDate: firebaseTimestamp().nullable(),
  completedAt: firebaseTimestamp().nullable(),
};

const textNoteSchema = {
  type: z.literal(NoteTypes.TEXT),
};

const reminderNoteSchema = {
  type: z.literal(NoteTypes.REMINDER),
  reminderAt: firebaseTimestamp(),
};

const imageNoteSchema = {
  type: z.literal(NoteTypes.IMAGE),
  imageUrl: z.string(),
};

const bookmarkNoteSchema = {
  type: z.literal(NoteTypes.BOOKMARK),
  url: z.string(),
};

const checklistNoteSchema = {
  type: z.literal(NoteTypes.CHECKLIST),
  items: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      done: z.boolean(),
    })
  ),
};

export const noteSchema = z.discriminatedUnion('type', [
  baseSchema.extend(todoNoteSchema),
  baseSchema.extend(textNoteSchema),
  baseSchema.extend(reminderNoteSchema),
  baseSchema.extend(imageNoteSchema),
  baseSchema.extend(bookmarkNoteSchema),
  baseSchema.extend(checklistNoteSchema),
]) satisfies ZodType<Note>;

export type NoteSchema = output<typeof noteSchema>;

export const createNoteSchema = z.discriminatedUnion('type', [
  baseCreateSchema.extend(todoNoteSchema),
  baseCreateSchema.extend(textNoteSchema),
  baseCreateSchema.extend(reminderNoteSchema),
  baseCreateSchema.extend(imageNoteSchema),
  baseCreateSchema.extend(bookmarkNoteSchema),
  baseCreateSchema.extend(checklistNoteSchema),
]) satisfies ZodType<CreateNotePayload>;

export type CreateNoteSchema = output<typeof createNoteSchema>;

export const noteWithUidSchema = withRequiredUid(noteSchema) satisfies ZodType<NoteWithUid>;

export type NoteWithUidSchema = output<typeof noteWithUidSchema>;
