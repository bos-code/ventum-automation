/**
 * Create the Appwrite database, tables, columns and indexes this project
 * needs, if they don't already exist.
 *
 * Usage:
 *   npm run bootstrap-schema
 *
 * Idempotent — safe to re-run. Skips anything that already exists rather
 * than erroring, so you can also use it to "fill in" a partially set up
 * project. Column creation is asynchronous in Appwrite, so this script
 * polls each table until its new columns report status "available"
 * before creating indexes.
 *
 * This is the scripted alternative to the manual console steps in
 * docs/SETUP.md — both produce the same schema.
 */
import { Client, TablesDB, TablesDBIndexType } from "node-appwrite";

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const endpoint = requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
const projectId = requireEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
const apiKey = requireEnv("APPWRITE_API_KEY");
const databaseId = requireEnv("APPWRITE_DATABASE_ID");

const TABLE_IDS = {
  products: requireEnv("APPWRITE_PRODUCTS_COLLECTION_ID", "products"),
  categories: requireEnv("APPWRITE_CATEGORIES_COLLECTION_ID", "categories"),
  enquiries: requireEnv("APPWRITE_ENQUIRIES_COLLECTION_ID", "enquiries"),
  settings: requireEnv("APPWRITE_SETTINGS_COLLECTION_ID", "settings"),
};

const PLACEHOLDERS = ["placeholder-project", "placeholder-api-key", ""];
if (PLACEHOLDERS.includes(projectId) || PLACEHOLDERS.includes(apiKey)) {
  console.error(
    "✖ .env.local still has placeholder Appwrite values. Fill in the real endpoint, project ID and API key before running this.",
  );
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tables = new TablesDB(client);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDatabase() {
  try {
    await tables.get({ databaseId });
    console.log(`= database "${databaseId}" already exists`);
  } catch {
    await tables.create({ databaseId, name: databaseId });
    console.log(`+ created database "${databaseId}"`);
  }
}

type ColumnSpec =
  | {
      key: string;
      kind: "string";
      size: number;
      required?: boolean;
      default?: string;
      array?: boolean;
    }
  | {
      key: string;
      kind: "integer";
      required?: boolean;
      default?: number;
    }
  | {
      key: string;
      kind: "boolean";
      required?: boolean;
      default?: boolean;
    };

interface IndexSpec {
  key: string;
  type: TablesDBIndexType;
  columns: string[];
}

interface TableSpec {
  id: string;
  name: string;
  columns: ColumnSpec[];
  indexes?: IndexSpec[];
}

async function createColumn(tableId: string, col: ColumnSpec) {
  const base = { databaseId, tableId, key: col.key, required: col.required ?? false };
  if (col.kind === "string") {
    await tables.createStringColumn({
      ...base,
      size: col.size,
      array: col.array,
      // Appwrite rejects a default on a required column.
      xdefault: col.required ? undefined : col.default,
    });
  } else if (col.kind === "integer") {
    await tables.createIntegerColumn({
      ...base,
      xdefault: col.required ? undefined : col.default,
    });
  } else {
    await tables.createBooleanColumn({
      ...base,
      xdefault: col.required ? undefined : col.default,
    });
  }
}

async function waitForColumns(tableId: string, keys: string[], timeoutMs = 60_000) {
  if (keys.length === 0) return;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await tables.listColumns({ databaseId, tableId });
    const relevant = res.columns.filter((c) => keys.includes(c.key));
    const failed = relevant.find((c) => c.status === "failed");
    if (failed) {
      throw new Error(
        `Column ${tableId}.${failed.key} failed to create: ${failed.error || "unknown error"}`,
      );
    }
    if (relevant.length === keys.length && relevant.every((c) => c.status === "available")) {
      return;
    }
    await sleep(1000);
  }
  throw new Error(`Timed out waiting for columns on "${tableId}" to become available`);
}

