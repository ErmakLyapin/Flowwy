// src/components/SelectedItemsTable.js
import React from 'react';

const SelectedItemsTable = ({ items, onRemove, onQuantityChange, title }) => {
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

    const quantityInputStyle = {
        width: '70px',
        padding: '5px 8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        textAlign: 'center'
    };

    if (items.length === 0) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#999'
            }}>
                {title} пока не добавлены
            </div>
        );
    }

    const totalSum = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                        <th style={thStyle}>Название</th>
                        <th style={thStyle}>Цена</th>
                        <th style={thStyle}>Кол-во</th>
                        <th style={thStyle}>Сумма</th>
                        <th style={thStyle}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td style={tdStyle}>{item.name} </td>
                            <td style={tdStyle}>{item.price} ₽</td>
                            <td style={tdStyle}>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 1)}
                                    style={quantityInputStyle}
                                />
                            </td>
                            <td style={tdStyle}>{item.price * item.quantity} ₽</td>
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
                        <td colSpan="3" style={{ textAlign: 'right', padding: '12px' }}>
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

export default SelectedItemsTable;