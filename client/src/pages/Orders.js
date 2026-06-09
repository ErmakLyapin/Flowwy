// src/pages/Orders.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getOrders } from '../http/orderAPI';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            alert('Ошибка загрузки заказов');
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
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <NavBar />
            <div style={{ padding: '30px', marginLeft: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ color: '#333' }}>📋 Заказы</h1>
                    <button
                        onClick={() => navigate('/employee/create-order')}
                        style={buttonStyle}
                    >
                        + Создать заказ
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>№</th>
                                <th style={thStyle}>Клиент</th>
                                <th style={thStyle}>Тип оплаты</th>
                                <th style={thStyle}>Сумма</th>
                                <th style={thStyle}>Дата</th>
                                <th style={thStyle}>Продавец</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        Нет заказов
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id}>
                                        <td style={tdStyle}>{order.id}</td>
                                        <td style={tdStyle}>{order.customer?.customer_name || 'Без имени'} ({order.customer?.customer_telephone})</td>
                                        <td style={tdStyle}>{order.payment_type?.payment_type_name}</td>
                                        <td style={tdStyle}>{order.total_price} ₽</td>
                                        <td style={tdStyle}>{new Date(order.order_date).toLocaleString()}</td>
                                        <td style={tdStyle}>{order.employee?.employee_name} {order.employee?.employee_surname}</td>
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

export default Orders;