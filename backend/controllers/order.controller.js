const Order = require('../models/order.model');
const db = require('../config/db');

exports.checkout = (req, res) => {
  const userId = req.user.id;
  const { full_name, address, phone, notes } = req.body;

  // 1. Get cart items
  const getCartSql = `
    SELECT ci.*, p.price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `;
  db.query(getCartSql, [userId], (err, cartItems) => {
    if (err) return res.status(500).json({ error: 'Failed to get cart items' });
    if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 2. Insert into orders
    const insertOrderSql = `
      INSERT INTO orders (user_id, full_name, address, phone, notes, total_price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(insertOrderSql, [userId, full_name, address, phone, notes, totalPrice], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create order' });

      const orderId = result.insertId;

      // 3. Insert each item into order_items
      const orderItemsSql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ?
      `;
      const values = cartItems.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      db.query(orderItemsSql, [values], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save order items' });

        // 4. Clear the cart
        db.query('DELETE FROM cart_items WHERE user_id = ?', [userId], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to clear cart' });

          res.json({ message: 'Order placed successfully', orderId });
        });
      });
    });
  });
};

exports.getOrderHistory = (req, res) => {
  const userId = req.user.id;

  Order.getByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders' });

    // Group orders by order_id
    const grouped = {};
    results.forEach(row => {
      if (!grouped[row.order_id]) {
        grouped[row.order_id] = {
          created_at: row.created_at,
          status: row.status,
          items: [],
          total: 0
        };
      }
      grouped[row.order_id].items.push({
        name: row.name,
        quantity: row.quantity,
        price: row.price
      });
      grouped[row.order_id].total += row.quantity * row.price;
    });

    res.json(grouped);
  });
};

exports.getAllOrders = (req, res) => {
  Order.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders' });

    const grouped = {};
    results.forEach(row => {
      if (!grouped[row.order_id]) {
        grouped[row.order_id] = {
          created_at: row.created_at,
          customer_name: row.full_name || 'N/A',
          total_price: row.total_price,
          items: []
        };
      }
      grouped[row.order_id].items.push({
        name: row.name,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.json(grouped);
  });
};

exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update status' });
    res.json({ message: 'Status updated' });
  });
};
