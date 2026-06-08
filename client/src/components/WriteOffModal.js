// src/components/WriteOffModal.js
import React from 'react';

const WriteOffModal = ({ isOpen, onClose, onConfirm, product, quantity, setQuantity }) => {
    if (!isOpen || !product) return null;

    const buttonStyle = {
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    return (
        <div style={{
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
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '30px',
                width: '90%',
                maxWidth: '400px'
            }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '20px' }}>Списание товара</h2>
                <p><strong>Товар:</strong> {product.product_name}</p>
                <p><strong>Доступно:</strong> {product.quantity} шт.</p>
                <div style={{ marginTop: '15px' }}>
                    <label>Количество для списания:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        min="1"
                        max={product.quantity}
                        style={{
                            width: '100%',
                            padding: '10px',
                            margin: '8px 0',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px'
                        }}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            ...buttonStyle,
                            backgroundColor: '#6c757d'
                        }}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        style={buttonStyle}
                    >
                        Списать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WriteOffModal;