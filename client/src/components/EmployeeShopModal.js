// src/components/EmployeeShopsModal.js
import React from 'react';

const EmployeeShopsModal = ({ isOpen, onClose, employeeName, shops }) => {
    if (!isOpen) return null;

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

    const shopItemStyle = {
        padding: '10px',
        margin: '5px 0',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const buttonStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
        width: '100%'
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>
                    Магазины сотрудника
                </h2>
                <p style={{ marginBottom: '15px' }}>
                    Сотрудник: <strong>{employeeName}</strong>
                </p>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {shops.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                            Сотрудник не привязан ни к одному магазину
                        </p>
                    ) : (
                        shops.map((shop, index) => (
                            <div key={index} style={shopItemStyle}>
                                <span>🏪 {shop.shop_name}</span>
                                {shop.shop_telephone && (
                                    <span style={{ color: '#666', fontSize: '12px' }}>
                                        📞 {shop.shop_telephone}
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={onClose}
                    style={buttonStyle}
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default EmployeeShopsModal;