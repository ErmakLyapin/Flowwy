const Router = require('express');
const router = new Router();
const productInBouquetController = require('../controllers/Product_in_bouquetController');

router.get('/', productInBouquetController.Get);
router.get('/bouquet/:bouquet_id', productInBouquetController.GetByBouquet);
router.get('/product/:product_id', productInBouquetController.GetByProduct);
router.get('/:bouquet_id/:product_id', productInBouquetController.GetId);
router.post('/', productInBouquetController.Post);
router.put('/:bouquet_id/:product_id', productInBouquetController.Put);
router.delete('/:bouquet_id/:product_id', productInBouquetController.Delet);

module.exports = router;