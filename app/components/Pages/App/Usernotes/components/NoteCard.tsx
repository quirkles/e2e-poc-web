import { useState } from 'react';

import { IconButton } from '~/components/Elements/IconButton';
import type { Note, NoteWithUid } from '~/types/Notes/Note';

import { NoteForm } from './NoteForm';

interface NoteCardProps {
  note: NoteWithUid;
  onNoteDelete: (noteId: string) => void;
  onNoteUpdate: (noteId: string, note: Pick<Note, 'title' | 'content'>) => void;
}

export function NoteCard({ note, onNoteDelete, onNoteUpdate }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <NoteForm
        handleNoteSave={(noteData) => {
          onNoteUpdate(note.uid, noteData);
          setIsEditing(false);
        }}
        handleCancel={() => {
          setIsEditing(false);
        }}
        initialValues={{ title: note.title, content: note.content }}
      />
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white h-full relative">
      <div className="absolute top-3 right-3 flex gap-2">
        <IconButton
          variant="edit"
          onClick={() => {
            setIsEditing(true);
          }}
          aria-label="Edit note"
        />
        <IconButton
          variant="delete"
          onClick={() => {
            onNoteDelete(note.uid);
          }}
          aria-label="Delete note"
        />
      </div>
      <h3 className="text-black text-lg font-semibold mb-2 pr-16">{note.title}</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      <div className="mt-3 text-xs text-gray-500">
        <span>Created: {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
