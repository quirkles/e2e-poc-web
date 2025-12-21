import React, { type PropsWithChildren } from 'react';

import { styleMapToClass } from '~/styles/classname/styleMapToClass.js';
import type {
  Dimension,
  FlexDirection,
  FlexAlign,
  FlexJustify,
  FlexWrap,
  FlexGap,
  Color,
  BorderRadius, SpacingRem,
} from '~/styles/types';

type FlexContainerProps = PropsWithChildren<{
  height?: Dimension;
  width?: Dimension;

  direction?: FlexDirection;
  justify?: FlexJustify;
  align?: FlexAlign;
  wrap?: FlexWrap;
  gap?: FlexGap;

  bgColor?: Color;
  borderRadius?: BorderRadius;

  padding?: SpacingRem;
}>;

export function FlexContainer({
  children,
  padding,
  ...props
}: PropsWithChildren<FlexContainerProps>) {
  const defaultProps = {
    direction: 'row',
    justify: 'start',
    align: 'stretch',
    wrap: 'nowrap',
    gap: 0,
  } as const;
  return (
    <div
      className={styleMapToClass({
        ...defaultProps,
        ...props,
        paddingX: padding ?? '0',
        paddingY: padding ?? '0',
        display: 'flex',
      })}
    >
      {children}
    </div>
  );
}
