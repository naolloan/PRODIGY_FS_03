document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const adminCode = document.getElementById('adminCode').value;

  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, adminCode })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);
  alert(data.message);

  window.location.href = 'login.html';
});
