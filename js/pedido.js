let cartel = null;
let orderId = null;

const imgCartel = document.getElementById('cartel');
const textoInfo = document.getElementById('texto-info');
const btnCompra = document.getElementById('btn-compra');
const form = document.getElementById('pedido-form');

// Obtener ID del producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const cartelId = urlParams.get('id');

// Generar Order ID de 7 cifras
function generarOrderId() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Cargar datos del cartel
fetch('data/carteles.json')
    .then(res => res.json())
    .then(data => {
        cartel = data.carteles.find(c => c.id === cartelId);
        if (cartel) {
            imgCartel.src = `carteles/${cartel.imagen}`;
            textoInfo.innerHTML = cartel.texto_impresion || '';
            orderId = generarOrderId();
        }
    })
    .catch(error => console.error('Error:', error));

// Enviar formulario a Google Forms y redirigir a PayPal
btnCompra.addEventListener('click', () => {
    // Validar formulario
    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!nombre || !direccion || !email) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Enviar a Google Forms (oculto, en segundo plano)
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc4HgVhBrjQMoW2p5-3JuF3RH3wicutIkQ_5euPVw8ZSO_J6A/formResponse';
    
    const formData = new FormData();
    formData.append('entry.484459052', nombre);           // Nombre completo
    formData.append('entry.559425642', direccion);        // Dirección
    formData.append('entry.1615188299', email);           // Email
    formData.append('entry.1298772582', cartel.id);       // Producto ID
    formData.append('entry.1738015936', orderId);         // Order ID

    // Enviar sin esperar respuesta (Google Forms no permite CORS)
    fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    });

    // Redirigir a PayPal
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=312rimini@gmail.com&item_name=${cartel.id}&amount=${cartel.amount}&currency_code=EUR&custom=${orderId}`;
    
    window.location.href = paypalUrl;
});
