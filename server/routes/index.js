const Router = require('express');
const router = new Router();

const bouquetRouter = require('./BouquetRouter');
const cityRouter = require('./CityRouter');
const customerRouter = require('./CustomerRouter');
const employeeRouter = require('./EmployeeRouter');
const houseRouter = require('./HouseRouter');
const orderRouter = require('./OrderRouter');
const paymentTypeRouter = require('./Payment_typeRouter');
const productTypeRouter = require('./Product_typeRouter');
const productRouter = require('./ProductRouter');
const shopRouter = require('./ShopRouter');
const streetRouter = require('./StreetRouter');
const supplierRouter = require('./SupplierRouter');
const supplyRouter = require('./SupplyRouter');

router.use('/bouquet', bouquetRouter);
router.use('/city', cityRouter);
router.use('/customer', customerRouter);
router.use('/employee', employeeRouter);
router.use('/house', houseRouter);
router.use('/order', orderRouter);
router.use('/payment_type', paymentTypeRouter);
router.use('/product_type', productTypeRouter);
router.use('/product', productRouter);
router.use('/shop', shopRouter);
router.use('/street', streetRouter);
router.use('/supplier', supplierRouter);
router.use('/supply', supplyRouter);

module.exports = router;