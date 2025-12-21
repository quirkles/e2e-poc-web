import { GridChild, GridContainer } from '~/components/Layout/Grid';
import { Note } from '~/components/Pages/App/Usernotes/components/Note';
import { NoteForm } from '~/components/Pages/App/Usernotes/components/NoteForm';
import useNotes from '~/hooks/useNotes';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import { getRepository } from '~/services/db/repository';
import type { CreateNotePayload } from '~/types/Notes/Note';
import type { CreateNoteSchema } from '~/types/Notes/NoteSchema';

export function UserNotesPage() {
  const { auth } = useFirebase();
  const { notes } = useNotes({
    userUid: auth.currentUser?.uid ?? null,
  });
  const noteRepository = getRepository('Notes');
  function handleNoteCreate(noteData: CreateNoteSchema, tagUids: string[] = []) {
    noteRepository
      .create({
        ...noteData,
        tagUids,
      })
      .catch((e: unknown) => {
        console.error('Failed to create note', e);
      });
  }
  function handleNoteDelete(noteId: string) {
    noteRepository.delete(noteId).catch((e: unknown) => {
      console.error('Failed to delete note', e);
    });
  }
  function handleNoteUpdate(noteId: string, note: Pick<CreateNotePayload, 'title' | 'content'>) {
    noteRepository.update(noteId, note).catch((e: unknown) => {
      console.error('Failed to update note', e);
    });
  }
  return (
    <GridContainer fill>
      <GridChild colSpan={{ sm: 12, md: 6, lg: 4, xl: 3, '2xl': 3 }}>
        <NoteForm handleNoteSave={handleNoteCreate} />
      </GridChild>
      {notes
        .toSorted((a, b) => {
          return b.createdAt.seconds - a.createdAt.seconds;
        })
        .map((note) => (
          <GridChild key={note.uid} colSpan={{ sm: 12, md: 6, lg: 4, xl: 2, '2xl': 2 }}>
            <Note note={note} onNoteUpdate={handleNoteUpdate} onNoteDelete={handleNoteDelete} />
          </GridChild>
        ))}
    </GridContainer>
  );
}
