// src/pages/Shops.js
import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import ShopModal from '../components/ShopModal';
import ShopsTable from '../components/ShopsTable';
import { AuthContext } from '../context/AuthContext';
import { getAdminShops, createShop, deleteShop, addShopToAdministrator, removeShopFromAdministrator } from '../http/shopAPI';


const Shops = () => {
    const { userId } = useContext(AuthContext);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        shop_name: '',
        shop_telephone: ''
    });

    useEffect(() => {
        loadShops();
    }, []);

    const loadShops = async () => {
        setLoading(true);
        try {
            const data = await getAdminShops();
            setShops(data);
        } catch (error) {
            console.error('Ошибка загрузки магазинов:', error);
            alert('Ошибка загрузки магазинов');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.shop_name) {
            alert('Название магазина обязательно!');
            return;
        }
        
        setLoading(true);
        try {
            const newShop = await createShop({
                shop_name: formData.shop_name,
                shop_telephone: formData.shop_telephone || null
            });
            
            await addShopToAdministrator(userId, newShop.id);
            
            alert('Магазин успешно добавлен!');
            setShowModal(false);
            setFormData({ shop_name: '', shop_telephone: '' });
            loadShops();
        } catch (error) {
            console.error('Ошибка создания магазина:', error);
            alert(error.response?.data?.message || 'Ошибка создания магазина');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот магазин?')) {
        try {
            // Сначала удаляем связь с администратором
            await removeShopFromAdministrator(userId, id);  // ← добавить
            // Потом удаляем сам магазин
            await deleteShop(id);
            alert('Магазин удалён');
            loadShops();
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Ошибка удаления магазина');
        }
    }
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
            minHeight: '100vh',
            background: '#f5f7fa'
        }}>
            <NavBar />
            <div style={{
                padding: '30px',
                marginLeft: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ color: '#333' }}>
                        Управление магазинами
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        style={buttonStyle}
                    >
                        Добавить магазин
                    </button>
                </div>

                <ShopsTable 
                    shops={shops} 
                    loading={loading} 
                    onDelete={handleDelete} 
                />
            </div>

            <ShopModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                formData={formData}
                onChange={handleChange}
                loading={loading}
            />
        </div>
    );
};

export default Shops;