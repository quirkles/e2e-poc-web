import { fbAuth, isAuthenticated } from '~/providers/firebase/FirebaseProvider';
import { redirect, useNavigate } from 'react-router';
import { type ReactNode, useEffect } from 'react';

export async function clientLoader() {
  const isAuthed = await isAuthenticated().catch((e: unknown) => {
    console.error('Failed to check auth', e);
    return false;
  });
  if (!isAuthed) {
    return redirect('/login');
  }
}

export default function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = fbAuth.onAuthStateChanged((user) => {
      if (!user) {
        const navPromise: void | Promise<void> = navigate('/login');
        if (navPromise instanceof Promise) {
          navPromise.catch((err: unknown) => {
            console.log('Navigation unsuccessful', err);
          });
        }
        return;
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);
  return children;
}
