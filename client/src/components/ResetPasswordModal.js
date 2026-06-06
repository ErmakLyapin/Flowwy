// src/components/ResetPasswordModal.js
import React, { useState } from 'react';

const ResetPasswordModal = ({ isOpen, onClose, onSubmit, employeeName, loading }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        
        if (newPassword.length < 4) {
            alert('Пароль должен быть не менее 4 символов');
            return;
        }
        
        onSubmit(newPassword);
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
        fontSize: '16px',
        boxSizing: 'border-box'
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
                    Сброс пароля
                </h2>
                <p style={{ marginBottom: '15px' }}>
                    Сотрудник: <strong>{employeeName}</strong>
                </p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ fontWeight: '500' }}>Новый пароль *</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Введите новый пароль"
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: '500' }}>Подтверждение пароля *</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторите пароль"
                            style={inputStyle}
                            required
                        />
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
                            type="submit"
                            style={buttonStyle}
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сбросить пароль'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordModal;