import type {
  BorderRadius,
  SpacingRem,
  FontSize,
  BorderWidthPx,
  RingWidthPx,
  Color,
} from '~/styles/types';

// Form element styling constants (values only, not full class names)
export const FORM_BORDER_RADIUS: BorderRadius = 'md';
export const FORM_PADDING_X: SpacingRem = '3';
export const FORM_PADDING_Y: SpacingRem = '2';
export const FORM_FONT_SIZE: FontSize = 'sm';
export const FORM_BORDER_WIDTH: BorderWidthPx = '1';

// Colors (just the color value, not the full class)
export const FORM_BG_COLOR: Color = 'black';
export const FORM_TEXT_COLOR: Color = 'gray-100';
export const FORM_BORDER_COLOR: Color = 'gray-100';
export const FORM_BORDER_HOVER_COLOR: Color = 'gray-400';

// Focus states
export const FORM_FOCUS_RING_WIDTH: RingWidthPx = '1';
export const FORM_FOCUS_RING_COLOR: Color = 'blue-500';

// Disabled states (these are full classes since they're modifiers)
export const FORM_DISABLED_BG = 'disabled:bg-gray-100';
export const FORM_DISABLED_TEXT = 'disabled:text-gray-500';
export const FORM_DISABLED_CURSOR = 'disabled:cursor-not-allowed';

// Focus modifiers (these are full classes since they're single-use modifiers)
export const FORM_FOCUS_BORDER = 'focus:border-transparent';
export const FORM_FOCUS_OUTLINE = 'focus:outline-none';

// Error states
export const FORM_ERROR_BORDER_COLOR: Color = 'red-500';
export const FORM_ERROR_RING_COLOR: Color = 'red-500';
export const FORM_ERROR_TEXT_COLOR: Color = 'red-600';

// Width
export const FORM_WIDTH = 'w-full';
