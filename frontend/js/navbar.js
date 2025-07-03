fetch('components/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar-container').innerHTML = html;

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const navSection = document.getElementById('nav-user-section');

    if (!navSection) return;

    if (token && user) {
      if (user.role === 'admin') {
        navSection.innerHTML = `
          <span style="color:white;">Hello, <strong>${user.name}</strong></span>
          <a href="admin.html" style="color:white;">🛠️ Admin Panel</a>
          <a href="orders.html" style="color:white;">📦 View Orders</a>
          <a href="#" onclick="logout()" style="color:white;">🚪 Logout</a>
        `;
      } else {
        // 👤 Normal user sees Home & Cart
        navSection.innerHTML = `
          <span style="color:white;">Hello, <strong>${user.name}</strong></span>
          <a href="index.html" style="color:white;">🏠 Home</a>
          <a href="cart.html" style="color:white;">🛒 Cart</a>
          <a href="order_history.html" style="color:white;">📜 Order History</a>
          <a href="#" onclick="logout()" style="color:white;">🚪 Logout</a>
        `;
      }
    } else {
      // 🚪 Guest (not logged in)
      const currentPage = window.location.pathname;
      const showHome =
        !currentPage.includes('login.html') &&
        !currentPage.includes('register.html');

      navSection.innerHTML = `
        ${showHome ? `<a href="index.html" style="color:white;">🏠 Home</a>` : ''}
        <a href="login.html" style="color:white;">Login</a>
        <a href="register.html" style="color:white;">Register</a>
      `;
    }
  })
  .catch(err => console.error('Navbar load failed:', err));

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('Logged out successfully!');
  window.location.href = 'login.html';
}
