const Router = require('express')
const router = new Router()
const CustomerController = require('../controllers/CustomerController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, CustomerController.Get)
router.get('/:id', authMiddleware, CustomerController.GetId)
router.post('/', authMiddleware, CustomerController.Post)
router.put('/:id', authMiddleware, CustomerController.Put)
router.delete('/:id', authMiddleware, CustomerController.Delet)

module.exports = router