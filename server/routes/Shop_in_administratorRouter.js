const Router = require('express');
const router = new Router();
const shopInAdministratorController = require('../controllers/Shop_in_administratorController');

router.get('/', shopInAdministratorController.Get);
router.get('/administrator/:administrator_id', shopInAdministratorController.GetByAdministrator);
router.get('/shop/:shop_id', shopInAdministratorController.GetByShop);
router.get('/:administrator_id/:shop_id', shopInAdministratorController.GetId);
router.post('/', shopInAdministratorController.Post);
router.delete('/:administrator_id/:shop_id', shopInAdministratorController.Delet);

module.exports = router;