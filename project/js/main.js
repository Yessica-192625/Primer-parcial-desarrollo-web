// 1. WEB COMPONENT PERSONALIZADO con Efectos de Imagen
class CafeItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .wc-card { 
                    border: 1px solid #e0e0e0; 
                    border-left: 6px solid #6f4e37; 
                    padding: 1rem; 
                    border-radius: 12px; 
                    background: #ffffff; 
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    margin-bottom: 15px;
                }
                .wc-card:hover { 
                    transform: translateX(10px); 
                    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
                }
                .img-box {
                    width: 80px; height: 80px;
                    border-radius: 10px;
                    overflow: hidden;
                }
                img { 
                    width: 100%; height: 100%; 
                    object-fit: cover; 
                    transition: transform 0.3s ease;
                }
                .wc-card:hover img { transform: scale(1.1); }
                .info { display: flex; flex-direction: column; }
                h4 { color: #3d2b1f; margin: 0; font-size: 1.2rem; font-family: 'Playfair Display', serif; }
                p { margin: 4px 0; font-size: 0.9rem; color: #555; }
                strong { color: #6f4e37; font-size: 1.1rem; }
            </style>
            <div class="wc-card">
                <div class="img-box">
                    <img src="${this.getAttribute('imagen') || ''}" alt="Producto">
                </div>
                <div class="info">
                    <h4>${this.getAttribute('nombre')}</h4>
                    <p>${this.getAttribute('descripcion')}</p>
                    <strong>$${this.getAttribute('precio')}</strong>
                </div>
            </div>`;
    }
}
customElements.define('producto-cafe', CafeItem);

async function loadComponent(id, path) {
    const res = await fetch(path);
    const text = await res.text();
    document.getElementById(id).innerHTML = text;
}

async function init() {
    try {
        await loadComponent('header-container', 'components/header.html');
        await loadComponent('sidebar-container', 'components/sidebar.html');
        
        const res = await fetch('data/productos.json');
        const data = await res.json();
        
        renderProducts(data);
        setupInteractivity();
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderProducts(data) {
    const drinksContainer = document.getElementById('drinks-container');
    const foodContainer = document.getElementById('food-container');
    const template = document.getElementById('product-template');
    const wcContainer = document.getElementById('web-component-container');

    data.forEach(item => {
        if (item.categoria === "bebida" || item.categoria === "alimento") {
            const clone = template.content.cloneNode(true);
            const img = document.createElement('img');
            img.src = item.imagen;
            clone.querySelector('.product-img-container').appendChild(img);
            clone.querySelector('.p-name').textContent = item.nombre;
            clone.querySelector('.p-desc').textContent = item.descripcion;
            clone.querySelector('.p-price').textContent = `$${item.precio}`;
            
            if (item.categoria === "bebida") drinksContainer.appendChild(clone);
            else foodContainer.appendChild(clone);
        }

        if (item.categoria === "recomendado") {
            const wc = document.createElement('producto-cafe');
            wc.setAttribute('nombre', item.nombre);
            wc.setAttribute('precio', item.precio);
            wc.setAttribute('descripcion', item.descripcion);
            wc.setAttribute('imagen', item.imagen);
            wcContainer.appendChild(wc);
        }
    });
}

function setupInteractivity() {
    const checkExist = setInterval(() => {
        const menuBtn = document.getElementById('menu-toggle'); 
        const sidebar = document.getElementById('sidebar-menu');

        if (menuBtn && sidebar) {
            clearInterval(checkExist);
            menuBtn.onclick = () => sidebar.classList.toggle('active');

            const filter = (showD, showF, showV) => {
                document.getElementById('drinks-section').style.display = showD ? 'block' : 'none';
                document.getElementById('food-section').style.display = showF ? 'block' : 'none';
                document.querySelector('.destacados-section').style.display = showV ? 'block' : 'none';
                sidebar.classList.remove('active');
            };

            document.getElementById('btn-todo')?.addEventListener('click', (e) => { e.preventDefault(); filter(true, true, true); });
            document.getElementById('btn-bebidas')?.addEventListener('click', (e) => { e.preventDefault(); filter(true, false, false); });
            document.getElementById('btn-alimentos')?.addEventListener('click', (e) => { e.preventDefault(); filter(false, true, false); });
            document.getElementById('btn-vendidos')?.addEventListener('click', (e) => { e.preventDefault(); filter(false, false, true); });
        }
    }, 100);
}

init();