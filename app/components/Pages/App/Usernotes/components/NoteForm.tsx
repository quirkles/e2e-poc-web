import { Timestamp } from '@firebase/firestore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/components/Elements/Button';
import { ErrorMessage } from '~/components/Form/ErrorMessage';
import { Input } from '~/components/Form/Input';
import { Label } from '~/components/Form/Label';
import { Select } from '~/components/Form/Select';
import { FlexContainer, FlexChild } from '~/components/Layout/Flex';
import { type CreateNotePayload, type Note, NoteTypes } from '~/types/Notes/Note';
import { createNoteSchema } from '~/types/Notes/NoteSchema';
import { dateToInputFormat } from '~/utils/date';
import { capitalize } from '~/utils/string';

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
      })
    ),
    url: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    switch (data.type) {
      case NoteTypes.TODO:
        // done and completedAt are set automatically, dueDate is optional
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
  const [visibleFields, setVisibleFields] = useState({
    done: false,
    dueDate: false,
    completedAt: false,
    reminderAt: false,
    imageUrl: false,
    url: false,
    items: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: NoteTypes.TEXT,
      items: [],
      dueDate: new Date(),
      ...(note ? getFormValuesFromNote(note) : {}),
    },
  });

  const watchedType = watch('type');
  const watchedDueDate = watch('dueDate');
  console.log('duedate', { watchedDueDate, str: dateToInputFormat(watchedDueDate) });
  const watchedReminderAt = watch('reminderAt');

  useEffect(() => {
    // Clear errors and reset isSubmitted when type changes
    clearErrors();

    // Update visible fields based on selected type
    switch (watchedType) {
      case NoteTypes.TODO:
        setVisibleFields({
          done: false,
          dueDate: true,
          completedAt: false,
          reminderAt: false,
          imageUrl: false,
          url: false,
          items: false,
        });
        // Set default due date to 24 hours from now
        const tomorrow = new Date();
        tomorrow.setHours(tomorrow.getHours() + 24);
        setValue('dueDate', tomorrow);
        break;
      case NoteTypes.TEXT:
        setVisibleFields({
          done: false,
          dueDate: false,
          completedAt: false,
          reminderAt: false,
          imageUrl: false,
          url: false,
          items: false,
        });
        break;
      case NoteTypes.REMINDER:
        setVisibleFields({
          done: false,
          dueDate: false,
          completedAt: false,
          reminderAt: true,
          imageUrl: false,
          url: false,
          items: false,
        });
        break;
      case NoteTypes.IMAGE:
        setVisibleFields({
          done: false,
          dueDate: false,
          completedAt: false,
          reminderAt: false,
          imageUrl: true,
          url: false,
          items: false,
        });
        break;
      case NoteTypes.BOOKMARK:
        setVisibleFields({
          done: false,
          dueDate: false,
          completedAt: false,
          reminderAt: false,
          imageUrl: false,
          url: true,
          items: false,
        });
        break;
      case NoteTypes.CHECKLIST:
        setVisibleFields({
          done: false,
          dueDate: false,
          completedAt: false,
          reminderAt: false,
          imageUrl: false,
          url: false,
          items: true,
        });
        break;
      default:
        setVisibleFields({
          done: false,
          dueDate: false,
          completedAt: false,
          reminderAt: false,
          imageUrl: false,
          url: false,
          items: false,
        });
    }
  }, [watchedType, trigger, clearErrors]);

  const onSubmit = (data: CreateNoteFormData) => {
    try {
      setError(null);
      console.log('Note data', data);
      const payload = getPayloadFromFormData(data);
      console.log('Note payload', payload);
      // handleNoteSave(getPayloadFromFormData(data));
      reset({
        type: NoteTypes.TEXT,
        items: [],
      });
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
        console.log('errors', errors);
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
      <FlexContainer direction="col" gap={3}>
        <FlexContainer gap={3} align="start">
          <FlexChild flex={1}>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter a title for your note"
              {...register('title')}
            />
            {isSubmitted && errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
          </FlexChild>

          <FlexChild flex="none" style={{ minWidth: '150px' }}>
            <Label htmlFor="note-type">Type</Label>
            <Select
              name="note-type"
              items={Object.entries(NoteTypes)}
              getValue={([_, value]) => value}
              getDisplayText={([key]) => capitalize(key)}
              selectedValue={watchedType}
              onChange={(value) => {
                setValue('type', value as keyof typeof NoteTypes);
              }}
            />
            {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
          </FlexChild>
        </FlexContainer>

        <FlexContainer direction="col">
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            placeholder="Add additional details or notes here..."
            {...register('content')}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
              minHeight: '60px',
              resize: 'vertical',
            }}
          />
          {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
        </FlexContainer>

        {/* TODO type fields */}
        {visibleFields.dueDate && (
          <FlexContainer direction="col">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={watchedDueDate ? dateToInputFormat(watchedDueDate) : ''}
              {...register('dueDate', {
                setValueAs: (v: unknown) => (v && typeof v === 'string' ? new Date(v) : undefined),
              })}
            />
            {isSubmitted && errors.dueDate && <ErrorMessage>{errors.dueDate.message}</ErrorMessage>}
          </FlexContainer>
        )}

        {/* REMINDER type fields */}
        {visibleFields.reminderAt && (
          <FlexContainer direction="col">
            <Label htmlFor="reminderAt">Reminder Time</Label>
            <Input
              id="reminderAt"
              type="datetime-local"
              value={watchedReminderAt ? dateToInputFormat(watchedReminderAt) : ''}
              {...register('reminderAt', {
                setValueAs: (v: unknown) => (v && typeof v === 'string' ? new Date(v) : undefined),
              })}
            />
            {isSubmitted && errors.reminderAt && (
              <ErrorMessage>{errors.reminderAt.message}</ErrorMessage>
            )}
          </FlexContainer>
        )}

        {/* IMAGE type fields */}
        {visibleFields.imageUrl && (
          <FlexContainer direction="col">
            <Label htmlFor="imageUrl">Image</Label>
            <div
              style={{
                width: '100%',
                height: '200px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#999';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ccc';
              }}
            >
              Click to upload an image or drag and drop
            </div>
            <input id="imageUrl" type="hidden" {...register('imageUrl')} />
            {isSubmitted && errors.imageUrl && (
              <ErrorMessage>{errors.imageUrl.message}</ErrorMessage>
            )}
          </FlexContainer>
        )}

        {/* BOOKMARK type fields */}
        {visibleFields.url && (
          <FlexContainer direction="col">
            <Label htmlFor="url">URL</Label>
            <Input id="url" type="url" placeholder="https://example.com" {...register('url')} />
            {isSubmitted && errors.url && <ErrorMessage>{errors.url.message}</ErrorMessage>}
          </FlexContainer>
        )}

        {/* CHECKLIST type fields */}
        {visibleFields.items && (
          <FlexContainer direction="col">
            <Label htmlFor="items">Checklist Items</Label>
            <div
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <p style={{ color: '#999' }}>Add items to your checklist</p>
            </div>
            {isSubmitted && errors.items && <ErrorMessage>{errors.items.message}</ErrorMessage>}
          </FlexContainer>
        )}

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
