const { Address, City, Street, House } = require('../models/models');
const ApiError = require('../error/ApiError');

class AddressController {
    // GET /api/address — получить все адреса
    async Get(req, res, next) {
        try {
            const addresses = await Address.findAll({
                include: [
                    { model: City },
                    { model: Street },
                    { model: House }
                ]
            });
            return res.json(addresses);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении адресов: ' + error.message));
        }
    }

    // GET /api/address/:city_id/:street_id/:house_id — получить один адрес
    async GetId(req, res, next) {
        try {
            const { city_id, street_id, house_id } = req.params;
            const address = await Address.findOne({
                where: { city_id, street_id, house_id },
                include: [
                    { model: City },
                    { model: Street },
                    { model: House }
                ]
            });
            
            if (!address) {
                return next(ApiError.badRequest('Адрес не найден'));
            }
            
            return res.json(address);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении адреса: ' + error.message));
        }
    }

    // GET /api/address/city/:city_id — получить все адреса города
    async GetByCity(req, res, next) {
        try {
            const { city_id } = req.params;
            const addresses = await Address.findAll({
                where: { city_id },
                include: [
                    { model: City },
                    { model: Street },
                    { model: House }
                ]
            });
            return res.json(addresses);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении адресов города: ' + error.message));
        }
    }

    // POST /api/address — создать адрес
    async Post(req, res, next) {
        try {
            const { city_id, street_id, house_id } = req.body;
            
            if (!city_id || !street_id || !house_id) {
                return next(ApiError.badRequest('city_id, street_id, house_id обязательны'));
            }
            
            const existing = await Address.findOne({
                where: { city_id, street_id, house_id }
            });
            
            if (existing) {
                return next(ApiError.badRequest('Такой адрес уже существует'));
            }
            
            const address = await Address.create({ city_id, street_id, house_id });
            return res.status(201).json(address);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании адреса: ' + error.message));
        }
    }

    // DELETE /api/address/:city_id/:street_id/:house_id — удалить адрес
    async Delet(req, res, next) {
        try {
            const { city_id, street_id, house_id } = req.params;
            
            const address = await Address.findOne({
                where: { city_id, street_id, house_id }
            });
            
            if (!address) {
                return next(ApiError.badRequest('Адрес не найден'));
            }
            
            await address.destroy();
            return res.json({ message: 'Адрес удалён' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении адреса: ' + error.message));
        }
    }
}

module.exports = new AddressController();