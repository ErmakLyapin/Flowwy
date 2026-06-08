const Router = require('express');
const router = new Router();
const productInShopController = require('../controllers/Product_in_shopController');
const authMiddleware = require('../middleware/authMiddleware');  // ← добавить

router.get('/', authMiddleware, productInShopController.Get);
router.get('/available', authMiddleware, productInShopController.GetAvailable);
router.get('/shop/:shop_id', authMiddleware, productInShopController.GetByShop);
router.get('/product/:product_id', authMiddleware, productInShopController.GetByProduct);
router.get('/:product_id/:shop_id', authMiddleware, productInShopController.GetId);
router.post('/', authMiddleware, productInShopController.Post);
router.put('/:product_id/:shop_id', authMiddleware, productInShopController.Put);  // ← исправить
router.delete('/:product_id/:shop_id', authMiddleware, productInShopController.Delet);
router.put('/writeoff/:product_id/:shop_id', authMiddleware, productInShopController.WriteOff);

module.exports = router;