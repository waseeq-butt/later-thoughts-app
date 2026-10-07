# Later

> Capture a thought now. Come back to it later.

Later is a minimal, offline-first progressive web app (PWA) for jotting down thoughts quickly and reviewing them privately afterward. Everything is stored locally in your browser; there is no backend or account.

## Features

- **Quick capture**: the home screen is a single text box. Write a thought and tap save. An unsaved draft survives a refresh (kept in `sessionStorage`).
- **PIN-protected list**: saved thoughts live behind a 4-digit PIN screen so they aren't visible at a glance.
- **Trash with undo**: press and hold a thought to move it to Trash (an *Undo* toast appears). Trashed thoughts can be restored or deleted forever, and are purged automatically after **24 hours**.
- **Installable and offline**: a service worker and web manifest let you install it to your home screen and use it without a connection.
- **Local storage**: data is kept in IndexedDB (via Dexie) on your device only.

> **Note:** The PIN is a hardcoded constant (`src/lib/config.ts`, default `2222`). It's a privacy screen for the MVP, not real security. Thoughts are not encrypted.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Zustand (UI state), Dexie (IndexedDB), Framer Motion, and `vite-plugin-pwa`.

## Getting started

Requires Node.js 18+ (a current LTS is recommended) and npm.

```bash
npm install
npm run dev
```

The dev server runs with `--host`, so it's also reachable from other devices on your network (handy for testing on a phone). Vite prints the local and network URLs.

### Scripts

| Command           | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                               |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/`              |
| `npm run preview` | Serve the production build locally                      |
| `npm run icons`   | Regenerate PWA icons in `public/` (`scripts/make-icons.mjs`, uses `sharp`) |

To test the installable/offline behavior, use `npm run build && npm run preview`.

## Project structure

```
src/
  App.tsx          Routes and PIN guard
  screens/         Home (capture), Pin, Thoughts (list), Trash
  components/      BottomBar, LongPressCard, Toast
  db/              Dexie schema (db.ts) and thought operations (thoughts.ts)
  store/           Zustand store (unlock state, toasts)
  lib/             Config (PIN), formatting, haptics, id helpers
public/            PWA icons
scripts/           Icon generation script
```

## Deployment

The app is a static site and is configured for [Vercel](https://vercel.com). `vercel.json` rewrites unknown routes to `index.html` for client-side routing while leaving static assets and the service worker untouched.
