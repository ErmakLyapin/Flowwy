const sequelize = require('../db')
const {DataTypes: DataTypes} = require('sequelize')

//Поставщик
const Supplier = sequelize.define('supplier', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    supplier_name: {type: DataTypes.STRING, unique:true, allowNull: false},
    supplier_telephone: {type: DataTypes.STRING, unique:true},
    city_id: {type: DataTypes.INTEGER},
    street_id: {type: DataTypes.INTEGER},
    house_id: {type: DataTypes.INTEGER}
})

//Поставка
const Supply = sequelize.define('supply',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    supplier_id: {type: DataTypes.INTEGER, allowNull: false},
    supply_date: {type: DataTypes.DATE},
    employee_id: {type: DataTypes.INTEGER, allowNull: false}
})

//Магазин
const Shop = sequelize.define('shop', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    shop_name: {type: DataTypes.STRING, allowNull: false},
    shop_telephone: {type: DataTypes.STRING},
    city_id: {type: DataTypes.INTEGER},
    street_id: {type: DataTypes.INTEGER},
    house_id: {type: DataTypes.INTEGER}
})

//Работник Магазина
const Employee = sequelize.define('employee', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    employee_name: {type: DataTypes.STRING, allowNull: false},
    employee_surname: {type: DataTypes.STRING, allowNull: false},
    employee_fathername: {type: DataTypes.STRING},
    employee_telephone: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING, allowNull: false}
})

//Товар
const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    product_name: {type: DataTypes.STRING, allowNull: false},
    product_type_id: {type: DataTypes.INTEGER, allowNull: false},
    retail_price: {type: DataTypes.DECIMAL(10, 2)},
    product_picture: {type: DataTypes.STRING}
})

//Тип Товара
const Product_type = sequelize.define('product_tipe', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    product_type_name: {type: DataTypes.STRING, allowNull: false}
})

//Товар в накладной
const Product_in_invoice = sequelize.define('product_in_invoice', {
    product_id: {type: DataTypes.INTEGER, primaryKey:true},
    supply_id: {type: DataTypes.INTEGER, primaryKey:true},
    wholesale_price: {type: DataTypes.DECIMAL(10, 2)},
    quantity: {type: DataTypes.INTEGER}
})

//Товар в магазине
const Product_in_shop = sequelize.define('product_in_shop', {
    product_id: {type: DataTypes.INTEGER, primaryKey:true},
    shop_id: {type: DataTypes.INTEGER, primaryKey:true},
    quantity: {type: DataTypes.INTEGER}
})

//Клиент
const Customer = sequelize.define('customer', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    customer_name: {type: DataTypes.STRING},
    customer_telephone: {type: DataTypes.STRING, unique:true, allowNull: false}
})

//Тип оплаты
const Payment_type = sequelize.define('payment_tipe', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    payment_tipe_name: {type: DataTypes.STRING, allowNull: false}
})

//Заказ
const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    customer_id: {type: DataTypes.INTEGER, allowNull: false},
    payment_type_id: {type: DataTypes.INTEGER, allowNull: false},
    shop_id: {type: DataTypes.INTEGER, allowNull: false},
    employee_id: {type: DataTypes.INTEGER, allowNull: false},
    order_date: {type: DataTypes.DATE}
})

//Букет
const Bouquet = sequelize.define('bouquet', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    bouquet_name: {type: DataTypes.STRING, allowNull: false},
    bouquet_price: {type: DataTypes.DECIMAL(10, 2)},
    bouquet_date: {type: DataTypes.DATE},
    bouquet_picture: {type: DataTypes.STRING}
})

//Товары в букете
const Product_in_bouquet = sequelize.define('product_in_bouquet',{
    bouquet_id: {type: DataTypes.INTEGER, primaryKey: true},
    product_id: {type: DataTypes.INTEGER, primaryKey: true},
    quantity: {type: DataTypes.INTEGER}
})

//товар в заказе
const Product_in_order = sequelize.define('product_in_order',{
    order_id: {type: DataTypes.INTEGER, primaryKey: true},
    product_id: {type: DataTypes.INTEGER, primaryKey: true},
    quantity: {type: DataTypes.INTEGER}
})

//Букет в заказе
const Bouquet_in_order = sequelize.define('bouquet_in_order',{
    order_id: {type: DataTypes.INTEGER, primaryKey: true},
    bouquet_id: {type: DataTypes.INTEGER, primaryKey: true},
})

//Адрес
const Address = sequelize.define('address', {
    city_id: {type: DataTypes.INTEGER, primaryKey: true},
    street_id: {type: DataTypes.INTEGER, primaryKey: true},
    house_id: {type: DataTypes.INTEGER, primaryKey: true}
})

