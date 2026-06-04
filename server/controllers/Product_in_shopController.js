const { Product_in_shop, Product, Shop } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class ProductInShopController {
    // GET /api/product_in_shop — получить все записи
    async Get(req, res, next) {
        try {
            const items = await Product_in_shop.findAll({
                include: [
                    { model: Product },
                    { model: Shop }
                ]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении записей: ' + error.message));
        }
    }

    // GET /api/product_in_shop/available?shop_id=1 — товары в наличии (quantity > 0)
    async GetAvailable(req, res, next) {
        try {
            const { shop_id } = req.query;
            
            if (!shop_id) {
                return next(ApiError.badRequest('shop_id обязателен'));
            }
            
            const items = await Product_in_shop.findAll({
                where: {
                    shop_id: shop_id,
                    quantity: { [Op.gt]: 0 }
                },
                include: [{ model: Product }]
            });
            
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении товаров: ' + error.message));
        }
    }

    // GET /api/product_in_shop/shop/:shop_id — все товары в магазине
    async GetByShop(req, res, next) {
        try {
            const { shop_id } = req.params;
            const items = await Product_in_shop.findAll({
                where: { shop_id },
                include: [{ model: Product }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении товаров магазина: ' + error.message));
        }
    }

    // GET /api/product_in_shop/product/:product_id — все магазины с товаром
    async GetByProduct(req, res, next) {
        try {
            const { product_id } = req.params;
            const items = await Product_in_shop.findAll({
                where: { product_id },
                include: [{ model: Shop }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении магазинов: ' + error.message));
        }
    }

    // GET /api/product_in_shop/:product_id/:shop_id — получить одну запись
    async GetId(req, res, next) {
        try {
            const { product_id, shop_id } = req.params;
            const item = await Product_in_shop.findOne({
                where: { product_id, shop_id },
                include: [
                    { model: Product },
                    { model: Shop }
                ]
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            return res.json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении записи: ' + error.message));
        }
    }

    // POST /api/product_in_shop — добавить товар в магазин
    async Post(req, res, next) {
        try {
            const { product_id, shop_id, quantity } = req.body;
            
            if (!product_id || !shop_id) {
                return next(ApiError.badRequest('product_id и shop_id обязательны'));
            }
            
            let existing = await Product_in_shop.findOne({
                where: { product_id, shop_id }
            });
            
            if (existing) {
                await existing.update({
                    quantity: existing.quantity + (quantity || 0)
                });
                return res.json(existing);
            }
            
            const item = await Product_in_shop.create({
                product_id,
                shop_id,
                quantity: quantity || 0
            });
            
            return res.status(201).json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при добавлении товара: ' + error.message));
        }
    }

    // PUT /api/product_in_shop/:product_id/:shop_id — обновить количество
    async Put(req, res, next) {
        try {
            const { product_id, shop_id } = req.params;
            const { quantity } = req.body;
            
            const item = await Product_in_shop.findOne({
                where: { product_id, shop_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await item.update({ quantity });
            return res.json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении: ' + error.message));
        }
    }

    // DELETE /api/product_in_shop/:product_id/:shop_id — удалить товар из магазина
    async Delet(req, res, next) {
        try {
            const { product_id, shop_id } = req.params;
            
            const item = await Product_in_shop.findOne({
                where: { product_id, shop_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await item.destroy();
            return res.json({ message: 'Товар удалён из магазина' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении: ' + error.message));
        }
    }
}

module.exports = new ProductInShopController();