const Router = require('express')
const router = new Router()
const HouseController = require('../controllers/HouseController')

router.post('/', HouseController.Post)
router.get('/', HouseController.Get)
router.get('/:id', HouseController.GetId)
router.put('/:id', HouseController.Put)
router.delete('/:id', HouseController.Delet)

module.exports = router