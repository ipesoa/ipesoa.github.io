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
    // Asegúrate de que la ruta 'carteles/' coincida con tu carpeta real
    imgCartel.src = `carteles/${random.imagen}`;
    imgCartel.style.display = 'block';

    // 2. Link a revista
    const revista = revistas.find(r => r.id === random.revista_id);
    if (revista) {
        linkRevista.textContent = revista.nombre || revista.id; // Usa ID si no hay nombre
        linkRevista.href = `revista.html?id=${random.revista_id}`;
    } else {
        linkRevista.textContent = random.revista_id;
        linkRevista.href = '#';
    }

    // 3. Link versión papel
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    // 4. Texto del Hover
    hoverDiv.innerHTML = random.texto_index ? random.texto_index.replace(/\n/g, "<br>") : '';
    
    // Resetear estados visuales
    hoverDiv.style.opacity = 0;
    hoverDiv.scrollTop = 0;
    hoverActivo = false;
}

/* =========================================
   EVENTOS (Definidos una sola vez)
========================================= */

// Desktop: Hover simple
imgCartel.addEventListener('mouseenter', () => {
    // Si no estamos en modo "click activado" (móvil), mostramos
    hoverDiv.style.opacity = 1;
});

imgCartel.addEventListener('mouseleave', () => {
    // Si no se ha activado por click, ocultamos al salir
    if (!hoverActivo) {
        hoverDiv.style.opacity = 0;
    }
});

// Móvil / Click: Alternar visibilidad
imgCartel.addEventListener('click', (e) => {
    // Evita conflictos si hay otros eventos
    e.stopPropagation(); 
    hoverActivo = !hoverActivo;
    hoverDiv.style.opacity = hoverActivo ? 1 : 0;
});

// Click en el texto para cerrar
hoverDiv.addEventListener('click', () => {
    hoverActivo = false;
    hoverDiv.style.opacity = 0;
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
