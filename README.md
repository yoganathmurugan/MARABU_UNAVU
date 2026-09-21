# மரபு உணவு — Marabu Unavu

**Ancient Taste. Traditional Strength. Tamil Heritage.**
நம் முன்னோர் உணவு • நம் மரபு • நம் ஆரோக்கியம்

A front-end e-commerce coursework project built for **OFD352 — Traditional Indian Foods**, showcasing 17 real, historically documented South Indian food items that have largely disappeared from modern kitchens over the last 100–200 years.

## About This Project

Rather than a plain report, this project presents forgotten Tamil heritage foods (heritage millets, palmyra-based foods, temple/festival sweets, and traditional remedy foods) as a fully interactive e-commerce experience — because making these foods "sellable and desirable" again is itself the argument for reviving them.

## Features

- 17-item product catalog across 4 categories (Millet Staples, Forgotten Snacks, Festival & Travel Sweets, Forgotten Ingredients & Remedies)
- Dedicated **Regions** page mapping items to Tamil culinary regions
- Dedicated **Processing** page explaining traditional food-processing methods
- Fully working **Cart** and **Wishlist** (persisted via browser `localStorage`)
- Realistic multi-step **Checkout** flow with a generated order confirmation
- Fully responsive design (mobile / tablet / desktop)

## Tech Stack

HTML5 · CSS3 (custom, no framework) · Vanilla JavaScript (ES6+) · `localStorage` for cart/wishlist/order state · Google Fonts (Poppins + Noto Serif Tamil)

No backend, database, or build step is required to run this project — see `05-Backend-Schema.md` in the docs folder for the conceptual backend design this project could grow into.

## How to Run

1. Download/clone the project folder
2. Open `index.html` directly in any modern browser — **or**
3. Serve the folder with any static server (e.g., VS Code "Live Server" extension) for the most accurate experience

No `npm install`, no build step, no environment variables.

## Folder Structure

```
marabu-unavu/
├── index.html, shop.html, product.html, regions.html,
│   processing.html, about.html, cart.html, wishlist.html,
│   checkout.html, order-confirmation.html, contact.html
├── /css        style.css (tokens/layout), components.css (nav, cards, forms, etc.)
├── /js         data.js, render.js          — shared data loading + markup builders
│               cart.js, wishlist.js        — cart/wishlist state + page rendering
│               home.js, shop.js, product.js — per-page rendering logic
│               regions.js, processing.js    — Regions/Processing page logic
│               checkout.js, order-confirmation.js, contact.js — form flows
│               narratives.js — "Why It Disappeared" copy (sourced from 07-Product-Description.md)
│               main.js — nav, badges, global add-to-cart/wishlist handling, newsletter
├── /data       products.json (generated from docs/09-Database.xlsx)
├── /images     (unused — see note below)
├── /docs       original planning docs (01–09), kept for reference/grading
└── README.md
```

**Note on `/images`:** no product photography was supplied for this project. Rather than use generic stock photos (which the brief explicitly wants to avoid) or leave broken image tags, every product/category visual is CSS + inline SVG "placeholder art" themed per category. `/images` is kept as an empty folder in case real photography is added later.

## Known Limitations (by design, per assignment scope)

- Checkout is a **simulated** flow — no real payment gateway is integrated
- Contact form shows a success state but does not send a real email
- Cart/wishlist/order data is stored per-browser (`localStorage`), not in a shared database

## Known Data Notes (decisions made during the build)

A few gaps surfaced between the planning docs and the actual data in `09-Database.xlsx`. Documented here rather than silently resolved:

- **Chettinad region:** mentioned in the PRD/App-Flow/Design Brief as a region, but the spreadsheet's Regions sheet and all 17 products only map to 5 actual regions (no Chettinad). The Regions page uses the 5 real regions only.
- **Clay-pot cooking:** the PRD names this as one of four processing techniques to cover, but zero of the 17 products use it. The Processing page covers the three techniques the data supports (sun-drying, stone-grinding, fermentation) plus two broader groups for the remaining methods, so all 17 products are covered without fabricating a match.
- **Region assignments:** for 6 products, the region named in `07-Product-Description.md`'s prose doesn't match the `region_id` assigned in the spreadsheet (e.g. product 1 is written up as "Rural Tamil Nadu" but tagged `Thanjavur` in the data). The spreadsheet's `region_id` was treated as the source of truth.
- **Product imagery:** no photos were supplied; the site uses category-themed CSS/SVG placeholder art instead (see `/images` note above).
- **"Why It Disappeared" content:** sourced directly from `07-Product-Description.md`'s per-product notes, which that doc states are researched from published food-heritage sources.

## Credits

Built by **Yoganath M**.  

Product research grounded in documented South Indian/Tamil culinary heritage sources
