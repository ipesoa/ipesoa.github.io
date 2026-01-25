let revista = null;
const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkCompra = document.getElementById('link-compra');
const container = document.querySelector('.imagen-container');
let hoverActivo = false;

const urlParams = new URLSearchParams(window.location.search);
const revistaId = urlParams.get('id');

fetch('data/carteles.json')
    .then(res => res.json())
    .then(data => {
        revista = data.revistas.find(r => r.id === revistaId);
        if (revista) {
            imgCartel.src = `fanzines/${revista.imagen}`;
            hoverDiv.innerHTML = revista.descripcion || '';
            // Ahora lleva a pedido.html con el ID de la fanzine
            linkCompra.href = `pedido.html?id=${revistaId}&type=fanzine`;
        }
    })
    .catch(error => console.error('Error:', error));

/* =========================================
   EVENTOS TÁCTILES (Móvil)
========================================= */

// Mostrar texto cuando toca
imgCartel.addEventListener('touchstart', (e) => {
    e.preventDefault();
    hoverActivo = true;
    hoverDiv.classList.add('show-text');
    container.classList.add('show-text-active');
});

// Ocultar texto cuando levanta el dedo
imgCartel.addEventListener('touchend', (e) => {
    e.preventDefault();
    hoverActivo = false;
    hoverDiv.classList.remove('show-text');
    container.classList.remove('show-text-active');
});

// Si el toque se cancela
imgCartel.addEventListener('touchcancel', () => {
    hoverActivo = false;
    hoverDiv.classList.remove('show-text');
    container.classList.remove('show-text-active');
});

/* =========================================
   EVENTOS CLICK (Desktop)
========================================= */
imgCartel.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = !hoverActivo;
    hoverDiv.classList.toggle('show-text', hoverActivo);
    container.classList.toggle('show-text-active', hoverActivo);
});

hoverDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = false;
    hoverDiv.classList.remove('show-text');
    container.classList.remove('show-text-active');
});

document.addEventListener('click', () => {
    if (hoverActivo) {
        hoverActivo = false;
        hoverDiv.classList.remove('show-text');
        container.classList.remove('show-text-active');
    }
});
