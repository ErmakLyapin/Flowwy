const { Bouquet_in_order, Bouquet, Order } = require('../models/models');
const ApiError = require('../error/ApiError');

class BouquetInOrderController {
    // GET /api/bouquet_in_order — получить все записи
    async Get(req, res, next) {
        try {
            const items = await Bouquet_in_order.findAll({
                include: [
                    { model: Bouquet },
                    { model: Order }
                ]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении записей: ' + error.message));
        }
    }

    // GET /api/bouquet_in_order/order/:order_id — получить букеты в заказе
    async GetByOrder(req, res, next) {
        try {
            const { order_id } = req.params;
            const items = await Bouquet_in_order.findAll({
                where: { order_id },
                include: [{ model: Bouquet }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении букетов заказа: ' + error.message));
        }
    }

    // GET /api/bouquet_in_order/bouquet/:bouquet_id — получить заказы с букетом
    async GetByBouquet(req, res, next) {
        try {
            const { bouquet_id } = req.params;
            const items = await Bouquet_in_order.findAll({
                where: { bouquet_id },
                include: [{ model: Order }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении заказов: ' + error.message));
        }
    }

    // GET /api/bouquet_in_order/:order_id/:bouquet_id — получить одну запись
    async GetId(req, res, next) {
        try {
            const { order_id, bouquet_id } = req.params;
            const item = await Bouquet_in_order.findOne({
                where: { order_id, bouquet_id },
                include: [
                    { model: Bouquet },
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

    // POST /api/bouquet_in_order — создать запись
    async Post(req, res, next) {
        try {
            const { order_id, bouquet_id, quantity, price_at_time } = req.body;
            
            if (!order_id || !bouquet_id || !quantity) {
                return next(ApiError.badRequest('order_id, bouquet_id, quantity обязательны'));
            }
            
            const existing = await Bouquet_in_order.findOne({
                where: { order_id, bouquet_id }
            });
            
            if (existing) {
                await existing.update({
                    quantity: existing.quantity + quantity
                });
                return res.json(existing);
            }
            
            const item = await Bouquet_in_order.create({
                order_id,
                bouquet_id,
                quantity,
                price_at_time
            });
            
            return res.status(201).json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании записи: ' + error.message));
        }
    }

    // PUT /api/bouquet_in_order/:order_id/:bouquet_id — обновить количество
    async Put(req, res, next) {
        try {
            const { order_id, bouquet_id } = req.params;
            const { quantity } = req.body;
            
            const item = await Bouquet_in_order.findOne({
                where: { order_id, bouquet_id }
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

    // DELETE /api/bouquet_in_order/:order_id/:bouquet_id — удалить запись
    async Delet(req, res, next) {
        try {
            const { order_id, bouquet_id } = req.params;
            
            const item = await Bouquet_in_order.findOne({
                where: { order_id, bouquet_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await item.destroy();
            return res.json({ message: 'Букет удалён из заказа' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении: ' + error.message));
        }
    }
}

module.exports = new BouquetInOrderController();