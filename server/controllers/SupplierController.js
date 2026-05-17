const { Supplier } = require('../models/models');
const ApiError = require('../error/ApiError');

class SupplierController {
    async Get(req, res, next) {
        try {
            const suppliers = await Supplier.findAll();
            return res.json(suppliers);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставщиков'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const supplier = await Supplier.findByPk(id);
            
            if (!supplier) {
                return next(ApiError.badRequest('Поставщик не найден'));
            }
            
            return res.json(supplier);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставщика'));
        }
    }

    async Post(req, res, next) {
        try {
            const { supplier_name, supplier_telephone, city_id, street_id, house_id } = req.body;
            
            if (!supplier_name) {
                return next(ApiError.badRequest('supplier_name обязателен'));
            }
            
            const supplier = await Supplier.create({ 
                supplier_name, 
                supplier_telephone, 
                city_id, 
                street_id, 
                house_id 
            });
            
            return res.status(201).json(supplier);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании поставщика'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { supplier_name, supplier_telephone, city_id, street_id, house_id } = req.body;
            
            const supplier = await Supplier.findByPk(id);
            
            if (!supplier) {
                return next(ApiError.badRequest('Поставщик не найден'));
            }
            
            await supplier.update({
                supplier_name: supplier_name || supplier.supplier_name,
                supplier_telephone: supplier_telephone || supplier.supplier_telephone,
                city_id: city_id !== undefined ? city_id : supplier.city_id,
                street_id: street_id !== undefined ? street_id : supplier.street_id,
                house_id: house_id !== undefined ? house_id : supplier.house_id
            });
            
            return res.json(supplier);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении поставщика'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const supplier = await Supplier.findByPk(id);
            
            if (!supplier) {
                return next(ApiError.badRequest('Поставщик не найден'));
            }
            
            await supplier.destroy();
            
            return res.json({ message: 'Поставщик успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении поставщика'));
        }
    }
}

module.exports = new SupplierController();