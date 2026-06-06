// src/components/EmployeesTable.js
import React from 'react';

const EmployeesTable = ({ employees, loading, onEdit, onDelete, onAssignShop, onResetPassword, onViewShops }) => {
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
                    <th style={thStyle}>Имя</th>
                    <th style={thStyle}>Фамилия</th>
                    <th style={thStyle}>Отчество</th>
                    <th style={thStyle}>Логин</th>
                    <th style={thStyle}>Магазины</th>
                    <th style={thStyle}>Действия</th>
                </tr>
            </thead>
            <tbody>
                {employees.length === 0 ? (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                            Нет сотрудников. Добавьте первого!
                        </td>
                    </tr>
                ) : (
                    employees.map((item) => {
                        const employee = item.employee || item;
                        const shops = employee.shops || [];
                        
                        return (
                            <tr key={employee.id}>
                                <td style={tdStyle}>{employee.employee_name || '—'}</td>
                                <td style={tdStyle}>{employee.employee_surname || '—'}</td>
                                <td style={tdStyle}>{employee.employee_fathername || '—'}</td>
                                <td style={tdStyle}>{employee.employee_login}</td>
                                <td style={tdStyle}>
                                    {shops.length > 0 
                                        ? shops.map(s => s.shop_name).join(', ') 
                                        : '—'}
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => onResetPassword(employee)}
                                        style={{
                                            ...actionButtonStyle,
                                            backgroundColor: '#ff9800',
                                            color: 'white'
                                        }}
                                        title="Сбросить пароль"
                                    >
                                        Сбросить пароль
                                    </button>
                                    <button
                                        onClick={() => onAssignShop(employee)}
                                        style={{
                                            ...actionButtonStyle,
                                            backgroundColor: '#17a2b8',
                                            color: 'white'
                                        }}
                                        title="Привязать к магазину"
                                    >
                                        Привязать к магазину
                                    </button>
                                    <button
                                        onClick={() => onEdit(employee)}
                                        style={{
                                            ...actionButtonStyle,
                                            backgroundColor: '#ffc107',
                                            color: '#333'
                                        }}
                                        title="Редактировать"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => onDelete(employee.id)}
                                        style={{
                                            ...actionButtonStyle,
                                            backgroundColor: '#dc3545',
                                            color: 'white'
                                        }}
                                        title="Удалить"
                                    >
                                        Удалить
                                    </button>
                                    <button
                                        onClick={() => onViewShops(employee)}
                                        style={{
                                            ...actionButtonStyle,
                                            backgroundColor: '#2196f3',
                                            color: 'white'
                                        }}
                                        title="Просмотреть магазины"
                                    >
                                        Посмотреть магазины
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
};

export default EmployeesTable;