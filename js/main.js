// ==========================================================================
// main.js — shared logic loaded on every page: nav toggle, active link,
// cart/wishlist badge counts. Full cart/wishlist logic lands in cart.js /
// wishlist.js (Stage 4); this file only reads localStorage to keep badges
// in sync so the nav is correct from Stage 1 onward.
// ==========================================================================

const STORAGE_KEYS = {
  cart: 'mu_cart',
  wishlist: 'mu_wishlist',
};

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Could not read ${key} from localStorage`, err);
    return [];
  }
}

function updateBadge(el, count) {
  if (!el) return;
  el.textContent = String(count);
  el.hidden = count === 0;
}

function refreshBadges() {
  const cart = readList(STORAGE_KEYS.cart);
  const wishlist = readList(STORAGE_KEYS.wishlist);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  updateBadge(document.querySelector('[data-cart-badge]'), cartCount);
  updateBadge(document.querySelector('[data-wishlist-badge]'), wishlist.length);
}

function initNavToggle() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('[data-nav-links]');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is tapped (mobile)
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function markActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-links] a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current) {
      a.setAttribute('aria-current', 'page');
    }
  });
}

// Simple toast helper, used from Stage 4 onward for add-to-cart/wishlist feedback.
let toastTimer = null;
function showToast(message) {
  let toastEl = document.querySelector('[data-toast]');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('data-toast', '');
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
}

function initGlobalActionHandlers() {
  document.addEventListener('click', (event) => {
    const cartBtn = event.target.closest('[data-add-to-cart]');
    if (cartBtn) {
      const productId = cartBtn.getAttribute('data-product-id');
      if (productId && typeof addToCart === 'function') {
        addToCart(productId, 1);
        showToast('Added to cart');
      }
      return;
    }

    const wishBtn = event.target.closest('[data-wishlist-toggle]');
    if (wishBtn) {
      const productId = wishBtn.getAttribute('data-product-id');
      if (!productId || typeof toggleWishlist !== 'function') return;

      const nowWishlisted = toggleWishlist(productId);

      // Card-style heart button (product grids)
      if (wishBtn.classList.contains('wishlist-toggle')) {
        wishBtn.classList.toggle('is-active', nowWishlisted);
        wishBtn.setAttribute('aria-pressed', String(nowWishlisted));
        wishBtn.setAttribute('aria-label', nowWishlisted ? 'Remove from wishlist' : 'Add to wishlist');
      }

      // Text-label style button (product detail page)
      const label = wishBtn.querySelector('[data-wishlist-label]');
      if (label) {
        label.textContent = nowWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist';
      }

      showToast(nowWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
      document.dispatchEvent(new CustomEvent('mu:wishlist-changed', { detail: { productId, wishlisted: nowWishlisted } }));
    }
  });
}

function initNewsletterForm() {
  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && !input.checkValidity()) {
      input.reportValidity();
      return;
    }
    showToast('Thanks for subscribing!');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  markActiveNavLink();
  refreshBadges();
  initGlobalActionHandlers();
  initNewsletterForm();
});
