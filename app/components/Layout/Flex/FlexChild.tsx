import React, { type PropsWithChildren } from 'react';

import { styleMapToClass } from '~/styles/classname/styleMapToClass.js';
import type { Flex, FlexGrow, FlexShrink, FlexBasis, AlignSelf } from '~/styles/types';

type FlexChildProps = PropsWithChildren<{
  flex?: Flex;
  grow?: FlexGrow;
  shrink?: FlexShrink;
  basis?: FlexBasis;
  alignSelf?: AlignSelf;
  className?: string;
}>;

export function FlexChild({
  flex = 'initial',
  grow,
  shrink,
  basis,
  alignSelf = 'auto',
  children,
}: FlexChildProps) {
  return (
    <div
      className={styleMapToClass({
        flex,
        grow,
        shrink,
        basis,
        alignSelf,
      })}
    >
      {children}
    </div>
  );
}
