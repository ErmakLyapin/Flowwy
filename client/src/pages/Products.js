// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import CategoryButtons from '../components/CategoryButtons';
import ProductTable from '../components/ProductTable';
import WriteOffModal from '../components/WriteOffModal';
import { useProducts } from '../hooks/useProducts';
import { getAdminShops } from '../http/shopAPI';
import { writeOffProduct } from '../http/productAPI';

const Products = ({ userRole }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = userRole === 'admin';
    
    // Режим выбора для заказа
    const [selectMode, setSelectMode] = useState(false);
    const [returnPath, setReturnPath] = useState('/');
    
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');
    const [shopName, setShopName] = useState('');
    
    const effectiveShopId = isAdmin ? selectedShopId : localStorage.getItem('selectedShopId');
    const selectedShopName = localStorage.getItem('selectedShopName');
    
    const {
        loading,
        getTypeName,
        getCurrentProducts,
        handleTypeClick,
        handleShowBouquets,
        showBouquets,
        selectedTypeId,
        availableTypeIds
    } = useProducts(effectiveShopId);
    
   const [showWriteOffModal, setShowWriteOffModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [writeOffQuantity, setWriteOffQuantity] = useState(1);

// ===== 1. СНАЧАЛА - проверка режима выбора =====
useEffect(() => {
    if (location.state?.selectMode) {
        setSelectMode(true);
        setReturnPath(location.state.returnTo || '/employee/create-order');
    } else {
        setSelectMode(false);
    }
}, [location.state]);

// ===== 2. ПОТОМ - загрузка магазинов (только для админа) =====
useEffect(() => {
    if (isAdmin) {
        loadShops();
    } else if (!effectiveShopId) {
        alert('Магазин не выбран. Обратитесь к администратору.');
        navigate('/');
    } else {
        setShopName(selectedShopName || '');
    }
}, [isAdmin, effectiveShopId]);

// ===== 3. НЕ ДОБАВЛЯЙТЕ ЛИШНИХ useEffect =====

    const loadShops = async () => {
        try {
            const data = await getAdminShops();
            setShops(data);
            if (data.length > 0) {
                const firstShopId = data[0].shop?.id || data[0].id;
                setSelectedShopId(firstShopId);
            }
        } catch (error) {
            console.error('Ошибка загрузки магазинов:', error);
            alert('Ошибка загрузки магазинов');
        }
    };

    // Обработчик выбора товара/букета для заказа
    const handleSelectItem = (item, isBouquet = false) => {
    console.log('Select mode:', selectMode);
    console.log('Item selected:', item);
    
    if (selectMode) {
        // Для букета нужно извлечь числовой ID из строки "bouquet_1"
        let id = item.product_id;
        if (isBouquet && typeof id === 'string' && id.startsWith('bouquet_')) {
            id = parseInt(id.split('_')[1]);
        }
        
        const selectedItem = {
            id: id,
            name: item.product_name,
            price: item.retail_price,
            quantity: 1,
            type: isBouquet ? 'bouquet' : 'product'
        };
        console.log('Sending to order:', selectedItem);
        navigate(returnPath, { state: { selectedItem } });
    }
};

    const handleWriteOff = (product) => {
        setSelectedProduct(product);
        setWriteOffQuantity(1);
        setShowWriteOffModal(true);
    };

    const confirmWriteOff = async () => {
        if (!writeOffQuantity || writeOffQuantity <= 0) {
            alert('Введите корректное количество');
            return;
        }
        
        if (writeOffQuantity > selectedProduct.quantity) {
            alert(`Недостаточно товара. Доступно: ${selectedProduct.quantity}`);
            return;
        }
        
        try {
            await writeOffProduct(selectedProduct.product_id, effectiveShopId, writeOffQuantity);
            alert('Товар списан');
            setShowWriteOffModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Ошибка списания:', error);
            alert(error.response?.data?.message || 'Ошибка списания товара');
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

    const selectStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

    const currentProducts = getCurrentProducts();
    const isBouquetView = showBouquets;

    // Модифицируем таблицу для режима выбора
    const renderProductTable = () => {
        if (selectMode) {
            // В режиме выбора показываем кнопку "Выбрать" вместо "Списать"
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginBottom: '20px' }}>
                        {isBouquetView ? '💐 Выберите букет' : `Выберите ${getTypeName(selectedTypeId)}`}
                    </h3>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ backgroundColor: '#2e7d32', color: 'white', padding: '12px', textAlign: 'left' }}>ID</th>
                                <th style={{ backgroundColor: '#2e7d32', color: 'white', padding: '12px', textAlign: 'left' }}>Название</th>
                                <th style={{ backgroundColor: '#2e7d32', color: 'white', padding: '12px', textAlign: 'left' }}>Цена</th>
                                <th style={{ backgroundColor: '#2e7d32', color: 'white', padding: '12px', textAlign: 'left' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map(product => (
                                <tr key={product.product_id}>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.product_id}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.product_name}</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{product.retail_price} ₽</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <button
                                            onClick={() => handleSelectItem(product, isBouquetView)}
                                            style={buttonStyle}
                                        >
                                            Выбрать
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        
        // Обычный режим (просмотр/списание)
        return (
            <ProductTable
                products={currentProducts}
                isAdmin={isAdmin}
                onWriteOff={handleWriteOff}
                title={isBouquetView ? '💐 Букеты' : getTypeName(selectedTypeId)}
            />
        );
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
                    <h1 style={{ color: '#333' }}>
                        {selectMode 
                            ? '🛒 Выберите товар для заказа' 
                            : (isAdmin ? '📦 Товары в магазинах' : '📦 Товары в магазине')
                        }
                    </h1>
                    <button
                        onClick={() => {
                            if (selectMode) {
                                navigate(returnPath);
                            } else {
                                navigate(isAdmin ? '/admin' : '/');
                            }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                    >
                        {selectMode ? '← Отмена' : '← Назад'}
                    </button>
                </div>

                {isAdmin && !selectMode && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Выберите магазин</h3>
                        <select
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="">-- Выберите магазин --</option>
                            {shops.map(item => (
                                <option key={item.shop?.id || item.id} value={item.shop?.id || item.id}>
                                    {item.shop?.shop_name || item.shop_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {!isAdmin && effectiveShopId && !selectMode && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '10px', color: '#2e7d32' }}>
                            🏪 {shopName}
                        </h3>
                        <p style={{ color: '#666' }}>
                            Просмотр остатков товаров в вашем магазине
                        </p>
                    </div>
                )}

                {effectiveShopId && (
                    <>
                        <CategoryButtons
                            availableTypeIds={availableTypeIds}
                            getTypeName={getTypeName}
                            selectedTypeId={selectedTypeId}
                            onTypeClick={handleTypeClick}
                            showBouquets={showBouquets}
                            onShowBouquets={handleShowBouquets}
                            loading={loading}
                        />

                        {renderProductTable()}

                        {currentProducts.length === 0 && !loading && isBouquetView && (
                            <div style={{
                                backgroundColor: 'white',
                                padding: '40px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                color: '#999'
                            }}>
                                Нет созданных букетов
                            </div>
                        )}
                    </>
                )}
            </div>

            <WriteOffModal
                isOpen={showWriteOffModal}
                onClose={() => setShowWriteOffModal(false)}
                onConfirm={confirmWriteOff}
                product={selectedProduct}
                quantity={writeOffQuantity}
                setQuantity={setWriteOffQuantity}
            />
        </div>
    );
};

export default Products;