//Город
const City = sequelize.define('city', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    city_name: {type: DataTypes.STRING, allowNull:false}
})

//Улица
const Street = sequelize.define('street', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    street_name: {type: DataTypes.STRING, allowNull: false}
})

//Дом
const House = sequelize.define('house', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    house_name: {type: DataTypes.STRING, allowNull: false}
})

//Улицы в городах
const Street_in_city = sequelize.define('street_in_city', {
    street_id: {type: DataTypes.INTEGER, primaryKey: true},
    city_id: {type: DataTypes.INTEGER, primaryKey: true},
})

//Связи

// Связи для поставок
Supply.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Supply, { foreignKey: 'supplier_id' });

Supply.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(Supply, { foreignKey: 'employee_id' });

// Связи для товаров в накладной
Product_in_invoice.belongsTo(Supply, { foreignKey: 'supply_id' });
Supply.hasMany(Product_in_invoice, { foreignKey: 'supply_id' });

Product_in_invoice.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_invoice, { foreignKey: 'product_id' });

// Связи для типов товаров
Product.belongsTo(Product_type, { foreignKey: 'product_tipe_id' });
Product_type.hasMany(Product, { foreignKey: 'product_tipe_id' });

// Связи для товаров в магазине
Product_in_shop.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_shop, { foreignKey: 'product_id' });

Product_in_shop.belongsTo(Shop, { foreignKey: 'shop_id' });
Shop.hasMany(Product_in_shop, { foreignKey: 'shop_id' });

// Связи для товаров в букете
Product_in_bouquet.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_bouquet, { foreignKey: 'product_id' });

Product_in_bouquet.belongsTo(Bouquet, { foreignKey: 'bouquet_id' });
Bouquet.hasMany(Product_in_bouquet, { foreignKey: 'bouquet_id' });

// Связи для заказов и товаров
Product_in_order.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_order, { foreignKey: 'product_id' });

Product_in_order.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Product_in_order, { foreignKey: 'order_id' });

// Связи для заказов с другими сущностями
Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });

Order.belongsTo(Payment_type, { foreignKey: 'payment_tipe_id' });
Payment_type.hasMany(Order, { foreignKey: 'payment_tipe_id' });

Order.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(Order, { foreignKey: 'employee_id' });

Order.belongsTo(Shop, { foreignKey: 'shop_id' });
Shop.hasMany(Order, { foreignKey: 'shop_id' });

// Связи для букетов в заказе
Bouquet_in_order.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Bouquet_in_order, { foreignKey: 'order_id' });

Bouquet_in_order.belongsTo(Bouquet, { foreignKey: 'bouquet_id' });
Bouquet.hasMany(Bouquet_in_order, { foreignKey: 'bouquet_id' });

// Связи для адресов
Address.belongsTo(City, { foreignKey: 'city_id' });
Address.belongsTo(Street, { foreignKey: 'street_id' });
Address.belongsTo(House, { foreignKey: 'house_id' });

City.hasMany(Address, { foreignKey: 'city_id' });
Street.hasMany(Address, { foreignKey: 'street_id' });
House.hasMany(Address, { foreignKey: 'house_id' });

// Связи для улиц в городах
Street_in_city.belongsTo(Street, { foreignKey: 'street_id' });
Street_in_city.belongsTo(City, { foreignKey: 'city_id' });

Street.hasMany(Street_in_city, { foreignKey: 'street_id' });
City.hasMany(Street_in_city, { foreignKey: 'city_id' });

// Связи поставщиков с адресами
Supplier.belongsTo(City, { foreignKey: 'city_id' });
Supplier.belongsTo(Street, { foreignKey: 'street_id' });
Supplier.belongsTo(House, { foreignKey: 'house_id' });

City.hasMany(Supplier, { foreignKey: 'city_id' });
Street.hasMany(Supplier, { foreignKey: 'street_id' });
House.hasMany(Supplier, { foreignKey: 'house_id' });

// Связи магазинов с адресами
Shop.belongsTo(City, { foreignKey: 'city_id' });
Shop.belongsTo(Street, { foreignKey: 'street_id' });
Shop.belongsTo(House, { foreignKey: 'house_id' });

City.hasMany(Shop, { foreignKey: 'city_id' });
Street.hasMany(Shop, { foreignKey: 'street_id' });
House.hasMany(Shop, { foreignKey: 'house_id' });

//Экспорт
module.exports = {
    Supplier,
    Supply,
    Shop,
    Employee,
    Product,
    Product_type,
    Product_in_invoice,
    Product_in_shop,
    Customer,
    Payment_type,
    Order,
    Bouquet,
    Product_in_bouquet,
    Product_in_order,
    Bouquet_in_order,
    Address,
    City,
    Street,
    House,
    Street_in_city
};
