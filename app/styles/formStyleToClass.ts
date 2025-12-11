import type {
  BorderRadius,
  SpacingRem,
  FontSize,
  BorderWidthPx,
  RingWidthPx,
  Color,
} from './types.js';

// Complete class name maps
const BORDER_RADIUS_MAP: Record<BorderRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

const PADDING_X_MAP: Record<SpacingRem, string> = {
  '0': 'px-0',
  '0.5': 'px-0.5',
  '1': 'px-1',
  '1.5': 'px-1.5',
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

const PADDING_Y_MAP: Record<SpacingRem, string> = {
  '0': 'py-0',
  '0.5': 'py-0.5',
  '1': 'py-1',
  '1.5': 'py-1.5',
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

const FONT_SIZE_MAP: Record<FontSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

const BORDER_WIDTH_MAP: Record<BorderWidthPx, string> = {
  '0': 'border-0',
  '1': 'border',
  '2': 'border-2',
  '4': 'border-4',
  '8': 'border-8',
};

const RING_WIDTH_MAP: Record<RingWidthPx, string> = {
  '0': 'ring-0',
  '1': 'ring-1',
  '2': 'ring-2',
  '4': 'ring-4',
  '8': 'ring-8',
};

const BG_COLOR_MAP: Record<Color, string> = {
  white: 'bg-white',
  black: 'bg-black',
  'gray-50': 'bg-gray-50',
  'gray-100': 'bg-gray-100',
  'gray-200': 'bg-gray-200',
  'gray-300': 'bg-gray-300',
  'gray-400': 'bg-gray-400',
  'gray-500': 'bg-gray-500',
  'gray-600': 'bg-gray-600',
  'gray-700': 'bg-gray-700',
  'gray-800': 'bg-gray-800',
  'gray-900': 'bg-gray-900',
  'red-50': 'bg-red-50',
  'red-100': 'bg-red-100',
  'red-200': 'bg-red-200',
  'red-300': 'bg-red-300',
  'red-400': 'bg-red-400',
  'red-500': 'bg-red-500',
  'red-600': 'bg-red-600',
  'red-700': 'bg-red-700',
  'red-800': 'bg-red-800',
  'red-900': 'bg-red-900',
  'blue-50': 'bg-blue-50',
  'blue-100': 'bg-blue-100',
  'blue-200': 'bg-blue-200',
  'blue-300': 'bg-blue-300',
  'blue-400': 'bg-blue-400',
  'blue-500': 'bg-blue-500',
  'blue-600': 'bg-blue-600',
  'blue-700': 'bg-blue-700',
  'blue-800': 'bg-blue-800',
  'blue-900': 'bg-blue-900',
  'green-50': 'bg-green-50',
  'green-100': 'bg-green-100',
  'green-200': 'bg-green-200',
  'green-300': 'bg-green-300',
  'green-400': 'bg-green-400',
  'green-500': 'bg-green-500',
  'green-600': 'bg-green-600',
  'green-700': 'bg-green-700',
  'green-800': 'bg-green-800',
  'green-900': 'bg-green-900',
};

const TEXT_COLOR_MAP: Record<Color, string> = {
  white: 'text-white',
  black: 'text-black',
  'gray-50': 'text-gray-50',
  'gray-100': 'text-gray-100',
  'gray-200': 'text-gray-200',
  'gray-300': 'text-gray-300',
  'gray-400': 'text-gray-400',
  'gray-500': 'text-gray-500',
  'gray-600': 'text-gray-600',
  'gray-700': 'text-gray-700',
  'gray-800': 'text-gray-800',
  'gray-900': 'text-gray-900',
  'red-50': 'text-red-50',
  'red-100': 'text-red-100',
  'red-200': 'text-red-200',
  'red-300': 'text-red-300',
  'red-400': 'text-red-400',
  'red-500': 'text-red-500',
  'red-600': 'text-red-600',
  'red-700': 'text-red-700',
  'red-800': 'text-red-800',
  'red-900': 'text-red-900',
  'blue-50': 'text-blue-50',
  'blue-100': 'text-blue-100',
  'blue-200': 'text-blue-200',
  'blue-300': 'text-blue-300',
  'blue-400': 'text-blue-400',
  'blue-500': 'text-blue-500',
  'blue-600': 'text-blue-600',
  'blue-700': 'text-blue-700',
  'blue-800': 'text-blue-800',
  'blue-900': 'text-blue-900',
  'green-50': 'text-green-50',
  'green-100': 'text-green-100',
  'green-200': 'text-green-200',
  'green-300': 'text-green-300',
  'green-400': 'text-green-400',
  'green-500': 'text-green-500',
  'green-600': 'text-green-600',
  'green-700': 'text-green-700',
  'green-800': 'text-green-800',
  'green-900': 'text-green-900',
};

const BORDER_COLOR_MAP: Record<Color, string> = {
  white: 'border-white',
  black: 'border-black',
  'gray-50': 'border-gray-50',
  'gray-100': 'border-gray-100',
  'gray-200': 'border-gray-200',
  'gray-300': 'border-gray-300',
  'gray-400': 'border-gray-400',
  'gray-500': 'border-gray-500',
  'gray-600': 'border-gray-600',
  'gray-700': 'border-gray-700',
  'gray-800': 'border-gray-800',
  'gray-900': 'border-gray-900',
  'red-50': 'border-red-50',
  'red-100': 'border-red-100',
  'red-200': 'border-red-200',
  'red-300': 'border-red-300',
  'red-400': 'border-red-400',
  'red-500': 'border-red-500',
  'red-600': 'border-red-600',
  'red-700': 'border-red-700',
  'red-800': 'border-red-800',
  'red-900': 'border-red-900',
  'blue-50': 'border-blue-50',
  'blue-100': 'border-blue-100',
  'blue-200': 'border-blue-200',
  'blue-300': 'border-blue-300',
  'blue-400': 'border-blue-400',
  'blue-500': 'border-blue-500',
  'blue-600': 'border-blue-600',
  'blue-700': 'border-blue-700',
  'blue-800': 'border-blue-800',
  'blue-900': 'border-blue-900',
  'green-50': 'border-green-50',
  'green-100': 'border-green-100',
  'green-200': 'border-green-200',
  'green-300': 'border-green-300',
  'green-400': 'border-green-400',
  'green-500': 'border-green-500',
  'green-600': 'border-green-600',
  'green-700': 'border-green-700',
  'green-800': 'border-green-800',
  'green-900': 'border-green-900',
};

const RING_COLOR_MAP: Record<Color, string> = {
  white: 'ring-white',
  black: 'ring-black',
  'gray-50': 'ring-gray-50',
  'gray-100': 'ring-gray-100',
  'gray-200': 'ring-gray-200',
  'gray-300': 'ring-gray-300',
  'gray-400': 'ring-gray-400',
  'gray-500': 'ring-gray-500',
  'gray-600': 'ring-gray-600',
  'gray-700': 'ring-gray-700',
  'gray-800': 'ring-gray-800',
  'gray-900': 'ring-gray-900',
  'red-50': 'ring-red-50',
  'red-100': 'ring-red-100',
  'red-200': 'ring-red-200',
  'red-300': 'ring-red-300',
  'red-400': 'ring-red-400',
  'red-500': 'ring-red-500',
  'red-600': 'ring-red-600',
  'red-700': 'ring-red-700',
  'red-800': 'ring-red-800',
  'red-900': 'ring-red-900',
  'blue-50': 'ring-blue-50',
  'blue-100': 'ring-blue-100',
  'blue-200': 'ring-blue-200',
  'blue-300': 'ring-blue-300',
  'blue-400': 'ring-blue-400',
  'blue-500': 'ring-blue-500',
  'blue-600': 'ring-blue-600',
  'blue-700': 'ring-blue-700',
  'blue-800': 'ring-blue-800',
  'blue-900': 'ring-blue-900',
  'green-50': 'ring-green-50',
  'green-100': 'ring-green-100',
  'green-200': 'ring-green-200',
  'green-300': 'ring-green-300',
  'green-400': 'ring-green-400',
  'green-500': 'ring-green-500',
  'green-600': 'ring-green-600',
  'green-700': 'ring-green-700',
  'green-800': 'ring-green-800',
  'green-900': 'ring-green-900',
};

const HOVER_BORDER_COLOR_MAP: Record<Color, string> = {
  white: 'hover:border-white',
  black: 'hover:border-black',
  'gray-50': 'hover:border-gray-50',
  'gray-100': 'hover:border-gray-100',
  'gray-200': 'hover:border-gray-200',
  'gray-300': 'hover:border-gray-300',
  'gray-400': 'hover:border-gray-400',
  'gray-500': 'hover:border-gray-500',
  'gray-600': 'hover:border-gray-600',
  'gray-700': 'hover:border-gray-700',
  'gray-800': 'hover:border-gray-800',
  'gray-900': 'hover:border-gray-900',
  'red-50': 'hover:border-red-50',
  'red-100': 'hover:border-red-100',
  'red-200': 'hover:border-red-200',
  'red-300': 'hover:border-red-300',
  'red-400': 'hover:border-red-400',
  'red-500': 'hover:border-red-500',
  'red-600': 'hover:border-red-600',
  'red-700': 'hover:border-red-700',
  'red-800': 'hover:border-red-800',
  'red-900': 'hover:border-red-900',
  'blue-50': 'hover:border-blue-50',
  'blue-100': 'hover:border-blue-100',
  'blue-200': 'hover:border-blue-200',
  'blue-300': 'hover:border-blue-300',
  'blue-400': 'hover:border-blue-400',
  'blue-500': 'hover:border-blue-500',
  'blue-600': 'hover:border-blue-600',
  'blue-700': 'hover:border-blue-700',
  'blue-800': 'hover:border-blue-800',
  'blue-900': 'hover:border-blue-900',
  'green-50': 'hover:border-green-50',
  'green-100': 'hover:border-green-100',
  'green-200': 'hover:border-green-200',
  'green-300': 'hover:border-green-300',
  'green-400': 'hover:border-green-400',
  'green-500': 'hover:border-green-500',
  'green-600': 'hover:border-green-600',
  'green-700': 'hover:border-green-700',
  'green-800': 'hover:border-green-800',
  'green-900': 'hover:border-green-900',
};

const FOCUS_RING_COLOR_MAP: Record<Color, string> = {
  white: 'focus:ring-white',
  black: 'focus:ring-black',
  'gray-50': 'focus:ring-gray-50',
  'gray-100': 'focus:ring-gray-100',
  'gray-200': 'focus:ring-gray-200',
  'gray-300': 'focus:ring-gray-300',
  'gray-400': 'focus:ring-gray-400',
  'gray-500': 'focus:ring-gray-500',
  'gray-600': 'focus:ring-gray-600',
  'gray-700': 'focus:ring-gray-700',
  'gray-800': 'focus:ring-gray-800',
  'gray-900': 'focus:ring-gray-900',
  'red-50': 'focus:ring-red-50',
  'red-100': 'focus:ring-red-100',
  'red-200': 'focus:ring-red-200',
  'red-300': 'focus:ring-red-300',
  'red-400': 'focus:ring-red-400',
  'red-500': 'focus:ring-red-500',
  'red-600': 'focus:ring-red-600',
  'red-700': 'focus:ring-red-700',
  'red-800': 'focus:ring-red-800',
  'red-900': 'focus:ring-red-900',
  'blue-50': 'focus:ring-blue-50',
  'blue-100': 'focus:ring-blue-100',
  'blue-200': 'focus:ring-blue-200',
  'blue-300': 'focus:ring-blue-300',
  'blue-400': 'focus:ring-blue-400',
  'blue-500': 'focus:ring-blue-500',
  'blue-600': 'focus:ring-blue-600',
  'blue-700': 'focus:ring-blue-700',
  'blue-800': 'focus:ring-blue-800',
  'blue-900': 'focus:ring-blue-900',
  'green-50': 'focus:ring-green-50',
  'green-100': 'focus:ring-green-100',
  'green-200': 'focus:ring-green-200',
  'green-300': 'focus:ring-green-300',
  'green-400': 'focus:ring-green-400',
  'green-500': 'focus:ring-green-500',
  'green-600': 'focus:ring-green-600',
  'green-700': 'focus:ring-green-700',
  'green-800': 'focus:ring-green-800',
  'green-900': 'focus:ring-green-900',
};

/**
 * Converts form styling properties to Tailwind class strings
 */
export interface FormStyleProps {
  borderRadius?: BorderRadius;
  paddingX?: SpacingRem;
  paddingY?: SpacingRem;
  fontSize?: FontSize;
  borderWidth?: BorderWidthPx;
  ringWidth?: RingWidthPx;
  bgColor?: Color;
  textColor?: Color;
  borderColor?: Color;
  ringColor?: Color;
  hoverBorderColor?: Color;
  focusRingColor?: Color;
}

/**
 * Generates Tailwind class string from form style properties
 */
export function formStyleToClass(props: FormStyleProps): string {
  const classes: string[] = [];

  if (props.borderRadius) {
    classes.push(BORDER_RADIUS_MAP[props.borderRadius]);
  }
  if (props.paddingX) {
    classes.push(PADDING_X_MAP[props.paddingX]);
  }
  if (props.paddingY) {
    classes.push(PADDING_Y_MAP[props.paddingY]);
  }
  if (props.fontSize) {
    classes.push(FONT_SIZE_MAP[props.fontSize]);
  }
  if (props.borderWidth) {
    classes.push(BORDER_WIDTH_MAP[props.borderWidth]);
  }
  if (props.ringWidth) {
    classes.push(RING_WIDTH_MAP[props.ringWidth]);
  }
  if (props.bgColor) {
    classes.push(BG_COLOR_MAP[props.bgColor]);
  }
  if (props.textColor) {
    classes.push(TEXT_COLOR_MAP[props.textColor]);
  }
  if (props.borderColor) {
    classes.push(BORDER_COLOR_MAP[props.borderColor]);
  }
  if (props.ringColor) {
    classes.push(RING_COLOR_MAP[props.ringColor]);
  }
  if (props.hoverBorderColor) {
    classes.push(HOVER_BORDER_COLOR_MAP[props.hoverBorderColor]);
  }
  if (props.focusRingColor) {
    classes.push(FOCUS_RING_COLOR_MAP[props.focusRingColor]);
  }

  return classes.filter(Boolean).join(' ');
}
