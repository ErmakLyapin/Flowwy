const Router = require('express')
const router = new Router()
const EmployeeController = require('../controllers/EmployeeController')

router.post('/registration', EmployeeController.reg)
router.post('/login', EmployeeController.login)
router.get('/auth', EmployeeController.check)
router.put('/:id', EmployeeController.Put)
router.delete('/:id', EmployeeController.Delet)

module.exports = router