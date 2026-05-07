# Community Health Dashboard

A Devvit mod tool for monitoring and analyzing community health metrics. This app provides moderators with comprehensive insights into their subreddit's performance, engagement, and moderation trends.

## Features

The **Health Dashboard** provides:

- **Health Score Tracking**: Monitor overall community health with visual metrics
- **Workload Analysis**: View moderation workload and trends
- **Retention Statistics**: Analyze user retention patterns
- **Moderation Activity**: Track moderation logs and activities
- **Trend Analysis**: View community trends over time
- **Performance Metrics**: Cache management and performance optimization

## Tech Stack

- [Devvit](https://developers.reddit.com/): Reddit's platform for building and deploying apps
- [Vite](https://vite.dev/): Fast build tool for the web components
- [Hono](https://hono.dev/): Lightweight web framework for backend logic
- [TypeScript](https://www.typescriptlang.org/): Type-safe development

## Getting Started

1. **Clone this template** or use it as a starting point for your mod tool
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure your app** in `devvit.json`:
   - Update the app name
   - Set your development subreddit
4. **Start developing**:
   ```bash
   npm run dev
   ```
5. **Test your changes** in your development subreddit

## Project Structure

```
src/
├── index.ts          # Main server setup with Hono routes
├── client/           # React web components
│   ├── App.tsx       # Main dashboard application
│   ├── components/   # UI components (charts, metrics, stats)
│   └── styles.css    # Component styling
└── routes/
    ├── api.ts        # Public API endpoints
    ├── menu.ts       # Context menu item handlers
    ├── triggers.ts   # App lifecycle triggers
    └── server/routes/  # API routes for dashboard data
        ├── health.ts    # Health score calculation
        ├── workload.ts  # Moderation workload metrics
        ├── retention.ts # User retention analytics
        ├── trends.ts    # Community trends
        ├── modlog.ts    # Moderation log data
        ├── me.ts        # User profile data
        └── cache.ts     # Cache management
```

## Customizing Your Health Dashboard

This template is designed to be easily customizable:

1. **Add new metrics**: Create new route handlers in `src/server/routes/` for custom data
2. **Customize dashboard UI**: Edit components in `src/client/components/`
3. **Modify menu items**: Update `devvit.json` and handlers in `src/routes/menu.ts`
4. **Extend API endpoints**: Add new endpoints in `src/routes/api.ts` for external integrations

## Commands

- `npm run dev`: Starts development mode with live reload on your test subreddit
- `npm run build`: Builds your mod tool for production
- `npm run deploy`: Uploads a new version of your app to Reddit
- `npm run launch`: Publishes your app for review and public use
- `npm run login`: Authenticates your CLI with Reddit
- `npm run type-check`: Runs TypeScript type checking, linting, and formatting

## How It Works

The Health Dashboard provides real-time community insights:

1. **Menu Integration**: Click "Health Dashboard" from the mod menu to open the dashboard
2. **Data Collection**: Aggregates data from Reddit API for health metrics
3. **Real-time Updates**: Automatic refresh to keep metrics current
4. **Visual Analytics**: Charts and graphs for trend analysis

## Development Notes

- **Permissions**: The app requires `reddit: true` permission to access Reddit's API
- **User Types**: Menu items are restricted to `moderator` user type

## Deployment

1. Test thoroughly in your development subreddit
2. Run `npm run deploy` to upload your app
3. Use `npm run launch` to submit for Reddit's app review process
4. Once approved, users can install your mod tool from Reddit's app directory

This template provides everything you need to build powerful, user-friendly moderation tools for Reddit communities.
