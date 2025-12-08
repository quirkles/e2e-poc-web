// Map of the breakpoints and the corresponding min screen width in pixels

export const breakPoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakPoint = keyof typeof breakPoints;
