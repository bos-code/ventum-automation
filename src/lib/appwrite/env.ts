function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const appwriteEnv = {
  get endpoint() {
    return required("NEXT_PUBLIC_APPWRITE_ENDPOINT");
  },
  get projectId() {
    return required("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  },
  get apiKey() {
    return required("APPWRITE_API_KEY");
  },
  get databaseId() {
    return required("APPWRITE_DATABASE_ID");
  },
  get bucketId() {
    return required("APPWRITE_BUCKET_ID");
  },
  tables: {
    get products() {
      return required("APPWRITE_PRODUCTS_COLLECTION_ID");
    },
    get categories() {
      return required("APPWRITE_CATEGORIES_COLLECTION_ID");
    },
    get enquiries() {
      return required("APPWRITE_ENQUIRIES_COLLECTION_ID");
    },
    get settings() {
      return required("APPWRITE_SETTINGS_COLLECTION_ID");
    },
  },
};
