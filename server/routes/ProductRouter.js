const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/ProductController')
const authMiddleware = require('../middleware/authMiddleware')  // ← добавить

router.post('/', authMiddleware, ProductController.Post)
router.get('/', authMiddleware, ProductController.Get)
router.get('/:id', authMiddleware, ProductController.GetId)
router.put('/:id', authMiddleware, ProductController.Put)
router.delete('/:id', authMiddleware, ProductController.Delet)

module.exports = router