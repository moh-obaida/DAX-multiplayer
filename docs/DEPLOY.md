# DAX Deployment Guide

## Vercel

1. Connect the GitHub repository to Vercel.
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | Yes | Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_APP_URL` | Yes | Production URL (e.g. `https://dax-game.com`) |
| `VITE_GA_ID` | Optional | Google Analytics 4 measurement ID |
| `VITE_SENTRY_DSN` | Optional | Sentry DSN for error tracking |

Copy from `.env.example` locally into `.env.local` (never commit `.env.local`).

## Firebase

1. Create a Realtime Database (US region).
2. Deploy security rules:
   ```bash
   firebase deploy --only database
   ```
3. Enable **Anonymous** authentication in Firebase Console.
4. Replace test-mode rules with [`database.rules.json`](../database.rules.json) before public launch.

## Custom domain

1. Add domain in Vercel → Domains.
2. Update DNS records as instructed by Vercel.
3. Set `VITE_APP_URL` to your production domain.
4. Update `public/sitemap.xml` and `public/robots.txt` with the live domain.

## Assets

Regenerate favicon and social images after logo changes:

```bash
npm run assets:generate
```

## Preview deployments

Vercel creates preview URLs for each PR automatically. Use the same Firebase env vars for preview, or a separate Firebase project for staging.
