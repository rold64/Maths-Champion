# CLAUDE.md — Maths Champion Project Bible

> Complete project context, architecture, design decisions, and implementation details.
> This file serves as the single source of truth for any AI or developer picking up this project.

---

## 1. Project Overview

**Maths Champion** is an interactive maths training PWA built for a 7-year-old child. The goal is to make maths practice engaging, visually rich, and pedagogically sound. It runs as a standalone installable app on phones, tablets, and desktops.

**Target audience:** Children ages 5–8, with parent guidance.

**Core philosophy:**
- Visual polish and child-appropriate design are as important as functionality
- Pedagogy over gamification — visuals teach *why*, not just *what*
- Gentle error handling — wrong answers are learning opportunities, not punishments
- Zero external dependencies at runtime — all sounds synthesized, all visuals inline

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 | Functional components, hooks only |
| Build | Vite 6 | Fast dev server, auto-detected by Vercel |
| Styling | Inline styles | No CSS framework; all styles in JSX |
| Typography | Fredoka (Google Fonts) | Weights: 400, 500, 600, 700 |
| Sound | Web Audio API | `SoundEngine` singleton, oscillator-based |
| PWA | manifest.json + sw.js | Offline-capable, installable |
| Deployment | Vercel (primary) | Also works on Netlify, GitHub Pages |
| Alt hosting | Docker + Nginx | For self-hosting on LAN |

**No external audio files, no CSS framework, no state management library, no router library.** The entire app is a single ~1000-line JSX file with hand-rolled screen routing via `useState`.

---

## 3. Project Structure

```
maths-champion/
├── public/
│   ├── manifest.json      # PWA manifest (name, icons, display mode)
│   ├── sw.js              # Service worker (network-first, offline fallback)
│   ├── favicon.svg        # Browser tab icon (indigo→pink gradient, math symbols)
│   ├── icon-192.png       # PWA icon small (generated from SVG)
│   └── icon-512.png       # PWA icon large (generated from SVG)
├── src/
│   ├── App.jsx            # THE app — all 6 game modes, all screens, all logic
│   ├── main.jsx           # React entry point + service worker registration
│   └── index.css          # Minimal reset (box-sizing, overscroll, tap highlight)
├── index.html             # Shell with PWA meta tags, iOS support, viewport lock
├── package.json           # Vite + React deps
├── vite.config.js         # Minimal Vite config
├── vercel.json            # SPA rewrite rule
├── README.md              # Setup and deploy instructions
└── CLAUDE.md              # This file
```

---

## 4. Architecture — App.jsx Internals

The entire application lives in `src/App.jsx`. It's organized into these logical sections:

### 4.1 SoundEngine (lines ~3–69)

An IIFE singleton that creates and manages a single `AudioContext`. All sounds are synthesized via `OscillatorNode` + `GainNode` chains.

**Sound catalog:**

| Sound | Trigger | Character |
|-------|---------|-----------|
| `tap()` | Number key press | 880Hz sine, 60ms, soft |
| `backspace()` | Backspace key | 440Hz square, 50ms, very soft |
| `correct()` | Right answer | C5→E5→G5 ascending chime (3 notes) |
| `wrong()` | Wrong answer | 250Hz→200Hz descending triangle, gentle |
| `streak()` | Every 3rd correct in a row | 4-note ascending sparkle |
| `victory()` | Results screen shown | C→E→G→C6 fanfare with harmonic overlay |
| `selectChallenge()` | Tap operation card on homepage | 2-tone "select" chime |
| `selectLevel()` | Tap difficulty level | 3-note ascending "ready" tone |
| `navigate()` | Back/Home/Levels buttons | 2-note descending soft "swoosh" |

**Design principle:** All volumes are kept low (0.04–0.22) and gentle. The `wrong()` sound uses `triangle` waveform intentionally to avoid harshness. No sound should startle a child.

**AudioContext resume:** The engine handles Safari's autoplay policy by calling `ctx.resume()` on every sound trigger, since the first user interaction unlocks the context.

### 4.2 OPERATIONS Array (lines ~75–113)

Each operation is a config object with:

```js
{
  id: "addition",        // Route key, used everywhere
  name: "Addition",      // Display name
  symbol: "+",           // Math symbol shown in equations
  emoji: "➕",           // Card icon
  color: "#6366f1",      // Primary theme color
  gradient: "...",       // Button gradient
  bg: "...",             // Full-screen background gradient
  tagline: "...",        // Subtitle on cards
  dotColorA: "#6366f1",  // First operand dot color
  dotColorB: "#ec4899",  // Second operand dot color
  isFamily: true/false,  // Fact family mode flag
}
```

**Color scheme per operation:**

