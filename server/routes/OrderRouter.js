const Router = require('express')
const router = new Router()
const OrderController = require('../controllers/OrderController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

// ТЕСТОВЫЙ РОУТ
router.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Test OK', user: req.user });
});

router.get('/', authMiddleware, OrderController.Get)
router.get('/:id', authMiddleware, OrderController.GetId)
router.post('/', authMiddleware, OrderController.Post)
router.delete('/:id', authMiddleware, checkRole('admin'), OrderController.Delet)

module.exports = router