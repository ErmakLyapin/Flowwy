// src/pages/Employees.js
import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import EmployeesTable from '../components/EmployeesTable';
import EmployeeModal from '../components/EmployeeModal';
import AssignShopModal from '../components/AssignShopModal';
import ResetPasswordModal from '../components/ResetPasswordModal';  // ← добавить
import EmployeeShopsModal from '../components/EmployeeShopModal';  // ← добавить
import { AuthContext } from '../context/AuthContext';
import { 
    getAdminEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    addEmployeeToAdministrator,
    addEmployeeToShop,
    getEmployeeShops,
    resetEmployeePassword  // ← добавить
} from '../http/employeeAPI';
import { getAllShops } from '../http/shopAPI';

const Employees = () => {
    const { userId } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);  // ← добавить
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployeeForReset, setSelectedEmployeeForReset] = useState(null);  // ← добавить
    const [selectedShopId, setSelectedShopId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);  // ← добавить
    const [showShopsModal, setShowShopsModal] = useState(false);
    const [selectedEmployeeShops, setSelectedEmployeeShops] = useState([]);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
    const [formData, setFormData] = useState({
        employee_name: '',
        employee_surname: '',
        employee_fathername: '',
        employee_login: '',
        password: ''
    });

    useEffect(() => {
        loadEmployees();
        loadShops();
    }, []);

    const handleResetPassword = (employee) => {
        setSelectedEmployeeForReset(employee);
        setShowResetModal(true);
    };

    const handleResetSubmit = async (newPassword) => {
        setResetLoading(true);
        try {
            await resetEmployeePassword(selectedEmployeeForReset.id, newPassword);
            alert('Пароль успешно изменён!');
            setShowResetModal(false);
            setSelectedEmployeeForReset(null);
        } catch (error) {
            console.error('Ошибка сброса пароля:', error);
            alert(error.response?.data?.message || 'Ошибка сброса пароля');
        } finally {
            setResetLoading(false);
        }
    };


    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await getAdminEmployees();
            // Загружаем магазины для каждого сотрудника
            const employeesWithShops = await Promise.all(
                data.map(async (item) => {
                    const employee = item.employee || item;
                    const shopsData = await getEmployeeShops(employee.id);
                    employee.shops = shopsData.map(s => s.shop);
                    return item;
                })
            );
            setEmployees(employeesWithShops);
        } catch (error) {
            console.error('Ошибка загрузки сотрудников:', error);
            alert('Ошибка загрузки сотрудников');
        } finally {
            setLoading(false);
        }
    };

    const handleViewShops = async (employee) => {
        try {
            const shopsData = await getEmployeeShops(employee.id);
            const shops = shopsData.map(s => s.shop).filter(s => s);
            setSelectedEmployeeShops(shops);
            setSelectedEmployeeName(`${employee.employee_name} ${employee.employee_surname}`);
            setShowShopsModal(true);
        } catch (error) {
            console.error('Ошибка загрузки магазинов:', error);
            alert('Ошибка загрузки магазинов сотрудника');
        }
    };

    const loadShops = async () => {
        try {
            const data = await getAllShops();
            setShops(data);
        } catch (error) {
            console.error('Ошибка загрузки магазинов:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.employee_name || !formData.employee_surname || !formData.employee_login) {
            alert('Заполните все обязательные поля!');
            return;
        }
        
        if (!isEdit && !formData.password) {
            alert('Введите пароль!');
            return;
        }
        
        setLoading(true);
        try {
            let employee;
            
            if (isEdit) {
                // Обновляем сотрудника
                const updateData = {
                    employee_name: formData.employee_name,
                    employee_surname: formData.employee_surname,
                    employee_fathername: formData.employee_fathername || null,
                    employee_login: formData.employee_login,
                };
                employee = await updateEmployee(selectedEmployee.id, updateData);
                alert('Сотрудник обновлён!');
            } else {
                // Создаем сотрудника
                employee = await createEmployee({
                    employee_name: formData.employee_name,
                    employee_surname: formData.employee_surname,
                    employee_fathername: formData.employee_fathername || null,
                    employee_login: formData.employee_login,
                    password: formData.password,
                    role: formData.role
                });
                
                // Привязываем сотрудника к администратору
                await addEmployeeToAdministrator(userId, employee.id);
                alert('Сотрудник добавлен!');
            }
            
            setShowModal(false);
            setFormData({
                employee_name: '',
                employee_surname: '',
                employee_fathername: '',
                employee_login: '',
                password: '',
                role: 'seller'
            });
            loadEmployees();
        } catch (error) {
            console.error('Ошибка сохранения сотрудника:', error);
            alert(error.response?.data?.message || 'Ошибка сохранения сотрудника');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setFormData({
            employee_name: employee.employee_name || '',
            employee_surname: employee.employee_surname || '',
            employee_fathername: employee.employee_fathername || '',
            employee_login: employee.employee_login,
            password: '',
            role: employee.role || 'seller'
        });
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            try {
                await deleteEmployee(id);
                alert('Сотрудник удалён');
                loadEmployees();
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Ошибка удаления сотрудника');
            }
        }
    };

    const handleAssignShop = (employee) => {
        setSelectedEmployee(employee);
        setSelectedShopId('');
        setShowAssignModal(true);
    };

    const handleAssign = async (employeeId, shopId) => {
        if (!shopId) {
            alert('Выберите магазин!');
            return;
        }
        
        setLoading(true);
        try {
            await addEmployeeToShop(employeeId, shopId);
            alert('Сотрудник привязан к магазину!');
            setShowAssignModal(false);
            loadEmployees();
        } catch (error) {
            console.error('Ошибка привязки:', error);
            alert(error.response?.data?.message || 'Ошибка привязки сотрудника к магазину');
        } finally {
            setLoading(false);
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
                        👥 Управление сотрудниками
                    </h1>
                    <button
                        onClick={() => {
                            setIsEdit(false);
                            setFormData({
                                employee_name: '',
                                employee_surname: '',
                                employee_fathername: '',
                                employee_login: '',
                                password: ''
                            });
                            setShowModal(true);
                        }}
                        style={buttonStyle}
                    >
                        + Добавить сотрудника
                    </button>
                </div>

                <EmployeesTable 
                    employees={employees}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAssignShop={handleAssignShop}
                    onResetPassword={handleResetPassword}
                    onViewShops={handleViewShops}  // ← добавить
                />
                
            </div>

            <EmployeeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                formData={formData}
                onChange={handleChange}
                loading={loading}
                isEdit={isEdit}
            />

            <AssignShopModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                onAssign={handleAssign}
                shops={shops}
                employeeName={selectedEmployee ? `${selectedEmployee.employee_name} ${selectedEmployee.employee_surname}` : ''}
                employeeId={selectedEmployee?.id}
                selectedShopId={selectedShopId}
                setSelectedShopId={setSelectedShopId}
                loading={loading}
            />
             <ResetPasswordModal
                isOpen={showResetModal}
                onClose={() => {
                    setShowResetModal(false);
                    setSelectedEmployeeForReset(null);
                }}
                onSubmit={handleResetSubmit}
                employeeName={selectedEmployeeForReset ? `${selectedEmployeeForReset.employee_name} ${selectedEmployeeForReset.employee_surname}` : ''}
                loading={resetLoading}
            />
            <EmployeeShopsModal
                isOpen={showShopsModal}
                onClose={() => {
                    setShowShopsModal(false);
                    setSelectedEmployeeShops([]);
                    setSelectedEmployeeName('');
                }}
                employeeName={selectedEmployeeName}
                shops={selectedEmployeeShops}
            />
            
        </div>
        
    );
};

export default Employees;