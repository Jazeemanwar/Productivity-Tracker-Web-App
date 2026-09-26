# TimeLens — Front-End Design Spec

## 1. Product summary
TimeLens lets someone log how they actually spend a day, then shows them the
gap between that and how they *meant* to spend it, with one concrete nudge to
close it. It's a time journal, not a dashboard.

## 2. Design concept: "The Daybook"
The visual language borrows from a paper day-planner, not a SaaS analytics
tool: a warm page instead of a dark dashboard, ruled-line inputs instead of
boxed form fields, and a literal 24-hour clock face — "the Day Dial" — as the
hero visual instead of a generic donut chart. Every structural choice below
ties back to this: hours are drawn as hours, categories read like colored
pencil marks on a page, and the one flagged insight looks like a margin note.

## 3. Design principles
- **One hero, one moment.** The Day Dial is the single memorable element.
  Everything else (forms, legend, bars) stays quiet so it doesn't compete.
- **Structure encodes meaning.** The hour-ruled logger and the 24-slot dial
  are literal representations of a day — not decoration.
- **Numbers look like time.** Anything that's actually a duration or
  timestamp renders in a monospaced, tabular numeral — like a stopwatch or
  digital clock — so figures are always instantly scannable and comparable.
- **Say one thing, plainly.** The app gives exactly one insight at a time, in
  a short plain sentence — never a wall of stats.

## 4. Visual identity

### 4.1 Color

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#EDE7D9` | Page background |
| `--surface` | `#F7F3E8` | Cards / panels (slightly lighter than page) |
| `--ink` | `#262220` | Primary text |
| `--ink-muted` | `#6B6259` | Secondary text, hairline borders |
| `--teal` | `#2F5D62` | Primary accent — buttons, links, current-time marker, focus rings |
| `--flag-red` | `#B14A3A` | Over-budget alerts only — never decorative |

No drop shadows, no rounded-card grid. Panels are separated with a 1px
`--ink-muted` hairline at low opacity, not a shadow.

### 4.2 Category palette
Six muted, colored-pencil-style hues, kept close in saturation/lightness so
none of them shouts:

| Category | Hex |
|---|---|
| Sleep | `#5B6B8C` (dusty indigo) |
| Work / Study | `#5C7A5E` (moss sage) |
| Screens & Social Media | `#C97B4A` (clay orange) |
| Exercise | `#C79A3E` (ochre gold) |
| In-person Social | `#7C5C7A` (plum) |
| Other | `#9C9186` (warm grey) |

Never rely on color alone: every category also gets a small distinct dot
pattern (solid / ring / cross-hatch) in the legend and chart for colorblind
users.

### 4.3 Typography
Two families, three roles — nothing decorative, everything tied to what it's
displaying:

| Role | Typeface | Weight | Used for |
|---|---|---|---|
| Display / headings | IBM Plex Sans Condensed | 600 | Page titles, section headings |
| Time data | IBM Plex Mono (tabular figures) | 500 | Hero stat, hour ticks, durations, timestamps |
| Body / UI | IBM Plex Sans | 400 / 500 | Everything else |

**Type scale:**

| Use | Size / Line-height | Face |
|---|---|---|
| Hero stat (e.g. "6h 40m") | 40 / 44px | Plex Mono 500 |
| H1 | 28 / 34px | Plex Sans Condensed 600 |
| H2 | 20 / 26px | Plex Sans Condensed 600 |
| Body | 16 / 24px | Plex Sans 400 |
| Small / labels | 13 / 18px, sentence case | Plex Sans 500 |
| Chart numerals | 13 / 16px, tabular-nums | Plex Mono 500 |

No all-caps labels, no single-word-highlighted headlines, no eyebrow tags
above headings.

### 4.4 Spacing & layout
8px base unit: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
Content is a single centered column, not a wide dashboard:
- Mobile: 100% width, 16px side padding
- Tablet (≥768px): max-width 720px
- Desktop (≥1024px): max-width 960px

## 5. Hero visual: The Day Dial
A 24-segment ring, one segment per hour, colored by whichever category
dominates that hour. A thin `--teal` hand marks the current hour. The center
shows the day's single biggest number in Plex Mono (e.g. `6h 40m`) with a
small caption beneath it (e.g. "on screens today").

## 6. Screens

### 6.1 Logger (mobile, ~360px)
```
┌────────────────────────────┐
│ TimeLens               ⚙   │
│ Tue, Sep 26                 │
├────────────────────────────┤
│ Log today                   │
│ ──────────────────────────  │
│ Category                    │
│ Sleep ▾ ____________________│  ← underline input, no box
│ Hours                       │
│ 7.5 _________________________│
│ ( Add entry )                │
│ ──────────────────────────  │
│ Quick add                   │
│ [Typical study day]          │
│ [Typical work day]           │
│ [Rest day]                   │
│ ──────────────────────────  │
│ Logged so far                │
│ ● Sleep     7.5h              │
│ ● Study     3.0h              │
│ ● Screens   2.0h              │
│                                │
│ ( View my day → )              │
└────────────────────────────┘
```

