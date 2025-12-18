import { ZodError } from 'zod';

export class NotFoundError extends Error {}

export class ValidationError extends Error {
  constructor(error: Error | ZodError | string) {
    const message =
      error instanceof ZodError
        ? error.issues
            .map((err) => {
              const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
              return `${path}${err.message}`;
            })
            .join(', ')
        : error instanceof Error
          ? error.message
          : error;
    super(message);
  }
}
