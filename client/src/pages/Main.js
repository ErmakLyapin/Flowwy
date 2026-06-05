// src/pages/Main.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { AuthContext } from '../context/AuthContext';

const Main = () => {
    const navigate = useNavigate();
    const { isAuth, userName, userRole } = useContext(AuthContext);

    // Если не авторизован, показываем приветственную страницу
    if (!isAuth) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <NavBar />
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1 style={{
                        fontSize: '120px',
                        fontWeight: 'bold',
                        color: '#2e7d32',
                        textShadow: '4px 4px 8px rgba(0,0,0,0.2)',
                        letterSpacing: '10px'
                    }}>
                        FLOWWY
                    </h1>
                </div>
            </div>
        );
    }

    // Авторизован - показываем дашборд
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f7fa'
        }}>
            <NavBar />
            <div style={{
                padding: '30px',
                marginLeft: '20px'
            }}>
                <h1 style={{
                    color: '#333',
                    marginBottom: '20px'
                }}>
                </h1>
                
                {/* Заглушки для контента */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginTop: '30px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3>📊 Статистика</h3>
                        <p>Здесь будет отображаться статистика</p>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3>📋 Последние заказы</h3>
                        <p>Здесь будут последние заказы</p>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3>💐 Популярные букеты</h3>
                        <p>Здесь будут популярные букеты</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;