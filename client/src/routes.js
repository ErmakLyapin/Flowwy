// src/routes.js
import Admin from './pages/Admin';
import Main from './pages/Main';
import Auth from './pages/Auth';
import Shops from './pages/Shops';
import Employees from './pages/Employees';
import Supplies from './pages/Supplies';
import CreateSupply from './pages/CreateSupply';
import Products from './pages/Products';  // ← единая страница
import Bouquets from './pages/Bouquets';
import CreateBouquet from './pages/CreateBouquet';
import { 
    ADMIN_ROUTE, 
    MAIN_ROUTE, 
    LOGIN_ROUTE, 
    REG_ROUTE, 
    SHOPS_ROUTE, 
    EMPLOYEES_ROUTE, 
    SUPPLIES_ROUTE, 
    CREATE_SUPPLIES_ROUTE, 
    ADMIN_PROD, 
    EMPLOYEE_PROD,
    BOUQUETS_ROUTE,
    CREATE_BOUQUET_ROUTE
} from './utils/consts';

// Роуты только для администратора
export const adminRoutes = [
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
    },
    {
        path: SUPPLIES_ROUTE,
        Component: Supplies
    },
    {
        path: CREATE_SUPPLIES_ROUTE,
        Component: CreateSupply
    },
    {
        path: ADMIN_PROD,
        Component: () => <Products userRole="admin" />  // ← передаём роль
    }
];

// Роуты только для сотрудника
export const employeeRoutes = [
    {
        path: EMPLOYEE_PROD,
        Component: () => <Products userRole="employee" />  // ← передаём роль
    },
    {
        path: BOUQUETS_ROUTE,
        Component: Bouquets
    },
    {
        path: CREATE_BOUQUET_ROUTE,
        Component: CreateBouquet
    }
];

// Публичные роуты
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