const DEFAULT_STRIPE_URL = 'https://donate.stripe.com/cNidRa1nZ9OO6J77VPgfu00';
const DEFAULT_LEGAL_TEXT = 'La aportación es voluntaria y se destina a apoyar la escritura, edición y futura producción de proyectos editoriales de I.PESOA. Se realiza a título gratuito y sin contraprestación: no constituye una compra, preventa o reserva, ni otorga derecho a recibir un ejemplar, devolución, descuento u otra prestación. Se formula conforme al concepto de donación del artículo 618 del Código Civil y al artículo 3.1.b de la Ley 29/1987, del Impuesto sobre Sucesiones y Donaciones.';
const projectId = document.body.dataset.projectId;
const gallery = document.getElementById('gallery');
const projectInfo = document.getElementById('project-info');
const projectDescription = document.getElementById('project-description');
const fundingSection = document.getElementById('funding-section');
const newsletterSection = document.getElementById('newsletter-section');

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
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function assetUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `../${String(path || '').replace(/^\/+/, '')}`;
}

function buildGallery(images, name) {
  gallery.innerHTML = '';
  if (!images.length) return;

  if (images.length === 1) {
    const image = document.createElement('img');
    image.src = assetUrl(images[0]);
    image.alt = name;
    gallery.appendChild(image);
    return;
  }

  const container = document.createElement('div');
  container.className = 'carousel-container';
  const track = document.createElement('div');
  track.className = 'carousel-track';

  images.forEach((src) => {
    const image = document.createElement('img');
    image.src = assetUrl(src);
    image.alt = name;
    track.appendChild(image);
  });

  const previous = document.createElement('button');
  previous.className = 'carousel-btn prev';
  previous.type = 'button';
  previous.textContent = '‹';

  const next = document.createElement('button');
  next.className = 'carousel-btn next';
  next.type = 'button';
  next.textContent = '›';

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

function makePaymentButton(label, url, primary = false) {
  const safeUrl = safeExternalUrl(url);
  if (!safeUrl) return null;
  const link = document.createElement('a');
  link.className = `funding-button${primary ? ' primary' : ''}`;
  link.href = safeUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = label;
  return link;
}

function renderFunding(project) {
  fundingSection.innerHTML = '';

  const heading = document.createElement('h4');
  heading.textContent = 'Apoyar el proyecto';
  fundingSection.appendChild(heading);

  const intro = document.createElement('p');
  intro.className = 'funding-intro';
  intro.textContent = project.suggestedAmount > 0
    ? `Aportación orientativa: ${Number(project.suggestedAmount).toFixed(0)} €. La cantidad se elige en la pasarela de pago.`
    : 'La cantidad se elige en la pasarela de pago.';
  fundingSection.appendChild(intro);

  const buttons = document.createElement('div');
  buttons.className = 'funding-buttons';

  const stripe = makePaymentButton('APOYAR CON STRIPE', project.payment?.stripeUrl || DEFAULT_STRIPE_URL, true);
  const paypal = makePaymentButton('PayPal', project.payment?.paypalUrl, !stripe);
  if (stripe) buttons.appendChild(stripe);
  if (paypal) buttons.appendChild(paypal);

  if (stripe) {
    const methods = document.createElement('p');
    methods.className = 'funding-methods';
    methods.textContent = 'Tarjeta · Apple Pay · Google Pay · Link';
    fundingSection.appendChild(buttons);
    fundingSection.appendChild(methods);

    const trust = document.createElement('p');
    trust.className = 'funding-trust';
    trust.textContent = 'Pago seguro procesado por Stripe. I.PESOA no recibe ni almacena los datos de tu tarjeta.';
    fundingSection.appendChild(trust);
  } else {
    fundingSection.appendChild(buttons);
  }

  if (!stripe && !paypal) {
    const pending = document.createElement('div');
    pending.className = 'funding-pending';
    pending.textContent = 'APORTACIONES PRÓXIMAMENTE';
    buttons.appendChild(pending);
  }

  const legal = document.createElement('p');
  legal.className = 'funding-legal';
  legal.textContent = project.legalText || DEFAULT_LEGAL_TEXT;
  fundingSection.appendChild(legal);
}

function renderNewsletter(project) {
  const config = project.newsletter || {};
  if (!config.enabled || !config.formUrl || !config.emailEntry) return;

  newsletterSection.classList.remove('hidden');
  newsletterSection.innerHTML = `
    <h4>Recibir novedades</h4>
    <form id="newsletter-form" class="newsletter-form">
      <label for="newsletter-email">Email</label>
      <input type="email" id="newsletter-email" autocomplete="email" required>
      <label class="newsletter-consent">
        <input type="checkbox" id="newsletter-consent" required>
        <span>${escapeHtml(config.consentText || 'Acepto recibir por correo novedades sobre este proyecto.')}</span>
      </label>
      <button type="submit">Suscribirme</button>
      <p class="newsletter-status" id="newsletter-status" aria-live="polite"></p>
    </form>`;

  const form = document.getElementById('newsletter-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('newsletter-email').value.trim();
    const consent = document.getElementById('newsletter-consent').checked;
    const status = document.getElementById('newsletter-status');
    if (!email || !consent) return;

    const data = new FormData();
    data.append(config.emailEntry, email);
    if (config.projectEntry) data.append(config.projectEntry, project.id);

    status.textContent = 'ENVIANDO...';
    try {
      await fetch(config.formUrl, { method: 'POST', mode: 'no-cors', body: data });
      form.reset();
      status.textContent = 'RECIBIDO. GRACIAS.';
    } catch {
      status.textContent = 'NO SE PUDO ENVIAR. INTÉNTALO DE NUEVO.';
    }
  });
}

fetch('../data/products.json', { cache: 'no-store' })
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    const project = (data.products || []).find((item) => item.id === projectId && item.type === 'funding');
    if (!project) throw new Error('Proyecto no encontrado');

    document.title = `${project.name} — I.PESOA Editorial`;
    buildGallery(project.images || [], project.name || 'Libro');

    const categoryNames = (project.categories || [])
      .map((categoryId) => (data.categories || []).find((category) => category.id === categoryId)?.name || categoryId)
      .join(', ');

    projectInfo.innerHTML = `
      <h3>${escapeHtml(project.name)}</h3>
      <p class="funding-status">${escapeHtml(project.status || 'EN ESCRITURA')}</p>
      ${categoryNames ? `<p class="product-categories">${escapeHtml(categoryNames)}</p>` : ''}`;

    projectDescription.textContent = project.description || '';
    renderFunding(project);
    renderNewsletter(project);
  })
  .catch((error) => {
    console.error(error);
    projectInfo.innerHTML = '<p>Proyecto no encontrado.</p>';
    fundingSection.style.display = 'none';
  });
