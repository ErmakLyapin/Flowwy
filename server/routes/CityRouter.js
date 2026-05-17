const Router = require('express')
const router = new Router()
const CityController = require('../controllers/CityController')

router.post('/', CityController.Post)
router.get('/', CityController.Get)
router.get('/:id', CityController.GetId)
router.put('/:id', CityController.Put)
router.delete('/:id', CityController.Delet)

module.exports = router