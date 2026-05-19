const Router = require('express');
const router = new Router();
const productInInvoiceController = require('../controllers/Product_in_invoiceController');

router.get('/', productInInvoiceController.Get);
router.get('/supply/:supply_id', productInInvoiceController.GetBySupply);
router.get('/product/:product_id', productInInvoiceController.GetByProduct);
router.get('/:product_id/:supply_id', productInInvoiceController.GetId);
router.post('/', productInInvoiceController.Post);
router.put('/:product_id/:supply_id', productInInvoiceController.Put);
router.delete('/:product_id/:supply_id', productInInvoiceController.Delet);

module.exports = router;