import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI environment variable is required');
}

let cached = globalThis._mongoCache || { client: null, db: null };

export async function connectToDatabase() {
  if (cached.db) return cached;

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db();

  cached = { client, db };
  globalThis._mongoCache = cached;
  return cached;
}

export default connectToDatabase;
