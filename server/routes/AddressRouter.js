const Router = require('express');
const router = new Router();
const addressController = require('../controllers/AddressController');

router.get('/', addressController.Get);
router.get('/city/:city_id', addressController.GetByCity);
router.get('/:city_id/:street_id/:house_id', addressController.GetId);
router.post('/', addressController.Post);
router.delete('/:city_id/:street_id/:house_id', addressController.Delet);

module.exports = router;