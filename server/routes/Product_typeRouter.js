const Router = require('express')
const router = new Router()
const Product_typeController = require('../controllers/Product_typeController')

router.post('/', Product_typeController.Post)
router.get('/', Product_typeController.Get)
router.get('/:id', Product_typeController.GetId)
router.put('/:id', Product_typeController.Put)
router.delete('/:id', Product_typeController.Delet)

module.exports = router