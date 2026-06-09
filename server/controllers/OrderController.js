const { Order, Customer, Payment_type, Shop, Employee, Product_in_order, Bouquet_in_order, Product_in_shop, Product, Bouquet, sequelize } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    // Получить заказы (для сотрудника - только заказы его магазина)
    async Get(req, res, next) {
        try {
            const { role, id, shopId } = req.user;
            
            let where = {};
            if (role === 'employee') {
                where.shop_id = shopId;
            }
            
            const orders = await Order.findAll({
                where,
                include: [
                    { model: Customer, attributes: ['id', 'customer_name', 'customer_telephone'] },
                    { model: Payment_type, attributes: ['id', 'payment_type_name'] },
                    { model: Shop, attributes: ['id', 'shop_name'] },
                    { model: Employee, attributes: ['id', 'employee_name', 'employee_surname'] }
                ],
                order: [['createdAt', 'DESC']]
            });
            
            return res.json(orders);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении заказов: ' + error.message));
        }
    }

    // Получить заказ по ID с товарами и букетами
    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            
            const order = await Order.findByPk(id, {
                include: [
                    { model: Customer },
                    { model: Payment_type },
                    { model: Shop },
                    { model: Employee }
                ]
            });
            
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            
            const products = await Product_in_order.findAll({
                where: { order_id: id },
                include: [{ model: Product }]
            });
            
            const bouquets = await Bouquet_in_order.findAll({
                where: { order_id: id },
                include: [{ model: Bouquet }]
            });
            
            return res.json({ order, products, bouquets });
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении заказа: ' + error.message));
        }
    }

    // Создать заказ
    // Создать заказ
 async Post(req, res, next) {
        console.log('!!! START !!!');
        
        const transaction = await sequelize.transaction();
        
        try {
            console.log('Step 1: Getting data');
            const { customer_id, payment_type_id, total_price, items } = req.body;
            const employee_id = req.user?.id;
            const shop_id = req.user?.shopId;
            
            console.log('Step 2:', { customer_id, payment_type_id, employee_id, shop_id });
            
            if (!customer_id || !payment_type_id || !items || items.length === 0) {
                return next(ApiError.badRequest('Не все обязательные поля заполнены'));
            }
            
            if (!shop_id) {
                return next(ApiError.badRequest('Магазин не найден для сотрудника'));
            }
            
            const order = await Order.create({
                customer_id,
                payment_type_id,
                shop_id,
                employee_id,
                total_price: total_price || 0,
                order_date: new Date()
            }, { transaction });
            
            for (const item of items) {
                if (item.type === 'product') {
                    await Product_in_order.create({
                        order_id: order.id,
                        product_id: item.id,
                        quantity: item.quantity,
                        price_at_time: item.price
                    }, { transaction });
                    
                    const shopProduct = await Product_in_shop.findOne({
                        where: { product_id: item.id, shop_id },
                        transaction
                    });
                    
                    if (!shopProduct || shopProduct.quantity < item.quantity) {
                        throw new Error(`Недостаточно товара: ${item.name}`);
                    }
                    
                    await shopProduct.update({
                        quantity: shopProduct.quantity - item.quantity
                    }, { transaction });
                    
                } else if (item.type === 'bouquet') {
                    await Bouquet_in_order.create({
                        order_id: order.id,
                        bouquet_id: item.id,
                        quantity: item.quantity,
                        price_at_time: item.price
                    }, { transaction });
                }
            }
            
            await transaction.commit();
            return res.status(201).json(order);
            
        } catch (error) {
            await transaction.rollback();
            return next(ApiError.internal('Ошибка: ' + error.message));
        }
    }

    // Удалить заказ (только для админа)
    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const order = await Order.findByPk(id);
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            
            await Product_in_order.destroy({ where: { order_id: id } });
            await Bouquet_in_order.destroy({ where: { order_id: id } });
            
            await order.destroy();
            
            return res.json({ message: 'Заказ удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении заказа: ' + error.message));
        }
    }
}

module.exports = new OrderController();