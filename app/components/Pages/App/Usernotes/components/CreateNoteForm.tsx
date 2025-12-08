import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import type { CreateNotePayload, NoteWithUid } from '~/types/Notes/Note';

const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
});

type CreateNoteFormData = z.infer<typeof createNoteSchema>;

interface CreateNoteFormProps {
  handleNoteCreate: (noteData: CreateNotePayload) => Promise<NoteWithUid>;
}

export function CreateNoteForm(props: CreateNoteFormProps) {
  const { handleNoteCreate } = props;
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createNoteSchema),
  });

  const onSubmit = async (data: CreateNoteFormData) => {
    try {
      setError(null);
      await handleNoteCreate(data);
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

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
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
      </div>

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

      <button
        type="submit"
        // disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? '#9ca3af' : '#22c55e',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
