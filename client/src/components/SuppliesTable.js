// src/components/SuppliesTable.js
import React from 'react';

const SuppliesTable = ({ supplies, loading, onViewDetails, onDelete }) => {
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

    const actionButtonStyle = {
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        marginRight: '8px',
        border: 'none'
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
    }

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Поставщик</th>
                    <th style={thStyle}>Дата поставки</th>
                    <th style={thStyle}>Кол-во товаров</th>
                    <th style={thStyle}>Сумма</th>
                    <th style={thStyle}>Действия</th>
                </tr>
            </thead>
            <tbody>
                {supplies.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                            Нет накладных. Создайте первую!
                        </td>
                    </tr>
                ) : (
                    supplies.map((supply) => (
                        <tr key={supply.id}>
                            <td style={tdStyle}>{supply.id}</td>
                            <td style={tdStyle}>{supply.supplier?.supplier_name || supply.supplier_name}</td>
                            <td style={tdStyle}>{new Date(supply.supply_date).toLocaleDateString()}</td>
                            <td style={tdStyle}>{supply.products_count || 0}</td>
                            <td style={tdStyle}>{supply.total_sum || 0} ₽</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => onViewDetails(supply)}
                                    style={{
                                        ...actionButtonStyle,
                                        backgroundColor: '#17a2b8',
                                        color: 'white'
                                    }}
                                    title="Просмотреть товары"
                                >
                                    📦 Товары
                                </button>
                                <button
                                    onClick={() => onDelete(supply.id)}
                                    style={{
                                        ...actionButtonStyle,
                                        backgroundColor: '#dc3545',
                                        color: 'white'
                                    }}
                                    title="Удалить"
                                >
                                    🗑️ Удалить
                                </button>
                             </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default SuppliesTable;