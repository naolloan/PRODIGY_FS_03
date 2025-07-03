const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const container = document.getElementById('cart-items');
const totalElement = document.getElementById('total-price');

if (!token || !user) {
  container.innerHTML = '<p>Please <a href="login.html">login</a> to view your cart.</p>';
} else {
  fetch('http://localhost:5000/api/cart/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(cart => {
      if (!cart.length) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalElement.textContent = '';
        return;
      }

      container.innerHTML = cart.map((item, index) => `
        <div class="product-card">
          <img src="http://localhost:5000${item.image_url}" alt="${item.name}" />
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${item.cartItemId}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.cartItemId}, ${item.quantity + 1})">+</button>
          </div>
          <button onclick="removeItem(${item.cartItemId})">Remove</button>
        </div>
      `).join('');


      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
    })
    .catch(err => {
      console.error('Error loading cart:', err);
      container.innerHTML = '<p>Failed to load cart.</p>';
    });
}

function removeItem(cartItemId) {
  fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      alert('Item removed from cart');
      location.reload();
    })
    .catch(err => {
      console.error('Error removing item:', err);
      alert('Failed to remove item.');
    });
}

function updateQuantity(cartItemId, quantity) {
  if (quantity < 1) return;
  fetch('http://localhost:5000/api/cart/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      cartItemId,
      quantity: parseInt(quantity)
    })
  })
    .then(res => res.json())
    .then(data => {
      alert('Quantity updated!');
      location.reload();
    })
    .catch(err => {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity.');
    });
}

function goToCheckout() {
  window.location.href = 'checkout.html';
}
