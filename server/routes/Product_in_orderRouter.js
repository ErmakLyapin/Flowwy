const Router = require('express');
const router = new Router();
const productInOrderController = require('../controllers/Product_in_orderController');

router.get('/', productInOrderController.Get);
router.get('/order/:order_id', productInOrderController.GetByOrder);
router.get('/product/:product_id', productInOrderController.GetByProduct);
router.get('/:order_id/:product_id', productInOrderController.GetId);
router.post('/', productInOrderController.Post);
router.put('/:order_id/:product_id', productInOrderController.Put);
router.delete('/:order_id/:product_id', productInOrderController.Delet);

module.exports = router;