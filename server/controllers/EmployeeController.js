const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employee, Employee_in_administrator, Employee_in_shop } = require('../models/models');

// Генерация JWT токена с ролью и shopId
const generateJWT = (id, employee_login, role, shopId = null) => {
    return jwt.sign(
        { id, login: employee_login, role, shopId },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class EmployeeController {
    // Регистрация (не используется для сотрудников, только для админа)
    async reg(req, res, next) {
        try {
            const { employee_name, employee_surname, employee_fathername, employee_login, password, role } = req.body;
            
            if (!employee_login || !password) {
                return next(ApiError.badRequest("Некорректный логин или пароль!"));
            }
            
            const candidate = await Employee.findOne({ where: { employee_login } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
            }
            
            const hashPassword = await bcrypt.hash(password, 6);
            const user = await Employee.create({
                employee_name,
                employee_surname,
                employee_fathername,
                employee_login,
                password: hashPassword,
                role: role || 'seller'
            });
            
            // Получаем shopId сотрудника (если есть)
            const employeeShop = await Employee_in_shop.findOne({ where: { employee_id: user.id } });
            const shopId = employeeShop?.shop_id || null;
            
            const token = generateJWT(user.id, user.employee_login, user.role, shopId);
            return res.json({ token, user });
        } catch (error) {
            return next(ApiError.internal('Ошибка при регистрации: ' + error.message));
        }
    }

    // Логин
    async login(req, res, next) {
        try {
            const { employee_login, password } = req.body;
            
            const user = await Employee.findOne({ where: { employee_login } });
            if (!user) {
                return next(ApiError.internal("Пользователь не зарегистрирован!"));
            }
            
            let comparePass = bcrypt.compareSync(password, user.password);
            if (!comparePass) {
                return next(ApiError.internal("Неверный пароль!"));
            }
            
            // Получаем shopId сотрудника (если есть)
            const employeeShop = await Employee_in_shop.findOne({ where: { employee_id: user.id } });
            const shopId = employeeShop?.shop_id || null;
            
            const token = generateJWT(user.id, user.employee_login, user.role, shopId);
            return res.json({ token, user });
        } catch (error) {
            return next(ApiError.internal('Ошибка при входе: ' + error.message));
        }
    }

    // Проверка токена (авторизация)
    async check(req, res, next) {
        try {
            const { id, login, role, shopId } = req.user;
            const token = generateJWT(id, login, role, shopId);
            return res.json({ token });
        } catch (error) {
            return next(ApiError.internal('Ошибка при проверке токена: ' + error.message));
        }
    }

    // Получить всех сотрудников
    async Get(req, res, next) {
        try {
            const employees = await Employee.findAll({
                attributes: { exclude: ['password'] }
            });
            return res.json(employees);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении сотрудников: ' + error.message));
        }
    }

    // Получить одного сотрудника по ID
    async GetId(req, res, next) {
        try {
            const { id } = req.params;
            const employee = await Employee.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            
            if (!employee) {
                return next(ApiError.badRequest('Сотрудник не найден'));
            }
            
            return res.json(employee);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении сотрудника: ' + error.message));
        }
    }

    // Обновить сотрудника
    async Put(req, res, next) {
        try {
            const { id } = req.params;
            const { employee_name, employee_surname, employee_fathername, employee_login, role } = req.body;
            
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return next(ApiError.badRequest('Сотрудник не найден'));
            }
            
            await employee.update({
                employee_name: employee_name || employee.employee_name,
                employee_surname: employee_surname || employee.employee_surname,
                employee_fathername: employee_fathername !== undefined ? employee_fathername : employee.employee_fathername,
                employee_login: employee_login || employee.employee_login,
                role: role || employee.role
            });
            
            const updatedEmployee = await Employee.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            
            return res.json(updatedEmployee);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении сотрудника: ' + error.message));
        }
    }

    // Удалить сотрудника
    async Delet(req, res, next) {
        try {
            const { id } = req.params;
            
            // Сначала удаляем связи с администраторами
            await Employee_in_administrator.destroy({ where: { employee_id: id } });
            // Удаляем связи с магазинами
            await Employee_in_shop.destroy({ where: { employee_id: id } });
            
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return next(ApiError.badRequest('Сотрудник не найден'));
            }
            
            await employee.destroy();
            return res.json({ message: 'Сотрудник успешно удалён', id: Number(id) });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении сотрудника: ' + error.message));
        }
    }

    // Создать сотрудника (администратором)
    async Post(req, res, next) {
        try {
            const { employee_name, employee_surname, employee_fathername, employee_login, password } = req.body;
            
            if (!employee_login || !password || !employee_name || !employee_surname) {
                return next(ApiError.badRequest("Все обязательные поля должны быть заполнены!"));
            }
            
            const candidate = await Employee.findOne({ where: { employee_login } });
            if (candidate) {
                return next(ApiError.badRequest('Сотрудник с таким логином уже существует'));
            }
            
            const hashPassword = await bcrypt.hash(password, 6);
            const employee = await Employee.create({
                employee_name,
                employee_surname,
                employee_fathername,
                employee_login,
                password: hashPassword,
                role: 'seller'
            });
            
            const { password: _, ...employeeData } = employee.dataValues;
            return res.status(201).json(employeeData);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании сотрудника: ' + error.message));
        }
    }

    // Сбросить пароль
    async resetPassword(req, res, next) {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;
            
            if (!newPassword || newPassword.length < 4) {
                return next(ApiError.badRequest('Пароль должен быть не менее 4 символов'));
            }
            
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return next(ApiError.badRequest('Сотрудник не найден'));
            }
            
            const hashPassword = await bcrypt.hash(newPassword, 6);
            await employee.update({ password: hashPassword });
            
            return res.json({ message: 'Пароль успешно обновлён', employee_id: id });
        } catch (error) {
            return next(ApiError.internal('Ошибка при сбросе пароля: ' + error.message));
        }
    }
}

module.exports = new EmployeeController();