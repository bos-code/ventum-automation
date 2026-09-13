import { Client, TablesDB, Query } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;
const tableId = process.env.APPWRITE_PRODUCTS_COLLECTION_ID || "products";

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error("Missing required Appwrite environment variables in environment.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

// This project's database uses the TablesDB API (tables/rows), not the
// legacy Databases API (collections/documents) — using the wrong one
// is why this migration never actually created these columns the
// first time (it either no-ops or hits a scope error on this key).
const tablesDB = new TablesDB(client);

async function runMigration() {
  console.log("Checking and creating isNewArrival & isNowAvailable columns...");

  try {
    await tablesDB.createBooleanColumn({
      databaseId: databaseId!,
      tableId,
      key: "isNewArrival",
      required: false,
      xdefault: false,
    });
    console.log("Created isNewArrival column.");
  } catch (error: unknown) {
    const err = error as { code?: number; type?: string; message?: string };
    if (err?.code === 409 || err?.type === "attribute_already_exists") {
      console.log("Column isNewArrival already exists.");
    } else {
      console.warn("createBooleanColumn isNewArrival:", err?.message || err);
    }
  }

  try {
    await tablesDB.createBooleanColumn({
      databaseId: databaseId!,
      tableId,
      key: "isNowAvailable",
      required: false,
      xdefault: false,
    });
    console.log("Created isNowAvailable column.");
  } catch (error: unknown) {
    const err = error as { code?: number; type?: string; message?: string };
    if (err?.code === 409 || err?.type === "attribute_already_exists") {
      console.log("Column isNowAvailable already exists.");
    } else {
      console.warn("createBooleanColumn isNowAvailable:", err?.message || err);
    }
  }

  console.log("Waiting 5s for column indexing...");
  await new Promise((r) => setTimeout(r, 5000));

  console.log("Updating existing product rows with initial values...");
  const { rows } = await tablesDB.listRows({
    databaseId: databaseId!,
    tableId,
    queries: [Query.orderAsc("sortOrder")],
  });
  console.log(`Found ${rows.length} products.`);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as unknown as { $id: string; name?: string };
    // Sensible defaults: first 2 as new arrivals, first 3 as now available
    const isNewArrival = i < 2;
    const isNowAvailable = i < 3;
    await tablesDB.updateRow({
      databaseId: databaseId!,
      tableId,
      rowId: row.$id,
      data: { isNewArrival, isNowAvailable },
    });
    console.log(
      `Updated product ${row.$id} (${row.name || "unnamed"}): isNewArrival=${isNewArrival}, isNowAvailable=${isNowAvailable}`
    );
  }

  console.log("Stage 1 database migration completed successfully!");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
