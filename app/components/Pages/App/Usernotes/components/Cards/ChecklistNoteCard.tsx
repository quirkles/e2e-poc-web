import { useState } from 'react';

import { Heading } from '~/components/Elements/Heading';
import { Checkbox } from '~/components/Form/Checkbox';
import { Input } from '~/components/Form/Input';
import { FlexChild, FlexContainer } from '~/components/Layout/Flex';
import { NoteContainer } from '~/components/Pages/App/Usernotes/components/NoteContainer';
import type { INoteRepository } from '~/services/db/NoteRepository';
import { getRepository } from '~/services/db/repository';
import type { ChecklistNoteWithUid } from '~/types/Notes/Note';
import type { TagWithUid } from '~/types/Tags/Tag';

interface NoteCardProps {
  note: ChecklistNoteWithUid;
  tags: TagWithUid[];
  onNoteDelete: (noteId: string) => void;
  handleEditClick: () => void;
}

export function ChecklistNoteCard({ note, onNoteDelete, handleEditClick, tags }: NoteCardProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [adding, setAdding] = useState(false);
  const noteRepository: INoteRepository = getRepository('Notes');

  const completedCount = note.items.filter((item: { done: boolean }) => item.done).length;
  const totalCount = note.items.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = async (itemId: string) => {
    if (updating) return;
    setUpdating(itemId);
    try {
      await noteRepository.toggleChecklistItem(note.uid, itemId);
    } catch (err: unknown) {
      console.error('Failed to toggle checklist item', err);
    }
    setUpdating(null);
  };

  const handleAddItem = async () => {
    if (!newItemText.trim() || adding) return;
    setAdding(true);
    try {
      await noteRepository.addChecklistItem(note.uid, {
        id: crypto.randomUUID(),
        text: newItemText.trim(),
        done: false,
      });
      setNewItemText('');
    } catch (err: unknown) {
      console.error('Failed to add checklist item', err);
    }
    setAdding(false);
  };

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
        {/* Progress Bar */}
        <FlexContainer direction="col" gap={1}>
          <p className="text-sm text-gray-600">
            {completedCount}/{totalCount} complete
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </FlexContainer>

        {/* Checklist Items */}
        {note.items.map((item: { id: string; text: string; done: boolean }) => (
          <FlexContainer align="center" gap={1} key={item.id}>
            <Checkbox
              isChecked={item.done}
              isDisabled={updating === item.id}
              onChange={() => {
                handleToggle(item.id).catch((err: unknown) => {
                  console.error('Failed to toggle item', err);
                });
              }}
            />
            <Heading
              level={4}
              textDecoration={item.done ? 'line-through' : 'none'}
              textColor={item.done ? 'gray-400' : 'gray-700'}
            >
              {item.text}
            </Heading>
          </FlexContainer>
        ))}

        {/* Quick Add Input */}
        <Input
          placeholder="Add item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddItem().catch((err: unknown) => {
                console.error('Failed to add item', err);
              });
            }
          }}
          disabled={adding}
        />

        {/* Timestamp */}
        <FlexChild alignSelf="end">
          <div className="mt-3 text-xs text-gray-500">
            <span>Created: {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</span>
          </div>
        </FlexChild>
      </FlexContainer>
    </NoteContainer>
  );
}
