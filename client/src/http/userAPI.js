// src/http/userAPI.js
import { $host, $authHost } from '../index';

// ========== АДМИНИСТРАТОР ==========
// Регистрация администратора
export const registrationAdmin = async (adminData) => {
    const { data } = await $host.post('administrator/reg', adminData);
    localStorage.setItem('token', data.token);
    return data;
};

// Логин администратора
export const loginAdmin = async (administrator_login, password) => {
    const { data } = await $host.post('administrator/login', { administrator_login, password });
    localStorage.setItem('token', data.token);
    return data;
};

// ========== СОТРУДНИК ==========
// Логин сотрудника (регистрация будет через админа позже)
export const loginEmployee = async (employee_login, password) => {
    const { data } = await $host.post('employee/login', { employee_login, password });
    localStorage.setItem('token', data.token);
    return data;
};

// ========== ОБЩИЕ ==========
// Проверка токена
export const check = async () => {
    const { data } = await $authHost.get('administrator/auth/check');
    localStorage.setItem('token', data.token);
    return data;
};

// Получение всех администраторов
export const getAdministrators = async () => {
    const { data } = await $authHost.get('administrator');
    return data;
};