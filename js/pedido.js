let cartel = null;
let revistas = [];

// Elementos del DOM
const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkRevista = document.getElementById('link-revista');
const linkDina3 = document.getElementById('link-dina3');

// Variable para controlar el estado del hover en móvil
let hoverActivo = false;

// Obtener ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const cartelId = urlParams.get('id');

// Cargar datos
fetch('data/carteles.json')
    .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el JSON");
        return res.json();
    })
    .then(data => {
        cartel = data.carteles.find(c => c.id === cartelId);
        revistas = data.revistas;
        
        if (cartel) {
            mostrarCartel();
        } else {
            console.error('Cartel no encontrado:', cartelId);
        }
    })
    .catch(error => console.error('Error cargando datos:', error));

function mostrarCartel() {
    // 1. Imagen del cartel
    imgCartel.src = `carteles/${cartel.imagen}`;
    imgCartel.style.display = 'block';

    // 2. Link a revista
    const revista = revistas.find(r => r.id === cartel.revista_id);
    if (revista) {
        linkRevista.textContent = revista.nombre || revista.id;
        linkRevista.href = `revista.html?id=${cartel.revista_id}`;
    } else {
        linkRevista.textContent = cartel.revista_id;
        linkRevista.href = '#';
    }

    // 3. Link versión papel
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${cartel.id}`;

    // 4. Texto del Hover
    hoverDiv.innerHTML = cartel.texto_index ? cartel.texto_index : '';
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
