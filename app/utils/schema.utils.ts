import { z, type ZodObject, type ZodRawShape, type ZodString } from 'zod';

/**
 * Wraps a Zod object schema and returns a new schema with a required string 'uid' field added.
 */
export function withRequiredUid<T extends ZodRawShape>(
  schema: ZodObject<T>
): ZodObject<T & { uid: ZodString }> {
  return schema.extend({
    uid: z.string(),
  }) as ZodObject<T & { uid: ZodString }>;
}
