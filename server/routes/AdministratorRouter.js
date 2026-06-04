const Router = require('express');
const router = new Router();
const administratorController = require('../controllers/AdministratorController');

// Публичные маршруты
router.post('/reg', administratorController.reg);      // регистрация
router.post('/login', administratorController.login);  // логин

// CRUD операции
router.get('/', administratorController.Get);
router.get('/:id', administratorController.GetId);
router.put('/:id', administratorController.Put);
router.delete('/:id', administratorController.Delet);

// Проверка токена (если нужна)
router.get('/auth/check', administratorController.check);

module.exports = router;