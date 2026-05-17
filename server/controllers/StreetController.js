const { Street } = require('../models/models');
const ApiError = require('../error/ApiError');

class StreetController {
    async Get(req, res, next) {
        try {
            const streets = await Street.findAll();
            return res.json(streets);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении улиц'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const street = await Street.findByPk(id);
            
            if (!street) {
                return next(ApiError.badRequest('Улица не найдена'));
            }
            
            return res.json(street);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении улицы'));
        }
    }

    async Post(req, res, next) {
        try {
            const { street_name } = req.body;
            
            if (!street_name) {
                return next(ApiError.badRequest('street_name обязателен'));
            }
            
            const street = await Street.create({ street_name });
            return res.status(201).json(street);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании улицы'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { street_name } = req.body;
            
            const street = await Street.findByPk(id);
            
            if (!street) {
                return next(ApiError.badRequest('Улица не найдена'));
            }
            
            await street.update({ street_name: street_name || street.street_name });
            return res.json(street);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении улицы'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const street = await Street.findByPk(id);
            
            if (!street) {
                return next(ApiError.badRequest('Улица не найдена'));
            }
            
            await street.destroy();
            return res.json({ message: 'Улица успешно удалена', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении улицы'));
        }
    }
}

module.exports = new StreetController();