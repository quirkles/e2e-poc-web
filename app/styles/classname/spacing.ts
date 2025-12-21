// Spacing & Layout
import type { Fraction, Px, Rem } from '~/styles';

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
export type Dimension = 'full' | 'auto' | Fraction | Rem | Px;
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
  '1/2': 'h-[1/2]',
  '1/3': 'h-[1/3]',
  '1/4': 'h-[1/4]',
  '1/5': 'h-[1/5]',
  '1/6': 'h-[1/6]',
  '2/3': 'h-[2/3]',
  '2/5': 'h-[2/5]',
  '3/4': 'h-[3/4]',
  '3/5': 'h-[3/5]',
  '4/5': 'h-[4/5]',
  '5/6': 'h-[5/6]',
  '0.25rem': 'h-[0.25rem]',
  '0.5rem': 'h-[0.5rem]',
  '0.75rem': 'h-[0.75rem]',
  '1.5rem': 'h-[1.5rem]',
  '1px': 'h-[1px]',
  '24rem': 'h-[24rem]',
  '28rem': 'h-[28rem]',
  '32rem': 'h-[32rem]',
  '40rem': 'h-[40rem]',
  '48rem': 'h-[48rem]',
  '56rem': 'h-[56rem]',
  '1rem': 'h-[1rem]',
  '2rem': 'h-[2rem]',
  '3rem': 'h-[3rem]',
  '4rem': 'h-[4rem]',
  '6rem': 'h-[6rem]',
  '8rem': 'h-[8rem]',
  '10rem': 'h-[10rem]',
  '12rem': 'h-[12rem]',
  '16rem': 'h-[16rem]',
  '20rem': 'h-[20rem]',
  '2px': 'h-[2px]',
  '4px': 'h-[4px]',
  '8px': 'h-[8px]',
  '10px': 'h-[10px]',
  '12px': 'h-[12px]',
  '16px': 'h-[16px]',
  '20px': 'h-[20px]',
  '24px': 'h-[24px]',
  '32px': 'h-[32px]',
  '40px': 'h-[40px]',
  '48px': 'h-[48px]',
  '56px': 'h-[56px]',
  '64px': 'h-[64px]',
  auto: 'h-auto',
  full: 'h-full',
};

export const WIDTH_MAP: Record<Dimension, string> = {
  '0.25rem': 'w-[0.25rem]',
  '0.5rem': 'w-[0.5rem]',
  '0.75rem': 'w-[0.75rem]',
  '1.5rem': 'w-[1.5rem]',
  '1px': 'w-[1px]',
  '24rem': 'w-[24rem]',
  '28rem': 'w-[28rem]',
  '32rem': 'w-[32rem]',
  '40rem': 'w-[40rem]',
  '48rem': 'w-[48rem]',
  '56rem': 'w-[56rem]',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '1/4': 'w-1/4',
  '1/5': 'w-1/5',
  '1/6': 'w-1/6',
  '2/3': 'w-2/3',
  '2/5': 'w-2/5',
  '3/4': 'w-3/4',
  '3/5': 'w-3/5',
  '4/5': 'w-4/5',
  '5/6': 'w-5/6',
  '1rem': 'w-[1rem]',
  '2rem': 'w-[2rem]',
  '3rem': 'w-[3rem]',
  '4rem': 'w-[4rem]',
  '6rem': 'w-[6rem]',
  '8rem': 'w-[8rem]',
  '10rem': 'w-[10rem]',
  '12rem': 'w-[12rem]',
  '16rem': 'w-[16rem]',
  '20rem': 'w-[20rem]',
  '2px': 'w-[2px]',
  '4px': 'w-[4px]',
  '8px': 'w-[8px]',
  '10px': 'w-[10px]',
  '12px': 'w-[12px]',
  '16px': 'w-[16px]',
  '20px': 'w-[20px]',
  '24px': 'w-[24px]',
  '32px': 'w-[32px]',
  '40px': 'w-[40px]',
  '48px': 'w-[48px]',
  '56px': 'w-[56px]',
  '64px': 'w-[64px]',
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