| Operation | Primary | Theme | Dot A | Dot B |
|-----------|---------|-------|-------|-------|
| Addition | #6366f1 (indigo) | Warm pastel rainbow | Indigo | Pink |
| Subtraction | #0ea5e9 (sky blue) | Cool blue gradient | Sky | Rose |
| Multiplication | #f59e0b (amber) | Warm yellow | Amber | Purple |
| Division | #10b981 (emerald) | Green gradient | Emerald | Orange |
| Add↔Sub | #8b5cf6 (violet) | Lavender | Indigo | Sky |
| Mul↔Div | #d97706 (dark amber) | Amber-green | Amber | Emerald |

The fact family operations intentionally blend the colors of the two operations they connect.

### 4.3 LEVELS Object (lines ~116–153)

Each operation has 4 difficulty tiers:

| Level | Emoji | Color | Addition/Sub range | Mul/Div range | Add↔Sub | Mul↔Div |
|-------|-------|-------|-------------------|---------------|---------|---------|
| Starter | 🌱 | #4CAF50 | 1–5 | ×1–3 | 1–5 | 1–3 |
| Explorer | 🚀 | #2196F3 | 1–10 | ×1–5 | 1–10 | 1–5 |
| Champion | 🏆 | #FF9800 | 1–20 | ×1–10 | 1–15 | 1–10 |
| Legend | ⭐ | #E91E63 | 1–50 | ×1–12 | 1–20 | 1–12 |

**Design choice:** Multiplication/division use times-table ranges (max multiplier), not raw number ranges. Division always generates clean whole-number answers by computing `a = b × answer` first.

### 4.4 Problem Generation — `generateProblem(opId, max)`

**Standard operations** return `{ a, b, answer }`.

**Fact family operations** return an extended object:
```js
{
  a, b, answer,           // The specific equation to solve
  symbol: "+" | "−",      // Which operation this particular equation uses
  family: { x, y, total },// The three numbers in the family
  familyType: "a+b" | "b+a" | "t-a" | "t-b"  // Which of the 4 forms was picked
}
```

Each round randomly picks one of the 4 family forms, so the child encounters all relationships across a game.

**Subtraction constraint:** `a` is always > `b` to avoid negative results.

**Division constraint:** Generated backwards (`b × answer = a`) to guarantee integer results.

### 4.5 Visual Components

**DotGroup** — Renders `count` colored circles in rows of 5. Used for addition (two groups side by side with "+" between them).

**MultiplicationDots** — Renders `a` rows of `b` dots with subtle background grouping. Capped at 60 total dots. Shows "a groups of b" label.

**DivisionDots** — Renders `total/divisor` dashed-border groups, each containing `divisor` dots. Shows "total shared into groups of divisor" label. Capped at 60 total.

**Subtraction visual** — Single group of `a` dots where the last `b` are faded/dimmed. Legend shows "● keep" and "● remove".

**FactFamilyTriangle** — SVG triangle with:
- Top vertex: the total (in colorA circle)
- Bottom-left: x (in colorB circle)
- Bottom-right: y (in colorB circle)
- Operation symbols on the triangle edges
- Four mini-equation badges below showing all family relationships

**All dot visuals are hidden when numbers get large** (>30 for add/sub, >60 for mul/div) to prevent overwhelming layouts.

**Toggle button:** "Show/Hide counting dots" (or "fact family" for family modes) lets the child or parent control visual scaffolding.

### 4.6 Screen Flow

```
Homepage → LevelSelect → GameScreen → ResultsScreen
    ↑          ↑              ↑              │
    └──────────┴──────────────┴──────────────┘
                    (navigation)
```

Routing is managed by a single `screen` state in the root `MathsChampion` component. No react-router — just conditional rendering.

**GameScreen key prop:** `key={selectedOp-selectedLevel-Date.now()}` forces a full remount when replaying, ensuring clean state.

### 4.7 Game Loop (GameScreen)

1. Generate problem → display equation with answer box (blinking cursor)
2. Child types via NumberPad → digits accumulate in `userInput` state
3. Child presses ✓ → `checkAnswer()` fires
4. **If correct:** burst animation, score++, streak++, encouraging message, 1.2s pause → next
5. **If wrong:** gentle error sound, streak reset, teaching message, 2.8s pause → next
6. After 10 rounds → done=true → ResultsScreen

**Streak logic:** Every 3rd consecutive correct answer triggers `SoundEngine.streak()` instead of the normal `correct()` sound. The 🔥 emoji appears in the score display at streak ≥ 3.

**Feedback messages** are stored in a `useRef` (`feedbackMsgRef`) rather than state to avoid re-render timing issues with the random message selection.

### 4.8 Fact Family Pedagogy

