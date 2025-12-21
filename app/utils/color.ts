import type { BaseColorName } from '~/styles';
import { memoize } from '~/utils/function';

const baseColors: { [color in BaseColorName]: color } = {
  slate: 'slate',
  gray: 'gray',
  zinc: 'zinc',
  neutral: 'neutral',
  stone: 'stone',
  red: 'red',
  orange: 'orange',
  amber: 'amber',
  yellow: 'yellow',
  lime: 'lime',
  green: 'green',
  emerald: 'emerald',
  teal: 'teal',
  cyan: 'cyan',
  sky: 'sky',
  blue: 'blue',
  indigo: 'indigo',
  violet: 'violet',
  purple: 'purple',
  fuchsia: 'fuchsia',
  pink: 'pink',
  rose: 'rose',
} as const;

const colorArray = Object.values(baseColors).toSorted();

function _getColorFromUids(uid: string): BaseColorName {
  return colorArray[
    uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorArray.length
  ];
}

export const getColorFromUids = memoize(_getColorFromUids, ([i]) => i);
