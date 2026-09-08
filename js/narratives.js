// ==========================================================================
// narratives.js — "Why It Disappeared" story blocks.
//
// CORRECTION (Stage 7): In Stage 3 this file used generic invented copy
// because the spreadsheet (09-Database.xlsx) has no "why it disappeared"
// field. That check missed that 07-Product-Description.md *does* contain
// a real, researched one-liner per product (per its own sourcing note:
// "researched from published food-heritage sources — not invented").
// Replaced below with that actual authored content, verbatim from your doc.
// ==========================================================================

const WHY_DISAPPEARED = {
  1: "Replaced by instant/packaged breakfast cereals and idli-dosa batter culture as agricultural lifestyles urbanized.",
  2: "Time-intensive preparation lost out to quick rice-based meals as households urbanized.",
  3: "Polished rice became the default staple after the Green Revolution prioritized rice/wheat.",
  4: "Overshadowed by standard rice-urad dosa batter as the default \u201cdosa\u201d in most homes.",
  5: "Refined sugar-based sweets became cheaper and more widely available commercially.",
  6: "Younger, urban generations shifted to packaged snacks; the dish is now unknown to most city households.",
  7: "Time-consuming multi-step preparation lost out to quicker breakfast options.",
  8: "Simpler poriyal (stir-fry) preparations became the default as home-cooking time shrank.",
  9: "The complex, time-intensive technique is now made only for major festivals by a shrinking number of households.",
  10: "Largely confined today to specific temple rituals rather than everyday or common festival cooking.",
  11: "Replaced by modern biryani/pulao variations influenced by other regional cuisines.",
  12: "Modern batter recipes dropped medicinal-flower additions in favor of plain rice-urad batter.",
  13: "Urban buyers lost access/awareness as palmyra cultivation declined near cities.",
  14: "Refined white sugar became cheaper and more shelf-stable, displacing traditional palm jaggery.",
  15: "Replaced by generic \u201cpostpartum\u201d packaged supplements and changing home-remedy traditions.",
  16: "Confined to religious contexts rather than kept as an everyday household dish.",
  17: "Bitter-flavored traditional dishes fell out of favor as younger palates shifted toward milder, sweeter modern food.",
};

function whyItDisappeared(productId) {
  return WHY_DISAPPEARED[productId] || null;
}
