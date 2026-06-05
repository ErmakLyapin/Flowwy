// client/src/components/NavBar.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REG_ROUTE } from '../utils/consts';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
    const navigate = useNavigate();
    const { isAuth, userName, logout } = useContext(AuthContext);

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 50px',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            {/* Левая часть - название (кликабельное) */}
            <div 
                onClick={() => navigate('/')}
                style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#2e7d32',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
                FLOWWY
            </div>

            {/* Правая часть - кнопки */}
            <div style={{
                display: 'flex',
                gap: '15px'
            }}>
                {!isAuth ? (
                    // Не авторизован - показываем кнопки входа и регистрации
                    <>
                        <button
                            onClick={() => navigate(LOGIN_ROUTE)}
                            style={{
                                padding: '10px 25px',
                                fontSize: '16px',
                                backgroundColor: 'transparent',
                                color: '#2e7d32',
                                border: '2px solid #2e7d32',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#2e7d32';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#2e7d32';
                            }}
                        >
                            Войти
                        </button>
                        
                        <button
                            onClick={() => navigate(REG_ROUTE)}
                            style={{
                                padding: '10px 25px',
                                fontSize: '16px',
                                backgroundColor: 'transparent',
                                color: '#2e7d32',
                                border: '2px solid #2e7d32',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#2e7d32';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#2e7d32';
                            }}
                        >
                            Зарегистрироваться
                        </button>
                    </>
                ) : (
                    // Авторизован - показываем имя пользователя и кнопку выхода
                    <>
                        <span style={{
                            padding: '10px 20px',
                            color: '#2e7d32',
                            fontWeight: '500'
                        }}>
                            {userName || 'Пользователь'}
                        </span>
                        
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            style={{
                                padding: '10px 25px',
                                fontSize: '16px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#c82333';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#dc3545';
                            }}
                        >
                            Выйти
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;