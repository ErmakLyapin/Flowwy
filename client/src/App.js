// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Sidebar from './components/Sidebar';
import { AuthContext } from './context/AuthContext';

const App = () => {
    const { isAuth } = useContext(AuthContext);

    return (
        <BrowserRouter>
            {isAuth && <Sidebar />}
            <div style={{ 
                marginLeft: isAuth ? '0' : '0',
                transition: 'margin-left 0.3s ease'
            }}>
                <AppRouter />
            </div>
        </BrowserRouter>
    );
};

export default App;