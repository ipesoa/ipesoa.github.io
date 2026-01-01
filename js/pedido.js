let cartel = null;
let revistas = [];

const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkCompra = document.getElementById('link-compra');

let hoverActivo = false;

const urlParams = new URLSearchParams(window.location.search);
const cartelId = urlParams.get('id');

fetch('data/carteles.json')
    .then(res => res.json())
    .then(data => {
        cartel = data.carteles.find(c => c.id === cartelId);
        if (cartel) {
            imgCartel.src = `carteles/${cartel.imagen}`;
            hoverDiv.innerHTML = cartel.texto_impresion || '';
            linkCompra.href = cartel.paypal_dina3 || '#';
        }
    })
    .catch(error => console.error('Error:', error));

imgCartel.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = !hoverActivo;
    hoverDiv.classList.toggle('show-text', hoverActivo);
});

hoverDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = false;
    hoverDiv.classList.remove('show-text');
});

document.addEventListener('click', () => {
    if (hoverActivo) {
        hoverActivo = false;
        hoverDiv.classList.remove('show-text');
    }
});
