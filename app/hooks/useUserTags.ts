import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { useEffect, useState } from 'react';

import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import type { TagWithUid } from '~/types/Tags/Tag';
import { tagWithUidSchema } from '~/types/Tags/TagSchema';

interface HookReturn {
  tags: TagWithUid[];
}

export default function useUserTags(userId: string | null): HookReturn {
  const { db } = useFirebase();

  const [tags, setTags] = useState<TagWithUid[]>([]);
  useEffect(() => {
    if (userId === null) {
      return;
    }
    const subscribe = onSnapshot(
      query(collection(db, 'tags'), where('userUid', '==', userId)),
      (results) => {
        console.log('fetched', {
          userId,
          docCount: results.docs.length,
          docs: results.docs.map((doc) => doc.data()),
        });
        setTags(
          results.docs.reduce((validated: TagWithUid[], doc) => {
            const parseResult = tagWithUidSchema.safeParse({
              ...(doc.data() as Record<string, unknown>),
              uid: doc.id,
            });
            if (parseResult.success) {
              validated.push(parseResult.data);
            } else {
              console.error('Failed to parse tag', parseResult.error, doc.id, doc.data());
            }
            return validated;
          }, [])
        );
      }
    );
    return () => {
      subscribe();
    };
  }, [userId]);
  return { tags };
}
