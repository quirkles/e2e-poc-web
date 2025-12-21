import { IconButton } from '~/components/Elements/IconButton';
import { FlexContainer } from '~/components/Layout/Flex';
import { NoteContainer } from '~/components/Pages/App/Usernotes/components/NoteContainer';
import type { NoteWithUid } from '~/types/Notes/Note';
import type { TagWithUid } from '~/types/Tags/Tag';

interface NoteCardProps {
  note: NoteWithUid;
  tags: TagWithUid[];
  onNoteDelete: (noteId: string) => void;
  handleEditClick: () => void;
}

export function TextNoteCard({ note, onNoteDelete, handleEditClick, tags }: NoteCardProps) {
  return (
    <NoteContainer
      note={note}
      tags={tags}
      handleEditClick={handleEditClick}
      onNoteDelete={() => {
        onNoteDelete(note.uid);
      }}
    >
      <FlexContainer direction="col" gap={2}>
        <h3 className="text-black text-lg font-semibold mb-2 pr-16">{note.title}</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
        <div className="mt-3 text-xs text-gray-500">
          <span>Created: {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</span>
        </div>
      </FlexContainer>
    </NoteContainer>
  );
}
