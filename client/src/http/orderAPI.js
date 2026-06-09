// src/http/orderAPI.js
import { $authHost } from '../index';

// Получить все заказы (для сотрудника - только его магазина)
export const getOrders = async () => {
    const { data } = await $authHost.get('order');
    return data;
};

// Получить заказ по ID с товарами и букетами
export const getOrderById = async (id) => {
    const { data } = await $authHost.get(`order/${id}`);
    return data;
};

// Создать заказ
export const createOrder = async (orderData) => {
    const { data } = await $authHost.post('order', orderData);
    return data;
};

// Удалить заказ (только для админа)
export const deleteOrder = async (id) => {
    const { data } = await $authHost.delete(`order/${id}`);
    return data;
};