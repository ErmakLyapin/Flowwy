const Router = require('express');
const router = new Router();
const productInShopController = require('../controllers/Product_in_shopController');

router.get('/', productInShopController.Get);
router.get('/available', productInShopController.GetAvailable);
router.get('/shop/:shop_id', productInShopController.GetByShop);
router.get('/:id', productInShopController.GetId);
router.post('/', productInShopController.Post);
router.put('/:id', productInShopController.Put);
router.delete('/:id', productInShopController.Delet);

module.exports = router;