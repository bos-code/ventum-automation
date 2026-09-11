/**
 * Seed the Appwrite database with the initial catalogue and, optionally,
 * the first admin login.
 *
 * Usage:
 *   npm run seed
 *
 * Requires the `products`, `categories` and `settings` tables (with
 * their columns/indexes) to already exist — see docs/SETUP.md. This
 * script only writes data; it never creates or alters schema.
 *
 * Safe to re-run: categories and products are matched by slug and left
 * untouched if they already exist.
 *
 * Note: this file talks to `node-appwrite` directly rather than through
 * `lib/appwrite/*`, because those modules are marked `server-only` for
 * Next's bundler and would throw when run under plain Node/tsx.
 */
import { Client, ID, Query, TablesDB, Users } from "node-appwrite";
import { BUSINESS, CURRENCY, INITIAL_CATEGORIES } from "../lib/constants";
import { categoryInputSchema } from "../lib/validation/category";
import { cleanSpecifications, productInputSchema } from "../lib/validation/product";
import type { Specification } from "../types";

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const endpoint = requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
const projectId = requireEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
const apiKey = requireEnv("APPWRITE_API_KEY");
const databaseId = requireEnv("APPWRITE_DATABASE_ID");

const TABLES = {
  products: requireEnv("APPWRITE_PRODUCTS_COLLECTION_ID", "products"),
  categories: requireEnv("APPWRITE_CATEGORIES_COLLECTION_ID", "categories"),
  settings: requireEnv("APPWRITE_SETTINGS_COLLECTION_ID", "settings"),
};

const PLACEHOLDERS = ["placeholder-project", "placeholder-api-key", ""];
if (PLACEHOLDERS.includes(projectId) || PLACEHOLDERS.includes(apiKey)) {
  console.error(
    "✖ .env.local still has placeholder Appwrite values. Fill in real ones (see docs/SETUP.md) before seeding.",
  );
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);
const tables = new TablesDB(client);
const users = new Users(client);

async function findRowBySlug(tableId: string, slug: string) {
  const res = await tables.listRows({
    databaseId,
    tableId,
    queries: [Query.equal("slug", slug), Query.limit(1)],
  });
  return res.rows[0] ?? null;
}

interface CategorySeed {
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  published: boolean;
}

async function seedCategory(input: CategorySeed) {
  const data = categoryInputSchema.parse(input);
  const existing = await findRowBySlug(TABLES.categories, data.slug);
  if (existing) {
    console.log(`  = category "${data.name}" already exists — skipped`);
    return existing.$id;
  }
  const row = await tables.createRow({
    databaseId,
    tableId: TABLES.categories,
    rowId: ID.unique(),
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      sortOrder: data.sortOrder,
      published: data.published,
    },
  });
  console.log(`  + created category "${data.name}"`);
  return row.$id;
}

interface ProductSeed {
  name: string;
  slug: string;
  brand: string;
  categorySlug: string;
  model: string;
  shortDescription: string;
  description: string;
  price: number;
  specifications: Specification[];
  featured: boolean;
  sortOrder: number;
}

async function seedProduct(
  input: ProductSeed,
  categoryIdBySlug: Map<string, string>,
) {
  const categoryId = categoryIdBySlug.get(input.categorySlug);
  if (!categoryId) {
    throw new Error(
      `Category "${input.categorySlug}" was not created — cannot seed product "${input.name}".`,
    );
  }

  const data = productInputSchema.parse({
    name: input.name,
    slug: input.slug,
    brand: input.brand,
    categoryId,
    model: input.model,
    shortDescription: input.shortDescription,
    description: input.description,
    price: input.price,
    currency: CURRENCY,
    featured: input.featured,
    inStock: true,
    published: true,
    imageIds: [],
    specifications: input.specifications,
    sortOrder: input.sortOrder,
  });

  const existing = await findRowBySlug(TABLES.products, data.slug);
  if (existing) {
    console.log(`  = product "${data.name}" already exists — skipped`);
    return;
  }

  await tables.createRow({
    databaseId,
    tableId: TABLES.products,
    rowId: ID.unique(),
    data: {
      name: data.name,
      slug: data.slug,
      brand: data.brand,
      categoryId: data.categoryId,
      model: data.model || null,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      price: data.price,
      currency: data.currency,
      featured: data.featured,
      inStock: data.inStock,
      published: data.published,
      imageIds: data.imageIds,
      specifications: JSON.stringify(cleanSpecifications(data.specifications)),
      sortOrder: data.sortOrder,
    },
  });
  console.log(`  + created product "${data.name}"`);
}

