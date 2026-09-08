// ==========================================================================
// home.js — populates the category strip and bestseller grid on index.html.
// Cart/wishlist button clicks are inert until Stage 4 (cart.js/wishlist.js).
// ==========================================================================

// Arbitrary curated slice for the homepage "Bestsellers" row — one or two
// items per category for variety. Swap this out later if real sales data
// ever exists; for now it's just an editorial pick, not computed.
const BESTSELLER_IDS = [1, 3, 6, 9, 10, 13, 15, 16];

async function renderCategoryStrip(catalog) {
  const el = document.querySelector('[data-category-grid]');
  if (!el) return;

  el.innerHTML = catalog.categories.map((cat) => `
    <a class="category-card" href="shop.html?category=${cat.id}">
      <div class="category-icon" aria-hidden="true">${categoryIcon(cat.name)}</div>
      <h3>${escapeHTML(cat.name)}</h3>
      <p>${escapeHTML(cat.description || '')}</p>
    </a>
  `).join('');
}

function renderBestsellers(catalog) {
  const el = document.querySelector('[data-bestseller-grid]');
  if (!el) return;

  const products = BESTSELLER_IDS
    .map((id) => catalog.products.find((p) => p.id === id))
    .filter(Boolean);

  el.innerHTML = products.map((p) => productCardHTML(p, { wishlisted: isWishlisted(p.id) })).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const catalog = await loadCatalog();
  renderCategoryStrip(catalog);
  renderBestsellers(catalog);
});
