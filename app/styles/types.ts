export * from './classname/spacing.js';
export * from './classname/colors.js';
export * from './classname/font.js';
export * from './classname/layout.js';

export type Overflow = 'auto' | 'hidden' | 'scroll' | 'visible';

// Display
export type Display =
  | 'flex'
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'hidden';

export type Fraction =
  | '1/2'
  | '1/3'
  | '2/3'
  | '1/4'
  | '3/4'
  | '1/5'
  | '2/5'
  | '3/5'
  | '4/5'
  | '1/6'
  | '5/6';

type RemIncrements =
  | 0.25
  | 0.5
  | 0.75
  | 1
  | 1.5
  | 2
  | 3
  | 4
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | 28
  | 32
  | 40
  | 48
  | 56;
export type Rem = `${RemIncrements}rem`;

type PxIncrements = 1 | 2 | 4 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;
export type Px = `${PxIncrements}px`;
