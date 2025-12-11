import { z, type ZodDiscriminatedUnion, ZodObject, type ZodRawShape, type ZodString } from 'zod';

/**
 * Wraps a Zod object schema and returns a new schema with a required string 'uid' field added.
 */
export function withRequiredUid<T extends ZodRawShape>(
  schema: ZodObject<T>
): ZodObject<T & { uid: ZodString }>;

/**
 * Wraps a Zod discriminated union schema and returns a new schema with a required string 'uid' field added to each option.
 */
export function withRequiredUid<
  Options extends readonly [ZodObject, ...ZodObject[]],
  Discriminator extends string,
>(
  schema: ZodDiscriminatedUnion<Options, Discriminator>
): ZodDiscriminatedUnion<
  { [K in keyof Options]: ZodObject<Options[K]['shape'] & { uid: ZodString }> },
  Discriminator
>;

export function withRequiredUid<
  Options extends readonly [ZodObject, ...ZodObject[]],
  Discriminator extends string,
  Obj extends ZodRawShape,
  T extends ZodDiscriminatedUnion<Options, Discriminator> | ZodObject<Obj>,
>(schema: T) {
  if (schema instanceof ZodObject) {
    return schema.extend({
      uid: z.string(),
    }) as ZodObject<Obj & { uid: ZodString }>;
  }

  // Handle discriminated union
  const options = schema.def.options.map((option) => option.extend({ uid: z.string() }));

  return z.discriminatedUnion(
    schema.def.discriminator,
    options as [
      ZodObject<Options[number]['shape'] & { uid: ZodString }>,
      ...[ZodObject<Options[number]['shape'] & { uid: ZodString }>],
    ]
  ) as ZodDiscriminatedUnion<
    { [K in keyof Options]: ZodObject<Options[K]['shape'] & { uid: ZodString }> },
    Discriminator
  >;
}
