import useNotes from '~/hooks/useNotes';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import { GridChild, GridContainer } from '~/components/Layout/Grid';
import { CreateNoteForm } from '~/components/Pages/App/Usernotes/components/CreateNoteForm';
import type { CreateNotePayload } from '~/types/Notes/Note';

export function UserNotesPage() {
  const { auth } = useFirebase();
  const { notes, createNote } = useNotes({
    userUid: auth.currentUser?.uid ?? null,
  });
  function handleNoteCreate(noteData: CreateNotePayload) {
    return createNote(noteData);
  }
  console.log('notes', notes);
  return (
    <GridContainer>
      <GridChild colSpan={{ sm: 12, md: 6, lg: 4, xl: 2, '2xl': 1 }}>
        <CreateNoteForm handleNoteCreate={handleNoteCreate} />
      </GridChild>
      {notes
        .toSorted((a, b) => {
          return b.createdAt.seconds - a.createdAt.seconds;
        })
        .map((note) => (
          <GridChild key={note.uid} colSpan={{ sm: 12, md: 6, lg: 4, xl: 2, '2xl': 1 }}>
            {note.title}
          </GridChild>
        ))}
    </GridContainer>
  );
}
