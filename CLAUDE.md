# Smart Packing List Generator

## Project Philosophy

This is a **single-page application** and must remain one forever. Do not split it into multiple pages, add routing, or introduce any multi-page architecture. Keep it as simple as possible.

## Architecture

- Vanilla JavaScript (ES6 modules), no framework
- TailwindCSS v4 for styling
- Vite builds everything into a single `dist/index.html` via vite-plugin-singlefile
- Deployed to GitHub Pages

## Key Rules

- **Keep it simple.** Resist adding complexity. This is a personal packing list tool, not a platform.
- **Single HTML page only.** No routing, no SPA framework, no multi-page setup.
- **No local npm installs.** Run all npm/node commands in Docker containers.
- **Vanilla JS only.** No React, Vue, Svelte, or any UI framework. Ever.
- **Immutable data patterns.** Don't mutate objects in place; create new ones.

## Structure

- `src/index.html` — the single page
- `src/js/` — ES6 modules (main, state, storage, packingList, ui, customItems, templates, export, notifications, validation, i18n)
- `src/styles/` — accessibility and print CSS
- `dist/` — build output (single inlined HTML file)

## Build

```bash
docker run --rm -v "$(pwd):/app" -w /app node:20 npm install
docker run --rm -v "$(pwd):/app" -w /app node:20 npm run build
```
