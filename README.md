# README

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

### Local Development with Supabase

For complete local development setup:

```bash
# Run Supabase locally
pnpx supabase start
# Run migrations
pnpx supabase migration up
```

## What could be improved

- SEO enhancements
- Caching: cache repeated db calls or API calls.
- Data fetching pattern: client side fetching and SSR. Prioritize SSR for public job pages.
- Monitoring: Sentry or Grafana
