const { Employee_in_shop, Employee, Shop } = require('../models/models');
const ApiError = require('../error/ApiError');

class EmployeeInShopController {
    async Get(req, res, next) {
        try {
            const relations = await Employee_in_shop.findAll({
                include: [
                    { model: Employee, attributes: ['id', 'employee_name', 'employee_surname', 'employee_login'] },
                    { model: Shop, attributes: ['id', 'shop_name', 'shop_telephone'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении связей сотрудник-магазин: ' + error.message));
        }
    }

    async GetByEmployee(req, res, next) {
        try {
            const { employee_id } = req.params;
            const relations = await Employee_in_shop.findAll({
                where: { employee_id },
                include: [
                    { model: Shop, attributes: ['id', 'shop_name', 'shop_telephone'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении магазинов сотрудника: ' + error.message));
        }
    }

    async GetByShop(req, res, next) {
        try {
            const { shop_id } = req.params;
            const relations = await Employee_in_shop.findAll({
                where: { shop_id },
                include: [
                    { model: Employee, attributes: ['id', 'employee_name', 'employee_surname', 'employee_login'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении сотрудников магазина: ' + error.message));
        }
    }

    async GetId(req, res, next) {
        try {
            const { employee_id, shop_id } = req.params;
            const relation = await Employee_in_shop.findOne({
                where: { employee_id, shop_id },
                include: [
                    { model: Employee, attributes: ['id', 'employee_name', 'employee_surname', 'employee_login'] },
                    { model: Shop, attributes: ['id', 'shop_name', 'shop_telephone'] }
                ]
            });
            if (!relation) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            return res.json(relation);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении связи: ' + error.message));
        }
    }

    async Post(req, res, next) {
        try {
            const { employee_id, shop_id } = req.body;
            
            if (!employee_id || !shop_id) {
                return next(ApiError.badRequest('employee_id и shop_id обязательны'));
            }
            
            const employee = await Employee.findByPk(employee_id);
            if (!employee) {
                return next(ApiError.badRequest('Сотрудник не найден'));
            }
            
            const shop = await Shop.findByPk(shop_id);
            if (!shop) {
                return next(ApiError.badRequest('Магазин не найден'));
            }
            
            const existing = await Employee_in_shop.findOne({
                where: { employee_id, shop_id }
            });
            if (existing) {
                return next(ApiError.badRequest('Связь уже существует'));
            }
            
            const relation = await Employee_in_shop.create({
                employee_id,
                shop_id
            });
            
            return res.status(201).json(relation);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании связи: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { employee_id, shop_id } = req.params;
            const { new_employee_id, new_shop_id } = req.body;
            
            const relation = await Employee_in_shop.findOne({
                where: { employee_id, shop_id }
            });
            
            if (!relation) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            
            await relation.destroy();
            
            const newRelation = await Employee_in_shop.create({
                employee_id: new_employee_id || employee_id,
                shop_id: new_shop_id || shop_id
            });
            
            return res.json(newRelation);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении связи: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { employee_id, shop_id } = req.params;
            const relation = await Employee_in_shop.findOne({
                where: { employee_id, shop_id }
            });
            
            if (!relation) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            
            await relation.destroy();
            return res.json({ message: 'Связь успешно удалена', employee_id, shop_id });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении связи: ' + error.message));
        }
    }
}

module.exports = new EmployeeInShopController();