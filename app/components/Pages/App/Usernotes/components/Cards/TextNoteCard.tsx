import { IconButton } from '~/components/Elements/IconButton';
import { NoteContainer } from '~/components/Pages/App/Usernotes/components/NoteContainer';
import type { NoteWithUid } from '~/types/Notes/Note';

interface NoteCardProps {
  note: NoteWithUid;
  onNoteDelete: (noteId: string) => void;
  handleEditClick: () => void;
}

export function TextNoteCard({ note, onNoteDelete, handleEditClick }: NoteCardProps) {
  return (
    <NoteContainer>
      <div className="absolute top-3 right-3 flex gap-2">
        <IconButton variant="edit" onClick={handleEditClick} aria-label="Edit note" />
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
    </NoteContainer>
  );
}
