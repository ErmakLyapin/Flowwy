// src/pages/Bouquets.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getBouquets, deleteBouquet, getBouquetProducts } from '../http/bouquetAPI';

const Bouquets = () => {
    const navigate = useNavigate();
    const [bouquets, setBouquets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBouquet, setSelectedBouquet] = useState(null);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [bouquetProducts, setBouquetProducts] = useState([]);

    useEffect(() => {
        loadBouquets();
    }, []);

    const loadBouquets = async () => {
    setLoading(true);
    try {
        const data = await getBouquets();
        console.log('Bouquets data:', data);
        
        // Если пришёл объект с пагинацией { count, rows }
        if (data && data.rows) {
            setBouquets(data.rows);
        } 
        // Если пришёл массив
        else if (Array.isArray(data)) {
            setBouquets(data);
        }
        // Если что-то другое
        else {
            setBouquets([]);
        }
    } catch (error) {
        console.error('Ошибка загрузки букетов:', error);
        alert('Ошибка загрузки букетов');
        setBouquets([]);
    } finally {
        setLoading(false);
    }
};

    const handleViewProducts = async (bouquet) => {
        setSelectedBouquet(bouquet);
        try {
            const products = await getBouquetProducts(bouquet.id);
            setBouquetProducts(products);
            setShowProductsModal(true);
        } catch (error) {
            console.error('Ошибка загрузки состава букета:', error);
            alert('Ошибка загрузки состава букета');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот букет?')) {
            try {
                await deleteBouquet(id);
                alert('Букет удалён');
                loadBouquets();
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Ошибка удаления букета');
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
        fontSize: '16px',
        marginLeft: '10px'
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
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
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
                    <h1 style={{ color: '#333' }}>💐 Букеты</h1>
                    <div>
                        <button
                            onClick={() => navigate('/employee/create-bouquet')}
                            style={buttonStyle}
                        >
                            + Создать букет
                        </button>
                        <button
                            onClick={loadBouquets}
                            style={{ ...buttonStyle, backgroundColor: '#17a2b8' }}
                        >
                            🔄 Обновить
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Название</th>
                                <th style={thStyle}>Цена</th>
                                <th style={thStyle}>Дата создания</th>
                                <th style={thStyle}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bouquets.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                        Нет букетов. Создайте первый!
                                    </td>
                                </tr>
                            ) : (
                                bouquets.map((bouquet) => (
                                    <tr key={bouquet.id}>
                                        <td style={tdStyle}>{bouquet.id}</td>
                                        <td style={tdStyle}>{bouquet.bouquet_name}</td>
                                        <td style={tdStyle}>{bouquet.bouquet_price} ₽</td>
                                        <td style={tdStyle}>{new Date(bouquet.bouquet_date).toLocaleDateString()}</td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => handleViewProducts(bouquet)}
                                                style={{
                                                    backgroundColor: '#17a2b8',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    marginRight: '5px'
                                                }}
                                            >
                                                📦 Состав
                                            </button>
                                            <button
                                                onClick={() => handleDelete(bouquet.id)}
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

            {/* Модальное окно с составом букета */}
            {showProductsModal && selectedBouquet && (
                <div style={modalOverlayStyle} onClick={() => setShowProductsModal(false)}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '20px' }}>
                            Состав букета "{selectedBouquet.bouquet_name}"
                        </h2>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Товар</th>
                                    <th style={thStyle}>Количество</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bouquetProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" style={{ textAlign: 'center', padding: '40px' }}>
                                            Нет товаров в букете
                                        </td>
                                    </tr>
                                ) : (
                                    bouquetProducts.map((item, index) => {
                                        const product = item.product;
                                        return (
                                            <tr key={index}>
                                                <td style={tdStyle}>{product?.product_name || 'Неизвестный товар'}</td>
                                                <td style={tdStyle}>{item.quantity} шт.</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button
                                onClick={() => setShowProductsModal(false)}
                                style={buttonStyle}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bouquets;