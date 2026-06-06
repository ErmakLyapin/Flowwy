// src/components/EmployeeModal.js
import React from 'react';

const EmployeeModal = ({ isOpen, onClose, onSubmit, formData, onChange, loading, isEdit }) => {
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
                    {isEdit ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
                </h2>
                <form onSubmit={onSubmit}>
                    <div>
                        <label style={{ fontWeight: '500' }}>Имя *</label>
                        <input
                            type="text"
                            name="employee_name"
                            value={formData.employee_name || ''}
                            onChange={onChange}
                            placeholder="Введите имя"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: '500' }}>Фамилия *</label>
                        <input
                            type="text"
                            name="employee_surname"
                            value={formData.employee_surname || ''}
                            onChange={onChange}
                            placeholder="Введите фамилию"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: '500' }}>Отчество</label>
                        <input
                            type="text"
                            name="employee_fathername"
                            value={formData.employee_fathername || ''}
                            onChange={onChange}
                            placeholder="Введите отчество (необязательно)"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: '500' }}>Логин *</label>
                        <input
                            type="text"
                            name="employee_login"
                            value={formData.employee_login || ''}
                            onChange={onChange}
                            placeholder="Придумайте логин"
                            style={inputStyle}
                            required
                        />
                    </div>

                    {!isEdit && (
                        <div>
                            <label style={{ fontWeight: '500' }}>Пароль *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password || ''}
                                onChange={onChange}
                                placeholder="Придумайте пароль"
                                style={inputStyle}
                                required
                            />
                        </div>
                    )}

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
                            {loading ? 'Сохранение...' : (isEdit ? 'Обновить' : 'Создать')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;