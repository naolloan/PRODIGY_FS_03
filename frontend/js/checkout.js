const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const summary = document.getElementById('order-summary');

if (!token || !user) {
  summary.innerHTML = '<p>Please login to checkout.</p>';
} else {
  fetch('http://localhost:5000/api/cart/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(cart => {
      if (!cart.length) {
        summary.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }

      summary.innerHTML = `
      <div class="checkout-items">
        ${cart.map(item => `
          <div class="checkout-item">
            <h3>${item.name}</h3>
            <p>Qty: ${item.quantity} x $${item.price} = $${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        `).join('')}
      </div>
      <h2>Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h2>
      <div id="success-message" style="color: green; margin-top: 20px;"></div>
      `;

      document.getElementById('full_name').value = user.name || '';
    });
}

document.getElementById('checkout-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const full_name = document.getElementById('full_name').value.trim();
  const address = document.getElementById('address').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const notes = document.getElementById('notes').value.trim();

  fetch('http://localhost:5000/api/orders/checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ full_name, address, phone, notes })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        document.getElementById('success-message').textContent = "✅ Order placed successfully!";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        alert("Order failed.");
      }
    })
    .catch(err => {
      console.error('Checkout failed', err);
      alert("Order failed.");
    });
});
