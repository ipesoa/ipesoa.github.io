let carteles = [];
let revistas = [];

const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkRevista = document.getElementById('link-revista');
const linkDina3 = document.getElementById('link-dina3');
const randomBtn = document.getElementById('random-btn');

function mostrarCartelRandom() {
    const random = carteles[Math.floor(Math.random() * carteles.length)];

    // Imagen del cartel
    imgCartel.src = `carteles/${random.imagen}`;
    imgCartel.style.display = 'block';

    // Link a revista
    const revista = revistas.find(r => r.id === random.revista_id);
    linkRevista.textContent = revista ? (revista.nombre || revista.id) : random.revista_id;
    linkRevista.href = `revista.html?id=${random.revista_id}`;

    // Link versión papel
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    // Preparar hoverDiv
    hoverDiv.textContent = random.texto_index || '';
    hoverDiv.style.position = 'absolute';
    hoverDiv.style.top = 0;
    hoverDiv.style.left = 0;
    hoverDiv.style.width = '100%';
    hoverDiv.style.height = '100%';
    hoverDiv.style.display = 'flex';
    hoverDiv.style.alignItems = 'center';
    hoverDiv.style.justifyContent = 'center';
    hoverDiv.style.textAlign = 'center';
    hoverDiv.style.padding = '1em';
    hoverDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
    hoverDiv.style.color = '#fff';
    hoverDiv.style.transition = 'opacity 0.3s ease';
    hoverDiv.style.opacity = 0;
    hoverDiv.style.pointerEvents = 'none'; // importante para que mouse pase a imgCartel

    // Eliminar eventos previos
    imgCartel.onmouseenter = null;
    imgCartel.onmouseleave = null;
    imgCartel.onclick = null;
    hoverDiv.onclick = null;

    let hoverActivo = false;

    // Desktop: hover
    imgCartel.addEventListener('mouseenter', () => {
        hoverDiv.style.opacity = 1;
        hoverActivo = true;
    });
    imgCartel.addEventListener('mouseleave', () => {
        hoverDiv.style.opacity = 0;
        hoverActivo = false;
    });

    // Móvil: click
    imgCartel.addEventListener('click', () => {
        hoverActivo = !hoverActivo;
        hoverDiv.style.opacity = hoverActivo ? 1 : 0;
    });
    hoverDiv.addEventListener('click', () => {
        hoverActivo = false;
        hoverDiv.style.opacity = 0;
    });
}

// Cargar JSON
fetch('data/carteles.json')
    .then(res => res.json())
    .then(data => {
        carteles = data.carteles;
        revistas = data.revistas;
        mostrarCartelRandom();
    });

// Botón RANDOM
randomBtn.addEventListener('click', mostrarCartelRandom);
