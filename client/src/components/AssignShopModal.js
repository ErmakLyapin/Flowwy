// src/components/AssignShopModal.js
import React from 'react';

const AssignShopModal = ({ isOpen, onClose, onAssign, shops, employeeName, employeeId, selectedShopId, setSelectedShopId, loading }) => {
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

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>
                    Привязать сотрудника к магазину
                </h2>
                <p style={{ marginBottom: '15px' }}>
                    Сотрудник: <strong>{employeeName}</strong>
                </p>
                
                <div>
                    <label style={{ fontWeight: '500' }}>Выберите магазин</label>
                    <select
                        value={selectedShopId}
                        onChange={(e) => setSelectedShopId(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">-- Выберите магазин --</option>
                        {shops.map(shop => (
                            <option key={shop.id} value={shop.id}>
                                {shop.shop_name}
                            </option>
                        ))}
                    </select>
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
                        type="button"
                        onClick={() => onAssign(employeeId, selectedShopId)}
                        style={buttonStyle}
                        disabled={loading || !selectedShopId}
                    >
                        {loading ? 'Привязка...' : 'Привязать'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignShopModal;