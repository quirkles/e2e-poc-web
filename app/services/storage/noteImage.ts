import { Timestamp, addDoc, collection, doc, setDoc } from '@firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { storageConfig } from '~/config/storage';
import { fbApp, fbDb } from '~/providers/firebase/FirebaseProvider';
import { ValidationError } from '~/types/Error';
import {
  noteImageFileWithUidSchema,
  type NoteImageFileWithUidSchema,
} from '~/types/Files/FileSchema';
import { NoteTypes, type NoteWithUid } from '~/types/Notes/Note';
import { noteWithUidSchema } from '~/types/Notes/NoteSchema';

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

function getFileExtension(filename: string): string | null {
  const parts = filename.split('.');
  if (parts.length < 2) {
    return null;
  }
  return parts[parts.length - 1].toLowerCase();
}

function isValidImageExtension(extension: string | null): extension is string {
  if (!extension) {
    return false;
  }
  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
}

export interface UploadNoteImageParams {
  userId: string;
  noteId: string;
  file: File;
}

export interface UploadNoteImageResult {
  fileRecord: NoteImageFileWithUidSchema;
  downloadUrl: string;
}

/**
 * Uploads an image file to Firebase Storage and creates a corresponding record in the files collection.
 *
 * @param params.userId - The UID of the user uploading the image
 * @param params.noteId - The UID of the note this image belongs to
 * @param params.file - The browser File object to upload
 * @returns The created file record and download URL
 * @throws ValidationError if the file doesn't have a valid image extension
 */
export async function uploadNoteImage(
  params: UploadNoteImageParams
): Promise<UploadNoteImageResult> {
  const { userId, noteId, file } = params;

  const extension = getFileExtension(file.name);

  if (!isValidImageExtension(extension)) {
    throw new ValidationError(
      `Invalid file type. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
    );
  }

  const storage = getStorage(fbApp, `gs://${storageConfig.bucket}`);

  const storagePath = `images/users/${userId}/notes/${noteId}/${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);

  const downloadUrl = await getDownloadURL(storageRef);

  const filesCollection = collection(fbDb, 'files');
  const fileData = {
    uploaderUid: userId,
    noteId,
    downloadUrl,
    filename: file.name,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(filesCollection, fileData);

  const fileRecord = noteImageFileWithUidSchema.parse({
    uid: docRef.id,
    ...fileData,
  });

  return {
    fileRecord,
    downloadUrl,
  };
}

export interface CreateImageNoteParams {
  userId: string;
  file: File;
  title: string;
  content?: string | null;
  tagUids?: string[];
}

export interface CreateImageNoteResult {
  note: NoteWithUid;
  fileRecord: NoteImageFileWithUidSchema;
}

/**
 * Creates an image note by uploading the image to storage and creating the note document.
 * Generates the note ID upfront so the image can be stored at the correct path.
 *
 * @param params.userId - The UID of the user creating the note
 * @param params.file - The browser File object to upload
 * @param params.title - The title of the note
 * @param params.content - Optional content/description for the note
 * @param params.tagUids - Optional array of tag UIDs to associate with the note
 * @returns The created note and file record
 * @throws ValidationError if the file doesn't have a valid image extension
 */
export async function createImageNote(
  params: CreateImageNoteParams
): Promise<CreateImageNoteResult> {
  const { userId, file, title, content = null, tagUids = [] } = params;

  const extension = getFileExtension(file.name);

  if (!isValidImageExtension(extension)) {
    throw new ValidationError(
      `Invalid file type. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
    );
  }

  // Generate the note document ID upfront
  const noteDocRef = doc(collection(fbDb, 'notes'));
  const noteId = noteDocRef.id;

  // Upload the image to storage
  const storage = getStorage(fbApp, `gs://${storageConfig.bucket}`);
  const storagePath = `images/users/${userId}/notes/${noteId}/${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  // Create the file record in Firestore
  const filesCollection = collection(fbDb, 'files');
  const fileData = {
    uploaderUid: userId,
    noteId,
    downloadUrl,
    filename: file.name,
    createdAt: Timestamp.now(),
  };
  const fileDocRef = await addDoc(filesCollection, fileData);

  const fileRecord = noteImageFileWithUidSchema.parse({
    uid: fileDocRef.id,
    ...fileData,
  });

  // Create the note document
  const noteData = {
    type: NoteTypes.IMAGE,
    authorUid: userId,
    title,
    content,
    imageUrl: downloadUrl,
    tagUids,
    createdAt: Timestamp.now(),
    updatedAt: null,
    deletedAt: null,
  };

  await setDoc(noteDocRef, noteData);

  const note = noteWithUidSchema.parse({
    uid: noteId,
    ...noteData,
  });

  return {
    note,
    fileRecord,
  };
}
