let revista = null;
let revistas = [];

// Elementos del DOM
const imgCartel = document.getElementById('cartel');
const hoverDiv = document.getElementById('hover-text');
const linkRevista = document.getElementById('link-revista');
const linkDina3 = document.getElementById('link-dina3');

// Variable para controlar el estado del hover en móvil
let hoverActivo = false;

// Obtener ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const revistaId = urlParams.get('id');

// Cargar datos
fetch('data/carteles.json')
    .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el JSON");
        return res.json();
    })
    .then(data => {
        revistas = data.revistas;
        revista = revistas.find(r => r.id === revistaId);
        
        if (revista) {
            mostrarRevista();
        } else {
            console.error('Revista no encontrada:', revistaId);
        }
    })
    .catch(error => console.error('Error cargando datos:', error));

function mostrarRevista() {
    // 1. Imagen de la revista
    imgCartel.src = `fanzines/${revista.imagen}`;
    imgCartel.style.display = 'block';

    // 2. Texto de la revista
    hoverDiv.innerHTML = revista.descripcion ? revista.descripcion : '';

    // 3. Links
    linkRevista.textContent = 'Ver en web';
    linkRevista.href = `revista.html?id=${revista.id}`;
    
    linkDina3.textContent = 'Comprar PDF';
    linkDina3.href = '#';
}

// Móvil / Touch: Alternar visibilidad con tap
imgCartel.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = !hoverActivo;
    if (hoverActivo) {
        hoverDiv.classList.add('show-text');
    } else {
        hoverDiv.classList.remove('show-text');
    }
});

// Click en el texto para cerrar
hoverDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    hoverActivo = false;
    hoverDiv.classList.remove('show-text');
});

// Click fuera para cerrar en móvil
document.addEventListener('click', () => {
    if (hoverActivo) {
        hoverActivo = false;
        hoverDiv.classList.remove('show-text');
    }
});
