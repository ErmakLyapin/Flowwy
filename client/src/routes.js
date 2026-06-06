// src/routes.js
import Admin from './pages/Admin';
import Main from './pages/Main';
import Auth from './pages/Auth';
import Shops from './pages/Shops';
import Employees from './pages/Employees';  // ← добавить
import { ADMIN_ROUTE, MAIN_ROUTE, LOGIN_ROUTE, REG_ROUTE, SHOPS_ROUTE, EMPLOYEES_ROUTE } from './utils/consts';

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: SHOPS_ROUTE,
        Component: Shops
    },
    {
        path: EMPLOYEES_ROUTE,
        Component: Employees
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