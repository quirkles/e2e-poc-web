import { z, type ZodType } from 'zod';

import type { Note } from '~/types/Notes/Note';
import { firebaseTimestamp } from '~/types/schema.utils';
import { withRequiredUid } from '~/utils/schema.utils';

export const noteSchema = z.object({
  authorId: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: firebaseTimestamp(),
  updatedAt: firebaseTimestamp().nullable(),
  deletedAt: firebaseTimestamp().nullable(),
}) satisfies ZodType<Note>;

export const noteWithUidSchema = withRequiredUid(noteSchema);
