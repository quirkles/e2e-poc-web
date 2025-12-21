import { fbDb } from '~/providers/firebase/FirebaseProvider';
import { NoteRepository } from '~/services/db/NoteRepository';
import { TagRepository } from '~/services/db/TagRepository';
import type { Repository, RepositoryType } from '~/services/db/types';

const singletons = {
  Notes: new NoteRepository(fbDb),
  Tags: new TagRepository(fbDb),
} as const;

export function getRepository(repo: 'Notes'): NoteRepository;
export function getRepository(repo: 'Tags'): TagRepository;
export function getRepository<T extends RepositoryType>(repo: T): Repository<T>;
export function getRepository(repo: RepositoryType): Repository<RepositoryType> {
  return singletons[repo];
}
