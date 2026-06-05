// client/src/components/pages/Main.js
import React from 'react';
import NavBar from '../components/NavBar';

const Main = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <NavBar />

            {/* Центральная часть с надписью */}
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
                    letterSpacing: '10px',
                    animation: 'fadeIn 1s ease-in'
                }}>
                    FLOWWY
                </h1>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Main;