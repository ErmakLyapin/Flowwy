const Router = require('express');
const router = new Router();
const productInBouquetController = require('../controllers/Product_in_bouquetController');
const authMiddleware = require('../middleware/authMiddleware');  // ← добавить

router.get('/', authMiddleware, productInBouquetController.Get);
router.get('/bouquet/:bouquet_id', authMiddleware, productInBouquetController.GetByBouquet);
router.get('/product/:product_id', authMiddleware, productInBouquetController.GetByProduct);
router.get('/:bouquet_id/:product_id', authMiddleware, productInBouquetController.GetId);
router.post('/', authMiddleware, productInBouquetController.Post);
router.put('/:bouquet_id/:product_id', authMiddleware, productInBouquetController.Put);
router.delete('/:bouquet_id/:product_id', authMiddleware, productInBouquetController.Delet);

module.exports = router;