import { useState } from 'react';

import { Button } from '~/components/Elements/Button';
import { Input } from '~/components/Form/Input';
import { FlexContainer } from '~/components/Layout/Flex';
import useUserTags from '~/hooks/useUserTags';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import { getRepository } from '~/services/db/repository';
import type { TagWithUid } from '~/types/Tags/Tag';

interface TagInputAndSelectProps {
  onTagSelect: (tag: TagWithUid) => void;
}

export function TagInputAndSelect(_props: TagInputAndSelectProps) {
  const { auth } = useFirebase();
  const [textFieldValue, setTextFieldValue] = useState('');

  const { tags } = useUserTags(auth.currentUser?.uid ?? null);

  if (!auth.currentUser?.uid) {
    return null;
  }

  const authUserId = auth.currentUser.uid;

  const tagRepository = getRepository('Tags');

  const handleAddTagClick = () => {
    if (!textFieldValue || textFieldValue.trim().length === 0) {
      return;
    }
    void tagRepository
      .create({
        content: textFieldValue,
        belongsTo: [],
        userUid: authUserId,
      })
      .catch((e: unknown) => {
        console.error('Failed to create tag', e);
      })
      .then((tag) => {
        console.log('Tag created', tag);
      });
    setTextFieldValue('');
  };

  return (
    <FlexContainer direction="col">
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
      <FlexContainer>
        {tags.map((tag) => (
          <div key={tag.uid}>{tag.content}</div>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
}
