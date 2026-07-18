let products = [];
let categories = [];

const grid = document.getElementById('product-grid');
const catToggle = document.getElementById('cat-toggle');
const catMenu = document.getElementById('cat-menu');
let currentFilter = 'recent';

function isFunding(item) {
  return item && item.type === 'funding';
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'libro';
}

function normalizeItem(item) {
  return {
    ...item,
    type: item.type === 'funding' ? 'funding' : 'product',
    categories: Array.isArray(item.categories) ? item.categories : [],
    images: Array.isArray(item.images) ? item.images : [],
    price: Number(item.price || 0),
    suggestedAmount: Number(item.suggestedAmount || 0),
    sold: Boolean(item.sold),
    pinned: Boolean(item.pinned)
  };
}

fetch('data/products.json', { cache: 'no-store' })
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((data) => {
    products = (data.products || []).map(normalizeItem);
    categories = Array.isArray(data.categories) ? data.categories : [];
    buildCategoryDropdown();

    const hash = window.location.hash;
    if (hash && hash.startsWith('#cat=')) {
      filterBy(decodeURIComponent(hash.replace('#cat=', '')));
    } else {
      filterBy('recent');
    }
  })
  .catch((err) => {
    console.error('Error cargando productos:', err);
    if (grid) grid.innerHTML = '<p style="font-size:12px;">No se pudo cargar el catálogo.</p>';
  });

function buildCategoryDropdown() {
  if (!catMenu) return;
  catMenu.innerHTML = '';

  addFilterLink('Todo', 'all');
  addFilterLink('Lo más reciente', 'recent');
  categories.forEach((cat) => addFilterLink(cat.name, cat.id));
}

function addFilterLink(label, filter) {
  const link = document.createElement('a');
  link.href = filter === 'all' ? '#cat=all' : `#cat=${encodeURIComponent(filter)}`;
  link.textContent = label;
  link.addEventListener('click', (event) => {
    event.preventDefault();
    history.replaceState(null, '', link.href);
    filterBy(filter);
  });
  catMenu.appendChild(link);
}

function filterBy(filter) {
  currentFilter = filter;
  if (catMenu) catMenu.classList.remove('open');

  if (catToggle) {
    if (filter === 'all') catToggle.textContent = 'Todo';
    else if (filter === 'recent') catToggle.textContent = 'Lo más reciente';
    else {
      const category = categories.find((cat) => cat.id === filter);
      catToggle.textContent = category ? category.name : 'Todo';
    }
  }
  renderProducts(filter);
}

if (catToggle && catMenu) {
  catToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    catMenu.classList.toggle('open');
  });
  document.addEventListener('click', () => catMenu.classList.remove('open'));
  catMenu.addEventListener('click', (event) => event.stopPropagation());
}

function pinnedFirst(items) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => Number(b.item.pinned) - Number(a.item.pinned) || a.index - b.index)
    .map(({ item }) => item);
}

function renderProducts(filter) {
  if (!grid) return;
  grid.innerHTML = '';

  let filtered = [...products];
  if (filter === 'recent') {
    const pinned = products.filter((item) => item.pinned);
    const recent = products.filter((item) => !item.pinned).slice(-12).reverse();
    filtered = [...pinnedFirst(pinned), ...recent];
  } else if (filter !== 'all') {
    filtered = pinnedFirst(filtered.filter((item) => item.categories.includes(filter)));
  } else {
    filtered = pinnedFirst(filtered);
  }

  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = `product-card${item.sold && !isFunding(item) ? ' sold' : ''}${isFunding(item) ? ' funding-card' : ''}${item.pinned ? ' pinned-card' : ''}`;

    const image = document.createElement('img');
    image.className = 'product-card-img';
    image.src = item.images[0] || '';
    image.alt = item.name || '';
    image.loading = 'lazy';

    const name = document.createElement('div');
    name.className = 'product-card-name';
    name.textContent = item.name || '';

    card.appendChild(image);
    card.appendChild(name);

    if (item.sticker) {
      const sticker = document.createElement('span');
      sticker.className = `sticker-new ${item.sticker}`;
      sticker.textContent = 'NEW!';
      card.appendChild(sticker);
    }

    if (isFunding(item)) {
      const status = document.createElement('div');
      status.className = 'product-card-price funding-card-status';
      status.textContent = item.status || 'EN ESCRITURA';
      card.appendChild(status);
      card.addEventListener('click', () => {
        window.location.href = `libros/${encodeURIComponent(slugify(item.slug || item.name || item.id))}.html`;
      });
    } else if (item.sold) {
      const sold = document.createElement('div');
      sold.className = 'product-card-sold';
      sold.textContent = 'Vendido';
      card.appendChild(sold);
    } else {
      const price = document.createElement('div');
      price.className = 'product-card-price';
      price.textContent = `${item.price.toFixed(2)} €`;
      card.appendChild(price);
      card.addEventListener('click', () => {
        window.location.href = `product.html?id=${encodeURIComponent(item.id)}`;
      });
    }

    grid.appendChild(card);
  });
}
