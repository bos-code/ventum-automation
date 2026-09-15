/**
 * Seeds the five products supplied on 15 Sep 2026.
 *
 * Specs are taken from the nameplate in each photo, not from the shorthand in
 * the message, because the site promises "the exact rating printed on the
 * unit". Where the two disagreed it is called out in NOTE comments below.
 *
 * Run: node --env-file=.env.local scripts/seed-2026-09-15.mjs
 * Pass --dry to list what would happen without writing anything.
 */
import { Client, TablesDB, Storage, Query, Permission, Role, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import path from "node:path";
import fs from "node:fs";

const e = process.env;
const DRY = process.argv.includes("--dry");

const client = new Client()
  .setEndpoint(e.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(e.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(e.APPWRITE_API_KEY);

const db = new TablesDB(client);
const storage = new Storage(client);
const base = { databaseId: e.APPWRITE_DATABASE_ID, tableId: e.APPWRITE_PRODUCTS_COLLECTION_ID };

const PRODUCTS = [
  {
    slug: "legrand-tlu2-40-4p-surge-protector",
    name: "4-Pole Surge Protector 40kA",
    brand: "Legrand",
    model: "TLU2-40/385/4P",
    price: 23000,
    photo: "WhatsApp Image 2026-09-15 at 07.22.19.jpeg",
    shortDescription: "Type 2 surge protector for three-phase boards, 4-pole.",
    description:
      "TCL Legrand TLU2-40 Type 2 surge protective device for three-phase distribution boards. Four poles (L1, L2, L3, N) with status windows on each module.",
    specifications: [
      { label: "Poles", value: "4P (3 phase + N)" },
      { label: "Uc", value: "385V AC" },
      { label: "In", value: "20kA (8/20)" },
      { label: "Imax", value: "40kA" },
      { label: "Up", value: "≤ 1.8kV" },
      { label: "Type", value: "Type 2" },
    ],
  },
  {
    slug: "posmith-nd1-63dc-2p-dc-breaker",
    name: "2-Pole DC Circuit Breaker 63A",
    brand: "Posmith",
    model: "ND1-63DC",
    price: 4000,
    photo: "WhatsApp Image 2026-09-15 at 10.24.51.jpeg",
    shortDescription: "DC miniature circuit breaker for solar strings, 2-pole 63A.",
    description:
      "Posmith ND1-63DC two-pole DC miniature circuit breaker with C63 curve, for PV string and battery isolation.",
    // NOTE: the message said 500VDC; the unit is printed Ue: 1000V. Nameplate wins.
    specifications: [
      { label: "Poles", value: "2P" },
      { label: "Rated current", value: "63A (C curve)" },
      { label: "Ue", value: "1000V DC" },
      { label: "Breaking capacity", value: "Icu = Ics = 6kA" },
      { label: "Uimp", value: "4kV" },
      { label: "Standard", value: "GB/T14048.2" },
    ],
  },
  {
    slug: "luxwatt-ess-ks10s-plus-lithium-battery",
    name: "6.1kWh LiFePO4 Lithium Battery",
    brand: "Luxwatt",
    // NOTE: the message said "Ess-ke10s-plus"; the unit reads ESS-KS10S-PLUS.
    model: "ESS-KS10S-PLUS",
    price: 950000,
    photo: "WhatsApp Image 2026-09-15 at 10.29.13.jpeg",
    shortDescription: "25.6V 6.1kWh LiFePO4 storage battery with capacity display.",
    description:
      "Luxwatt ESS-KS10S-PLUS lithium iron phosphate storage battery with on-unit capacity and voltage display, on/off isolator and rack mounting ears.",
    specifications: [
      { label: "Chemistry", value: "LiFePO4" },
      { label: "Nominal voltage", value: "25.6V DC" },
      { label: "Capacity", value: "6.1kWh" },
      { label: "Display", value: "Battery capacity / voltage" },
      { label: "Mounting", value: "Rack ears, carry handles" },
    ],
  },
  {
    slug: "joyelec-qy3-2p-125a-changeover",
    name: "Dual Power Automatic Transfer Switch 2-Pole 125A",
    brand: "JOYELEC",
    model: "QY3 2P 125A",
    price: 23000,
    photo: "WhatsApp Image 2026-09-15 at 10.31.34.jpeg",
    shortDescription: "Automatic changeover between mains and generator, 2-pole 125A.",
    description:
      "JOYELEC QY3 dual-power automatic transfer switch with automatic and manual modes, supply indicator lamps for common and backup sources, and a manual override handle.",
    specifications: [
      { label: "Poles", value: "2P" },
      { label: "Rated current", value: "125A" },
      { label: "Modes", value: "Automatic / Manual" },
      { label: "Indicators", value: "Common and backup supply lamps" },
    ],
  },
  {
    slug: "sunfilde-3-2kva-solar-inverter",
    name: "Solar Inverter 3.2kVA 25.6V",
    brand: "Sunfilde",
    model: "3.2kVA 25.6V",
    price: 280000,
    // No photo: the only inverter image supplied is branded YINGFA, not
    // Sunfilde. Seeded without an image so the publish gate holds it as a
    // draft until the correct photo is supplied.
    photo: null,
    shortDescription: "3.2kVA solar inverter for 25.6V battery banks.",
    description:
      "Sunfilde 3.2kVA solar inverter for 25.6V lithium battery systems.",
    specifications: [
      { label: "Rated power", value: "3.2kVA" },
      { label: "Battery voltage", value: "25.6V DC" },
    ],
  },
];

async function uploadPhoto(file) {
  const full = path.resolve(process.cwd(), file);
  if (!fs.existsSync(full)) throw new Error(`missing photo: ${file}`);
  const created = await storage.createFile({
    bucketId: e.APPWRITE_BUCKET_ID,
    fileId: ID.unique(),
    file: InputFile.fromPath(full, path.basename(full)),
    permissions: [Permission.read(Role.any())],
  });
  return created.$id;
}

async function main() {
  const existing = await db.listRows({ ...base, queries: [Query.limit(200)] });
  const takenSlugs = new Set(existing.rows.map((r) => r.slug));
  const startOrder = existing.rows.length;

  for (const [index, p] of PRODUCTS.entries()) {
    if (takenSlugs.has(p.slug)) {
      console.log(`SKIP  ${p.slug} — already in the catalogue`);
      continue;
    }

    const published = Boolean(p.photo);
    if (DRY) {
      console.log(
        `DRY   ${p.slug} — ${published ? "publish" : "DRAFT (no photo)"} — ₦${p.price.toLocaleString()}`
      );
      continue;
    }

    let imageIds = [];
    if (p.photo) imageIds = [await uploadPhoto(p.photo)];

    await db.createRow({
      ...base,
      rowId: ID.unique(),
      data: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        model: p.model,
        categoryId: null,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        currency: "NGN",
        isNewArrival: true,
        isNowAvailable: true,
        inStock: true,
        // Mirrors resolvePublish(): no image means it stays a draft.
        published,
        imageIds,
        specifications: JSON.stringify(p.specifications),
        sortOrder: startOrder + index,
      },
    });

    console.log(
      `OK    ${p.slug} — ${published ? "published" : "DRAFT (no photo)"} — ₦${p.price.toLocaleString()}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
