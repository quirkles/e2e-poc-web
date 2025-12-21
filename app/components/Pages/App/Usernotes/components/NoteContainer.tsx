import type { PropsWithChildren } from 'react';

import { IconButton } from '~/components/Elements/IconButton';
import { Tag } from '~/components/Functional/TagInputAndSelect/Tag';
import { FlexContainer } from '~/components/Layout/Flex';
import type { TagWithUid } from '~/types/Tags/Tag';

interface NoteContainerProps {
  tags: TagWithUid[];
  handleEditClick?: () => void;
  onNoteDelete?: () => void;
}

export function NoteContainer({
  children,
  tags,
  onNoteDelete,
  handleEditClick,
}: PropsWithChildren<NoteContainerProps>) {
  return (
    <FlexContainer direction="col" gap={2} bgColor="white" borderRadius="md" padding="4">
      <FlexContainer justify="end" width="100%">
        <IconButton variant="edit" onClick={handleEditClick} aria-label="Edit note" />
        <IconButton variant="delete" onClick={onNoteDelete} aria-label="Delete note" />
      </FlexContainer>
      <FlexContainer gap={2}>
        {tags.map((tag) => (
          <Tag key={tag.uid} tag={tag} />
        ))}
      </FlexContainer>
      {children}
    </FlexContainer>
  );
}