### 6.2 Dashboard (mobile, ~360px)
```
┌────────────────────────────┐
│ TimeLens               ⚙   │
│ Tue, Sep 26                 │
├────────────────────────────┤
│         ╭───────╮           │
│       ╱   6h40m   ╲         │
│      │   on screens │        │
│       ╲    Day Dial ╱        │
│         ╰───────╯            │
│ ● Sleep ● Study ● Screens     │
│ ● Exercise ● Social ● Other   │
├────────────────────────────┤
│┃ Insight                     │
│┃ You planned 1h of screens   │
│┃ but logged 4h. Try a        │
│┃ 25-min walk before your     │
│┃ next scroll break.          │
├────────────────────────────┤
│ Actual vs. ideal              │
│ Sleep    ▓▓▓▓▓▓▓░  7.5 / 8h   │
│ Study    ▓▓▓░░░░░  3 / 5h     │
│ Screens  ▓▓▓▓▓▓▓▓  4 / 1h  ⚠  │
└────────────────────────────┘
```

## 7. Components
- **Quick-add button** — `--surface` fill, 1px `--ink-muted` border at 20%
  opacity, `--ink` text. On press: fills `--teal`, text goes `--paper`.
- **Category legend dot** — 8px dot in category color + distinct pattern,
  `--ink` label beside it in Plex Sans small.
- **Insight card** — `--surface` background, no shadow, 3px left border in
  `--teal` (or `--flag-red` if it's a warning), 16–20px padding.
- **Hero stat** — Plex Mono, large, `--ink`; small `--ink-muted` caption below.
- **Text input** — bottom-border only (`--ink-muted`), turns `--teal` when
  focused or filled. No boxed borders.
- **Actual-vs-ideal bar** — flat rectangle (no rounded pill), category-color
  fill on a `--paper`-toned track with a 1px outline; any amount past the
  "ideal" tick renders in `--flag-red` with a small ⚠ marker.

## 8. Motion
One orchestrated moment only: on dashboard load, the Day Dial sweeps
clockwise from 12, filling each hour segment in sequence (~800ms–1.2s),
ending with the current-hour marker settling into place. Nothing else
animates on load. Micro-interactions are response-only: buttons scale to
0.97 on press, the insight card cross-fades (150ms) when it updates, bars
fill once on first render. Respect `prefers-reduced-motion`: skip the sweep
and bar-fill animations and render final states directly.

## 9. Accessibility
- `--ink` on `--paper`/`--surface` comfortably clears 4.5:1.
- `--teal` is a fill color for buttons — pair with `--paper` text on top, not
  used as small running text on `--paper`.
- 2px `--teal` focus ring, 2px offset, on every interactive element.
- Category color is always backed by a shape/pattern, never color alone.
- Logger and quick-add buttons are fully keyboard-operable.

## 10. Responsive behavior
- **Mobile (default):** single column, as wireframed above.
- **Tablet (≥768px):** Day Dial and Insight card sit side by side; logger
  stays single column beneath.
- **Desktop (≥1024px):** three columns — logger / Day Dial / insight +
  actual-vs-ideal bars, within the 960px max-width.

## 11. Implementation notes (scoped to a 90-minute build)

**Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@600&display=swap" rel="stylesheet">
```

**CSS variables — paste as-is:**
```css
:root {
  --paper: #EDE7D9;
  --surface: #F7F3E8;
  --ink: #262220;
  --ink-muted: #6B6259;
  --teal: #2F5D62;
  --flag-red: #B14A3A;

  --cat-sleep: #5B6B8C;
  --cat-study: #5C7A5E;
  --cat-screens: #C97B4A;
  --cat-exercise: #C79A3E;
  --cat-social: #7C5C7A;
  --cat-other: #9C9186;

  --font-display: 'IBM Plex Sans Condensed', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'IBM Plex Sans', sans-serif;

  --space-1: 4px;  --space-2: 8px;   --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px;  --space-7: 48px; --space-8: 64px;
}
```

**Chart approach — ship in this order:**
1. MVP: a standard Chart.js doughnut chart recolored with the category
   palette, with the hero stat absolutely-positioned in its center. ~15
   minutes to wire up — do this first and get it working end-to-end.
2. Stretch goal only: replace it with a literal 24-segment SVG Day Dial once
   the doughnut version works. Keep all data/state code unchanged — only the
   rendering component should change.

**Explicitly out of scope for the 90 minutes:** real device screen-time
APIs, login/auth, and persistence beyond `localStorage`. Don't start any of
these even if time feels like it's left over — polish the Day Dial and the
insight copy instead.