When a child gets a wrong answer in fact family mode, the feedback explicitly teaches the inverse relationship:

- Add↔Sub: *"The answer is 3. Because 3+5=8, we know 8−5=3!"*
- Mul↔Div: *"The answer is 4. Because 3×4=12, we know 12÷3=4!"*

Correct answer feedback occasionally reinforces the pattern:
- *"You see the pattern! 3, 5, 8 are a family! 👨‍👩‍👧"*
- *"Yes! 3×4=12 and 12÷3=4! 🔗"*

Wrong answer display time is 2.8s (vs 1.2s for correct) to give reading time for the educational message.

### 4.9 Results Screen

Displays after 10 rounds:
- Trophy/star/thumbs-up/flexed-arm emoji based on score thresholds (9+, 7+, 5+, <5)
- Star row (filled vs empty)
- Best streak badge (if >1)
- Scrollable results list showing each equation, the child's answer, and ✓/✗ with correct answer
- Three buttons: Play Again (same level), Levels (back to level select), Home

### 4.10 Homepage Layout

The homepage uses a 2-section layout:
1. **Core operations** — 2×2 grid of the 4 basic operations
2. **Fact Family Challenges** — labeled section with 2 cards below

The fact family cards have a subtle gradient background (`linear-gradient` mixing both operation colors) to visually distinguish them as advanced challenges.

Parent tip box at the bottom with dashed border.

---

## 5. PWA Configuration

### manifest.json
- `display: "standalone"` — no browser chrome
- `orientation: "portrait"` — locked for phone/tablet use
- `background_color: "#fef9c3"` — matches the warm yellow homepage background
- `theme_color: "#6366f1"` — indigo status bar
- Icons at 192px and 512px with `purpose: "any maskable"`

### Service Worker (sw.js)
- **Strategy:** Network-first with cache fallback
- **Install:** Pre-caches shell assets (index.html, manifest, icons)
- **Fetch:** Tries network first, caches successful responses, falls back to cache when offline
- **Activate:** Cleans old cache versions
- `skipWaiting()` + `clients.claim()` for immediate activation

