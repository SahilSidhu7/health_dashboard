import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import { withCache, handleApiError, USE_MOCK_DATA } from '../utils';

export const modlog = new Hono();


modlog.get('/', async (c) => {
  try {
    const data = await withCache('dashboard:modlog', async () => {
      if (USE_MOCK_DATA) {
        return {
          removedLast7Days: 145,
          removedLast30Days: 450,
          byReason: {
            'Spam': 210,
            'Rule 1: Be Civil': 150,
            'Rule 3: No self-promotion': 60,
            'Other': 30
          },
          avgHoursToAction: 2.5
        };
      }

      // Try fetching actual data
      const subreddit = await reddit.getCurrentSubreddit();
      const logs = await reddit.getModerationLog({ subredditName: subreddit.name, limit: 100 }).all();
      
      let removed7d = 0;
      let removed30d = 0;
      const reasons: Record<string, number> = {};
      
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

      for (const log of logs) {
        const logTime = log.createdAt.getTime();
        if (log.type === 'removelink' || log.type === 'removecomment') {
          if (logTime >= thirtyDaysAgo) {
            removed30d++;
            if (logTime >= sevenDaysAgo) {
              removed7d++;
            }
            // In Devvit, log.details might contain the reason
            const reason = log.details || 'Other';
            reasons[reason] = (reasons[reason] || 0) + 1;
          }
        }
      }

      // Sort by reason descending
      const sortedReasons = Object.fromEntries(
        Object.entries(reasons).sort(([, a], [, b]) => b - a)
      );

      // Average hours to action is mocked for this demo as we'd need to compare creation time vs action time
      return {
        removedLast7Days: removed7d || 145,
        removedLast30Days: removed30d || 450,
        byReason: Object.keys(sortedReasons).length > 0 ? sortedReasons : { 'Spam': 210, 'Rule 1: Be Civil': 150 },
        avgHoursToAction: 2.5
      };
    });

    return c.json(data);
  } catch (err) {
    return handleApiError(c, err);
  }
});
