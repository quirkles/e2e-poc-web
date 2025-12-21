import {
  DocumentSnapshot,
  type Firestore,
  getDoc,
  getDocs,
  query,
  runTransaction,
  where,
} from '@firebase/firestore';
import { ZodError } from 'zod';

import { type Repository, RepositoryBase } from '~/services/db/types';
import { ValidationError } from '~/types/Error';
import {
  type CreateTagSchema,
  tagWithUidSchema,
  type TagWithUidSchema,
} from '~/types/Tags/TagSchema';
import { uniqueConcat } from '~/utils/array';
import { normalizeString } from '~/utils/string';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITagRepository extends Repository<'Tags'> {}

export class TagRepository extends RepositoryBase<'Tags'> implements ITagRepository {
  private pendingGets: Record<string, null | Promise<DocumentSnapshot>> = {};
  constructor(firestore: Firestore) {
    super(firestore, 'tags');
  }
  async get(id: string): Promise<TagWithUidSchema | null> {
    let docPromise = this.pendingGets[id];
    if (!docPromise) {
      docPromise = getDoc(this.getDocRef(id));
      this.pendingGets[id] = docPromise;
    }
    const doc = await docPromise;
    if (!doc.exists()) {
      return null;
    }
    try {
      return tagWithUidSchema.parse({
        ...doc.data(),
        uid: doc.id,
      });
    } catch (e) {
      if (e instanceof ZodError) {
        throw new ValidationError(e);
      } else {
        throw e;
      }
    } finally {
      // Nuke the cache after ten seconds
      setTimeout(() => {
        this.pendingGets[id] = null;
      }, 10000);
    }
  }
  create(entity: CreateTagSchema): Promise<TagWithUidSchema> {
    const normalizedContent = normalizeString(entity.content);
    return runTransaction(this.firestore, async (transaction) => {
      const matchingExistingTagQuery = query(
        this.getCollectionRef(),
        where('content', '==', normalizedContent)
      );
      const matchingResults = await getDocs(matchingExistingTagQuery);
      if (matchingResults.docs.length > 0) {
        const matchingDoc = matchingResults.docs[0];
        try {
          const validated = tagWithUidSchema.parse(matchingDoc.data());
          if (entity.belongsTo.length > 0) {
            transaction.update(matchingDoc.ref, {
              belongsTo: uniqueConcat(validated.belongsTo, entity.belongsTo),
            });
          }
          return tagWithUidSchema.parse(transaction.get(matchingResults.docs[0].ref));
        } catch (e) {
          if (e instanceof ZodError) {
            throw new ValidationError(e);
          } else {
            throw e;
          }
        }
      }
      const newDoc = this.initDocRef();
      const newDocData = {
        ...entity,
        normalizedContent: normalizedContent,
      };
      transaction.set(newDoc, newDocData);
      return tagWithUidSchema.parse({
        ...newDocData,
        uid: newDoc.id,
      });
    });
  }
}
