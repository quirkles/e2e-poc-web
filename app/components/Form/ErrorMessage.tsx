import React from 'react';

import { FORM_ERROR_TEXT_COLOR } from './consts';

import { styleMapToClass } from '~/styles/styleMapToClass.js';
import { cn } from '~/utils/cn';

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const ErrorMessage = React.forwardRef<HTMLSpanElement, ErrorMessageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          styleMapToClass({
            textColor: FORM_ERROR_TEXT_COLOR,
            fontSize: 'xs',
            marginTop: '1',
            display: 'block',
          }),
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';
