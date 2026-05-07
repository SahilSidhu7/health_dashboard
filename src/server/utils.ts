import { redis } from '@devvit/web/server';
import { Context } from 'hono';

const CACHE_TTL_SECONDS = 3600; // 1 hour
export const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

export async function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (USE_MOCK_DATA) {
    return fetcher(); // Mock data usually doesn't need caching
  }
  
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.error(`Cache read error for key ${key}:`, err);
  }

  const freshData = await fetcher();

  try {
    await redis.set(key, JSON.stringify(freshData), {
      expiration: new Date(Date.now() + CACHE_TTL_SECONDS * 1000)
    });
  } catch (err) {
    console.error(`Cache write error for key ${key}:`, err);
  }

  return freshData;
}

export function handleApiError(c: Context, err: unknown) {
  console.error('API Error:', err);
  return c.json({ error: err instanceof Error ? err.message : 'Unknown Reddit API Error' }, 500);
}
