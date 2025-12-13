import { GridChild, GridContainer } from '~/components/Layout/Grid';
import { NoteCard } from '~/components/Pages/App/Usernotes/components/NoteCard';
import { NoteForm } from '~/components/Pages/App/Usernotes/components/NoteForm';
import useNotes from '~/hooks/useNotes';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import type { CreateNotePayload } from '~/types/Notes/Note';

export function UserNotesPage() {
  const { auth } = useFirebase();
  const { notes, createNote, updateNote, deleteNote } = useNotes({
    userUid: auth.currentUser?.uid ?? null,
  });
  function handleNoteCreate(noteData: CreateNotePayload) {
    createNote(noteData).catch((e: unknown) => {
      console.error('Failed to create note', e);
    });
  }
  function handleNoteDelete(noteId: string) {
    deleteNote(noteId).catch((e: unknown) => {
      console.error('Failed to delete note', e);
    });
  }
  function handleNoteUpdate(noteId: string, note: Pick<CreateNotePayload, 'title' | 'content'>) {
    updateNote(noteId, note).catch((e: unknown) => {
      console.error('Failed to update note', e);
    });
  }
  return (
    <GridContainer fill>
      <GridChild colSpan={{ sm: 12, md: 6, lg: 4, xl: 2, '2xl': 2 }}>
        <NoteForm handleNoteSave={handleNoteCreate} />
      </GridChild>
      {notes
        .toSorted((a, b) => {
          return b.createdAt.seconds - a.createdAt.seconds;
        })
        .map((note) => (
          <GridChild key={note.uid} colSpan={{ sm: 12, md: 6, lg: 4, xl: 2, '2xl': 2 }}>
            <NoteCard note={note} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} />
          </GridChild>
        ))}
    </GridContainer>
  );
}
