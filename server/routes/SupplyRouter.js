const Router = require('express')
const router = new Router()
const SupplyController = require('../controllers/SupplyController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', authMiddleware, checkRole('admin'), SupplyController.Post)
router.put('/:id', authMiddleware, checkRole('admin'), SupplyController.Put)
router.delete('/:id', authMiddleware, checkRole('admin'), SupplyController.Delet)
router.get('/', authMiddleware, checkRole('admin'), SupplyController.Get)
router.get('/:id', authMiddleware, checkRole('admin'), SupplyController.GetId)

module.exports = router