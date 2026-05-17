const { City } = require('../models/models');
const ApiError = require('../error/ApiError');

class CityController {
    async Get(req, res, next) {
        try {
            const cities = await City.findAll();
            return res.json(cities);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении городов'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const city = await City.findByPk(id);
            
            if (!city) {
                return next(ApiError.badRequest('Город не найден'));
            }
            
            return res.json(city);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении города'));
        }
    }

    async Post(req, res, next) {
        try {
            const { city_name } = req.body;
            
            if (!city_name) {
                return next(ApiError.badRequest('city_name обязателен'));
            }
            
            const city = await City.create({ city_name });
            return res.status(201).json(city);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании города'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { city_name } = req.body;
            
            const city = await City.findByPk(id);
            
            if (!city) {
                return next(ApiError.badRequest('Город не найден'));
            }
            
            await city.update({ city_name: city_name || city.city_name });
            return res.json(city);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении города'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const city = await City.findByPk(id);
            
            if (!city) {
                return next(ApiError.badRequest('Город не найден'));
            }
            
            await city.destroy();
            return res.json({ message: 'Город успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении города'));
        }
    }
}

module.exports = new CityController();