// src/pages/EmployeeProducts.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getProductTypes, getShopProducts } from '../http/productAPI';
import { getBouquets } from '../http/bouquetAPI';  // ← добавить

const EmployeeProducts = () => {
    const navigate = useNavigate();
    const [shopName, setShopName] = useState('');
    const [productsByType, setProductsByType] = useState({});
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allProductTypes, setAllProductTypes] = useState([]);
    const [bouquets, setBouquets] = useState([]);  // ← добавить
    const [showBouquets, setShowBouquets] = useState(false);  // ← добавить

    const selectedShopId = localStorage.getItem('selectedShopId');
    const selectedShopName = localStorage.getItem('selectedShopName');

    useEffect(() => {
        if (!selectedShopId) {
            alert('Магазин не выбран. Обратитесь к администратору.');
            navigate('/');
            return;
        }
        setShopName(selectedShopName || '');
        loadProductTypes();
        loadShopProducts();
        loadBouquets();  // ← добавить
    }, []);

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
            
            // Группируем товары по типам, показываем только товары с остатком > 0
            const grouped = {};
            data.forEach(item => {
                const product = item.product;
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
                        product_type_id: product.product_type_id,
                        isBouquet: false  // ← пометка, что это товар, а не букет
                    });
                }
            });
            
            setProductsByType(grouped);
            
            const availableTypes = Object.keys(grouped).map(Number);
            if (availableTypes.length > 0 && !selectedTypeId && !showBouquets) {
                setSelectedTypeId(availableTypes[0]);
            }
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            alert('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    };

    const loadBouquets = async () => {  // ← добавить
        try {
            const data = await getBouquets();
            // Обрабатываем данные (могут быть с пагинацией)
            let bouquetsList = [];
            if (data && data.rows) {
                bouquetsList = data.rows;
            } else if (Array.isArray(data)) {
                bouquetsList = data;
            }
            
            // Форматируем букеты как товары
            const formattedBouquets = bouquetsList.map(bouquet => ({
                product_id: `bouquet_${bouquet.id}`,  // уникальный ID для букета
                product_name: bouquet.bouquet_name,
                retail_price: bouquet.bouquet_price,
                quantity: 999,  // букеты всегда в наличии
                isBouquet: true,
                bouquet_id: bouquet.id,
                bouquet_date: bouquet.bouquet_date
            }));
            
            setBouquets(formattedBouquets);
        } catch (error) {
            console.error('Ошибка загрузки букетов:', error);
        }
    };

    const getTypeName = (typeId) => {
        const type = allProductTypes.find(t => t.id === typeId);
        return type?.product_type_name || 'Неизвестный тип';
    };

    const getCurrentProducts = () => {
        if (showBouquets) {
            return bouquets;
        }
        if (!selectedTypeId) return [];
        return productsByType[selectedTypeId] || [];
    };

    const handleTypeClick = (typeId) => {
        setShowBouquets(false);
        setSelectedTypeId(typeId);
    };

    const handleShowBouquets = () => {
        setShowBouquets(true);
        setSelectedTypeId(null);
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

    const availableTypeIds = Object.keys(productsByType).map(Number);
    const currentProducts = getCurrentProducts();
    const isBouquetView = showBouquets;

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
                    <h1 style={{ color: '#333' }}>📦 Товары в магазине</h1>
                    <button
                        onClick={() => navigate('/')}
                        style={buttonStyle}
                    >
                        ← Назад
                    </button>
                </div>

                {/* Информация о магазине */}
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

                {/* Типы товаров и кнопка "Букеты" */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginBottom: '20px' }}>Категории</h3>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
                            {availableTypeIds.map(typeId => (
                                <button
                                    key={typeId}
                                    onClick={() => handleTypeClick(typeId)}
                                    style={typeButtonStyle(selectedTypeId === typeId && !showBouquets)}
                                >
                                    {getTypeName(typeId)}
                                </button>
                            ))}
                            <button
                                onClick={handleShowBouquets}
                                style={{
                                    ...typeButtonStyle(showBouquets),
                                    backgroundColor: showBouquets ? '#9c27b0' : '#f0f0f0',
                                    color: showBouquets ? 'white' : '#333'
                                }}
                            >
                                💐 Букеты
                            </button>
                            {availableTypeIds.length === 0 && !showBouquets && (
                                <p style={{ color: '#999' }}>Нет товаров в этом магазине</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Таблица товаров/букетов */}
                {currentProducts.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>
                            {isBouquetView ? '💐 Букеты' : getTypeName(selectedTypeId)}
                        </h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Название</th>
                                    <th style={thStyle}>Цена</th>
                                    <th style={thStyle}>Остаток</th>
                                    {!isBouquetView && <th style={thStyle}>Действия</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map(product => (
                                    <tr key={product.product_id}>
                                        <td style={tdStyle}>{product.product_id}</td>
                                        <td style={tdStyle}>{product.product_name}</td>
                                        <td style={tdStyle}>{product.retail_price} ₽</td>
                                        <td style={tdStyle}>
                                            {product.isBouquet ? (
                                                <span style={{ color: '#9c27b0' }}>✓ В наличии</span>
                                            ) : (
                                                <span style={{
                                                    fontWeight: product.quantity < 10 ? 'bold' : 'normal',
                                                    color: product.quantity < 5 ? '#dc3545' : product.quantity < 10 ? '#ff9800' : '#333'
                                                }}>
                                                    {product.quantity} шт.
                                                </span>
                                            )}
                                        </td>
                                        {!product.isBouquet && (
                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() => alert('Функция в разработке')}
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
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
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
            </div>
        </div>
    );
};

export default EmployeeProducts;