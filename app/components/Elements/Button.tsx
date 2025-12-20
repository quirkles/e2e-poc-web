import type { ReactNode } from 'react';

import { FORM_LINE_ELEMENT_HEIGHT } from '~/components/Form/consts';
import { styleMapToClass } from '~/styles/classname/styleMapToClass.js';
import type { Color } from '~/styles/types.js';

type ButtonVariant = 'default' | 'outline';

interface ButtonProps {
  color?: Color;
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
}

export function Button({
  color = 'green-500',
  variant = 'default',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = styleMapToClass({
    height: FORM_LINE_ELEMENT_HEIGHT,
    paddingX: '1.5',
    borderRadius: 'md',
    fontSize: 'sm',
    fontWeight: 'medium',
    cursor: 'pointer',
    disabledBgColor: 'gray-400',
  });

  const variantClasses =
    variant === 'outline'
      ? styleMapToClass({
          bgColor: 'transparent',
          textColor: color,
          borderWidth: '2',
          borderColor: color,
        })
      : styleMapToClass({
          bgColor: color,
          textColor: 'white',
          hoverBgColor: color,
        });

  return (
    <button
      className={`${baseClasses} ${variantClasses} transition-colors disabled:cursor-not-allowed`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
