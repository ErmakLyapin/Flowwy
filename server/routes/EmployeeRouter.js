const Router = require('express')
const router = new Router()
const EmployeeController = require('../controllers/EmployeeController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', EmployeeController.reg)
router.post('/login', EmployeeController.login)
router.get('/auth', authMiddleware, EmployeeController.check)
router.put('/:id', EmployeeController.Put)
router.delete('/:id', EmployeeController.Delet)

module.exports = router