// src/pages/Auth.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MAIN_ROUTE, LOGIN_ROUTE, REG_ROUTE } from '../utils/consts';
import NavBar from '../components/NavBar';
import { registrationAdmin, loginAdmin, loginEmployee } from '../http/userAPI';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
  const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const isLoginPage = location.pathname === LOGIN_ROUTE;
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('admin'); // 'admin' или 'employee'
    
    const [form, setForm] = useState({
        // Для регистрации (только логин и пароль)
        login: '',
        password: '',
        confirmPassword: '',
        // Для входа
        adminLogin: '',
        adminPassword: '',
        employeeLogin: '',
        employeePassword: ''
    });

    useEffect(() => {
        setForm({
            login: '',
            password: '',
            confirmPassword: '',
            adminLogin: '',
            adminPassword: '',
            employeeLogin: '',
            employeePassword: ''
        });
    }, [location.pathname, userRole]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Регистрация администратора (упрощенная)
    const handleRegister = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (loading) return;
        
        // Проверка совпадения паролей
        if (form.password !== form.confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        
        if (!form.login || !form.password) {
            alert('Заполните все обязательные поля!');
            return;
        }
        
        setLoading(true);
        
        try {
            const data = await registrationAdmin({
                administrator_login: form.login,
                password: form.password,
                administrator_name: 'Admin',  // временное значение
                administrator_surname: 'Admin',  // временное значение
                role: 'admin'
            });
            
            if (data && data.token) {
                login(data.token, 'admin', data.user.administrator_login, data.user.id);
                alert('Регистрация успешна!');
                navigate(MAIN_ROUTE);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.response?.data?.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    // Вход администратора
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (loading) return;
        
        if (!form.adminLogin || !form.adminPassword) {
            alert('Введите логин и пароль!');
            return;
        }
        
        setLoading(true);
        
        try {
            const data = await loginAdmin(form.adminLogin, form.adminPassword);
            
            if (data && data.token) {
                login(data.token, 'admin', data.user.administrator_login, data.user.id);
                navigate(MAIN_ROUTE);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    // Вход сотрудника
    const handleEmployeeLogin = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (loading) return;
        
        if (!form.employeeLogin || !form.employeePassword) {
            alert('Введите логин и пароль!');
            return;
        }
        
        setLoading(true);
        
        try {
            const data = await loginEmployee(form.employeeLogin, form.employeePassword);
            
            if (data && data.token) {
                login(data.token, 'employee', data.user.employee_login, data.user.id);
                navigate(MAIN_ROUTE);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        margin: '8px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '16px',
        transition: 'background-color 0.3s',
        opacity: loading ? 0.6 : 1
    };

    const roleButtonStyle = (isActive) => ({
        flex: 1,
        padding: '10px',
        backgroundColor: isActive ? '#2e7d32' : '#f0f0f0',
        color: isActive ? 'white' : '#333',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.3s'
    });

    return (
        <div>
            <NavBar />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 80px)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '20px'
                }}>
                    <h1 style={{
                        textAlign: 'center',
                        color: '#2e7d32',
                        marginBottom: '30px',
                        fontSize: '28px'
                    }}>
                        {isLoginPage ? 'Вход в систему' : 'Регистрация'}
                    </h1>

                    {isLoginPage ? (
                        // СТРАНИЦА ВХОДА - выбор роли
                        <>
                            {/* Кнопки выбора роли */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                <button
                                    type="button"
                                    onClick={() => setUserRole('admin')}
                                    style={roleButtonStyle(userRole === 'admin')}
                                >
                                    Администратор
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserRole('employee')}
                                    style={roleButtonStyle(userRole === 'employee')}
                                >
                                    Сотрудник
                                </button>
                            </div>

                            {/* Форма входа для Администратора */}
                            {userRole === 'admin' && (
                                <form onSubmit={handleAdminLogin}>
                                    <div>
                                        <label style={{ fontWeight: '500' }}>Логин</label>
                                        <input
                                            type="text"
                                            name="adminLogin"
                                            value={form.adminLogin}
                                            onChange={handleChange}
                                            placeholder="Введите логин"
                                            style={inputStyle}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontWeight: '500' }}>Пароль</label>
                                        <input
                                            type="password"
                                            name="adminPassword"
                                            value={form.adminPassword}
                                            onChange={handleChange}
                                            placeholder="Введите пароль"
                                            style={inputStyle}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        style={buttonStyle}
                                        disabled={loading}
                                    >
                                        {loading ? 'Загрузка...' : 'Войти как Администратор'}
                                    </button>
                                </form>
                            )}

                            {/* Форма входа для Сотрудника */}
                            {userRole === 'employee' && (
                                <form onSubmit={handleEmployeeLogin}>
                                    <div>
                                        <label style={{ fontWeight: '500' }}>Логин</label>
                                        <input
                                            type="text"
                                            name="employeeLogin"
                                            value={form.employeeLogin}
                                            onChange={handleChange}
                                            placeholder="Введите логин"
                                            style={inputStyle}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontWeight: '500' }}>Пароль</label>
                                        <input
                                            type="password"
                                            name="employeePassword"
                                            value={form.employeePassword}
                                            onChange={handleChange}
                                            placeholder="Введите пароль"
                                            style={inputStyle}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        style={buttonStyle}
                                        disabled={loading}
                                    >
                                        {loading ? 'Загрузка...' : 'Войти как Сотрудник'}
                                    </button>
                                </form>
                            )}

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(REG_ROUTE)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#2e7d32',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Нет аккаунта? Зарегистрироваться
                                </button>
                            </div>
                        </>
                    ) : (
                        // СТРАНИЦА РЕГИСТРАЦИИ (только для администратора)
                        <form onSubmit={handleRegister}>
                            <div>
                                <label style={{ fontWeight: '500' }}>Логин *</label>
                                <input
                                    type="text"
                                    name="login"
                                    value={form.login}
                                    onChange={handleChange}
                                    placeholder="Придумайте логин"
                                    style={inputStyle}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label style={{ fontWeight: '500' }}>Пароль *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Придумайте пароль"
                                    style={inputStyle}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label style={{ fontWeight: '500' }}>Подтверждение пароля *</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Повторите пароль"
                                    style={inputStyle}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button 
                                type="submit" 
                                style={buttonStyle}
                                disabled={loading}
                            >
                                {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(LOGIN_ROUTE)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#2e7d32',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Уже есть аккаунт? Войти
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;