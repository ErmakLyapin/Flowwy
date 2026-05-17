const { House } = require('../models/models');
const ApiError = require('../error/ApiError');

class HouseController {
    async Get(req, res, next) {
        try {
            const houses = await House.findAll();
            return res.json(houses);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении домов'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const house = await House.findByPk(id);
            
            if (!house) {
                return next(ApiError.badRequest('Дом не найден'));
            }
            
            return res.json(house);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении дома'));
        }
    }

    async Post(req, res, next) {
        try {
            const { house_name } = req.body;
            
            if (!house_name) {
                return next(ApiError.badRequest('house_name обязателен'));
            }
            
            const house = await House.create({ house_name });
            return res.status(201).json(house);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании дома'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { house_name } = req.body;
            
            const house = await House.findByPk(id);
            
            if (!house) {
                return next(ApiError.badRequest('Дом не найден'));
            }
            
            await house.update({ house_name: house_name || house.house_name });
            return res.json(house);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении дома'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const house = await House.findByPk(id);
            
            if (!house) {
                return next(ApiError.badRequest('Дом не найден'));
            }
            
            await house.destroy();
            return res.json({ message: 'Дом успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении дома'));
        }
    }
}

module.exports = new HouseController();