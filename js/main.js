let carteles = [];

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

    // Link a revista (usa el ID de la revista)
    linkRevista.textContent = random.revista_id; // opcional: mostrar el nombre en lugar de ID si quieres
    linkRevista.href = `revista.html?id=${random.revista_id}`;

    // Link versión papel
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    // Reset hover
    hoverDiv.style.display = 'none';
    hoverDiv.textContent = '';

    imgCartel.onmouseenter = null;
    imgCartel.onmouseleave = null;
    imgCartel.onclick = null;
    hoverDiv.onclick = null;

    // Hover text opcional (index)
    if (random.texto_index && random.texto_index.trim() !== "") {
        hoverDiv.textContent = random.texto_index;

        // Desktop (hover)
        imgCartel.onmouseenter = () => {
            imgCartel.style.display = 'none';
            hoverDiv.style.display = 'block';
        };

        imgCartel.onmouseleave = () => {
            hoverDiv.style.display = 'none';
            imgCartel.style.display = 'block';
        };

        // Móvil (tap)
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

// Cargar carteles
fetch('data/data.json')
    .then(res => res.json())
    .then(data => {
        carteles = data.carteles; // ahora apunta a data.carteles
        mostrarCartelRandom();
    });

// Botón RANDOM
randomBtn.addEventListener('click', mostrarCartelRandom);
