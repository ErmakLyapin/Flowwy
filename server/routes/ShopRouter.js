const Router = require('express')
const router = new Router()
const ShopController = require('../controllers/ShopController')

router.post('/', ShopController.Post)
router.get('/', ShopController.Get)
router.get('/:id', ShopController.GetId)
router.put('/:id', ShopController.Put)
router.delete('/:id', ShopController.Delet)

module.exports = router