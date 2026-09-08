// ==========================================================================
// regions.js — Regions page: tabs for the 5 real culinary regions in the
// data (Chettinad was dropped per project decision — see chat notes; it
// appeared in the docs but had no matching region/products in the source
// spreadsheet). Each tab shows the region's description and its products,
// with a "Shop This Region" link into shop.html?region=ID.
// ==========================================================================

let activeRegionId = null;
let regionsCatalog = null;

function readRegionParamFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('region');
}

function renderRegionTabs() {
  const el = document.querySelector('[data-region-tabs]');
  el.innerHTML = regionsCatalog.regions.map((r) => `
    <button
      type="button"
      class="region-tab${String(r.id) === String(activeRegionId) ? ' is-active' : ''}"
      role="tab"
      aria-selected="${String(r.id) === String(activeRegionId)}"
      data-region-tab="${r.id}"
    >${escapeHTML(r.name)}</button>
  `).join('');

  el.querySelectorAll('[data-region-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeRegionId = btn.getAttribute('data-region-tab');
      window.history.replaceState({}, '', `${window.location.pathname}?region=${activeRegionId}`);
      renderRegionTabs();
      renderRegionPanel();
    });
  });
}

function renderRegionPanel() {
  const region = regionsCatalog.regions.find((r) => String(r.id) === String(activeRegionId));
  if (!region) return;

  document.querySelector('[data-region-description]').textContent = region.description || '';

  const products = regionsCatalog.products.filter((p) => String(p.regionId) === String(region.id));
  document.querySelector('[data-region-products]').innerHTML = products
    .map((p) => productCardHTML(p, { wishlisted: isWishlisted(p.id) }))
    .join('');

  document.querySelector('[data-region-shop-link]').setAttribute('href', `shop.html?region=${region.id}`);
}

document.addEventListener('DOMContentLoaded', async () => {
  regionsCatalog = await loadCatalog();

  const requested = readRegionParamFromURL();
  const validIds = regionsCatalog.regions.map((r) => String(r.id));
  activeRegionId = validIds.includes(requested) ? requested : regionsCatalog.regions[0]?.id;

  renderRegionTabs();
  renderRegionPanel();
});
