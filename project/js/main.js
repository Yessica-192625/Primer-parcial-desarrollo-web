// CARGAR COMPONENTES
async function loadComponent(id, file){
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

loadComponent("header","components/header.html");
loadComponent("sidebar","components/sidebar.html");
loadComponent("footer","components/footer.html");


// WEB COMPONENT
class ProductCard extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback(){
        const nombre = this.getAttribute("nombre");
        const precio = this.getAttribute("precio");
        const descripcion = this.getAttribute("descripcion");
        const imagen = this.getAttribute("imagen");

        this.shadowRoot.innerHTML = `
        <style>
        .card{
            border:1px solid #ccc;
            padding:10px;
            border-radius:10px;
        }
        img{ width:100%; }
        </style>

        <div class="card">
            <img src="${imagen}">
            <h3>${nombre}</h3>
            <p>${descripcion}</p>
            <strong>${precio}</strong>
        </div>
        `;
    }
}
customElements.define("product-card", ProductCard);


// USO DE TEMPLATE + FETCH
async function loadProducts(){
    const res = await fetch("data/productos.json");
    const data = await res.json();

    const container = document.getElementById("products");
    const template = document.getElementById("product-template");

    data.forEach(p => {

        // TEMPLATE
        const clone = template.content.cloneNode(true);

        clone.querySelector(".img").src = p.imagen;
        clone.querySelector(".name").textContent = p.nombre;
        clone.querySelector(".desc").textContent = p.descripcion;
        clone.querySelector(".price").textContent = p.precio;

        container.appendChild(clone);

        // WEB COMPONENT (también obligatorio)
        const comp = document.createElement("product-card");

        comp.setAttribute("nombre", p.nombre);
        comp.setAttribute("precio", p.precio);
        comp.setAttribute("descripcion", p.descripcion);
        comp.setAttribute("imagen", p.imagen);

        container.appendChild(comp);
    });
}

loadProducts();