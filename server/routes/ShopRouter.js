const Router = require('express')
const router = new Router()
const ShopController = require('../controllers/ShopController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')  // ← добавить

// Только для администратора
router.post('/', authMiddleware, checkRole('admin'), ShopController.Post)
router.put('/:id', authMiddleware, checkRole('admin'), ShopController.Put)
router.delete('/:id', authMiddleware, checkRole('admin'), ShopController.Delet)

// Для всех авторизованных (и админ, и сотрудник)
router.get('/', authMiddleware, ShopController.Get)
router.get('/:id', authMiddleware, ShopController.GetId)

module.exports = router