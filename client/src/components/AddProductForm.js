// src/components/AddProductForm.js
import React from 'react';

const AddProductForm = ({ 
    products, 
    selectedProductId, 
    onProductChange, 
    wholesalePrice, 
    onPriceChange, 
    quantity, 
    onQuantityChange, 
    onAdd,
    onOpenProductModal  // ← новый проп
}) => {
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

    const buttonStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    const smallButtonStyle = {
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        whiteSpace: 'nowrap'
    };

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ marginBottom: '20px' }}>Добавление товаров</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 0.5fr auto auto', gap: '15px', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ fontWeight: '500' }}>Товар</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                            value={selectedProductId}
                            onChange={(e) => onProductChange(e.target.value)}
                            style={{ ...selectStyle, flex: 1 }}
                        >
                            <option value="">-- Выберите товар --</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.product_name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={onOpenProductModal}
                            style={smallButtonStyle}
                        >
                            + Новый
                        </button>
                    </div>
                </div>
                <div>
                    <label style={{ fontWeight: '500' }}>Закупочная цена</label>
                    <input
                        type="number"
                        step="0.01"
                        value={wholesalePrice}
                        onChange={(e) => onPriceChange(e.target.value)}
                        style={inputStyle}
                        placeholder="Цена"
                    />
                </div>
                <div>
                    <label style={{ fontWeight: '500' }}>Количество</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                        style={inputStyle}
                        min="1"
                    />
                </div>
                <div>
                    <button
                        type="button"
                        onClick={onAdd}
                        style={buttonStyle}
                    >
                        + Добавить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductForm;