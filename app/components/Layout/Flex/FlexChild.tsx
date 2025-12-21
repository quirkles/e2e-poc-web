import React, { type PropsWithChildren } from 'react';

import { styleMapToClass } from '~/styles/classname/styleMapToClass.js';
import type {
  Flex,
  FlexGrow,
  FlexShrink,
  FlexBasis,
  AlignSelf,
  Dimension,
  Overflow,
} from '~/styles/types';

type FlexChildProps = PropsWithChildren<{
  width?: Dimension;
  height?: Dimension;

  overflow?: Overflow;

  flex?: Flex;
  grow?: FlexGrow;
  shrink?: FlexShrink;
  basis?: FlexBasis;
  alignSelf?: AlignSelf;
  className?: string;
}>;

export function FlexChild({ children, ...styleProps }: FlexChildProps) {
  return <div className={styleMapToClass(styleProps)}>{children}</div>;
}
