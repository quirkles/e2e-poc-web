import { Timestamp } from '@firebase/firestore';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/components/Elements/Button';
import { IconButton } from '~/components/Elements/IconButton';
import { ErrorMessage } from '~/components/Form/ErrorMessage';
import { Input } from '~/components/Form/Input';
import { Label } from '~/components/Form/Label';
import { Select } from '~/components/Form/Select';
import { Tag } from '~/components/Functional/TagInputAndSelect/Tag';
import { TagInputAndSelect } from '~/components/Functional/TagInputAndSelect/TagInputAndSelect';
import { FlexContainer, FlexChild } from '~/components/Layout/Flex';
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import { type Note, NoteTypes } from '~/types/Notes/Note';
import { type CreateNoteSchema, createNoteSchema } from '~/types/Notes/NoteSchema';
import type { TagWithUid } from '~/types/Tags/Tag';
import { dateToInputFormat } from '~/utils/date';
import { capitalize } from '~/utils/string';

export interface ImageNoteData {
  file: File;
  title: string;
  content: string | null;
  tagUids: string[];
}

const formSchema = z
  .object({
    type: z.enum(Object.keys(NoteTypes)),

    title: z.string().min(1, 'Title is required'),
    content: z.string().nullable(),

    done: z.boolean().optional(),
    dueDate: z.date().optional(),
    completedAt: z.date().optional().nullable(),

    reminderAt: z.date().optional(),

    imageUrl: z.string().optional(),
    items: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
          done: z.boolean(),
        })
      )
      .optional(),
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
        if (!Array.isArray(data.items) || data.items.length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'At least one item is required',
            path: ['items'],
          });
        } else {
          data.items.forEach((item, index) => {
            if (!item.text || item.text.trim() === '') {
              ctx.addIssue({
                code: 'custom',
                message: `Item ${index + 1} text cannot be empty`,
                path: ['items', index, 'text'],
              });
            }
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
  handleNoteSave: (noteData: CreateNoteSchema) => void;
  handleImageNoteSave?: (data: ImageNoteData) => Promise<void>;
  handleCancel?: () => void;
  note?: Note;
  tags?: TagWithUid[];
}
const formDefaultValues: CreateNoteFormData = {
  type: NoteTypes.TEXT,
  content: null,
  items: [],
  dueDate: addDays(new Date(), 7),
  reminderAt: addDays(new Date(), 7),
  title: '',
};

export function NoteForm(props: NoteFormProps) {
  const { handleNoteSave, handleImageNoteSave, handleCancel = null, note } = props;
  const { auth } = useFirebase();
  const [tags, setTags] = useState<TagWithUid[]>(props.tags ?? []);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [visibleFields, setVisibleFields] = useState({
    done: false,
    dueDate: false,
    completedAt: false,
    reminderAt: false,
    imageUrl: false,
    url: false,
    items: false,
  });

  const defaultValues = {
    ...formDefaultValues,
    ...(note ? getFormValuesFromNote(note) : {}),
  };

  const {
    clearErrors,
    getValues,
    formState: { isSubmitting, errors },
    setValue,
    reset,
    subscribe,
    trigger,
    register,
    control,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const [formValues, setFormValues] = useState<CreateNoteFormData>(defaultValues);

  useEffect(() => {
    const unsub = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        setFormValues(values);
      },
    });

    return () => {
      unsub();
    };
  }, [subscribe]);

  useEffect(() => {
    // Clear errors and reset isSubmitted when type changes
    clearErrors();
    setSubmitted(false);

    // Update visible fields based on selected type
    switch (formValues.type) {
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
  }, [formValues.type, trigger, clearErrors]);

  const onSubmitClick = async () => {
    const authorUid = auth.currentUser?.uid;
    if (!authorUid) {
      throw new Error('User not logged in');
    }

    const formData = getValues();

    // Handle image notes separately
    if (formData.type === NoteTypes.IMAGE) {
      if (!selectedFile) {
        setSubmitted(true);
        setError('Please select an image file');
        return;
      }

      if (!formData.title || formData.title.trim() === '') {
        setSubmitted(true);
        return;
      }

      if (!handleImageNoteSave) {
        setError('Image upload is not configured');
        return;
      }

      try {
        setSubmitted(false);
        setError(null);
        await handleImageNoteSave({
          file: selectedFile,
          title: formData.title,
          content: formData.content ?? null,
          tagUids: tags.map(({ uid }) => uid),
        });
        reset(formDefaultValues);
        setTags([]);
        setSelectedFile(null);
        setImagePreview(null);
      } catch (err) {
        console.log('create error', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      return;
    }

    const isValid = await trigger();
    setSubmitted(true);
    if (!isValid) {
      return;
    }
    try {
      setSubmitted(false);
      setError(null);
      handleNoteSave(
        getPayloadFromFormData(
          getValues(),
          authorUid,
          tags.map(({ uid }) => uid)
        )
      );
      reset(formDefaultValues);
      setTags([]);
    } catch (err) {
      console.log('create error', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleTagRemoveClick = (tag: TagWithUid) => {
    setTags(tags.filter((t) => t.uid !== tag.uid));
  };
  return (
    <div
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
        <FlexContainer gap={2} wrap="wrap">
          {tags.map((tag) => (
            <Tag key={tag.uid} tag={tag} onRemoveClick={handleTagRemoveClick} />
          ))}
        </FlexContainer>
        <FlexContainer gap={3} align="start">
          <FlexChild grow={1}>
            <Label htmlFor="newNoteTitle">Title</Label>
            <Input
              id="newNoteTitle"
              value={formValues.title}
              onChange={(e) => {
                setValue('title', e.target.value);
                trigger('title').catch(() => null);
              }}
            />
            {submitted && errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
          </FlexChild>

          <FlexChild flex="none">
            <Label htmlFor="newNoteType">Type</Label>
            <Select
              id="newNoteType"
              name="note-type"
              items={Object.entries(NoteTypes).sort(([a], [b]) => a.localeCompare(b))}
              getValue={([_, value]) => value}
              getDisplayText={([key]) => capitalize(key)}
              selectedValue={formValues.type}
              onChange={(value) => {
                setValue('type', value as keyof typeof NoteTypes);
              }}
            />
            {submitted && errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
          </FlexChild>
        </FlexContainer>

        <FlexContainer direction="col">
          <Label htmlFor="newNoteContent">Content</Label>
          <textarea
            id="newNoteContent"
            placeholder="Add additional details or notes here..."
            value={formValues.content ?? ''}
            onChange={(e) => {
              setValue('content', e.target.value);
            }}
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
          {submitted && errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
        </FlexContainer>

        {/* TODO type fields */}
        {visibleFields.dueDate && (
          <FlexContainer direction="col">
            <Label htmlFor="newNoteDueDate">Due Date (Optional)</Label>
            <Input
              id="newNoteDueDate"
              value={dateToInputFormat(formValues.dueDate)}
              onChange={(e) => {
                setValue('dueDate', new Date(e.target.value));
              }}
              type="datetime-local"
            />
            {submitted && errors.dueDate && <ErrorMessage>{errors.dueDate.message}</ErrorMessage>}
          </FlexContainer>
        )}

        {/* REMINDER type fields */}
        {visibleFields.reminderAt && (
          <FlexContainer direction="col">
            <Label htmlFor="newNoteReminderAt">Reminder Time</Label>
            <Input
              onChange={(e) => {
                setValue('reminderAt', new Date(e.target.value));
              }}
              value={dateToInputFormat(formValues.reminderAt)}
              id="newNoteReminderAt"
              type="datetime-local"
            />
            {submitted && errors.reminderAt && (
              <ErrorMessage>{errors.reminderAt.message}</ErrorMessage>
            )}
          </FlexContainer>
        )}

        {/* IMAGE type fields */}
        {visibleFields.imageUrl && (
          <FlexContainer direction="col">
            <Label htmlFor="imageFile">Image</Label>
            <input
              ref={fileInputRef}
              id="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setImagePreview(event.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                  setError(null);
                }
              }}
            />
            <div
              style={{
                width: '100%',
                minHeight: '200px',
                border: `2px dashed ${selectedFile ? '#22c55e' : '#ccc'}`,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                overflow: 'hidden',
                position: 'relative',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = selectedFile ? '#22c55e' : '#ccc';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#22c55e';
                const file = e.dataTransfer.files[0];
                if (file?.type.startsWith('image/')) {
                  setSelectedFile(file);
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setImagePreview(event.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                  setError(null);
                }
              }}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '180px',
                      objectFit: 'contain',
                    }}
                  />
                  <span style={{ marginTop: '8px', color: '#22c55e' }}>
                    {selectedFile?.name} - Click to change
                  </span>
                </>
              ) : (
                'Click to upload an image or drag and drop'
              )}
            </div>
            {submitted && !selectedFile && <ErrorMessage>Please select an image file</ErrorMessage>}
          </FlexContainer>
        )}

        {/* BOOKMARK type fields */}
        {visibleFields.url && (
          <FlexContainer direction="col">
            <Label htmlFor="newNoteBookmark">URL</Label>
            <Input
              id="newNoteBookmark"
              value={formValues.url}
              onChange={(e) => {
                setValue('url', e.target.value);
              }}
            />
            {submitted && errors.url && <ErrorMessage>{errors.url.message}</ErrorMessage>}
          </FlexContainer>
        )}

        {/* CHECKLIST type fields */}
        {visibleFields.items && (
          <FlexContainer direction="col" gap={2}>
            <Label htmlFor="items">Checklist Items</Label>

            {/* Existing items */}
            {fields.map((field, index) => (
              <FlexContainer key={field.id} gap={2} align="center">
                <FlexChild grow={1}>
                  <Input
                    {...register(`items.${index}.text`)}
                    placeholder="Item text"
                    defaultValue={field.text}
                  />
                </FlexChild>
                <IconButton
                  variant="delete"
                  aria-label="Remove item"
                  onClick={() => remove(index)}
                />
              </FlexContainer>
            ))}

            {/* Add button */}
            <Button
              type="button"
              onClick={() => {
                append({
                  id: crypto.randomUUID(),
                  text: '',
                  done: false,
                });
              }}
            >
              Add Item
            </Button>

            {submitted && errors.items && <ErrorMessage>{errors.items.message}</ErrorMessage>}
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
        <TagInputAndSelect
          onTagSelect={(tag) => {
            setTags([...tags, tag]);
          }}
        />

        <FlexContainer gap={3}>
          <FlexChild grow={1}>
            <Button
              type="button"
              disabled={isSubmitting}
              fullWidth
              onClick={() => {
                onSubmitClick().catch((err: unknown) => {
                  console.error('Error submitting form:', err);
                });
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </FlexChild>
          {handleCancel && (
            <FlexChild grow={1}>
              <Button
                type="button"
                color="yellow"
                onClick={() => {
                  reset();
                  handleCancel();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </FlexChild>
          )}
        </FlexContainer>
      </FlexContainer>
    </div>
  );
}

function getFormValuesFromNote(note: Note): CreateNoteFormData {
  const base = {
    type: note.type,
    title: note.title,
    content: note.content ?? null,
  };

  let data: unknown;

  switch (note.type) {
    case NoteTypes.TODO:
      data = {
        ...base,
        done: note.done,
        dueDate: note.dueDate?.toDate() ?? null,
        completedAt: note.completedAt?.toDate() ?? null,
      };
      break;
    case NoteTypes.TEXT:
      data = {
        ...base,
      };
      break;
    case NoteTypes.REMINDER:
      data = {
        ...base,
        reminderAt: note.reminderAt.toDate(),
      };
      break;
    case NoteTypes.IMAGE:
      data = {
        ...base,
        imageUrl: note.imageUrl,
      };
      break;
    case NoteTypes.BOOKMARK:
      data = {
        ...base,
        url: note.url,
      };
      break;
    case NoteTypes.CHECKLIST:
      data = {
        ...base,
        items: note.items,
      };
      break;
    default:
      throw new Error(`Unknown note type: ${(note as Note).type}`);
  }

  return formSchema.parse(data);
}

function getPayloadFromFormData(
  formData: CreateNoteFormData,
  authorUid: string,
  tagUids: string[]
): CreateNoteSchema {
  const basePayload: Record<string, unknown> = {
    authorUid,
    tagUids,
    type: formData.type,
    title: formData.title,
    content: formData.content ?? null,
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
