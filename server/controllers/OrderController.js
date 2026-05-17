const { Order } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    async Get(req, res, next) {
        try {
            const orders = await Order.findAll();
            return res.json(orders);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении заказов'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id);
            
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            
            return res.json(order);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении заказа'));
        }
    }

    async Post(req, res, next) {
        try {
            const { customer_id, payment_type_id, shop_id, employee_id, order_date } = req.body;
            
            if (!customer_id || !shop_id || !employee_id) {
                return next(ApiError.badRequest('customer_id, shop_id и employee_id обязательны'));
            }
            
            const order = await Order.create({ 
                customer_id, 
                payment_type_id, 
                shop_id, 
                employee_id, 
                order_date: order_date || new Date()
            });
            
            return res.status(201).json(order);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании заказа'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { customer_id, payment_type_id, shop_id, employee_id, order_date } = req.body;
            
            const order = await Order.findByPk(id);
            
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            
            await order.update({
                customer_id: customer_id || order.customer_id,
                payment_type_id: payment_type_id !== undefined ? payment_type_id : order.payment_type_id,
                shop_id: shop_id || order.shop_id,
                employee_id: employee_id || order.employee_id,
                order_date: order_date || order.order_date
            });
            
            return res.json(order);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении заказа'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const order = await Order.findByPk(id);
            
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            
            await order.destroy();
            
            return res.json({ message: 'Заказ успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении заказа'));
        }
    }
}

module.exports = new OrderController();