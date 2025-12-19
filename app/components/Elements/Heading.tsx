import React from 'react';

import { styleMapToClass } from '~/styles/classname/styleMapToClass';
import type {
  Color,
  FontSize,
  TextDecoration,
  FontStyle,
  TextTransform,
  FontWeight,
  TextAlign,
} from '~/styles/types';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level: HeadingLevel;
  children: React.ReactNode;
  textColor?: Color;
  fontSize?: FontSize;
  textDecoration?: TextDecoration;
  fontStyle?: FontStyle;
  textTransform?: TextTransform;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  textColor,
  fontSize,
  textDecoration,
  fontStyle,
  textTransform,
  fontWeight,
  textAlign,
}) => {
  const className = styleMapToClass({
    textColor,
    fontSize,
    textDecoration,
    fontStyle,
    textTransform,
    fontWeight,
    textAlign,
  });

  const Tag = getTag(level);

  return <Tag className={className || undefined}>{children}</Tag>;
};

function getTag(level: HeadingLevel): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  switch (level) {
    case 1:
      return 'h1';
    case 2:
      return 'h2';
    case 3:
      return 'h3';
    case 4:
      return 'h4';
    case 5:
      return 'h5';
    case 6:
      return 'h6';
    default:
      return 'h1';
  }
}
