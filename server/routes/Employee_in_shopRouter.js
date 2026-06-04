const Router = require('express');
const router = new Router();
const employeeInShopController = require('../controllers/Employee_in_shopController');

router.get('/', employeeInShopController.Get);
router.get('/employee/:employee_id', employeeInShopController.GetByEmployee);
router.get('/shop/:shop_id', employeeInShopController.GetByShop);
router.get('/:employee_id/:shop_id', employeeInShopController.GetId);
router.post('/', employeeInShopController.Post);
router.delete('/:employee_id/:shop_id', employeeInShopController.Delet);

module.exports = router;