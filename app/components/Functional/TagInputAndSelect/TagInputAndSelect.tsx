import { useEffect, useState } from 'react';

import { Button } from '~/components/Elements/Button';
import { Input } from '~/components/Form/Input';
import { Tag } from '~/components/Functional/TagInputAndSelect/Tag';
import { FlexContainer } from '~/components/Layout/Flex';
import useUserTags from '~/hooks/useUserTags';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import { getRepository } from '~/services/db/repository';
import type { TagWithUid } from '~/types/Tags/Tag';
import { getTagsToDisplay } from '~/types/Tags/utils';
import { normalizeString } from '~/utils/string';

interface TagInputAndSelectProps {
  onTagSelect: (tag: TagWithUid) => void;
}

export function TagInputAndSelect({ onTagSelect }: TagInputAndSelectProps) {
  const { auth } = useFirebase();
  const [textFieldValue, setTextFieldValue] = useState('');
  const [matchingTags, setMatchingTags] = useState<TagWithUid[]>([]);

  const { tags } = useUserTags(auth.currentUser?.uid ?? null);

  useEffect(() => {
    // Set a timeout to update debounced value after 500ms
    const handler = setTimeout(() => {
      setMatchingTags(getTagsToDisplay(tags, textFieldValue));
    }, 50);

    // Cleanup the timeout if `query` changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [textFieldValue]);

  if (!auth.currentUser?.uid) {
    return null;
  }

  const authUserId = auth.currentUser.uid;

  const tagRepository = getRepository('Tags');

  const handleAddTagClick = () => {
    if (!textFieldValue || textFieldValue.trim().length === 0) {
      return;
    }
    const existingTag = tags.find(
      (tag) => tag.normalizedContent === normalizeString(textFieldValue)
    );
    if (existingTag) {
      onTagSelect(existingTag);
      setTextFieldValue('');
      return;
    }
    void tagRepository
      .create({
        content: textFieldValue,
        belongsTo: [],
        userUid: authUserId,
      })
      .then((tag) => {
        onTagSelect(tag);
      })
      .catch((e: unknown) => {
        console.error('Failed to create tag', e);
      })
      .finally(() => {
        setTextFieldValue('');
      });
  };

  return (
    <FlexContainer direction="col" gap={1}>
      <FlexContainer gap={2}>
        <Input
          type="text"
          value={textFieldValue}
          onChange={(e) => {
            setTextFieldValue(e.target.value);
          }}
        />
        <Button variant="outline" onClick={handleAddTagClick}>
          Add
        </Button>
      </FlexContainer>
      <FlexContainer gap={2}>
        {matchingTags.map((tag) => (
          <Tag
            key={tag.uid}
            tag={tag}
            onClick={() => {
              setTextFieldValue('');
              onTagSelect(tag);
            }}
          />
        ))}
      </FlexContainer>
    </FlexContainer>
  );
}
