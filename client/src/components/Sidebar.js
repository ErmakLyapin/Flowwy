// src/components/Sidebar.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    ADMIN_PROD, 
    BOUQUETS_ROUTE, 
    EMPLOYEE_PROD, 
    EMPLOYEES_ROUTE, 
    SHOPS_ROUTE, 
    SUPPLIES_ROUTE,
    CREATE_BOUQUET_ROUTE,
    CREATE_ORDER,
    EMP_ORDERS
} from '../utils/consts';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { userRole, logout } = useContext(AuthContext);

    // Меню для администратора
    const adminMenu = [
        { 
            name: 'Магазины', 
            path: SHOPS_ROUTE,
            icon: '🏪'
        },
        { 
            name: 'Сотрудники', 
            path: EMPLOYEES_ROUTE,
            icon: '👥'
        },
        { 
            name: 'Поставки', 
            path: SUPPLIES_ROUTE,
            icon: '🚚'
        },
        { 
            name: 'Товары в магазинах', 
            path: ADMIN_PROD,
            icon: '📦'
        },
        { 
            name: 'Дашборд', 
            path: '/admin/dashboard',
            icon: '📊'
        },
        { 
            name: 'Заказы', 
            path: '/admin/orders',
            icon: '📋'
        },
        { 
            name: 'Отчеты', 
            path: '/admin/reports',
            icon: '📊'
        }
    ];

    // Меню для сотрудника
    const employeeMenu = [
        { 
            name: 'Заказы', 
            path: EMP_ORDERS,
            icon: '📋'
        },
        { 
            name: 'Букеты', 
            path: BOUQUETS_ROUTE,
            icon: '💐'
        },
        { 
            name: 'Создать букет', 
            path: CREATE_BOUQUET_ROUTE,
            icon: '✨'
        },
        { 
            name: 'Товары', 
            path: EMPLOYEE_PROD,
            icon: '📦'
        },
        { 
            name: 'Создать заказ', 
            path: CREATE_ORDER,
            icon: '🛒'
        }
    ];

    const menuItems = userRole === 'admin' ? adminMenu : employeeMenu;

    // Если роль не определена, не показываем панель
    if (!userRole) {
        return null;
    }

    return (
        <>
            {/* Зона наведения (левая часть экрана) */}
            <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: isOpen ? '280px' : '15px',
                    height: '100vh',
                    zIndex: 1000,
                    transition: 'width 0.3s ease'
                }}
            >
                {/* Сама панель */}
                <div style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: isOpen ? '280px' : '0',
                    height: '100vh',
                    backgroundColor: '#1a1a2e',
                    color: 'white',
                    overflow: 'hidden',
                    transition: 'width 0.3s ease',
                    boxShadow: isOpen ? '2px 0 10px rgba(0,0,0,0.3)' : 'none',
                    zIndex: 1001
                }}>
                    {/* Шапка панели */}
                    <div style={{
                        padding: '30px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#4caf50'
                        }}>
                            FLOWWY
                        </div>
                    </div>

                    {/* Меню */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                    }}>
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    console.log('Navigating to:', item.path);
                                    navigate(item.path);
                                    setIsOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '12px 20px',
                                    margin: '0 10px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                <span style={{ fontSize: '14px' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Нижняя часть панели (выход) */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div
                            onClick={() => {
                                logout();
                                navigate('/login');
                                setIsOpen(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                color: '#ff6b6b'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>🚪</span>
                            <span style={{ fontSize: '14px' }}>Выйти</span>
                        </div>
                    </div>
                </div>

                {/* Подсказка при закрытой панели */}
                {!isOpen && (
                    <div style={{
                        position: 'fixed',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: '#1a1a2e',
                        color: 'white',
                        padding: '10px 5px',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '12px',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        cursor: 'pointer',
                        zIndex: 1000
                    }}>
                        МЕНЮ
                    </div>
                )}
            </div>

            {/* Сдвигаем основной контент при открытой панели */}
            <style>{`
                body {
                    margin-left: ${isOpen ? '280px' : '15px'};
                    transition: margin-left 0.3s ease;
                }
            `}</style>
        </>
    );
};

export default Sidebar;