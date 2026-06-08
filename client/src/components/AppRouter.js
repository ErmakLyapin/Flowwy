// src/components/AppRouter.js
import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes, employeeRoutes, publicRoutes } from '../routes';  // ← исправлено
import { MAIN_ROUTE } from '../utils/consts';
import { AuthContext } from '../context/AuthContext';
import EmployeeShopSelect from './EmployeeShopSelect';

const AppRouter = () => {
    const { isAuth, userRole } = useContext(AuthContext);
    const [needShopSelect, setNeedShopSelect] = useState(false);

    useEffect(() => {
        const selectedShopId = localStorage.getItem('selectedShopId');
        
        if (isAuth && userRole === 'employee' && !selectedShopId) {
            setNeedShopSelect(true);
        } else {
            setNeedShopSelect(false);
        }
    }, [isAuth, userRole]);

    const handleShopSelect = (shop) => {
        localStorage.setItem('selectedShopId', shop.id);
        localStorage.setItem('selectedShopName', shop.shop_name);
        setNeedShopSelect(false);
    };

    if (needShopSelect) {
        return <EmployeeShopSelect onSelect={handleShopSelect} />;
    }
    
    // Выбираем роуты в зависимости от роли
    const getRoutes = () => {
        if (userRole === 'admin') {
            return adminRoutes;
        } else if (userRole === 'employee') {
            return employeeRoutes;
        }
        return [];
    };
    
    return (
        <Routes>
            {isAuth && getRoutes().map(({path, Component}) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            {publicRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<Navigate to={MAIN_ROUTE} replace />} />
        </Routes>
    );
};

export default AppRouter;