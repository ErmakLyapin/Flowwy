// src/components/SupplyBasicInfo.js
import React from 'react';

const SupplyBasicInfo = ({ 
    suppliers, 
    shops,  // ← добавить shops
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
        fontSize: '16px'
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
                {/* Поставщик */}
                <div>
                    <label style={{ fontWeight: '500' }}>Поставщик *</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <select
                            value={selectedSupplierId}
                            onChange={(e) => onSupplierChange(e.target.value)}
                            style={{ ...selectStyle, flex: 1 }}
                            required
                        >
                            <option value="">-- Выберите поставщика --</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.supplier_name}
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

                {/* Магазин */}
                <div>
                    <label style={{ fontWeight: '500' }}>Магазин *</label>
                    <select
                        value={selectedShopId}
                        onChange={(e) => onShopChange(e.target.value)}
                        style={selectStyle}
                        required
                    >
                        <option value="">-- Выберите магазин --</option>
                        {shops && shops.map(shop => (  // ← добавить проверку shops
                            <option key={shop.id} value={shop.id}>
                                {shop.shop_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Дата поставки */}
                <div>
                    <label style={{ fontWeight: '500' }}>Дата поставки</label>
                    <input
                        type="date"
                        value={supplyDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        style={inputStyle}
                    />
                </div>
            </div>
        </div>
    );
};

export default SupplyBasicInfo;