async function ensureTable(spec: TableSpec) {
  try {
    await tables.getTable({ databaseId, tableId: spec.id });
    console.log(`= table "${spec.id}" already exists`);
  } catch {
    await tables.createTable({ databaseId, tableId: spec.id, name: spec.name });
    console.log(`+ created table "${spec.id}"`);
  }

  const existingColumns = (await tables.listColumns({ databaseId, tableId: spec.id }))
    .columns;
  const existingKeys = new Set(existingColumns.map((c) => c.key));

  const newlyCreated: string[] = [];
  for (const col of spec.columns) {
    if (existingKeys.has(col.key)) continue;
    await createColumn(spec.id, col);
    newlyCreated.push(col.key);
    console.log(`  + column ${spec.id}.${col.key}`);
  }

  await waitForColumns(spec.id, newlyCreated);

  if (spec.indexes?.length) {
    const existingIndexKeys = new Set(
      (await tables.listIndexes({ databaseId, tableId: spec.id })).indexes.map((i) => i.key),
    );
    for (const idx of spec.indexes) {
      if (existingIndexKeys.has(idx.key)) continue;
      await tables.createIndex({
        databaseId,
        tableId: spec.id,
        key: idx.key,
        type: idx.type,
        columns: idx.columns,
      });
      console.log(`  + index ${spec.id}.${idx.key} (${idx.type})`);
    }
  }
}

const SCHEMA: TableSpec[] = [
  {
    id: TABLE_IDS.products,
    name: "Products",
    columns: [
      { key: "name", kind: "string", size: 200, required: true },
      { key: "slug", kind: "string", size: 120, required: true },
      { key: "brand", kind: "string", size: 120, required: true },
      { key: "categoryId", kind: "string", size: 64 },
      { key: "model", kind: "string", size: 160 },
      { key: "shortDescription", kind: "string", size: 400 },
      { key: "description", kind: "string", size: 8000 },
      { key: "price", kind: "integer" },
      { key: "currency", kind: "string", size: 8, default: "NGN" },
      { key: "featured", kind: "boolean", default: false },
      { key: "inStock", kind: "boolean", default: true },
      { key: "published", kind: "boolean", default: false },
      { key: "imageIds", kind: "string", size: 64, array: true },
      { key: "specifications", kind: "string", size: 16000 },
      { key: "sortOrder", kind: "integer", default: 0 },
    ],
    indexes: [
      { key: "slug_unique", type: TablesDBIndexType.Unique, columns: ["slug"] },
    ],
  },
  {
    id: TABLE_IDS.categories,
    name: "Categories",
    columns: [
      { key: "name", kind: "string", size: 120, required: true },
      { key: "slug", kind: "string", size: 140, required: true },
      { key: "description", kind: "string", size: 500 },
      { key: "sortOrder", kind: "integer", default: 0 },
      { key: "published", kind: "boolean", default: true },
    ],
    indexes: [
      { key: "slug_unique", type: TablesDBIndexType.Unique, columns: ["slug"] },
    ],
  },
  {
    id: TABLE_IDS.enquiries,
    name: "Enquiries",
    columns: [
      { key: "productId", kind: "string", size: 64 },
      { key: "productName", kind: "string", size: 200, required: true },
      { key: "productModel", kind: "string", size: 160 },
      { key: "productPrice", kind: "integer" },
      { key: "productCurrency", kind: "string", size: 8 },
      { key: "customerName", kind: "string", size: 120, required: true },
      { key: "phone", kind: "string", size: 40, required: true },
      { key: "quantity", kind: "integer", required: true },
      { key: "message", kind: "string", size: 2000 },
      { key: "source", kind: "string", size: 20, required: true },
      { key: "status", kind: "string", size: 20, required: true },
    ],
  },
  {
    id: TABLE_IDS.settings,
    name: "Settings",
    columns: [
      { key: "businessName", kind: "string", size: 200 },
      { key: "legalName", kind: "string", size: 200 },
      { key: "email", kind: "string", size: 200 },
      { key: "phone", kind: "string", size: 40 },
      { key: "whatsapp", kind: "string", size: 40 },
      { key: "secondaryPhone", kind: "string", size: 40 },
      { key: "address", kind: "string", size: 300 },
      { key: "tagline", kind: "string", size: 200 },
      { key: "domain", kind: "string", size: 100 },
      { key: "telegramChatId", kind: "string", size: 64 },
    ],
  },
];

async function main() {
  console.log(`Bootstrapping Appwrite schema for database "${databaseId}"…\n`);
  await ensureDatabase();
  for (const table of SCHEMA) {
    await ensureTable(table);
  }
  console.log("\nDone. Next: npm run seed");
}

main().catch((error) => {
  console.error("\n✖ Bootstrap failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
