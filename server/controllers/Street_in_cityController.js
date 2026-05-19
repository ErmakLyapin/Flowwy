const { Street_in_city, Street, City } = require('../models/models');
const ApiError = require('../error/ApiError');

class StreetInCityController {
    // GET /api/street_in_city — получить все связи
    async Get(req, res, next) {
        try {
            const items = await Street_in_city.findAll({
                include: [
                    { model: Street },
                    { model: City }
                ]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении связей: ' + error.message));
        }
    }

    // GET /api/street_in_city/:street_id/:city_id — получить одну связь
    async GetId(req, res, next) {
        try {
            const { street_id, city_id } = req.params;
            const item = await Street_in_city.findOne({
                where: { street_id, city_id },
                include: [
                    { model: Street },
                    { model: City }
                ]
            });
            
            if (!item) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            
            return res.json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении связи: ' + error.message));
        }
    }

    // GET /api/street_in_city/city/:city_id — получить все улицы города
    async GetByCity(req, res, next) {
        try {
            const { city_id } = req.params;
            const items = await Street_in_city.findAll({
                where: { city_id },
                include: [{ model: Street }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении улиц города: ' + error.message));
        }
    }

    // GET /api/street_in_city/street/:street_id — получить все города для улицы
    async GetByStreet(req, res, next) {
        try {
            const { street_id } = req.params;
            const items = await Street_in_city.findAll({
                where: { street_id },
                include: [{ model: City }]
            });
            return res.json(items);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении городов улицы: ' + error.message));
        }
    }

    // POST /api/street_in_city — создать связь
    async Post(req, res, next) {
        try {
            const { street_id, city_id } = req.body;
            
            if (!street_id || !city_id) {
                return next(ApiError.badRequest('street_id и city_id обязательны'));
            }
            
            const existing = await Street_in_city.findOne({
                where: { street_id, city_id }
            });
            
            if (existing) {
                return next(ApiError.badRequest('Такая связь уже существует'));
            }
            
            const item = await Street_in_city.create({ street_id, city_id });
            return res.status(201).json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании связи: ' + error.message));
        }
    }

    // DELETE /api/street_in_city/:street_id/:city_id — удалить связь
    async Delet(req, res, next) {
        try {
            const { street_id, city_id } = req.params;
            
            const item = await Street_in_city.findOne({
                where: { street_id, city_id }
            });
            
            if (!item) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            
            await item.destroy();
            return res.json({ message: 'Связь удалена' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении связи: ' + error.message));
        }
    }
}

module.exports = new StreetInCityController();