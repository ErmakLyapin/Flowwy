import Admin from './pages/Admin';
import Main from './pages/Main';
import Auth from './pages/Auth';
import { ADMIN_ROUTE, MAIN_ROUTE, LOGIN_ROUTE, REG_ROUTE } from './utils/consts';

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    }
];

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REG_ROUTE,
        Component: Auth
    }
];