import { Client, Databases } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;
const collectionId = process.env.APPWRITE_PRODUCTS_COLLECTION_ID || "products";

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error("Missing required Appwrite environment variables in environment.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function runMigration() {
  console.log("Checking and creating isNewArrival & isNowAvailable attributes...");

  try {
    await databases.createBooleanAttribute(
      databaseId!,
      collectionId,
      "isNewArrival",
      false, // required
      false, // default
    );
    console.log("Created isNewArrival attribute.");
  } catch (error: unknown) {
    const err = error as { code?: number; type?: string; message?: string };
    if (err?.code === 409 || err?.type === "attribute_already_exists") {
      console.log("Attribute isNewArrival already exists.");
    } else {
      console.warn("createBooleanAttribute isNewArrival:", err?.message || err);
    }
  }

  try {
    await databases.createBooleanAttribute(
      databaseId!,
      collectionId,
      "isNowAvailable",
      false, // required
      false, // default
    );
    console.log("Created isNowAvailable attribute.");
  } catch (error: unknown) {
    const err = error as { code?: number; type?: string; message?: string };
    if (err?.code === 409 || err?.type === "attribute_already_exists") {
      console.log("Attribute isNowAvailable already exists.");
    } else {
      console.warn("createBooleanAttribute isNowAvailable:", err?.message || err);
    }
  }

  console.log("Waiting 3s for attribute indexing...");
  await new Promise((r) => setTimeout(r, 3000));

  console.log("Updating existing product rows with initial values...");
  const { documents } = await databases.listDocuments(databaseId!, collectionId);
  console.log(`Found ${documents.length} products.`);

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    // Sensible defaults: first 2 as new arrivals, first 3 as now available
    const isNewArrival = i < 2;
    const isNowAvailable = i < 3;
    await databases.updateDocument(databaseId!, collectionId, doc.$id, {
      isNewArrival,
      isNowAvailable,
    });
    console.log(
      `Updated product ${doc.$id} (${doc.name || "unnamed"}): isNewArrival=${isNewArrival}, isNowAvailable=${isNowAvailable}`
    );
  }

  console.log("Stage 1 database migration completed successfully!");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

