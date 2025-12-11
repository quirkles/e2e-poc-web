import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/components/Elements/Button';
import { FlexContainer, FlexChild } from '~/components/Layout/Flex';
import { Select } from '~/components/Form/Select';
import { type CreateNotePayload, type Note, NoteTypes } from '~/types/Notes/Note';
import { createNoteSchema } from '~/types/Notes/NoteSchema';
import { Timestamp } from '@firebase/firestore';

const formSchema = z
  .object({
    type: z.enum(Object.keys(NoteTypes)),

    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),

    done: z.boolean().optional(),
    dueDate: z.date().optional(),
    completedAt: z.date().optional(),

    reminderAt: z.date().optional(),

    imageUrl: z.string().optional(),
    items: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
        done: z.boolean(),
      })
    ),
    url: z.string(),
  })
  .superRefine((data, ctx) => {
    switch (data.type) {
      case NoteTypes.TODO:
        if (data.done === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Done status is required for TODO notes',
            path: ['done'],
          });
        }
        if (data.dueDate === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Due date is required for TODO notes',
            path: ['dueDate'],
          });
        }
        if (data.completedAt === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Completed at is required for TODO notes',
            path: ['completedAt'],
          });
        }
        break;
      case NoteTypes.TEXT:
        break;
      case NoteTypes.REMINDER:
        if (data.reminderAt === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Reminder time is required for REMINDER notes',
            path: ['reminderAt'],
          });
        }
        break;
      case NoteTypes.IMAGE:
        if (data.imageUrl === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Image URL is required for IMAGE notes',
            path: ['imageUrl'],
          });
        }
        break;
      case NoteTypes.BOOKMARK:
        if (!data.url) {
          ctx.addIssue({
            code: 'custom',
            message: 'URL is required for BOOKMARK notes',
            path: ['url'],
          });
        }
        break;
      case NoteTypes.CHECKLIST:
        if (!Array.isArray(data.items)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Items are required for CHECKLIST notes',
            path: ['items'],
          });
        }
        break;
      default:
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid note type',
          path: ['type'],
        });
    }
  });

type CreateNoteFormData = z.infer<typeof formSchema>;

// Reverse function to convert form data to API payload
interface NoteFormProps {
  handleNoteSave: (noteData: CreateNotePayload) => void;
  handleCancel?: () => void;
  note?: Note;
}

export function NoteForm(props: NoteFormProps) {
  const { handleNoteSave, handleCancel = null, note } = props;
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...(note ? getFormValuesFromNote(note) : {}),
      type: NoteTypes.TEXT,
      items: [],
    },
  });

  const selectedType = watch('type');

  const onSubmit = (data: CreateNoteFormData) => {
    try {
      setError(null);
      handleNoteSave(getPayloadFromFormData(data));
      reset();
    } catch (err) {
      console.log('create error', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const doSubmit = handleSubmit(onSubmit);
        doSubmit(e).catch((err: unknown) => {
          console.error('Failed to submit form', err);
        });
      }}
      style={{
        border: '2px solid',
        borderRadius: '8px',
        padding: '24px',
        animation: 'pulse-border 3s ease-in-out infinite',
      }}
    >
      <style>
        {`
          @keyframes pulse-border {
            0%, 100% { border-color: #22c55e; }
            33% { border-color: #3b82f6; }
            66% { border-color: #a855f7; }
          }
        `}
      </style>

      <FlexContainer gap={3} className="mb-4" align="center">
        <FlexChild flex={1}>
          <input
            id="title"
            type="text"
            placeholder="Title"
            {...register('title')}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
          {errors.title && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.title.message}
            </span>
          )}
        </FlexChild>

        <FlexChild flex="none" style={{ minWidth: '150px' }}>
          <Select
            items={Object.entries(NoteTypes)}
            getValue={([_, value]) => value}
            getDisplayText={([key]) => key}
            selectedValue={selectedType}
            onChange={(value) => {
              setValue('type', value as keyof typeof NoteTypes);
            }}
          />
          {errors.type && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.type.message}
            </span>
          )}
        </FlexChild>
      </FlexContainer>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
        <textarea
          id="content"
          placeholder="Content"
          {...register('content')}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
            minHeight: '120px',
            resize: 'vertical',
          }}
        />
        {errors.content && (
          <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {errors.content.message}
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            color: '#ef4444',
            backgroundColor: '#fee2e2',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      <FlexContainer gap={3}>
        <FlexChild flex={1}>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </FlexChild>
        {handleCancel && (
          <FlexChild flex={1}>
            <Button
              type="button"
              variant="warning"
              onClick={() => {
                reset();
                handleCancel();
              }}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancel
            </Button>
          </FlexChild>
        )}
      </FlexContainer>
    </form>
  );
}

function getFormValuesFromNote(note: Note): CreateNoteFormData {
  let data: unknown;

  switch (note.type) {
    case NoteTypes.TODO:
      data = {
        type: note.type,
        title: note.title,
        content: note.content,
        done: note.done,
        dueDate: note.dueDate?.toDate() ?? null,
        completedAt: note.completedAt?.toDate() ?? null,
      };
      break;
    case NoteTypes.TEXT:
      data = {
        type: note.type,
        title: note.title,
        content: note.content,
      };
      break;
    case NoteTypes.REMINDER:
      data = {
        type: note.type,
        title: note.title,
        content: note.content,
        reminderAt: note.reminderAt.toDate(),
      };
      break;
    case NoteTypes.IMAGE:
      data = {
        type: note.type,
        title: note.title,
        content: note.content,
        imageUrl: note.imageUrl,
      };
      break;
    case NoteTypes.BOOKMARK:
      data = {
        type: note.type,
        title: note.title,
        content: note.content,
        url: note.url,
      };
      break;
    case NoteTypes.CHECKLIST:
      data = {
        type: note.type,
        title: note.title,
        content: note.content,
        items: note.items,
      };
      break;
    default:
      throw new Error(`Unknown note type: ${(note as Note).type}`);
  }

  return formSchema.parse(data);
}

function getPayloadFromFormData(formData: CreateNoteFormData): CreateNotePayload {
  const basePayload: Record<string, unknown> = {
    type: formData.type,
    title: formData.title,
    content: formData.content,
  };

  switch (formData.type) {
    case NoteTypes.TODO:
      basePayload.type = NoteTypes.TODO;
      basePayload.done = formData.done ?? false;
      basePayload.dueDate = formData.dueDate ? Timestamp.fromDate(formData.dueDate) : null;
      basePayload.completedAt = formData.completedAt
        ? Timestamp.fromDate(formData.completedAt)
        : null;
      break;
    case NoteTypes.TEXT:
      basePayload.type = NoteTypes.TEXT;
      break;
    case NoteTypes.REMINDER:
      basePayload.type = NoteTypes.REMINDER;
      basePayload.reminderAt = formData.reminderAt ? Timestamp.fromDate(formData.reminderAt) : null;
      break;
    case NoteTypes.IMAGE:
      basePayload.type = NoteTypes.IMAGE;
      basePayload.imageUrl = formData.imageUrl;
      break;
    case NoteTypes.BOOKMARK:
      basePayload.type = NoteTypes.BOOKMARK;
      basePayload.url = formData.url;
      break;
    case NoteTypes.CHECKLIST:
      basePayload.type = NoteTypes.CHECKLIST;
      basePayload.items = formData.items;
      break;
    default:
      throw new Error(`Unknown note type: ${formData.type}`);
  }

  return createNoteSchema.parse(basePayload);
}
