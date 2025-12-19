export type * from './classname/spacing.js';
export type * from './classname/colors.js';
export type * from './classname/font.js';
export type * from './classname/layout.js';

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

// Custom
type PercentIncrements = 0 | 5 | 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 100;
export type Percent<PercentOpts extends PercentIncrements = PercentIncrements> = `${PercentOpts}%`;
export type Rem<RemOpts extends number> = `${RemOpts}rem`;
