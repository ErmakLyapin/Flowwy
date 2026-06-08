// src/pages/Products.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import CategoryButtons from '../components/CategoryButtons';
import ProductTable from '../components/ProductTable';
import WriteOffModal from '../components/WriteOffModal';
import { useProducts } from '../hooks/useProducts';
import { getAdminShops } from '../http/shopAPI';
import { writeOffProduct } from '../http/productAPI';

const Products = ({ userRole }) => {
    const navigate = useNavigate();
    const isAdmin = userRole === 'admin';
    
    const [shops, setShops] = useState([]);
    const [selectedShopId, setSelectedShopId] = useState('');
    const [shopName, setShopName] = useState('');
    
    const effectiveShopId = isAdmin ? selectedShopId : localStorage.getItem('selectedShopId');
    const selectedShopName = localStorage.getItem('selectedShopName');
    
    const {
        loading,
        getTypeName,
        getCurrentProducts,
        handleTypeClick,
        handleShowBouquets,
        showBouquets,
        selectedTypeId,
        availableTypeIds
    } = useProducts(effectiveShopId);
    
    const [showWriteOffModal, setShowWriteOffModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [writeOffQuantity, setWriteOffQuantity] = useState(1);

    React.useEffect(() => {
        if (isAdmin) {
            loadShops();
        } else if (!effectiveShopId) {
            alert('Магазин не выбран. Обратитесь к администратору.');
            navigate('/');
        } else {
            setShopName(selectedShopName || '');
        }
    }, []);

    const loadShops = async () => {
        try {
            const data = await getAdminShops();
            setShops(data);
            if (data.length > 0) {
                const firstShopId = data[0].shop?.id || data[0].id;
                setSelectedShopId(firstShopId);
            }
        } catch (error) {
            console.error('Ошибка загрузки магазинов:', error);
            alert('Ошибка загрузки магазинов');
        }
    };

    const handleWriteOff = (product) => {
        setSelectedProduct(product);
        setWriteOffQuantity(1);
        setShowWriteOffModal(true);
    };

    const confirmWriteOff = async () => {
        if (!writeOffQuantity || writeOffQuantity <= 0) {
            alert('Введите корректное количество');
            return;
        }
        
        if (writeOffQuantity > selectedProduct.quantity) {
            alert(`Недостаточно товара. Доступно: ${selectedProduct.quantity}`);
            return;
        }
        
        try {
            await writeOffProduct(selectedProduct.product_id, effectiveShopId, writeOffQuantity);
            alert('Товар списан');
            setShowWriteOffModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Ошибка списания:', error);
            alert(error.response?.data?.message || 'Ошибка списания товара');
        }
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

    const selectStyle = {
        width: '100%',
        padding: '10px',
        margin: '8px 0 16px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px'
    };

    const currentProducts = getCurrentProducts();
    const isBouquetView = showBouquets;

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <NavBar />
            <div style={{ padding: '30px', marginLeft: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ color: '#333' }}>
                        {isAdmin ? '📦 Товары в магазинах' : '📦 Товары в магазине'}
                    </h1>
                    <button
                        onClick={() => navigate(isAdmin ? '/admin' : '/')}
                        style={buttonStyle}
                    >
                        ← Назад
                    </button>
                </div>

                {isAdmin && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '20px' }}>Выберите магазин</h3>
                        <select
                            value={selectedShopId}
                            onChange={(e) => setSelectedShopId(e.target.value)}
                            style={selectStyle}
                        >
                            <option value="">-- Выберите магазин --</option>
                            {shops.map(item => (
                                <option key={item.shop?.id || item.id} value={item.shop?.id || item.id}>
                                    {item.shop?.shop_name || item.shop_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {!isAdmin && effectiveShopId && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '10px', color: '#2e7d32' }}>
                            🏪 {shopName}
                        </h3>
                        <p style={{ color: '#666' }}>
                            Просмотр остатков товаров в вашем магазине
                        </p>
                    </div>
                )}

                {effectiveShopId && (
                    <>
                        <CategoryButtons
                            availableTypeIds={availableTypeIds}
                            getTypeName={getTypeName}
                            selectedTypeId={selectedTypeId}
                            onTypeClick={handleTypeClick}
                            showBouquets={showBouquets}
                            onShowBouquets={handleShowBouquets}
                            loading={loading}
                        />

                        <ProductTable
                            products={currentProducts}
                            isAdmin={isAdmin}
                            onWriteOff={handleWriteOff}
                            title={isBouquetView ? '💐 Букеты' : getTypeName(selectedTypeId)}
                        />

                        {currentProducts.length === 0 && !loading && isBouquetView && (
                            <div style={{
                                backgroundColor: 'white',
                                padding: '40px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                color: '#999'
                            }}>
                                Нет созданных букетов
                            </div>
                        )}
                    </>
                )}
            </div>

            <WriteOffModal
                isOpen={showWriteOffModal}
                onClose={() => setShowWriteOffModal(false)}
                onConfirm={confirmWriteOff}
                product={selectedProduct}
                quantity={writeOffQuantity}
                setQuantity={setWriteOffQuantity}
            />
        </div>
    );
};

export default Products;