// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [userName, setUserName] = useState(localStorage.getItem('userName'));

    const login = (token, role, name) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userName', name);
        setIsAuth(true);
        setUserRole(role);
        setUserName(name);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        setIsAuth(false);
        setUserRole(null);
        setUserName(null);
    };

    return (
        <AuthContext.Provider value={{ isAuth, userRole, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};