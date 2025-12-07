import type { Route } from './+types/root';
import { AuthPage } from '~/components/pages/auth';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Notero - Home' }, { name: 'description', content: 'Notero - Home' }];
}

export default function LoginRoute() {
  return <AuthPage />;
}
