const Router = require('express')
const router = new Router()
const EmployeeController = require('../controllers/EmployeeController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// Только для администратора
router.post('/', authMiddleware, checkRole('admin'), EmployeeController.Post)
router.put('/:id', authMiddleware, checkRole('admin'), EmployeeController.Put)
router.delete('/:id', authMiddleware, checkRole('admin'), EmployeeController.Delet)

// Для всех авторизованных
router.get('/', authMiddleware, EmployeeController.Get)
router.get('/:id', authMiddleware, EmployeeController.GetId)

// Публичные
router.post('/registration', EmployeeController.reg)
router.post('/login', EmployeeController.login)
router.get('/auth', authMiddleware, EmployeeController.check)

module.exports = router