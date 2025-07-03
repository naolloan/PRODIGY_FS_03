const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async (req, res) => {
  const { name, email, password, adminCode } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    try {
      const hashed = await bcrypt.hash(password, 10);
      const role = adminCode === process.env.ADMIN_CODE ? 'admin' : 'customer';

      const newUser = { name, email, password: hashed, role };

      User.create(newUser, (err, result) => {
        if (err) return res.status(500).json({ message: 'User creation failed' });
        res.status(201).json({ message: `User registered as ${role}` });
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role // 
      }
    });
  });
};