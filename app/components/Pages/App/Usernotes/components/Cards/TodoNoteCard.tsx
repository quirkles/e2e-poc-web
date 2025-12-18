import { useState } from 'react';

import { IconButton } from '~/components/Elements/IconButton';
import { Checkbox } from '~/components/Form/Checkbox';
import { FlexContainer } from '~/components/Layout/Flex';
import { NoteContainer } from '~/components/Pages/App/Usernotes/components/NoteContainer';
import type { INoteRepository } from '~/services/db/Notes';
import { getRepository } from '~/services/db/repository';
import type { TodoNoteWithUid } from '~/types/Notes/Note';

interface NoteCardProps {
  note: TodoNoteWithUid;
  onNoteDelete: (noteId: string) => void;
  handleEditClick: () => void;
}

export function TodoNoteCard({ note, onNoteDelete, handleEditClick }: NoteCardProps) {
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
    <NoteContainer>
      <div className="absolute top-3 right-3 flex gap-2">
        <IconButton variant="edit" onClick={handleEditClick} aria-label="Edit note" />
        <IconButton
          variant="delete"
          onClick={() => {
            console.log('huh?');
            return;
            onNoteDelete(note.uid);
          }}
          aria-label="Delete note"
        />
      </div>
      <FlexContainer>
        <Checkbox
          isDisabled={updating}
          isChecked={note.done}
          onChange={() => {
            handleToggleNoteTodoClick().catch((err: unknown) => {
              console.error('Failed to toggle note', err);
            });
          }}
        />
        <h3 className="text-black text-lg font-semibold mb-2 pr-16">{note.title}</h3>
      </FlexContainer>
      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      <div className="mt-3 text-xs text-gray-500">
        <span>Created: {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</span>
      </div>
    </NoteContainer>
  );
}
