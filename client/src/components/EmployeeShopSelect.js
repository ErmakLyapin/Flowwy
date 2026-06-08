// src/components/EmployeeShopSelect.js
import React, { useState, useEffect } from 'react';
import { getEmployeeShops } from '../http/employeeAPI';

const EmployeeShopSelect = ({ onSelect }) => {  // ← убрали onSkip
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployeeShops();
    }, []);

    const loadEmployeeShops = async () => {
        try {
            const employeeId = localStorage.getItem('userId');
            const data = await getEmployeeShops(employeeId);
            const availableShops = data.map(s => s.shop).filter(s => s);
            setShops(availableShops);
        } catch (error) {
            console.error('Ошибка загрузки магазинов:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (selectedShop) {
            const shop = shops.find(s => s.id === parseInt(selectedShop));
            if (shop) {
                onSelect(shop);
            }
        } else {
            alert('Пожалуйста, выберите магазин!');
        }
    };

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
    };

    const contentStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        textAlign: 'center'
    };

    const selectStyle = {
        width: '100%',
        padding: '12px',
        margin: '20px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

    const buttonStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    if (loading) {
        return (
            <div style={modalStyle}>
                <div style={contentStyle}>
                    <h2>Загрузка...</h2>
                </div>
            </div>
        );
    }

    // Если нет магазинов, показываем сообщение
    if (shops.length === 0) {
        return (
            <div style={modalStyle}>
                <div style={contentStyle}>
                    <h2 style={{ color: '#333', marginBottom: '10px' }}>
                        🏪 Нет доступных магазинов
                    </h2>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                        У вас нет привязанных магазинов. Обратитесь к администратору.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                <h2 style={{ color: '#333', marginBottom: '10px' }}>
                    🏪 Выберите магазин
                </h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Выберите магазин, в котором будете работать
                </p>

                <select
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">-- Выберите магазин --</option>
                    {shops.map(shop => (
                        <option key={shop.id} value={shop.id}>
                            {shop.shop_name}
                        </option>
                    ))}
                </select>

                <button onClick={handleSubmit} style={buttonStyle}>
                    Подтвердить
                </button>
            </div>
        </div>
    );
};

export default EmployeeShopSelect;