// ==========================================================================
// data.js — fetches /data/products.json once and caches it in memory.
// NOTE: fetch() of a local JSON file is blocked by CORS under the bare
// file:// protocol in some browsers (notably Chrome). Run this project
// through a static server (e.g. VS Code "Live Server") for reliable
// results — see README.
// ==========================================================================

const DATA_URL = '/data/products.json';

let dataPromise = null;

function resolveDataUrl() {
  // Works whether the page is served from the root or opened via a
  // relative path; falls back to a relative reference.
  return new URL('data/products.json', document.baseURI).pathname.startsWith('//')
    ? DATA_URL
    : new URL('data/products.json', document.baseURI).href;
}

function loadCatalog() {
  if (!dataPromise) {
    dataPromise = fetch(resolveDataUrl())
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load products.json: ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.error(err);
        return { categories: [], regions: [], products: [] };
      });
  }
  return dataPromise;
}

function getProductBySlugOrId(catalog, idOrSlug) {
  if (!idOrSlug) return null;
  return (
    catalog.products.find((p) => String(p.id) === String(idOrSlug)) ||
    catalog.products.find((p) => p.slug === idOrSlug) ||
    null
  );
}

function formatPrice(inr) {
  return `\u20B9${Number(inr).toLocaleString('en-IN')}`;
}
