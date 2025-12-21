import { Tag } from '~/components/Functional/TagInputAndSelect/Tag';
import { FlexContainer } from '~/components/Layout/Flex';
import useUserTags from '~/hooks/useUserTags';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';

export function ControlPanel() {
  const { auth } = useFirebase();
  const { tags } = useUserTags(auth.currentUser?.uid ?? null);
  return (
    <FlexContainer gap={2}>
      {tags.map((tag) => (
        <Tag tag={tag} key={tag.uid} />
      ))}
    </FlexContainer>
  );
}
