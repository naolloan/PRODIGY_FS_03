document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  // Save token and role
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('userRole', data.user.role);
  console.log('Saving role:', data.user.role);

  // Redirect based on role
  if (data.user.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'index.html';
  }
});
