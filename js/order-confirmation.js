// ==========================================================================
// order-confirmation.js — reads localStorage['mu_lastOrder'] (set by
// checkout.js) and renders the confirmation. If no order exists (e.g. the
// page was opened directly), shows a fallback state instead of erroring.
// ==========================================================================

function readLastOrder() {
  try {
    const raw = localStorage.getItem('mu_lastOrder');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Could not read last order', err);
    return null;
  }
}

function renderConfirmation(order) {
  document.querySelector('[data-confirmation-content]').hidden = false;
  document.querySelector('[data-confirmation-empty]').hidden = true;

  document.querySelector('[data-confirmation-name]').textContent = order.customer?.name ? `, ${order.customer.name}` : '';
  document.querySelector('[data-confirmation-ref]').textContent = order.orderRef;
  document.querySelector('[data-confirmation-payment]').textContent = order.paymentMethod;
  document.querySelector('[data-confirmation-eta]').textContent = order.estimatedDelivery;

  document.querySelector('[data-confirmation-items]').innerHTML = order.items.map((item) => `
    <div class="checkout-summary-line">
      <span>${escapeHTML(item.name)} &times; ${item.quantity}</span>
      <span>${formatPrice(item.unitPrice * item.quantity)}</span>
    </div>
  `).join('');

  document.querySelector('[data-confirmation-subtotal]').textContent = formatPrice(order.subtotal);
  document.querySelector('[data-confirmation-shipping]').textContent = order.shipping === 0 ? 'Free' : formatPrice(order.shipping);
  document.querySelector('[data-confirmation-total]').textContent = formatPrice(order.total);

  const c = order.customer || {};
  document.querySelector('[data-confirmation-address]').textContent =
    `${c.address || ''}, ${c.city || ''}, ${c.state || ''} - ${c.pincode || ''}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('[data-confirmation-page]');
  if (!page) return;

  const order = readLastOrder();
  if (!order) {
    document.querySelector('[data-confirmation-content]').hidden = true;
    document.querySelector('[data-confirmation-empty]').hidden = false;
    return;
  }

  renderConfirmation(order);
});
