// ==========================================================================
// shop.js — Shop page: category chips, region dropdown, search, and
// URL deep-linking (?category=ID, ?region=ID) from Home / Regions links.
// Add to Cart / wishlist clicks stay inert until Stage 4.
// ==========================================================================

let shopState = {
  category: 'all',
  region: 'all',
  search: '',
};

function readShopParamsFromURL() {
  const params = new URLSearchParams(window.location.search);
  shopState.category = params.get('category') || 'all';
  shopState.region = params.get('region') || 'all';
  shopState.search = params.get('q') || '';
}

function renderCategoryChips(catalog) {
  const el = document.querySelector('[data-category-filters]');
  if (!el) return;

  const chips = [{ id: 'all', name: 'All' }, ...catalog.categories];
  el.innerHTML = chips.map((c) => `
    <button
      type="button"
      class="filter-chip${String(c.id) === String(shopState.category) ? ' is-active' : ''}"
      data-category-chip="${c.id}"
    >${escapeHTML(c.name)}</button>
  `).join('');

  el.querySelectorAll('[data-category-chip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      shopState.category = btn.getAttribute('data-category-chip');
      syncURL();
      applyFilters();
      renderCategoryChips(currentCatalog);
    });
  });
}

function renderRegionOptions(catalog) {
  const select = document.querySelector('[data-region-filter]');
  if (!select) return;

  select.innerHTML = [
    `<option value="all">All Regions</option>`,
    ...catalog.regions.map((r) => `<option value="${r.id}">${escapeHTML(r.name)}</option>`),
  ].join('');
  select.value = shopState.region;

  select.addEventListener('change', () => {
    shopState.region = select.value;
    syncURL();
    applyFilters();
  });
}

function syncURL() {
  const params = new URLSearchParams();
  if (shopState.category !== 'all') params.set('category', shopState.category);
  if (shopState.region !== 'all') params.set('region', shopState.region);
  if (shopState.search) params.set('q', shopState.search);
  const query = params.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
  window.history.replaceState({}, '', newUrl);
}

function applyFilters() {
  const catalog = currentCatalog;
  if (!catalog) return;

  const term = shopState.search.trim().toLowerCase();

  const filtered = catalog.products.filter((p) => {
    const matchesCategory = shopState.category === 'all' || String(p.categoryId) === String(shopState.category);
    const matchesRegion = shopState.region === 'all' || String(p.regionId) === String(shopState.region);
    const matchesSearch = !term ||
      p.name.toLowerCase().includes(term) ||
      (p.tamilName || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term) ||
      (p.region || '').toLowerCase().includes(term);
    return matchesCategory && matchesRegion && matchesSearch;
  });

  const grid = document.querySelector('[data-shop-grid]');
  const emptyState = document.querySelector('[data-shop-empty]');
  const countEl = document.querySelector('[data-result-count]');

  if (countEl) {
    countEl.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
  } else {
    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = filtered.map((p) => productCardHTML(p, { wishlisted: isWishlisted(p.id) })).join('');
  }
}

let currentCatalog = null;

document.addEventListener('DOMContentLoaded', async () => {
  readShopParamsFromURL();
  currentCatalog = await loadCatalog();

  renderCategoryChips(currentCatalog);
  renderRegionOptions(currentCatalog);
  applyFilters();

  const searchInput = document.querySelector('[data-shop-search]');
  if (searchInput) {
    searchInput.value = shopState.search;
    searchInput.addEventListener('input', () => {
      shopState.search = searchInput.value;
      syncURL();
      applyFilters();
    });
  }

  const clearBtn = document.querySelector('[data-clear-filters]');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      shopState = { category: 'all', region: 'all', search: '' };
      syncURL();
      if (searchInput) searchInput.value = '';
      document.querySelector('[data-region-filter]').value = 'all';
      renderCategoryChips(currentCatalog);
      applyFilters();
    });
  }
});
