import type { ReactNode } from 'react';

import { FORM_LINE_ELEMENT_HEIGHT } from '~/components/Form/consts';
import { styleMapToClass, type StyleProps } from '~/styles/classname/styleMapToClass.js';
import type { Color } from '~/styles/types.js';
import toKeyMirror from '~/utils/array';

type ButtonVariant = 'default' | 'outline';

export const ButtonColors = toKeyMirror([
  'blue',
  'green',
  'yellow',
  'red',
  'orange',
  'purple',
  'pink',
] as const);

type ButtonColor = keyof typeof ButtonColors;

const colorMap: {
  [key in keyof typeof ButtonColors]: Color;
} = {
  blue: 'blue-500',
  green: 'green-500',
  yellow: 'yellow-500',
  red: 'red-500',
  orange: 'orange-500',
  purple: 'purple-500',
  pink: 'pink-500',
};

const hoverColorMap: {
  [key in keyof typeof ButtonColors]: Color;
} = {
  blue: 'blue-400',
  green: 'green-400',
  yellow: 'yellow-400',
  red: 'red-400',
  orange: 'orange-400',
  purple: 'purple-300',
  pink: 'pink-400',
};

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  color?: ButtonColor;
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function Button({
  color = 'green',
  variant = 'default',
  fullWidth = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const styleColor = colorMap[color];
  const hoverStyleColor = hoverColorMap[color];
  let styleProps: StyleProps = {
    height: FORM_LINE_ELEMENT_HEIGHT,
    paddingX: '1.5',
    borderRadius: 'md',
    fontSize: 'sm',
    fontWeight: 'medium',
    cursor: 'pointer',
    disabledBgColor: 'gray-400',
    width: fullWidth ? 'full' : 'auto',
  };

  if (variant === 'outline') {
    styleProps = {
      ...styleProps,
      textColor: styleColor,
      hoverTextColor: hoverStyleColor,
      bgColor: 'transparent',
      borderWidth: '2',
      borderColor: styleColor,
      hoverBorderColor: hoverStyleColor,
    };
  } else {
    styleProps = {
      ...styleProps,
      bgColor: styleColor,
      textColor: 'white',
      hoverBgColor: hoverStyleColor,
    };
  }

  return (
    <button
      className={`${styleMapToClass(styleProps)} transition-colors disabled:cursor-not-allowed`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
