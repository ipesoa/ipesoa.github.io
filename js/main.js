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

    // Link a revista (buscar nombre por ID)
    const revista = revistas.find(r => r.id === random.revista_id);
    linkRevista.textContent = revista ? revista.id : random.revista_id;
    linkRevista.href = `revista.html?id=${random.revista_id}`;

    // Link versión papel
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    // Reset hover
    hoverDiv.style.display = 'none';
    hoverDiv.textContent = '';

    // Eliminar eventos previos
    imgCartel.onpointerenter = null;
    imgCartel.onpointerleave = null;
    imgCartel.onclick = null;
    hoverDiv.onclick = null;

    // Hover opcional para el index
    if (random.texto_index && random.texto_index.trim() !== "") {
        hoverDiv.textContent = random.texto_index;

        // Hover estable en escritorio
        imgCartel.onpointerenter = () => {
            imgCartel.style.display = 'none';
            hoverDiv.style.display = 'block';
        };
        imgCartel.onpointerleave = () => {
            hoverDiv.style.display = 'none';
            imgCartel.style.display = 'block';
        };

        // Activación por toque en móviles
        imgCartel.onclick = () => {
            imgCartel.style.display = 'none';
            hoverDiv.style.display = 'block';
        };
        hoverDiv.onclick = () => {
            hoverDiv.style.display = 'none';
            imgCartel.style.display = 'block';
        };
    }
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
