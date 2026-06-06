// src/pages/CreateSupply.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SupplyBasicInfo from '../components/SupplyBasicInfo';
import AddProductForm from '../components/AddProductForm';
import ProductsTable from '../components/ProductsTable';
import CreateSupplierModal from '../components/CreateSupplierModal';
import CreateProductModal from '../components/CreateProductModal';  // ← добавить
import { 
    createSupply, 
    getAdminSuppliers, 
    getAdminProducts, 
    addProductToSupply,
    createSupplier,
    createProductType,
    createProduct,      // ← добавить
    getProductTypes     // ← добавить
} from '../http/supplyAPI';

const CreateSupply = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Данные формы
    const [selectedSupplierId, setSelectedSupplierId] = useState('');
    const [selectedShopId, setSelectedShopId] = useState('');
    const [supplyDate, setSupplyDate] = useState(new Date().toISOString().slice(0, 10));
    
    // Списки
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    
    // Модальные окна
    const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
    const [showNewProductModal, setShowNewProductModal] = useState(false);  // ← добавить
    
    // Список добавленных продуктов
    const [selectedProductId, setSelectedProductId] = useState('');
    const [wholesalePrice, setWholesalePrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        loadSuppliers();
        loadProducts();
        loadProductTypes();  // ← добавить
    }, []);

    const loadSuppliers = async () => {
        try {
            const data = await getAdminSuppliers();
            setSuppliers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Ошибка загрузки поставщиков:', error);
            setSuppliers([]);
        }
    };

    const handleCreateProductType = async (typeData) => {
    const newType = await createProductType(typeData);
    await loadProductTypes();
    return newType;
};

    const loadProducts = async () => {
        try {
            const data = await getAdminProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            setProducts([]);
        }
    };

    const loadProductTypes = async () => {  // ← добавить
        try {
            const data = await getProductTypes();
            setProductTypes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Ошибка загрузки типов товаров:', error);
            setProductTypes([]);
        }
    };

    const handleCreateSupplier = async (supplierData) => {
        const supplier = await createSupplier({
            supplier_name: supplierData.supplier_name,
            supplier_telephone: supplierData.supplier_telephone || null
        });
        await loadSuppliers();
        setSelectedSupplierId(supplier.id);
        alert('Поставщик создан!');
    };

    const handleCreateProduct = async (productData) => {  // ← добавить
        const product = await createProduct({
            product_name: productData.product_name,
            product_type_id: productData.product_type_id,
            retail_price: productData.retail_price || null
        });
        await loadProducts();
        setSelectedProductId(product.id);
        alert('Товар создан!');
    };

    const handleAddProduct = () => {
    if (!selectedProductId) {
        alert('Выберите товар');
        return;
    }
    if (!wholesalePrice || wholesalePrice <= 0) {
        alert('Введите корректную цену');
        return;
    }
    if (!quantity || quantity <= 0) {
        alert('Введите корректное количество');
        return;
    }

    const selectedProduct = products.find(p => p.id === parseInt(selectedProductId));
    
    // Проверяем, есть ли уже такой товар в списке
    const existingProductIndex = productList.findIndex(
        item => item.product_id === selectedProductId
    );
    
    if (existingProductIndex !== -1) {
        // Если товар уже есть - добавляем количество (цену не меняем, используем существующую)
        const updatedList = [...productList];
        const existingItem = updatedList[existingProductIndex];
        
        updatedList[existingProductIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + parseInt(quantity),
            sum: existingItem.wholesale_price * (existingItem.quantity + parseInt(quantity))
        };
        setProductList(updatedList);
    } else {
        // Новый товар - добавляем в список
        setProductList([...productList, {
            product_id: selectedProductId,
            product_name: selectedProduct?.product_name,
            wholesale_price: parseFloat(wholesalePrice),
            quantity: parseInt(quantity),
            sum: parseFloat(wholesalePrice) * parseInt(quantity)
        }]);
    }
    
    // Очищаем форму добавления
    setSelectedProductId('');
    setWholesalePrice('');
    setQuantity(1);
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedSupplierId) {
            alert('Выберите поставщика');
            return;
        }
        
        if (productList.length === 0) {
            alert('Добавьте хотя бы один товар');
            return;
        }
        
        setLoading(true);
        
        try {
            const supply = await createSupply({
                supplier_id: selectedSupplierId,
                supply_date: supplyDate
            });
            
            for (const product of productList) {
                await addProductToSupply(
                    product.product_id,
                    supply.id,
                    product.wholesale_price,
                    product.quantity
                );
            }
            
            alert(`Накладная №${supply.id} успешно создана!`);
            navigate('/admin/supplies');
        } catch (error) {
            console.error('Ошибка создания накладной:', error);
            alert(error.response?.data?.message || 'Ошибка создания накладной');
        } finally {
            setLoading(false);
        }
    };

    const buttonStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <NavBar />
            <div style={{ padding: '30px', marginLeft: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ color: '#333' }}>📝 Создание накладной</h1>
                    <button
                        onClick={() => navigate('/admin/supplies')}
                        style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                    >
                        ← Назад
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <SupplyBasicInfo
                        suppliers={suppliers}
                        selectedSupplierId={selectedSupplierId}
                        onSupplierChange={setSelectedSupplierId}
                        onOpenSupplierModal={() => setShowNewSupplierModal(true)}
                        selectedShopId={selectedShopId}
                        onShopChange={setSelectedShopId}
                        supplyDate={supplyDate}
                        onDateChange={setSupplyDate}
                        isDisabled={false}
                    />

                    <AddProductForm
                        products={products}
                        selectedProductId={selectedProductId}
                        onProductChange={setSelectedProductId}
                        wholesalePrice={wholesalePrice}
                        onPriceChange={setWholesalePrice}
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                        onAdd={handleAddProduct}
                        onOpenProductModal={() => setShowNewProductModal(true)}  // ← добавить
                    />

                    <ProductsTable 
                        products={productList} 
                        onRemove={(index) => {
                            const newList = [...productList];
                            newList.splice(index, 1);
                            setProductList(newList);
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Создание...' : '✅ Создать накладную'}
                        </button>
                    </div>
                </form>
            </div>

            <CreateSupplierModal
                isOpen={showNewSupplierModal}
                onClose={() => setShowNewSupplierModal(false)}
                onCreate={handleCreateSupplier}
            />

            <CreateProductModal
                isOpen={showNewProductModal}
                onClose={(newProduct) => {
                    setShowNewProductModal(false);
                    if (newProduct) {
                        setSelectedProductId(newProduct.id);
                    }
                }}
                onCreate={handleCreateProduct}
                onCreateProductType={handleCreateProductType}  // ← добавить
                productTypes={productTypes}
            />
        </div>
    );
};

export default CreateSupply;