const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/ProductController')

router.post('/', ProductController.Post)
router.get('/', ProductController.Get)
router.get('/:id', ProductController.GetId)
router.put('/:id', ProductController.Put)
router.delete('/:id', ProductController.Delet)

module.exports = router