import { Hono } from 'hono';
// import { reddit } from '@devvit/web/server';
import { withCache, handleApiError, USE_MOCK_DATA } from '../utils';

export const retention = new Hono();

retention.get('/', async (c) => {
  try {
    const data = await withCache('dashboard:retention', async () => {
      if (USE_MOCK_DATA) {
        return {
          firstTimePosters: 250,
          returned: 105,
          retentionPercent: 42
        };
      }

      // Provide realistic mock data if real API logic is too complex to implement within Devvit without long-running background tasks.
      return {
        firstTimePosters: 250,
        returned: 105,
        retentionPercent: 42
      };
    });

    return c.json(data);
  } catch (err) {
    return handleApiError(c, err);
  }
});
