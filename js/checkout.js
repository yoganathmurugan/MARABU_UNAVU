// ==========================================================================
// checkout.js — Checkout page. Redirects to Shop if cart is empty (App-Flow
// §7 edge case), renders the live order summary, validates the delivery
// form, and on submit generates a fake order, saves it to
// localStorage['mu_lastOrder'], clears the cart, and redirects to
// order-confirmation.html.
// ==========================================================================

const LAST_ORDER_KEY = 'mu_lastOrder';

const VALIDATORS = {
  name: (v) => v.trim().length >= 2 || 'Enter your full name.',
  phone: (v) => /^[0-9]{10}$/.test(v.trim()) || 'Enter a valid 10-digit phone number.',
  address: (v) => v.trim().length >= 5 || 'Enter your delivery address.',
  city: (v) => v.trim().length >= 2 || 'Enter your city.',
  state: (v) => v.trim().length >= 2 || 'Enter your state.',
  pincode: (v) => /^[0-9]{6}$/.test(v.trim()) || 'Enter a valid 6-digit PIN code.',
};

function generateOrderRef() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `MU-${y}${m}${d}-${rand}`;
}

function renderCheckoutSummary(catalog) {
  const { items, subtotal, shipping, total } = cartTotals(catalog);
  const itemsEl = document.querySelector('[data-checkout-summary-items]');

  itemsEl.innerHTML = items.map((item) => `
    <div class="checkout-summary-line">
      <span>${escapeHTML(item.product.name)} &times; ${item.quantity}</span>
      <span>${formatPrice(item.product.price * item.quantity)}</span>
    </div>
  `).join('');

  document.querySelector('[data-summary-subtotal]').textContent = formatPrice(subtotal);
  document.querySelector('[data-summary-shipping]').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  document.querySelector('[data-summary-total]').textContent = formatPrice(total);

  return { items, subtotal, shipping, total };
}

function clearFieldErrors(form) {
  form.querySelectorAll('.field-error').forEach((el) => { el.textContent = ''; });
  form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
}

function showFieldError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message;
  const input = document.querySelector(`[name="${fieldName}"]`);
  if (input) input.closest('.form-field, .checkout-section')?.classList.add('has-error');
}

function validateForm(form) {
  clearFieldErrors(form);
  let isValid = true;
  const data = {};

  Object.entries(VALIDATORS).forEach(([field, validator]) => {
    const input = form.querySelector(`[name="${field}"]`);
    const value = input ? input.value : '';
    data[field] = value.trim();
    const result = validator(value);
    if (result !== true) {
      isValid = false;
      showFieldError(field, result);
    }
  });

  const paymentInput = form.querySelector('[name="payment"]:checked');
  if (!paymentInput) {
    isValid = false;
    showFieldError('payment', 'Select a payment method.');
  } else {
    data.payment = paymentInput.value;
  }

  return { isValid, data };
}

function estimatedDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 6);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.querySelector('[data-checkout-page]');
  if (!page) return;

  const catalog = await loadCatalog();

  // Edge case: checkout attempted with an empty cart → redirect to Shop.
  if (getCart().length === 0) {
    window.location.replace('shop.html');
    return;
  }

  const summary = renderCheckoutSummary(catalog);

  const form = document.querySelector('[data-checkout-form]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { isValid, data } = validateForm(form);
    if (!isValid) {
      form.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const latestSummary = renderCheckoutSummary(catalog); // guard against last-second cart changes
    const order = {
      orderRef: generateOrderRef(),
      createdAt: new Date().toISOString(),
      customer: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      paymentMethod: data.payment,
      items: latestSummary.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      subtotal: latestSummary.subtotal,
      shipping: latestSummary.shipping,
      total: latestSummary.total,
      estimatedDelivery: estimatedDeliveryDate(),
    };

    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    saveCart([]); // cart is cleared only after a successful order, per App-Flow §3.6

    window.location.href = 'order-confirmation.html';
  });
});
