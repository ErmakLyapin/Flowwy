const Router = require('express')
const router = new Router()
const Payment_typeController = require('../controllers/Payment_typeController')

router.post('/', Payment_typeController.Post)
router.get('/', Payment_typeController.Get)
router.get('/:id', Payment_typeController.GetId)
router.put('/:id', Payment_typeController.Put)
router.delete('/:id', Payment_typeController.Delet)

module.exports = router