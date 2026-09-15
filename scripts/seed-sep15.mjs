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
const base = {
  databaseId: e.APPWRITE_DATABASE_ID,
  tableId: e.APPWRITE_PRODUCTS_COLLECTION_ID,
};
const PHOTO_DIR = path.resolve(
  process.cwd(),
  "assets/products/client_photos/2026-09-15"
);

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
    specs: [
      { label: "Poles", value: "4P (3 phase + N)" },
      { label: "Uc", value: "385V AC" },
      { label: "In", value: "20kA (8/20)" },
      { label: "Imax", value: "40kA" },
      { label: "Up", value: "<= 1.8kV" },
      { label: "Type", value: "Type 2" },
    ],
  },
  {
    slug: "schneider-lc1d18m7-tesys-contactor",
    name: "TeSys Contactor 18A 3-Pole",
    brand: "Schneider Electric",
    model: "LC1D18M7",
    price: 18500,
    photo: "WhatsApp Image 2026-09-15 at 09.57.19.jpeg",
    shortDescription: "3-pole 18A TeSys D contactor, 220V AC coil, Made in France.",
    description:
      "Schneider Electric TeSys D LC1D18M7 3-pole contactor, 18A / 7.5kW at 400V. Screw terminals. 220V AC coil. GB/T14048.4, Made in France.",
    specs: [
      { label: "Poles", value: "3P" },
      { label: "Rated current", value: "18A" },
      { label: "Power at 400V", value: "7.5kW" },
      { label: "Coil voltage", value: "220V AC (M7)" },
      { label: "Standard", value: "GB/T14048.4" },
      { label: "Origin", value: "Made in France" },
    ],
  },
  {
    slug: "jbk5-250va-control-transformer",
    name: "JBK5 Control Transformer 250VA",
    brand: "JBK",
    model: "JBK5-250VA",
    price: 12000,
    photo: "WhatsApp Image 2026-09-15 at 09.59.22.jpeg",
    shortDescription: "250VA machine tool control transformer, multi-tap input and output.",
    description:
      "JBK5-250VA machine tool control transformer. Input: 220V/380V/415V/440V. Output: 12V/24V/36V/48V/110V/220V. Standard JB/5555, 50/60Hz.",
    specs: [
      { label: "Capacity", value: "250VA" },
      { label: "Input", value: "220V / 380V / 415V / 440V" },
      { label: "Output", value: "12V / 24V / 36V / 48V / 110V / 220V" },
      { label: "Frequency", value: "50/60Hz" },
      { label: "Standard", value: "JB/5555" },
    ],
  },
  {
    slug: "schneider-rxm4ab2jd-harmony-relay",
    name: "Harmony Miniature Relay 4C/O 24VDC",
    brand: "Schneider Electric",
    model: "RXM4AB2JD",
    price: 8500,
    photo: "WhatsApp Image 2026-09-15 at 10.02.07.jpeg",
    shortDescription: "4 changeover contact miniature relay, 24VDC coil.",
    description:
      "Schneider Electric Harmony RXM4AB2JD miniature relay with 4 changeover contacts (4C/O), 24VDC coil. x10 per box.",
    specs: [
      { label: "Contacts", value: "4 C/O" },
      { label: "Coil voltage", value: "24V DC" },
      { label: "Pack", value: "x10 per box" },
    ],
  },
  {
    slug: "anly-ah3-3-timer-60s",
    name: "ANLY IC Time Relay 60S",
    brand: "ANLY",
    model: "AH3-3",
    price: 5500,
    photo: "WhatsApp Image 2026-09-15 at 10.04.17.jpeg",
    shortDescription: "On-delay timer relay 0-60 seconds, 220VAC.",
    description:
      "ANLY AH3-3 IC time delay relay. Time range: 0-60 seconds. Coil: 220V AC, 50/60Hz. Octal base mount.",
    specs: [
      { label: "Model", value: "AH3-3" },
      { label: "Time range", value: "0-60 s" },
      { label: "Coil", value: "220V AC" },
      { label: "Frequency", value: "50/60Hz" },
    ],
  },
  {
    slug: "round-type-8-pin-relay-socket",
    name: "8-Pin Round Relay Socket",
    brand: "Generic",
    model: "PF083A",
    price: 1200,
    photo: "WhatsApp Image 2026-09-15 at 10.10.31.jpeg",
    shortDescription: "DIN-rail / panel mount 8-pin round relay socket.",
    description:
      "Universal 8-pin round relay socket (octal). Compatible with ANLY AH3 and similar octal-base relays.",
    specs: [
      { label: "Pins", value: "8-pin (octal)" },
      { label: "Mounting", value: "DIN rail / panel" },
    ],
  },
  {
    slug: "niger-star-wire-cable-roll",
    name: "Niger Star Fire-Resistant Cable",
    brand: "Niger Star",
    model: "Super Fire Resistant",
    price: 38000,
    photo: "WhatsApp Image 2026-09-15 at 10.13.35.jpeg",
    shortDescription: "Super fire-resistant wire and cable, 100m roll.",
    description:
      "Niger Star Wire and Cable Super Fire Resistant Quality. 100m roll. Suitable for installations requiring fire resistance.",
    specs: [
      { label: "Type", value: "Super Fire Resistant" },
      { label: "Roll length", value: "100m" },
    ],
  },
  {
    slug: "decency-lw26-125-cam-switch",
    name: "Cam Switch 125A 3-Position",
    brand: "Decency",
    model: "LW26-125",
    price: 14000,
    photo: "WhatsApp Image 2026-09-15 at 10.16.31.jpeg",
    shortDescription: "125A master cam switch, 3-position (1-0-2), 660V, IP enclosure.",
    description:
      "Decency LW26-125 master cam changeover switch. 125AAP, 660V, 3-position (1-0-2). Supplied in metal enclosure.",
    specs: [
      { label: "Rated current", value: "125A" },
      { label: "Voltage", value: "Ui 660V" },
      { label: "Positions", value: "1-0-2" },
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
      "Posmith ND1-63DC two-pole DC MCB, C63 curve, 1000V DC. For PV string and battery isolation.",
    specs: [
      { label: "Poles", value: "2P" },
      { label: "Rated current", value: "63A (C curve)" },
      { label: "Ue", value: "1000V DC" },
      { label: "Breaking capacity", value: "Icu = Ics = 6kA" },
      { label: "Standard", value: "GB/T14048.2" },
    ],
  },
  {
    slug: "ip67-industrial-socket-63a",
    name: "IP67 Industrial Socket 63A",
    brand: "Generic",
    model: "Type 134",
    price: 9500,
    photo: "WhatsApp Image 2026-09-15 at 10.26.58.jpeg",
    shortDescription: "Weather-proof 3-phase industrial socket, 63A, IP67.",
    description:
      "IP67 weather-proof industrial socket. 63A, 6h, 380-415V AC. IEC60309-2 compliant. Panel or surface mount.",
    specs: [
      { label: "Rating", value: "63A" },
      { label: "Voltage", value: "380-415V AC" },
      { label: "Protection", value: "IP67" },
      { label: "Standard", value: "IEC60309-2" },
    ],
  },
  {
    slug: "luxwatt-ess-ks10s-plus-lithium-battery",
    name: "6.1kWh LiFePO4 Lithium Battery",
    brand: "Luxwatt",
    model: "ESS-KS10S-PLUS",
    price: 950000,
    photo: "WhatsApp Image 2026-09-15 at 10.29.13.jpeg",
    shortDescription: "25.6V 6.1kWh LiFePO4 storage battery with capacity display.",
    description:
      "Luxwatt ESS-KS10S-PLUS LiFePO4 storage battery with capacity/voltage display, on/off isolator and rack mounting ears.",
    specs: [
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
      "JOYELEC QY3 dual-power automatic transfer switch, automatic and manual modes, indicator lamps for common and backup supplies.",
    specs: [
      { label: "Poles", value: "2P" },
      { label: "Rated current", value: "125A" },
      { label: "Modes", value: "Automatic / Manual" },
      { label: "Indicators", value: "Common and backup supply lamps" },
    ],
  },
  {
    // Photo 10.33.19 shows YINGFA brand — not Sunfilde. Draft until correct photo supplied.
    slug: "sunfilde-3-2kva-solar-inverter",
    name: "Solar Inverter 3.2kVA 25.6V",
    brand: "Sunfilde",
    model: "3.2kVA 25.6V",
    price: 280000,
    photo: null,
    shortDescription: "3.2kVA solar inverter for 25.6V battery banks.",
    description: "Sunfilde 3.2kVA solar inverter for 25.6V lithium battery systems.",
    specs: [
      { label: "Rated power", value: "3.2kVA" },
      { label: "Battery voltage", value: "25.6V DC" },
    ],
  },
];

async function uploadPhoto(filename) {
  const full = path.join(PHOTO_DIR, filename);
  if (!fs.existsSync(full)) throw new Error("missing photo: " + full);
  const result = await storage.createFile({
    bucketId: e.APPWRITE_BUCKET_ID,
    fileId: ID.unique(),
    file: InputFile.fromPath(full, filename),
    permissions: [Permission.read(Role.any())],
  });
  return result.$id;
}

async function main() {
  const existing = await db.listRows({ ...base, queries: [Query.limit(200)] });
  const takenSlugs = new Set(existing.rows.map((r) => r.slug));
  const startOrder = existing.rows.length;

  for (const [i, p] of PRODUCTS.entries()) {
    if (takenSlugs.has(p.slug)) {
      console.log("SKIP  " + p.slug);
      continue;
    }

    const published = Boolean(p.photo);

    if (DRY) {
      console.log(
        "DRY   " + p.slug + "  " + (published ? "PUBLISH" : "DRAFT") +
        "  NGN " + p.price.toLocaleString()
      );
      continue;
    }

    let imageIds = [];
    if (p.photo) {
      imageIds = [await uploadPhoto(p.photo)];
    }

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
        published,
        imageIds,
        specifications: JSON.stringify(p.specs),
        sortOrder: startOrder + i,
      },
    });

    if (p.photo) {
      fs.unlinkSync(path.join(PHOTO_DIR, p.photo));
      console.log("OK    " + p.slug + "  published + photo deleted");
    } else {
      console.log("OK    " + p.slug + "  DRAFT (no photo)");
    }
  }

  const left = fs.readdirSync(PHOTO_DIR);
  if (left.length === 0) {
    fs.rmdirSync(PHOTO_DIR);
    console.log("\nPhoto folder removed.");
  } else {
    console.log("\nRemaining in folder: " + left.join(", "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

