const Router = require('express')
const router = new Router()
const SupplierController = require('../controllers/SupplierController')

router.post('/', SupplierController.Post)
router.get('/', SupplierController.Get)
router.get('/:id', SupplierController.GetId)
router.put('/:id', SupplierController.Put)
router.delete('/:id', SupplierController.Delet)

module.exports = router