// src/components/ProductTable.js
import React from 'react';

const ProductTable = ({ products, isAdmin, onWriteOff, title }) => {
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

    if (products.length === 0) return null;

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ marginBottom: '20px' }}>{title}</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Название</th>
                        <th style={thStyle}>Цена</th>
                        <th style={thStyle}>Остаток</th>
                        {isAdmin && <th style={thStyle}>Действия</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
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
                            {isAdmin && !product.isBouquet && (
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => onWriteOff(product)}
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
    );
};

export default ProductTable;