// src/http/supplyAPI.js
import { $authHost } from '../index';

// Получить все поставки администратора
export const getAdminSupplies = async () => {
    const { data } = await $authHost.get('supply');
    return data;
};

// Получить поставку по ID
export const getSupplyById = async (id) => {
    const { data } = await $authHost.get(`supply/${id}`);
    return data;
};

// Создать поставку
export const createSupply = async (supplyData) => {
    const { data } = await $authHost.post('supply', supplyData);
    return data;
};

// Удалить поставку
export const deleteSupply = async (id) => {
    const { data } = await $authHost.delete(`supply/${id}`);
    return data;
};

// Получить товары в поставке
export const getSupplyProducts = async (supplyId) => {
    const { data } = await $authHost.get(`product_in_invoice/supply/${supplyId}`);
    return data;
};

// Добавить товар в поставку
export const addProductToSupply = async (productId, supplyId, wholesalePrice, quantity) => {
    const { data } = await $authHost.post('product_in_invoice', {
        product_id: productId,
        supply_id: supplyId,
        wholesale_price: wholesalePrice,
        quantity
    });
    return data;
};

// Удалить товар из поставки
export const removeProductFromSupply = async (productId, supplyId) => {
    const { data } = await $authHost.delete(`product_in_invoice/${productId}/${supplyId}`);
    return data;
};

// Получить всех поставщиков администратора
export const getAdminSuppliers = async () => {
    const { data } = await $authHost.get('supplier');
    return data;
};

// Создать нового поставщика
export const createSupplier = async (supplierData) => {  // ← добавить эту функцию
    const { data } = await $authHost.post('supplier', supplierData);
    return data;
};

// Получить все товары администратора
export const getAdminProducts = async () => {
    const { data } = await $authHost.get('product');
    return data;
};

// Создать новый товар
export const createProduct = async (productData) => {
    const { data } = await $authHost.post('product', productData);
    return data;
};

// Получить типы товаров
export const getProductTypes = async () => {
    const { data } = await $authHost.get('product_type');
    return data;
};

// Создать новый тип товара
export const createProductType = async (typeData) => {
    const { data } = await $authHost.post('product_type', typeData);
    return data;
};