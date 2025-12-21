import { type Color, styleMapToClass } from '~/styles';
import type { TagWithUid } from '~/types/Tags/Tag';
import { getColorFromUids } from '~/utils/color';

interface ITagProps {
  tag: TagWithUid;
  onClick?: (tag: TagWithUid) => void;
  onRemoveClick?: (tag: TagWithUid) => void;
}
export function Tag({ tag, onClick, onRemoveClick }: ITagProps) {
  const uidColor: Color = `${getColorFromUids(tag.uid)}-600`;
  return (
    <div
      className={styleMapToClass({
        fontSize: 'sm',
        textColor: uidColor,
        cursor: 'pointer',
        borderRadius: 'sm',
        borderWidth: '2',
        borderColor: uidColor,
        paddingY: '0.25',
        paddingX: '0.75',
      })}
      onClick={() => {
        onClick?.(tag);
      }}
    >
      {tag.content}
      {onRemoveClick ? (
        <span
          onClick={() => {
            onRemoveClick(tag);
          }}
        >
          {' '}
          x{' '}
        </span>
      ) : null}
    </div>
  );
}
