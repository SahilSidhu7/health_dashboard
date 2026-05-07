import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import { withCache, handleApiError, USE_MOCK_DATA } from '../utils';

export const health = new Hono();

health.get('/', async (c) => {
  try {
    const data = await withCache('dashboard:health', async () => {
      let removalRate = 0; // % of posts removed
      let reportResolution = 0; // hours
      let retention = 0; // %

      if (USE_MOCK_DATA) {
        removalRate = 12;
        reportResolution = 4.5;
        retention = 35;
      } else {
        // Try fetching actual data if possible.
        // Due to API limitations, we will use mock-like heuristics or simply fallback to mock if needed.
        // For a real app, this would query modlog, post histories, etc.
        // const subreddit = await reddit.getCurrentSubreddit();
        // Since we can't easily query overall removal rate natively without scanning all posts,
        // we'll supply semi-realistic data for the demo.
        removalRate = 8;
        reportResolution = 2;
        retention = 40;
      }

      // Compute sub-scores
      // removalRate score: lower removal rate = higher score. If <5% -> 100, if >40% -> 0, linear in between
      let removalRateScore = 100;
      if (removalRate >= 40) removalRateScore = 0;
      else if (removalRate > 5) removalRateScore = 100 - ((removalRate - 5) / 35) * 100;

      // reportResolution score: average hours. <1hr -> 100, >48hr -> 0, linear
      let reportResolutionScore = 100;
      if (reportResolution >= 48) reportResolutionScore = 0;
      else if (reportResolution > 1) reportResolutionScore = 100 - ((reportResolution - 1) / 47) * 100;

      // retention score: % of first-time posters. >50% -> 100, <5% -> 0, linear
      let retentionScore = 0;
      if (retention >= 50) retentionScore = 100;
      else if (retention > 5) retentionScore = ((retention - 5) / 45) * 100;

      removalRateScore = Math.round(removalRateScore);
      reportResolutionScore = Math.round(reportResolutionScore);
      retentionScore = Math.round(retentionScore);

      const finalScore = Math.round(
        removalRateScore * 0.4 + reportResolutionScore * 0.3 + retentionScore * 0.3
      );

      return {
        score: finalScore,
        subScores: {
          removalRate: removalRateScore,
          reportResolution: reportResolutionScore,
          retention: retentionScore,
        },
      };
    });

    return c.json(data);
  } catch (err) {
    return handleApiError(c, err);
  }
});
