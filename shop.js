let products = [];
let categories = [];
const grid = document.getElementById('product-grid');
const catToggle = document.getElementById('cat-toggle');
const catMenu = document.getElementById('cat-menu');
let currentFilter = 'recent';

// Cargar datos
fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
        products = data.products;
        categories = data.categories;
        buildCategoryDropdown();

        // Check URL hash for category filter
        const hash = window.location.hash;
        if (hash && hash.startsWith('#cat=')) {
            const catId = hash.replace('#cat=', '');
            filterBy(catId);
        } else {
            renderProducts('recent');
        }
    })
    .catch(err => console.error('Error cargando productos:', err));

function buildCategoryDropdown() {
    // "Lo más reciente" option
    const recentLink = document.createElement('a');
    recentLink.href = '#';
    recentLink.textContent = 'Lo más reciente';
    recentLink.addEventListener('click', (e) => {
        e.preventDefault();
        filterBy('recent');
    });
    catMenu.appendChild(recentLink);

    // Category options
    categories.forEach(cat => {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = cat.name;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            filterBy(cat.id);
        });
        catMenu.appendChild(a);
    });
}

function filterBy(filter) {
    currentFilter = filter;
    catMenu.classList.remove('open');

    if (filter === 'recent') {
        catToggle.textContent = 'Lo más reciente';
    } else {
        const cat = categories.find(c => c.id === filter);
        catToggle.textContent = cat ? cat.name : 'Categorías';
    }

    renderProducts(filter);
}

// Toggle dropdown
catToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    catMenu.classList.toggle('open');
});

document.addEventListener('click', () => {
    catMenu.classList.remove('open');
});

catMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Renderizar productos
function renderProducts(filter) {
    grid.innerHTML = '';
    let filtered = products;

    if (filter === 'recent') {
        filtered = products.slice(-12).reverse();
    } else if (filter !== 'all') {
        filtered = products.filter(p => p.categories.includes(filter));
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card' + (product.sold ? ' sold' : '');

        // Pegatina NEW!
        if (product.sticker && !product.sold) {
            const sticker = document.createElement('span');
            sticker.className = 'sticker-new ' + product.sticker;
            sticker.textContent = 'NEW!';
            card.appendChild(sticker);
        }

        const img = document.createElement('img');
        img.className = 'product-card-img';
        img.src = product.images[0];
        img.alt = product.name;
        img.loading = 'lazy';

        const name = document.createElement('div');
        name.className = 'product-card-name';
        name.textContent = product.name;

        if (product.sold) {
            const soldLabel = document.createElement('div');
            soldLabel.className = 'product-card-sold';
            soldLabel.textContent = 'Vendido';
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(soldLabel);
        } else {
            const price = document.createElement('div');
            price.className = 'product-card-price';
            price.textContent = product.price.toFixed(2) + ' €';

            card.addEventListener('click', () => {
                window.location.href = `product.html?id=${encodeURIComponent(product.id)}`;
            });

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(price);
        }

        grid.appendChild(card);
    });
}
