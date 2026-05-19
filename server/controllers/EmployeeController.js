const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employee } = require('../models/models');

// Генерация JWT токена с ролью
const generateJWT = (id, employee_telephone, role) => {
    return jwt.sign(
        { id, login: employee_telephone, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class EmployeeController {
    // Регистрация
    async reg(req, res, next) {
        try {
            const { employee_name, employee_surname, employee_fathername, employee_telephone, password, role } = req.body;
            
            if (!employee_telephone || !password) {
                return next(ApiError.badRequest("Некорректный логин или пароль!"));
            }
            
            const candidate = await Employee.findOne({ where: { employee_telephone } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким телефоном уже существует'));
            }
            
            const hashPassword = await bcrypt.hash(password, 6);
            const user = await Employee.create({
                employee_name,
                employee_surname,
                employee_fathername,
                employee_telephone,
                password: hashPassword,
                role: role || 'seller'  // по умолчанию продавец
            });
            
            const token = generateJWT(user.id, user.employee_telephone, user.role);
            return res.json({ token, user });
        } catch (error) {
            return next(ApiError.internal('Ошибка при регистрации: ' + error.message));
        }
    }

    // Логин
    async login(req, res, next) {
        try {
            const { employee_telephone, password } = req.body;
            
            const user = await Employee.findOne({ where: { employee_telephone } });
            if (!user) {
                return next(ApiError.internal("Пользователь не зарегистрирован!"));
            }
            
            let comparePass = bcrypt.compareSync(password, user.password);
            if (!comparePass) {
                return next(ApiError.internal("Неверный пароль!"));
            }
            
            const token = generateJWT(user.id, user.employee_telephone, user.role);
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

    // Получить всех сотрудников
    async Get(req, res, next) {
        try {
            const employees = await Employee.findAll({
                attributes: { exclude: ['password'] }  // не возвращаем пароль
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
            const { employee_name, employee_surname, employee_fathername, employee_telephone, role } = req.body;
            
            const employee = await Employee.findByPk(id);
            if (!employee) {
                return next(ApiError.badRequest('Сотрудник не найден'));
            }
            
            await employee.update({
                employee_name: employee_name || employee.employee_name,
                employee_surname: employee_surname || employee.employee_surname,
                employee_fathername: employee_fathername || employee.employee_fathername,
                employee_telephone: employee_telephone || employee.employee_telephone,
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
}

module.exports = new EmployeeController();