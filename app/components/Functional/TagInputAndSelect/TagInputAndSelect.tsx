import { useState } from 'react';

import { Button } from '~/components/Elements/Button';
import { Input } from '~/components/Form/Input';
import { FlexContainer } from '~/components/Layout/Flex';
import useUserTags from '~/hooks/useUserTags';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import type { TagWithUid } from '~/types/Tags/Tag';

interface TagInputAndSelectProps {
  onTagSelect: (tag: TagWithUid) => void;
}

export function TagInputAndSelect(_props: TagInputAndSelectProps) {
  const { auth } = useFirebase();
  const [textFieldValue, setTextFieldValue] = useState('');

  const { tags } = useUserTags(auth.currentUser?.uid ?? null);

  if (!auth.currentUser) {
    return null;
  }
  console.log('tags', tags);

  return (
    <FlexContainer gap={2}>
      <Input
        type="text"
        value={textFieldValue}
        onChange={(e) => {
          setTextFieldValue(e.target.value);
        }}
      />
      <Button variant="outline">Add</Button>
    </FlexContainer>
  );
}
