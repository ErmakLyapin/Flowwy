// src/http/employeeAPI.js
import { $authHost } from '../index';

// Получить всех сотрудников администратора (через связочную таблицу)
export const getAdminEmployees = async () => {
    const adminId = localStorage.getItem('userId');
    if (!adminId) {
        console.error('Admin ID not found');
        return [];
    }
    const { data } = await $authHost.get(`employee_in_administrator/administrator/${adminId}`);
    return data;
};

// Получить всех сотрудников
export const getAllEmployees = async () => {
    const { data } = await $authHost.get('employee');
    return data;
};

// Создать сотрудника
export const createEmployee = async (employeeData) => {
    const { data } = await $authHost.post('employee', employeeData);
    return data;
};

// Обновить сотрудника
export const updateEmployee = async (id, employeeData) => {
    const { data } = await $authHost.put(`employee/${id}`, employeeData);
    return data;
};

// Удалить сотрудника
export const deleteEmployee = async (id) => {
    const { data } = await $authHost.delete(`employee/${id}`);
    return data;
};

// Добавить сотрудника администратору
export const addEmployeeToAdministrator = async (administrator_id, employee_id) => {
    const { data } = await $authHost.post('employee_in_administrator', {
        administrator_id,
        employee_id
    });
    return data;
};

// Удалить связь сотрудника с администратором
export const removeEmployeeFromAdministrator = async (administrator_id, employee_id) => {
    const { data } = await $authHost.delete(`employee_in_administrator/${administrator_id}/${employee_id}`);
    return data;
};

// Привязать сотрудника к магазину
export const addEmployeeToShop = async (employee_id, shop_id) => {
    const { data } = await $authHost.post('employee_in_shop', {
        employee_id,
        shop_id
    });
    return data;
};

// Удалить привязку сотрудника к магазину
export const removeEmployeeFromShop = async (employee_id, shop_id) => {
    const { data } = await $authHost.delete(`employee_in_shop/${employee_id}/${shop_id}`);
    return data;
};

// Получить магазины сотрудника
export const getEmployeeShops = async (employee_id) => {
    const { data } = await $authHost.get(`employee_in_shop/employee/${employee_id}`);
    return data;
};

// Получить всех сотрудников магазина
export const getShopEmployees = async (shop_id) => {
    const { data } = await $authHost.get(`employee_in_shop/shop/${shop_id}`);
    return data;
};

export const resetEmployeePassword = async (id, newPassword) => {
    const { data } = await $authHost.put(`employee/reset-password/${id}`, { newPassword });
    return data;
};