// src/http/shopAPI.js
import { $authHost } from '../index';  // ← также исправьте путь импорта (было '../index', должно быть './index')

// Получить все магазины администратора
export const getAdminShops = async () => {
    const adminId = localStorage.getItem('userId');
    if (!adminId) {
        console.error('Admin ID not found');
        return [];
    }
    const { data } = await $authHost.get(`shop_in_administrator/administrator/${adminId}`);
    return data;
};

// Получить все магазины
export const getAllShops = async () => {
    const { data } = await $authHost.get('shop');
    return data;
};

// Создать магазин
export const createShop = async (shopData) => {
    const { data } = await $authHost.post('shop', shopData);
    return data;
};

// Обновить магазин
export const updateShop = async (id, shopData) => {
    const { data } = await $authHost.put(`shop/${id}`, shopData);
    return data;
};

// Удалить магазин
export const deleteShop = async (id) => {
    const { data } = await $authHost.delete(`shop/${id}`);
    return data;
};

// Добавить магазин администратору
export const addShopToAdministrator = async (administrator_id, shop_id) => {
    const { data } = await $authHost.post('shop_in_administrator', {  // ← подчеркивание!
        administrator_id,
        shop_id
    });
    return data;
};

// Удалить связь магазина с администратором
export const removeShopFromAdministrator = async (administrator_id, shop_id) => {
    const { data } = await $authHost.delete(`shop_in_administrator/${administrator_id}/${shop_id}`);  // ← подчеркивание!
    return data;
};