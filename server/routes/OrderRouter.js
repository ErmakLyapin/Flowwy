const Router = require('express')
const router = new Router()
const OrderController = require('../controllers/OrderController')

router.post('/', OrderController.Post)
router.get('/', OrderController.Get)
router.get('/:id', OrderController.GetId)
router.put('/:id', OrderController.Put)
router.delete('/:id', OrderController.Delet)

module.exports = router