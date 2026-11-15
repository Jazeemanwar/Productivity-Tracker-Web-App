# Productivity-Tracker
A productivity tracker for all the users who wants to quit doomscrolling.
# TimeLens — Kinetic Clarity Productivity Station

> **"See where your day actually goes, and what to do about it."**  
> *Theme:* Time Management | *Format:* Hackathon Build | *Design System:* Kinetic Clarity (from `Frontend/`)

---

## 1. Quick Start

Open [`index.html`](file:///c:/Users/Admin/OneDrive/Documents/Hackothon/Mini%20hackathon/index.html) directly in any web browser, or navigate to:
```
http://localhost:3000/index.html
```
(A local development server is actively running on port `3000`).

---

## 2. Integrated Frontend Architecture (from `Frontend/` folder)

Built directly from:
- **`Frontend/timelens_logo`**: Integrated the glowing gradient SVG TimeLens logo (`#6366F1` -> `#8B5CF6` -> `#06B6D4`) in the sidebar and navigation.
- **`Frontend/kinetic_clarity`**: Implemented the complete Kinetic Clarity design system (Electric Violet `#6366F1`, Mint Emerald `#10B981`, Coral Rose `#F43F5E`, Soft Sky Blue `#0EA5E9`, Plus Jakarta Sans typography, tabular numerals).
- **`Frontend/alex_s_focus_productivity_station`**: Integrated the dark glassmorphic productivity station layout, Left Sidebar Dock, Pomodoro Focus Timer, Execution Tasks, Lo-Fi Study Beats Player with animated equalizer, custom audio file upload support, and the floating macOS dock.

---

## 3. Core TimeLens Features Integrated

1. **The 24-Hour Day Dial Hero**:
   - 24 individual $15^\circ$ SVG wedge segments (00:00 to 23:00) colored by activity category.
   - Live Electric Violet needle indicating the current time of day.
   - Large monospaced central hero stat displaying the single biggest time sink (e.g. `7h 30m on Screens today`).
   - Seamless toggle between the 24-hour Day Dial and the proportional Chart.js Doughnut chart.

2. **Diagnostic AI Insight Engine**:
   - Plain-English evaluator that spots screen time exceeding sleep, sleep deficits (<6h), and zero-movement gaps.
   - Flags critical habits with a glowing Coral Rose badge and surfaces an actionable cognitive nudge.

3. **Actual vs. Ideal Habit Allocation**:
   - Progress tracks for Sleep, Deep Work, Screens, and Exercise against healthy targets.
   - Highlights over-budget habits with `⚠ Over Budget` warnings.

4. **1-Click Judge Demo Mode**:
   - Click `⚡ Pitch Demo` in the top right (or in the floating dock) to load a realistic day with an out-of-control screen ratio in 1 second.

5. **Focus Audio Player with YouTube Search & Streaming**:
   - **YouTube Search**: Search any music, artist, or stream (e.g. `lofi hip hop`, `deep work piano`, `synthwave`) or paste direct YouTube links/video IDs.
   - **Live Autocomplete Suggestions**: Dynamic search suggestions dropdown as you type.
   - **1-Click Curated Focus Stations**: Quick-picks for *🎧 Lofi Girl*, *🌌 Synthwave*, *🎹 Focus Piano*, *🌧️ Rain Sounds*, *☕ Tokyo Jazz Cafe*, and *⚡ Cyberpunk Ambient*.
   - **Customizable Focus Stations (Add & Edit)**: Click `+ Add` or `✏️ Edit` (or the hover pencil on any station pill) to customize, replace, or add new focus stations. Swap out *Lofi Girl*, *Rain*, or any station with your own YouTube video links, video IDs, or search queries, or select from the 20+ offline curated catalog tracks. All edits are persistently saved to `localStorage`.
   - **Integrated Controls**: Unified Play/Pause, volume slider, timeline scrubber, equalizer waveform animation, and previous/next station skipping.
   - **Audio-Only / Video Screen Toggle**: Minimize the video embed to a compact audio stream or expand the visual screen with Picture-in-Picture controls.
   - **Multi-Source Coexistence**: Seamlessly switch between YouTube streams, local file uploads (`.mp3`, `.wav`, `.ogg`), and the built-in binaural alpha drone synthesizer.
   - **Dock & Sidebar Shortcuts**: Quick navigation from the left sidebar (`#nav-btn-music`) and bottom dock (`#dockBtnMusic`).

6. **Task Scheduling with Date & Time Reminders**:
   - **Schedule by Date & Time**: Click `+ Schedule Task` or the edit icon on any task to assign an exact date (with 1-click chips: `Today`, `Tomorrow`, `+2 Days`, `+1 Week`) and exact scheduled time (with chips: `09:00 AM`, `12:00 PM`, `03:00 PM`, `06:00 PM`, `09:00 PM`).
   - **Active Reminder Engine**: Configure audio & browser notification reminders with custom lead time (`At exact time`, `5m before`, `10m before`, `15m before`, `30m before`).
   - **Crystal-Clear Audio Harmonic Chime**: Synthesized via the Web Audio API (D5 -> A5 -> D6 harmonic triad) that plays reliably offline without external files.
   - **Interactive Reminder Alert Card**: When reminder time triggers, a floating glassmorphic alert pops up on-screen with *Mark Done*, *Snooze 5m*, and *Dismiss* controls.
   - **Filter by Reminders**: Filter tasks by *All*, *Today*, *Upcoming*, *Reminders* (tasks with scheduled active reminders), and *Completed*.
   - **Persistent Storage**: All scheduled tasks, dates, times, categories, and reminder states are persistently saved to `localStorage`.

7. **Dynamic Interactive Mini Calendar**:
   - **Real-Time Date Sync**: Automatically synchronizes with the current day, month, and year (no hardcoded static dates).
   - **Dynamic Month & Year Grid**: Accurately computes first day of month, total days, previous month padding, and next month overflow.
   - **Interactive Day Selection**: Click any date to select it with glowing badge and toast notification.
   - **1-Click "Today" Jump**: Instant button to return to today's date from any past or future month.
   - **Dynamic Deadlines**: Auto-calculates upcoming assignment due dates relative to the current real date (+2 days, +4 days, +7 days).

8. **ChatGPT Student AI Study Coach & Homework Assistant**:
   - **Integrated Access**: Open from the left sidebar dock (`#nav-btn-ai`), the bottom floating dock (`#dockBtnAI`), or the floating action button at the bottom right (`#floatingAiTutorBtn`).
   - **Student Academic Tutor**: Explains tough homework questions, calculus derivations, physics concepts, chemical equations, biology systems, and coding logic step-by-step.
   - **Study Methods & Productivity**: Provides personalized study plans, 3-hour deep work schedules, Feynman Technique prompts, flashcard generations, and blurting memory anchors.
   - **1-Click Quick Chips**: Instant prompt starters including *🧠 Feynman Technique*, *📅 Study Schedule*, *📐 Calculus & Math*, *⚡ Exam Prep*, and *💡 Beat Procrastination*.
   - **Direct Task Scheduling**: Add generated study blocks or action items straight to the TimeLens Task Scheduler with 1 click.
   - **Dual AI Engine (Offline & Cloud)**: Works 100% offline immediately using the built-in intelligent study generator, with optional seamless upgrade to live OpenAI ChatGPT (`gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`) via user-provided API key in the AI drawer.

---

## 4. Publishing & Deploying Online

The app is pre-configured to run seamlessly both locally and when published online:

- **Vercel** (`api/search.js` + `vercel.json`):
  Deploy with 1-click or `vercel` CLI. Vercel automatically exposes the serverless YouTube search API at `/api/search` with full CORS support.

- **Netlify** (`netlify/functions/search.js` + `netlify.toml`):
  Deploy with `netlify deploy` or via GitHub. The Netlify serverless function resolves live YouTube tracks.

- **GitHub Pages / Static Web Hosting**:
  When hosted on static GitHub Pages (where no server runs):
  1. **Offline Music Catalog**: Includes 30+ verified, 100% embeddable focus songs and stations across Lofi, Synthwave, Classical, Piano, Jazz, Gaming, and Ambient.
  2. **Direct Link & Video ID Support**: Users can paste any YouTube URL or 11-char ID directly in the search bar.
  3. **Origin & Widget Referrer Security**: Embed URLs dynamically pass `&origin=${window.location.origin}` to satisfy YouTube's external HTTPS iframe security policies.
  4. **Error 150/101 Graceful Fallback**: If an artist/label disables third-party embeds, Nexus detects it and provides an instant `Open in YouTube ↗` button and backup stream.
