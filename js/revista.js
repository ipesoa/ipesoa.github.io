let revista = null;

const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkCompra = document.getElementById('link-compra');

let hoverActivo = false;

const urlParams = new URLSearchParams(window.location.search);
const revistaId = urlParams.get('id');

fetch('data/carteles.json')
    .then(res => res.json())
    .then(data => {
        revista = data.revistas.find(r => r.id === revistaId);
        if (revista) {
            imgCartel.src = `fanzines/${revista.imagen}`;
            hoverDiv.innerHTML = revista.descripcion || '';
            linkCompra.href = revista.paypal || '#';
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
