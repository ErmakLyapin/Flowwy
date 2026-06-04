const { Employee_in_administrator, Administrator, Employee } = require('../models/models');
const ApiError = require('../error/ApiError');

class EmployeeInAdministratorController {
    async Get(req, res, next) {
        try {
            const relations = await Employee_in_administrator.findAll({
                include: [
                    { model: Administrator, attributes: ['id', 'administrator_name', 'administrator_surname'] },
                    { model: Employee, attributes: ['id', 'employee_name', 'employee_surname', 'employee_login'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении связей администратор-сотрудник: ' + error.message));
        }
    }

    async GetByAdministrator(req, res, next) {
        try {
            const { administrator_id } = req.params;
            const relations = await Employee_in_administrator.findAll({
                where: { administrator_id },
                include: [
                    { model: Employee, attributes: ['id', 'employee_name', 'employee_surname', 'employee_login'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении сотрудников администратора: ' + error.message));
        }
    }

    async GetByEmployee(req, res, next) {
        try {
            const { employee_id } = req.params;
            const relations = await Employee_in_administrator.findAll({
                where: { employee_id },
                include: [
                    { model: Administrator, attributes: ['id', 'administrator_name', 'administrator_surname'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении администраторов сотрудника: ' + error.message));
        }
    }

    async GetId(req, res, next) {
        try {
            const { administrator_id, employee_id } = req.params;
            const relation = await Employee_in_administrator.findOne({
                where: { administrator_id, employee_id },
                include: [
                    { model: Administrator, attributes: ['id', 'administrator_name', 'administrator_surname'] },
                    { model: Employee, attributes: ['id', 'employee_name', 'employee_surname', 'employee_login'] }
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
            const { administrator_id, employee_id } = req.body;
            
            if (!administrator_id || !employee_id) {
                return next(ApiError.badRequest('administrator_id и employee_id обязательны'));
            }
            
            const administrator = await Administrator.findByPk(administrator_id);
            if (!administrator) {
                return next(ApiError.badRequest('Администратор не найден'));
            }
            
            const employee = await Employee.findByPk(employee_id);
            if (!employee) {
                return next(ApiError.badRequest('Сотрудник не найден'));
            }
            
            const existing = await Employee_in_administrator.findOne({
                where: { administrator_id, employee_id }
            });
            if (existing) {
                return next(ApiError.badRequest('Связь уже существует'));
            }
            
            const relation = await Employee_in_administrator.create({
                administrator_id,
                employee_id
            });
            
            return res.status(201).json(relation);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании связи: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { administrator_id, employee_id } = req.params;
            const { new_administrator_id, new_employee_id } = req.body;
            
            const relation = await Employee_in_administrator.findOne({
                where: { administrator_id, employee_id }
            });
            
            if (!relation) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            
            await relation.destroy();
            
            const newRelation = await Employee_in_administrator.create({
                administrator_id: new_administrator_id || administrator_id,
                employee_id: new_employee_id || employee_id
            });
            
            return res.json(newRelation);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении связи: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { administrator_id, employee_id } = req.params;
            const relation = await Employee_in_administrator.findOne({
                where: { administrator_id, employee_id }
            });
            
            if (!relation) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            
            await relation.destroy();
            return res.json({ message: 'Связь успешно удалена', administrator_id, employee_id });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении связи: ' + error.message));
        }
    }
}

module.exports = new EmployeeInAdministratorController();