### index.html PWA Meta Tags
- `<meta name="apple-mobile-web-app-capable" content="yes">` — iOS standalone
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` — iOS status bar
- `<meta name="apple-mobile-web-app-title" content="Maths Champ">` — iOS app name
- `<link rel="apple-touch-icon" href="/icon-192.png">` — iOS icon
- `viewport` with `maximum-scale=1.0, user-scalable=no` — prevents pinch zoom during gameplay

### index.css PWA Enhancements
- `overscroll-behavior-y: contain` — prevents pull-to-refresh during gameplay
- `-webkit-tap-highlight-color: transparent` — removes blue tap flash on mobile
- `min-height: 100dvh` — uses dynamic viewport height for mobile browsers

---

## 6. Deployment

### Vercel (Primary)
```bash
npm install
vercel
```
Vercel auto-detects Vite. The `vercel.json` provides SPA routing: all paths rewrite to `/index.html`.

### Cloudflare Pages
**Option 1: Wrangler CLI**
```bash
npm run build
npx wrangler pages project create maths-champion
npx wrangler pages deploy dist
```

**Option 2: GitHub Integration**
1. Push the project to a GitHub repo
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git
3. Select the repo, set build command to `npm run build` and output directory to `dist`
4. Deploy

Cloudflare Pages serves from its global edge network (300+ cities), giving excellent TTFB worldwide. Free tier includes unlimited bandwidth and requests. SPA routing is handled automatically — add a `_redirects` file in `public/` if needed:
```
/*    /index.html   200
```

### Netlify
```bash
npm run build
# Drag dist/ folder to netlify.com/drop
```

### Docker (Self-hosted LAN)
```bash
npm run build
docker run -d -p 8080:80 -v ./dist:/usr/share/nginx/html nginx:alpine
```

---

## 7. Design Decisions & Rationale

### Why inline styles instead of CSS modules/Tailwind?
The entire app is a single JSX file. Inline styles keep everything co-located, making it easy to see how a component looks by reading its code. No build-time CSS processing needed. The trade-off is larger file size, but for a ~1000-line app this is negligible.

### Why Web Audio API instead of audio files?
- Zero network requests for sounds
- No asset hosting or CORS issues
- Precise control over tone, volume, and timing
- Works offline immediately
- Smaller bundle size

### Why no react-router?
Three screens with simple state-based routing. Adding a router would increase bundle size and complexity for no benefit. The `screen` state + conditional rendering is trivially simple and sufficient.

### Why Fredoka font?
It's rounded, friendly, and highly legible for children. The weight range (400–700) provides enough hierarchy without switching fonts. It's a Google Font, so it's free and CDN-cached.

### Why 10 rounds per game?
Short enough to maintain a 7-year-old's attention span. Long enough to provide meaningful practice and a satisfying results summary.

### Why 2.8s for wrong answers vs 1.2s for correct?
Wrong answer messages are longer (they teach the relationship) and children need time to read and absorb them. Correct answers just need a quick celebration before moving on.

### Why fact family triangle (not house or other shape)?
The triangle naturally shows hierarchy (total at top, parts at bottom) and the edges represent the operations connecting them. It's a standard pedagogical tool used in primary maths education.

---

## 8. Component Reference

| Component | Purpose | Props |
|-----------|---------|-------|
| `MathsChampion` | Root router | — |
| `Homepage` | Operation selection grid | `onSelect(opId)` |
| `OpCard` | Individual operation button | `op, delay, onSelect, isFamily?` |
| `LevelSelect` | Difficulty picker | `opId, onSelectLevel(idx), onBack` |
| `GameScreen` | Main game loop | `opId, levelIdx, onHome, onLevelSelect` |
| `VisualHelper` | Routes to correct visual | `opId, problem, op` |
| `DotGroup` | Colored dot grid | `count, color, label` |
| `MultiplicationDots` | Grouped dot rows | `a, b, color` |
| `DivisionDots` | Dashed-border groups | `total, divisor, color` |
| `FactFamilyTriangle` | SVG triangle + equations | `family, opType, colorA, colorB` |
| `MiniEq` | Small equation badge | `text, c` |
| `NumberPad` | 0–9 + backspace + submit | `onPress(key), disabled` |
| `ProgressBar` | Horizontal fill bar | `current, total, color` |
| `StarBurst` | Particle animation | `x, y` |

---

## 9. State Shape (GameScreen)

```js
problem     // { a, b, answer, symbol?, family?, familyType? }
userInput   // string — digits typed so far
feedback    // null | "correct" | "wrong"
score       // number — correct answers this game
streak      // number — consecutive correct (resets on wrong)
bestStreak  // number — highest streak this game
round       // number — 0-indexed, 0–9
results     // array of { a, b, answer, userAnswer, correct, symbol }
bursts      // array of { id, x, y } — active particle animations
showDots    // boolean — visual helper visibility
done        // boolean — triggers results screen
```

---

## 10. Known Constraints & Edge Cases

- **Large number visuals:** Dot visualizations are automatically hidden when numbers exceed 30 (add/sub) or products exceed 60 (mul/div) to prevent layout overflow.
- **Division by zero:** Impossible by design — `b` is always ≥ 1 in generation.
- **Negative results:** Impossible — subtraction ensures `a > b`.
- **AudioContext on iOS:** The `getCtx()` function handles Safari's autoplay restriction by resuming the context on each sound call.
- **Font loading:** Fredoka is loaded via `<link>` in the JSX return, which means there's a brief FOUT (flash of unstyled text) on first load. This is acceptable for the use case.
- **No persistent state:** Scores are not saved between sessions. Each game is fresh. This is intentional — the app is for practice, not competitive record-keeping.

---

## 11. Related Project Assets

A separate **Multiplication Table PDF** was also created for this child:
- Single landscape A4 page
- 6×2 grid showing all 12 times tables (1× through 12×)
- Sky blue background, colored headers with number names
- Alternating row shading for readability
- Title: "Multiplication Table"

This PDF is a standalone printable companion to the app's multiplication mode.

---

## 12. Development Process & Preferences

The project owner (84Bits) has established these working patterns:

1. **Always describe planned changes and ask for confirmation before implementing.** Never jump straight to code changes.
2. **Iterative expansion** — features are added incrementally with review between steps.
3. **Deployment-ready deliverables** — every iteration should produce a complete, deployable package.
4. **Visual quality matters** — color contrast, layout clarity, and child-appropriate aesthetics are high priorities.
5. **Pedagogical depth** — features should teach concepts, not just drill answers. The fact family challenges are a prime example.

---

## 13. Potential Future Directions

These are not confirmed but are natural extensions of the current trajectory:

- **Score persistence** — localStorage or cloud-based progress tracking
- **Additional challenge modes** — fractions, number bonds, place value, telling time
- **Adaptive difficulty** — auto-adjust level based on accuracy rate
- **Parent dashboard** — view child's progress, weakest areas, session history
- **Multiple profiles** — support for siblings on the same device
- **Timed mode** — speed challenge variant for confident learners
- **Achievement badges** — "First perfect score", "10-game streak", etc.
- **Expanded fact families** — show all 4 equations across multiple rounds from the same family
- **Number line visual** — alternative to dots for addition/subtraction
- **Audio narration** — spoken numbers and encouragement via Web Speech API
