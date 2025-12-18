import type { NoteWithUidSchema, CreateNoteSchema } from '~/types/Notes/NoteSchema';

export type RepositoryType = 'Notes';

type Entity = NoteWithUidSchema;

export type RepositoryTypeToEntity<T extends RepositoryType> = T extends 'Notes'
  ? NoteWithUidSchema
  : never;

type MappedCreate<T extends Entity> = T extends NoteWithUidSchema ? CreateNoteSchema : never;

export interface Repository<
  Type extends RepositoryType,
  Saved extends Entity = RepositoryTypeToEntity<Type>,
  Create = MappedCreate<Saved>,
> {
  get(id: string): Promise<Saved | null>;
  create(entity: Create): Promise<Saved>;
  update(
    uid: string,
    payload: Partial<Omit<Saved, 'uid' | 'deletedAt' | 'deletedBy'>>
  ): Promise<Saved>;
  delete(id: string): Promise<Saved>;
}
