import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/RootRoute.tsx'),
  route('/login', 'routes/LoginRoute.tsx'),

  // Protected routes in here
  route('app', 'routes/AppRoute.tsx', [route('user/:userId/notes', 'routes/UserNotesRoute.tsx')]),

  route('*', './routes/NotFoundRoute.tsx'),
] satisfies RouteConfig;
