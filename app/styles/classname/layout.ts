export type Display =
  | 'flex'
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'hidden';

export type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

// Flex child properties
export type Flex = 'none' | 'auto' | '1' | 'initial';
export type FlexGrow = 0 | 1 | 2;
export type FlexShrink = 0 | 1 | 2;
export type FlexBasis = 'auto' | 'full' | 'half';
export type AlignSelf = 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';

export const FLEX_DIRECTION_MAP: Record<FlexDirection, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
};

export const FLEX_JUSTIFY_MAP: Record<FlexJustify, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const FLEX_ALIGN_MAP: Record<FlexAlign, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

export const FLEX_WRAP_MAP: Record<FlexWrap, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

export const FLEX_GAP_MAP: Record<FlexGap, `gap-${Gap}`> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
};

export const DISPLAY_MAP: Record<Display, Display> = {
  flex: 'flex',
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline-block',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  hidden: 'hidden',
};

export const FLEX_MAP: Record<Flex, string> = {
  none: 'flex-none',
  auto: 'flex-auto',
  '1': 'flex-1',
  initial: 'flex-initial',
};

export const FLEX_GROW_MAP: Record<FlexGrow, string> = {
  0: 'grow-0',
  1: 'grow',
  2: 'grow-2',
};

export const FLEX_SHRINK_MAP: Record<FlexShrink, string> = {
  0: 'shrink-0',
  1: 'shrink',
  2: 'shrink-2',
};

export const FLEX_BASIS_MAP: Record<FlexBasis, string> = {
  auto: 'basis-auto',
  full: 'basis-full',
  half: 'basis-1/2',
};

export const ALIGN_SELF_MAP: Record<AlignSelf, string> = {
  auto: 'self-auto',
  start: 'self-start',
  end: 'self-end',
  center: 'self-center',
  stretch: 'self-stretch',
  baseline: 'self-baseline',
};
