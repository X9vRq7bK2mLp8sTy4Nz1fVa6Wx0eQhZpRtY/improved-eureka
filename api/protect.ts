import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import { protectScript } from '../lib/protector';

// This is a fixed but obscure name to satisfy the user's request
// without needing a complex discovery mechanism.
const COLLECTION_NAME = '__protected_scripts_7a9f1b3c';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { script } = request.body;
    if (typeof script !== 'string' || !script.trim()) {
      return response.status(400).json({ error: 'Script content is required.' });
    }

    const { entryPoint, dbStages } = protectScript(script);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection(COLLECTION_NAME);

    // Ensure TTL index exists for automatic cleanup
    await collection.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
    
    await collection.insertMany(dbStages);

    return response.status(200).json({ entryPoint });

  } catch (error) {
    console.error('Protection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return response.status(500).json({ error: 'Failed to protect script.', details: errorMessage });
  }
}
