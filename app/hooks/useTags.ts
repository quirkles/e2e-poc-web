import { useEffect, useState } from 'react';

import { getRepository } from '~/services/db/repository';
import type { TagWithUid } from '~/types/Tags/Tag';

interface HookReturn {
  tags: TagWithUid[];
}
export default function useTags(tagUids: string[]): HookReturn {
  const [tags, setTags] = useState<TagWithUid[]>([]);
  const tagRepository = getRepository('Tags');
  useEffect(() => {
    void Promise.all(
      tagUids.map((uid) =>
        tagRepository.get(uid).catch((err: unknown) => {
          console.error(`Failed to get tag: ${uid}`, err);
          return null;
        })
      )
    ).then((tags) => {
      setTags(
        tags
          .reduce((toSet: TagWithUid[], tag) => {
            if (tag) {
              toSet.push(tag);
            }
            return toSet;
          }, [])
          .toSorted((a, b) => a.normalizedContent.localeCompare(b.normalizedContent))
      );
    });
  }, [tagUids]);
  return { tags };
}
