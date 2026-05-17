const Router = require('express')
const router = new Router()
const BouquetController = require('../controllers/BouquetController')

router.post('/', BouquetController.Post)
router.get('/', BouquetController.Get)
router.get('/:id', BouquetController.GetId)
router.put('/:id', BouquetController.Put)
router.delete('/:id', BouquetController.Delet)

module.exports = router