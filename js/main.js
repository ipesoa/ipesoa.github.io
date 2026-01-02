let carteles = [];
let revistas = [];

// Elementos del DOM
const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkRevista = document.getElementById('link-revista');
const linkDina3 = document.getElementById('link-dina3');
const randomBtn = document.getElementById('random-btn');

// Función para actualizar el contenido
function mostrarCartelRandom() {
    if (carteles.length === 0) return;

    const random = carteles[Math.floor(Math.random() * carteles.length)];

    imgCartel.src = `carteles/${random.imagen}`;
    imgCartel.style.display = 'block';

    const revista = revistas.find(r => r.id === random.revista_id);
    if (revista) {
        linkRevista.textContent = revista.nombre || revista.id;
        linkRevista.href = `revista.html?id=${random.revista_id}`;
    } else {
        linkRevista.textContent = random.revista_id;
        linkRevista.href = '#';
    }

    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    hoverDiv.innerHTML = random.texto_index ? random.texto_index : '';
}

/* =========================================
   EVENTOS TÁCTILES (Móvil)
========================================= */

// Mostrar texto cuando toca
imgCartel.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const container = document.querySelector('.imagen-container');
    hoverDiv.classList.add('show-text');
    container.classList.add('show-text-active');
});

// Ocultar texto cuando levanta el dedo
imgCartel.addEventListener('touchend', (e) => {
    e.preventDefault();
    const container = document.querySelector('.imagen-container');
    hoverDiv.classList.remove('show-text');
    container.classList.remove('show-text-active');
});

// Si el toque se cancela
imgCartel.addEventListener('touchcancel', () => {
    const container = document.querySelector('.imagen-container');
    hoverDiv.classList.remove('show-text');
    container.classList.remove('show-text-active');
});

// Botón RANDOM
randomBtn.addEventListener('click', mostrarCartelRandom);

// Cargar JSON
fetch('data/carteles.json')
    .then(res => {
        if (!res.ok) {
            throw new Error("No se pudo cargar el JSON");
        }
        return res.json();
    })
    .then(data => {
        carteles = data.carteles;
        revistas = data.revistas;
        mostrarCartelRandom();
    })
    .catch(error => console.error('Error cargando datos:', error));
