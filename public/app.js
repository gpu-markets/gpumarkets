// Expandable chip spec rows
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.row-toggle');
  if (!btn) return;
  const id = btn.getAttribute('aria-controls');
  if (!id) return;
  const specRow = document.getElementById(id);
  if (!specRow) return;
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (expanded) {
    specRow.setAttribute('hidden', '');
  } else {
    specRow.removeAttribute('hidden');
  }
});

/* ------------- Hero chart ------------- */
(function(){
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const LEFT = 54, RIGHT = 908, TOP = 18, BOTTOM = 338;
  const plotW = RIGHT - LEFT, plotH = BOTTOM - TOP;

  const byId = Object.fromEntries(SERIES_DATA.map(s => [s.id, s]));
  const svg = document.getElementById('hero-chart');
  const gridG = svg.querySelector('[data-gridlines]');
  const yLabG = svg.querySelector('[data-ylabels]');
  const areaP = svg.querySelector('[data-area]');
  const lineP = svg.querySelector('[data-line]');
  const todayL = svg.querySelector('[data-today-line]');
  const todayT = svg.querySelector('[data-today-label]');
  const annoG = svg.querySelector('[data-annotations]');
  const xTickG = svg.querySelector('[data-xticks]');
  const xLabG = svg.querySelector('[data-xlabels]');
  const titleEl = document.querySelector('[data-chart-title]');

  // Fixed 6-month x-axis labels (today 2026-04-18; 180 days back ≈ 2025-10-20)
  const X_TICKS = [
    { day:  21, label: 'NOV 2025' },
    { day:  51, label: 'DEC 2025' },
    { day:  82, label: 'JAN 2026' },
    { day: 113, label: 'FEB 2026' },
    { day: 141, label: 'MAR 2026' },
    { day: 172, label: 'APR 2026' },
  ];

  // Annotations ONLY for H100 SXM Spot (the hand-curated original)
  const ANNOS = {
    'GPUM.H100.SXM.SPOT': [
      { day:  30, text: 'B200 launch' },
      { day:  95, text: 'CoreWeave Q4 earnings' },
      { day: 140, text: 'Blackwell supply easing' },
    ],
  };

  function mkEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function fmtPrice(v) {
    return '$' + v.toFixed(2);
  }

  function render(series) {
    const { prices, yMin, yMax, step, today } = series;
    const n = prices.length;

    const xOf = i => LEFT + (i / (n - 1)) * plotW;
    const yOf = v => TOP + (1 - (v - yMin) / (yMax - yMin)) * plotH;

    // Gridlines + Y labels
    gridG.innerHTML = '';
    yLabG.innerHTML = '';
    const ticks = [];
    for (let v = yMin; v <= yMax + 1e-9; v += step) ticks.push(+v.toFixed(4));
    while (ticks.length > 8) ticks.splice(1, 1);
    for (const v of ticks) {
      const y = yOf(v);
      gridG.appendChild(mkEl('line', { x1: LEFT, x2: RIGHT, y1: y, y2: y }));
      const t = mkEl('text', { x: 48, y: y + 3 });
      t.textContent = fmtPrice(v);
      yLabG.appendChild(t);
    }

    // Line + area
    let linePath = '';
    for (let i = 0; i < n; i++) {
      linePath += (i === 0 ? 'M' : ' L') + xOf(i).toFixed(2) + ',' + yOf(prices[i]).toFixed(2);
    }
    const areaPath = linePath + ' L' + xOf(n - 1).toFixed(2) + ',' + BOTTOM + ' L' + xOf(0).toFixed(2) + ',' + BOTTOM + ' Z';
    lineP.setAttribute('d', linePath);
    areaP.setAttribute('d', areaPath);

    // Subtle redraw effect: briefly dash the line
    try {
      const len = lineP.getTotalLength();
      lineP.style.transition = 'none';
      lineP.setAttribute('stroke-dasharray', len + ' ' + len);
      lineP.setAttribute('stroke-dashoffset', len);
      lineP.getBoundingClientRect(); // reflow
      lineP.style.transition = 'stroke-dashoffset 200ms ease';
      lineP.setAttribute('stroke-dashoffset', '0');
      setTimeout(() => {
        lineP.removeAttribute('stroke-dasharray');
        lineP.removeAttribute('stroke-dashoffset');
        lineP.style.transition = '';
      }, 240);
    } catch (_) {}

    // Today rule + label
    const ty = yOf(today);
    todayL.setAttribute('y1', ty);
    todayL.setAttribute('y2', ty);
    todayT.setAttribute('y', ty + 3);
    todayT.textContent = 'TODAY · $' + today.toFixed(4);

    // X ticks + labels
    xTickG.innerHTML = '';
    xLabG.innerHTML = '';
    for (const { day, label: lbl } of X_TICKS) {
      const x = xOf(day);
      xTickG.appendChild(mkEl('line', { x1: x, x2: x, y1: BOTTOM, y2: BOTTOM + 4 }));
      const t = mkEl('text', { x: x, y: BOTTOM + 18 });
      t.textContent = lbl;
      xLabG.appendChild(t);
    }

    // Annotations (H100 Spot only)
    annoG.innerHTML = '';
    const annos = ANNOS[series.id] || [];
    for (const a of annos) {
      const cx = xOf(a.day), cy = yOf(prices[a.day]);
      annoG.appendChild(mkEl('circle', { cx, cy, r: 2.5 }));
      annoG.appendChild(mkEl('line', { class: 'anno-leader', x1: cx, y1: cy, x2: cx, y2: cy - 24 }));
      const t = mkEl('text', { class: 'anno-label', x: cx + 4, y: cy - 28 });
      t.textContent = a.text;
      annoG.appendChild(t);
    }

    // Title
    titleEl.textContent = series.label + ' · 180 Days';
    svg.setAttribute('aria-label', series.label + ' price over the last 180 days');
  }

  function setActive(id) {
    const s = byId[id];
    if (!s) return;
    document.querySelectorAll('.chip-row.active').forEach(r => r.classList.remove('active'));
    document.querySelectorAll('.chip-row[data-series="' + id + '"]').forEach(r => r.classList.add('active'));
    render(s);
  }

  // Click anywhere on a chip-row → activate that series.
  // (The row-toggle button lives inside the row and handles its own expand; this bubbles up after.)
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.chip-row[data-series]');
    if (!row) return;
    setActive(row.dataset.series);
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target.closest('.row-toggle')) return; // let button handle itself
    const row = e.target.closest && e.target.closest('.chip-row[data-series]');
    if (!row) return;
    e.preventDefault();
    setActive(row.dataset.series);
  });

  // Default active row
  setActive('GPUM.H100.SXM.SPOT');
})();
