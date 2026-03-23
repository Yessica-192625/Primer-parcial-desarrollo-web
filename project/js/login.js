document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Validación con credenciales quemadas [cite: 36]
    if (user === "admin" && pass === "cafe123") {
        window.location.href = "index.html";
    } else {
        alert("Error: Usuario o contraseña incorrectos."); // [cite: 38]
    }
});