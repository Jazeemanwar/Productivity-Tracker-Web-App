# TimeLens — Build To-Do (90 minutes)

## Phase 1 — Frame it & wireframe (0–10 min)
- [ ] Say the MVP loop out loud as a team: log → dashboard → one insight
- [ ] Sketch the logger and dashboard screens on paper or a whiteboard
- [ ] Assign owners: logger UI, dashboard/chart, insight logic, pitch prep

## Phase 2 — Skeleton (10–20 min)
- [ ] Create `index.html`, `style.css`, `app.js` (or your stack's starter)
- [ ] Load Chart.js from a CDN
- [ ] Paste in the CSS variables block from `design.md`
- [ ] Add the Google Fonts `<link>` from `design.md`
- [ ] Get a placeholder chart rendering on screen before building further

## Phase 3 — Activity logger (20–45 min)
- [ ] Category select + hours input, underline style (no boxed borders)
- [ ] "Add entry" button appends to the in-memory data array
- [ ] 2–3 quick-add preset buttons (e.g. "Typical study day")
- [ ] Render a "logged so far" list below the form
- [ ] Hardcode one full "sample day" fallback dataset for the demo

## Phase 4 — Dashboard (45–65 min)
- [ ] Chart.js doughnut chart recolored with the category palette
- [ ] Hero stat (biggest category, Plex Mono) centered on/near the chart
- [ ] Category legend: color dot + pattern + label
- [ ] Actual-vs-ideal bars (hardcode a sensible "ideal" split if there's no
      time to make it user-editable)

## Phase 5 — Insight engine (65–80 min)
- [ ] Write 4–6 if/else rules comparing actual vs. ideal per category
- [ ] Render the single most relevant insight in the insight card
- [ ] Style the flagged/over-budget bar in `--flag-red`

## Phase 6 — Pitch prep (80–90 min)
- [ ] Write the 90-second script: problem → live demo → what's next
- [ ] Decide who logs the demo data live vs. who talks
- [ ] Rehearse once, out loud, with a timer running
- [ ] Confirm the fallback: sample dataset ready in case live entry fails

## Stretch goals — only start once every box above is checked
- [ ] Replace the doughnut chart with the literal SVG "Day Dial"
- [ ] Weekly trend line chart using a few days of mock data
- [ ] Streak/badge for hitting an "ideal" day
