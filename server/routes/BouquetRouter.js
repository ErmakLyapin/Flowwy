const Router = require('express')
const router = new Router()
const BouquetController = require('../controllers/BouquetController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, BouquetController.Post)
router.get('/', authMiddleware, BouquetController.Get)
router.get('/:id', authMiddleware, BouquetController.GetId)
router.put('/:id', authMiddleware, BouquetController.Put)
router.delete('/:id', authMiddleware, BouquetController.Delet)

module.exports = router