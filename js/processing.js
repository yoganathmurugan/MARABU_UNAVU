// ==========================================================================
// processing.js — Processing page. Technique groups are derived from the
// actual `processingMethod` text in products.json via keyword matching,
// not hardcoded product lists, so they stay accurate if the data changes.
//
// NOTE: The PRD/Design Brief name four techniques to cover — sun-drying,
// stone-grinding, fermentation, and clay-pot cooking. The first three are
// well represented in the data; "clay-pot cooking" has zero matching
// products anywhere in the 17-item dataset. Rather than fabricate a match,
// this page covers the techniques the data actually supports, plus a
// broader "Traditional Cooking & Tempering" group for methods (boiling,
// steaming, tempering, slow-cooking) that make up the majority of items
// but aren't part of the PRD's four. Flagged to the user — see chat.
// ==========================================================================

const TECHNIQUES = [
  {
    id: 'sun-drying',
    title: 'Sun-Drying',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>`,
    match: /sun-dried/i,
    description: 'Grains, flowers, and sprouts were spread out under direct sun for days at a time, drawing out moisture naturally so the ingredient could be stored for months without refrigeration. It\u2019s one of the oldest food-preservation techniques in South Indian households, and it depends entirely on consistent sun and open courtyard space — both harder to come by in dense modern housing.',
  },
  {
    id: 'stone-grinding',
    title: 'Stone-Grinding',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><ellipse cx="12" cy="8" rx="4" ry="2.2"/><path d="M8 8v1M16 8v1"/></svg>`,
    match: /stone-ground/i,
    description: 'Grains were ground between a stone mortar and pestle (ammikal) or a hand-turned quern, a slow process that generates far less heat than a mechanized mill — which helps preserve delicate oils and nutrients in the grain. It was also physically demanding, traditionally done seated on the floor for long stretches, a labor that modern electric mills replaced almost entirely.',
  },
  {
    id: 'fermentation',
    title: 'Fermentation',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-1 4H8L7 3Z"/><path d="M8 7l-1.5 12a2 2 0 0 0 2 2.2h7a2 2 0 0 0 2-2.2L16 7"/><circle cx="10.5" cy="14" r=".6" fill="currentColor" stroke="none"/><circle cx="13.5" cy="16.5" r=".6" fill="currentColor" stroke="none"/><circle cx="12" cy="11.5" r=".6" fill="currentColor" stroke="none"/></svg>`,
    match: /fermented/i,
    description: 'Batters and doughs were left to ferment naturally over several hours, relying on wild yeasts and bacteria already present in the grain and the air rather than any added starter. This develops flavor and makes the final food easier to digest — but it requires patience and the right ambient warmth, both of which are easy to skip with instant, chemically-leavened alternatives.',
  },
  {
    id: 'roasting-hand-prep',
    title: 'Roasting & Hand-Rolling',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c2 2.5 3 4.5 3 6.5a3 3 0 0 1-6 0C9 6.5 10 4.5 12 2Z"/><path d="M6 14c0-2 1-3 2-3.5"/><path d="M18 14c0-2-1-3-2-3.5"/><path d="M5 20c0-3 3-5.5 7-5.5s7 2.5 7 5.5"/></svg>`,
    match: /roasted|hand-rolled/i,
    description: 'Grains and spices were dry-roasted in a heavy pan to deepen their aroma before grinding, then often hand-shaped into laddoos or fine podis while still warm. This was typically festival-time work done in batches for the whole extended family — a scale and occasion that shrank along with joint-family kitchens.',
  },
  {
    id: 'traditional-cooking',
    title: 'Traditional Cooking & Tempering',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v3a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6v-3Z"/><path d="M4 11a8 8 0 0 1 4-7"/><path d="M20 11a8 8 0 0 0-4-7"/><path d="M9 4v2M12 3v2M15 4v2"/></svg>`,
    match: /boiled|tempered|slow-cooked|one-pot|steamed|pan-fried|deep-fried|tapped/i,
    description: 'The largest group of techniques in this collection: slow one-pot cooking, boiling, steaming, and tempering whole spices in hot oil or ghee (thalikka) to release their aroma before mixing them into a dish. Many of these methods traditionally used a wood or coal fire and needed close attention over long stretches — time that quick modern one-pan recipes were designed to save.',
  },
];

function buildTechniqueGroups(catalog) {
  return TECHNIQUES.map((tech) => ({
    ...tech,
    products: catalog.products.filter((p) => tech.match.test(p.processingMethod || '')),
  }));
}

function renderProcessingNav(groups) {
  const nav = document.querySelector('[data-processing-nav]');
  nav.innerHTML = groups
    .filter((g) => g.products.length > 0)
    .map((g) => `<a href="#${g.id}">${escapeHTML(g.title)}</a>`)
    .join('');
}

function renderProcessingSections(groups) {
  const container = document.querySelector('[data-processing-methods]');
  container.innerHTML = groups
    .filter((g) => g.products.length > 0)
    .map((g) => `
      <section class="processing-method" id="${g.id}">
        <div class="processing-method-head">
          <div class="processing-method-icon" aria-hidden="true">${g.icon}</div>
          <h2>${escapeHTML(g.title)}</h2>
        </div>
        <p class="processing-method-desc">${escapeHTML(g.description)}</p>
        <div class="product-grid">
          ${g.products.map((p) => productCardHTML(p, { wishlisted: isWishlisted(p.id) })).join('')}
        </div>
      </section>
    `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const catalog = await loadCatalog();
  const groups = buildTechniqueGroups(catalog);
  renderProcessingNav(groups);
  renderProcessingSections(groups);
});
