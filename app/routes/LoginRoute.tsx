import type { Route } from './+types/RootRoute';

import { AuthPage } from '~/components/Pages/Auth';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Notero - Home' }, { name: 'description', content: 'Notero - Home' }];
}

export default function LoginRoute() {
  return <AuthPage />;
}
