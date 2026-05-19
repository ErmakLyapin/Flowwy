const { Product_in_bouquet, Product, Bouquet } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductInBouquetController {
    // GET /api/product_in_bouquet — получить все записи
    async Get(req, res, next) {
        try {
            const items = await Product_in_bouquet.findAll({
                include: [
                    { model: Product },
                    { model: Bouquet }
                ]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении записей: ' + error.message));
        }
    }

    // GET /api/product_in_bouquet/bouquet/:bouquet_id — получить товары в букете
    async GetByBouquet(req, res, next) {
        try {
            const { bouquet_id } = req.params;
            const items = await Product_in_bouquet.findAll({
                where: { bouquet_id },
                include: [{ model: Product }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении состава букета: ' + error.message));
        }
    }

    // GET /api/product_in_bouquet/product/:product_id — получить букеты с товаром
    async GetByProduct(req, res, next) {
        try {
            const { product_id } = req.params;
            const items = await Product_in_bouquet.findAll({
                where: { product_id },
                include: [{ model: Bouquet }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении букетов: ' + error.message));
        }
    }

    // GET /api/product_in_bouquet/:bouquet_id/:product_id — получить одну запись
    async GetId(req, res, next) {
        try {
            const { bouquet_id, product_id } = req.params;
            const item = await Product_in_bouquet.findOne({
                where: { bouquet_id, product_id },
                include: [
                    { model: Product },
                    { model: Bouquet }
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

    // POST /api/product_in_bouquet — создать запись
    async Post(req, res, next) {
        try {
            const { bouquet_id, product_id, quantity } = req.body;
            
            if (!bouquet_id || !product_id || !quantity) {
                return next(ApiError.badRequest('bouquet_id, product_id, quantity обязательны'));
            }
            
            const existing = await Product_in_bouquet.findOne({
                where: { bouquet_id, product_id }
            });
            
            if (existing) {
                await existing.update({
                    quantity: existing.quantity + quantity
                });
                return res.json(existing);
            }
            
            const item = await Product_in_bouquet.create({
                bouquet_id,
                product_id,
                quantity
            });
            
            return res.status(201).json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании записи: ' + error.message));
        }
    }

    // PUT /api/product_in_bouquet/:bouquet_id/:product_id — обновить количество
    async Put(req, res, next) {
        try {
            const { bouquet_id, product_id } = req.params;
            const { quantity } = req.body;
            
            const item = await Product_in_bouquet.findOne({
                where: { bouquet_id, product_id }
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

    // DELETE /api/product_in_bouquet/:bouquet_id/:product_id — удалить запись
    async Delet(req, res, next) {
        try {
            const { bouquet_id, product_id } = req.params;
            
            const item = await Product_in_bouquet.findOne({
                where: { bouquet_id, product_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await item.destroy();
            return res.json({ message: 'Товар удалён из букета' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении: ' + error.message));
        }
    }
}

module.exports = new ProductInBouquetController();