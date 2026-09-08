// ==========================================================================
// render.js — shared markup builders. No page-specific logic here; that
// lives in home.js / shop.js / product.js (later stages).
// ==========================================================================

const CATEGORY_ART_CLASS = {
  'Millet Staples': 'art-millet',
  'Forgotten Snacks': 'art-snacks',
  'Festival & Travel Sweets': 'art-sweets',
  'Forgotten Ingredients & Remedies': 'art-remedies',
};

const CATEGORY_ICONS = {
  'Millet Staples': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v13"/><path d="M12 5c2 0 3-1.5 3-3-2 0-3 1-3 3Z"/><path d="M12 5c-2 0-3-1.5-3-3 2 0 3 1 3 3Z"/><path d="M12 9c2 0 3-1.5 3-3-2 0-3 1-3 3Z"/><path d="M12 9c-2 0-3-1.5-3-3 2 0 3 1 3 3Z"/><path d="M12 13c2 0 3-1.5 3-3-2 0-3 1-3 3Z"/><path d="M12 13c-2 0-3-1.5-3-3 2 0 3 1 3 3Z"/><path d="M9 21c0-3 1.5-5 3-6 1.5 1 3 3 3 6"/></svg>`,
  'Forgotten Snacks': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16l-1.5 7a2 2 0 0 1-2 1.6H7.5a2 2 0 0 1-2-1.6L4 11Z"/><path d="M4 11a8 8 0 0 1 16 0"/><path d="M9 7.5c0-1.5 1-2.5 1-2.5s1 1 1 2.5-1 2-1 2-1-.5-1-2Z"/></svg>`,
  'Festival & Travel Sweets': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16c1.5-1 3-1 4 0 1.5 1 2.5 1 4 0 1.5-1 2.5-1 4 0 1.5 1 2.5 1 4 0"/><path d="M6 16c-1-3 1.5-6 6-6s7 3 6 6"/><path d="M12 10V4"/><path d="M12 4c1 0 1.6-.8 1.6-1.6C12.6 2.4 12 3.4 12 4Z"/></svg>`,
  'Forgotten Ingredients & Remedies': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10h12l-1.2 8.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 10Z"/><path d="M9 10a3 3 0 0 1 6 0"/><path d="M12 2v3"/><path d="M9.5 3.5 12 5l2.5-1.5"/></svg>`,
};

const HEART_ICON_OUTLINE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`;

function categoryIcon(categoryName) {
  return CATEGORY_ICONS[categoryName] || CATEGORY_ICONS['Millet Staples'];
}

function categoryArtClass(categoryName) {
  return CATEGORY_ART_CLASS[categoryName] || 'art-millet';
}

function productImageHTML(product, className) {
  if (!product.image) return `<div class="${className} ${categoryArtClass(product.category)}" aria-hidden="true">${categoryIcon(product.category)}</div>`;
  return `<img class="${className} product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">`;
}

function kolamDividerSVG() {
  return `
  <div class="kolam-divider" aria-hidden="true">
    <svg width="220" height="28" viewBox="0 0 220 28" fill="none" stroke="var(--color-terracotta)" stroke-width="1.4">
      <line x1="0" y1="14" x2="70" y2="14" stroke-dasharray="2 5" />
      <circle cx="110" cy="14" r="9" />
      <circle cx="110" cy="14" r="3.5" fill="var(--color-gold)" stroke="none"/>
      <path d="M95 14 a15 15 0 0 1 30 0" />
      <path d="M95 14 a15 15 0 0 0 30 0" />
      <line x1="150" y1="14" x2="220" y2="14" stroke-dasharray="2 5" />
    </svg>
  </div>`;
}

function productCardHTML(product, { wishlisted = false } = {}) {
  return `
  <article class="product-card" data-product-id="${product.id}">
    <a class="card-link-overlay" href="product.html?id=${product.id}" aria-label="View ${escapeHTML(product.name)}"></a>
    <button
      class="wishlist-toggle${wishlisted ? ' is-active' : ''}"
      type="button"
      data-wishlist-toggle
      data-product-id="${product.id}"
      aria-pressed="${wishlisted}"
      aria-label="${wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
    >${HEART_ICON_OUTLINE}</button>
    ${productImageHTML(product, 'product-art')}
    <div class="product-card-body">
      <h3>${escapeHTML(product.name)}</h3>
      <div class="product-tamil-name tamil">${escapeHTML(product.tamilName || '')}</div>
      <div class="product-chips">
        <span class="chip">${escapeHTML(product.region || '')}</span>
        <span class="chip">${escapeHTML(product.era || '')}</span>
      </div>
      <div class="product-card-footer">
        <span class="product-price">${formatPrice(product.price)}</span>
        <button class="btn btn-primary" type="button" data-add-to-cart data-product-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  </article>`;
}

function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
