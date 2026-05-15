let producto = null;
let orderId = null;
let categories = [];

const gallery = document.getElementById('gallery');
const productInfo = document.getElementById('product-info');
const productDescription = document.getElementById('product-description');
const orderSection = document.getElementById('order-section');
const btnCompra = document.getElementById('btn-compra');
const catMenu = document.getElementById('cat-menu');

// Obtener ID del producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get('id');

// Generar Order ID de 7 cifras
function generarOrderId() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Construir carrusel
function buildGallery(images) {
    if (images.length === 1) {
        const img = document.createElement('img');
        img.src = images[0];
        img.alt = producto.name;
        gallery.appendChild(img);
        return;
    }

    // Carrusel para múltiples imágenes
    const container = document.createElement('div');
    container.className = 'carousel-container';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = producto.name;
        track.appendChild(img);
    });

    container.appendChild(track);

    // Botones prev/next
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev';
    prevBtn.textContent = '‹';
    container.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next';
    nextBtn.textContent = '›';
    container.appendChild(nextBtn);

    gallery.appendChild(container);

    // Dots
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dots.appendChild(dot);
    });
    gallery.appendChild(dots);

    // Carousel logic
    let current = 0;
    const total = images.length;

    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    prevBtn.addEventListener('click', () => goTo((current - 1 + total) % total));
    nextBtn.addEventListener('click', () => goTo((current + 1) % total));

    // Swipe support
    let startX = 0;
    container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    container.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo((current + 1) % total);
            else goTo((current - 1 + total) % total);
        }
    });
}

// Construir menú de categorías en nav
function buildCategoryMenu() {
    const allLink = document.createElement('a');
    allLink.href = 'index.html';
    allLink.textContent = 'Todo';
    catMenu.appendChild(allLink);

    categories.forEach(cat => {
        const a = document.createElement('a');
        a.href = `index.html#cat=${cat.id}`;
        a.textContent = cat.name;
        catMenu.appendChild(a);
    });
}

// Cargar datos
fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
        categories = data.categories;
        buildCategoryMenu();

        producto = data.products.find(p => p.id === productoId);
        if (!producto) {
            productInfo.innerHTML = '<p>Producto no encontrado.</p>';
            return;
        }

        document.title = `${producto.name} - I.PESOA Editorial`;

        // Galería
        buildGallery(producto.images);

        // Info
        const catNames = producto.categories
            .map(cid => {
                const cat = categories.find(c => c.id === cid);
                return cat ? cat.name : cid;
            })
            .join(', ');

        productInfo.innerHTML = `
            <h3>${producto.name}</h3>
            <div class="price">${producto.price.toFixed(2)} €</div>
            ${producto.sold ? '<div class="status">Vendido</div>' : ''}
            <div class="categories-label">${catNames}</div>
        `;

        // Descripción
        if (producto.description) {
            productDescription.innerHTML = producto.description;
        }

        // Ocultar formulario si vendido
        if (producto.sold) {
            orderSection.style.display = 'none';
        }

        orderId = generarOrderId();
    })
    .catch(err => console.error('Error:', err));

// Dropdown nav toggle
const catToggle = document.getElementById('cat-toggle');
catToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    catMenu.classList.toggle('open');
});
document.addEventListener('click', () => catMenu.classList.remove('open'));

// Compra — envío a Google Forms + PayPal (misma lógica original)
btnCompra.addEventListener('click', () => {
    if (!producto || producto.sold) return;

    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!nombre || !direccion || !email) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Enviar a Google Forms
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc4HgVhBrjQMoW2p5-3JuF3RH3wicutIkQ_5euPVw8ZSO_J6A/formResponse';
    const params = new URLSearchParams();
    params.append('entry.484459052', nombre);
    params.append('entry.559425642', direccion);
    params.append('entry.1615188299', email);
    params.append('entry.1298772582', producto.id);
    params.append('entry.1738015936', orderId);

    const beaconSent = navigator.sendBeacon(googleFormUrl, params);

    if (!beaconSent) {
        const formData = new FormData();
        formData.append('entry.484459052', nombre);
        formData.append('entry.559425642', direccion);
        formData.append('entry.1615188299', email);
        formData.append('entry.1298772582', producto.id);
        formData.append('entry.1738015936', orderId);

        fetch(googleFormUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
    }

    // Redirigir a PayPal
    setTimeout(() => {
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=312rimini@gmail.com&item_name=${encodeURIComponent(producto.id)}&amount=${producto.price.toFixed(2)}&currency_code=EUR&custom=${orderId}`;
        window.location.href = paypalUrl;
    }, 300);
});
