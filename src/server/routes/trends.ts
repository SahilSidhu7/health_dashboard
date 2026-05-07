import { Hono } from 'hono';
// import { reddit } from '@devvit/web/server';
import { withCache, handleApiError, USE_MOCK_DATA } from '../utils';

export const trends = new Hono();

trends.get('/', async (c) => {
  try {
    const data = await withCache('dashboard:trends', async () => {
      const result: { date: string, reportCount: number, isSpike: boolean }[] = [];
      const now = new Date();
      
      // Mock data generation
      const mockData = [];
      // let rollingSum = 0;
      
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Base traffic 10-30
        let count = Math.floor(Math.random() * 20) + 10;
        
        // Add random spikes
        if (Math.random() > 0.9) {
          count += 50;
        }

        mockData.push({ date: dateStr, count });
      }

      for (let i = 0; i < mockData.length; i++) {
        // Calculate 7-day rolling average (excluding current day for spike check)
        let sum = 0;
        let days = 0;
        for (let j = 1; j <= 7; j++) {
          if (i - j >= 0 && mockData[i - j]) {
            sum += mockData[i - j]?.count || 0;
            days++;
          }
        }
        
        const count = mockData[i]?.count || 0;
        const avg = days > 0 ? sum / days : count;
        const isSpike = count > (avg * 2) && count > 15; // >15 to avoid spikes on very low traffic
        
        result.push({
          date: mockData[i]?.date || '',
          reportCount: count,
          isSpike
        });
      }

      if (USE_MOCK_DATA) {
        return result;
      }

      // Returns mock data mostly because Devvit doesn't easily expose daily report aggregates
      // without storing them explicitly on action.
      return result;
    });

    return c.json(data);
  } catch (err) {
    return handleApiError(c, err);
  }
});
