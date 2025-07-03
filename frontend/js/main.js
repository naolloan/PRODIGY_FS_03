document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-list');
  const categoryDropdown = document.getElementById('category-filter');
  const searchInput = document.getElementById('product-search');

  // Store all products for filtering
  let allProducts = [];

  function loadProducts(categoryId = '') {
    let url = 'http://localhost:5000/api/products';
    if (categoryId) url += `?category_id=${categoryId}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(products => {
        const container = document.getElementById('product-list');
        console.log('Products:', products);

        if (!products.length) {
          container.innerHTML = '<p style="text-align:center; color: red;">No products in this category.</p>';
          return;
        }

        container.innerHTML = products.map(p => `
          <div class="product-card">
            <img src="http://localhost:5000${p.image_url}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <strong>$${Number(p.price).toFixed(2)}</strong>
            <button onclick='addToCart(${JSON.stringify(p).replace(/'/g, "\\'")})'>Add to Cart</button>
          </div>
        `).join('');
      })
      .catch(err => {
        const container = document.getElementById('product-list');
        container.innerHTML = '<p style="text-align:center; color: red;">Failed to load products.</p>';
        console.error('Error fetching products:', err);
      });
  }

  function loadProducts(categoryId = '') {
    let url = 'http://localhost:5000/api/products';
    if (categoryId) url += `?category_id=${categoryId}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(products => {
        // ✅ Set the global product list for search
        allProducts = products;

        // 🔁 Trigger display
        filterAndDisplayProducts();
      })
      .catch(err => {
        container.innerHTML = '<p style="text-align:center; color: red;">Failed to load products.</p>';
        console.error('Error fetching products:', err);
      });
  }

  // Filter by search and display
  function filterAndDisplayProducts() {
    const keyword = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(keyword)
    );

    if (!filtered.length) {
      container.innerHTML = '<p style="text-align:center; color: red;">No products match your search.</p>';
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div class="product-card">
        <img src="http://localhost:5000${p.image_url}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <strong>$${Number(p.price).toFixed(2)}</strong>
        <button onclick='addToCart(${JSON.stringify(p).replace(/'/g, "\\'")})'>Add to Cart</button>
      </div>
    `).join('');
  }

  // Event: Search input
  searchInput.addEventListener('input', filterAndDisplayProducts);

  function loadCategories() {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(categories => {
        categoryDropdown.innerHTML = `<option value="">All Categories</option>`;
        categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.name;
          categoryDropdown.appendChild(option);
        });
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
      });
  }

  categoryDropdown.addEventListener('change', () => {
    const selectedCategory = categoryDropdown.value;
    loadProducts(selectedCategory);
  });

  loadCategories();
  loadProducts();
});

function addToCart(product) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Please login first.");
    return window.location.href = "login.html";
  }

  fetch('http://localhost:5000/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productId: product.id,
      quantity: 1
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(`${product.name} added to cart!`);
  })
  .catch(err => {
    console.error("Error adding to cart:", err);
    alert("Failed to add item to cart.");
  });
}
