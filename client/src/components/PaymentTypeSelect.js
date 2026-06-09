// src/components/PaymentTypeSelect.js
import React, { useState, useEffect } from 'react';
import { getPaymentTypes, createPaymentType } from '../http/paymentTypeAPI';

const PaymentTypeSelect = ({ value, onChange, required }) => {
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');

    useEffect(() => {
        loadPaymentTypes();
    }, []);

    const loadPaymentTypes = async () => {
        try {
            const data = await getPaymentTypes();
            setPaymentTypes(data);
        } catch (error) {
            console.error('Ошибка загрузки типов оплаты:', error);
        }
    };

    const handleCreatePaymentType = async () => {
        if (!newTypeName) {
            alert('Введите название типа оплаты');
            return;
        }
        
        setLoading(true);
        try {
            const paymentType = await createPaymentType({ payment_type_name: newTypeName });
            await loadPaymentTypes();
            onChange(paymentType.id);
            setShowModal(false);
            setNewTypeName('');
            alert('Тип оплаты добавлен!');
        } catch (error) {
            console.error('Ошибка создания типа оплаты:', error);
            alert(error.response?.data?.message || 'Ошибка создания типа оплаты');
        } finally {
            setLoading(false);
        }
    };

    const selectStyle = {
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
        fontSize: '16px',
        marginRight: '10px'
    };

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ ...selectStyle, flex: 1 }}
                    required={required}
                >
                    <option value="">-- Выберите тип оплаты --</option>
                    {paymentTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.payment_type_name}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    style={{
                        ...buttonStyle,
                        backgroundColor: '#17a2b8',
                        whiteSpace: 'nowrap'
                    }}
                >
                    + Новый
                </button>
            </div>

            {showModal && (
                <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '20px', color: '#333' }}>
                            ➕ Новый тип оплаты
                        </h2>
                        <div>
                            <label style={{ fontWeight: '500' }}>Название *</label>
                            <input
                                type="text"
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                style={inputStyle}
                                placeholder="Введите название"
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '20px',
                            gap: '10px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: '#6c757d'
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={handleCreatePaymentType}
                                style={buttonStyle}
                                disabled={loading}
                            >
                                {loading ? 'Создание...' : 'Создать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentTypeSelect;