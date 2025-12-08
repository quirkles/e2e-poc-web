import { z, type ZodType } from 'zod';

import type { Note } from '~/types/Notes/Note';
import { firebaseTimestamp } from '~/types/schema.utils';

export const noteSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: firebaseTimestamp(),
  updatedAt: firebaseTimestamp().optional(),
  deletedAt: firebaseTimestamp().optional(),
}) satisfies ZodType<Note>;
