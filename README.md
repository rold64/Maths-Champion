# Maths Champion

A fun, interactive maths training app for kids (ages 5–8). Built with React + Vite, installable as a PWA.

## Features

- **11 Challenge Modes**: Addition, Subtraction, Multiplication, Division, Add↔Sub Fact Families, Mul↔Div Fact Families, Number Bonds, Number Frame, Place Value, Fractions, Telling Time
- **Learn + Practice** for standard modes — step-through teaching slides before jumping into practice
- **4 Difficulty Levels** per mode: Starter (1–5) → Explorer (1–10) → Champion (1–20) → Legend (1–50)
- **Number Frame activities**:
  - Count a target quantity
  - Subitize a quick image, then rebuild it
  - Add with two addend frames and a total frame
  - Make 10 by completing a fixed starting amount
  - Build a missing number bond part
  - Compare two frames using Left, Right, or Equal
- **Ten-cell manipulative** — an interactive 2-by-5 frame with direct counter selection
- **Responsive homepage** — section-based grids adapt from five-across core cards to tablet and phone layouts
- **Cohesive visual system** — cool-neutral backgrounds and translucent cards keep the activity colors as clear accents
- **Smart Visual Aids**:
  - Number lines with directional arc arrows for addition and subtraction
  - Dienes place-value blocks (hundreds, tens, ones)
  - Analogue clock face for telling time
  - Fraction bar, number bond diagram, fact family triangle
  - Counting dots and grouped dot arrays for small numbers
- **Adaptive Difficulty** — tracks rolling accuracy and suggests level adjustments
- **Progress Persistence** — scores and history saved in localStorage
- **Sound Effects** — synthesized via Web Audio API (no external audio files)
- **Streak Tracking** — fire emoji streaks with celebration sounds
- **PWA** — installable on iOS/Android, works fully offline

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
# Output is in dist/
```

## Deploy

### Cloudflare Pages (recommended)
1. Push to GitHub
2. Cloudflare Pages → Connect to Git → select repo
3. Build command: `npm run build` · Output directory: `dist`

Auto-deploys on every push to `main`. No `_redirects` file needed — the app uses state-based navigation with no URL sub-routes.

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag dist/ to app.netlify.com/drop
```

### Local server
```bash
npm run build
npx serve dist
```

## Install as App

Visit the deployed URL on a phone or tablet:
- **Android**: Chrome shows "Add to Home Screen" prompt
- **iOS**: Tap Share → "Add to Home Screen"

Works offline after first visit.

## Project Structure

```
src/
├── App.jsx                  # Root router
├── data/
│   ├── operations.js        # All 11 operation configs
│   └── levels.js            # 4 difficulty tiers
├── utils/
│   ├── generateProblem.js   # Problem generators
│   ├── adaptive.js          # Adaptive difficulty logic
│   └── storage.js           # localStorage helpers
├── sounds/
│   └── SoundEngine.js       # Web Audio API sounds
├── screens/
│   ├── Homepage.jsx         # Mode selection grid
│   ├── LevelSelect.jsx      # Difficulty picker
│   ├── GameScreen.jsx       # 10-round game loop
│   ├── TeachScreen.jsx      # Step-through learning mode
│   └── TenFrameScreen.jsx   # Number Frame activities
└── components/
    ├── VisualHelper.jsx      # Routes to correct visual per mode
    ├── TenFrameBoard.jsx     # Interactive fixed 2×5 ten-frame board
    ├── NumberPad.jsx
    ├── ProgressBar.jsx
    ├── StarBurst.jsx
    └── visuals/
        ├── NumberLine.jsx        # SVG arc number line with direction arrow
        ├── DotGroup.jsx
        ├── MultiplicationDots.jsx
        ├── DivisionDots.jsx
        ├── FactFamilyTriangle.jsx
        ├── NumberBond.jsx
        ├── PlaceValueDisplay.jsx # Dienes blocks
        ├── FractionBar.jsx
        └── ClockFace.jsx
```

## Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool
- **Web Audio API** — Synthesized sound effects
- **Service Worker** — Offline caching
- **localStorage** — Progress persistence

## License

MIT
