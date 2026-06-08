// src/http/productAPI.js
import { $authHost } from '../index';

// Получить все типы товаров
export const getProductTypes = async () => {
    const { data } = await $authHost.get('product_type');
    return data;
};

// Получить все товары
export const getProducts = async () => {
    const { data } = await $authHost.get('product');
    return data;
};

// Получить товары по типу
export const getProductsByType = async (typeId) => {
    const { data } = await $authHost.get(`product?product_type_id=${typeId}`);
    return data;
};

// Получить остатки товаров в магазине
export const getShopProducts = async (shopId) => {
    const { data } = await $authHost.get(`product_in_shop/shop/${shopId}`);
    return data;
};

// Получить товары в наличии в магазине (quantity > 0)
export const getAvailableShopProducts = async (shopId) => {
    const { data } = await $authHost.get(`product_in_shop/available?shop_id=${shopId}`);
    return data;
};

// Добавить товар в магазин (увеличить остаток)  // ← ДОБАВИТЬ ЭТУ ФУНКЦИЮ
export const addProductToShop = async (productId, shopId, quantity) => {
    const { data } = await $authHost.post('product_in_shop', {
        product_id: productId,
        shop_id: shopId,
        quantity: quantity
    });
    return data;
};

// Списать товар (уменьшить количество)
export const writeOffProduct = async (productId, shopId, quantity) => {
    const { data } = await $authHost.put(`product_in_shop/writeoff/${productId}/${shopId}`, {
        quantity
    });
    return data;
};