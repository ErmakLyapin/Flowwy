const { Supply, Supplier, Product_in_invoice, Product } = require('../models/models');
const ApiError = require('../error/ApiError');

class SupplyController {
    // Получить все поставки администратора
    async Get(req, res, next) {
    try {
        console.log('=== SupplyController.Get ===');
        console.log('req.user:', req.user);
        
        const administrator_id = req.user.id;
        console.log('administrator_id:', administrator_id);
        
        const supplies = await Supply.findAll({
            where: { administrator_id },
            include: [
                { model: Supplier, attributes: ['id', 'supplier_name', 'supplier_telephone'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        console.log('Supplies found:', supplies.length);
        
        // Временно возвращаем без подсчета статистики
        return res.json(supplies);
        
    } catch (error) {
        console.error('Error in SupplyController.Get:', error);
        return next(ApiError.internal('Ошибка при получении поставок: ' + error.message));
    }
}

    // Получить поставку по ID
    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            
            const supply = await Supply.findOne({
                where: { id, administrator_id },
                include: [
                    { model: Supplier, attributes: ['id', 'supplier_name', 'supplier_telephone'] }
                ]
            });
            
            if (!supply) {
                return next(ApiError.badRequest('Поставка не найдена'));
            }
            
            return res.json(supply);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении поставки: ' + error.message));
        }
    }

    // Создать поставку
    async Post(req, res, next) {
        try {
            const { supplier_id, supply_date } = req.body;
            const administrator_id = req.user.id;
            
            if (!supplier_id) {
                return next(ApiError.badRequest('supplier_id обязателен'));
            }
            
            // Проверяем, что поставщик принадлежит администратору
            const supplier = await Supplier.findOne({
                where: { id: supplier_id, administrator_id }
            });
            
            if (!supplier) {
                return next(ApiError.badRequest('Поставщик не найден или не принадлежит вам'));
            }
            
            const supply = await Supply.create({
                supplier_id,
                supply_date: supply_date || new Date(),
                administrator_id
            });
            
            return res.status(201).json(supply);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании поставки: ' + error.message));
        }
    }

    // Обновить поставку
    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { supplier_id, supply_date } = req.body;
            const administrator_id = req.user.id;
            
            const supply = await Supply.findOne({
                where: { id, administrator_id }
            });
            
            if (!supply) {
                return next(ApiError.badRequest('Поставка не найдена'));
            }
            
            // Если меняется поставщик, проверяем его принадлежность
            if (supplier_id && supplier_id !== supply.supplier_id) {
                const supplier = await Supplier.findOne({
                    where: { id: supplier_id, administrator_id }
                });
                if (!supplier) {
                    return next(ApiError.badRequest('Поставщик не найден или не принадлежит вам'));
                }
            }
            
            await supply.update({
                supplier_id: supplier_id || supply.supplier_id,
                supply_date: supply_date || supply.supply_date
            });
            
            return res.json(supply);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении поставки: ' + error.message));
        }
    }

    // Удалить поставку
    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            const administrator_id = req.user.id;
            
            const supply = await Supply.findOne({
                where: { id, administrator_id }
            });
            
            if (!supply) {
                return next(ApiError.badRequest('Поставка не найдена'));
            }
            
            // Сначала удаляем все товары в поставке
            await Product_in_invoice.destroy({ where: { supply_id: id } });
            
            // Удаляем саму поставку
            await supply.destroy();
            
            return res.json({ message: 'Поставка успешно удалена', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении поставки: ' + error.message));
        }
    }
}

module.exports = new SupplyController();