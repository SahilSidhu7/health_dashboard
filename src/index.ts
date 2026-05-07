import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createServer, getServerPort } from '@devvit/web/server';
import { api } from './routes/api';
import { menu } from './routes/menu';
import { triggers } from './routes/triggers';
import { health } from './server/routes/health';
import { modlog } from './server/routes/modlog';
import { retention } from './server/routes/retention';
import { workload } from './server/routes/workload';
import { trends } from './server/routes/trends';
import { me } from './server/routes/me';
import { cacheRoute } from './server/routes/cache';

const app = new Hono();
const internal = new Hono();

internal.route('/menu', menu);
internal.route('/triggers', triggers);

app.route('/api', api);
app.route('/api/health', health);
app.route('/api/modlog', modlog);
app.route('/api/retention', retention);
app.route('/api/workload', workload);
app.route('/api/trends', trends);
app.route('/api/me', me);
app.route('/api/cache', cacheRoute);
app.route('/internal', internal);

serve({
  fetch: app.fetch,
  createServer,
  port: getServerPort(),
});
