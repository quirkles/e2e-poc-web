import type { Route } from './+types/RootRoute';
import { UserNotesPage } from '~/components/pages/App/Usernotes';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Notero - Home' }, { name: 'description', content: 'Notero - Home' }];
}

export default function UserNotesRoute() {
  return <UserNotesPage />;
}
