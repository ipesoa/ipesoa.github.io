const urlParams = new URLSearchParams(window.location.search);
const idRevista = urlParams.get('id');

fetch('data/data.json')
  .then(res => res.json())
  .then(data => {
      const revista = data.revistas.find(r => r.id === idRevista);
      if(revista){
          // Imagen de la revista
          document.getElementById('fanzine-img').src = `fanzines/${revista.imagen}`;
          
          // Descripción / contenido / precio en texto
          document.getElementById('descripcion').textContent = revista.descripcion;
          
          // Link a PayPal
          document.getElementById('paypal-link').href = revista.paypal;
      }
  });
