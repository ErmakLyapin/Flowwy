// server/controllers/CustomerController.js
const { Customer } = require('../models/models');
const ApiError = require('../error/ApiError');

class CustomerController {
    async Get(req, res, next) {
        try {
            const administrator_id = req.user.id;
            const customers = await Customer.findAll({
                where: { administrator_id },
                order: [['createdAt', 'DESC']]
            });
            return res.json(customers);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении клиентов: ' + error.message));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            const customer = await Customer.findOne({
                where: { id, administrator_id }
            });
            
            if (!customer) {
                return next(ApiError.badRequest('Клиент не найден'));
            }
            
            return res.json(customer);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении клиента: ' + error.message));
        }
    }

    async Post(req, res, next) {
        try {
            const { customer_name, customer_telephone } = req.body;
            const administrator_id = req.user.id;
            
            if (!customer_telephone) {
                return next(ApiError.badRequest('customer_telephone обязателен'));
            }
            
            const customer = await Customer.create({ 
                customer_name, 
                customer_telephone,
                administrator_id
            });
            
            return res.status(201).json(customer);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании клиента: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { customer_name, customer_telephone } = req.body;
            const administrator_id = req.user.id;
            
            const customer = await Customer.findOne({
                where: { id, administrator_id }
            });
            
            if (!customer) {
                return next(ApiError.badRequest('Клиент не найден'));
            }
            
            await customer.update({
                customer_name: customer_name || customer.customer_name,
                customer_telephone: customer_telephone || customer.customer_telephone
            });
            
            return res.json(customer);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении клиента: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            
            const customer = await Customer.findOne({
                where: { id, administrator_id }
            });
            
            if (!customer) {
                return next(ApiError.badRequest('Клиент не найден'));
            }
            
            await customer.destroy();
            
            return res.json({ message: 'Клиент успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении клиента: ' + error.message));
        }
    }
}

module.exports = new CustomerController();