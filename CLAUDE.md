# CLAUDE.md — Maths Champion Project Bible

> Complete project context, architecture, design decisions, and implementation details.
> This file is the single source of truth for any AI or developer picking up this project.

---

## 1. Project Overview

**Maths Champion** is an interactive maths training PWA built for a 7-year-old child. The goal is to make maths practice engaging, visually rich, and pedagogically sound. It runs as a standalone installable app on phones, tablets, and desktops.

**Target audience:** Children ages 5–8, with parent guidance.

**Core philosophy:**
- Visual polish and child-appropriate design are as important as functionality
- Pedagogy over gamification — visuals teach *why*, not just *what*
- Gentle error handling — wrong answers are learning opportunities, not punishments
- Zero external dependencies at runtime — all sounds synthesized, all visuals inline SVG/JSX
- Attention to pixel-level detail — label collisions, overflow, and spacing must be perfect

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 | Functional components, hooks only |
| Build | Vite 6 | Fast dev server, PWA-ready |
| Styling | Inline styles | No CSS framework; all styles in JSX props |
| Typography | Fredoka (Google Fonts) | Weights: 400, 500, 600, 700 — child-friendly rounded font |
| Sound | Web Audio API | `SoundEngine` singleton, oscillator-based, no audio files |
| PWA | manifest.json + sw.js | Offline-capable, installable on iOS/Android |
| Deployment | Cloudflare Pages (primary) | GitHub-connected, auto-deploys on push to main |
| State persistence | localStorage | Progress, scores, adaptive difficulty per operation+level |

**No external audio files, no CSS framework, no state management library, no router library.**
Routing is state-based (`currentScreen` in App.jsx). All visual components use inline SVG or JSX.

---

## 3. Project Structure

```
maths-champion/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker (network-first, offline fallback)
│   ├── favicon.svg            # Browser tab icon
│   ├── icon-192.png           # PWA icon small
│   └── icon-512.png           # PWA icon large
├── src/
│   ├── App.jsx                # Root router — mounts screens, holds top-level state
│   ├── main.jsx               # React entry + service worker registration
│   ├── index.css              # Minimal reset (box-sizing, overscroll, tap highlight)
│   │
│   ├── data/
│   │   ├── operations.js      # All 10 operation config objects (colors, symbols, flags)
│   │   └── levels.js          # 4 difficulty tiers per operation type
│   │
│   ├── utils/
│   │   ├── generateProblem.js # Problem generators for all 10 operation types
│   │   ├── adaptive.js        # Adaptive difficulty: performance tracking, level suggestion
│   │   └── storage.js         # localStorage helpers (save/load progress, history)
│   │
│   ├── sounds/
│   │   └── SoundEngine.js     # Web Audio API singleton — all sounds synthesized
│   │
│   ├── screens/
│   │   ├── Homepage.jsx       # Operation selection grid (Core + Fact Family sections)
│   │   ├── LevelSelect.jsx    # Difficulty picker (Starter/Explorer/Champion/Legend)
│   │   ├── GameScreen.jsx     # Main 10-round game loop
│   │   └── TeachScreen.jsx    # Step-by-step learning mode for all 10 operations
│   │
│   └── components/
│       ├── VisualHelper.jsx       # Routes to the correct visual for each operation
│       ├── NumberPad.jsx          # 0–9 + backspace + submit keypad
│       ├── ProgressBar.jsx        # Horizontal fill bar (game progress)
│       ├── StarBurst.jsx          # Particle burst animation on correct answers
│       ├── MiniEq.jsx             # Small equation badge (used in fact family triangle)
│       └── visuals/
│           ├── NumberLine.jsx         # SVG number line with arc, arrowhead, smart labels
│           ├── DotGroup.jsx           # Colored dot grid (rows of 5)
│           ├── MultiplicationDots.jsx # Grouped dot rows for multiplication
│           ├── DivisionDots.jsx       # Dashed-border groups for division
│           ├── FactFamilyTriangle.jsx # SVG triangle + 4 mini-equation badges
│           ├── NumberBond.jsx         # Circle-and-branch number bond diagram
│           ├── PlaceValueDisplay.jsx  # Dienes blocks (hundreds/tens/ones)
│           ├── FractionBar.jsx        # Coloured fraction strip visual
│           └── ClockFace.jsx          # SVG analogue clock
│
├── index.html                 # Shell with PWA meta tags, iOS support, viewport lock
├── package.json               # Vite + React deps
├── vite.config.js             # Minimal Vite config
└── README.md                  # Setup and deploy instructions
```

