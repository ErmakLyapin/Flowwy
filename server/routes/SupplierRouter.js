const Router = require('express')
const router = new Router()
const SupplierController = require('../controllers/SupplierController')
const authMiddleware = require('../middleware/authMiddleware')  // ← добавить

router.post('/', authMiddleware, SupplierController.Post)
router.get('/', authMiddleware, SupplierController.Get)
router.get('/:id', authMiddleware, SupplierController.GetId)
router.put('/:id', authMiddleware, SupplierController.Put)
router.delete('/:id', authMiddleware, SupplierController.Delet)

module.exports = router