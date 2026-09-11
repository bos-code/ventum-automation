# Ventum Global Automation

A product-catalogue and lead-generation website for Ventum Global
Automation: browse products, submit enquiries (saved to Appwrite and
sent to Telegram instantly), or continue on WhatsApp. A small admin area
lets the owner manage products, categories and enquiries without
developer help.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values — see docs/SETUP.md
npm run seed                 # once Appwrite is configured
npm run dev
```

- **`docs/SETUP.md`** — Appwrite (database/collections/storage/auth),
  Telegram bot, environment variables, deployment. Read this first if
  you're standing the project up from scratch.
- **`docs/PROJECT_BRIEF.md`**, **`docs/CONTENT_INVENTORY.md`**,
  **`docs/ASSET_GUIDE.md`** — original project brief, seed content and
  brand/asset handling rules.

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

Reference material (Figma exports, client photos, brand source files)
belongs under `reference/` (gitignored-by-convention working files, not
committed unless small).

## Stack

- Next.js 16 (App Router) + TypeScript, Tailwind CSS v4
- Appwrite (`node-appwrite` / TablesDB): admin auth, database, product
  image storage — all access is server-mediated, no client-side SDK
- React Hook Form + Zod for every form, Sonner for notifications
- Telegram Bot API for server-side enquiry alerts
- WhatsApp deep links (`wa.me`) for direct conversation

## Product scope

This is a lightweight product catalogue and lead-generation website, not
a full e-commerce system: no cart, checkout, payments or customer
accounts. Visitors browse products, submit product enquiries, and
optionally continue directly on WhatsApp. The owner gets a minimal admin
interface to add, edit, publish/unpublish and remove products and
categories, and to track enquiries.

## Routes

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, categories, featured products, brands, about, contact |
| `/products` | Catalogue with search, category/brand filters, pagination |
| `/products/[slug]` | Product detail — gallery, specs, enquiry + WhatsApp |
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard |
| `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit` | Product CRUD |
| `/admin/categories` | Category CRUD + reorder |
| `/admin/enquiries` | Enquiry list + status |

## Business

- Customer-facing name: Ventum Global Automation
- Legal name: Ventum Global Services Ltd
- Tagline: High Value and Quality Commodities
- RC: 3777637
- Address: F1626 Alaba International Market, Ojo, Lagos, Nigeria
- WhatsApp: +234 806 487 0941
- Secondary phone: 07055595398
- Email: ventumglobal@gmail.com
- Domain: ventumautomation.com

## Brand rule

The client-supplied Ventum logo must not be redesigned, recoloured, distorted, redrawn or stylistically reinterpreted. It may only be sharpened/cleaned while preserving the original artwork. Drop the supplied files into `public/brand/` (see that folder's README) — the header currently renders a plain wordmark placeholder until they're added.
