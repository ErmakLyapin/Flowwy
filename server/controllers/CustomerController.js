const { Customer } = require('../models/models');
const ApiError = require('../error/ApiError');

class CustomerController {
    async Get(req, res, next) {
        try {
            const customers = await Customer.findAll();
            return res.json(customers);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении клиентов'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const customer = await Customer.findByPk(id);
            
            if (!customer) {
                return next(ApiError.badRequest('Клиент не найден'));
            }
            
            return res.json(customer);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении клиента'));
        }
    }

    async Post(req, res, next) {
        try {
            const { customer_name, customer_telephone } = req.body;
            
            if (!customer_telephone) {
                return next(ApiError.badRequest('customer_telephone обязателен'));
            }
            
            const customer = await Customer.create({ 
                customer_name, 
                customer_telephone 
            });
            
            return res.status(201).json(customer);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании клиента'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { customer_name, customer_telephone } = req.body;
            
            const customer = await Customer.findByPk(id);
            
            if (!customer) {
                return next(ApiError.badRequest('Клиент не найден'));
            }
            
            await customer.update({
                customer_name: customer_name || customer.customer_name,
                customer_telephone: customer_telephone || customer.customer_telephone
            });
            
            return res.json(customer);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении клиента'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const customer = await Customer.findByPk(id);
            
            if (!customer) {
                return next(ApiError.badRequest('Клиент не найден'));
            }
            
            await customer.destroy();
            
            return res.json({ message: 'Клиент успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении клиента'));
        }
    }
}

module.exports = new CustomerController();