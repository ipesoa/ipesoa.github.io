let product = null;

const gallery = document.getElementById('gallery');
const productInfo = document.getElementById('product-info');
const productDescription = document.getElementById('product-description');
const checkoutSection = document.getElementById('checkout-section');
const productId = new URLSearchParams(window.location.search).get('id');

const PRODUCT_PAYMENT_OVERRIDES = {
  cartelism: {
    stripeUrl: 'https://buy.stripe.com/00wdRa0jVe547Nbcc5gfu01',
    price: 15,
    cleanDonationText: true
  }
};

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

function paymentLink(url, className, ariaLabel, html) {
  const safeUrl = safeExternalUrl(url);
  if (!safeUrl) return null;

  const link = document.createElement('a');
  link.className = className;
  link.href = safeUrl;
  link.rel = 'noopener';
  link.setAttribute('aria-label', ariaLabel);
  link.innerHTML = html;
  return link;
}

function getPaymentPlatform() {
  const ua = navigator.userAgent || '';
  const isApple = /Macintosh|Mac OS X|iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|OPR/i.test(ua);
  return { isApple, isAndroid, isChrome };
}

function buildPaymentChoices(stripeUrl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'express-payment-choices';
  const { isApple, isAndroid, isChrome } = getPaymentPlatform();

  if (isApple) {
    const apple = paymentLink(
      stripeUrl,
      'wallet-button apple-pay-button',
      'Pagar con Apple Pay mediante Stripe',
      '<span class="apple-mark"></span><span>Pay</span>'
    );
    if (apple) wrapper.appendChild(apple);
  }

  if (isAndroid || isChrome) {
    const google = paymentLink(
      stripeUrl,
      'wallet-button google-pay-button',
      'Pagar con Google Pay mediante Stripe',
      '<span class="google-g"><i>G</i></span><span>Pay</span>'
    );
    if (google) wrapper.appendChild(google);
  }

  const card = paymentLink(
    stripeUrl,
    'card-payment-button',
    'Pagar con tarjeta mediante Stripe',
    '<span class="radio-dot" aria-hidden="true"></span><span class="card-symbol" aria-hidden="true"></span><span class="card-label">Tarjeta</span><span class="card-brands" aria-hidden="true"><b>VISA</b><b>MC</b><b>AMEX</b></span>'
  );
  if (card) wrapper.appendChild(card);
  return wrapper;
}

function renderCheckout() {
  checkoutSection.innerHTML = '';

  if (product.sold) {
    checkoutSection.innerHTML = '<p class="checkout-unavailable">VENDIDO</p>';
    return;
  }

  const override = PRODUCT_PAYMENT_OVERRIDES[product.id] || {};
  const stripeUrl = override.stripeUrl || product.payment?.stripeUrl || product.stripeUrl || '';
  const paypalUrl = product.payment?.paypalUrl || product.paypalUrl || '';

  const heading = document.createElement('h4');
  heading.textContent = 'PAGO';
  checkoutSection.appendChild(heading);

  if (stripeUrl) {
    checkoutSection.appendChild(buildPaymentChoices(stripeUrl));

    const trust = document.createElement('p');
    trust.className = 'checkout-trust';
    trust.textContent = 'Pago seguro procesado por Stripe. I.PESOA no recibe ni almacena los datos de tu tarjeta.';
    checkoutSection.appendChild(trust);
  }

  if (paypalUrl) {
    const paypalButton = paymentLink(
      paypalUrl,
      'checkout-button paypal-button',
      'Pagar con PayPal',
      'PAGAR CON PAYPAL'
    );
    if (paypalButton) checkoutSection.appendChild(paypalButton);
  }

  if (!stripeUrl && !paypalUrl) {
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

    const override = PRODUCT_PAYMENT_OVERRIDES[product.id] || {};
    if (Number.isFinite(override.price)) product.price = override.price;
    if (override.stripeUrl) {
      product.payment = { ...(product.payment || {}), stripeUrl: override.stripeUrl };
    }

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

    let description = product.description || '';
    const override = PRODUCT_PAYMENT_OVERRIDES[product.id] || {};
    if (override.cleanDonationText && /aportaci[oó]n voluntaria|sin contraprestaci[oó]n|donaci[oó]n/i.test(description)) {
      description = '';
    }
    productDescription.textContent = description;
    renderCheckout();
  })
  .catch((error) => {
    console.error(error);
    productInfo.innerHTML = '<p>Producto no encontrado.</p>';
    checkoutSection.style.display = 'none';
  });
