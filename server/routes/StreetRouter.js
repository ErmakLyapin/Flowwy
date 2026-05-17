const Router = require('express')
const router = new Router()
const StreetController = require('../controllers/StreetController')

router.post('/', StreetController.Post)
router.get('/', StreetController.Get)
router.get('/:id', StreetController.GetId)
router.put('/:id', StreetController.Put)
router.delete('/:id', StreetController.Delet)

module.exports = router