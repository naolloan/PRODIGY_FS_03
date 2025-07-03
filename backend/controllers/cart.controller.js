const Cart = require('../models/cart.model');

exports.addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  Cart.add(userId, productId, quantity || 1, (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Item added to cart' });
  });
};

exports.getUserCart = (req, res) => {
  const userId = req.user.id;

  Cart.getByUser(userId, (err, items) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(items);
  });
};

exports.updateCartItem = (req, res) => {
  const { cartItemId, quantity } = req.body;
  Cart.updateQuantity(cartItemId, quantity, (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Cart updated' });
  });
};

exports.deleteCartItem = (req, res) => {
  const { cartItemId } = req.params;

  Cart.deleteItem(cartItemId, (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Item removed' });
  });
};

exports.clearCart = (req, res) => {
  const userId = req.user.id;

  Cart.clearByUser(userId, (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Cart cleared' });
  });
};

