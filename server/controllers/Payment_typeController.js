// server/controllers/Payment_typeController.js
const { Payment_type } = require('../models/models');
const ApiError = require('../error/ApiError');

class Payment_typeController {
    async Get(req, res, next) {
        try {
            const administrator_id = req.user.id;
            const paymentTypes = await Payment_type.findAll({
                where: { administrator_id },
                order: [['createdAt', 'DESC']]
            });
            return res.json(paymentTypes);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении типов оплаты: ' + error.message));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            const paymentType = await Payment_type.findOne({
                where: { id, administrator_id }
            });
            
            if (!paymentType) {
                return next(ApiError.badRequest('Тип оплаты не найден'));
            }
            
            return res.json(paymentType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении типа оплаты: ' + error.message));
        }
    }

    async Post(req, res, next) {
        try {
            const { payment_type_name } = req.body;
            const administrator_id = req.user.id;
            
            if (!payment_type_name) {
                return next(ApiError.badRequest('payment_type_name обязателен'));
            }
            
            const paymentType = await Payment_type.create({ 
                payment_type_name,
                administrator_id
            });
            return res.status(201).json(paymentType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании типа оплаты: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { payment_type_name } = req.body;
            const administrator_id = req.user.id;
            
            const paymentType = await Payment_type.findOne({
                where: { id, administrator_id }
            });
            
            if (!paymentType) {
                return next(ApiError.badRequest('Тип оплаты не найден'));
            }
            
            await paymentType.update({ 
                payment_type_name: payment_type_name || paymentType.payment_type_name 
            });
            
            return res.json(paymentType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении типа оплаты: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            
            const paymentType = await Payment_type.findOne({
                where: { id, administrator_id }
            });
            
            if (!paymentType) {
                return next(ApiError.badRequest('Тип оплаты не найден'));
            }
            
            await paymentType.destroy();
            return res.json({ message: 'Тип оплаты успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении типа оплаты: ' + error.message));
        }
    }
}

module.exports = new Payment_typeController();