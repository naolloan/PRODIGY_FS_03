const token = localStorage.getItem('token');
if (!token) {
  alert("Please login to view order history.");
  window.location.href = "login.html";
}

fetch('http://localhost:5000/api/orders/history', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('order-list');
    if (Object.keys(data).length === 0) {
      container.innerHTML = "<p>No previous orders.</p>";
      return;
    }

    for (const orderId in data) {
      const order = data[orderId];
      const itemsHtml = order.items.map(item => `
        <li>${item.name} — ${item.quantity} × $${item.price} = $${(item.quantity * item.price).toFixed(2)}</li>
      `).join('');

      container.innerHTML += `
        <div class="order-card">
          <p><strong>Status:</strong> <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></p>
          <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          <ul>${itemsHtml}</ul>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
      `;
    }
  })
  .catch(err => {
    console.error("Error fetching order history:", err);
    alert("Failed to load orders.");
  });
