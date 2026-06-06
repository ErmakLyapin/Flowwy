const Router = require('express')
const router = new Router()
const Product_typeController = require('../controllers/Product_typeController')
const authMiddleware = require('../middleware/authMiddleware')  // ← добавить

router.post('/', authMiddleware, Product_typeController.Post)   // ← добавить authMiddleware
router.get('/', authMiddleware, Product_typeController.Get)     // ← добавить authMiddleware
router.get('/:id', authMiddleware, Product_typeController.GetId)
router.put('/:id', authMiddleware, Product_typeController.Put)
router.delete('/:id', authMiddleware, Product_typeController.Delet)

module.exports = router