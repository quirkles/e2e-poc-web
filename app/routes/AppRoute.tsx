import { Outlet } from 'react-router';

import { Header } from '~/components/Header';
import RequireAuth from '~/components/RequireAuth';

export default function AppRoute() {
  return (
    <RequireAuth>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </RequireAuth>
  );
}
