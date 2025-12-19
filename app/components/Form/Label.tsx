import React from 'react';

import { FORM_FONT_SIZE, FORM_TEXT_COLOR } from './consts';

import { styleMapToClass } from '~/styles/classname/styleMapToClass.js';
import { cn } from '~/utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          styleMapToClass({
            display: 'block',
            fontSize: FORM_FONT_SIZE,
            fontWeight: 'medium',
            textColor: FORM_TEXT_COLOR,
            marginBottom: '1',
          }),
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';
