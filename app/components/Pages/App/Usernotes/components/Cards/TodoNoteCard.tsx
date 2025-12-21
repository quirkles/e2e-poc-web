import { useState } from 'react';

import { Heading } from '~/components/Elements/Heading';
import { Checkbox } from '~/components/Form/Checkbox';
import { FlexChild, FlexContainer } from '~/components/Layout/Flex';
import { NoteContainer } from '~/components/Pages/App/Usernotes/components/NoteContainer';
import type { INoteRepository } from '~/services/db/Notes';
import { getRepository } from '~/services/db/repository';
import type { TodoNoteWithUid } from '~/types/Notes/Note';
import type { TagWithUid } from '~/types/Tags/Tag';

interface NoteCardProps {
  note: TodoNoteWithUid;
  tags: TagWithUid[];
  onNoteDelete: (noteId: string) => void;
  handleEditClick: () => void;
}

export function TodoNoteCard({ note, onNoteDelete, handleEditClick, tags }: NoteCardProps) {
  const [updating, setUpdating] = useState(false);
  const noteRepository: INoteRepository = getRepository('Notes');

  const handleToggleNoteTodoClick = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      if (note.done) {
        await noteRepository.markTodoAsNotDone(note.uid);
      } else {
        await noteRepository.markTodoAsDone(note.uid);
      }
    } catch (err: unknown) {
      console.error('Failed to toggle note', err);
    }
    setUpdating(false);
  };

  return (
    <NoteContainer
      tags={tags}
      handleEditClick={handleEditClick}
      onNoteDelete={() => {
        onNoteDelete(note.uid);
      }}
    >
      <FlexContainer direction="col" gap={2}>
        <FlexContainer align="center" gap={1}>
          <Checkbox
            isDisabled={updating}
            isChecked={note.done}
            onChange={() => {
              handleToggleNoteTodoClick().catch((err: unknown) => {
                console.error('Failed to toggle note', err);
              });
            }}
          />
          <Heading
            textColor={'black'}
            level={3}
            textDecoration={note.done ? 'line-through' : 'none'}
            fontWeight="semibold"
          >
            {note.title}
          </Heading>
        </FlexContainer>
        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
        <FlexChild alignSelf="end">
          <div className="mt-3 text-xs text-gray-500">
            <span>Created: {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</span>
          </div>
        </FlexChild>
      </FlexContainer>
    </NoteContainer>
  );
}
