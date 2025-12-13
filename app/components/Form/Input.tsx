import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FORM_BORDER_RADIUS,
  FORM_PADDING_X,
  FORM_PADDING_Y,
  FORM_FONT_SIZE,
  FORM_BORDER_WIDTH,
  FORM_BG_COLOR,
  FORM_TEXT_COLOR,
  FORM_BORDER_COLOR,
  FORM_BORDER_HOVER_COLOR,
  FORM_FOCUS_RING_WIDTH,
  FORM_FOCUS_RING_COLOR,
  FORM_FOCUS_BORDER_COLOR,
  FORM_FOCUS_OUTLINE,
  FORM_DISABLED_BG_COLOR,
  FORM_DISABLED_TEXT_COLOR,
  FORM_DISABLED_CURSOR,
  FORM_WIDTH,
  FORM_LINE_ELEMENT_HEIGHT,
} from './consts';

import { styleMapToClass } from '~/styles/styleMapToClass.js';
import { cn } from '~/utils/cn';
import { dateToInputFormat } from '~/utils/date';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  watched?: string | number | Date;
}

export function Input({ watched, ...props }: InputProps) {
  const [value, setValue] = useState<string | number>('');

  useEffect(() => {
    if (watched instanceof Date) {
      setValue(dateToInputFormat(watched));
    } else if (typeof watched === 'string' || typeof watched === 'number') {
      setValue(watched);
    }
  }, [watched]);

  return (
    <input
      {...props}
      value={value}
      className={cn(
        styleMapToClass({
          width: FORM_WIDTH,
          height: FORM_LINE_ELEMENT_HEIGHT,
          paddingX: FORM_PADDING_X,
          paddingY: FORM_PADDING_Y,
          fontSize: FORM_FONT_SIZE,
          borderRadius: FORM_BORDER_RADIUS,
          borderWidth: FORM_BORDER_WIDTH,
          borderColor: FORM_BORDER_COLOR,
          bgColor: FORM_BG_COLOR,
          textColor: FORM_TEXT_COLOR,
          ringWidth: FORM_FOCUS_RING_WIDTH,
          focusRingColor: FORM_FOCUS_RING_COLOR,
          focusBorderColor: FORM_FOCUS_BORDER_COLOR,
          hoverBorderColor: FORM_BORDER_HOVER_COLOR,
          outline: FORM_FOCUS_OUTLINE,
          disabledBgColor: FORM_DISABLED_BG_COLOR,
          disabledTextColor: FORM_DISABLED_TEXT_COLOR,
          cursor: FORM_DISABLED_CURSOR,
        })
      )}
    />
  );
}