---

## 4. Operations — All 10 Modes

Defined in `src/data/operations.js`. Each operation is a config object:

```js
{
  id: "addition",        // Route key used everywhere
  name: "Addition",
  symbol: "+",
  emoji: "➕",
  color: "#6366f1",      // Primary theme color
  gradient: "...",       // Button gradient CSS
  bg: "...",             // Full-screen background gradient
  tagline: "...",
  dotColorA: "#6366f1",  // First operand visual color
  dotColorB: "#ec4899",  // Second operand visual color
  isFamily: false,       // true for fact family modes
}
```

### Operation index

| # | ID | Name | Type | Range (Legend) |
|---|----|----|------|----------------|
| 0 | `addition` | Addition | Core | 1–50 |
| 1 | `subtraction` | Subtraction | Core | 1–50 |
| 2 | `multiplication` | Multiplication | Core | ×1–12 |
| 3 | `division` | Division | Core | ÷1–12 |
| 4 | `addSubFamily` | Add↔Sub Family | Family | 1–20 |
| 5 | `mulDivFamily` | Mul↔Div Family | Family | 1–12 |
| 6 | `numberBonds` | Number Bonds | Bonds | to 20 |
| 7 | `placeValue` | Place Value | Place | hundreds |
| 8 | `fractions` | Fractions | Fractions | halves/quarters |
| 9 | `tellingTime` | Telling Time | Time | o'clock / half / quarter |

### Color scheme

| Operation | Primary color | Theme |
|-----------|--------------|-------|
| Addition | #6366f1 (indigo) | Warm pastel rainbow |
| Subtraction | #0ea5e9 (sky) | Cool blue |
| Multiplication | #f59e0b (amber) | Warm yellow |
| Division | #10b981 (emerald) | Green |
| Add↔Sub Family | #8b5cf6 (violet) | Lavender |
| Mul↔Div Family | #d97706 (dark amber) | Amber-green |
| Number Bonds | #ec4899 (pink) | Rose |
| Place Value | #7c3aed (purple) | Deep violet |
| Fractions | #f43f5e (rose) | Warm red |
| Telling Time | #0891b2 (cyan) | Teal |

---

## 5. Difficulty Levels

Defined in `src/data/levels.js`. Four tiers per operation type:

| Level | Emoji | Addition/Sub | Mul/Div | Fact Family | Bonds | Place | Time |
|-------|-------|-------------|---------|-------------|-------|-------|------|
| Starter | 🌱 | 1–5 | ×1–3 | 1–5 | to 5 | tens/ones | o'clock |
| Explorer | 🚀 | 1–10 | ×1–5 | 1–10 | to 10 | tens/ones | half past |
| Champion | 🏆 | 1–20 | ×1–10 | 1–15 | to 15 | hundreds | quarter |
| Legend | ⭐ | 1–50 | ×1–12 | 1–20 | to 20 | hundreds | all |

---

## 6. Problem Generation (`src/utils/generateProblem.js`)

**Standard operations** return `{ a, b, answer }`.

**Fact family** returns extended object:
```js
{
  a, b, answer,
  symbol: "+" | "−" | "×" | "÷",
  family: { x, y, total },
  familyType: "a+b" | "b+a" | "t-a" | "t-b"  // one of 4 forms
}
```

**Number bonds** returns `{ a, b, answer, bondTotal }` — one part is given, child supplies the other.

**Place value** returns `{ number, askCol, qType }` — qType is "value" (what is the value of the digit) or "digit" (what digit is in the X place).

