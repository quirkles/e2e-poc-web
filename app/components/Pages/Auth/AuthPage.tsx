import { getAuth } from '@firebase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '~/components/Elements/Button';
import { errorFromCatch } from '~/utils/error';

const authSchema = z
  .object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().optional(),
    isSignUp: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isSignUp) {
        return data.confirmPassword && data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

type AuthFormData = z.infer<typeof authSchema>;

export function AuthPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      isSignUp: false,
    },
  });

  const isSignUp = form.watch('isSignUp');

  const navigateToHome = async (userId: string) => {
    await navigate(`/app/user/${userId}/notes`);
  };

  const toggleAuthMode = () => {
    form.setValue('isSignUp', !isSignUp);
    form.setValue('confirmPassword', '');
    setError('');
    form.trigger().catch((err: unknown) => {
      setError(errorFromCatch(err, 'Failed to toggle auth mode.').message);
    });
  };

  const handleSubmit = async () => {
    const result = await form.trigger();
    if (!result) {
      return;
    }

    const data = form.getValues();
    setError('');
    setLoading(true);

    try {
      if (data.isSignUp) {
        await createUserWithEmailAndPassword(auth, data.email, data.password).then(({ user }) => {
          return navigateToHome(user.uid);
        });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password).then(({ user }) => {
          return navigateToHome(user.uid);
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Authentication failed');
      } else {
        setError('Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register('email')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {form.formState.errors.email && (
                <p className="text-red-600 text-xs m-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                {...form.register('password')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {form.formState.errors.password && (
                <p className="text-red-600 text-xs m-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...form.register('confirmPassword')}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-600 text-xs m-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <Button
              type="button"
              onClick={() => {
                handleSubmit().catch((err: unknown) => {
                  setError(errorFromCatch(err, 'Failed to handle email auth.').message);
                });
              }}
              disabled={loading}
              variant="default"
              fullWidth
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
