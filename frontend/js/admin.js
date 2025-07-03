const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user || user.role !== 'admin') {
  alert("Access denied.");
  window.location.href = 'index.html';
}

let allProducts = []; // Store all products for searching
const container = document.getElementById('admin-products');
const searchInput = document.getElementById('admin-search');
const categoryDropdown = document.getElementById('admin-category-filter');

function loadProducts(categoryId = '') {
  let url = 'http://localhost:5000/api/products';
  if (categoryId) {
    url += `?category_id=${categoryId}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      displayProducts(products);
    });
}

function displayProducts(products) {
  if (!products.length) {
    container.innerHTML = '<p>No products found in this category.</p>';
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="http://localhost:5000${p.image_url}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>$${Number(p.price).toFixed(2)}</strong>
      <button onclick='editProduct(${JSON.stringify(p)})'>✏️ Edit</button>
      <button onclick='deleteProduct(${p.id})'>🗑️ Delete</button>
    </div>
  `).join('');
}

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryDropdown.value;

  let filtered = [...allProducts];

  if (selectedCategory) {
    filtered = filtered.filter(p => String(p.category_id) === selectedCategory);
  }

  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  displayProducts(filtered);
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;

  fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadProducts();
    });
}

function showAddProductForm(product = null) {
  const formContainer = document.getElementById('product-form');
  formContainer.style.display = 'block';
  formContainer.innerHTML = `
    <h4>${product ? 'Edit' : 'Add'} Product</h4>
    <form id="productForm">
      <input name="name" placeholder="Name" value="${product?.name || ''}" required />
      <input name="description" placeholder="Description" value="${product?.description || ''}" />
      <input type="number" step="0.01" name="price" placeholder="Price" value="${product?.price || ''}" required />
      <select name="category_id" id="category-dropdown" required>
        <option value="">Select Category</option>
      </select>
      <input type="file" name="image" accept="image/*" ${product ? '' : 'required'} />
      ${product ? `<input type="hidden" name="oldImage" value="${product.image_url}" />` : ''}
      <button type="submit">${product ? 'Update' : 'Add'}</button>
    </form>
  `;

  fetch('http://localhost:5000/api/categories')
    .then(res => res.json())
    .then(categories => {
      const dropdown = document.getElementById('category-dropdown');
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        if (product && product.category_id === cat.id) {
          option.selected = true;
        }
        dropdown.appendChild(option);
      });
    });

  document.getElementById('productForm').onsubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const url = product
      ? `http://localhost:5000/api/products/${product.id}`
      : 'http://localhost:5000/api/products';

    fetch(url, {
      method: product ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        alert(`Product ${product ? 'updated' : 'added'}!`);
        formContainer.style.display = 'none';
        loadProducts();
      });
  };
}

function editProduct(product) {
  showAddProductForm(product);
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/api/categories')
    .then(res => res.json())
    .then(categories => {
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categoryDropdown.appendChild(option);
      });
    });

  searchInput.addEventListener('input', filterProducts);
  categoryDropdown.addEventListener('change', filterProducts);

  loadProducts(); // Load initial product list
});
