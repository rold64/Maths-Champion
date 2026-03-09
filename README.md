# 🧮 Maths Champion

A fun, interactive maths training app for kids (ages 5–8). Built with React + Vite, installable as a PWA.

## Features

- **6 Challenge Modes**: Addition, Subtraction, Multiplication, Division, Add↔Sub Fact Families, Mul↔Div Fact Families
- **4 Difficulty Levels** per mode: Starter → Explorer → Champion → Legend
- **Visual Learning Aids**: Counting dots, grouped dots, subtraction visualization, fact family triangles
- **Sound Effects**: Synthesized via Web Audio API (no external files)
- **Streak Tracking**: Fire emoji streaks with milestone celebration sounds
- **PWA Support**: Installable on phones/tablets, works offline
- **Kid-Friendly**: Big tap targets, gentle error feedback, encouraging messages

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select the repo → Deploy

Vercel auto-detects Vite and configures everything. You'll get a URL like `maths-champion.vercel.app`.

## Deploy to Netlify

```bash
npm run build
```
Then drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop).

## Install as App

Once deployed, visit the URL on a phone or tablet:
- **Android**: Chrome will show "Add to Home Screen" prompt
- **iOS**: Tap Share → "Add to Home Screen"

The app works offline after first visit.

## Project Structure

```
├── public/
│   ├── manifest.json    # PWA manifest
│   ├── sw.js            # Service worker (offline support)
│   ├── favicon.svg      # Browser tab icon
│   ├── icon-192.png     # PWA icon (small)
│   └── icon-512.png     # PWA icon (large)
├── src/
│   ├── App.jsx          # Full game (all 6 modes)
│   ├── main.jsx         # Entry + SW registration
│   └── index.css        # Minimal reset
├── index.html           # Shell with PWA meta tags
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel SPA routing
└── package.json
```

## Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool
- **Web Audio API** — Sound effects (no external audio files)
- **Service Worker** — Offline caching
- **PWA** — Installable as home screen app

## License

MIT