**Fractions** returns `{ numerator, denominator, answer, questionType }`.

**Telling time** returns `{ hours, minutes, displayString, questionType }` — questionType is "hour", "minute", or "read" (full time).

**Division constraint:** Generated backwards (`b × answer = a`) to guarantee integer results.
**Subtraction constraint:** `a` is always ≥ `b` to avoid negative results.

---

## 7. Adaptive Difficulty (`src/utils/adaptive.js`)

Tracks rolling accuracy (last 10 answers) per operation+level pair in localStorage. After each game session, the engine suggests a level adjustment: if accuracy > 85% consistently, suggest moving up; if < 50%, suggest moving down. This is advisory only — the child chooses the level.

---

## 8. Visual Components

### 8.1 VisualHelper (`src/components/VisualHelper.jsx`)

Central router that receives `{ opId, problem, op }` and renders the appropriate visual. Key routing logic:

- **Addition:** `a + b > 10 && b >= 3` → `NumberLine`; else if `a + b <= 30` → `DotGroup` pair; else nothing
- **Subtraction:** `a > 10 && b >= 3` → `NumberLine`; else if `a <= 30` → dot strip with faded removals; else nothing
- **Multiplication:** → `MultiplicationDots`
- **Division:** → `DivisionDots`
- **Fact families:** → `FactFamilyTriangle`
- **Number bonds:** → `NumberBond`
- **Place value:** → `PlaceValueDisplay`
- **Fractions:** → `FractionBar`
- **Telling time:** → `ClockFace`

The threshold guards (`a + b > 30`, `a > 30`) exist **only inside the dots fallback** — the number line path is not gated by these, so large Legend-level numbers (e.g. 32+5) correctly get a number line instead of silently rendering nothing.

### 8.2 NumberLine (`src/components/visuals/NumberLine.jsx`)

SVG number line showing addition (jump right) or subtraction (jump left) as a quadratic bezier arc.

**Key constants:**
```js
svgW=300, svgH=85, lineY=54, padL=20, padR=20
lineW=260, step=lineW/max
```

**Arc:** `M x1 lineY Q mx (lineY-arcH) x2 lineY` — quadratic bezier with control point at midpoint, 26px high.

**Mid-arc directional arrowhead:** At t=0.5 the bezier tangent is exactly horizontal, so the arrowhead polygon is simply offset left/right from the midpoint. Right-pointing for addition, left-pointing for subtraction.

**Smart tick labelling — three rules:**
1. `niceInterval(max)` — intervals from `[1,2,5,10,20,25,50]` to avoid crowding
2. `tooCloseToKey(n)` — suppresses regular ticks within **20px** of any key position (0, start, end)
3. `startEndClose` + `keyLabelY()` — when start and end key positions are within 20px, the start label moves above the line (lineY−22) to prevent key-key overlap

**Max calculation:**
- Addition: `Math.max(answer + 2, 12)`
- Subtraction: `Math.max(a + 2, 12)` — only show 0..a, not 0..answer

### 8.3 PlaceValueDisplay (`src/components/visuals/PlaceValueDisplay.jsx`)

Renders Dienes blocks (base-10 blocks) for a given number split into hundreds/tens/ones.

**Hundreds block:** 10×10 grid using `gridTemplateColumns: "repeat(10, 8px)"` with `gap:3, padding:3`. Fixed-pixel columns (not `1fr`) ensure precise sizing. No `maxWidth` on the flex wrapper — removing this was critical to prevent edge squares from being clipped.

**Tens block:** Single column of 10 dots, 8×8px each.

**Ones block:** Single dot, 8×8px.

**Container:** `display:flex, flexWrap:wrap` on the block stack prevents viewport overflow when multiple hundreds blocks are shown (e.g. 4 hundreds for number 456 would overflow without wrap).

### 8.4 ClockFace (`src/components/visuals/ClockFace.jsx`)

