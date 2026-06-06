// src/components/CreateProductTypeModal.js
import React, { useState } from 'react';

const CreateProductTypeModal = ({ isOpen, onClose, onCreate }) => {
    const [typeName, setTypeName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!typeName.trim()) {
            alert('Введите название типа товара');
            return;
        }
        
        setLoading(true);
        try {
            const newType = await onCreate({ product_type_name: typeName });
            setTypeName('');
            onClose(newType);
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    ➕ Новый тип товара
                </h2>
                <div>
                    <label style={{ fontWeight: '500' }}>Название типа *</label>
                    <input
                        type="text"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        style={inputStyle}
                        placeholder="Введите название типа товара"
                        autoFocus
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
                        onClick={onClose}
                        style={{
                            ...buttonStyle,
                            backgroundColor: '#6c757d'
                        }}
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={buttonStyle}
                        disabled={loading}
                    >
                        {loading ? 'Создание...' : 'Создать'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProductTypeModal;