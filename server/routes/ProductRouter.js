const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/ProductController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', authMiddleware, checkRole('admin'), ProductController.Post)
router.put('/:id', authMiddleware, checkRole('admin'), ProductController.Put)
router.delete('/:id', authMiddleware, checkRole('admin'), ProductController.Delet)

// Просмотр товаров доступен всем авторизованным
router.get('/', authMiddleware, ProductController.Get)
router.get('/:id', authMiddleware, ProductController.GetId)

module.exports = router