# Dev Chatbox — Ventum Admin

Async coordination file for whoever is working on this repo, since we
don't otherwise have a way to talk to each other in real time and two
sessions editing the same files blind has already caused real damage
here (hero.tsx got rewritten out from under a build in progress; the
repo got fully wiped twice). Read this file before touching `/admin`
or the product/category/brand data model. Append, don't rewrite —
newest entry at the bottom.

**Rules of the road:**
- Before starting a stage below, add a log entry claiming it (`Stage N — claimed by <name>, starting <what>`).
- Before editing a file someone else is actively touching, check the log for a recent claim on it.
- When a stage is done, log what actually shipped (not just what was planned — plans drift).
- If you change a decision made here, don't silently diverge — log why.

---

## Ground rules from the client (Henry), settled 2026-09-13

- **No stock-quantity management.** `inStock` stays a simple boolean
  (in stock / not). Do not add unit counts, low-stock thresholds, or
  inventory tracking — out of scope, not requested.
- **Drop `featured` entirely.** Replace it with two independent
  boolean badges: **New Arrival** and **Now Available**. A product can
  be either, both, or neither. These are marketing tags, not the same
  thing as `published`/`inStock` (a product can be published and in
  stock without being tagged as either).

---

## The 10-stage plan

**Stage 1 — Data model: retire `featured`, add New Arrival / Now Available**
Add `isNewArrival` and `isNowAvailable` boolean columns to the
`products` table (default `false`). Remove `featured` from the type,
data-layer mapper, admin row editor, and the homepage's
`getFeaturedProducts()` — replace with equivalent
`getNewArrivals()` / `getNowAvailable()` reads. Update the 4 existing
product rows with sensible initial values. Everything downstream
(product cards, homepage sections, admin) touches this field, so it
goes first.

**Stage 2 — Full product CRUD in admin**
Right now the admin can only tweak price/inStock/published on
products that already exist. Add: a "create product" form (all real
fields — name, brand, model, slug, description, shortDescription, a
specifications editor, category picker, price, the two badges), full
edit (not just four fields), and delete with a confirmation step.

**Stage 3 — Product image management**
Upload to the Appwrite Storage bucket from the admin UI, reorder
multiple images, delete an image, set which one is primary. Per
VENTUM_STARTER.md §13 (image integrity), replacing a product's photo
should require an explicit confirm step — no silent overwrites of a
nameplate-critical shot.

**Stage 4 — Category management**
The `categories` table (Circuit Breakers, Contactors & Relays, Solar
Protection, etc.) has zero admin UI today. Add CRUD (name, slug,
description, sortOrder, published), and let the product form assign a
category from this managed list instead of a raw ID.

**Stage 5 — Brand management (make it data-driven)**
The 7 manufacturer logos on the homepage strip and `/brands` page are
a hardcoded array in component code right now. Move them into a real
`brands` table (name, logo asset refs for black/white variants,
sortOrder, published) with admin CRUD, and point both components at
that data instead of the hardcoded list.

**Stage 6 — Enquiry workflow depth**
Current admin enquiry inbox is status-only (new/read/responded/closed)
with a hard 100-row cap and no search. Add: an internal notes field
per enquiry, filter/search (by status, product, date), and real
pagination instead of the cap.

**Stage 7 — Settings completeness + Telegram wiring**
The `settings` table already has an unused `telegramChatId` column —
`notifyTelegram()` currently reads the chat ID from an env var and
ignores it. Wire it up so the admin settings form actually controls
where notifications go. Also add the RC number to the settings schema
(it's hardcoded in `site-config.ts` right now, which means it can't be
corrected without a code change) and expose `domain` in the form. Add
a "send test notification" button so the admin isn't just hoping
Telegram still works.

**Stage 8 — Telegram interactive layer**
Biggest single UX win available: a Telegram webhook so the admin can
act on an enquiry notification without opening the web dashboard —
inline buttons ("Mark responded" / "Close") directly on the message,
plus simple commands (`/enquiries`, `/stock <model>`) for a phone-first
shop owner. Needs a new `/api/telegram/webhook` route and signature
verification so it can't be spoofed.

**Stage 9 — Custom admin component library**
Pull the repeated ad-hoc markup in `/admin/*` pages into real shared
components: a data table, a modal/dialog, an image-upload widget, a
toast/status system, consistent form fields. This is the "custom
components" work — do it once the data model (stages 1-5) has
stabilized, not before, or the components will be built against
fields that are about to change.

**Stage 10 — QA and handoff verification**
Full `pnpm build` + `pnpm lint` pass, manual click-through of every new
admin flow, re-run the §13/§14 audit against whatever image-upload
and brand-management UI landed, confirm the Telegram webhook rejects
unsigned requests, and log final status here.

---

## Log

**2026-09-13 — Claude (this session)**
Wrote this file and the plan above per Henry's direction. I'm not
starting execution on these stages yet — handing this off for
coordination first. Current admin state as of commit `63404cb` on
`main`: auth (login/logout, single admin session), dashboard, Products
(price/inStock/published/featured inline edit only — featured needs
to come out per the ground rules above), Enquiries (status workflow
only), Settings (business info, missing RC/telegramChatId/domain).
Public site: home, /products, /products/[slug], /about, /brands,
/contact — all live on `main`. If you're picking this up, claim a
stage above before editing anything under `src/app/admin/` or the
product/category data layer so we don't collide again.
