import type { PropsWithChildren } from 'react';

import { IconButton } from '~/components/Elements/IconButton';
import { Tag } from '~/components/Functional/TagInputAndSelect/Tag';
import { FlexContainer } from '~/components/Layout/Flex';
import { getRepository } from '~/services/db/repository';
import type { NoteWithUid } from '~/types/Notes/Note';
import type { TagWithUid } from '~/types/Tags/Tag';

interface NoteContainerProps {
  tags: TagWithUid[];
  note: NoteWithUid;
  handleEditClick?: () => void;
  onNoteDelete?: () => void;
}

export function NoteContainer({
  children,
  tags,
  note,
  onNoteDelete,
  handleEditClick,
}: PropsWithChildren<NoteContainerProps>) {
  const handleRemoveTageClick = (tagUid: string) => {
    getRepository('Notes')
      .removeTagFromNote(note.uid, tagUid)
      .catch((err: unknown) => {
        console.error('failed to unset tag from note', err);
      });
  };
  return (
    <FlexContainer direction="col" gap={2} bgColor="white" borderRadius="md" padding="4">
      <FlexContainer justify="end" width="100%">
        <IconButton variant="edit" onClick={handleEditClick} aria-label="Edit note" />
        <IconButton variant="delete" onClick={onNoteDelete} aria-label="Delete note" />
      </FlexContainer>
      <FlexContainer gap={2}>
        {tags.map((tag) => (
          <Tag
            key={tag.uid}
            tag={tag}
            onRemoveClick={() => {
              handleRemoveTageClick(tag.uid);
            }}
          />
        ))}
      </FlexContainer>
      {children}
    </FlexContainer>
  );
}
