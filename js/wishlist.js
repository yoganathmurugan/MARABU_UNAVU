// ==========================================================================
// wishlist.js — wishlist data functions (used site-wide) + Wishlist page
// rendering (only runs when [data-wishlist-page] is present).
// Wishlist shape in localStorage: [productId, productId, ...]
// ==========================================================================

const WISHLIST_KEY = 'mu_wishlist';

function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch (err) {
    console.error('Could not read wishlist from localStorage', err);
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Could not save wishlist to localStorage', err);
  }
  if (typeof refreshBadges === 'function') refreshBadges();
}

function isWishlisted(productId) {
  return getWishlist().includes(Number(productId));
}

function toggleWishlist(productId) {
  const id = Number(productId);
  let list = getWishlist();
  const alreadyIn = list.includes(id);
  list = alreadyIn ? list.filter((pid) => pid !== id) : [...list, id];
  saveWishlist(list);
  return !alreadyIn; // returns new "wishlisted" state
}

// ---- Wishlist page rendering ----

function renderWishlistPage(catalog) {
  const grid = document.querySelector('[data-wishlist-grid]');
  const emptyState = document.querySelector('[data-wishlist-empty]');
  if (!grid) return;

  const ids = getWishlist();
  const products = ids
    .map((id) => catalog.products.find((p) => p.id === id))
    .filter(Boolean);

  if (products.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  grid.innerHTML = products.map((p) => productCardHTML(p, { wishlisted: true })).join('');

  // Per App-Flow §4: wishlist items support "Move to Cart" (adds to cart +
  // removes from wishlist) in addition to "Remove" (the heart toggle).
  grid.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.textContent = 'Move to Cart';
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const productId = btn.getAttribute('data-product-id');
      addToCart(productId, 1);
      const remaining = getWishlist().filter((pid) => pid !== Number(productId));
      saveWishlist(remaining);
      if (typeof showToast === 'function') showToast('Moved to cart');
      renderWishlistPage(catalog);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const wishlistPageRoot = document.querySelector('[data-wishlist-page]');
  if (!wishlistPageRoot) return;
  const catalog = await loadCatalog();
  renderWishlistPage(catalog);

  // Re-render if a card's wishlist heart is toggled off from this page,
  // so the item disappears immediately instead of waiting for a reload.
  document.addEventListener('mu:wishlist-changed', () => renderWishlistPage(catalog));
});
