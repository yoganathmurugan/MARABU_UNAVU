// ==========================================================================
// product.js — Product Detail page. Reads ?id= (or ?slug=) from the URL,
// renders full content + "Why It Disappeared" block, or shows the
// not-found state for an invalid id. Add to Cart / wishlist wiring
// arrives functionally in Stage 4; buttons render but are inert for now.
// ==========================================================================

function getRequestedProductKey() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('slug');
}

function showNotFound() {
  document.querySelector('[data-product-found]').hidden = true;
  document.querySelector('[data-product-not-found]').hidden = false;
  document.title = 'Product Not Found · Marabu Unavu';
}

function renderProductDetail(product) {
  document.title = `${product.name} · Marabu Unavu`;

  document.querySelector('[data-product-found]').hidden = false;
  document.querySelector('[data-product-not-found]').hidden = true;

  const artEl = document.querySelector('[data-detail-art]');
  artEl.className = `product-detail-art ${categoryArtClass(product.category)}`;
  artEl.innerHTML = product.image
    ? `<img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">`
    : categoryIcon(product.category);

  document.querySelector('[data-detail-chips]').innerHTML = `
    <span class="chip">${escapeHTML(product.category || '')}</span>
    <span class="chip">${escapeHTML(product.region || '')}</span>
    <span class="chip">${escapeHTML(product.era || '')}</span>
  `;

  document.querySelector('[data-detail-name]').textContent = product.name;
  document.querySelector('[data-detail-tamil-name]').textContent = product.tamilName || '';
  document.querySelector('[data-detail-price]').textContent = formatPrice(product.price);
  document.querySelector('[data-detail-description]').textContent = product.description || '';

  document.querySelector('[data-detail-region]').textContent = product.region || '\u2014';
  document.querySelector('[data-detail-processing]').textContent = product.processingMethod || '\u2014';
  document.querySelector('[data-detail-era]').textContent = product.era || '\u2014';

  const addToCartBtn = document.querySelector('[data-add-to-cart]');
  const wishlistBtn = document.querySelector('[data-wishlist-toggle]');
  addToCartBtn.setAttribute('data-product-id', product.id);
  wishlistBtn.setAttribute('data-product-id', product.id);

  const wishlisted = isWishlisted(product.id);
  wishlistBtn.classList.toggle('is-active', wishlisted);
  wishlistBtn.setAttribute('aria-pressed', String(wishlisted));
  const wishLabel = wishlistBtn.querySelector('[data-wishlist-label]');
  if (wishLabel) wishLabel.textContent = wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist';

  const why = whyItDisappeared(product.id);
  const whyBlock = document.querySelector('[data-why-block]');
  if (why) {
    whyBlock.hidden = false;
    document.querySelector('[data-why-text]').textContent = why;
  } else {
    whyBlock.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const key = getRequestedProductKey();
  const catalog = await loadCatalog();
  const product = getProductBySlugOrId(catalog, key);

  if (!product) {
    showNotFound();
    return;
  }

  renderProductDetail(product);
});
