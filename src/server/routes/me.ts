import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import { handleApiError, USE_MOCK_DATA } from '../utils';

export const me = new Hono();

me.get('/', async (c) => {
  try {
    if (USE_MOCK_DATA) {
      return c.json({ isMod: true });
    }

    const user = await reddit.getCurrentUser();
    if (!user) {
      return c.json({ isMod: false });
    }

    const subreddit = await reddit.getCurrentSubreddit();
    const permissions = await user.getModPermissionsForSubreddit(subreddit.name);
    
    const isMod = permissions.length > 0;

    return c.json({ isMod });
  } catch (err) {
    return handleApiError(c, err);
  }
});
