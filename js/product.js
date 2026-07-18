let product = null;

const gallery = document.getElementById('gallery');
const productInfo = document.getElementById('product-info');
const productDescription = document.getElementById('product-description');
const checkoutSection = document.getElementById('checkout-section');
const productId = new URLSearchParams(window.location.search).get('id');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function buildGallery(images) {
  gallery.innerHTML = '';
  if (!Array.isArray(images) || images.length === 0) return;

  if (images.length === 1) {
    const image = document.createElement('img');
    image.src = images[0];
    image.alt = product.name || '';
    gallery.appendChild(image);
    return;
  }

  const container = document.createElement('div');
  container.className = 'carousel-container';
  const track = document.createElement('div');
  track.className = 'carousel-track';

  images.forEach((src) => {
    const image = document.createElement('img');
    image.src = src;
    image.alt = product.name || '';
    track.appendChild(image);
  });

  const previous = document.createElement('button');
  previous.className = 'carousel-btn prev';
  previous.type = 'button';
  previous.textContent = '‹';
  previous.setAttribute('aria-label', 'Imagen anterior');

  const next = document.createElement('button');
  next.className = 'carousel-btn next';
  next.type = 'button';
  next.textContent = '›';
  next.setAttribute('aria-label', 'Imagen siguiente');

  container.append(track, previous, next);
  gallery.appendChild(container);

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  images.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
    dot.addEventListener('click', () => goTo(index));
    dots.appendChild(dot);
  });
  gallery.appendChild(dots);

  let current = 0;
  function goTo(index) {
    current = (index + images.length) % images.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.querySelectorAll('.carousel-dot').forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  let startX = 0;
  container.addEventListener('touchstart', (event) => { startX = event.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend', (event) => {
    const difference = startX - event.changedTouches[0].clientX;
    if (Math.abs(difference) > 50) goTo(current + (difference > 0 ? 1 : -1));
  }, { passive: true });
}

function paymentButton(label, url, primary = false) {
  const safeUrl = safeExternalUrl(url);
  if (!safeUrl) return null;

  const link = document.createElement('a');
  link.className = `checkout-button${primary ? ' primary' : ''}`;
  link.href = safeUrl;
  link.textContent = label;
  link.rel = 'noopener';
  return link;
}

function renderCheckout() {
  checkoutSection.innerHTML = '';

  if (product.sold) {
    checkoutSection.innerHTML = '<p class="checkout-unavailable">VENDIDO</p>';
    return;
  }

  const stripeUrl = product.payment?.stripeUrl || product.stripeUrl || '';
  const paypalUrl = product.payment?.paypalUrl || product.paypalUrl || '';
  const stripeButton = paymentButton(`COMPRAR — ${Number(product.price).toFixed(2)} €`, stripeUrl, true);
  const paypalButton = paymentButton('PAGAR CON PAYPAL', paypalUrl, !stripeButton);

  const heading = document.createElement('h4');
  heading.textContent = 'Pago';
  checkoutSection.appendChild(heading);

  if (stripeButton) {
    checkoutSection.appendChild(stripeButton);
    const methods = document.createElement('p');
    methods.className = 'checkout-methods';
    methods.textContent = 'Tarjeta · Apple Pay · Google Pay · Link';
    checkoutSection.appendChild(methods);

    const trust = document.createElement('p');
    trust.className = 'checkout-trust';
    trust.textContent = 'Pago seguro procesado por Stripe. I.PESOA no recibe ni almacena los datos de tu tarjeta.';
    checkoutSection.appendChild(trust);
  }

  if (paypalButton) checkoutSection.appendChild(paypalButton);

  if (!stripeButton && !paypalButton) {
    const pending = document.createElement('p');
    pending.className = 'checkout-pending';
    pending.textContent = 'PAGO ONLINE PENDIENTE DE CONFIGURAR';
    checkoutSection.appendChild(pending);
  }
}

fetch('data/products.json', { cache: 'no-store' })
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    product = (data.products || []).find((item) => item.id === productId && item.type !== 'funding');
    if (!product) throw new Error('Producto no encontrado');

    document.title = `${product.name} - I.PESOA Editorial`;
    buildGallery(product.images || []);

    const categoryNames = (product.categories || [])
      .map((categoryId) => (data.categories || []).find((category) => category.id === categoryId)?.name || categoryId)
      .join(', ');

    productInfo.innerHTML = `
      <h3>${escapeHtml(product.name)}</h3>
      <p class="price">${Number(product.price || 0).toFixed(2)} €</p>
      ${product.sold ? '<p class="status">VENDIDO</p>' : ''}
      ${categoryNames ? `<p class="categories-label">${escapeHtml(categoryNames)}</p>` : ''}`;

    productDescription.textContent = product.description || '';
    renderCheckout();
  })
  .catch((error) => {
    console.error(error);
    productInfo.innerHTML = '<p>Producto no encontrado.</p>';
    checkoutSection.style.display = 'none';
  });
