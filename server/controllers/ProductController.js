const { Product } = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

class ProductController {
    async Get(req, res, next) {
        try {
            let {product_type_id, limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let products = await Product.findAndCountAll({ where: { product_type_id }, limit, offset })
            return res.json(products);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении товаров'));
        }
    }

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            
            if (!product) {
                return next(ApiError.badRequest('Товар не найден'));
            }
            
            return res.json(product);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении товара'));
        }
    }

    async Post(req, res, next) {
        try {
            const { product_name, product_type_id, retail_price } = req.body;
            
            if (!product_name) {
                return next(ApiError.badRequest('product_name обязателен'));
            }
            
            // Обработка картинки
            let filename = null;
            if (req.files && req.files.product_picture) {
                const { product_picture } = req.files;
                filename = uuid.v4() + '.jpg';
                const uploadPath = path.resolve(__dirname, '../', 'static', filename);
                
                // Создаём папку static, если её нет
                const staticDir = path.resolve(__dirname, '../', 'static');
                if (!fs.existsSync(staticDir)) {
                    fs.mkdirSync(staticDir, { recursive: true });
                }
                
                await product_picture.mv(uploadPath);
            }
            
            const product = await Product.create({ 
                product_name, 
                product_type_id, 
                retail_price, 
                product_picture: filename
            });
            
            return res.status(201).json(product);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании товара: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { product_name, product_type_id, retail_price } = req.body;
            
            const product = await Product.findByPk(id);
            
            if (!product) {
                return next(ApiError.badRequest('Товар не найден'));
            }
            
            // Обработка новой картинки
            let filename = product.product_picture;
            if (req.files && req.files.product_picture) {
                const { product_picture } = req.files;
                filename = uuid.v4() + '.jpg';
                const uploadPath = path.resolve(__dirname, '../', 'static', filename);
                
                // Создаём папку static, если её нет
                const staticDir = path.resolve(__dirname, '../', 'static');
                if (!fs.existsSync(staticDir)) {
                    fs.mkdirSync(staticDir, { recursive: true });
                }
                
                await product_picture.mv(uploadPath);
                
                // Удаляем старую картинку, если она была
                if (product.product_picture) {
                    const oldFilePath = path.resolve(__dirname, '../', 'static', product.product_picture);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
            }
            
            await product.update({
                product_name: product_name || product.product_name,
                product_type_id: product_type_id !== undefined ? product_type_id : product.product_type_id,
                retail_price: retail_price !== undefined ? retail_price : product.retail_price,
                product_picture: filename
            });
            
            return res.json(product);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении товара: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const product = await Product.findByPk(id);
            
            if (!product) {
                return next(ApiError.badRequest('Товар не найден'));
            }
            
            // Удаляем картинку, если она есть
            if (product.product_picture) {
                const filePath = path.resolve(__dirname, '../', 'static', product.product_picture);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            
            await product.destroy();
            
            return res.json({ message: 'Товар успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении товара: ' + error.message));
        }
    }
}

module.exports = new ProductController();