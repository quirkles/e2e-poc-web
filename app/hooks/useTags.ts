import { useEffect, useState } from 'react';

import { getRepository } from '~/services/db/repository';
import type { TagWithUid } from '~/types/Tags/Tag';
import { uniqueWith } from '~/utils/array';

interface HookReturn {
  tags: TagWithUid[];
}
export default function useTags(tagUids: string[]): HookReturn {
  const [tags, setTags] = useState<TagWithUid[]>([]);
  const tagRepository = getRepository('Tags');
  useEffect(() => {
    tagUids.forEach((uid) => {
      tagRepository
        .get(uid)
        .then((tag) => {
          if (!tag) {
            return;
          }
          setTags((prevTags) => uniqueWith(prevTags.concat(tag), ({ uid }) => uid));
        })
        .catch((e: unknown) => {
          console.error(`Failed to get tag: ${uid}`, e);
        });
    });
    return () => {
      setTags([]);
    };
  }, [tagUids]);
  return { tags };
}
