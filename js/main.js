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

    // Links
    const revista = revistas.find(r => r.id === random.revista_id);
    linkRevista.textContent = revista ? (revista.nombre || revista.id) : random.revista_id;
    linkRevista.href = `revista.html?id=${random.revista_id}`;
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    // Hover
    hoverDiv.innerHTML = random.texto_index || ''; // permite <br>
    hoverDiv.style.opacity = 0;
    hoverDiv.style.position = 'absolute';
    hoverDiv.style.top = 0;
    hoverDiv.style.left = 0;
    hoverDiv.style.width = '100%';
    hoverDiv.style.height = '100%';
    hoverDiv.style.display = 'flex';
    hoverDiv.style.alignItems = 'flex-start'; // desde arriba
    hoverDiv.style.justifyContent = 'flex-start'; // izquierda
    hoverDiv.style.textAlign = 'left';
    hoverDiv.style.padding = '0.5em';
    hoverDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
    hoverDiv.style.color = '#fff';
    hoverDiv.style.fontFamily = 'Arial, sans-serif';
    hoverDiv.style.transition = 'opacity 0.3s ease';
    hoverDiv.style.pointerEvents = 'auto'; // permite clicks en móvil

    let hoverActivo = false;

    // Eliminar listeners previos
    imgCartel.replaceWith(imgCartel.cloneNode(true));
    const newImg = document.getElementById('cartel');

    // Desktop
    newImg.addEventListener('mouseenter', () => {
        hoverDiv.style.opacity = 1;
        hoverActivo = true;
    });
    newImg.addEventListener('mouseleave', () => {
        hoverDiv.style.opacity = 0;
        hoverActivo = false;
    });

    // Móvil
    newImg.addEventListener('click', () => {
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
