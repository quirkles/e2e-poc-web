import React from 'react';

import { cn } from '~/utils/cn';

export interface FlexChildProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: 'none' | 'auto' | 1 | 'initial';
  grow?: 0 | 1;
  shrink?: 0 | 1;
  basis?: 'auto' | 'full' | 'half';
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  order?: number;
}

export const FlexChild = React.forwardRef<HTMLDivElement, FlexChildProps>(
  (
    {
      flex = 'initial',
      grow,
      shrink,
      basis,
      alignSelf = 'auto',
      order,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const flexClasses = {
      none: 'flex-none',
      auto: 'flex-auto',
      1: 'flex-1',
      initial: 'flex-initial',
    };

    const growClasses = {
      0: 'grow-0',
      1: 'grow',
    };

    const shrinkClasses = {
      0: 'shrink-0',
      1: 'shrink',
    };

    const basisClasses = {
      auto: 'basis-auto',
      full: 'basis-full',
      half: 'basis-1/2',
    };

    const alignSelfClasses = {
      auto: 'self-auto',
      start: 'self-start',
      end: 'self-end',
      center: 'self-center',
      stretch: 'self-stretch',
      baseline: 'self-baseline',
    };

    const orderClass = order !== undefined ? `order-${String(order)}` : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          flexClasses[flex],
          grow !== undefined && growClasses[grow],
          shrink !== undefined && shrinkClasses[shrink],
          basis && (basisClasses[basis] || `basis-[${basis}]`),
          alignSelfClasses[alignSelf],
          orderClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FlexChild.displayName = 'FlexChild';
