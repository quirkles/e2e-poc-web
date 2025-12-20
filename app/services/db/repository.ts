import { fbDb } from '~/providers/firebase/FirebaseProvider';
import { NoteRepository } from '~/services/db/Notes';
import { TagRepository } from '~/services/db/Tag';
import type { Repository, RepositoryType } from '~/services/db/types';

export function getRepository(repo: 'Notes'): NoteRepository;
export function getRepository(repo: 'Tags'): TagRepository;
export function getRepository<T extends RepositoryType>(repo: T): Repository<T>;
export function getRepository(repo: RepositoryType): Repository<RepositoryType> {
  switch (repo) {
    case 'Notes':
      return new NoteRepository(fbDb);
    case 'Tags':
      return new TagRepository(fbDb);
    default:
      throw new Error(`Repository not found`);
  }
}
