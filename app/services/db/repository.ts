import { fbDb } from '~/providers/firebase/FirebaseProvider';
import { NoteRepository } from '~/services/db/Notes';
import type { Repository, RepositoryType } from '~/services/db/types';

export function getRepository(repo: 'Notes'): NoteRepository;
export function getRepository<T extends RepositoryType>(repo: T): Repository<T>;
export function getRepository(repo: RepositoryType): Repository<RepositoryType> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (repo === 'Notes') {
    return new NoteRepository(fbDb);
  }
  throw new Error(`Repository not found`);
}
