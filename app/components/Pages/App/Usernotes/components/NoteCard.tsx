import { useState } from 'react';

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
        <button
          onClick={() => {
            setIsEditing(true);
          }}
          className="text-gray-500 hover:text-blue-600 transition-colors"
          aria-label="Edit note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            onNoteDelete(note.uid);
          }}
          className="text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Delete note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <h3 className="text-black text-lg font-semibold mb-2 pr-16">{note.title}</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      <div className="mt-3 text-xs text-gray-500">
        <span>Created: {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
