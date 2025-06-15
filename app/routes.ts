import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/index.tsx'),
    route('search', 'routes/search.tsx'),
    route('topic/:id', 'routes/topic.tsx')
    // route('components', 'routes/components.tsx'),
    // route('login', 'routes/login.tsx'),
    // route('register', 'routes/register.tsx'),
] satisfies RouteConfig;
