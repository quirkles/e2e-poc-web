import { redirect } from 'react-router';

import type { Route } from './+types/RootRoute';

import { isAuthenticated } from '~/providers/firebase/FirebaseProvider';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Notero - Home' }, { name: 'description', content: 'Notero - Home' }];
}

export default function RootRoute() {
  return null;
}

export async function clientLoader() {
  const isAuthed = await isAuthenticated().catch((e: unknown) => {
    console.error('Failed to check auth', e);
    return null;
  });
  if (!isAuthed) {
    return redirect('/login');
  } else {
    return redirect(`/app/user/${isAuthed.uid}/notes`);
  }
}
