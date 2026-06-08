// src/components/CategoryButtons.js
import React from 'react';

const CategoryButtons = ({ 
    availableTypeIds, 
    getTypeName, 
    selectedTypeId, 
    onTypeClick, 
    showBouquets, 
    onShowBouquets, 
    loading 
}) => {
    const typeButtonStyle = (isActive) => ({
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: isActive ? '#2e7d32' : '#f0f0f0',
        color: isActive ? 'white' : '#333',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s'
    });

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ marginBottom: '20px' }}>Категории</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
                {availableTypeIds.map(typeId => (
                    <button
                        key={typeId}
                        onClick={() => onTypeClick(typeId)}
                        style={typeButtonStyle(selectedTypeId === typeId && !showBouquets)}
                    >
                        {getTypeName(typeId)}
                    </button>
                ))}
                <button
                    onClick={onShowBouquets}
                    style={{
                        ...typeButtonStyle(showBouquets),
                        backgroundColor: showBouquets ? '#9c27b0' : '#f0f0f0',
                        color: showBouquets ? 'white' : '#333'
                    }}
                >
                    💐 Букеты
                </button>
                {availableTypeIds.length === 0 && !showBouquets && (
                    <p style={{ color: '#999' }}>Нет товаров в этом магазине</p>
                )}
            </div>
        </div>
    );
};

export default CategoryButtons;