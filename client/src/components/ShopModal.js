// src/components/ShopModal.js
import React from 'react';

const ShopModal = ({ isOpen, onClose, onSubmit, formData, onChange, loading }) => {
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

    const inputStyle = {
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

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>
                    Добавить магазин
                </h2>
                <form onSubmit={onSubmit}>
                    <div>
                        <label style={{ fontWeight: '500' }}>Название магазина *</label>
                        <input
                            type="text"
                            name="shop_name"
                            value={formData.shop_name}
                            onChange={onChange}
                            placeholder="Введите название"
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: '500' }}>Телефон</label>
                        <input
                            type="tel"
                            name="shop_telephone"
                            value={formData.shop_telephone}
                            onChange={onChange}
                            placeholder="+7 (XXX) XXX-XX-XX"
                            style={inputStyle}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                ...buttonStyle,
                                backgroundColor: '#6c757d',
                                marginRight: '10px'
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            style={buttonStyle}
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopModal;