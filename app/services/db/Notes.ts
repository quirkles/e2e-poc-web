import { type Firestore, Timestamp } from '@firebase/firestore';
import { getDoc, addDoc, updateDoc, serverTimestamp, runTransaction } from '@firebase/firestore';
import { ZodError } from 'zod';

import { type Repository, RepositoryBase } from '~/services/db/types';
import { NotFoundError, ValidationError } from '~/types/Error';
import type { NoteWithUidSchema, CreateNoteSchema } from '~/types/Notes/NoteSchema';
import { noteWithUidSchema } from '~/types/Notes/NoteSchema';

export interface INoteRepository extends Repository<'Notes'> {
  markTodoAsDone(id: string): Promise<NoteWithUidSchema>;
  markTodoAsNotDone(id: string): Promise<NoteWithUidSchema>;
}

export class NoteRepository extends RepositoryBase<'Notes'> implements INoteRepository {
  constructor(firestore: Firestore) {
    super(firestore, 'notes');
  }

  async get(id: string): Promise<NoteWithUidSchema | null> {
    const docSnap = await getDoc(this.getDocRef(id));

    if (!docSnap.exists()) {
      return null;
    }

    const data = { uid: docSnap.id, ...docSnap.data() };
    return noteWithUidSchema.parse(data);
  }

  async create(entity: CreateNoteSchema): Promise<NoteWithUidSchema> {
    const noteData = {
      ...entity,
      authorId: 'TODO', // TODO: Get from auth context
      createdAt: serverTimestamp(),
      updatedAt: null,
      deletedAt: null,
    };

    const docRef = await addDoc(this.getCollectionRef(), noteData);
    const createdDoc = await getDoc(docRef);

    if (!createdDoc.exists()) {
      throw new Error('Failed to create note');
    }

    const data = { uid: createdDoc.id, ...createdDoc.data() };
    return noteWithUidSchema.parse(data);
  }

  async update(
    uid: string,
    entity: Partial<Omit<NoteWithUidSchema, 'uid' | 'deletedAt' | 'deletedBy'>>
  ): Promise<NoteWithUidSchema> {
    const docRef = this.getDocRef(uid);

    return await runTransaction(this.firestore, async (transaction) => {
      const docSnap = await transaction.get(docRef);

      if (!docSnap.exists()) {
        throw new Error(`Note with id ${uid} not found`);
      }

      const updateData = {
        ...entity,
        updatedAt: serverTimestamp(),
      };

      transaction.update(docRef, updateData);

      // Return the updated data (note: serverTimestamp() will be resolved after transaction)
      const data = { uid: docSnap.id, ...docSnap.data(), ...updateData };
      return noteWithUidSchema.parse(data);
    });
  }

  async delete(id: string): Promise<NoteWithUidSchema> {
    const docRef = this.getDocRef(id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Note with id ${id} not found`);
    }

    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
    });

    const deletedDoc = await getDoc(docRef);
    const data = { uid: deletedDoc.id, ...deletedDoc.data() };
    return noteWithUidSchema.parse(data);
  }

  async markTodoAsDone(id: string): Promise<NoteWithUidSchema> {
    return runTransaction(this.firestore, async (tx) => {
      const docRef = this.getDocRef(id);
      const todo = await tx
        .get(docRef)
        .then((doc) => {
          if (!doc.exists()) {
            throw new NotFoundError('Failed to find Note');
          }
          return noteWithUidSchema.parse({
            ...doc.data(),
            uid: id,
          });
        })
        .catch((err: unknown) => {
          if (err instanceof ZodError) {
            throw new ValidationError(err);
          }
          throw err;
        });
      if (todo.type !== 'TODO') {
        throw new ValidationError('Note must be of the TODO type');
      }

      if (todo.done) {
        throw new ValidationError('Note is already done');
      }

      const update = {
        done: true,
        completedAt: Timestamp.now(),
      };
      tx.update(docRef, update);
      return {
        ...todo,
        ...update,
      };
    });
  }

  async markTodoAsNotDone(id: string): Promise<NoteWithUidSchema> {
    return runTransaction(this.firestore, async (tx) => {
      const docRef = this.getDocRef(id);
      const todo = await tx
        .get(docRef)
        .then((doc) => {
          if (!doc.exists()) {
            throw new NotFoundError('Failed to find Note');
          }
          return noteWithUidSchema.parse({
            ...doc.data(),
            uid: id,
          });
        })
        .catch((err: unknown) => {
          if (err instanceof ZodError) {
            throw new ValidationError(err);
          }
          throw err;
        });
      if (todo.type !== 'TODO') {
        throw new ValidationError('Note must be of the TODO type');
      }

      if (!todo.done) {
        throw new ValidationError('Note is already done');
      }

      const update = {
        done: false,
        completedAt: null,
      };
      tx.update(docRef, update);
      return {
        ...todo,
        ...update,
      };
    });
  }
}
