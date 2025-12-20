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
      query(collection(db, 'tags'), where('userId', '==', userId)),
      (results) => {
        setTags(
          results.docs.reduce((validated: TagWithUid[], doc) => {
            const parseResult = tagWithUidSchema.safeParse(doc.data());
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
