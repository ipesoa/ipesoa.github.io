let carteles = [];

function mostrarCartelRandom() {
    const random = carteles[Math.floor(Math.random() * carteles.length)];

    document.getElementById('cartel').src = `carteles/${random.imagen}`;
    document.getElementById('link-revista').textContent = random.revista;
    document.getElementById('link-revista').href = random.link_revista;
    document.getElementById('link-dina3').textContent = 'Dina3';
    document.getElementById('link-dina3').href = `pedido.html?cartel=${random.imagen}`;

    const hoverDiv = document.getElementById('hover-text');
    if(random.hover_text && random.hover_text.trim() !== "") {
        hoverDiv.textContent = random.hover_text;
        hoverDiv.style.display = 'none';  // se activa con CSS hover
    } else {
        hoverDiv.textContent = "";
        hoverDiv.style.display = 'none';
    }
}

fetch('data/carteles.json')
  .then(res => res.json())
  .then(data => {
      carteles = data;
      mostrarCartelRandom();
  });

document.getElementById('random-btn').addEventListener('click', mostrarCartelRandom);
