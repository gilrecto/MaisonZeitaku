# Maison Zeitaku Theme

Custom Shopify theme for Maison Zeitaku, built on top of Dawn `15.3.0` with a Vite and Tailwind CSS workflow plus bespoke storefront sections, product merchandising features, and customer-facing UX enhancements.

## Overview

This repository contains the Maison Zeitaku storefront theme, including:

- Dawn-based Liquid templates and theme settings
- Custom homepage and merchandising sections
- Enhanced product, collection, search, cart, and wishlist flows
- A modern front-end pipeline powered by Vite, Tailwind CSS v4, and Swiper

## Key Features

### Editorial homepage builder

- Custom `[MZ] Banner` section with image or Shopify-hosted video support
- Dedicated mobile image and mobile video assets for hero banners
- Flexible hero content blocks for headings, rich text, images, captions, and CTAs
- Custom `[MZ] Featured Collection` slider with configurable desktop, tablet, and mobile layouts
- Collection showcase, rich text, image-with-text, and multicolumn storytelling sections

### Merchandising and conversion

- Swiper-powered product carousels with configurable:
  - slides per breakpoint
  - spacing
  - loop
  - autoplay
  - navigation
  - pagination
  - mousewheel scrolling
  - optional destroy-on-mobile behavior
- Product cards with secondary image hover support
- Optional product and collection image animation controls in theme settings
- Quick add support on product cards in both standard and bulk modes
- Sale and sold-out badges with configurable positioning and color schemes
- Optional category display on product cards
- Variant color count display on collection product cards

### Product page enhancements

- Sticky product information column
- Custom `stacked_thumbnail` gallery layout for a centered PDP media experience
- Hover zoom support for product media
- Variant picker with button-style options and swatches
- Built-in pickup availability support
- Wishlist button directly beside add-to-cart
- Configurable collapsible service and policy rows
- Page-driven popup blocks for content such as product conditions or support
- Metafield-driven additional product features list using `product.metafields.data.addition_features`
- "Show more" toggle for long product feature lists
- Related products merchandising section

### Discovery and navigation

- Predictive search
- Full search template with filters and sorting
- Collection filtering with drawer, horizontal, or vertical facet layouts
- Infinite scroll collection grid option with filter/sort reset handling
- Custom mega menu support with up to 3 featured collections per configured menu item
- Country and language localization selectors in header and footer
- Currency code support through theme settings

### Customer experience

- Cart drawer, cart page, or cart notification modes
- Dedicated wishlist page at `/pages/wishlist`
- Local storage powered wishlist with header count bubble
- Customer account, login, register, address, order, and password templates
- Newsletter signup in the footer
- About and contact page templates
- Blog, article, gift card, password, 404, and standard page templates

### Theme editor flexibility

- Global controls for colors, typography, spacing, buttons, inputs, cards, badges, media, popups, and drawers
- Optional fluid layout container setting
- Adjustable page width and grid spacing
- 50+ locale files included for multilingual storefront support

## Included Templates

- Home: custom JSON homepage with hero banner, collection modules, featured collection slider, and editorial content
- Product: enhanced PDP with custom blocks, metafield-driven features, and related products
- Collection: filters, quick add, and infinite scroll support
- Search: predictive search plus searchable products, pages, and articles
- Pages: default page, About, Contact, Wishlist
- Blog and article
- Cart, password, gift card, and 404
- Customer account templates

## Tech Stack

- Shopify Liquid
- Dawn `15.3.0`
- Vite
- `vite-plugin-shopify`
- Tailwind CSS v4 with the `ts:` utility prefix
- Swiper
- Custom JavaScript modules for wishlist, infinite scroll, accordions, and lazy-loaded media

## Development

### Prerequisites

- Node.js
- npm
- Shopify CLI
- Access to a Shopify store with theme permissions

### Available scripts

```bash
npm install
npm run dev -- --store your-store.myshopify.com
npm run deploy -- --store your-store.myshopify.com --theme <theme-id>
npm run shopify:dev -- --store your-store.myshopify.com
npm run shopify:push -- --store your-store.myshopify.com --theme <theme-id>
npm run vite:build
```

Notes:

- `npm run dev` runs Shopify theme development and the Vite dev server together.
- `npm run deploy` builds the Vite assets first, then pushes the theme.
- Vite entrypoints are loaded from `layout/theme.liquid`.

## Project Structure

```text
assets/      Shopify theme assets and generated front-end bundles
config/      Theme settings schema and theme data
frontend/    Vite entrypoints, custom scripts, and custom styles
layout/      Theme shell files
sections/    Reusable Shopify sections, including custom MZ sections
snippets/    Shared Liquid snippets for UI and storefront logic
templates/   JSON and Liquid templates
locales/     Translation files
```

## Custom Notes

- Wishlist data is stored in browser `localStorage` and rendered on the Wishlist page client-side.
- Additional product features are sourced from `product.metafields.data.addition_features`.
- Infinite scroll is enabled at the collection template level and includes reset logic after filter and sort changes.
- The theme ships with both source files in `frontend/` and generated build artifacts in `assets/`.
