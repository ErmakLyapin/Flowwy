const Router = require('express')
const router = new Router()
const SupplyController = require('../controllers/SupplyController')
const authMiddleware = require('../middleware/authMiddleware')  // ← добавить

router.post('/', authMiddleware, SupplyController.Post)  // ← добавить authMiddleware
router.get('/', authMiddleware, SupplyController.Get)    // ← добавить authMiddleware
router.get('/:id', authMiddleware, SupplyController.GetId)
router.put('/:id', authMiddleware, SupplyController.Put)
router.delete('/:id', authMiddleware, SupplyController.Delet)

module.exports = router