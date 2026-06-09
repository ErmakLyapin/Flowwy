// src/components/CustomerSelect.js
import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer } from '../http/customerAPI';

const CustomerSelect = ({ value, onChange, required }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        customer_name: '',
        customer_telephone: ''
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Ошибка загрузки клиентов:', error);
        }
    };

    const handleCreateCustomer = async () => {
        if (!newCustomer.customer_telephone) {
            alert('Введите телефон клиента');
            return;
        }
        
        setLoading(true);
        try {
            const customer = await createCustomer({
                customer_name: newCustomer.customer_name || null,
                customer_telephone: newCustomer.customer_telephone
            });
            await loadCustomers();
            onChange(customer.id);
            setShowModal(false);
            setNewCustomer({ customer_name: '', customer_telephone: '' });
            alert('Клиент добавлен!');
        } catch (error) {
            console.error('Ошибка создания клиента:', error);
            alert(error.response?.data?.message || 'Ошибка создания клиента');
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
                    <option value="">-- Выберите клиента --</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.customer_name || 'Без имени'} ({customer.customer_telephone})
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
                            ➕ Новый клиент
                        </h2>
                        <div>
                            <label style={{ fontWeight: '500' }}>Имя</label>
                            <input
                                type="text"
                                value={newCustomer.customer_name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, customer_name: e.target.value })}
                                style={inputStyle}
                                placeholder="Введите имя (необязательно)"
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: '500' }}>Телефон *</label>
                            <input
                                type="tel"
                                value={newCustomer.customer_telephone}
                                onChange={(e) => setNewCustomer({ ...newCustomer, customer_telephone: e.target.value })}
                                style={inputStyle}
                                placeholder="Введите телефон"
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
                                onClick={handleCreateCustomer}
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

export default CustomerSelect;