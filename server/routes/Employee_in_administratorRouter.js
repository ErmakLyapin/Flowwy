const Router = require('express');
const router = new Router();
const employeeInAdministratorController = require('../controllers/Employee_in_administratorController');

router.get('/', employeeInAdministratorController.Get);
router.get('/administrator/:administrator_id', employeeInAdministratorController.GetByAdministrator);
router.get('/employee/:employee_id', employeeInAdministratorController.GetByEmployee);
router.get('/:administrator_id/:employee_id', employeeInAdministratorController.GetId);
router.post('/', employeeInAdministratorController.Post);
router.put('/:administrator_id/:employee_id', employeeInAdministratorController.Put);
router.delete('/:administrator_id/:employee_id', employeeInAdministratorController.Delet);

module.exports = router;