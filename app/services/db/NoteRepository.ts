import { arrayRemove, type Firestore, Timestamp } from '@firebase/firestore';
import { getDoc, updateDoc, serverTimestamp, runTransaction, doc } from '@firebase/firestore';
import { ZodError } from 'zod';

import { type Repository, RepositoryBase } from '~/services/db/types';
import { NotFoundError, ValidationError } from '~/types/Error';
import type { NoteWithUidSchema, CreateNoteSchema } from '~/types/Notes/NoteSchema';
import { noteWithUidSchema } from '~/types/Notes/NoteSchema';
import { unique } from '~/utils/array';
import { stringArraySchema } from '~/utils/schema.utils';

export interface INoteRepository extends Repository<'Notes'> {
  markTodoAsDone(id: string): Promise<NoteWithUidSchema>;
  markTodoAsNotDone(id: string): Promise<NoteWithUidSchema>;
  removeTagFromNote(noteUid: string, tagUid: string): Promise<NoteWithUidSchema | null>;
  toggleChecklistItem(noteId: string, itemId: string): Promise<NoteWithUidSchema>;
  addChecklistItem(
    noteId: string,
    item: { id: string; text: string; done: boolean }
  ): Promise<NoteWithUidSchema>;
  removeChecklistItem(noteId: string, itemId: string): Promise<NoteWithUidSchema>;
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
    return await runTransaction(this.firestore, async (transaction) => {
      const newNoteDocRef = this.initDocRef();
      // Check that all tags exist and get their refs
      const tagRefs = entity.tagUids.map((tagUid) => doc(this.firestore, 'tags', tagUid));

      // Verify all tags exist
      const tagDocs = await Promise.all(tagRefs.map((ref) => transaction.get(ref)));
      const existingTagUids: string[] = tagDocs.reduce((uids: string[], doc) => {
        if (doc.exists()) {
          uids.push(doc.id);
        }
        return uids;
      }, []);

      const noteData = {
        ...entity,
        tagUids: existingTagUids,
        createdAt: Timestamp.now(),
        updatedAt: null,
        deletedAt: null,
      };

      tagDocs.forEach((doc, idx) => {
        if (doc.exists() && existingTagUids.includes(doc.id)) {
          const existingBelongsTo = stringArraySchema.parse(doc.data().belongsTo ?? []);
          transaction.update(tagRefs[idx], {
            belongsTo: unique([...existingBelongsTo, newNoteDocRef.id]),
          });
        }
      });

      transaction.set(newNoteDocRef, noteData);
      // Return the created note data
      const data = { uid: newNoteDocRef.id, ...noteData };
      return noteWithUidSchema.parse(data);
    });
  }

  async update(
    uid: string,
    entity: Partial<Omit<NoteWithUidSchema, 'uid' | 'deletedAt' | 'deletedBy'>>
  ): Promise<NoteWithUidSchema> {
    const targetNoteDocRef = this.getDocRef(uid);

    return await runTransaction(this.firestore, async (transaction) => {
      const targetNoteDocSnap = await transaction.get(targetNoteDocRef);

      if (!targetNoteDocSnap.exists()) {
        throw new Error(`Note with id ${uid} not found`);
      }

      const newTagUids = entity.tagUids ?? [];

      // If tagUids are being updated, handle belongsTo field updates
      // Verify all new tags exist
      const tagRefs = newTagUids.map((tagUid) => doc(this.firestore, 'tags', tagUid));

      const tagDocs = await Promise.all(tagRefs.map((ref) => transaction.get(ref)));

      const existingTagUids = tagDocs.reduce((uids: string[], doc) => {
        if (doc.exists()) {
          uids.push(doc.id);
        }
        return uids;
      }, []);

      tagDocs.forEach((tagDoc) => {
        if (!tagDoc.exists()) {
          // just move onto the next one
          return;
        }
        const belongsTo = stringArraySchema.parse(tagDoc.data().belongsTo ?? []);

        const isTagInCurrentUpdateTags = newTagUids.includes(tagDoc.id);

        const newBelongsTo = isTagInCurrentUpdateTags
          ? unique([...belongsTo, uid])
          : belongsTo.filter((uid) => uid !== uid);

        transaction.update(doc(this.firestore, 'tags', tagDoc.id), { belongsTo: newBelongsTo });
      });

      const updateData = {
        ...entity,
        tagUids: existingTagUids,
        updatedAt: Timestamp.now(),
      };

      transaction.update(targetNoteDocRef, updateData);

      // Return the updated data (note: serverTimestamp() will be resolved after transaction)
      const data = { uid: targetNoteDocSnap.id, ...targetNoteDocSnap.data(), ...updateData };
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
  async removeTagFromNote(noteUid: string, tagUid: string): Promise<NoteWithUidSchema | null> {
    return runTransaction(this.firestore, async (tx) => {
      const docRef = this.getDocRef(noteUid);
      const note = await tx.get(docRef);
      const tag = await tx.get(doc(this.firestore, `tags/${tagUid}`));
      console.log('here');
      if (note.exists()) {
        tx.update(docRef, {
          tagUids: arrayRemove(tagUid),
        });
      }
      if (tag.exists()) {
        tx.update(doc(this.firestore, `tags/${tagUid}`), {
          belongsTo: arrayRemove(noteUid),
        });
      }
      return note.exists()
        ? noteWithUidSchema.parse({
            ...note.data(),
            uid: noteUid,
          })
        : null;
    });
  }

  async toggleChecklistItem(noteId: string, itemId: string): Promise<NoteWithUidSchema> {
    return runTransaction(this.firestore, async (tx) => {
      const docRef = this.getDocRef(noteId);
      const note = await tx
        .get(docRef)
        .then((doc) => {
          if (!doc.exists()) {
            throw new NotFoundError('Failed to find Note');
          }
          return noteWithUidSchema.parse({
            ...doc.data(),
            uid: noteId,
          });
        })
        .catch((err: unknown) => {
          if (err instanceof ZodError) {
            throw new ValidationError(err);
          }
          throw err;
        });

      // Type guard
      if (note.type !== 'CHECKLIST') {
        throw new ValidationError('Note must be of the CHECKLIST type');
      }

      // Find item and toggle
      const itemIndex = note.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) {
        throw new ValidationError(`Item with id ${itemId} not found`);
      }

      const updatedItems = [...note.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        done: !updatedItems[itemIndex].done,
      };

      const update = {
        items: updatedItems,
        updatedAt: Timestamp.now(),
      };

      tx.update(docRef, update);

      return {
        ...note,
        ...update,
      };
    });
  }

  async addChecklistItem(
    noteId: string,
    item: { id: string; text: string; done: boolean }
  ): Promise<NoteWithUidSchema> {
    return runTransaction(this.firestore, async (tx) => {
      const docRef = this.getDocRef(noteId);
      const note = await tx
        .get(docRef)
        .then((doc) => {
          if (!doc.exists()) {
            throw new NotFoundError('Failed to find Note');
          }
          return noteWithUidSchema.parse({
            ...doc.data(),
            uid: noteId,
          });
        })
        .catch((err: unknown) => {
          if (err instanceof ZodError) {
            throw new ValidationError(err);
          }
          throw err;
        });

      if (note.type !== 'CHECKLIST') {
        throw new ValidationError('Note must be of the CHECKLIST type');
      }

      // Validate item doesn't already exist
      if (note.items.some((i) => i.id === item.id)) {
        throw new ValidationError(`Item with id ${item.id} already exists`);
      }

      const updatedItems = [...note.items, item];

      const update = {
        items: updatedItems,
        updatedAt: Timestamp.now(),
      };

      tx.update(docRef, update);

      return {
        ...note,
        ...update,
      };
    });
  }

  async removeChecklistItem(noteId: string, itemId: string): Promise<NoteWithUidSchema> {
    return runTransaction(this.firestore, async (tx) => {
      const docRef = this.getDocRef(noteId);
      const note = await tx
        .get(docRef)
        .then((doc) => {
          if (!doc.exists()) {
            throw new NotFoundError('Failed to find Note');
          }
          return noteWithUidSchema.parse({
            ...doc.data(),
            uid: noteId,
          });
        })
        .catch((err: unknown) => {
          if (err instanceof ZodError) {
            throw new ValidationError(err);
          }
          throw err;
        });

      if (note.type !== 'CHECKLIST') {
        throw new ValidationError('Note must be of the CHECKLIST type');
      }

      const updatedItems = note.items.filter((i) => i.id !== itemId);

      if (updatedItems.length === note.items.length) {
        throw new ValidationError(`Item with id ${itemId} not found`);
      }

      const update = {
        items: updatedItems,
        updatedAt: Timestamp.now(),
      };

      tx.update(docRef, update);

      return {
        ...note,
        ...update,
      };
    });
  }
}
