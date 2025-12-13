import type { Route } from './+types/RootRoute';

import { UserNotesPage } from '~/components/Pages/App/Usernotes';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Notero - Home' }, { name: 'description', content: 'Notero - Home' }];
}

export default function UserNotesRoute() {
  return <UserNotesPage />;
}
