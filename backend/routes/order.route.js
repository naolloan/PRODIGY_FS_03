const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/checkout', verifyToken, orderController.checkout);
router.get('/history', verifyToken, orderController.getOrderHistory);
router.get('/all', verifyToken, orderController.getAllOrders);
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);


module.exports = router;
