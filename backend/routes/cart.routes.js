const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/add', verifyToken, cartController.addToCart);
router.get('/', verifyToken, cartController.getUserCart);
router.put('/update', verifyToken, cartController.updateCartItem);
router.delete('/:cartItemId', verifyToken, cartController.deleteCartItem);
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;
