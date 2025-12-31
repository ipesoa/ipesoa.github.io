let carteles = [];

const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkRevista = document.getElementById('link-revista');
const linkDina3 = document.getElementById('link-dina3');
const randomBtn = document.getElementById('random-btn');

function mostrarCartelRandom() {
    const random = carteles[Math.floor(Math.random() * carteles.length)];

    // Imagen
    imgCartel.src = `carteles/${random.imagen}`;
    imgCartel.style.display = 'block';

    // Link revista (VIENE DEL JSON)
    linkRevista.textContent = random.revista;
    linkRevista.href = random.link_revista;

    // Link versión papel (por ID lógico)
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?id=${random.id}`;

    // Reset hover
    hoverDiv.style.display = 'none';
    hoverDiv.textContent = '';

    imgCartel.onmouseenter = null;
    imgCartel.onmouseleave = null;
    imgCartel.onclick = null;

    // Hover text opcional
    if (random.hover_text && random.hover_text.trim() !== "") {
        hoverDiv.textContent = random.hover_text;

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
fetch('data/carteles.json')
    .then(res => res.json())
    .then(data => {
        carteles = data;
        mostrarCartelRandom();
    });

// Botón RANDOM
randomBtn.addEventListener('click', mostrarCartelRandom);
