// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);