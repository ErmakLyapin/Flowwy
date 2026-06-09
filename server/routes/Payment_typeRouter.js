const Router = require('express')
const router = new Router()
const PaymentTypeController = require('../controllers/Payment_typeController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, PaymentTypeController.Get)
router.get('/:id', authMiddleware, PaymentTypeController.GetId)
router.post('/', authMiddleware, PaymentTypeController.Post)
router.put('/:id', authMiddleware, PaymentTypeController.Put)
router.delete('/:id', authMiddleware, PaymentTypeController.Delet)

module.exports = router