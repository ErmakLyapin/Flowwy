const { Shop } = require('../models/models');
const ApiError = require('../error/ApiError');

class ShopController {
    async Get(req, res, next) {
        try {
            const shops = await Shop.findAll();
            return res.json(shops);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении магазинов'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const shop = await Shop.findByPk(id);
            
            if (!shop) {
                return next(ApiError.badRequest('Магазин не найден'));
            }
            
            return res.json(shop);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении магазина'));
        }
    }

    async Post(req, res, next) {
        try {
            const { shop_name, shop_telephone, city_id, street_id, house_id } = req.body;
            
            if (!shop_name) {
                return next(ApiError.badRequest('shop_name обязателен'));
            }
            
            const shop = await Shop.create({ 
                shop_name, 
                shop_telephone, 
                city_id, 
                street_id, 
                house_id 
            });
            
            return res.status(201).json(shop);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании магазина'));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { shop_name, shop_telephone, city_id, street_id, house_id } = req.body;
            
            const shop = await Shop.findByPk(id);
            
            if (!shop) {
                return next(ApiError.badRequest('Магазин не найден'));
            }
            
            await shop.update({
                shop_name: shop_name || shop.shop_name,
                shop_telephone: shop_telephone || shop.shop_telephone,
                city_id: city_id !== undefined ? city_id : shop.city_id,
                street_id: street_id !== undefined ? street_id : shop.street_id,
                house_id: house_id !== undefined ? house_id : shop.house_id
            });
            
            return res.json(shop);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении магазина'));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const shop = await Shop.findByPk(id);
            
            if (!shop) {
                return next(ApiError.badRequest('Магазин не найден'));
            }
            
            await shop.destroy();
            
            return res.json({ message: 'Магазин успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении магазина'));
        }
    }
}

module.exports = new ShopController();