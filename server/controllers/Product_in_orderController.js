const { Product_in_order, Product, Order } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductInOrderController {
    // GET /api/product_in_order — получить все записи
    async Get(req, res, next) {
        try {
            const items = await Product_in_order.findAll({
                include: [
                    { model: Product },
                    { model: Order }
                ]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении записей: ' + error.message));
        }
    }

    // GET /api/product_in_order/order/:order_id — получить товары в заказе
    async GetByOrder(req, res, next) {
        try {
            const { order_id } = req.params;
            const items = await Product_in_order.findAll({
                where: { order_id },
                include: [{ model: Product }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении товаров заказа: ' + error.message));
        }
    }

    // GET /api/product_in_order/product/:product_id — получить заказы с товаром
    async GetByProduct(req, res, next) {
        try {
            const { product_id } = req.params;
            const items = await Product_in_order.findAll({
                where: { product_id },
                include: [{ model: Order }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении заказов: ' + error.message));
        }
    }

    // GET /api/product_in_order/:order_id/:product_id — получить одну запись
    async GetId(req, res, next) {
        try {
            const { order_id, product_id } = req.params;
            const item = await Product_in_order.findOne({
                where: { order_id, product_id },
                include: [
                    { model: Product },
                    { model: Order }
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

    // POST /api/product_in_order — создать запись
    async Post(req, res, next) {
        try {
            const { order_id, product_id, quantity, price_at_time } = req.body;
            
            if (!order_id || !product_id || !quantity) {
                return next(ApiError.badRequest('order_id, product_id, quantity обязательны'));
            }
            
            const existing = await Product_in_order.findOne({
                where: { order_id, product_id }
            });
            
            if (existing) {
                await existing.update({
                    quantity: existing.quantity + quantity
                });
                return res.json(existing);
            }
            
            const item = await Product_in_order.create({
                order_id,
                product_id,
                quantity,
                price_at_time
            });
            
            return res.status(201).json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании записи: ' + error.message));
        }
    }

    // PUT /api/product_in_order/:order_id/:product_id — обновить количество
    async Put(req, res, next) {
        try {
            const { order_id, product_id } = req.params;
            const { quantity } = req.body;
            
            const item = await Product_in_order.findOne({
                where: { order_id, product_id }
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

    // DELETE /api/product_in_order/:order_id/:product_id — удалить запись
    async Delet(req, res, next) {
        try {
            const { order_id, product_id } = req.params;
            
            const item = await Product_in_order.findOne({
                where: { order_id, product_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await item.destroy();
            return res.json({ message: 'Товар удалён из заказа' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении: ' + error.message));
        }
    }
}

module.exports = new ProductInOrderController();