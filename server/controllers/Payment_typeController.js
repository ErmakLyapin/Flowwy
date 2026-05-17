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
            const { payment_tipe_name } = req.body;
            
            if (!payment_tipe_name) {
                return next(ApiError.badRequest('payment_tipe_name обязателен'));
            }
            
            const paymentType = await Payment_type.create({ payment_tipe_name });
            return res.status(201).json(paymentType);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании типа оплаты'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { payment_tipe_name } = req.body;
            
            const paymentType = await Payment_type.findByPk(id);
            
            if (!paymentType) {
                return next(ApiError.badRequest('Тип оплаты не найден'));
            }
            
            await paymentType.update({ payment_tipe_name: payment_tipe_name || paymentType.payment_tipe_name });
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