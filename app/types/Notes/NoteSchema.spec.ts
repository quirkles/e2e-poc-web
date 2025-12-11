import { Timestamp } from '@firebase/firestore';
import { describe, expect, it } from 'vitest';

import { NoteTypes } from './Note';
import { noteWithUidSchema } from './NoteSchema';

const mockTimestamp = Timestamp.now();

describe('NoteSchema', () => {
  describe('Note variants', () => {
    it('validates TODO note with uid', () => {
      const validTodoNote = {
        uid: 'test-uid-1',
        type: NoteTypes.TODO,
        authorId: 'author-123',
        title: 'Test Todo',
        content: 'Test content',
        done: false,
        dueDate: mockTimestamp,
        completedAt: null,
        createdAt: mockTimestamp,
        updatedAt: null,
        deletedAt: null,
      };

      const result = noteWithUidSchema.safeParse(validTodoNote);
      expect(result.success).toBe(true);

      const { uid: _uid, ...withoutUid } = validTodoNote;
      const resultWithoutUid = noteWithUidSchema.safeParse(withoutUid);
      expect(resultWithoutUid.success).toBe(false);
    });

    it('validates TEXT note with uid', () => {
      const validTextNote = {
        uid: 'test-uid-2',
        type: NoteTypes.TEXT,
        authorId: 'author-123',
        title: 'Test Text Note',
        content: 'Test content',
        createdAt: mockTimestamp,
        updatedAt: null,
        deletedAt: null,
      };

      const result = noteWithUidSchema.safeParse(validTextNote);
      expect(result.success).toBe(true);

      const { uid: _uid, ...withoutUid } = validTextNote;
      const resultWithoutUid = noteWithUidSchema.safeParse(withoutUid);
      expect(resultWithoutUid.success).toBe(false);
    });

    it('validates REMINDER note with uid', () => {
      const validReminderNote = {
        uid: 'test-uid-3',
        type: NoteTypes.REMINDER,
        authorId: 'author-123',
        title: 'Test Reminder',
        content: 'Test content',
        reminderAt: mockTimestamp,
        createdAt: mockTimestamp,
        updatedAt: null,
        deletedAt: null,
      };

      const result = noteWithUidSchema.safeParse(validReminderNote);
      expect(result.success).toBe(true);

      const { uid: _uid, ...withoutUid } = validReminderNote;
      const resultWithoutUid = noteWithUidSchema.safeParse(withoutUid);
      expect(resultWithoutUid.success).toBe(false);
    });

    it('validates IMAGE note with uid', () => {
      const validImageNote = {
        uid: 'test-uid-4',
        type: NoteTypes.IMAGE,
        authorId: 'author-123',
        title: 'Test Image',
        content: 'Test content',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: mockTimestamp,
        updatedAt: null,
        deletedAt: null,
      };

      const result = noteWithUidSchema.safeParse(validImageNote);
      expect(result.success).toBe(true);

      const { uid: _uid, ...withoutUid } = validImageNote;
      const resultWithoutUid = noteWithUidSchema.safeParse(withoutUid);
      expect(resultWithoutUid.success).toBe(false);
    });

    it('validates BOOKMARK note with uid', () => {
      const validBookmarkNote = {
        uid: 'test-uid-5',
        type: NoteTypes.BOOKMARK,
        authorId: 'author-123',
        title: 'Test Bookmark',
        content: 'Test content',
        url: 'https://example.com',
        createdAt: mockTimestamp,
        updatedAt: null,
        deletedAt: null,
      };

      const result = noteWithUidSchema.safeParse(validBookmarkNote);
      expect(result.success).toBe(true);

      const { uid: _uid, ...withoutUid } = validBookmarkNote;
      const resultWithoutUid = noteWithUidSchema.safeParse(withoutUid);
      expect(resultWithoutUid.success).toBe(false);
    });

    it('validates CHECKLIST note with uid', () => {
      const validChecklistNote = {
        uid: 'test-uid-6',
        type: NoteTypes.CHECKLIST,
        authorId: 'author-123',
        title: 'Test Checklist',
        content: 'Test content',
        items: [
          { id: 'item-1', text: 'Item 1', done: false },
          { id: 'item-2', text: 'Item 2', done: true },
        ],
        createdAt: mockTimestamp,
        updatedAt: null,
        deletedAt: null,
      };

      const result = noteWithUidSchema.safeParse(validChecklistNote);
      expect(result.success).toBe(true);

      const { uid: _uid, ...withoutUid } = validChecklistNote;
      const resultWithoutUid = noteWithUidSchema.safeParse(withoutUid);
      expect(resultWithoutUid.success).toBe(false);
    });
  });
});
