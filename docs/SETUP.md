# Setup guide — Appwrite, Telegram, deployment

This is the manual setup the application code assumes. Nothing here can
be automated safely from the repo (schema and secrets), so follow it in
order the first time you stand up the project.

## 0. Order of operations

1. Create an Appwrite project + database
2. Create the four tables below with their columns
3. Create the storage bucket
4. Create a server API key
5. Copy `.env.example` to `.env.local` and fill it in
6. Run `npm run seed`
7. Create/verify the admin login (the seed script can do this — see below)
8. Set up the Telegram bot
9. Deploy, and repeat step 5 with production values in your host's env settings

## 1. Appwrite project & database

1. Create a project on [Appwrite Cloud](https://cloud.appwrite.io) or your
   self-hosted instance (**Appwrite 1.8 or later** — this app uses the
   `TablesDB` API).
2. Note the **API endpoint** and **Project ID** →
   `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`.
3. Create a database (any name) → its ID is `APPWRITE_DATABASE_ID`.

## 2. Tables

Create each table below (Databases → your database → Create Table). The
column names must match exactly (case-sensitive) — the app reads them by
name. Types/sizes are Appwrite's native types; "Array" means tick the
"Array" option on that column.

Leave **collection/table permissions empty** on all four tables (no
roles). The app never uses a client-side session to read or write these
— every request goes through the server with the API key, which bypasses
permissions entirely. That's the most locked-down configuration
available and satisfies "public read for published items only" (the
server enforces that filter in code, not Appwrite permissions).

### `products` (env: `APPWRITE_PRODUCTS_COLLECTION_ID`, default `products`)

| Column | Type | Size | Required | Default | Array |
|---|---|---|---|---|---|
| name | String | 200 | Yes | | |
| slug | String | 120 | Yes | | |
| brand | String | 120 | Yes | | |
| categoryId | String | 64 | No | | |
| model | String | 160 | No | | |
| shortDescription | String | 400 | No | | |
| description | String | 8000 | No | | |
| price | Integer | | No | | |
| currency | String | 8 | No | `NGN` | |
| featured | Boolean | | No | `false` | |
| inStock | Boolean | | No | `true` | |
| published | Boolean | | No | `false` | |
| imageIds | String | 64 | No | | ✅ |
| specifications | String | 16000 | No | | |
| sortOrder | Integer | | No | `0` | |

`specifications` holds a JSON string: `[{"label":"Rated current","value":"25A"}]`
— the app (de)serialises it; don't edit it as plain text unless you know
the format.

**Indexes:** a **unique** index on `slug` (prevents duplicate URLs — the
app also checks this before writing, but a DB-level constraint is good
insurance). Key indexes on `published`, `categoryId` and `brand` are
optional — the catalogue currently filters in memory over a cached list,
so it works without them, but add them if the catalogue grows to many
hundreds of products.

### `categories` (env: `APPWRITE_CATEGORIES_COLLECTION_ID`, default `categories`)

| Column | Type | Size | Required | Default |
|---|---|---|---|---|
| name | String | 120 | Yes | |
| slug | String | 140 | Yes | |
| description | String | 500 | No | |
| sortOrder | Integer | | No | `0` |
| published | Boolean | | No | `true` |

**Indexes:** unique index on `slug`.

### `enquiries` (env: `APPWRITE_ENQUIRIES_COLLECTION_ID`, default `enquiries`)

| Column | Type | Size | Required | Default |
|---|---|---|---|---|
| productId | String | 64 | No | |
| productName | String | 200 | Yes | |
| productModel | String | 160 | No | |
| productPrice | Integer | | No | |
| productCurrency | String | 8 | No | |
| customerName | String | 120 | Yes | |
| phone | String | 40 | Yes | |
| quantity | Integer | | Yes | |
| message | String | 2000 | No | |
| source | String | 20 | Yes | |
| status | String | 20 | Yes | `new` |

No indexes required (admin view lists and sorts everything in memory).
`productName`/`productModel`/`productPrice`/`productCurrency` are
snapshots taken server-side at submission time — they stay accurate even
if the product is later edited or deleted.

### `settings` (env: `APPWRITE_SETTINGS_COLLECTION_ID`, default `settings`)

| Column | Type | Size | Required |
|---|---|---|---|
| businessName | String | 200 | No |
| legalName | String | 200 | No |
| email | String | 200 | No |
| phone | String | 40 | No |
| whatsapp | String | 40 | No |
| secondaryPhone | String | 40 | No |
| address | String | 300 | No |
| tagline | String | 200 | No |
| domain | String | 100 | No |
| telegramChatId | String | 64 | No |

This table holds a single row with ID `business`, created by
`npm run seed` (or create it by hand with that exact row ID). Every
field is optional because the app falls back to `lib/constants.ts` for
anything missing or if the table doesn't exist yet.

## 3. Storage bucket

Create a bucket (Storage → Create Bucket) for product photos:

- **Bucket ID** → `APPWRITE_BUCKET_ID` (e.g. `product-images`)
- **File Security: enabled.** The app grants each uploaded file
  `read: any` individually (server-side, at upload time) so product
  images are publicly viewable without exposing write access. With File
  Security off, you'd instead need bucket-level `read: any` permission.
- Leave bucket-level permissions empty — uploads/deletes only ever
  happen server-side with the API key.
- Max file size: 5MB (matches the app's own limit).
- Allowed extensions: `jpg, jpeg, png, webp, avif`.

## 4. API key

Create a server API key (Overview → Integrations → API Keys, or Settings
→ API Keys depending on your Appwrite version) → `APPWRITE_API_KEY`.

Grant scopes for: **Databases** (read + write), **Storage/Files**
(read + write), and **Users** (read + write — only needed if you want
`npm run seed` to create the first admin login). If your console groups
scopes differently, selecting "all scopes" for a first setup is fine;
you can narrow it later.

**Never expose this key to the browser.** It is only read from
`process.env` in server-only modules (`lib/appwrite/*.ts`, server
actions, the seed script).

## 5. Environment variables

Copy `.env.example` to `.env.local` and fill in the values from steps
1–4, plus:

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only, international format, no
  `+` or spaces (e.g. `2348064870941`).
- `NEXT_PUBLIC_SITE_URL` — the deployed site's URL (used for absolute
  links in the Telegram enquiry message and metadata).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — optional, only read by the seed
  script to create the first admin login.

See `.env.example` for the full list and `TELEGRAM_*` (step 7 below).

## 6. Seed the catalogue

```bash
npm run seed
```

Creates the 7 initial categories, the 4 confirmed products, the
`settings` row, and (if `ADMIN_EMAIL`/`ADMIN_PASSWORD` are set) the
first admin user. Safe to re-run — existing rows are matched by slug and
left untouched.

## 7. Admin login

Either:

- Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` before running `npm run seed`, or
- Create a user by hand in Appwrite Console → Auth → Users, with an
  email and password.

There is no public sign-up — anyone who can authenticate with a valid
Appwrite user in this project is treated as an admin. Sign in at
`/admin/login`.

## 8. Telegram bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram, run
   `/newbot`, and follow the prompts. Copy the token it gives you into
   `TELEGRAM_BOT_TOKEN`.
2. Get a chat ID to send alerts to:
   - **Personal chat:** send your new bot any message, then open
     `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and
     read `result[0].message.chat.id`.
   - **Group chat:** add the bot to a group, send a message in the
     group, then read the same URL — group chat IDs are negative
     numbers.
3. Put that ID in `TELEGRAM_CHAT_ID`, or in the `settings` row's
   `telegramChatId` field (the settings value takes priority, so you can
   change the notification target without a redeploy).

If Telegram isn't configured, enquiries still save normally — the app
only logs a warning server-side.

## 9. Deployment

Any Node 20.9+ host works (`npm run build && npm run start`). For
Vercel: import the repository, set every variable from `.env.example` in
Project Settings → Environment Variables, and deploy — the framework
preset is detected automatically.

After the first deploy, run `npm run seed` once from a machine that can
reach your Appwrite project (pointing `.env.local` at the production
values), or create the data by hand in the Appwrite console.
