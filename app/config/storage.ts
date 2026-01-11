/**
 * Firebase Storage configuration
 */
export const storageConfig = {
  /**
   * The Firebase Storage bucket URL.
   * Uses the VITE_FIREBASE_STORAGE_BUCKET env variable if set,
   * otherwise falls back to the default bucket.
   */
  bucket:
    (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || 'e2e-poc-web.firebasestorage.app',
} as const;
