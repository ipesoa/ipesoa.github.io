let carteles = [];

function mostrarCartelRandom() {
    const random = carteles[Math.floor(Math.random() * carteles.length)];
    document.getElementById('cartel').src = `carteles/${random.imagen}`;
    document.getElementById('cartel').title = random.texto_hover || '';
    document.getElementById('link-revista').href = random.link_revista;
    document.getElementById('link-dina3').href = `pedido.html?cartel=${random.imagen}`;
}

fetch('data/carteles.json')
  .then(res => res.json())
  .then(data => {
      carteles = data;
      mostrarCartelRandom();
  });

document.getElementById('random-btn').addEventListener('click', mostrarCartelRandom);
