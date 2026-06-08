// src/pages/AdminProducts.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getAdminShops } from '../http/shopAPI';
import { getProductTypes, getShopProducts, writeOffProduct } from '../http/productAPI';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');
    const [allProductTypes, setAllProductTypes] = useState([]); // ← переименовано
    const [productsByType, setProductsByType] = useState({}); // ← объект {typeId: [products]}
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showWriteOffModal, setShowWriteOffModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [writeOffQuantity, setWriteOffQuantity] = useState(1);

    useEffect(() => {
        loadShops();
        loadProductTypes();
    }, []);

    useEffect(() => {
        if (selectedShopId) {
            loadShopProducts();
        }
    }, [selectedShopId]);

    const loadShops = async () => {
        try {
            const data = await getAdminShops();
            console.log('Shops data:', data); // ← для отладки
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

    const loadProductTypes = async () => {
        try {
            const data = await getProductTypes();
            setAllProductTypes(data);
        } catch (error) {
            console.error('Ошибка загрузки типов товаров:', error);
        }
    };

    const loadShopProducts = async () => {
    if (!selectedShopId) return;
    
    setLoading(true);
    try {
        const data = await getShopProducts(selectedShopId);
        console.log('Shop products:', data);
        
        // Группируем товары по типам, фильтруя только те, у которых quantity > 0
        const grouped = {};
        data.forEach(item => {
            const product = item.product;
            // ← добавляем условие: показываем только товары с остатком > 0
            if (product && product.product_type_id && item.quantity > 0) {
                const typeId = product.product_type_id;
                if (!grouped[typeId]) {
                    grouped[typeId] = [];
                }
                grouped[typeId].push({
                    product_id: item.product_id,
                    product_name: product.product_name,
                    retail_price: product.retail_price,
                    quantity: item.quantity,
                    product_type_id: product.product_type_id
                });
            }
        });
        
        setProductsByType(grouped);
        
        const availableTypes = Object.keys(grouped).map(Number);
        if (availableTypes.length > 0 && !selectedTypeId) {
            setSelectedTypeId(availableTypes[0]);
        } else if (availableTypes.length === 0) {
            setSelectedTypeId(null);
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        alert('Ошибка загрузки товаров');
    } finally {
        setLoading(false);
    }
};

    const getTypeName = (typeId) => {
        const type = allProductTypes.find(t => t.id === typeId);
        return type?.product_type_name || 'Неизвестный тип';
    };

    const getCurrentProducts = () => {
        if (!selectedTypeId) return [];
        return productsByType[selectedTypeId] || [];
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
        await writeOffProduct(selectedProduct.product_id, selectedShopId, writeOffQuantity);
        alert('Товар списан');
        setShowWriteOffModal(false);
        loadShopProducts(); // ← перезагружаем, товар с 0 пропадёт из списка
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

    const typeButtonStyle = (isActive) => ({
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: isActive ? '#2e7d32' : '#f0f0f0',
        color: isActive ? 'white' : '#333',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s'
    });

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };

    const thStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        padding: '12px',
        textAlign: 'left'
    };

    const tdStyle = {
        padding: '12px',
        borderBottom: '1px solid #eee'
    };

    const selectStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

    const availableTypeIds = Object.keys(productsByType).map(Number);
    const currentProducts = getCurrentProducts();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f7fa'
        }}>
            <NavBar />
            <div style={{
                padding: '30px',
                marginLeft: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ color: '#333' }}>
                        📦 Товары в магазинах
                    </h1>
                    <button
                        onClick={() => navigate('/admin')}
                        style={buttonStyle}
                    >
                        ← Назад
                    </button>
                </div>

                {/* Выбор магазина */}
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

                {selectedShopId && (
                    <>
                        {/* Типы товаров */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ marginBottom: '20px' }}>Типы товаров</h3>
                            {loading ? (
                                <p>Загрузка...</p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {availableTypeIds.map(typeId => (
                                        <button
                                            key={typeId}
                                            onClick={() => setSelectedTypeId(typeId)}
                                            style={typeButtonStyle(selectedTypeId === typeId)}
                                        >
                                            {getTypeName(typeId)}
                                        </button>
                                    ))}
                                    {availableTypeIds.length === 0 && (
                                        <p style={{ color: '#999' }}>Нет товаров в этом магазине</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Таблица товаров выбранного типа */}
                        {selectedTypeId && currentProducts.length > 0 && (
                            <div style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ marginBottom: '20px' }}>
                                    {getTypeName(selectedTypeId)}
                                </h3>
                                <table style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>ID</th>
                                            <th style={thStyle}>Название</th>
                                            <th style={thStyle}>Цена</th>
                                            <th style={thStyle}>Остаток</th>
                                            <th style={thStyle}>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map(product => (
                                            <tr key={product.product_id}>
                                                <td style={tdStyle}>{product.product_id}</td>
                                                <td style={tdStyle}>{product.product_name}</td>
                                                <td style={tdStyle}>{product.retail_price} ₽</td>
                                                <td style={tdStyle}>{product.quantity} шт.</td>
                                                <td style={tdStyle}>
                                                    <button
                                                        onClick={() => handleWriteOff(product)}
                                                        style={{
                                                            backgroundColor: '#ff9800',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '5px 10px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Списать
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Модальное окно списания */}
            {showWriteOffModal && selectedProduct && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }} onClick={() => setShowWriteOffModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        width: '90%',
                        maxWidth: '400px'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '20px' }}>Списание товара</h2>
                        <p><strong>Товар:</strong> {selectedProduct.product_name}</p>
                        <p><strong>Доступно:</strong> {selectedProduct.quantity} шт.</p>
                        <div style={{ marginTop: '15px' }}>
                            <label>Количество для списания:</label>
                            <input
                                type="number"
                                value={writeOffQuantity}
                                onChange={(e) => setWriteOffQuantity(parseInt(e.target.value))}
                                min="1"
                                max={selectedProduct.quantity}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    margin: '8px 0',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px',
                            marginTop: '20px'
                        }}>
                            <button
                                onClick={() => setShowWriteOffModal(false)}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: '#6c757d'
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={confirmWriteOff}
                                style={buttonStyle}
                            >
                                Списать
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;