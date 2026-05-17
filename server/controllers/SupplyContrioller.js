const { Supply } = require('../models/models');
const ApiError = require('../error/ApiError');

class SupplyController {
    async Get(req, res, next) {
        try {
            const supplies = await Supply.findAll();
            return res.json(supplies);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставок'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const supply = await Supply.findByPk(id);
            
            if (!supply) {
                return next(ApiError.badRequest('Поставка не найдена'));
            }
            
            return res.json(supply);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставки'));
        }
    }

    async Post(req, res, next) {
        try {
            const { supplier_id, supply_date, employee_id } = req.body;
            
            if (!supplier_id || !employee_id) {
                return next(ApiError.badRequest('supplier_id и employee_id обязательны'));
            }
            
            const supply = await Supply.create({ 
                supplier_id, 
                supply_date: supply_date || new Date(),
                employee_id
            });
            
            return res.status(201).json(supply);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании поставки'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { supplier_id, supply_date, employee_id } = req.body;
            
            const supply = await Supply.findByPk(id);
            
            if (!supply) {
                return next(ApiError.badRequest('Поставка не найдена'));
            }
            
            await supply.update({
                supplier_id: supplier_id || supply.supplier_id,
                supply_date: supply_date || supply.supply_date,
                employee_id: employee_id || supply.employee_id
            });
            
            return res.json(supply);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении поставки'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const supply = await Supply.findByPk(id);
            
            if (!supply) {
                return next(ApiError.badRequest('Поставка не найдена'));
            }
            
            await supply.destroy();
            
            return res.json({ message: 'Поставка успешно удалена', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении поставки'));
        }
    }
}

module.exports = new SupplyController();