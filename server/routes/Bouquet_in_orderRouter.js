const Router = require('express');
const router = new Router();
const bouquetInOrderController = require('../controllers/Bouquet_in_orderController');

router.get('/', bouquetInOrderController.Get);
router.get('/order/:order_id', bouquetInOrderController.GetByOrder);
router.get('/bouquet/:bouquet_id', bouquetInOrderController.GetByBouquet);
router.get('/:order_id/:bouquet_id', bouquetInOrderController.GetId);
router.post('/', bouquetInOrderController.Post);
router.put('/:order_id/:bouquet_id', bouquetInOrderController.Put);
router.delete('/:order_id/:bouquet_id', bouquetInOrderController.Delet);

module.exports = router;