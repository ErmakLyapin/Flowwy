// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getProductTypes, getShopProducts } from '../http/productAPI';
import { getBouquets } from '../http/bouquetAPI';

export const useProducts = (shopId) => {
    const [allProductTypes, setAllProductTypes] = useState([]);
    const [productsByType, setProductsByType] = useState({});
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bouquets, setBouquets] = useState([]);
    const [showBouquets, setShowBouquets] = useState(false);

    useEffect(() => {
        loadProductTypes();
        loadBouquets();
    }, []);

    useEffect(() => {
        if (shopId) {
            loadShopProducts();
        }
    }, [shopId]);

    const loadProductTypes = async () => {
        try {
            const data = await getProductTypes();
            setAllProductTypes(data);
        } catch (error) {
            console.error('Ошибка загрузки типов товаров:', error);
        }
    };

    const loadShopProducts = async () => {
        if (!shopId) return;
        
        setLoading(true);
        try {
            const data = await getShopProducts(shopId);
            
            const grouped = {};
            data.forEach(item => {
                const product = item.product;
                if (product && product.product_type_id && item.quantity > 0) {
                    const typeId = product.product_type_id;
                    if (!grouped[typeId]) {
                        grouped[typeId] = [];
                    }
                    grouped[typeId].push({
                        product_id: item.product_id,
                        product_name: product.product_name,
                        retail_price: product.retail_price,
                        quantity: item.quantity,
                        product_type_id: product.product_type_id,
                        isBouquet: false
                    });
                }
            });
            
            setProductsByType(grouped);
            
            const availableTypes = Object.keys(grouped).map(Number);
            if (availableTypes.length > 0 && !selectedTypeId && !showBouquets) {
                setSelectedTypeId(availableTypes[0]);
            }
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            alert('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    };

    const loadBouquets = async () => {
        try {
            const data = await getBouquets();
            let bouquetsList = [];
            if (data && data.rows) {
                bouquetsList = data.rows;
            } else if (Array.isArray(data)) {
                bouquetsList = data;
            }
            
            const formattedBouquets = bouquetsList.map(bouquet => ({
                product_id: `bouquet_${bouquet.id}`,
                product_name: bouquet.bouquet_name,
                retail_price: bouquet.bouquet_price,
                quantity: 999,
                isBouquet: true,
                bouquet_id: bouquet.id,
                bouquet_date: bouquet.bouquet_date
            }));
            
            setBouquets(formattedBouquets);
        } catch (error) {
            console.error('Ошибка загрузки букетов:', error);
        }
    };

    const getTypeName = (typeId) => {
        const type = allProductTypes.find(t => t.id === typeId);
        return type?.product_type_name || 'Неизвестный тип';
    };

    const getCurrentProducts = () => {
        if (showBouquets) {
            return bouquets;
        }
        if (!selectedTypeId) return [];
        return productsByType[selectedTypeId] || [];
    };

    const handleTypeClick = (typeId) => {
        setShowBouquets(false);
        setSelectedTypeId(typeId);
    };

    const handleShowBouquets = () => {
        setShowBouquets(true);
        setSelectedTypeId(null);
    };

    return {
        loading,
        allProductTypes,
        getTypeName,
        getCurrentProducts,
        handleTypeClick,
        handleShowBouquets,
        showBouquets,
        selectedTypeId,
        availableTypeIds: Object.keys(productsByType).map(Number)
    };
};