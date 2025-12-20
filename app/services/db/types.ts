import { collection, doc, type Firestore } from '@firebase/firestore';

import type { NoteWithUidSchema, CreateNoteSchema } from '~/types/Notes/NoteSchema';
import type { TagWithUidSchema, CreateTagSchema } from '~/types/Tags/TagSchema';

export type RepositoryType = 'Notes' | 'Tags';

type Entity = NoteWithUidSchema | TagWithUidSchema;

export type RepositoryTypeToEntity<T extends RepositoryType> = T extends 'Notes'
  ? NoteWithUidSchema
  : T extends 'Tags'
    ? TagWithUidSchema
    : never;

type MappedCreate<T extends Entity> = T extends NoteWithUidSchema
  ? CreateNoteSchema
  : T extends TagWithUidSchema
    ? CreateTagSchema
    : never;

export interface Repository<Type extends RepositoryType> {
  get(id: string): Promise<RepositoryTypeToEntity<Type> | null>;
  create(entity: MappedCreate<RepositoryTypeToEntity<Type>>): Promise<RepositoryTypeToEntity<Type>>;
  update(
    uid: string,
    payload: Partial<Omit<RepositoryTypeToEntity<Type>, 'uid' | 'deletedAt' | 'deletedBy'>>
  ): Promise<RepositoryTypeToEntity<Type>>;
  delete(id: string): Promise<RepositoryTypeToEntity<Type>>;
}

export abstract class RepositoryBase<T extends RepositoryType> implements Repository<T> {
  private readonly collectionName: string;
  protected constructor(
    protected firestore: Firestore,
    collectionName: string
  ) {
    this.collectionName = collectionName;
  }

  protected getDocRef(id: string) {
    return doc(this.firestore, this.collectionName, id);
  }

  protected initDocRef() {
    return doc(this.getCollectionRef());
  }

  protected getCollectionRef() {
    return collection(this.firestore, this.collectionName);
  }
  create(_entity: MappedCreate<RepositoryTypeToEntity<T>>): Promise<RepositoryTypeToEntity<T>> {
    throw new Error('Method not implemented in subclass.');
  }
  update(
    _uid: string,
    _payload: Partial<Omit<RepositoryTypeToEntity<T>, 'uid' | 'deletedAt' | 'deletedBy'>>
  ): Promise<RepositoryTypeToEntity<T>> {
    throw new Error('Method not implemented in subclass.');
  }
  delete(_id: string): Promise<RepositoryTypeToEntity<T>> {
    throw new Error('Method not implemented in subclass.');
  }
  get(_id: string): Promise<RepositoryTypeToEntity<T> | null> {
    throw new Error('Method not implemented in subclass.');
  }
}
