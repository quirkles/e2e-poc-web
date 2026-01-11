import { FlexContainer } from '~/components/Layout/Flex';
import { NoteContainer } from '~/components/Pages/App/Usernotes/components/NoteContainer';
import type { NoteWithUid } from '~/types/Notes/Note';
import type { TagWithUid } from '~/types/Tags/Tag';

interface ImageNoteCardProps {
  note: NoteWithUid & { type: 'IMAGE'; imageUrl: string };
  tags: TagWithUid[];
  onNoteDelete: (noteId: string) => void;
  handleEditClick: () => void;
}

export function ImageNoteCard({ note, onNoteDelete, handleEditClick, tags }: ImageNoteCardProps) {
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
        <div
          style={{
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <img
            src={note.imageUrl}
            alt={note.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '300px',
              objectFit: 'contain',
              backgroundColor: '#f3f4f6',
            }}
          />
        </div>
        {note.content && <p className="text-gray-700 whitespace-pre-wrap mt-2">{note.content}</p>}
        <div className="mt-3 text-xs text-gray-500">
          <span>Created: {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</span>
        </div>
      </FlexContainer>
    </NoteContainer>
  );
}
