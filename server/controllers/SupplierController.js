const { Supplier } = require('../models/models');
const ApiError = require('../error/ApiError');

class SupplierController {
    async Get(req, res, next) {
        try {
            const administrator_id = req.user.id;
            const suppliers = await Supplier.findAll({
                where: { administrator_id }
            });
            return res.json(suppliers);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставщиков: ' + error.message));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            const supplier = await Supplier.findOne({
                where: { id, administrator_id }
            });
            
            if (!supplier) {
                return next(ApiError.badRequest('Поставщик не найден'));
            }
            
            return res.json(supplier);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставщика: ' + error.message));
        }
    }

    async Post(req, res, next) {
        try {
            const { supplier_name, supplier_telephone } = req.body;
            const administrator_id = req.user.id;
            
            if (!supplier_name) {
                return next(ApiError.badRequest('supplier_name обязателен'));
            }
            
            const supplier = await Supplier.create({ 
                supplier_name, 
                supplier_telephone,
                administrator_id
            });
            
            return res.status(201).json(supplier);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании поставщика: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { supplier_name, supplier_telephone } = req.body;
            const administrator_id = req.user.id;
            
            const supplier = await Supplier.findOne({
                where: { id, administrator_id }
            });
            
            if (!supplier) {
                return next(ApiError.badRequest('Поставщик не найден'));
            }
            
            await supplier.update({
                supplier_name: supplier_name || supplier.supplier_name,
                supplier_telephone: supplier_telephone !== undefined ? supplier_telephone : supplier.supplier_telephone
            });
            
            return res.json(supplier);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении поставщика: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            
            const supplier = await Supplier.findOne({
                where: { id, administrator_id }
            });
            
            if (!supplier) {
                return next(ApiError.badRequest('Поставщик не найден'));
            }
            
            await supplier.destroy();
            
            return res.json({ message: 'Поставщик успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении поставщика: ' + error.message));
        }
    }
}

module.exports = new SupplierController();