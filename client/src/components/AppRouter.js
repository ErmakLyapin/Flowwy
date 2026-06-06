// src/components/AppRouter.js
import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { MAIN_ROUTE } from '../utils/consts';
import { AuthContext } from '../context/AuthContext';
import EmployeeShopSelect from './EmployeeShopSelect';

const AppRouter = () => {
    const { isAuth, userRole } = useContext(AuthContext);
    const [needShopSelect, setNeedShopSelect] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);

    useEffect(() => {
        // Проверяем, нужно ли выбрать магазин для сотрудника
        const selectedShopId = localStorage.getItem('selectedShopId');
        const role = localStorage.getItem('role');
        
        if (isAuth && role === 'employee' && !selectedShopId) {
            setNeedShopSelect(true);
        } else {
            setNeedShopSelect(false);
        }
    }, [isAuth, userRole]);

    const handleShopSelect = (shop) => {
        setSelectedShop(shop);
        setNeedShopSelect(false);
    };

    const handleSkipSelect = () => {
        setNeedShopSelect(false);
    };

    if (needShopSelect) {
        return <EmployeeShopSelect onSelect={handleShopSelect} onSkip={handleSkipSelect} />;
    }
    
    return (
        <Routes>
            {isAuth && authRoutes.map(({path, Component}) => (
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