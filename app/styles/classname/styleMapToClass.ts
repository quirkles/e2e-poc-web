import type {
  BorderRadius,
  SpacingRem,
  FontSize,
  BorderWidthPx,
  Color,
  Outline,
  Cursor,
  TextDecoration,
  FontStyle,
  TextTransform,
  FontWeight,
  TextAlign,
  FlexDirection,
  FlexJustify,
  FlexAlign,
  FlexWrap,
  FlexGap,
  Display,
  Dimension,
  Flex,
  FlexGrow,
  FlexShrink,
  FlexBasis,
  AlignSelf,
} from '../types.js';

import {
  BG_COLOR_MAP,
  TEXT_COLOR_MAP,
  BORDER_COLOR_MAP,
  RING_COLOR_MAP,
  HOVER_BORDER_COLOR_MAP,
  FOCUS_RING_COLOR_MAP,
  FOCUS_BORDER_COLOR_MAP,
  DISABLED_BG_COLOR_MAP,
  DISABLED_TEXT_COLOR_MAP,
} from './colors.js';
import {
  FONT_SIZE_MAP,
  TEXT_DECORATION_MAP,
  FONT_STYLE_MAP,
  TEXT_TRANSFORM_MAP,
  FONT_WEIGHT_MAP,
  TEXT_ALIGN_MAP,
} from './font.js';
import {
  FLEX_DIRECTION_MAP,
  FLEX_JUSTIFY_MAP,
  FLEX_ALIGN_MAP,
  FLEX_WRAP_MAP,
  FLEX_GAP_MAP,
  DISPLAY_MAP,
  FLEX_MAP,
  FLEX_GROW_MAP,
  FLEX_SHRINK_MAP,
  FLEX_BASIS_MAP,
  ALIGN_SELF_MAP,
} from './layout.js';
import {
  BORDER_RADIUS_MAP,
  PADDING_X_MAP,
  PADDING_Y_MAP,
  BORDER_WIDTH_MAP,
  RING_WIDTH_MAP,
  HEIGHT_MAP,
  WIDTH_MAP,
  OUTLINE_MAP,
  CURSOR_MAP,
  type RingWidthPx,
} from './spacing.js';

/**
 * Converts form styling properties to Tailwind class strings
 */
export interface StyleProps {
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
  focusBorderColor?: Color;
  disabledBgColor?: Color;
  disabledTextColor?: Color;
  width?: Dimension;
  height?: Dimension;
  outline?: Outline;
  cursor?: Cursor;
  textDecoration?: TextDecoration;
  fontStyle?: FontStyle;
  textTransform?: TextTransform;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
  direction?: FlexDirection;
  justify?: FlexJustify;
  align?: FlexAlign;
  wrap?: FlexWrap;
  gap?: FlexGap;
  display?: Display;
  flex?: Flex;
  grow?: FlexGrow;
  shrink?: FlexShrink;
  basis?: FlexBasis;
  alignSelf?: AlignSelf;
}

/**
 * Generates Tailwind class string from form style properties
 */
export function styleMapToClass(props: StyleProps): string {
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
  if (props.focusBorderColor) {
    classes.push(FOCUS_BORDER_COLOR_MAP[props.focusBorderColor]);
  }
  if (props.disabledBgColor) {
    classes.push(DISABLED_BG_COLOR_MAP[props.disabledBgColor]);
  }
  if (props.disabledTextColor) {
    classes.push(DISABLED_TEXT_COLOR_MAP[props.disabledTextColor]);
  }
  if (props.width) {
    classes.push(WIDTH_MAP[props.width]);
  }
  if (props.height) {
    classes.push(HEIGHT_MAP[props.height]);
  }
  if (props.outline) {
    classes.push(OUTLINE_MAP[props.outline]);
  }
  if (props.cursor) {
    classes.push(CURSOR_MAP[props.cursor]);
  }
  if (props.textDecoration) {
    classes.push(TEXT_DECORATION_MAP[props.textDecoration]);
  }
  if (props.fontStyle) {
    classes.push(FONT_STYLE_MAP[props.fontStyle]);
  }
  if (props.textTransform) {
    classes.push(TEXT_TRANSFORM_MAP[props.textTransform]);
  }
  if (props.fontWeight) {
    classes.push(FONT_WEIGHT_MAP[props.fontWeight]);
  }
  if (props.textAlign) {
    classes.push(TEXT_ALIGN_MAP[props.textAlign]);
  }
  if (props.direction) {
    classes.push(FLEX_DIRECTION_MAP[props.direction]);
  }
  if (props.justify) {
    classes.push(FLEX_JUSTIFY_MAP[props.justify]);
  }
  if (props.align) {
    classes.push(FLEX_ALIGN_MAP[props.align]);
  }
  if (props.wrap) {
    classes.push(FLEX_WRAP_MAP[props.wrap]);
  }
  if (props.gap !== undefined) {
    classes.push(FLEX_GAP_MAP[props.gap]);
  }
  if (props.display) {
    classes.push(DISPLAY_MAP[props.display]);
  }
  if (props.flex) {
    classes.push(FLEX_MAP[props.flex]);
  }
  if (props.grow !== undefined) {
    classes.push(FLEX_GROW_MAP[props.grow]);
  }
  if (props.shrink !== undefined) {
    classes.push(FLEX_SHRINK_MAP[props.shrink]);
  }
  if (props.basis) {
    classes.push(FLEX_BASIS_MAP[props.basis]);
  }
  if (props.alignSelf) {
    classes.push(ALIGN_SELF_MAP[props.alignSelf]);
  }

  return classes.filter(Boolean).join(' ');
}
