const { Product_type } = require('../models/models');
const ApiError = require('../error/ApiError');

class Product_typeController {
    async Get(req, res, next) {
        try {
            const administrator_id = req.user.id;
            const productTypes = await Product_type.findAll({
                where: { administrator_id }
            });
            return res.json(productTypes);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении типов товаров: ' + error.message));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            const productType = await Product_type.findOne({
                where: { id, administrator_id }
            });
            
            if (!productType) {
                return next(ApiError.badRequest('Тип товара не найден'));
            }
            
            return res.json(productType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении типа товара: ' + error.message));
        }
    }

    async Post(req, res, next) {
        try {
            const { product_type_name } = req.body;
            const administrator_id = req.user.id;
            
            if (!product_type_name) {
                return next(ApiError.badRequest('product_type_name обязателен'));
            }
            
            const productType = await Product_type.create({ 
                product_type_name,
                administrator_id
            });
            return res.status(201).json(productType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании типа товара: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { product_type_name } = req.body;
            const administrator_id = req.user.id;
            
            const productType = await Product_type.findOne({
                where: { id, administrator_id }
            });
            
            if (!productType) {
                return next(ApiError.badRequest('Тип товара не найден'));
            }
            
            await productType.update({ 
                product_type_name: product_type_name || productType.product_type_name 
            });
            
            return res.json(productType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении типа товара: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            
            const productType = await Product_type.findOne({
                where: { id, administrator_id }
            });
            
            if (!productType) {
                return next(ApiError.badRequest('Тип товара не найден'));
            }
            
            await productType.destroy();
            return res.json({ message: 'Тип товара успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении типа товара: ' + error.message));
        }
    }
}

module.exports = new Product_typeController();