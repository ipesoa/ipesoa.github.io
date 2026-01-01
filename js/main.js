let carteles = [];
let revistas = [];

// Elementos del DOM
const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkRevista = document.getElementById('link-revista');
const linkDina3 = document.getElementById('link-dina3');
const randomBtn = document.getElementById('random-btn');

// Variable para controlar el estado del hover en móvil
let hoverActivo = false;

// Función para actualizar el contenido (solo datos, no eventos)
function mostrarCartelRandom() {
    if (carteles.length === 0) return;

    const random = carteles[Math.floor(Math.random() * carteles.length)];

    // 1. Imagen del cartel
    imgCartel.src = `carteles/${random.imagen}`;
    imgCartel.style.display = 'block';

    // 2. Link a revista
    const revista = revistas.find(r => r.id === random.revista_id);
    if (revista) {
        linkRevista.textContent = revista.nombre || revista.id;
        linkRevista.href = `revista.html?id=${random.revista_id}`;
    } else {
        linkRevista.textContent = random.revista_id;
        linkRevista.href = '#';
    }

    // 3. Link versión papel
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    // 4. Texto del Hover
    hoverDiv.innerHTML = random.texto_index ? random.texto_index : '';
}

/* =========================================
   EVENTOS (Definidos una sola vez)
========================================= */

// Móvil / Touch: Alternar visibilidad con tap
imgCartel.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = !hoverActivo;
    if (hoverActivo) {
        hoverDiv.classList.add('show-text');
    } else {
        hoverDiv.classList.remove('show-text');
    }
});

// Click en el texto para cerrar
hoverDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = false;
    hoverDiv.classList.remove('show-text');
});

// Click fuera para cerrar en móvil
document.addEventListener('click', () => {
    if (hoverActivo) {
        hoverActivo = false;
        hoverDiv.classList.remove('show-text');
    }
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
