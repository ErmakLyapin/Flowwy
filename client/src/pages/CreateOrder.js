// src/pages/CreateOrder.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import CustomerSelect from '../components/CustomerSelect';
import PaymentTypeSelect from '../components/PaymentTypeSelect';
import SelectedItemsTable from '../components/SelectedItemsTable';
import { createOrder } from '../http/orderAPI';

const CreateOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [loading, setLoading] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [paymentTypeId, setPaymentTypeId] = useState('');
    const [manualTotalPrice, setManualTotalPrice] = useState('');
    const [useManualPrice, setUseManualPrice] = useState(false);
    const [items, setItems] = useState([]);

    // Загружаем сохранённые товары при загрузке страницы
    useEffect(() => {
        const savedItems = sessionStorage.getItem('orderItems');
        if (savedItems) {
            setItems(JSON.parse(savedItems));
        }
        
        const savedCustomerId = sessionStorage.getItem('orderCustomerId');
        if (savedCustomerId) {
            setCustomerId(savedCustomerId);
        }
        
        const savedPaymentTypeId = sessionStorage.getItem('orderPaymentTypeId');
        if (savedPaymentTypeId) {
            setPaymentTypeId(savedPaymentTypeId);
        }
    }, []);

    // Сохраняем товары при их изменении
    useEffect(() => {
        if (items.length > 0) {
            sessionStorage.setItem('orderItems', JSON.stringify(items));
        }
    }, [items]);

    // Сохраняем клиента
    useEffect(() => {
        if (customerId) {
            sessionStorage.setItem('orderCustomerId', customerId);
        }
    }, [customerId]);

    // Сохраняем тип оплаты
    useEffect(() => {
        if (paymentTypeId) {
            sessionStorage.setItem('orderPaymentTypeId', paymentTypeId);
        }
    }, [paymentTypeId]);

    // Обработка возврата со страницы выбора товаров
    useEffect(() => {
        if (location.state?.selectedItem) {
            const { selectedItem } = location.state;
            
            setItems(prevItems => {
                const existingIndex = prevItems.findIndex(
                    item => item.id === selectedItem.id && item.type === selectedItem.type
                );
                
                if (existingIndex !== -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingIndex].quantity += 1;
                    return updatedItems;
                } else {
                    return [...prevItems, {
                        id: selectedItem.id,
                        name: selectedItem.name,
                        price: selectedItem.price,
                        quantity: 1,
                        type: selectedItem.type
                    }];
                }
            });
            
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    const getAutoTotalPrice = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const finalTotalPrice = useManualPrice 
        ? parseFloat(manualTotalPrice) || 0 
        : getAutoTotalPrice();

    const handleAddItem = () => {
        // Сохраняем текущие товары перед уходом
        sessionStorage.setItem('orderItems', JSON.stringify(items));
        sessionStorage.setItem('orderCustomerId', customerId);
        sessionStorage.setItem('orderPaymentTypeId', paymentTypeId);
        
        navigate('/employee/products', { 
            state: { 
                selectMode: true, 
                returnTo: '/employee/create-order'
            }
        });
    };

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedItems = [...items];
        updatedItems[index].quantity = newQuantity;
        setItems(updatedItems);
        
        // Обновляем sessionStorage
        sessionStorage.setItem('orderItems', JSON.stringify(updatedItems));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
        if (updatedItems.length === 0) {
            sessionStorage.removeItem('orderItems');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!customerId) {
            alert('Выберите клиента');
            return;
        }
        
        if (!paymentTypeId) {
            alert('Выберите тип оплаты');
            return;
        }
        
        if (items.length === 0) {
            alert('Добавьте хотя бы один товар или букет');
            return;
        }
        
        setLoading(true);
        
        try {
            const orderData = {
                customer_id: customerId,
                payment_type_id: paymentTypeId,
                total_price: finalTotalPrice,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    type: item.type
                }))
            };
            
            await createOrder(orderData);
            
            // Очищаем sessionStorage после успешного создания
            sessionStorage.removeItem('orderItems');
            sessionStorage.removeItem('orderCustomerId');
            sessionStorage.removeItem('orderPaymentTypeId');
            
            alert('Заказ успешно создан!');
            navigate('/employee/orders');
        } catch (error) {
            console.error('Ошибка создания заказа:', error);
            alert(error.response?.data?.message || 'Ошибка создания заказа');
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

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

    const sectionStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
                    <h1 style={{ color: '#333' }}>🛒 Создание заказа</h1>
                    <button
                        onClick={() => navigate('/employee/orders')}
                        style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                    >
                        ← Назад к заказам
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={sectionStyle}>
                        <h3 style={{ marginBottom: '20px' }}>Информация о заказе</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ fontWeight: '500' }}>Клиент *</label>
                                <CustomerSelect
                                    value={customerId}
                                    onChange={setCustomerId}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: '500' }}>Тип оплаты *</label>
                                <PaymentTypeSelect
                                    value={paymentTypeId}
                                    onChange={setPaymentTypeId}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={{ marginBottom: '20px' }}>Товары и букеты</h3>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            style={buttonStyle}
                        >
                            + Добавить товар/букет
                        </button>
                    </div>

                    <SelectedItemsTable
                        items={items}
                        onRemove={handleRemoveItem}
                        onQuantityChange={handleQuantityChange}
                        title="Добавленные товары и букеты"
                    />

                    <div style={sectionStyle}>
                        <h3 style={{ marginBottom: '20px' }}>Итоговая сумма</h3>
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="radio"
                                        checked={!useManualPrice}
                                        onChange={() => setUseManualPrice(false)}
                                    />
                                    Автоматическая ({getAutoTotalPrice()} ₽)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="radio"
                                        checked={useManualPrice}
                                        onChange={() => setUseManualPrice(true)}
                                    />
                                    Своя
                                </label>
                            </div>
                            {useManualPrice && (
                                <input
                                    type="number"
                                    step="0.01"
                                    value={manualTotalPrice}
                                    onChange={(e) => setManualTotalPrice(e.target.value)}
                                    style={inputStyle}
                                    placeholder="Введите сумму"
                                />
                            )}
                            <div style={{ 
                                marginTop: '15px', 
                                fontSize: '24px', 
                                fontWeight: 'bold',
                                color: '#2e7d32'
                            }}>
                                Итого: {finalTotalPrice} ₽
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Создание...' : '✅ Создать заказ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;