// src/components/ShopsTable.js
import React from 'react';

const ShopsTable = ({ shops, loading, onDelete }) => {
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
        textAlign: 'left',
        fontWeight: '600'
    };

    const tdStyle = {
        padding: '12px',
        borderBottom: '1px solid #eee'
    };

    const deleteButtonStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
    }

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={thStyle}>Название</th>
                    <th style={thStyle}>Телефон</th>
                    <th style={thStyle}>Действия</th>
                </tr>
            </thead>
            <tbody>
                {shops.length === 0 ? (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                            Нет магазинов. Добавьте первый!
                        </td>
                    </tr>
                ) : (
                    shops.map((item) => (
                        <tr key={item.shop?.id || item.id}>
                            <td style={tdStyle}>{item.shop?.shop_name || item.shop_name}</td>
                            <td style={tdStyle}>{item.shop?.shop_telephone || item.shop_telephone || '—'}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => onDelete(item.shop?.id || item.id)}
                                    style={deleteButtonStyle}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default ShopsTable;