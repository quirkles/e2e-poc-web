// Typography
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type TextDecoration = 'none' | 'underline' | 'line-through';
export type FontStyle = 'normal' | 'italic';
export type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export const FONT_SIZE_MAP: Record<FontSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const TEXT_DECORATION_MAP: Record<TextDecoration, string> = {
  none: 'no-underline',
  underline: 'underline',
  'line-through': 'line-through',
};

export const FONT_STYLE_MAP: Record<FontStyle, string> = {
  normal: 'not-italic',
  italic: 'italic',
};

export const TEXT_TRANSFORM_MAP: Record<TextTransform, string> = {
  none: 'normal-case',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
};

export const FONT_WEIGHT_MAP: Record<FontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

export const TEXT_ALIGN_MAP: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};
