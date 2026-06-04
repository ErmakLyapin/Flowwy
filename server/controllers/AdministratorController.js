const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Administrator } = require('../models/models');

// Генерация JWT токена с ролью
const generateJWT = (id, administrator_login, role) => {
    return jwt.sign(
        { id, login: administrator_login, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class AdministratorController {
    // Регистрация
    async reg(req, res, next) {
        try {
            const { administrator_name, administrator_surname, administrator_fathername, administrator_login, password, role } = req.body;
            
            if (!administrator_login || !password) {
                return next(ApiError.badRequest("Некорректный логин или пароль!"));
            }
            
            const candidate = await Administrator.findOne({ where: { administrator_login } });
            if (candidate) {
                return next(ApiError.badRequest('Администратор с таким логином уже существует'));
            }
            
            const hashPassword = await bcrypt.hash(password, 6);
            const user = await Administrator.create({
                administrator_name,
                administrator_surname,
                administrator_fathername,
                administrator_login,
                password: hashPassword,
                role: role || 'admin'  // по умолчанию админ
            });
            
            const token = generateJWT(user.id, user.administrator_login, user.role);
            return res.json({ token, user });
        } catch (error) {
            return next(ApiError.internal('Ошибка при регистрации администратора: ' + error.message));
        }
    }

    // Логин
    async login(req, res, next) {
        try {
            const { administrator_login, password } = req.body;
            
            const user = await Administrator.findOne({ where: { administrator_login } });
            if (!user) {
                return next(ApiError.internal("Администратор не зарегистрирован!"));
            }
            
            let comparePass = bcrypt.compareSync(password, user.password);
            if (!comparePass) {
                return next(ApiError.internal("Неверный пароль!"));
            }
            
            const token = generateJWT(user.id, user.administrator_login, user.role);
            return res.json({ token, user });
        } catch (error) {
            return next(ApiError.internal('Ошибка при входе: ' + error.message));
        }
    }

    // Проверка токена (авторизация)
    async check(req, res, next) {
        try {
            // req.user уже должен быть установлен middleware authMiddleware
            const token = generateJWT(req.user.id, req.user.login, req.user.role);
            return res.json({ token });
        } catch (error) {
            return next(ApiError.internal('Ошибка при проверке токена: ' + error.message));
        }
    }

    // Получить всех администраторов
    async Get(req, res, next) {
        try {
            const administrators = await Administrator.findAll({
                attributes: { exclude: ['password'] }  // не возвращаем пароль
            });
            return res.json(administrators);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении администраторов: ' + error.message));
        }
    }

    // Получить одного администратора по ID
    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const administrator = await Administrator.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            
            if (!administrator) {
                return next(ApiError.badRequest('Администратор не найден'));
            }
            
            return res.json(administrator);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении администратора: ' + error.message));
        }
    }

    // Обновить администратора
    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { administrator_name, administrator_surname, administrator_fathername, administrator_login, role } = req.body;
            
            const administrator = await Administrator.findByPk(id);
            if (!administrator) {
                return next(ApiError.badRequest('Администратор не найден'));
            }
            
            // Проверка уникальности логина (если меняется)
            if (administrator_login && administrator_login !== administrator.administrator_login) {
                const existing = await Administrator.findOne({
                    where: { administrator_login }
                });
                if (existing) {
                    return next(ApiError.badRequest('Администратор с таким логином уже существует'));
                }
            }
            
            await administrator.update({
                administrator_name: administrator_name || administrator.administrator_name,
                administrator_surname: administrator_surname || administrator.administrator_surname,
                administrator_fathername: administrator_fathername !== undefined ? administrator_fathername : administrator.administrator_fathername,
                administrator_login: administrator_login || administrator.administrator_login,
                role: role || administrator.role
            });
            
            const updatedAdministrator = await Administrator.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            
            return res.json(updatedAdministrator);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении администратора: ' + error.message));
        }
    }

    // Удалить администратора
    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            const administrator = await Administrator.findByPk(id);
            if (!administrator) {
                return next(ApiError.badRequest('Администратор не найден'));
            }
            
            await administrator.destroy();
            return res.json({ message: 'Администратор успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении администратора: ' + error.message));
        }
    }
}

module.exports = new AdministratorController();