import { type output, z } from 'zod';

import { firebaseTimestamp } from '~/types/schema.utils';
import { withRequiredUid } from '~/utils/schema.utils';

export const noteImageFileSchema = z.object({
  uploaderUid: z.string(),
  noteId: z.string(),
  downloadUrl: z.string(),
  filename: z.string(),
  createdAt: firebaseTimestamp(),
});

export type NoteImageFileSchema = output<typeof noteImageFileSchema>;

export const noteImageFileWithUidSchema = withRequiredUid(noteImageFileSchema);

export type NoteImageFileWithUidSchema = output<typeof noteImageFileWithUidSchema>;

export interface CreateNoteImageFile {
  uploaderUid: string;
  noteId: string;
  downloadUrl: string;
  filename: string;
}
