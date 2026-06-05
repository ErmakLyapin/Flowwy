const { Shop, Shop_in_administrator } = require('../models/models');
const ApiError = require('../error/ApiError');

class ShopController {
    async Get(req, res, next) {
        try {
            const shops = await Shop.findAll();
            return res.json(shops);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении магазинов: ' + error.message));
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
            return next(ApiError.internal('Ошибка при получении магазина: ' + error.message));
        }
    }

    async Post(req, res, next) {
        try {
            const { shop_name, shop_telephone } = req.body;
            
            if (!shop_name) {
                return next(ApiError.badRequest('shop_name обязателен'));
            }
            
            const shop = await Shop.create({ 
                shop_name, 
                shop_telephone
            });
            
            return res.status(201).json(shop);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании магазина: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { shop_name, shop_telephone } = req.body;
            
            const shop = await Shop.findByPk(id);
            
            if (!shop) {
                return next(ApiError.badRequest('Магазин не найден'));
            }
            
            await shop.update({
                shop_name: shop_name || shop.shop_name,
                shop_telephone: shop_telephone !== undefined ? shop_telephone : shop.shop_telephone
            });
            
            return res.json(shop);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении магазина: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            // Сначала удаляем все связи с администраторами
            await Shop_in_administrator.destroy({ where: { shop_id: id } });
            
            // Потом удаляем сам магазин
            const shop = await Shop.findByPk(id);
            if (!shop) {
                return next(ApiError.badRequest('Магазин не найден'));
            }
            
            await shop.destroy();
            
            return res.json({ message: 'Магазин успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении магазина: ' + error.message));
        }
    }
}

module.exports = new ShopController();