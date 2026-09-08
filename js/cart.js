// ==========================================================================
// cart.js — cart data functions (used site-wide) + Cart page rendering
// (only runs when [data-cart-page] is present, i.e. on cart.html).
// Cart shape in localStorage: [{ productId: number, quantity: number }]
// ==========================================================================

const CART_KEY = 'mu_cart';
const FLAT_SHIPPING = 49;
const FREE_SHIPPING_THRESHOLD = 999;

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Could not read cart from localStorage', err);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Could not save cart to localStorage', err);
  }
  if (typeof refreshBadges === 'function') refreshBadges();
}

function addToCart(productId, quantity = 1) {
  const id = Number(productId);
  const cart = getCart();
  const existing = cart.find((item) => item.productId === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId: id, quantity });
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(productId) {
  const id = Number(productId);
  const cart = getCart().filter((item) => item.productId !== id);
  saveCart(cart);
  return cart;
}

function setCartQuantity(productId, quantity) {
  const id = Number(productId);
  let cart = getCart();
  if (quantity < 1) {
    cart = cart.filter((item) => item.productId !== id);
  } else {
    const existing = cart.find((item) => item.productId === id);
    if (existing) existing.quantity = quantity;
  }
  saveCart(cart);
  return cart;
}

function cartWithProductDetails(catalog) {
  const cart = getCart();
  return cart
    .map((item) => {
      const product = catalog.products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);
}

function cartTotals(catalog) {
  const items = cartWithProductDetails(catalog);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  return { items, subtotal, shipping, total };
}

// ---- Cart page rendering ----

function cartLineItemHTML(item) {
  const { product, quantity } = item;
  return `
  <div class="cart-line" data-cart-line data-product-id="${product.id}">
    ${productImageHTML(product, 'cart-line-art')}
    <div class="cart-line-body">
      <a href="product.html?id=${product.id}" class="cart-line-name">${escapeHTML(product.name)}</a>
      <div class="product-tamil-name tamil">${escapeHTML(product.tamilName || '')}</div>
      <span class="chip">${escapeHTML(product.region || '')}</span>
    </div>
    <div class="cart-line-qty">
      <button type="button" class="qty-btn" data-qty-decrease aria-label="Decrease quantity">&minus;</button>
      <span data-qty-value>${quantity}</span>
      <button type="button" class="qty-btn" data-qty-increase aria-label="Increase quantity">+</button>
    </div>
    <div class="cart-line-price">${formatPrice(product.price * quantity)}</div>
    <button type="button" class="cart-line-remove" data-cart-remove aria-label="Remove ${escapeHTML(product.name)} from cart">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
    </button>
  </div>`;
}

function renderCartPage(catalog) {
  const wrap = document.querySelector('[data-cart-items-wrap]');
  const emptyState = document.querySelector('[data-cart-empty]');
  const itemsEl = document.querySelector('[data-cart-items]');
  if (!wrap || !itemsEl) return;

  const { items, subtotal, shipping, total } = cartTotals(catalog);

  if (items.length === 0) {
    wrap.hidden = true;
    if (emptyState) emptyState.hidden = false;
    return;
  }

  wrap.hidden = false;
  if (emptyState) emptyState.hidden = true;

  itemsEl.innerHTML = items.map(cartLineItemHTML).join('');

  document.querySelector('[data-cart-subtotal]').textContent = formatPrice(subtotal);
  document.querySelector('[data-cart-shipping]').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  document.querySelector('[data-cart-total]').textContent = formatPrice(total);

  const note = document.querySelector('[data-cart-shipping-note]');
  if (note) {
    note.textContent = shipping === 0
      ? 'Free shipping applied.'
      : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.`;
  }

  itemsEl.querySelectorAll('[data-cart-line]').forEach((line) => {
    const productId = Number(line.getAttribute('data-product-id'));

    line.querySelector('[data-qty-increase]').addEventListener('click', () => {
      const current = getCart().find((i) => i.productId === productId);
      setCartQuantity(productId, (current?.quantity || 0) + 1);
      renderCartPage(catalog);
    });

    line.querySelector('[data-qty-decrease]').addEventListener('click', () => {
      const current = getCart().find((i) => i.productId === productId);
      setCartQuantity(productId, (current?.quantity || 0) - 1);
      renderCartPage(catalog);
    });

    line.querySelector('[data-cart-remove]').addEventListener('click', () => {
      removeFromCart(productId);
      renderCartPage(catalog);
      if (typeof showToast === 'function') showToast('Removed from cart');
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const cartPageRoot = document.querySelector('[data-cart-page]');
  if (!cartPageRoot) return;
  const catalog = await loadCatalog();
  renderCartPage(catalog);
});
