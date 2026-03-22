const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if(user === "admin" && pass === "1234"){
        window.location.href = "index.html";
    }else{
        document.getElementById("error").textContent = "Credenciales incorrectas";
    }
});