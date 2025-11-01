import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../../lib/mongodb';
import { Stage } from '../../lib/protector';

const COLLECTION_NAME = '__protected_scripts_7a9f1b3c';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { id } = request.query;
  
  if (typeof id !== 'string') {
    return response.status(400).send('Invalid script ID');
  }

  // Security Check 1: User-Agent must be from Roblox
  const userAgent = request.headers['user-agent'] || '';
  if (!userAgent.includes('Roblox')) {
    return response.status(403).send('Forbidden');
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Stage>(COLLECTION_NAME);

    const stage = await collection.findOne({ _id: id });

    if (!stage) {
      return response.status(404).send('Script not found or has expired.');
    }

    // Security Check 2: Custom header must match expected value
    if (stage.expectedHeaderKey && stage.expectedHeaderValue) {
        const headerValue = request.headers[stage.expectedHeaderKey.toLowerCase()];
        if (headerValue !== stage.expectedHeaderValue) {
            return response.status(403).send('Forbidden: Invalid token');
        }
    }

    // Success: Return the script content
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return response.status(200).send(stage.content);

  } catch (error) {
    console.error('Script retrieval error:', error);
    return response.status(500).send('Internal Server Error');
  }
}
