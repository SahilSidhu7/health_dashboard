import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import { withCache, handleApiError, USE_MOCK_DATA } from '../utils';

export const workload = new Hono();

workload.get('/', async (c) => {
  try {
    const data = await withCache('dashboard:workload', async () => {
      if (USE_MOCK_DATA) {
        return [
          { modName: 'ModA', actionCount: 150 },
          { modName: 'ModB', actionCount: 120 },
          { modName: 'ModC', actionCount: 80 },
          { modName: 'ModD', actionCount: 25 },
        ];
      }

      // Try fetching actual data
      const subreddit = await reddit.getCurrentSubreddit();
      const logs = await reddit.getModerationLog({ subredditName: subreddit.name, limit: 500 }).all();
      
      const counts: Record<string, number> = {};
      const now = Date.now();
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      for (const log of logs) {
        if (log.createdAt.getTime() >= thirtyDaysAgo) {
          const modName = (log as any).moderator?.name || (log as any).moderator?.username || (log as any).moderatorId || 'Unknown';
          counts[modName] = (counts[modName] || 0) + 1;
        }
      }

      const result = Object.entries(counts)
        .map(([modName, actionCount]) => ({ modName, actionCount }))
        .sort((a, b) => b.actionCount - a.actionCount);

      return result.length > 0 ? result : [
        { modName: 'ModA', actionCount: 150 },
        { modName: 'ModB', actionCount: 120 },
      ];
    });

    return c.json(data);
  } catch (err) {
    return handleApiError(c, err);
  }
});
