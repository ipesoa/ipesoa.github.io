let products = [];
let categories = [];

const grid = document.getElementById('product-grid');
const categorySelect = document.getElementById('category-select');
const catToggle = document.getElementById('cat-toggle');
const catMenu = document.getElementById('cat-menu');

// Cargar datos
fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
        products = data.products;
        categories = data.categories;
        buildCategoryDropdowns();
        renderProducts('all');
    })
    .catch(err => console.error('Error cargando productos:', err));

function buildCategoryDropdowns() {
    // Select filter
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
    });

    // Nav dropdown menu
    const allLink = document.createElement('a');
    allLink.href = 'index.html';
    allLink.textContent = 'Todo';
    catMenu.appendChild(allLink);

    categories.forEach(cat => {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = cat.name;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            categorySelect.value = cat.id;
            renderProducts(cat.id);
            catMenu.classList.remove('open');
        });
        catMenu.appendChild(a);
    });
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

// Filtro por categoría
categorySelect.addEventListener('change', () => {
    renderProducts(categorySelect.value);
});

// Renderizar productos
function renderProducts(categoryId) {
    grid.innerHTML = '';

    let filtered = products;
    if (categoryId !== 'all') {
        filtered = products.filter(p => p.categories.includes(categoryId));
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card' + (product.sold ? ' sold' : '');

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
