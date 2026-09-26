# PRD: TimeLens

**Tagline:** "See where your day actually goes, and what to do about it"
**Track:** Time Management — Help users analyze how they spend their time across various activities
**Format:** 1.5-hour hackathon build

---

## 1. Problem Statement

Most people have no real visibility into how their day is actually spent. They *feel* busy but can't say where the hours went — how much was deep work vs. meetings vs. scrolling vs. breaks. Without visibility, there's no way to improve. Existing time trackers require heavy manual logging (start/stop timers for every task), which people abandon within days.

## 2. Goal

Give users a fast, low-friction way to log how they spend their time, instantly visualize the breakdown, and get simple, actionable suggestions on what to change — all without the overhead of a full-blown time-tracking app.

## 3. Target User

Students, remote workers, and freelancers who want self-awareness about their daily habits but won't tolerate a clunky tracking workflow.

## 4. Core Value Proposition

| Existing tools | TimeLens |
|---|---|
| Manual start/stop timers per task | Quick-entry logging (type or pick a block) |
| Raw logs, no insight | Visual breakdown + plain-language takeaways |
| Steep setup | Usable in under 60 seconds |

## 5. MVP Scope (build in 1.5 hrs — be ruthless)

Given the time limit, scope to a **single-session web app**, no auth, no backend/database (use local state or localStorage).

### Must-Have (P0)
1. **Quick Time Entry**
   - User adds activity blocks for their day: activity name, category (Work / Sleep / Leisure / Exercise / Chores / Social / Other), duration or start–end time.
   - Simple form or "add block" button — no more than 3 fields.
2. **Visual Breakdown**
   - A pie or bar chart showing % of day/time spent per category.
   - Total hours logged vs. 24-hour day shown clearly.
3. **Insight Summary**
   - Rule-based (not ML) plain-English takeaways, e.g.:
     - "You spent 5.5 hrs on Leisure — more than Work today."
     - "No Exercise logged today."
     - Simple threshold-based rules are enough for demo purposes.
4. **Reset / New Day**
   - Button to clear and start a new log.

### Nice-to-Have (P1 — only if time remains)
- Preset quick-add buttons for common activities (Sleep, Meeting, Meal, Scroll time).
- Compare today vs. an "ideal" balance (user-set target %).
- Save multiple days in localStorage and show a simple trend line.
- Color-coded category tags.

### Explicitly Out of Scope (for this hackathon)
- User accounts / login
- Mobile app / native build
- Calendar or app integrations (Google Calendar, screen-time APIs)
- Real-time/automatic tracking
- Backend database / persistence beyond localStorage
- ML-based recommendations

## 6. User Flow

1. User lands on TimeLens → sees empty state: "Let's see where your day went."
2. User adds time blocks one by one (activity + category + duration).
3. As blocks are added, a live chart updates on the same screen.
4. Once done, user sees a summary panel with 2–3 auto-generated insights.
5. Optional: user hits "Start New Day" to reset.

## 7. Key Screens

- **Log Screen**: form to add activity blocks + running list of entries.
- **Dashboard Screen** (can be same page, split view): chart + insights, updates live.

## 8. Success Metrics (for demo/judging)

- Can a user log a full day's worth of activities in under 2 minutes?
- Does the chart clearly and immediately communicate where time went?
- Do the insights feel specific and useful, not generic?

## 9. Tech Approach (suggested for speed)

- Single-page HTML/CSS/JS or React app.
- Charting: Chart.js or Recharts (fast to wire up).
- State: in-memory / localStorage only — no backend needed.
- Rule-based insight engine: simple if/else on category percentages.

## 10. Suggested Build Order (for the 1.5 hrs)

| Time | Task |
|---|---|
| 0:00–0:10 | Set up project skeleton, static layout |
| 0:10–0:35 | Build "add activity block" form + state management |
| 0:35–0:55 | Wire up chart to reflect live data |
| 0:55–1:15 | Build rule-based insights logic + display |
| 1:15–1:25 | Polish UI, add empty/reset states |
| 1:25–1:30 | Final test + prep demo script |

## 11. Demo Script (pitch angle)

Open with the problem: "Where did your day actually go? Most of us can't answer that." Then live-log a realistic day in front of judges (work, scrolling, meals, sleep) and let the chart + insight ("You spent more time on X than Y") land as the "aha" moment. Close with the tagline: *"TimeLens — see where your day actually goes, and what to do about it."*
