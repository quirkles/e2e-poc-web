# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 (formerly Remix) application built with TypeScript, React 19, Tailwind CSS v4, and Firebase (Firestore). The application uses server-side rendering (SSR) and is deployed to Google Cloud Run via Docker containers.

## Common Commands

### Development
```bash
npm run dev              # Start development server (http://localhost:5173)
npm run typecheck        # Generate types and run TypeScript check
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
```

### Build & Deploy
```bash
npm run build            # Production build (outputs to build/)
npm run start            # Start production server from build/

# Docker
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Environment Variables
All Firebase configuration uses `VITE_` prefix and is defined in `.env`:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

## Architecture

### React Router v7 Structure
React Router v7 is the successor to Remix, providing file-based routing with SSR capabilities.

**Route Configuration** (`app/routes.ts`):
```typescript
export default [
  index('routes/RootRoute.tsx'),
  route('/login', 'routes/LoginRoute.tsx'),
  route('app', 'routes/AppRoute.tsx', [
    route('user/:userId/notes', 'routes/UserNotesRoute.tsx')
  ]),
  route('*', './routes/NotFoundRoute.tsx'),
] satisfies RouteConfig;
```

Routes are defined in `app/routes/` directory. Protected routes are nested under the `app` route.

**Type-safe Route Imports**:
React Router v7 automatically generates types in `.react-router/types/`. Import route types with:
```typescript
import type { Route } from './+types/root';
```

### Firebase Integration

**FirebaseProvider** (`app/providers/firebase/FirebaseProvider.tsx`):
- Wraps entire app in `root.tsx`
- Provides Firebase Auth and Firestore via React context
- Manages auth state with `onAuthStateChanged` listener
- Exports singleton instances: `fbApp`, `fbAuth`, `fbDb`

**Access Firebase in Components**:
```typescript
const { auth, db } = useFirebase();
const currentUser = auth.currentUser;
```

### Repository Pattern

The app uses a repository pattern to abstract Firestore operations in `app/services/db/`.

**Base Repository** (`types.ts`):
- `RepositoryBase<T>` provides common Firestore helpers
- Generic CRUD interface: `get()`, `create()`, `update()`, `delete()`
- Each repository extends the base and implements specific business logic

**Repository Singletons** (`repository.ts`):
```typescript
const Notes = getRepository('Notes'); // Returns NoteRepository
const Tags = getRepository('Tags');   // Returns TagRepository
```

**Repository Features**:
- Type-safe with Zod schema validation on all operations
- Firestore transactions for data consistency
- Soft deletes (sets `deletedAt` timestamp)
- Automatic timestamp management (`createdAt`, `updatedAt`)
- Bidirectional relationship management (e.g., Note ↔ Tag belongsTo fields)

### Custom Hooks Pattern

Hooks in `app/hooks/` encapsulate Firestore real-time subscriptions and CRUD operations.

**Example** (`useNotes.ts`):
```typescript
const { notes, createNote, deleteNote, updateNote } = useNotes({ userUid });
```

**Hook Characteristics**:
- Real-time subscriptions via `onSnapshot`
- Zod validation on Firestore data
- Automatic cleanup of listeners
- Returns operations as async functions

### Component Organization

Components in `app/components/` are organized by category:
- `Elements/` - Basic UI components (buttons, inputs, etc.)
- `Form/` - Form components with react-hook-form integration
- `Functional/` - Logic-heavy components
- `Layout/` - Layout wrapper components
- `Pages/` - Page-level components

### Path Aliases

TypeScript is configured with `~/*` alias pointing to `app/*`:
```typescript
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import { getRepository } from '~/services/db/repository';
```

### Type Safety with Zod

All data schemas are defined with Zod in `app/types/`:
- Validate Firestore documents on read/write
- Generate TypeScript types with `z.infer<typeof schema>`
- Schema utilities in `app/utils/schema.utils.ts`

Pattern:
```typescript
// Define schema
const noteSchema = z.object({ title: z.string(), ... });

// Infer type
type Note = z.infer<typeof noteSchema>;

// Validate Firestore data
const note = noteSchema.parse(doc.data());
```

## Code Style

### ESLint Configuration
- TypeScript ESLint: recommended + strict + stylistic type-checked rules
- Import plugin with alphabetical ordering (builtin → external → internal → parent → sibling → index)
- Prettier integration for formatting
- Unused variables allowed with `_` prefix

### Prettier Configuration
- Single quotes
- Semicolons
- 100 character print width
- 2 space indentation
- ES5 trailing commas

### Import Conventions
```typescript
// 1. External packages (alphabetical)
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal with ~ alias (alphabetical)
import { useFirebase } from '~/providers/firebase/FirebaseProvider';
import { getRepository } from '~/services/db/repository';
```

## Deployment

### Docker Build
Multi-stage Dockerfile optimizes for production:
1. Install dev dependencies
2. Install prod dependencies separately
3. Build application
4. Final image with only prod dependencies + build output

### Cloud Build CI/CD
The `cloudbuild.yaml` pipeline:
1. Fetches secrets from Google Cloud Secret Manager (`web-env-file`)
2. Builds Docker image with commit SHA tag
3. Pushes to Artifact Registry
4. Deploys to Cloud Run in `northamerica-northeast2`

**Substitutions**:
- `_SERVICE_NAME`: web-frontend
- `_ARTIFACT_REGISTRY_REPO`: applications
- `_REGION`: northamerica-northeast2

### Production Build Output
```
build/
  ├── client/    # Static assets (served by CDN or nginx)
  └── server/    # Server-side code (Node.js)
```

## React Router v7 Conventions

### Route Exports
Routes can export these functions:
- `loader`: Server-side data loading (runs before render)
- `action`: Handle form submissions and mutations
- `meta`: Page metadata (title, description, etc.)
- `links`: Link tags for stylesheets, fonts, etc.
- `headers`: HTTP response headers
- `ErrorBoundary`: Error UI component
- `HydrateFallback`: Loading UI during hydration

### Root Layout
`app/root.tsx` provides the base HTML structure:
- `Layout` component wraps the entire app
- `App` component wraps routes with providers
- `ErrorBoundary` handles global errors
- `HydrateFallback` shows loading spinner during hydration

### Type-Safe Forms
Use `react-hook-form` with Zod resolvers for type-safe form handling:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(mySchema),
});
```

## Vite Configuration

Plugins in `vite.config.ts`:
- `@tailwindcss/vite`: Tailwind CSS v4 integration
- `@react-router/dev/vite`: React Router v7 plugin
- `vite-tsconfig-paths`: Support for `~/*` path aliases

## Authentication

**RequireAuth Component** (`app/components/RequireAuth.tsx`):
- Wraps protected routes
- Redirects to `/login` if user not authenticated
- Access current user via `useFirebase().auth.currentUser`
