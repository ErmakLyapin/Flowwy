const { Shop, Shop_in_administrator, Employee_in_shop } = require('../models/models');
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
        
        console.log('=== DELETE SHOP ===');
        console.log('Shop ID:', id);
        
        // 1. Удаляем связи с администраторами
        console.log('Deleting from shop_in_administrators...');
        await Shop_in_administrator.destroy({ where: { shop_id: id } });
        console.log('Done');
        
        // 2. Удаляем связи с сотрудниками
        console.log('Deleting from employee_in_shops...');
        await Employee_in_shop.destroy({ where: { shop_id: id } });
        console.log('Done');
        
        // 3. Находим и удаляем магазин
        console.log('Finding shop...');
        const shop = await Shop.findByPk(id);
        if (!shop) {
            return next(ApiError.badRequest('Магазин не найден'));
        }
        
        console.log('Deleting shop...');
        await shop.destroy();
        console.log('Shop deleted successfully!');
        
        return res.json({ message: 'Магазин успешно удалён', id: Number(id) });
    } catch (error) {
        console.error('ERROR in delete:', error);
        return next(ApiError.internal('Ошибка при удалении магазина: ' + error.message));
    }
}
}

module.exports = new ShopController();