const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const container = document.getElementById('admin-orders');

if (!token || user.role !== 'admin') {
  container.innerHTML = "<p>Access denied. Admins only.</p>";
} else {
  fetch('http://localhost:5000/api/orders/all', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (!Object.keys(data).length) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
      }

      container.innerHTML = Object.entries(data).map(([orderId, order]) => `
        <div class="order-block">
          <h3>Order #${orderId}</h3>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Placed at:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Total:</strong> $${parseFloat(order.total_price).toFixed(2)}</p>

          <p><strong>Status:</strong>
            <select id="status-${orderId}">
              <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
            <button onclick="updateStatus(${orderId})">Save</button>
          </p>

          <ul>
            ${order.items.map(item => `
              <li>${item.name} - ${item.quantity} × $${item.price}</li>
            `).join('')}
          </ul>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error("Error loading orders:", err);
      container.innerHTML = '<p>Failed to load orders.</p>';
    });
}

function updateStatus(orderId) {
  const newStatus = document.getElementById(`status-${orderId}`).value;

  fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus })
  })
    .then(res => res.json())
    .then(data => {
      alert('✅ Status updated!');
    })
    .catch(err => {
      console.error("Error updating status:", err);
      alert('❌ Failed to update status.');
    });
}
