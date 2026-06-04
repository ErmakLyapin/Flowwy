const Router = require('express');
const router = new Router();

// Основные роутеры
const administratorRouter = require('./AdministratorRouter');  // ← ДОБАВИТЬ
const bouquetRouter = require('./BouquetRouter');
const customerRouter = require('./CustomerRouter');
const employeeRouter = require('./EmployeeRouter');
const orderRouter = require('./OrderRouter');
const paymentTypeRouter = require('./Payment_typeRouter');
const productTypeRouter = require('./Product_typeRouter');
const productRouter = require('./ProductRouter');
const shopRouter = require('./ShopRouter');
const supplierRouter = require('./SupplierRouter');
const supplyRouter = require('./SupplyRouter');

// Новые роутеры для связочных таблиц
const product_in_invoiceRouter = require('./Product_in_invoiceRouter');
const product_in_shopRouter = require('./Product_in_shopRouter');
const product_in_bouquetRouter = require('./Product_in_bouquetRouter');
const product_in_orderRouter = require('./Product_in_orderRouter');
const bouquet_in_orderRouter = require('./Bouquet_in_orderRouter');
const shop_in_administratorRouter = require('./Shop_in_administratorRouter');
const employee_in_shopRouter = require('./Employee_in_shopRouter');
const employee_in_administratorRouter = require('./Employee_in_administratorRouter');

// Подключение основных роутеров
router.use('/administrator', administratorRouter);  // ← ДОБАВИТЬ
router.use('/bouquet', bouquetRouter);
router.use('/customer', customerRouter);
router.use('/employee', employeeRouter);
router.use('/order', orderRouter);
router.use('/payment_type', paymentTypeRouter);
router.use('/product_type', productTypeRouter);
router.use('/product', productRouter);
router.use('/shop', shopRouter);
router.use('/supplier', supplierRouter);
router.use('/supply', supplyRouter);

// Подключение роутеров для связочных таблиц
router.use('/product_in_invoice', product_in_invoiceRouter);
router.use('/product_in_shop', product_in_shopRouter);
router.use('/product_in_bouquet', product_in_bouquetRouter);
router.use('/product_in_order', product_in_orderRouter);
router.use('/bouquet_in_order', bouquet_in_orderRouter);
router.use('/shop_in_administrator', shop_in_administratorRouter);
router.use('/employee_in_shop', employee_in_shopRouter);
router.use('/employee_in_administrator', employee_in_administratorRouter);

module.exports = router;