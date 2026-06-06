// src/components/ProductsTable.js
import React from 'react';

const ProductsTable = ({ products, onRemove }) => {
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px'
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

    const totalSum = products.reduce((sum, item) => sum + item.sum, 0);

    if (products.length === 0) return null;

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3>Добавленные товары</h3>
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
                    {products.map((item, index) => (
                        <tr key={index}>
                            <td style={tdStyle}>{index + 1}</td>
                            <td style={tdStyle}>{item.product_name}</td>
                            <td style={tdStyle}>{item.wholesale_price} ₽</td>
                            <td style={tdStyle}>{item.quantity}</td>
                            <td style={tdStyle}>{item.sum} ₽</td>
                            <td style={tdStyle}>
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
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
                            {totalSum} ₽
                        </td>
                        <td style={{ padding: '12px' }}></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;