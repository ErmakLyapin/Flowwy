const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// ========== АДМИНИСТРАТОР ==========
const Administrator = sequelize.define('administrator', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    administrator_name: { type: DataTypes.STRING, allowNull: true },  // ← изменено с false на true
    administrator_surname: { type: DataTypes.STRING, allowNull: true },  // ← изменено с false на true
    administrator_fathername: { type: DataTypes.STRING },
    administrator_login: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

// ========== СОТРУДНИК ==========
const Employee = sequelize.define('employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_name: { type: DataTypes.STRING, allowNull: true },  // ← изменено с false на true
    employee_surname: { type: DataTypes.STRING, allowNull: true },  // ← изменено с false на true
    employee_fathername: { type: DataTypes.STRING },
    employee_login: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
});

// ========== ПОСТАВЩИК ==========
const Supplier = sequelize.define('supplier', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    supplier_name: { type: DataTypes.STRING, unique: true, allowNull: false },
    supplier_telephone: { type: DataTypes.STRING, unique: true },
    administrator_id: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== ПОСТАВКА ==========
const Supply = sequelize.define('supply', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    supplier_id: { type: DataTypes.INTEGER, allowNull: false },
    supply_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    administrator_id: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== МАГАЗИН ==========
const Shop = sequelize.define('shop', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shop_name: { type: DataTypes.STRING, allowNull: false },
    shop_telephone: { type: DataTypes.STRING }
});

// ========== ТИП ТОВАРА ==========
const Product_type = sequelize.define('product_type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_type_name: { type: DataTypes.STRING, allowNull: false },
    administrator_id: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== ТОВАР ==========
const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_name: { type: DataTypes.STRING, allowNull: false },
    product_type_id: { type: DataTypes.INTEGER, allowNull: false },
    retail_price: { type: DataTypes.DECIMAL(10, 2) },
    product_picture: { type: DataTypes.STRING },
    administrator_id: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== ТОВАР В НАКЛАДНОЙ (поставка) ==========
const Product_in_invoice = sequelize.define('product_in_invoice', {
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    supply_id: { type: DataTypes.INTEGER, primaryKey: true },
    wholesale_price: { type: DataTypes.DECIMAL(10, 2) },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// ========== ТОВАР В МАГАЗИНЕ (остатки) ==========
const Product_in_shop = sequelize.define('product_in_shop', {
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    shop_id: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// ========== КЛИЕНТ ==========
const Customer = sequelize.define('customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customer_name: { type: DataTypes.STRING },
    customer_telephone: { type: DataTypes.STRING, unique: true, allowNull: false },
    administrator_id: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== ТИП ОПЛАТЫ ==========
const Payment_type = sequelize.define('payment_type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    payment_type_name: { type: DataTypes.STRING, allowNull: false },
    administrator_id: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== ЗАКАЗ ==========
const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    payment_type_id: { type: DataTypes.INTEGER, allowNull: false },
    shop_id: { type: DataTypes.INTEGER, allowNull: false },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_price: { type: DataTypes.DECIMAL(10, 2) }
});

// ========== БУКЕТ ==========
const Bouquet = sequelize.define('bouquet', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bouquet_name: { type: DataTypes.STRING, allowNull: false },
    bouquet_price: { type: DataTypes.DECIMAL(10, 2) },
    bouquet_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    bouquet_picture: { type: DataTypes.STRING }
});

// ========== ТОВАРЫ В БУКЕТЕ ==========
const Product_in_bouquet = sequelize.define('product_in_bouquet', {
    bouquet_id: { type: DataTypes.INTEGER, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

// ========== ТОВАР В ЗАКАЗЕ ==========
const Product_in_order = sequelize.define('product_in_order', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price_at_time: { type: DataTypes.DECIMAL(10, 2) }
});

// ========== БУКЕТ В ЗАКАЗЕ ==========
const Bouquet_in_order = sequelize.define('bouquet_in_order', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true },
    bouquet_id: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price_at_time: { type: DataTypes.DECIMAL(10, 2) }
});

// ===== СВЯЗИ АДМИНИСТРАТОР -> МАГАЗИНЫ (многие ко многим) =====
const Shop_in_administrator = sequelize.define('shop_in_administrator', {
    administrator_id: { type: DataTypes.INTEGER, primaryKey: true },
    shop_id: { type: DataTypes.INTEGER, primaryKey: true },
});

// ЯВНЫЕ СВЯЗИ
Shop_in_administrator.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Shop_in_administrator, { foreignKey: 'administrator_id' });
Shop_in_administrator.belongsTo(Shop, { foreignKey: 'shop_id' });
Shop.hasMany(Shop_in_administrator, { foreignKey: 'shop_id' });

// ===== СВЯЗИ АДМИНИСТРАТОР -> СОТРУДНИКИ =====
const Employee_in_administrator = sequelize.define('employee_in_administrator', {
    administrator_id: { type: DataTypes.INTEGER, primaryKey: true },
    employee_id: { type: DataTypes.INTEGER, primaryKey: true },
});

// ЯВНЫЕ СВЯЗИ
Employee_in_administrator.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Employee_in_administrator, { foreignKey: 'administrator_id' });
Employee_in_administrator.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(Employee_in_administrator, { foreignKey: 'employee_id' });

// ===== СВЯЗИ СОТРУДНИК -> МАГАЗИН =====
const Employee_in_shop = sequelize.define('employee_in_shop', {
    employee_id: { type: DataTypes.INTEGER, primaryKey: true },
    shop_id: { type: DataTypes.INTEGER, primaryKey: true },
});

// ЯВНЫЕ СВЯЗИ
Employee_in_shop.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(Employee_in_shop, { foreignKey: 'employee_id' });
Employee_in_shop.belongsTo(Shop, { foreignKey: 'shop_id' });
Shop.hasMany(Employee_in_shop, { foreignKey: 'shop_id' });

// ===== СВЯЗИ ДЛЯ АДМИНИСТРАТОРА =====
Administrator.belongsToMany(Shop, { through: Shop_in_administrator, foreignKey: 'administrator_id' });
Shop.belongsToMany(Administrator, { through: Shop_in_administrator, foreignKey: 'shop_id' });

Administrator.belongsToMany(Employee, { through: Employee_in_administrator, foreignKey: 'administrator_id' });
Employee.belongsToMany(Administrator, { through: Employee_in_administrator, foreignKey: 'employee_id' });

// ===== СВЯЗИ ДЛЯ СОТРУДНИКОВ И МАГАЗИНОВ =====
Employee.belongsToMany(Shop, { through: Employee_in_shop, foreignKey: 'employee_id' });
Shop.belongsToMany(Employee, { through: Employee_in_shop, foreignKey: 'shop_id' });

// ===== СВЯЗИ ДЛЯ ПОСТАВОК =====
Supply.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Supply, { foreignKey: 'supplier_id' });

Supply.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(Supply, { foreignKey: 'employee_id' });

// ===== СВЯЗИ ДЛЯ ТОВАРОВ В НАКЛАДНОЙ =====
Product_in_invoice.belongsTo(Supply, { foreignKey: 'supply_id' });
Supply.hasMany(Product_in_invoice, { foreignKey: 'supply_id' });

Product_in_invoice.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_invoice, { foreignKey: 'product_id' });

// ===== СВЯЗИ ДЛЯ ТИПОВ ТОВАРОВ =====
Product.belongsTo(Product_type, { foreignKey: 'product_type_id' });
Product_type.hasMany(Product, { foreignKey: 'product_type_id' });

// ===== СВЯЗИ ДЛЯ ТОВАРОВ В МАГАЗИНЕ =====
Product_in_shop.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_shop, { foreignKey: 'product_id' });

