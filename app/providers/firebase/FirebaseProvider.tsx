import { getAuth, type User } from '@firebase/auth';
import { type Firestore, getFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

interface FirebaseContextType {
  auth: {
    logout: () => Promise<void>;
    currentUser: User | null;
  };
  db: Firestore;
}

// Create context
const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const fbApp = initializeApp(firebaseConfig);

export const fbAuth = getAuth(fbApp);

export function isAuthenticated(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = fbAuth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// Provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [authContextReturnValue, setAuthContextReturnValue] = useState<FirebaseContextType['auth']>(
    {
      logout: async () => {
        await fbAuth.signOut();
      },
      currentUser: fbAuth.currentUser ?? null,
    }
  );
  useEffect(() => {
    const unsubscribe = fbAuth.onAuthStateChanged((user: User | null) => {
      if (user === null) {
        console.log('auth change handler: no user');
        setAuthContextReturnValue({
          ...authContextReturnValue,
          currentUser: null,
        });
        return;
      }
      if (
        user.uid !== authContextReturnValue.currentUser?.uid ||
        user.email !== authContextReturnValue.currentUser.email ||
        user.displayName !== authContextReturnValue.currentUser.displayName
      ) {
        setAuthContextReturnValue((curr) => {
          return {
            ...curr,
            currentUser: user,
          };
        });
        return;
      }
      console.log(`auth change handler: same user: ${user.email ?? 'NONE'}`);
    });
    return () => {
      unsubscribe();
    };
  }, [setAuthContextReturnValue]);
  const contextValue: FirebaseContextType = {
    auth: authContextReturnValue,
    db: getFirestore(fbApp),
  };
  return <FirebaseContext.Provider value={contextValue}>{children}</FirebaseContext.Provider>;
}

// Hook to access Firebase app
export function useFirebase(): FirebaseContextType {
  const app = useContext(FirebaseContext);
  if (!app) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return app;
}
