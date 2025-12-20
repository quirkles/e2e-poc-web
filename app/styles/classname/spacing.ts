// Spacing & Layout
import type { Percent, Rem } from '~/styles';

export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type SpacingRem =
  | '0'
  | '0.25'
  | '0.5'
  | '0.75'
  | '1'
  | '1.25'
  | '1.5'
  | '1.75'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16'
  | '20';

export type DimensionRem = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;

export type BorderWidthPx = '0' | '1' | '2' | '4' | '8';
export type RingWidthPx = '0' | '1' | '2' | '4' | '8';
export type Dimension = 'full' | 'auto' | Percent<0 | 25 | 50 | 75 | 100> | Rem<DimensionRem>;
export type Outline = 'none';
export type Cursor = 'not-allowed' | 'pointer' | 'default';

export const BORDER_RADIUS_MAP: Record<BorderRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

export const PADDING_X_MAP: Record<SpacingRem, string> = {
  '0': 'px-0',
  '0.25': 'px-0.25',
  '0.5': 'px-0.5',
  '0.75': 'px-0.75',
  '1': 'px-1',
  '1.25': 'px-1.25',
  '1.5': 'px-1.5',
  '1.75': 'px-1.75',
  '2': 'px-2',
  '2.5': 'px-2.5',
  '3': 'px-3',
  '3.5': 'px-3.5',
  '4': 'px-4',
  '5': 'px-5',
  '6': 'px-6',
  '8': 'px-8',
  '10': 'px-10',
  '12': 'px-12',
  '16': 'px-16',
  '20': 'px-20',
};

export const PADDING_Y_MAP: Record<SpacingRem, string> = {
  '0': 'py-0',
  '0.25': 'py-0.25',
  '0.5': 'py-0.5',
  '0.75': 'py-0.75',
  '1': 'py-1',
  '1.25': 'py-1.25',
  '1.5': 'py-1.5',
  '1.75': 'py-1.75',
  '2': 'py-2',
  '2.5': 'py-2.5',
  '3': 'py-3',
  '3.5': 'py-3.5',
  '4': 'py-4',
  '5': 'py-5',
  '6': 'py-6',
  '8': 'py-8',
  '10': 'py-10',
  '12': 'py-12',
  '16': 'py-16',
  '20': 'py-20',
};

export const BORDER_WIDTH_MAP: Record<BorderWidthPx, string> = {
  '0': 'border-0',
  '1': 'border',
  '2': 'border-2',
  '4': 'border-4',
  '8': 'border-8',
};

export const RING_WIDTH_MAP: Record<RingWidthPx, string> = {
  '0': 'ring-0',
  '1': 'ring-1',
  '2': 'ring-2',
  '4': 'ring-4',
  '8': 'ring-8',
};

export const HEIGHT_MAP: Record<Dimension, string> = {
  '0%': 'h-0',
  '25%': 'h-1/4',
  '50%': 'h-1/2',
  '75%': 'h-3/4',
  '100%': 'h-full',
  '1rem': 'h-4',
  '2rem': 'h-8',
  '3rem': 'h-12',
  '4rem': 'h-16',
  '5rem': 'h-20',
  '6rem': 'h-24',
  '8rem': 'h-32',
  '10rem': 'h-40',
  '12rem': 'h-48',
  '16rem': 'h-64',
  '20rem': 'h-80',
  auto: 'h-auto',
  full: 'h-full',
};

export const WIDTH_MAP: Record<Dimension, string> = {
  '0%': 'w-0',
  '25%': 'w-1/4',
  '50%': 'w-1/2',
  '75%': 'w-3/4',
  '100%': 'w-full',
  '1rem': 'w-4',
  '2rem': 'w-8',
  '3rem': 'w-12',
  '4rem': 'w-16',
  '5rem': 'w-20',
  '6rem': 'w-24',
  '8rem': 'w-32',
  '10rem': 'w-40',
  '12rem': 'w-48',
  '16rem': 'w-64',
  '20rem': 'w-80',
  auto: 'w-auto',
  full: 'w-full',
};

export const OUTLINE_MAP: Record<Outline, string> = {
  none: 'outline-none',
};

export const CURSOR_MAP: Record<Cursor, string> = {
  'not-allowed': 'disabled:cursor-not-allowed',
  pointer: 'cursor-pointer',
  default: 'cursor-default',
};
