const Router = require('express');
const router = new Router();
const streetInCityController = require('../controllers/Street_in_cityController');

router.get('/', streetInCityController.Get);
router.get('/city/:city_id', streetInCityController.GetByCity);
router.get('/street/:street_id', streetInCityController.GetByStreet);
router.get('/:street_id/:city_id', streetInCityController.GetId);
router.post('/', streetInCityController.Post);
router.delete('/:street_id/:city_id', streetInCityController.Delet);

module.exports = router;