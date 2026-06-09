// src/http/paymentTypeAPI.js
import { $authHost } from '../index';

// Получить все типы оплаты
export const getPaymentTypes = async () => {
    const { data } = await $authHost.get('payment_type');
    return data;
};

// Создать тип оплаты
export const createPaymentType = async (typeData) => {
    const { data } = await $authHost.post('payment_type', typeData);
    return data;
};

// Обновить тип оплаты
export const updatePaymentType = async (id, typeData) => {
    const { data } = await $authHost.put(`payment_type/${id}`, typeData);
    return data;
};

// Удалить тип оплаты
export const deletePaymentType = async (id) => {
    const { data } = await $authHost.delete(`payment_type/${id}`);
    return data;
};