// src/components/SupplyBasicInfo.js
import React from 'react';

const SupplyBasicInfo = ({ 
    suppliers, 
    selectedSupplierId, 
    onSupplierChange, 
    onOpenSupplierModal,
    selectedShopId,
    onShopChange,
    supplyDate,
    onDateChange,
    isDisabled 
}) => {
    const selectStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
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
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ marginBottom: '20px' }}>Основная информация</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ fontWeight: '500' }}>Поставщик *</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <select
                            value={selectedSupplierId}
                            onChange={(e) => onSupplierChange(e.target.value)}
                            style={{ ...selectStyle, flex: 1 }}
                            disabled={isDisabled}
                            required
                        >
                            <option value="">-- Выберите поставщика --</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.supplier_name} {supplier.supplier_telephone ? `(${supplier.supplier_telephone})` : ''}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={onOpenSupplierModal}
                            style={{
                                ...buttonStyle,
                                backgroundColor: '#17a2b8',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            + Новый
                        </button>
                    </div>
                </div>
                <div>
                    <label style={{ fontWeight: '500' }}>Магазин</label>
                    <select
                        value={selectedShopId}
                        onChange={(e) => onShopChange(e.target.value)}
                        style={selectStyle}
                        disabled={true}
                    >
                        <option value="">-- Выберите магазин (скоро) --</option>
                    </select>
                    <small style={{ color: '#999' }}>Функция в разработке</small>
                </div>
                <div>
                    <label style={{ fontWeight: '500' }}>Дата поставки</label>
                    <input
                        type="date"
                        value={supplyDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        style={inputStyle}
                        disabled={isDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default SupplyBasicInfo;