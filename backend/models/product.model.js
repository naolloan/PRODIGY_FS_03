const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  image_url: DataTypes.STRING,
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = { Product };
