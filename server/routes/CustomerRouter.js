const Router = require('express')
const router = new Router()
const CustomerController = require('../controllers/CustomerController')

router.post('/', CustomerController.Post)
router.get('/', CustomerController.Get)
router.get('/:id', CustomerController.GetId)
router.put('/:id', CustomerController.Put)
router.delete('/:id', CustomerController.Delet)

module.exports = router