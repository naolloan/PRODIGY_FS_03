const db = require('../config/db');

const Order = {
  createFromCart: (userId, cartItems, callback) => {
    const sqlOrder = 'INSERT INTO orders (user_id, created_at) VALUES (?, NOW())';

    db.query(sqlOrder, [userId], (err, result) => {
      if (err) return callback(err);

      const orderId = result.insertId;
      const values = cartItems.map(item => [orderId, item.product_id, item.quantity, item.price]);

      const sqlItems = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';

      db.query(sqlItems, [values], callback);
    });
  },

  getByUser: (userId, callback) => {
    const sql = `
      SELECT o.id AS order_id, o.created_at, o.status, 
            p.name, oi.quantity, oi.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    db.query(sql, [userId], callback);
  },

  getAll: (callback) => {
    const sql = `
      SELECT o.id AS order_id, o.created_at, o.full_name, o.total_price,
            p.name, oi.quantity, oi.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      ORDER BY o.created_at DESC
    `;
    db.query(sql, callback);
  }
};

module.exports = Order;