SVG analogue clock. Hour and minute hands are computed from props:
- Minute hand: `angle = minutes/60 * 360 - 90` (degrees from 12 o'clock)
- Hour hand: `angle = (hours % 12)/12 * 360 + minutes/60 * 30 - 90` (advances slightly with minutes)

### 8.5 Other visuals

- **DotGroup** — `count` dots in rows of 5, colored
- **MultiplicationDots** — `a` rows of `b` dots, capped at 60 total
- **DivisionDots** — `total/divisor` dashed-border groups of `divisor` dots, capped at 60
- **FactFamilyTriangle** — SVG triangle: total at top, parts at bottom-left/right, 4 mini-equation badges below
- **NumberBond** — circle-and-branch diagram showing part-whole relationships
- **FractionBar** — horizontal bar divided into `denominator` segments, `numerator` of which are filled

---

## 9. Teaching Mode (`src/screens/TeachScreen.jsx`)

Each of the 10 operations has a dedicated Learn screen with 3–5 step-through slides. Slides contain:
- Explanatory text (child-appropriate language)
- A visual component showing the concept
- Tap-to-advance navigation with a progress dot indicator

**Place value teaching example uses 156** (not 456) — chosen because it has a single hundreds block, which is simpler for young children to grasp.

Steps are defined as arrays:
```js
steps: [
  { text: "...", visual: () => <PlaceValueDisplay number={156} ... /> },
  ...
]
```

---

## 10. Screen Flow

```
Homepage
  ├── [Learn] → TeachScreen (3–5 slides per operation) → back to Homepage
  └── [Practice] → LevelSelect → GameScreen (10 rounds) → ResultsScreen
                                                               └── Play Again | Levels | Home
```

Routing is managed by `currentScreen` + `currentOp` + `currentLevel` state in `App.jsx`. No react-router.

---

## 11. Game Loop (`src/screens/GameScreen.jsx`)

1. Generate problem → display equation with blinking cursor answer box
2. Child types via NumberPad → digits accumulate in `userInput` state
3. Child presses ✓ → `checkAnswer()` fires
4. **Correct:** burst animation, score++, streak++, encouraging message, 1.2s pause → next
5. **Wrong:** gentle error sound, streak reset, teaching message with correct answer, 2.8s pause → next
6. After 10 rounds → ResultsScreen

**Streak:** Every 3rd consecutive correct triggers `SoundEngine.streak()`. The 🔥 emoji appears at streak ≥ 3.

**Wrong answer delay (2.8s vs 1.2s correct):** Wrong messages are longer and teach the inverse relationship — children need reading time.

---

## 12. Sound Engine (`src/sounds/SoundEngine.js`)

Web Audio API singleton. All sounds are synthesized oscillator chains.

| Sound | Trigger | Character |
|-------|---------|-----------|
| `tap()` | Number key press | 880Hz sine, 60ms |
| `backspace()` | Backspace | 440Hz square, 50ms |
| `correct()` | Right answer | C5→E5→G5 chime |
| `wrong()` | Wrong answer | 250Hz→200Hz triangle wave, gentle |
| `streak()` | Every 3rd correct | 4-note sparkle |
| `victory()` | Results screen | C→E→G→C6 fanfare |
| `selectChallenge()` | Tap op card | 2-tone select chime |
| `selectLevel()` | Tap level | 3-note ascending |
| `navigate()` | Back/Home/Levels | 2-note descending swoosh |

All volumes are kept low (0.04–0.22). Safari autoplay policy is handled by calling `ctx.resume()` on every sound trigger.

---

## 13. State Persistence (`src/utils/storage.js`)

localStorage keys:
- `mc_progress_{opId}_{levelIdx}` — best score, games played, accuracy history
- `mc_adaptive_{opId}` — suggested level based on rolling accuracy

---

## 14. PWA Configuration

### manifest.json
- `display: "standalone"` — no browser chrome
- `orientation: "portrait"` — locked for phone/tablet
- `background_color: "#fef9c3"` — warm yellow matches homepage

### Service Worker (sw.js)
- Network-first strategy with cache fallback
- Pre-caches shell assets on install
- Cleans old cache versions on activate
- `skipWaiting()` + `clients.claim()` for immediate activation

### index.html
- `apple-mobile-web-app-capable` — iOS standalone mode
- `apple-mobile-web-app-status-bar-style: black-translucent`
- `viewport` with `user-scalable=no` — prevents pinch zoom during gameplay

---

## 15. Deployment

### Cloudflare Pages (primary)
Connected to GitHub. Pushes to `main` trigger automatic deployments.
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: not needed (state-based navigation, no URL sub-routes)

### Local preview
```bash
npm run build
npx serve dist
```

### Other platforms
- **Vercel:** `vercel` CLI, auto-detects Vite
- **Netlify:** drag `dist/` to netlify.com/drop
- **Docker:** `docker run -d -p 8080:80 -v ./dist:/usr/share/nginx/html nginx:alpine`

---

## 16. Design Decisions & Rationale

### Inline styles instead of CSS modules/Tailwind
All styles are co-located with their components. For a child-focused single-purpose app, this minimises context switching and makes every component self-contained.

### Static SVG layout for NumberLine
The number line uses a fixed 300×85px SVG with calculated coordinates. A dynamic ResizeObserver approach was considered but rejected — this is a fixed-viewport PWA and the algorithmic fixes (nice intervals, key stagger, 20px collision threshold) produce clean results without the complexity of DOM measurement.

### No react-router
State-based routing with `currentScreen` is sufficient for 4 screens. Adding a router would increase bundle size and complexity for no benefit.

### `b >= 3` guard on number line
For addition/subtraction, the number line only triggers when the jump `b ≥ 3`. Smaller jumps (b=1 or b=2) on a number line look trivial and are better shown as dots.

### Max for subtraction number line
`max = a + 2` (not `a + b`). For subtraction 52−37, using `a+b=89` as max would cram 90 ticks into 300px. Since we only need to show the range 0..a, `a+2` is correct.

### Fixed-width grid for hundreds block
`gridTemplateColumns: repeat(10, 8px)` rather than `repeat(10, 1fr)` ensures the 100 small squares render predictably regardless of container width. `1fr` columns would stretch and the block would lose its square shape. No `maxWidth` on the flex wrapper — adding it clips the edge squares, making edge padding appear narrower than inner padding.

---

## 17. Known Constraints & Edge Cases

- **Large number visuals (dots):** Dot fallback is suppressed when `a+b > 30` or `a > 30` — the number line handles large numbers; dots would overflow.
- **Division by zero:** Impossible — `b` is always ≥ 1.
- **Negative results:** Impossible — subtraction ensures `a ≥ b`.
- **AudioContext on iOS:** `ctx.resume()` is called on every sound trigger to handle Safari's autoplay restriction.
- **Font FOUT:** Fredoka is loaded via `<link>` in index.html. Brief flash on first load is acceptable.
- **No multi-user profiles:** A single progress store; designed for one child per device.

---

## 18. Development Workflow

- All changes should be verified in the preview before committing
- Build: `npm run build` in project root
- Preview server: `npx serve dist` (port 4173 in the worktree)
- After building, copy dist: `cp -r dist/. .claude/worktrees/<name>/dist`
- Commit to `feature/*` branch, merge to `main`, then `git push origin main` to trigger Cloudflare deploy
- **Attention to detail:** Inspect every element of every screenshot individually before declaring work done — pixel-level imperfections (label overlaps, unequal padding, clipped blocks) must be caught without annotations

---

## 19. Future Directions

- **Parent dashboard** — view child's progress, weakest areas, session history
- **Multiple profiles** — support for siblings
- **Timed mode** — speed challenge for confident learners
- **Achievement badges** — "First perfect score", "10-game streak", etc.
- **Audio narration** — spoken numbers via Web Speech API
- **Expanded place value** — decimals, thousands
- **Expanded fractions** — thirds, fifths, equivalent fractions
- **More telling time** — 5-minute intervals, 24-hour
