// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [userName, setUserName] = useState(localStorage.getItem('userName'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));  // ← добавить

    const login = (token, role, name, id) => {  // ← добавить id
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userName', name);
        localStorage.setItem('userId', id);  // ← добавить
        setIsAuth(true);
        setUserRole(role);
        setUserName(name);
        setUserId(id);  // ← добавить
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');  // ← добавить
        setIsAuth(false);
        setUserRole(null);
        setUserName(null);
        setUserId(null);  // ← добавить
    };

    return (
        <AuthContext.Provider value={{ isAuth, userRole, userName, userId, login, logout }}> 
            {children}
        </AuthContext.Provider>
    );
};