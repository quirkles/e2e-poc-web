import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  FieldValue,
  addDoc,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';

import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import type { CreateNotePayload, Note, NoteWithUid } from '~/types/Notes/Note';
import { noteSchema, noteWithUidSchema } from '~/types/Notes/NoteSchema';

interface HookInput {
  userUid: string | null;
}

interface HookOutput {
  notes: NoteWithUid[];
  createNote: (note: CreateNotePayload) => Promise<NoteWithUid>;
  deleteNote: (noteId: string) => Promise<void>;
  updateNote: (noteId: string, note: Pick<Note, 'title' | 'content'>) => Promise<NoteWithUid>;
}

export default function useNotes({ userUid }: HookInput): HookOutput {
  const { db } = useFirebase();
  const [notes, setNotes] = useState<NoteWithUid[]>([]);

  useEffect(() => {
    if (userUid === null) {
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(db, 'notes'), where('authorId', '==', userUid)),
      (results) => {
        setNotes(
          results.docs.reduce((notes: NoteWithUid[], note) => {
            const parseResult = noteSchema.safeParse(note.data());
            if (parseResult.success) {
              notes.push({
                ...parseResult.data,
                uid: note.id,
              });
            } else {
                console.error('Failed to parse note', parseResult.error);
            }
            return notes;
          }, [])
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [userUid]);
  return {
    notes,
    createNote: async (note: CreateNotePayload) => {
      const newNote = await addDoc(collection(db, 'notes'), {
        ...note,
        authorId: userUid,
        createdAt: serverTimestamp(),
      });
      const created = await getDoc(doc(db, 'notes', newNote.id));
      return noteWithUidSchema.parse({
        ...created.data(),
        uid: created.id,
      });
    },
    deleteNote: async (noteUid: string) => {
      await updateDoc(doc(db, 'notes', noteUid), {
        deletedAt: serverTimestamp(),
      });
    },
    updateNote: (noteId: string, note: Partial<Pick<Note, 'title' | 'content'>>) => {
      const update: {
        updatedAt: FieldValue;
        title?: string;
        content?: string;
      } = {
        updatedAt: serverTimestamp(),
      };
      if (note.title) {
        update.title = note.title;
      }

      if (note.content) {
        update.content = note.content;
      }

      return updateDoc(doc(db, 'notes', noteId), update).then(() =>
        getDoc(doc(db, 'notes', noteId)).then((doc) => noteWithUidSchema.parse(doc.data()))
      );
    },
  };
}
