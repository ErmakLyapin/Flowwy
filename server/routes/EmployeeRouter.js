const Router = require('express')
const router = new Router()
const EmployeeController = require('../controllers/EmployeeController')
const authMiddleware = require('../middleware/authMiddleware')

// Публичные маршруты
router.post('/registration', EmployeeController.reg)
router.post('/login', EmployeeController.login)
router.get('/auth', authMiddleware, EmployeeController.check)

// CRUD операции для админа
router.get('/', EmployeeController.Get)
router.get('/:id', EmployeeController.GetId)      
router.post('/', EmployeeController.Post)        
router.put('/:id', EmployeeController.Put)
router.delete('/:id', EmployeeController.Delet)
router.put('/reset-password/:id', authMiddleware, EmployeeController.resetPassword)

module.exports = router