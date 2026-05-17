const Router = require('express')
const router = new Router()
const SupplyController = require('../controllers/SupplyContrioller')

router.post('/', SupplyController.Post)
router.get('/', SupplyController.Get)
router.get('/:id', SupplyController.GetId)
router.put('/:id', SupplyController.Put)
router.delete('/:id', SupplyController.Delet)

module.exports = router