// src/http/customerAPI.js
import { $authHost } from '../index';

// Получить всех клиентов
export const getCustomers = async () => {
    const { data } = await $authHost.get('customer');
    return data;
};

// Создать клиента
export const createCustomer = async (customerData) => {
    const { data } = await $authHost.post('customer', customerData);
    return data;
};

// Обновить клиента
export const updateCustomer = async (id, customerData) => {
    const { data } = await $authHost.put(`customer/${id}`, customerData);
    return data;
};

// Удалить клиента
export const deleteCustomer = async (id) => {
    const { data } = await $authHost.delete(`customer/${id}`);
    return data;
};