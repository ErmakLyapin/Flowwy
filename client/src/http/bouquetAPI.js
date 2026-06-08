// src/http/bouquetAPI.js
import { $authHost } from '../index';

// Получить все букеты
export const getBouquets = async () => {
    const { data } = await $authHost.get('bouquet');
    return data;
};

// Создать букет
export const createBouquet = async (bouquetData) => {
    const { data } = await $authHost.post('bouquet', bouquetData);
    return data;
};

// Добавить товар в букет (и списать из магазина)
export const addProductToBouquet = async (bouquetId, productId, quantity, shopId) => {
    // 1. Сначала получаем текущий остаток
    const { data: shopProducts } = await $authHost.get(`product_in_shop/shop/${shopId}`);
    const productItem = shopProducts.find(item => item.product_id === parseInt(productId));
    
    if (!productItem) {
        throw new Error('Товар не найден в магазине');
    }
    
    const newQuantity = productItem.quantity - quantity;
    if (newQuantity < 0) {
        throw new Error('Недостаточно товара для создания букета');
    }
    
    // 2. Обновляем остаток
    await $authHost.put(`product_in_shop/${productId}/${shopId}`, {
        quantity: newQuantity
    });
    
    // 3. Добавляем товар в букет
    const { data } = await $authHost.post('product_in_bouquet', {
        bouquet_id: bouquetId,
        product_id: productId,
        quantity
    });
    return data;
};

// Получить товары в букете
export const getBouquetProducts = async (bouquetId) => {
    const { data } = await $authHost.get(`product_in_bouquet/bouquet/${bouquetId}`);
    return data;
};

// Удалить букет
export const deleteBouquet = async (id) => {
    const { data } = await $authHost.delete(`bouquet/${id}`);
    return data;
};