const urlParams = new URLSearchParams(window.location.search);
const idCartel = urlParams.get('id');

fetch('data/carteles.json')
  .then(res => res.json())
  .then(data => {
      const cartel = data.carteles.find(c => c.id === idCartel);
      if(cartel){
          // Imagen del cartel
          document.getElementById('cartel-img').src = `carteles/${cartel.imagen}`;
          
          // Texto de impresión (incluye precio y descripción)
          document.getElementById('texto-impresion').textContent = cartel.texto_impresion;
          
          // Link a PayPal
          document.getElementById('paypal-link').href = cartel.paypal_dina3;
      }
  });
