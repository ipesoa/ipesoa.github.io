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
    hoverDiv.style.opacity = 0;
    hoverDiv.style.pointerEvents = 'none'; // para que el mouse no bloquee la imagen

    let hoverActivo = false;

    // Limpiar eventos previos
    const newImgCartel = imgCartel.cloneNode(true);
    imgCartel.parentNode.replaceChild(newImgCartel, imgCartel);
    hoverDiv.style.opacity = 0;

    // Desktop: hover estable
    newImgCartel.addEventListener('mouseenter', () => {
        hoverDiv.style.opacity = 1;
        hoverActivo = true;
    });
    newImgCartel.addEventListener('mouseleave', () => {
        hoverDiv.style.opacity = 0;
        hoverActivo = false;
    });

    // Móvil: click para mostrar/ocultar
    newImgCartel.addEventListener('click', () => {
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
