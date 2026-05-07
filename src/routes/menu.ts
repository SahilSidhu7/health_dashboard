import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';
import type { MenuItemRequest, UiResponse } from '@devvit/web/shared';
import type { FormField } from '@devvit/shared-types/shared/form.js';

export const menu = new Hono();

const buildNukeFields = (targetId: string): FormField[] => [
  {
    name: 'targetId',
    label: 'Target ID',
    type: 'string',
    helpText: 'Auto-filled from the selected item.',
    required: true,
    defaultValue: targetId,
  },
  {
    name: 'remove',
    label: 'Remove comments',
    type: 'boolean',
    defaultValue: true,
  },
  {
    name: 'lock',
    label: 'Lock comments',
    type: 'boolean',
    defaultValue: false,
  },
  {
    name: 'skipDistinguished',
    label: 'Skip distinguished comments',
    type: 'boolean',
    defaultValue: false,
  },
];

const buildNukeForm = (title: string, targetId: string) => ({
  fields: buildNukeFields(targetId),
  title,
  acceptLabel: 'Mop',
  cancelLabel: 'Cancel',
});

menu.post('/mop-comment', async (c) => {
  const request = await c.req.json<MenuItemRequest>();
  console.log('request', request.targetId);
  return c.json<UiResponse>(
    {
      showForm: {
        name: 'mopComment',
        form: buildNukeForm('Mop Comments', request.targetId),
      },
    },
    200
  );
});

menu.post('/mop-post', async (c) => {
  const request = await c.req.json<MenuItemRequest>();
  return c.json<UiResponse>(
    {
      showForm: {
        name: 'mopPost',
        form: buildNukeForm('Mop Post Comments', request.targetId),
      },
    },
    200
  );
});

menu.post('/health-dashboard', async (c) => {
  try {
    const request = await c.req.json<MenuItemRequest>();
    // targetId is the subreddit Thing ID (t5_xxxxx)
    const subreddit = await reddit.getSubredditById(request.targetId as `t5_${string}`);
    if (!subreddit) {
      return c.json<UiResponse>({ showToast: { text: 'Could not find subreddit.', appearance: 'neutral' } }, 200);
    }

    const post = await reddit.submitCustomPost({
      subredditName: subreddit.name,
      title: 'Community Health Dashboard',
    });

    return c.json<UiResponse>({ navigateTo: post.permalink }, 200);
  } catch (err) {
    console.error('health-dashboard menu error:', err);
    return c.json<UiResponse>(
      { showToast: { text: 'Failed to open Health Dashboard. Please try again.', appearance: 'neutral' } },
      200
    );
  }
});
