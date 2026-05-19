const Router = require('express');
const router = new Router();

// Основные роутеры
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

// Новые роутеры для связочных таблиц (с нижними подчеркиваниями)
const street_in_cityRouter = require('./Street_in_cityRouter');
const addressRouter = require('./AddressRouter');
const product_in_invoiceRouter = require('./Product_in_invoiceRouter');
const product_in_shopRouter = require('./Product_in_shopRouter');
const product_in_bouquetRouter = require('./Product_in_bouquetRouter');
const product_in_orderRouter = require('./Product_in_orderRouter');
const bouquet_in_orderRouter = require('./Bouquet_in_orderRouter');

// Подключение основных роутеров
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

// Подключение новых роутеров для связочных таблиц
router.use('/street_in_city', street_in_cityRouter);
router.use('/address', addressRouter);
router.use('/product_in_invoice', product_in_invoiceRouter);
router.use('/product_in_shop', product_in_shopRouter);
router.use('/product_in_bouquet', product_in_bouquetRouter);
router.use('/product_in_order', product_in_orderRouter);
router.use('/bouquet_in_order', bouquet_in_orderRouter);

module.exports = router;