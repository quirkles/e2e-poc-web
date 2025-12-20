import { z } from 'zod';

import type { Tag, TagWithUid } from '~/types/Tags/Tag';
import { withRequiredUid } from '~/utils/schema.utils';

export const tagSchema = z.object({
  userUid: z.string(),
  content: z.string(),
  normalizedContent: z.string(),
  belongsTo: z.array(z.string()),
}) satisfies z.ZodType<Tag>;

export type TagSchema = z.infer<typeof tagSchema>;

export const tagWithUidSchema = withRequiredUid(tagSchema) satisfies z.ZodType<TagWithUid>;

export type TagWithUidSchema = z.infer<typeof tagWithUidSchema>;

export const createTagSchema = tagSchema.omit({ normalizedContent: true });

export type CreateTagSchema = z.infer<typeof createTagSchema>;
