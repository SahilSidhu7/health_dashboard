import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import type { MenuItemRequest, UiResponse } from '@devvit/web/shared';

export const menu = new Hono();

menu.post('/health-dashboard', async (c) => {
  try {
    const request = await c.req.json<MenuItemRequest>();
    const subreddit = await reddit.getSubredditById(request.targetId as `t5_${string}`);
    if (!subreddit) {
      return c.json<UiResponse>({ showToast: { text: 'Could not find subreddit.', appearance: 'neutral' } }, 200);
    }

    const post = await reddit.submitCustomPost({
      subredditName: subreddit.name,
      title: 'Community Health Dashboard',
    });

    return c.json<UiResponse>({ showToast: { text: 'Health Dashboard opened! Refreshing...', appearance: 'success' } }, 200);
  } catch (err) {
    console.error('health-dashboard menu error:', err);
    return c.json<UiResponse>(
      { showToast: { text: 'Failed to open Health Dashboard. Please try again.', appearance: 'neutral' } },
      200
    );
  }
});
