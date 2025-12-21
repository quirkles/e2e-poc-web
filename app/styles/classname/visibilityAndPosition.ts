import type { Overflow } from '../types.js';

export const OVERFLOW_MAP: Record<Overflow, string> = {
  auto: 'overflow-auto',
  hidden: 'overflow-hidden',
  scroll: 'overflow-scroll',
  visible: 'overflow-visible',
};
