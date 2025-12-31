let carteles = [];

function mostrarCartelRandom() {
    const random = carteles[Math.floor(Math.random() * carteles.length)];

    // Actualizar imagen y links
    const imgCartel = document.getElementById('cartel');
    imgCartel.src = `carteles/${random.imagen}`;

    const linkRevista = document.getElementById('link-revista');
    linkRevista.textContent = random.revista;
    linkRevista.href = random.link_revista;

    const linkDina3 = document.getElementById('link-dina3');
    linkDina3.textContent = 'Versión en Papel';
    linkDina3.href = `pedido.html?cartel=${random.imagen}`;

    // Hover text
    const hoverDiv = document.getElementById('hover-text');

    // Limpiar eventos previos para evitar duplicados
    imgCartel.replaceWith(imgCartel.cloneNode(true));
    const imgNuevo = document.getElementById('cartel');

    if(random.hover_text && random.hover_text.trim() !== "") {
        hoverDiv.textContent = random.hover_text;

        imgNuevo.addEventListener('mouseenter', () => {
            imgNuevo.style.display = 'none';
            hoverDiv.style.display = 'block';
        });

        imgNuevo.addEventListener('mouseleave', () => {
            imgNuevo.style.display = 'block';
            hoverDiv.style.display = 'none';
        });

        hoverDiv.style.display = 'none';  // oculto por defecto
    } else {
        hoverDiv.textContent = "";
        hoverDiv.style.display = 'none';
    }
}

// Cargar JSON de carteles
fetch('data/carteles.json')
  .then(res => res.json())
  .then(data => {
      carteles = data;
      mostrarCartelRandom();
  });

// Botón RANDOM
document.getElementById('random-btn').addEventListener('click', mostrarCartelRandom);
