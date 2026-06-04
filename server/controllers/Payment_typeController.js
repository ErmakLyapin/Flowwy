const { Payment_type } = require('../models/models');
const ApiError = require('../error/ApiError');

class Payment_typeController {
    async Get(req, res, next) {
        try {
            const paymentTypes = await Payment_type.findAll();
            return res.json(paymentTypes);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении типов оплаты'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const paymentType = await Payment_type.findByPk(id);
            
            if (!paymentType) {
                return next(ApiError.badRequest('Тип оплаты не найден'));
            }
            
            return res.json(paymentType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении типа оплаты'));
        }
    }

    async Post(req, res, next) {
        try {
            const { payment_type_name } = req.body;  // ← исправлено
            
            if (!payment_type_name) {
                return next(ApiError.badRequest('payment_type_name обязателен'));
            }
            
            const paymentType = await Payment_type.create({ payment_type_name });  // ← исправлено
            return res.status(201).json(paymentType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании типа оплаты'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { payment_type_name } = req.body;  // ← исправлено
            
            const paymentType = await Payment_type.findByPk(id);
            
            if (!paymentType) {
                return next(ApiError.badRequest('Тип оплаты не найден'));
            }
            
            await paymentType.update({ payment_type_name: payment_type_name || paymentType.payment_type_name });  // ← исправлено
            return res.json(paymentType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении типа оплаты'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const paymentType = await Payment_type.findByPk(id);
            
            if (!paymentType) {
                return next(ApiError.badRequest('Тип оплаты не найден'));
            }
            
            await paymentType.destroy();
            return res.json({ message: 'Тип оплаты успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении типа оплаты'));
        }
    }
}

module.exports = new Payment_typeController();