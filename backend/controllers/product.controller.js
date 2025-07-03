const { Product } = require('../models/product.model');

// Get all products (optionally filtered by category_id)
exports.getAllProducts = async (req, res) => {
  try {
    const categoryId = req.query.category_id;
    const whereClause = categoryId ? { category_id: categoryId } : {};

    const products = await Product.findAll({
      where: whereClause,
      order: [['id', 'DESC']]
    });

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};


// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !price || !category_id || !image_url) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await Product.create({ name, description, price, category_id, image_url });
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};


// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update({ name, description, price, category_id, image_url });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

exports.getByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findAll({
      where: { category_id: id },
      order: [['id', 'DESC']]
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products in this category' });
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching by category:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
