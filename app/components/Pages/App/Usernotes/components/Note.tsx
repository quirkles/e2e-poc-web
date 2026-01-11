import { useState } from 'react';

import { NoteForm } from './NoteForm';

import { ChecklistNoteCard } from '~/components/Pages/App/Usernotes/components/Cards/ChecklistNoteCard';
import { ImageNoteCard } from '~/components/Pages/App/Usernotes/components/Cards/ImageNoteCard';
import { TextNoteCard } from '~/components/Pages/App/Usernotes/components/Cards/TextNoteCard';
import { TodoNoteCard } from '~/components/Pages/App/Usernotes/components/Cards/TodoNoteCard';
import useTags from '~/hooks/useTags';
import type { Note, NoteWithUid } from '~/types/Notes/Note';

interface NoteCardProps {
  note: NoteWithUid;
  onNoteDelete: (noteId: string) => void;
  onNoteUpdate: (noteId: string, note: Pick<Note, 'title' | 'content'>) => void;
}

export function Note({ note, onNoteDelete, onNoteUpdate }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { tags } = useTags(note.tagUids);

  if (isEditing) {
    return (
      <NoteForm
        tags={tags}
        handleNoteSave={(noteData) => {
          onNoteUpdate(note.uid, noteData);
          setIsEditing(false);
        }}
        handleCancel={() => {
          setIsEditing(false);
        }}
        note={note}
      />
    );
  }
  const noteCardProps = {
    onNoteDelete,
    handleEditClick: () => {
      setIsEditing(true);
    },
  };
  switch (note.type) {
    case 'TODO':
      return <TodoNoteCard {...noteCardProps} note={note} tags={tags} />;
    case 'CHECKLIST':
      return <ChecklistNoteCard {...noteCardProps} note={note} tags={tags} />;
    case 'IMAGE':
      return <ImageNoteCard {...noteCardProps} note={note} tags={tags} />;
    default:
      return <TextNoteCard {...noteCardProps} note={note} tags={tags} />;
  }
}
