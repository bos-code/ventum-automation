// Copies the live published catalogue (products, categories and their
// photos) out of Appwrite into the repo, so the public site can still show
// it while Appwrite is unreachable (e.g. the project is paused).
//
// Writes src/data/catalogue-snapshot.json and public/catalogue-snapshot/*.
// Any Appwrite failure exits non-zero WITHOUT touching the existing
// snapshot. Refuses to replace a non-empty snapshot with an empty one
// unless --allow-empty is passed.
//
// Run: node --env-file=.env.local scripts/snapshot-catalogue.mjs
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { Client, TablesDB, Storage, Query } from 'node-appwrite';

const e = process.env;
for (const name of ['NEXT_PUBLIC_APPWRITE_ENDPOINT', 'NEXT_PUBLIC_APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY', 'APPWRITE_DATABASE_ID', 'APPWRITE_BUCKET_ID']) {
  if (!e[name]) { console.error(`Missing required environment variable: ${name}`); process.exit(1); }
}
const productsTable = e.APPWRITE_PRODUCTS_COLLECTION_ID || 'products';
const categoriesTable = e.APPWRITE_CATEGORIES_COLLECTION_ID || 'categories';

const SNAPSHOT_FILE = 'src/data/catalogue-snapshot.json';
const IMAGE_DIR = 'public/catalogue-snapshot';
const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

const client = new Client().setEndpoint(e.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(e.NEXT_PUBLIC_APPWRITE_PROJECT_ID).setKey(e.APPWRITE_API_KEY);
const db = new TablesDB(client);
const storage = new Storage(client);

async function listAllPublished(tableId) {
  const rows = [];
  let cursor;
  for (;;) {
    const page = await db.listRows({
      databaseId: e.APPWRITE_DATABASE_ID,
      tableId,
      queries: [Query.equal('published', true), Query.orderAsc('sortOrder'), Query.limit(100), ...(cursor ? [Query.cursorAfter(cursor)] : [])],
    });
    rows.push(...page.rows);
    if (page.rows.length < 100) return rows;
    cursor = page.rows[page.rows.length - 1].$id;
  }
}

// Keep only the fields mapProduct/mapCategory read, so the snapshot holds
// no Appwrite internals (permissions, database ids, ...).
const pick = (row, keys) => Object.fromEntries(['$id', ...keys].map((k) => [k, row[k] ?? null]));
const PRODUCT_KEYS = ['name', 'slug', 'brand', 'categoryId', 'model', 'shortDescription', 'description', 'price', 'currency', 'isNewArrival', 'isNowAvailable', 'inStock', 'published', 'imageIds', 'specifications', 'sortOrder'];
const CATEGORY_KEYS = ['name', 'slug', 'description', 'sortOrder', 'published'];

const products = (await listAllPublished(productsTable)).map((row) => pick(row, PRODUCT_KEYS));
const categories = (await listAllPublished(categoriesTable)).map((row) => pick(row, CATEGORY_KEYS));

const previous = existsSync(SNAPSHOT_FILE) ? JSON.parse(await readFile(SNAPSHOT_FILE, 'utf8')) : null;
if (products.length === 0 && (previous?.products?.length ?? 0) > 0 && !process.argv.includes('--allow-empty')) {
  console.error('Appwrite returned 0 published products but the snapshot has some; refusing to overwrite (pass --allow-empty if intended).');
  process.exit(1);
}

// Appwrite file ids are immutable, so an already-downloaded photo is reused.
await mkdir(IMAGE_DIR, { recursive: true });
const existingFiles = new Set((await readdir(IMAGE_DIR)).filter((f) => !f.startsWith('.')));
const images = {};
for (const fileId of [...new Set(products.flatMap((p) => p.imageIds ?? []))].sort()) {
  const already = [...existingFiles].find((f) => f.startsWith(`${fileId}.`));
  if (already) { images[fileId] = `/catalogue-snapshot/${already}`; continue; }
  const meta = await storage.getFile({ bucketId: e.APPWRITE_BUCKET_ID, fileId });
  const ext = EXTENSIONS[meta.mimeType];
  if (!ext) { console.warn(`Skipping ${fileId}: unsupported type ${meta.mimeType}`); continue; }
  const data = await storage.getFileView({ bucketId: e.APPWRITE_BUCKET_ID, fileId });
  await writeFile(`${IMAGE_DIR}/${fileId}.${ext}`, Buffer.from(data));
  images[fileId] = `/catalogue-snapshot/${fileId}.${ext}`;
  console.log('Downloaded image:', fileId);
}
const keep = new Set(Object.values(images).map((p) => p.split('/').pop()));
for (const file of existingFiles) {
  if (!keep.has(file)) { await rm(`${IMAGE_DIR}/${file}`); console.log('Removed unused image:', file); }
}

const content = { products, categories, images };
const unchanged = previous && JSON.stringify({ products: previous.products, categories: previous.categories, images: previous.images }) === JSON.stringify(content);
if (unchanged) {
  console.log(`Snapshot unchanged (${products.length} products, ${categories.length} categories).`);
} else {
  await writeFile(SNAPSHOT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), ...content }, null, 2) + '\n');
  console.log(`Snapshot updated: ${products.length} products, ${categories.length} categories, ${Object.keys(images).length} images.`);
}
