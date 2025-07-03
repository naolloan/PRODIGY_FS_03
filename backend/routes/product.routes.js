const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');
const { upload } = require('../middleware/upload.middleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/category/:id', productController.getByCategory);
router.get('/:id', productController.getProductById);

// Admin-only routes
router.post(
  '/',
  verifyToken,
  isAdmin,
  upload.single('image'), // ⬅️ handle file
  productController.createProduct
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.single('image'), // ⬅️ handle file
  productController.updateProduct
);

router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);


module.exports = router;