async function seedSettings() {
  try {
    await tables.getRow({
      databaseId,
      tableId: TABLES.settings,
      rowId: "business",
    });
    console.log("  = settings row already exists — skipped");
    return;
  } catch {
    // Not found — create it.
  }

  await tables.createRow({
    databaseId,
    tableId: TABLES.settings,
    rowId: "business",
    data: {
      businessName: BUSINESS.name,
      legalName: BUSINESS.legalName,
      email: BUSINESS.email,
      phone: BUSINESS.phone,
      whatsapp: BUSINESS.whatsapp,
      secondaryPhone: BUSINESS.secondaryPhone,
      address: BUSINESS.address,
      tagline: BUSINESS.tagline,
      domain: BUSINESS.domain,
      telegramChatId: null,
    },
  });
  console.log("  + created settings row");
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("  = ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user");
    return;
  }

  try {
    await users.create({ userId: ID.unique(), email, password, name: "Admin" });
    console.log(`  + created admin user ${email}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/already exists/i.test(message)) {
      console.log(`  = admin user ${email} already exists — skipped`);
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log("Seeding categories…");
  const categoryIdBySlug = new Map<string, string>();
  for (const category of INITIAL_CATEGORIES) {
    const id = await seedCategory({
      name: category.name,
      slug: category.slug,
      sortOrder: INITIAL_CATEGORIES.indexOf(category),
      published: true,
    });
    categoryIdBySlug.set(category.slug, id);
  }

  console.log("Seeding products…");
  const products: ProductSeed[] = [
    {
      name: "24-Hour Analog Timer Horloge",
      slug: "schneider-electric-sul-181h-24-hour-analog-timer",
      brand: "Schneider Electric",
      categorySlug: "timers-controllers",
      model: "SUL 181h",
      shortDescription: "24-hour analog time switch (horloge).",
      // No specifications beyond brand/model are seeded — the client
      // did not supply technical specs for this item, and the brief is
      // explicit: don't invent or "correct" unverified specifications.
      description: "",
      price: 10000,
      specifications: [],
      featured: true,
      sortOrder: 0,
    },
    {
      name: "Contactor Relay",
      slug: "telemecanique-d0910-contactor-relay",
      brand: "Telemecanique",
      categorySlug: "contactors-relays",
      model: "D0910",
      shortDescription: "25A contactor relay, 220V, 3-phase.",
      description: "25A Contactor Relay. 220V. 3-phase.",
      price: 3000,
      specifications: [
        { label: "Rated current", value: "25A" },
        { label: "Voltage", value: "220V" },
        { label: "Phase", value: "3-phase" },
      ],
      featured: false,
      sortOrder: 1,
    },
    {
      name: "Solar Protection Box",
      slug: "joyelec-djo-solar-protection-box",
      brand: "JOYELEC",
      categorySlug: "solar-protection",
      model: "DJO",
      shortDescription: "63A PV breaker with DC & AC surge protection and AC AVR.",
      description:
        "Solar protection box with a 63A PV breaker, DC & AC surge protection, AC AVR, 63A output rating and a 12-way enclosure.",
      price: 30000,
      specifications: [
        { label: "PV breaker", value: "63A" },
        { label: "Surge protection", value: "DC & AC" },
        { label: "AVR", value: "AC AVR" },
        { label: "Output rating", value: "63A" },
        { label: "Enclosure", value: "12-way" },
      ],
      featured: true,
      sortOrder: 2,
    },
    {
      name: "Solar Protection Box",
      slug: "posmith-dpo-solar-protection-box",
      brand: "Posmith",
      categorySlug: "solar-protection",
      model: "DPO",
      shortDescription: "63A PV breaker with DC & AC surge protection and AC AVR.",
      description:
        "Solar protection box with a 63A PV breaker, DC & AC surge protection, AC AVR, 63A output rating and a 12-way enclosure.",
      price: 30000,
      specifications: [
        { label: "PV breaker", value: "63A" },
        { label: "Surge protection", value: "DC & AC" },
        { label: "AVR", value: "AC AVR" },
        { label: "Output rating", value: "63A" },
        { label: "Enclosure", value: "12-way" },
      ],
      featured: false,
      sortOrder: 3,
    },
  ];

  for (const product of products) {
    await seedProduct(product, categoryIdBySlug);
  }

  console.log("Seeding business settings…");
  await seedSettings();

  console.log("Seeding admin user…");
  await seedAdminUser();

  console.log("\nDone.");
}

main().catch((error) => {
  console.error("\n✖ Seed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
