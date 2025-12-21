import type { TagWithUid } from '~/types/Tags/Tag';
import { getLsDistance } from '~/utils/levenshteinDistance';
import { normalizeString } from '~/utils/string';

type TagWithUidWithDistance = TagWithUid & {
  lsDistance: number;
};

const resultsCache: Record<string, TagWithUidWithDistance[]> = {};

export function getTagsToDisplay(
  tags: TagWithUid[],
  searchString: string
): TagWithUidWithDistance[] {
  // just return the empty array if the search string is less than 2 characters
  if (searchString.length <= 2) {
    return [];
  }
  const sorted = tags.toSorted((a, b) => a.normalizedContent.localeCompare(b.normalizedContent));

  const cacheKey = `${searchString}-${sorted.map((tag) => tag.uid).join('|')}`;
  if (cacheKey in resultsCache) {
    return resultsCache[cacheKey];
  }
  const withLsDistance: TagWithUidWithDistance[] = sorted
    .reduce((tags: TagWithUidWithDistance[], tag) => {
      const lsDistance = getLsDistance(searchString, tag.content);
      const containsSubstring = tag.normalizedContent
        .toLowerCase()
        .includes(normalizeString(searchString));
      if (containsSubstring || lsDistance < 3) {
        tags.push({
          ...tag,
          lsDistance,
        });
      }
      return tags;
    }, [])
    .toSorted((a, b) => a.lsDistance - b.lsDistance);
  return (resultsCache[cacheKey] = withLsDistance.slice(0, 10));
}
