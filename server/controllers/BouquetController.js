const { Bouquet } = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

class BouquetController {
    async Get(req, res, next) {
    try {
        // Если нужна пагинация
        let { limit, page } = req.query;
        if (limit && page) {
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let bouquets = await Bouquet.findAndCountAll({ limit, offset });
            return res.json(bouquets); // { count, rows }
        }
        
        // Без пагинации - возвращаем массив
        let bouquets = await Bouquet.findAll({
            order: [['createdAt', 'DESC']]
        });
        return res.json(bouquets);
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении букетов: ' + error.message));
    }
}

    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const bouquet = await Bouquet.findByPk(id);
            
            if (!bouquet) {
                return next(ApiError.badRequest('Букет не найден'));
            }
            
            return res.json(bouquet);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении букета'));
        }
    }

    async Post(req, res, next) {
        try {
            const { bouquet_name, bouquet_price, bouquet_date } = req.body;
            
            // Проверка обязательных полей
            if (!bouquet_name) {
                return next(ApiError.badRequest('bouquet_name обязателен'));
            }
            
            // Обработка картинки
            let filename = null;
            if (req.files && req.files.bouquet_picture) {
                const { bouquet_picture } = req.files;
                filename = uuid.v4() + '.jpg';
                const uploadPath = path.resolve(__dirname, '../', 'static', filename);
                
                // Создаём папку static, если её нет
                const staticDir = path.resolve(__dirname, '../', 'static');
                if (!fs.existsSync(staticDir)) {
                    fs.mkdirSync(staticDir, { recursive: true });
                }
                
                await bouquet_picture.mv(uploadPath);
            }
            
            const bouquet = await Bouquet.create({ 
                bouquet_name, 
                bouquet_price, 
                bouquet_date, 
                bouquet_picture: filename
            });
            
            return res.status(201).json(bouquet);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании букета: ' + error.message));
        }
    }

    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { bouquet_name, bouquet_price, bouquet_date } = req.body;
            
            const bouquet = await Bouquet.findByPk(id);
            
            if (!bouquet) {
                return next(ApiError.badRequest('Букет не найден'));
            }
            
            // Обработка новой картинки
            let filename = bouquet.bouquet_picture;
            if (req.files && req.files.bouquet_picture) {
                const { bouquet_picture } = req.files;
                filename = uuid.v4() + '.jpg';
                const uploadPath = path.resolve(__dirname, '../', 'static', filename);
                
                // Создаём папку static, если её нет
                const staticDir = path.resolve(__dirname, '../', 'static');
                if (!fs.existsSync(staticDir)) {
                    fs.mkdirSync(staticDir, { recursive: true });
                }
                
                await bouquet_picture.mv(uploadPath);
                
                // Удаляем старую картинку, если она была
                if (bouquet.bouquet_picture) {
                    const oldFilePath = path.resolve(__dirname, '../', 'static', bouquet.bouquet_picture);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
            }
            
            await bouquet.update({
                bouquet_name: bouquet_name || bouquet.bouquet_name,
                bouquet_price: bouquet_price !== undefined ? bouquet_price : bouquet.bouquet_price,
                bouquet_date: bouquet_date || bouquet.bouquet_date,
                bouquet_picture: filename
            });
            
            return res.json(bouquet);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении букета: ' + error.message));
        }
    }

    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const bouquet = await Bouquet.findByPk(id);
            
            if (!bouquet) {
                return next(ApiError.badRequest('Букет не найден'));
            }
            
            // Удаляем картинку, если она есть
            if (bouquet.bouquet_picture) {
                const filePath = path.resolve(__dirname, '../', 'static', bouquet.bouquet_picture);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            
            await bouquet.destroy();
            
            return res.json({ message: 'Букет успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении букета: ' + error.message));
        }
    }
}

module.exports = new BouquetController();