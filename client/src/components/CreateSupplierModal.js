// src/components/CreateSupplierModal.js
import React, { useState } from 'react';

const CreateSupplierModal = ({ isOpen, onClose, onCreate }) => {
    const [newSupplier, setNewSupplier] = useState({
        supplier_name: '',
        supplier_telephone: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!newSupplier.supplier_name) {
            alert('Введите название поставщика');
            return;
        }
        
        setLoading(true);
        try {
            await onCreate(newSupplier);
            setNewSupplier({ supplier_name: '', supplier_telephone: '' });
            onClose();
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
                    ➕ Новый поставщик
                </h2>
                <div>
                    <label style={{ fontWeight: '500' }}>Название *</label>
                    <input
                        type="text"
                        value={newSupplier.supplier_name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, supplier_name: e.target.value })}
                        style={inputStyle}
                        placeholder="Введите название поставщика"
                    />
                </div>
                <div>
                    <label style={{ fontWeight: '500' }}>Телефон</label>
                    <input
                        type="tel"
                        value={newSupplier.supplier_telephone}
                        onChange={(e) => setNewSupplier({ ...newSupplier, supplier_telephone: e.target.value })}
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

export default CreateSupplierModal;