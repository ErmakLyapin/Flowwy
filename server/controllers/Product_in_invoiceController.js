const { Product_in_invoice, Product, Supply } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductInInvoiceController {
    // GET /api/product_in_invoice — получить все записи
    async Get(req, res, next) {
        try {
            const items = await Product_in_invoice.findAll({
                include: [
                    { model: Product },
                    { model: Supply }
                ]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении записей: ' + error.message));
        }
    }

    // GET /api/product_in_invoice/supply/:supply_id — получить товары в поставке
    async GetBySupply(req, res, next) {
        try {
            const { supply_id } = req.params;
            const items = await Product_in_invoice.findAll({
                where: { supply_id },
                include: [{ model: Product }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении товаров поставки: ' + error.message));
        }
    }

    // GET /api/product_in_invoice/product/:product_id — получить все поставки товара
    async GetByProduct(req, res, next) {
        try {
            const { product_id } = req.params;
            const items = await Product_in_invoice.findAll({
                where: { product_id },
                include: [{ model: Supply }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставок товара: ' + error.message));
        }
    }

    // GET /api/product_in_invoice/:product_id/:supply_id — получить одну запись
    async GetId(req, res, next) {
        try {
            const { product_id, supply_id } = req.params;
            const item = await Product_in_invoice.findOne({
                where: { product_id, supply_id },
                include: [
                    { model: Product },
                    { model: Supply }
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

    // POST /api/product_in_invoice — создать запись
    async Post(req, res, next) {
        try {
            const { product_id, supply_id, wholesale_price, quantity } = req.body;
            
            if (!product_id || !supply_id || !quantity) {
                return next(ApiError.badRequest('product_id, supply_id, quantity обязательны'));
            }
            
            const existing = await Product_in_invoice.findOne({
                where: { product_id, supply_id }
            });
            
            if (existing) {
                return next(ApiError.badRequest('Такая запись уже существует'));
            }
            
            const item = await Product_in_invoice.create({
                product_id,
                supply_id,
                wholesale_price,
                quantity
            });
            
            return res.status(201).json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании записи: ' + error.message));
        }
    }

    // PUT /api/product_in_invoice/:product_id/:supply_id — обновить запись
    async Put(req, res, next) {
        try {
            const { product_id, supply_id } = req.params;
            const { wholesale_price, quantity } = req.body;
            
            const item = await Product_in_invoice.findOne({
                where: { product_id, supply_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await item.update({ wholesale_price, quantity });
            return res.json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении записи: ' + error.message));
        }
    }

    // DELETE /api/product_in_invoice/:product_id/:supply_id — удалить запись
    async Delet(req, res, next) {
        try {
            const { product_id, supply_id } = req.params;
            
            const item = await Product_in_invoice.findOne({
                where: { product_id, supply_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await item.destroy();
            return res.json({ message: 'Запись удалена' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении записи: ' + error.message));
        }
    }
}

module.exports = new ProductInInvoiceController();