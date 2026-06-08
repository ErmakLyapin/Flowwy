// src/pages/CreateBouquet.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getShopProducts, getProductTypes } from '../http/productAPI';
import { createBouquet, addProductToBouquet } from '../http/bouquetAPI';

const CreateBouquet = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [productsByType, setProductsByType] = useState({});
    
    // Данные букета
    const [bouquetName, setBouquetName] = useState('');
    const [bouquetPrice, setBouquetPrice] = useState('');
    const [useAutoPrice, setUseAutoPrice] = useState(true);
    
    // Выбранные товары
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [productList, setProductList] = useState([]);
    
    const selectedShopId = localStorage.getItem('selectedShopId');

    useEffect(() => {
        if (!selectedShopId) {
            alert('Магазин не выбран');
            navigate('/');
            return;
        }
        loadShopProducts();
        loadProductTypes();
    }, []);

    const loadShopProducts = async () => {
        try {
            const data = await getShopProducts(selectedShopId);
            // Группируем по типам, показываем только товары с остатком > 0
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
                        product_type_id: product.product_type_id
                    });
                }
            });
            setProductsByType(grouped);
            
            const types = Object.keys(grouped).map(Number);
            if (types.length > 0) {
                setSelectedTypeId(types[0]);
            }
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    };

    const loadProductTypes = async () => {
        try {
            const data = await getProductTypes();
            setProductTypes(data);
        } catch (error) {
            console.error('Ошибка загрузки типов товаров:', error);
        }
    };

    const getTypeName = (typeId) => {
        const type = productTypes.find(t => t.id === typeId);
        return type?.product_type_name || 'Неизвестный тип';
    };

    const getCurrentProducts = () => {
        if (!selectedTypeId) return [];
        return productsByType[selectedTypeId] || [];
    };

    const handleAddProduct = () => {
        if (!selectedProductId) {
            alert('Выберите товар');
            return;
        }
        if (!quantity || quantity <= 0) {
            alert('Введите корректное количество');
            return;
        }

        const selectedProduct = getCurrentProducts().find(p => p.product_id === parseInt(selectedProductId));
        
        // Проверяем, достаточно ли товара
        if (quantity > selectedProduct.quantity) {
            alert(`Недостаточно товара. Доступно: ${selectedProduct.quantity} шт.`);
            return;
        }
        
        const existingIndex = productList.findIndex(item => item.product_id === selectedProductId);
        
        if (existingIndex !== -1) {
            const updatedList = [...productList];
            const newQuantity = updatedList[existingIndex].quantity + quantity;
            if (newQuantity > selectedProduct.quantity) {
                alert(`Недостаточно товара. Доступно: ${selectedProduct.quantity} шт.`);
                return;
            }
            updatedList[existingIndex] = {
                ...updatedList[existingIndex],
                quantity: newQuantity,
                sum: updatedList[existingIndex].retail_price * newQuantity
            };
            setProductList(updatedList);
        } else {
            setProductList([...productList, {
                product_id: selectedProductId,
                product_name: selectedProduct.product_name,
                retail_price: selectedProduct.retail_price,
                quantity: quantity,
                sum: selectedProduct.retail_price * quantity,
                available_quantity: selectedProduct.quantity // запоминаем доступное количество
            }]);
        }
        
        setSelectedProductId('');
        setQuantity(1);
    };

    const handleRemoveProduct = (index) => {
        const newList = [...productList];
        newList.splice(index, 1);
        setProductList(newList);
    };

    const autoTotalPrice = productList.reduce((sum, item) => sum + item.sum, 0);
    const finalPrice = useAutoPrice ? autoTotalPrice : parseFloat(bouquetPrice) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!bouquetName) {
            alert('Введите название букета');
            return;
        }
        
        if (productList.length === 0) {
            alert('Добавьте хотя бы один товар');
            return;
        }
        
        setLoading(true);
        
        try {
            // 1. Создаём букет
            const bouquet = await createBouquet({
                bouquet_name: bouquetName,
                bouquet_price: finalPrice
            });
            
            // 2. Добавляем товары в букет и списываем их из магазина
            for (const item of productList) {
                await addProductToBouquet(
                    bouquet.id,
                    item.product_id,
                    item.quantity,
                    selectedShopId
                );
            }
            
            alert(`Букет "${bouquetName}" успешно создан! Товары списаны из магазина.`);
            navigate('/employee/bouquets');
            
        } catch (error) {
            console.error('Ошибка создания букета:', error);
            alert(error.response?.data?.message || 'Ошибка создания букета');
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

    const selectStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

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

    const typeButtonStyle = (isActive) => ({
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: isActive ? '#2e7d32' : '#f0f0f0',
        color: isActive ? 'white' : '#333',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px'
    });

    const availableTypeIds = Object.keys(productsByType).map(Number);
    const currentProducts = getCurrentProducts();

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
                    <h1 style={{ color: '#333' }}>💐 Создание букета</h1>
                    <button
                        onClick={() => navigate('/employee/bouquets')}
                        style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                    >
                        ← Назад к букетам
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Основная информация */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Основная информация</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ fontWeight: '500' }}>Название букета *</label>
                                <input
                                    type="text"
                                    value={bouquetName}
                                    onChange={(e) => setBouquetName(e.target.value)}
                                    style={inputStyle}
                                    placeholder="Введите название букета"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: '500' }}>Цена</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input
                                            type="radio"
                                            checked={useAutoPrice}
                                            onChange={() => setUseAutoPrice(true)}
                                        />
                                        Авто ({autoTotalPrice} ₽)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input
                                            type="radio"
                                            checked={!useAutoPrice}
                                            onChange={() => setUseAutoPrice(false)}
                                        />
                                        Своя
                                    </label>
                                    {!useAutoPrice && (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={bouquetPrice}
                                            onChange={(e) => setBouquetPrice(e.target.value)}
                                            style={{ ...inputStyle, width: '150px', margin: 0 }}
                                            placeholder="Цена"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Выбор товаров */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Выберите товары для букета</h3>
                        
                        {/* Типы товаров */}
                        {availableTypeIds.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {availableTypeIds.map(typeId => (
                                        <button
                                            key={typeId}
                                            type="button"
                                            onClick={() => setSelectedTypeId(typeId)}
                                            style={typeButtonStyle(selectedTypeId === typeId)}
                                        >
                                            {getTypeName(typeId)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Форма добавления товара */}
                        {selectedTypeId && currentProducts.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.5fr auto', gap: '15px', alignItems: 'flex-end' }}>
                                <div>
                                    <label>Товар</label>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option value="">-- Выберите товар --</option>
                                        {currentProducts.map(product => (
                                            <option key={product.product_id} value={product.product_id}>
                                                {product.product_name} ({product.retail_price} ₽, остаток: {product.quantity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Количество</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        style={inputStyle}
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleAddProduct}
                                        style={buttonStyle}
                                    >
                                        + Добавить
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {availableTypeIds.length === 0 && (
                            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                                Нет доступных товаров для создания букета
                            </p>
                        )}
                    </div>

                    {/* Таблица добавленных товаров */}
                    {productList.length > 0 && (
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h3>Состав букета</h3>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>№</th>
                                        <th style={thStyle}>Товар</th>
                                        <th style={thStyle}>Цена</th>
                                        <th style={thStyle}>Кол-во</th>
                                        <th style={thStyle}>Сумма</th>
                                        <th style={thStyle}>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productList.map((item, index) => (
                                        <tr key={index}>
                                            <td style={tdStyle}>{index + 1}</td>
                                            <td style={tdStyle}>{item.product_name}</td>
                                            <td style={tdStyle}>{item.retail_price} ₽</td>
                                            <td style={tdStyle}>{item.quantity}</td>
                                            <td style={tdStyle}>{item.sum} ₽</td>
                                            <td style={tdStyle}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProduct(index)}
                                                    style={{
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                        <td colSpan="4" style={{ textAlign: 'right', padding: '12px' }}>
                                            Итого:
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {autoTotalPrice} ₽
                                        </td>
                                        <td style={{ padding: '12px' }}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Создание...' : '✅ Создать букет'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBouquet;