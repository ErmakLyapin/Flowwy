// src/components/CreateProductModal.js
import React, { useState, useEffect } from 'react';
import CreateProductTypeModal from './CreateProductTypeModal';

const CreateProductModal = ({ isOpen, onClose, onCreate, productTypes, onCreateProductType }) => {
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        product_type_id: '',
        retail_price: ''
    });
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setNewProduct({
                product_name: '',
                product_type_id: '',
                retail_price: ''
            });
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!newProduct.product_name) {
            alert('Введите название товара');
            return;
        }
        if (!newProduct.product_type_id) {
            alert('Выберите тип товара');
            return;
        }
        
        setLoading(true);
        try {
            const product = await onCreate(newProduct);
            setNewProduct({ product_name: '', product_type_id: '', retail_price: '' });
            onClose(product);
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateType = async (typeData) => {
        const newType = await onCreateProductType(typeData);
        setNewProduct({ ...newProduct, product_type_id: newType.id });
        return newType;
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

    const smallButtonStyle = {
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        whiteSpace: 'nowrap'
    };

    return (
        <>
            <div style={modalOverlayStyle} onClick={onClose}>
                <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                    <h2 style={{ marginBottom: '20px', color: '#333' }}>
                        ➕ Новый товар
                    </h2>
                    <div>
                        <label style={{ fontWeight: '500' }}>Название товара *</label>
                        <input
                            type="text"
                            value={newProduct.product_name}
                            onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                            style={inputStyle}
                            placeholder="Введите название товара"
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: '500' }}>Тип товара *</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select
                                value={newProduct.product_type_id}
                                onChange={(e) => setNewProduct({ ...newProduct, product_type_id: e.target.value })}
                                style={{ ...selectStyle, flex: 1 }}
                            >
                                <option value="">-- Выберите тип --</option>
                                {productTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.product_type_name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setShowTypeModal(true)}
                                style={smallButtonStyle}
                            >
                                + Новый тип
                            </button>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontWeight: '500' }}>Розничная цена</label>
                        <input
                            type="number"
                            step="0.01"
                            value={newProduct.retail_price}
                            onChange={(e) => setNewProduct({ ...newProduct, retail_price: e.target.value })}
                            style={inputStyle}
                            placeholder="Введите цену (необязательно)"
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

            <CreateProductTypeModal
                isOpen={showTypeModal}
                onClose={() => setShowTypeModal(false)}
                onCreate={handleCreateType}
            />
        </>
    );
};

export default CreateProductModal;