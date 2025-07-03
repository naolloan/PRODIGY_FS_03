const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [user.name, user.email, user.password, user.role], callback);
  },
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  }
};

module.exports = User;
