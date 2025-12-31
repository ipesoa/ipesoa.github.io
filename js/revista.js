const urlParams = new URLSearchParams(window.location.search);
const nombreRevista = urlParams.get('revista');

fetch('data/fanzines.json')
  .then(res => res.json())
  .then(fanzines => {
      const f = fanzines.find(f => f.nombre === nombreRevista);
      if(f){
          document.getElementById('fanzine-img').src = `fanzines/${f.imagen}`;
          document.getElementById('descripcion').textContent = f.descripcion;
          document.getElementById('precio').textContent = f.precio + ' €';
          document.getElementById('paypal-link').href = f.link_compra;
      }
  });
