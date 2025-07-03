const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.route');
const categoryRoutes = require('./routes/category.route');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