Product_in_shop.belongsTo(Shop, { foreignKey: 'shop_id' });
Shop.hasMany(Product_in_shop, { foreignKey: 'shop_id' });

// ===== СВЯЗИ ДЛЯ ТОВАРОВ В БУКЕТЕ =====
Product_in_bouquet.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_bouquet, { foreignKey: 'product_id' });

Product_in_bouquet.belongsTo(Bouquet, { foreignKey: 'bouquet_id' });
Bouquet.hasMany(Product_in_bouquet, { foreignKey: 'bouquet_id' });

// ===== СВЯЗИ ДЛЯ ЗАКАЗОВ И ТОВАРОВ =====
Product_in_order.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_in_order, { foreignKey: 'product_id' });

Product_in_order.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Product_in_order, { foreignKey: 'order_id' });

// ===== СВЯЗИ ДЛЯ ЗАКАЗОВ =====
Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });

Order.belongsTo(Payment_type, { foreignKey: 'payment_type_id' });
Payment_type.hasMany(Order, { foreignKey: 'payment_type_id' });

Order.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasMany(Order, { foreignKey: 'employee_id' });

Order.belongsTo(Shop, { foreignKey: 'shop_id' });
Shop.hasMany(Order, { foreignKey: 'shop_id' });

// ===== СВЯЗИ ДЛЯ БУКЕТОВ В ЗАКАЗЕ =====
Bouquet_in_order.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Bouquet_in_order, { foreignKey: 'order_id' });

Bouquet_in_order.belongsTo(Bouquet, { foreignKey: 'bouquet_id' });
Bouquet.hasMany(Bouquet_in_order, { foreignKey: 'bouquet_id' });

// ===== СВЯЗИ ДЛЯ ПОСТАВЩИКА (Supplier) =====
Supplier.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Supplier, { foreignKey: 'administrator_id' });

// ===== СВЯЗИ ДЛЯ ТИПА ТОВАРА (Product_type) =====
Product_type.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Product_type, { foreignKey: 'administrator_id' });

// ===== СВЯЗИ ДЛЯ ТОВАРА (Product) =====
Product.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Product, { foreignKey: 'administrator_id' });

// ===== СВЯЗИ ДЛЯ КЛИЕНТА (Customer) =====
Customer.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Customer, { foreignKey: 'administrator_id' });

// ===== СВЯЗИ ДЛЯ ТИПА ОПЛАТЫ (Payment_type) =====
Payment_type.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Payment_type, { foreignKey: 'administrator_id' });

Supply.belongsTo(Administrator, { foreignKey: 'administrator_id' });
Administrator.hasMany(Supply, { foreignKey: 'administrator_id' });

// ========== ЭКСПОРТ ==========
module.exports = {
    Administrator,
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
    Shop_in_administrator,
    Employee_in_administrator,
    Employee_in_shop
};