const { Shop_in_administrator, Administrator, Shop } = require('../models/models');
const ApiError = require('../error/ApiError');

class ShopInAdministratorController {
    async Get(req, res, next) {
        try {
            const relations = await Shop_in_administrator.findAll({
                include: [
                    { model: Administrator, attributes: ['id', 'administrator_name', 'administrator_surname'] },
                    { model: Shop, attributes: ['id', 'shop_name', 'shop_telephone'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении связей администратор-магазин: ' + error.message));
        }
    }

    async GetByAdministrator(req, res, next) {
        try {
            const { administrator_id } = req.params;
            const relations = await Shop_in_administrator.findAll({
                where: { administrator_id },
                include: [
                    { model: Shop, attributes: ['id', 'shop_name', 'shop_telephone'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении магазинов администратора: ' + error.message));
        }
    }

    async GetByShop(req, res, next) {
        try {
            const { shop_id } = req.params;
            const relations = await Shop_in_administrator.findAll({
                where: { shop_id },
                include: [
                    { model: Administrator, attributes: ['id', 'administrator_name', 'administrator_surname'] }
                ]
            });
            return res.json(relations);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении администраторов магазина: ' + error.message));
        }
    }

    async GetId(req, res, next) {
        try {
            const { administrator_id, shop_id } = req.params;
            const relation = await Shop_in_administrator.findOne({
                where: { administrator_id, shop_id },
                include: [
                    { model: Administrator, attributes: ['id', 'administrator_name', 'administrator_surname'] },
                    { model: Shop, attributes: ['id', 'shop_name', 'shop_telephone'] }
                ]
            });
            if (!relation) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            return res.json(relation);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении связи: ' + error.message));
        }
    }

    async Post(req, res, next) {
        try {
            const { administrator_id, shop_id } = req.body;
            
            if (!administrator_id || !shop_id) {
                return next(ApiError.badRequest('administrator_id и shop_id обязательны'));
            }
            
            const administrator = await Administrator.findByPk(administrator_id);
            if (!administrator) {
                return next(ApiError.badRequest('Администратор не найден'));
            }
            
            const shop = await Shop.findByPk(shop_id);
            if (!shop) {
                return next(ApiError.badRequest('Магазин не найден'));
            }
            
            const existing = await Shop_in_administrator.findOne({
                where: { administrator_id, shop_id }
            });
            if (existing) {
                return next(ApiError.badRequest('Связь уже существует'));
            }
            
            const relation = await Shop_in_administrator.create({
                administrator_id,
                shop_id
            });
            
            return res.status(201).json(relation);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании связи: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { administrator_id, shop_id } = req.params;
            const relation = await Shop_in_administrator.findOne({
                where: { administrator_id, shop_id }
            });
            
            if (!relation) {
                return next(ApiError.badRequest('Связь не найдена'));
            }
            
            await relation.destroy();
            return res.json({ message: 'Связь успешно удалена', administrator_id, shop_id });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении связи: ' + error.message));
        }
    }
}

module.exports = new ShopInAdministratorController();