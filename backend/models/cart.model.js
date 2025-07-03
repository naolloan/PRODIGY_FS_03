const db = require('../config/db');

const CartItem = {
  add: (userId, productId, quantity, callback) => {
    const checkSql = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
    db.query(checkSql, [userId, productId], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        const updateSql = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
        db.query(updateSql, [quantity, userId, productId], callback);
      } else {
        const insertSql = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
        db.query(insertSql, [userId, productId, quantity], callback);
      }
    });
  },

  getByUser: (userId, callback) => {
    const sql = `
      SELECT c.id AS cartItemId, p.name, p.price, p.image_url, c.quantity
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
    db.query(sql, [userId], callback);
  },

  updateQuantity: (cartItemId, quantity, callback) => {
    const sql = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
    db.query(sql, [quantity, cartItemId], callback);
  },

  deleteItem: (cartItemId, callback) => {
    const sql = 'DELETE FROM cart_items WHERE id = ?';
    db.query(sql, [cartItemId], callback);
  },

  clearByUser: (userId, callback) => {
    const sql = 'DELETE FROM cart_items WHERE user_id = ?';
    db.query(sql, [userId], callback);
  }
};

module.exports = CartItem;
