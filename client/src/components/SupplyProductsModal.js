// src/components/SupplyProductsModal.js
import React, { useState, useEffect } from 'react';
import { getSupplyProducts, removeProductFromSupply, getAdminProducts, addProductToSupply } from '../http/supplyAPI';

const SupplyProductsModal = ({ isOpen, onClose, supplyId, supplyInfo }) => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [wholesalePrice, setWholesalePrice] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen && supplyId) {
            loadProducts();
            loadAllProducts();
        }
    }, [isOpen, supplyId]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getSupplyProducts(supplyId);
            setProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAllProducts = async () => {
        try {
            const data = await getAdminProducts();
            setAllProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!selectedProductId || !wholesalePrice || !quantity) {
            alert('Заполните все поля!');
            return;
        }
        
        setLoading(true);
        try {
            await addProductToSupply(selectedProductId, supplyId, wholesalePrice, quantity);
            alert('Товар добавлен в поставку!');
            setShowAddForm(false);
            setSelectedProductId('');
            setWholesalePrice('');
            setQuantity(1);
            loadProducts();
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            alert(error.response?.data?.message || 'Ошибка добавления товара');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProduct = async (productId) => {
        if (window.confirm('Удалить товар из поставки?')) {
            try {
                await removeProductFromSupply(productId, supplyId);
                alert('Товар удалён из поставки');
                loadProducts();
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Ошибка удаления товара');
            }
        }
    };

    if (!isOpen) return null;

    const modalOverlayStyle = {
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
    };

    const modalStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '30px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    };

    const thStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        padding: '10px',
        textAlign: 'left'
    };

    const tdStyle = {
        padding: '10px',
        borderBottom: '1px solid #eee'
    };

    const buttonStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        marginRight: '10px'
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: '6px'
    };

    const selectStyle = {
        width: '100%',
        padding: '8px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: '6px'
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ color: '#333' }}>
                    📦 Товары в поставке #{supplyId}
                </h2>
                <p style={{ color: '#666', marginTop: '5px' }}>
                    Поставщик: {supplyInfo?.supplier_name}
                </p>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Дата: {supplyInfo?.supply_date ? new Date(supplyInfo.supply_date).toLocaleDateString() : ''}
                </p>

                {!showAddForm ? (
                    <button
                        onClick={() => setShowAddForm(true)}
                        style={buttonStyle}
                    >
                        + Добавить товар
                    </button>
                ) : (
                    <form onSubmit={handleAddProduct} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                        <h4>Добавить товар</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                            <div>
                                <label>Товар</label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    style={selectStyle}
                                    required
                                >
                                    <option value="">-- Выберите товар --</option>
                                    {allProducts.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.product_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Закупочная цена</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={wholesalePrice}
                                    onChange={(e) => setWholesalePrice(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label>Количество</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button type="submit" style={buttonStyle} disabled={loading}>
                                {loading ? 'Добавление...' : 'Добавить'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Товар</th>
                                <th style={thStyle}>Закупочная цена</th>
                                <th style={thStyle}>Количество</th>
                                <th style={thStyle}>Сумма</th>
                                <th style={thStyle}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        Нет товаров в поставке
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => {
                                    const product = item.product || item;
                                    const total = (item.wholesale_price || 0) * (item.quantity || 0);
                                    return (
                                        <tr key={item.product_id}>
                                            <td style={tdStyle}>{product.id}</td>
                                            <td style={tdStyle}>{product.product_name}</td>
                                            <td style={tdStyle}>{item.wholesale_price} ₽</td>
                                            <td style={tdStyle}>{item.quantity}</td>
                                            <td style={tdStyle}>{total} ₽</td>
                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() => handleRemoveProduct(item.product_id)}
                                                    style={{
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupplyProductsModal;