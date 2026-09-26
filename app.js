/**
 * TimeLens — The Daybook Application Logic
 * Adheres strictly to design.md, architecture.md, and prd.md
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Constants & Category Taxonomy
  // ==========================================================================
  const CATEGORIES = {
    'Sleep': {
      color: '#5B6B8C',
      pattern: 'pat-sleep',
      swatchClass: 'pat-sleep-swatch',
      defaultIdeal: 8.0,
      isHabitLimit: false,
    },
    'Work / Study': {
      color: '#5C7A5E',
      pattern: 'pat-study',
      swatchClass: 'pat-study-swatch',
      defaultIdeal: 6.0,
      isHabitLimit: false,
    },
    'Screens & Social Media': {
      color: '#C97B4A',
      pattern: 'pat-screens',
      swatchClass: 'pat-screens-swatch',
      defaultIdeal: 1.5,
      isHabitLimit: true, // Over ideal is flagged as warning
    },
    'Exercise': {
      color: '#C79A3E',
      pattern: 'pat-exercise',
      swatchClass: 'pat-exercise-swatch',
      defaultIdeal: 1.0,
      isHabitLimit: false,
    },
    'In-person Social': {
      color: '#7C5C7A',
      pattern: 'pat-social',
      swatchClass: 'pat-social-swatch',
      defaultIdeal: 2.0,
      isHabitLimit: false,
    },
    'Other': {
      color: '#9C9186',
      pattern: 'pat-other',
      swatchClass: 'pat-other-swatch',
      defaultIdeal: 5.5,
      isHabitLimit: false,
    },
  };

  const STORAGE_KEYS = {
    ENTRIES: 'timelens_entries',
    IDEALS: 'timelens_ideals',
  };

  // Preset Datasets
  const PRESETS = {
    study: [
      { id: 'p1', category: 'Sleep', hours: 7.5, startHour: 23, note: 'Night sleep' },
      { id: 'p2', category: 'Work / Study', hours: 5.5, startHour: 8, note: 'Lectures & DSA Practice' },
      { id: 'p3', category: 'Screens & Social Media', hours: 3.5, startHour: 14, note: 'YouTube & feeds' },
      { id: 'p4', category: 'Exercise', hours: 1.0, startHour: 18, note: 'Campus run' },
      { id: 'p5', category: 'In-person Social', hours: 2.0, startHour: 19.5, note: 'Dinner with peers' },
      { id: 'p6', category: 'Other', hours: 4.5, startHour: 6.5, note: 'Transit & meals' }
    ],
    work: [
      { id: 'w1', category: 'Sleep', hours: 7.0, startHour: 0, note: 'Core sleep' },
      { id: 'w2', category: 'Exercise', hours: 0.5, startHour: 7.5, note: 'Morning stretch' },
      { id: 'w3', category: 'Work / Study', hours: 8.0, startHour: 9, note: 'Sprint delivery & calls' },
      { id: 'w4', category: 'Screens & Social Media', hours: 4.0, startHour: 18, note: 'Evening doomscroll' },
      { id: 'w5', category: 'In-person Social', hours: 1.5, startHour: 22, note: 'Call with family' },
      { id: 'w6', category: 'Other', hours: 3.0, startHour: 7, note: 'Commute & breakfast' }
    ],
    rest: [
      { id: 'r1', category: 'Sleep', hours: 9.0, startHour: 23, note: 'Deep sleep & rest' },
      { id: 'r2', category: 'Exercise', hours: 1.5, startHour: 9.5, note: 'Nature hike' },
      { id: 'r3', category: 'In-person Social', hours: 4.0, startHour: 12, note: 'Brunch & friends' },
      { id: 'r4', category: 'Screens & Social Media', hours: 4.5, startHour: 18, note: 'Movies & browsing' },
      { id: 'r5', category: 'Work / Study', hours: 0.5, startHour: 11, note: 'Weekly review' },
      { id: 'r6', category: 'Other', hours: 4.5, startHour: 8.5, note: 'Cooking & gardening' }
    ],
    pitch: [
      { id: 'demo-1', category: 'Sleep', hours: 5.5, startHour: 1, note: 'Late night sleep' },
      { id: 'demo-2', category: 'Work / Study', hours: 4.5, startHour: 9, note: 'Scattered work session' },
      { id: 'demo-3', category: 'Screens & Social Media', hours: 7.5, startHour: 14, note: 'Doomscrolling & reels' },
      { id: 'demo-4', category: 'In-person Social', hours: 1.5, startHour: 21.5, note: 'Quick tea meet' },
      { id: 'demo-5', category: 'Other', hours: 5.0, startHour: 6.5, note: 'Meals, errands & idle' }
    ]
  };

  // ==========================================================================
  // 2. Application State & Storage
  // ==========================================================================
  let state = {
    entries: [],
    ideals: {},
    activeView: 'dial', // 'dial' or 'donut'
  };

  let donutChartInstance = null;

  function loadState() {
    try {
      const storedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      state.entries = storedEntries ? JSON.parse(storedEntries) : [];

      const storedIdeals = localStorage.getItem(STORAGE_KEYS.IDEALS);
      if (storedIdeals) {
        state.ideals = JSON.parse(storedIdeals);
      } else {
        state.ideals = {};
        for (const [cat, data] of Object.entries(CATEGORIES)) {
          state.ideals[cat] = data.defaultIdeal;
        }
      }

      // If initially empty, provide study day preset as a demo baseline
      if (!storedEntries || state.entries.length === 0) {
        state.entries = JSON.parse(JSON.stringify(PRESETS.study));
        saveEntries();
      }
    } catch (e) {
      console.warn('Failed to load localStorage:', e);
      state.entries = JSON.parse(JSON.stringify(PRESETS.study));
      state.ideals = {};
      for (const [cat, data] of Object.entries(CATEGORIES)) {
        state.ideals[cat] = data.defaultIdeal;
      }
    }
  }

  function saveEntries() {
    try {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(state.entries));
    } catch (e) {
      console.warn('Failed to save entries to localStorage:', e);
    }
  }

  function saveIdeals() {
    try {
      localStorage.setItem(STORAGE_KEYS.IDEALS, JSON.stringify(state.ideals));
    } catch (e) {
      console.warn('Failed to save ideals to localStorage:', e);
    }
  }

  // ==========================================================================
  // 3. Mathematical Helpers & Time Formatting
  // ==========================================================================
  function formatHours(numHours) {
    if (numHours === undefined || numHours === null || isNaN(numHours)) return '0.0h';
    return Number(numHours).toFixed(1) + 'h';
  }

  function formatDurationHM(numHours) {
    if (!numHours || numHours <= 0) return '0h 00m';
    const totalMins = Math.round(numHours * 60);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m < 10 ? '0' : ''}${m}m`;
  }

  function getCategoryTotals() {
    const totals = {};
    for (const cat of Object.keys(CATEGORIES)) {
      totals[cat] = 0;
    }
    for (const entry of state.entries) {
      if (totals[entry.category] !== undefined) {
        totals[entry.category] += Number(entry.hours) || 0;
      } else {
        totals['Other'] = (totals['Other'] || 0) + (Number(entry.hours) || 0);
      }
    }
    return totals;
  }

  function getTotalHoursLogged() {
    return state.entries.reduce((sum, item) => sum + (Number(item.hours) || 0), 0);
  }

  // Polar to Cartesian for SVG 24-hour dial
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  // SVG Arc generator for a dial wedge
  function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', startOuter.x, startOuter.y,
      'A', outerRadius, outerRadius, 0, arcSweep, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', innerRadius, innerRadius, 0, arcSweep, 1, startInner.x, startInner.y,
      'Z',
    ].join(' ');
  }

  // ==========================================================================
  // 4. Hero Visual: The Day Dial (24 Segments)
  // ==========================================================================
  function computeHourSlots() {
    // 24 slots: hour 0 to 23
    const slots = new Array(24).fill(null).map((_, i) => ({
      hour: i,
      category: null,
      note: '',
      color: '#E5DEC9', // unlogged paper shade
      isLogged: false,
    }));

    let nextAvailableSlot = 0;

    for (const entry of state.entries) {
      const dur = Number(entry.hours) || 1;
      let start = entry.startHour !== undefined && entry.startHour !== 'auto'
        ? Number(entry.startHour) % 24
        : nextAvailableSlot;

      const categoryData = CATEGORIES[entry.category] || CATEGORIES['Other'];

      for (let h = 0; h < Math.ceil(dur); h++) {
        const slotIdx = (start + h) % 24;
        slots[slotIdx] = {
          hour: slotIdx,
          category: entry.category,
          note: entry.note || '',
          color: categoryData.color,
          isLogged: true,
        };
      }

      nextAvailableSlot = (start + Math.ceil(dur)) % 24;
    }

    return slots;
  }

  function renderDayDial() {
    const svgGroup = document.getElementById('dialSegmentsGroup');
    if (!svgGroup) return;

    svgGroup.innerHTML = '';
    const slots = computeHourSlots();
    const cx = 170;
    const cy = 170;
    const rOuter = 142;
    const rInner = 96;

    // 24 segments, 15 degrees each (360 / 24)
    slots.forEach((slot, i) => {
      const startAngle = i * 15 + 0.6;
      const endAngle = (i + 1) * 15 - 0.6;
      const pathData = describeArc(cx, cy, rInner, rOuter, startAngle, endAngle);

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', pathData);
      pathEl.setAttribute('class', 'dial-segment');
      pathEl.setAttribute('fill', slot.color);
      pathEl.setAttribute('data-hour', i);
      pathEl.setAttribute('data-category', slot.category || 'Unlogged');
      pathEl.setAttribute('data-note', slot.note || '');

      // Hover tooltip interaction
      pathEl.addEventListener('mouseenter', (evt) => {
        showDialTooltip(evt, slot);
      });
      pathEl.addEventListener('mousemove', (evt) => {
        positionDialTooltip(evt);
      });
      pathEl.addEventListener('mouseleave', () => {
        hideDialTooltip();
      });

      svgGroup.appendChild(pathEl);
    });

    // Update current hour needle
    updateDialNeedle();

    // Update center hero stat
    updateHeroStat();
  }

  function updateDialNeedle() {
    const needle = document.getElementById('dialNeedle');
    const needleTip = document.getElementById('needleTip');
    if (!needle) return;

    const now = new Date();
    const currentHourFraction = now.getHours() + now.getMinutes() / 60;
    const rotationDegrees = currentHourFraction * 15; // 360 deg / 24 hrs = 15 deg/hr

    needle.setAttribute('transform', `rotate(${rotationDegrees}, 170, 170)`);
    if (needleTip) {
      needleTip.setAttribute('transform', `rotate(${rotationDegrees}, 170, 170)`);
    }
  }

  function showDialTooltip(evt, slot) {
    const tooltip = document.getElementById('dialTooltip');
    if (!tooltip) return;

    const hourStr = `${String(slot.hour).padStart(2, '0')}:00 – ${String((slot.hour + 1) % 24).padStart(2, '0')}:00`;
    if (slot.isLogged) {
      tooltip.textContent = `${hourStr} • ${slot.category}${slot.note ? ` (${slot.note})` : ''}`;
    } else {
      tooltip.textContent = `${hourStr} • (Open / Unlogged)`;
    }
    tooltip.style.display = 'block';
    positionDialTooltip(evt);
  }

  function positionDialTooltip(evt) {
    const tooltip = document.getElementById('dialTooltip');
    const container = document.querySelector('.dial-stage-wrapper');
    if (!tooltip || !container) return;

    const rect = container.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 12}px`;
  }

  function hideDialTooltip() {
    const tooltip = document.getElementById('dialTooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  function updateHeroStat() {
    const heroStatValue = document.getElementById('heroStatValue');
    const heroStatCaption = document.getElementById('heroStatCaption');
    const heroStatSub = document.getElementById('heroStatSub');
    const chartHeroStat = document.getElementById('chartHeroStat');
    const chartHeroCaption = document.getElementById('chartHeroCaption');

    const totals = getCategoryTotals();
    const totalLogged = getTotalHoursLogged();

    if (totalLogged <= 0) {
      if (heroStatValue) heroStatValue.textContent = '0h 00m';
      if (heroStatCaption) heroStatCaption.textContent = 'no time logged yet';
      if (heroStatSub) heroStatSub.textContent = 'Start by adding an entry';
      if (chartHeroStat) chartHeroStat.textContent = '0.0h';
      return;
    }

    // Single biggest category
    let maxCat = 'Sleep';
    let maxHours = -1;
    for (const [cat, hrs] of Object.entries(totals)) {
      if (hrs > maxHours) {
        maxHours = hrs;
        maxCat = cat;
      }
    }

    const formattedHM = formatDurationHM(maxHours);
    if (heroStatValue) heroStatValue.textContent = formattedHM;
    if (heroStatCaption) heroStatCaption.textContent = `on ${maxCat} today`;
    if (heroStatSub) {
      const pct = Math.round((maxHours / (totalLogged || 1)) * 100);
      heroStatSub.textContent = `${pct}% of logged hours (${formatHours(totalLogged)} total)`;
    }

    if (chartHeroStat) chartHeroStat.textContent = formatDurationHM(totalLogged);
    if (chartHeroCaption) chartHeroCaption.textContent = `Total Logged`;
  }

  // ==========================================================================
  // 5. Chart.js Secondary Doughnut View
  // ==========================================================================
  function renderDonutChart() {
    const canvas = document.getElementById('donutChartCanvas');
    if (!canvas || !window.Chart) return;

    const totals = getCategoryTotals();
    const labels = Object.keys(CATEGORIES);
    const dataValues = labels.map(l => totals[l] || 0);
    const bgColors = labels.map(l => CATEGORIES[l].color);

    if (donutChartInstance) {
      donutChartInstance.destroy();
    }

    donutChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: bgColors,
          borderColor: '#F7F3E8',
          borderWidth: 2,
          hoverOffset: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        animation: {
          animateScale: true,
          duration: 600,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const val = ctx.parsed || 0;
                return ` ${ctx.label}: ${formatHours(val)} (${Math.round((val / 24) * 100)}% of day)`;
              }
            }
          }
        }
      }
    });
  }

  // ==========================================================================
  // 6. Plain-Language Insights Engine
  // ==========================================================================
  function evaluateInsights() {
    const card = document.getElementById('insightCard');
    const typeEl = document.getElementById('insightType');
    const bodyEl = document.getElementById('insightBody');
    const nudgeEl = document.getElementById('insightNudge');
    if (!card || !bodyEl) return;

    const totals = getCategoryTotals();
    const totalLogged = getTotalHoursLogged();
    const ideals = state.ideals;

    card.classList.remove('flagged');
    if (nudgeEl) nudgeEl.style.display = 'none';

    if (totalLogged <= 0) {
      typeEl.textContent = 'Observation';
      bodyEl.textContent = "Your Daybook is empty. Add your first block of time or tap one of the Quick Add presets to begin.";
      return;
    }

    const screens = totals['Screens & Social Media'] || 0;
    const sleep = totals['Sleep'] || 0;
    const work = totals['Work / Study'] || 0;
    const exercise = totals['Exercise'] || 0;
    const social = totals['In-person Social'] || 0;

    const idealScreens = Number(ideals['Screens & Social Media']) || 1.5;
    const idealSleep = Number(ideals['Sleep']) || 8.0;
    const idealWork = Number(ideals['Work / Study']) || 6.0;

    let flag = false;
    let title = 'Observation';
    let text = '';
    let nudge = '';

    // RULE 1: Screen time exceeds sleep (high alert)
    if (screens > 0 && sleep > 0 && screens > sleep) {
      flag = true;
      title = 'Attention Required';
      text = `You spent ${formatHours(screens)} on screens — more than your ${formatHours(sleep)} of sleep today.`;
      nudge = "Try setting a hard device curfew 45 minutes before sleep to restore your sleep quality.";
    }
    // RULE 2: Screen time significantly over budget
    else if (screens > idealScreens + 1.0) {
      flag = true;
      title = 'Over Target';
      text = `You budgeted ${formatHours(idealScreens)} for screens & social media but logged ${formatHours(screens)}.`;
      nudge = "Try a 25-minute outdoor walk before your next leisure scroll break.";
    }
    // RULE 3: Under-sleeping
    else if (sleep > 0 && sleep < 6.0) {
      flag = true;
      title = 'Sleep Deficit';
      text = `You logged only ${formatHours(sleep)} of sleep. You are running on a rest deficit today.`;
      nudge = "Aim to wrap up work tasks early and shift bedtime up by 45 minutes.";
    }
    // RULE 4: No exercise logged with active daytime
    else if (exercise === 0 && totalLogged >= 6.0) {
      flag = false;
      title = 'Movement Gap';
      text = `No physical exercise logged today across ${formatHours(totalLogged)} of activity.`;
      nudge = "Even a 15-minute brisk walk or light stretching will reset focus and posture.";
    }
    // RULE 5: High Work Load with No Movement
    else if (work >= 7.0 && exercise === 0) {
      flag = false;
      title = 'Workload Notice';
      text = `Heavy focus day: ${formatHours(work)} of work/study with no scheduled physical breaks.`;
      nudge = "Schedule a 10-minute away-from-screen posture reset.";
    }
    // RULE 6: Balanced Day
    else if (sleep >= 7.0 && exercise >= 0.5 && screens <= idealScreens) {
      flag = false;
      title = 'Healthy Balance';
      text = `Excellent daybook balance today! Your sleep (${formatHours(sleep)}), movement (${formatHours(exercise)}), and screen habits are well within your goals.`;
      nudge = "Maintain this cadence for tomorrow's routine.";
    }
    // RULE 7: Default Primary Sink
    else {
      let topCat = 'Work / Study';
      let topHrs = -1;
      for (const [c, h] of Object.entries(totals)) {
        if (h > topHrs) {
          topHrs = h;
          topCat = c;
        }
      }
      const pct = Math.round((topHrs / totalLogged) * 100);
      flag = false;
      title = 'Day Summary';
      text = `Most of your day went to **${topCat}** (${formatHours(topHrs)} — ${pct}% of your logged time).`;
      nudge = "Review the Actual vs. Ideal bars below to see how this matches your intention.";
    }

    if (flag) {
      card.classList.add('flagged');
    }
    typeEl.textContent = title;
    bodyEl.textContent = text;
    if (nudge && nudgeEl) {
      nudgeEl.textContent = `Nudge: ${nudge}`;
      nudgeEl.style.display = 'block';
    }
  }

  // ==========================================================================
  // 7. Actual vs. Ideal Progress Bars
  // ==========================================================================
  function renderActualVsIdealBars() {
    const totals = getCategoryTotals();
    const ideals = state.ideals;

    for (const [category, meta] of Object.entries(CATEGORIES)) {
      const actual = totals[category] || 0;
      const ideal = Number(ideals[category]) || meta.defaultIdeal;

      // Identify corresponding DOM elements
      let key = 'Other';
      if (category === 'Sleep') key = 'Sleep';
      else if (category === 'Work / Study') key = 'Work';
      else if (category === 'Screens & Social Media') key = 'Screens';
      else if (category === 'Exercise') key = 'Exercise';
      else if (category === 'In-person Social') key = 'Social';

      const statEl = document.getElementById(`barStat-${key}`);
      const fillEl = document.getElementById(`barFill-${key}`);
      const warnEl = document.getElementById(`barWarn-${key}`);

      if (statEl) {
        statEl.textContent = `${actual.toFixed(1)} / ${ideal.toFixed(1)}h`;
      }

      if (fillEl) {
        // Bar track is 24 hours width
        const widthPct = Math.min(100, (actual / 24) * 100);
        fillEl.style.width = `${widthPct}%`;

        // Check if over-budget
        if (meta.isHabitLimit && actual > ideal) {
          fillEl.classList.add('over-budget');
          if (warnEl) warnEl.style.display = 'inline-block';
        } else {
          fillEl.classList.remove('over-budget');
          if (warnEl) warnEl.style.display = 'none';
        }
      }
    }
  }

  // ==========================================================================
  // 8. Category Legend Times & Total Logged Counter
  // ==========================================================================
  function updateLegendAndCounters() {
    const totals = getCategoryTotals();
    const totalLogged = getTotalHoursLogged();

    const counterEl = document.getElementById('totalLoggedCounter');
    if (counterEl) {
      counterEl.textContent = `${totalLogged.toFixed(1)} / 24.0h`;
    }

    const mapping = {
      'Sleep': 'legTime-Sleep',
      'Work / Study': 'legTime-Work',
      'Screens & Social Media': 'legTime-Screens',
      'Exercise': 'legTime-Exercise',
      'In-person Social': 'legTime-Social',
      'Other': 'legTime-Other',
    };

    for (const [cat, id] of Object.entries(mapping)) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = formatHours(totals[cat] || 0);
      }
    }
  }

  // ==========================================================================
  // 9. Entries List Rendering (Logger Column)
  // ==========================================================================
  function renderEntriesList() {
    const listEl = document.getElementById('entriesList');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (state.entries.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-entries-message';
      emptyMsg.textContent = 'No entries yet today. Use the form above to log an activity.';
      listEl.appendChild(emptyMsg);
      return;
    }

    state.entries.forEach((entry, index) => {
      const row = document.createElement('div');
      row.className = 'entry-row';

      const catMeta = CATEGORIES[entry.category] || CATEGORIES['Other'];

      const info = document.createElement('div');
      info.className = 'entry-info';

      const dot = document.createElement('span');
      dot.className = 'category-indicator-dot small';
      dot.style.backgroundColor = catMeta.color;

      const name = document.createElement('span');
      name.className = 'entry-name';
      name.textContent = entry.category;

      info.appendChild(dot);
      info.appendChild(name);

      if (entry.note) {
        const note = document.createElement('span');
        note.className = 'entry-note';
        note.textContent = `— ${entry.note}`;
        info.appendChild(note);
      }

      const actions = document.createElement('div');
      actions.className = 'entry-actions';

      const dur = document.createElement('span');
      dur.className = 'entry-duration tabular';
      dur.textContent = formatHours(entry.hours);

      const btnRemove = document.createElement('button');
      btnRemove.type = 'button';
      btnRemove.className = 'btn-remove-entry';
      btnRemove.innerHTML = '&times;';
      btnRemove.title = 'Remove this entry';
      btnRemove.setAttribute('aria-label', `Remove ${entry.category} entry`);
      btnRemove.addEventListener('click', () => {
        removeEntry(index);
      });

      actions.appendChild(dur);
      actions.appendChild(btnRemove);

      row.appendChild(info);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  function removeEntry(index) {
    state.entries.splice(index, 1);
    saveEntries();
    refreshAllViews();
  }

  // ==========================================================================
  // 10. Form & Presets Interaction
  // ==========================================================================
  function setupFormHandlers() {
    const entryForm = document.getElementById('entryForm');
    const categorySelect = document.getElementById('categorySelect');
    const categoryDotPreview = document.getElementById('categoryDotPreview');
    const hoursInput = document.getElementById('hoursInput');
    const startHourInput = document.getElementById('startHourInput');
    const activityInput = document.getElementById('activityInput');

    if (categorySelect && categoryDotPreview) {
      categorySelect.addEventListener('change', () => {
        const selected = categorySelect.value;
        const color = CATEGORIES[selected] ? CATEGORIES[selected].color : '#9C9186';
        categoryDotPreview.style.backgroundColor = color;
      });
    }

    if (entryForm) {
      entryForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const cat = categorySelect.value;
        const hours = parseFloat(hoursInput.value);
        if (isNaN(hours) || hours <= 0) return;

        const startHour = startHourInput.value;
        const note = activityInput.value.trim();

        const newEntry = {
          id: 'e_' + Date.now(),
          category: cat,
          hours: hours,
          startHour: startHour,
          note: note,
        };

        state.entries.push(newEntry);
        saveEntries();
        refreshAllViews();

        // Reset inputs
        hoursInput.value = '';
        activityInput.value = '';
        hoursInput.focus();
      });
    }

    // Preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        if (PRESETS[presetKey]) {
          state.entries = JSON.parse(JSON.stringify(PRESETS[presetKey]));
          saveEntries();
          refreshAllViews();
        }
      });
    });

    // Load Pitch Sample Button
    const btnPitch = document.getElementById('btnLoadSamplePitch');
    if (btnPitch) {
      btnPitch.addEventListener('click', () => {
        state.entries = JSON.parse(JSON.stringify(PRESETS.pitch));
        saveEntries();
        refreshAllViews();
      });
    }

    // Reset Day button
    const btnResetDay = document.getElementById('btnResetDay');
    if (btnResetDay) {
      btnResetDay.addEventListener('click', () => {
        if (confirm('Start a fresh new day? This will clear today\'s logged entries.')) {
          state.entries = [];
          saveEntries();
          refreshAllViews();
        }
      });
    }
  }

  // ==========================================================================
  // 11. View Toggle (Day Dial vs Chart.js Doughnut)
  // ==========================================================================
  function setupViewToggle() {
    const btnDial = document.getElementById('toggleDialView');
    const btnDonut = document.getElementById('toggleDonutView');
    const dialContainer = document.getElementById('dayDialContainer');
    const chartContainer = document.getElementById('chartContainer');

    if (!btnDial || !btnDonut) return;

    btnDial.addEventListener('click', () => {
      btnDial.classList.add('active');
      btnDial.setAttribute('aria-selected', 'true');
      btnDonut.classList.remove('active');
      btnDonut.setAttribute('aria-selected', 'false');

      dialContainer.style.display = 'block';
      chartContainer.style.display = 'none';
      state.activeView = 'dial';
      renderDayDial();
    });

    btnDonut.addEventListener('click', () => {
      btnDonut.classList.add('active');
      btnDonut.setAttribute('aria-selected', 'true');
      btnDial.classList.remove('active');
      btnDial.setAttribute('aria-selected', 'false');

      dialContainer.style.display = 'none';
      chartContainer.style.display = 'block';
      state.activeView = 'donut';
      renderDonutChart();
    });
  }

  // ==========================================================================
  // 12. Settings Modal (Ideal Targets Customizer)
  // ==========================================================================
  function setupSettingsModal() {
    const btnSettings = document.getElementById('btnSettings');
    const modal = document.getElementById('settingsModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const idealsForm = document.getElementById('idealsForm');
    const btnResetIdeals = document.getElementById('btnResetIdeals');

    if (!modal) return;

    function openModal() {
      // Pre-fill inputs with current ideals
      const map = {
        'Sleep': 'ideal-Sleep',
        'Work / Study': 'ideal-Study',
        'Screens & Social Media': 'ideal-Screens',
        'Exercise': 'ideal-Exercise',
        'In-person Social': 'ideal-Social',
        'Other': 'ideal-Other',
      };
      for (const [cat, id] of Object.entries(map)) {
        const input = document.getElementById(id);
        if (input && state.ideals[cat] !== undefined) {
          input.value = state.ideals[cat];
        }
      }
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }

    if (btnSettings) {
      btnSettings.addEventListener('click', openModal);
    }

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (idealsForm) {
      idealsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.ideals['Sleep'] = parseFloat(document.getElementById('ideal-Sleep').value) || 8.0;
        state.ideals['Work / Study'] = parseFloat(document.getElementById('ideal-Study').value) || 6.0;
        state.ideals['Screens & Social Media'] = parseFloat(document.getElementById('ideal-Screens').value) || 1.5;
        state.ideals['Exercise'] = parseFloat(document.getElementById('ideal-Exercise').value) || 1.0;
        state.ideals['In-person Social'] = parseFloat(document.getElementById('ideal-Social').value) || 2.0;
        state.ideals['Other'] = parseFloat(document.getElementById('ideal-Other').value) || 5.5;

        saveIdeals();
        closeModal();
        refreshAllViews();
      });
    }

    if (btnResetIdeals) {
      btnResetIdeals.addEventListener('click', () => {
        for (const [cat, meta] of Object.entries(CATEGORIES)) {
          state.ideals[cat] = meta.defaultIdeal;
        }
        saveIdeals();
        openModal();
        refreshAllViews();
      });
    }
  }

  // ==========================================================================
  // 13. Dynamic Date & Clock
  // ==========================================================================
  function updateDateDisplay() {
    const dateEl = document.getElementById('currentDateDisplay');
    if (!dateEl) return;

    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  // ==========================================================================
  // 14. Master Refresh Pipeline
  // ==========================================================================
  function refreshAllViews() {
    renderEntriesList();
    updateLegendAndCounters();
    renderActualVsIdealBars();
    evaluateInsights();

    if (state.activeView === 'dial') {
      renderDayDial();
    } else {
      renderDonutChart();
    }
  }

  // ==========================================================================
  // 15. Initialization
  // ==========================================================================
  function init() {
    loadState();
    updateDateDisplay();
    setupFormHandlers();
    setupViewToggle();
    setupSettingsModal();
    refreshAllViews();

    // Re-sync dial clock hand every minute
    setInterval(() => {
      updateDialNeedle();
    }, 60000);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
