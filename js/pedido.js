const urlParams = new URLSearchParams(window.location.search);
const nombreCartel = urlParams.get('cartel');

fetch('data/carteles.json')
  .then(res => res.json())
  .then(carteles => {
      const cartel = carteles.find(c => c.imagen === nombreCartel);
      if(cartel){
          document.getElementById('cartel-img').src = `carteles/${cartel.imagen}`;
          document.getElementById('precio').textContent = cartel.precio_dina3 + ' €';
          document.getElementById('paypal-link').href = cartel.link_dina3;
      }
  });
