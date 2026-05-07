import { Hono } from 'hono';
import { redis, reddit } from '@devvit/web/server';
import { handleApiError, USE_MOCK_DATA } from '../utils';

export const cacheRoute = new Hono();

cacheRoute.post('/bust', async (c) => {
  try {
    if (!USE_MOCK_DATA) {
      const user = await reddit.getCurrentUser();
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const subreddit = await reddit.getCurrentSubreddit();
      const permissions = await user.getModPermissionsForSubreddit(subreddit.name);
      
      if (permissions.length === 0) {
        return c.json({ error: 'Forbidden' }, 403);
      }
    }

    const keys = [
      'dashboard:health',
      'dashboard:modlog',
      'dashboard:retention',
      'dashboard:workload',
      'dashboard:trends'
    ];

    for (const key of keys) {
      await redis.del(key);
    }

    return c.json({ success: true });
  } catch (err) {
    return handleApiError(c, err);
  }
});
