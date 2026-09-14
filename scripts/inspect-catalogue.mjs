import { Client, TablesDB, Storage, Query } from 'node-appwrite';
const e = process.env;
const client = new Client().setEndpoint(e.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(e.NEXT_PUBLIC_APPWRITE_PROJECT_ID).setKey(e.APPWRITE_API_KEY);
const db = new TablesDB(client);
const products = await db.listRows({databaseId:e.APPWRITE_DATABASE_ID,tableId:e.APPWRITE_PRODUCTS_COLLECTION_ID,queries:[Query.limit(100)]});
const files = await new Storage(client).listFiles({bucketId:e.APPWRITE_BUCKET_ID,queries:[Query.limit(100)]});
const categories = await db.listRows({databaseId:e.APPWRITE_DATABASE_ID,tableId:e.APPWRITE_CATEGORIES_COLLECTION_ID,queries:[Query.limit(100)]});
console.log(JSON.stringify({products:products.rows.map(p=>({id:p.$id,name:p.name,slug:p.slug,brand:p.brand,categoryId:p.categoryId,model:p.model,price:p.price,imageIds:p.imageIds,published:p.published})),files:files.files.map(f=>({id:f.$id,name:f.name})),categories:categories.rows.map(c=>({id:c.$id,name:c.name}))},null,2));
