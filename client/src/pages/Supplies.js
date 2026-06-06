// src/pages/Supplies.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getAdminSupplies, deleteSupply } from '../http/supplyAPI';

const Supplies = () => {
    const navigate = useNavigate();
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSupplies();
    }, []);

    const loadSupplies = async () => {
        setLoading(true);
        try {
            const data = await getAdminSupplies();
            setSupplies(data);
        } catch (error) {
            console.error('Ошибка загрузки накладных:', error);
            alert('Ошибка загрузки накладных');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту накладную?')) {
            try {
                await deleteSupply(id);
                alert('Накладная удалена');
                loadSupplies();
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Ошибка удаления накладной');
            }
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

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f7fa'
        }}>
            <NavBar />
            <div style={{
                padding: '30px',
                marginLeft: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ color: '#333' }}>
                        📦 Накладные (поставки)
                    </h1>
                    <button
                        onClick={() => navigate('/admin/create-supply')}
                        style={buttonStyle}
                    >
                        + Создать накладную
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Поставщик</th>
                                <th style={thStyle}>Дата</th>
                                <th style={thStyle}>Товаров</th>
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
                                        <td style={tdStyle}>{supply.supplier?.supplier_name}</td>
                                        <td style={tdStyle}>{new Date(supply.supply_date).toLocaleDateString()}</td>
                                        <td style={tdStyle}>{supply.products_count || 0}</td>
                                        <td style={tdStyle}>{supply.total_sum || 0} ₽</td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => handleDelete(supply.id)}
                                                style={{
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Supplies;