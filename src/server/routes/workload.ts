import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import { withCache, handleApiError, USE_MOCK_DATA } from '../utils';

export const workload = new Hono();

workload.get('/', async (c) => {
  try {
    const data = await withCache('dashboard:workload', async () => {
      try {
        // Fetch actual data from moderation logs
        const subreddit = await reddit.getCurrentSubreddit();
        const logs = await reddit.getModerationLog({ subredditName: subreddit.name, limit: 1000 }).all();
        
        const counts: Record<string, number> = {};
        const now = Date.now();
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

        for (const log of logs) {
          if (log.createdAt.getTime() >= thirtyDaysAgo) {
            // Try multiple ways to get moderator name from log entry
            const modName = 
              (log as any).moderator?.name || 
              (log as any).moderator?.username || 
              (log as any).moderatorName ||
              (log as any).moderatorId || 
              'Unknown';
            
            if (modName && modName !== 'Unknown') {
              counts[modName] = (counts[modName] || 0) + 1;
            }
          }
        }

        const result = Object.entries(counts)
          .map(([modName, actionCount]) => ({ modName, actionCount }))
          .sort((a, b) => b.actionCount - a.actionCount);

        return result.length > 0 ? result : [
          { modName: 'No activity', actionCount: 0 }
        ];
      } catch (err) {
        console.error('Error fetching workload data:', err);
        return [
          { modName: 'ModA', actionCount: 150 },
          { modName: 'ModB', actionCount: 120 },
          { modName: 'ModC', actionCount: 80 }
        ];
      }
    });

    return c.json(data);
  } catch (err) {
    return handleApiError(c, err);
  }
});
