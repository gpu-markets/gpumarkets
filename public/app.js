const TERM_HELP_SELECTOR = '[data-term-help]';
const TERM_TRIGGER_SELECTOR = '[data-term-trigger]';
const TERM_POPOVER_SELECTOR = '[data-term-popover]';

/* ------------- Inline glossary popovers ------------- */
(function () {
  let activeTermHelp = null;
  let lastPointerType = 'mouse';

  function isPinned(wrapper) {
    return wrapper?.dataset.pinned === 'true';
  }

  function setTermHelp(wrapper, { open, pinned = false }) {
    if (!wrapper) return;
    const trigger = wrapper.querySelector(TERM_TRIGGER_SELECTOR);
    const popover = wrapper.querySelector(TERM_POPOVER_SELECTOR);
    if (!trigger || !popover) return;

    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    wrapper.dataset.pinned = open && pinned ? 'true' : 'false';

    if (open) {
      popover.removeAttribute('hidden');
      placeTermHelp(wrapper);
      activeTermHelp = wrapper;
    } else {
      popover.setAttribute('hidden', '');
      if (activeTermHelp === wrapper) activeTermHelp = null;
    }
  }

  function placeTermHelp(wrapper) {
    if (!wrapper) return;
    const trigger = wrapper.querySelector(TERM_TRIGGER_SELECTOR);
    const popover = wrapper.querySelector(TERM_POPOVER_SELECTOR);
    if (!(trigger instanceof HTMLElement) || !(popover instanceof HTMLElement)) return;

    popover.style.left = '0px';
    popover.style.top = '0px';

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const gutter = 16;
    let left = triggerRect.left;
    let top = triggerRect.bottom + 8;

    if (left + popoverRect.width > window.innerWidth - gutter) {
      left = window.innerWidth - popoverRect.width - gutter;
    }
    left = Math.max(gutter, left);

    if (top + popoverRect.height > window.innerHeight - gutter) {
      const above = triggerRect.top - popoverRect.height - 8;
      if (above >= gutter) top = above;
    }

    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(Math.max(gutter, top))}px`;
  }

  function closeActiveTermHelp() {
    if (!activeTermHelp) return;
    const wrapper = activeTermHelp;
    setTermHelp(wrapper, { open: false });
  }

  function openTermHelp(wrapper, options = {}) {
    if (!wrapper) return;
    if (activeTermHelp && activeTermHelp !== wrapper) {
      setTermHelp(activeTermHelp, { open: false });
    }
    setTermHelp(wrapper, { open: true, pinned: Boolean(options.pinned) });
  }

  document.addEventListener('pointerdown', (e) => {
    lastPointerType = e.pointerType || 'mouse';
    if (!activeTermHelp) return;
    if (!e.target.closest(TERM_HELP_SELECTOR)) {
      closeActiveTermHelp();
    }
  });

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const trigger = e.target.closest(TERM_TRIGGER_SELECTOR);
    if (!trigger) return;
    const wrapper = trigger.closest(TERM_HELP_SELECTOR);
    if (!wrapper || isPinned(wrapper)) return;
    openTermHelp(wrapper, { pinned: false });
  });

  document.addEventListener('pointerout', (e) => {
    if (e.pointerType !== 'mouse') return;
    const wrapper = e.target.closest(TERM_HELP_SELECTOR);
    if (!wrapper || wrapper !== activeTermHelp || isPinned(wrapper)) return;
    if (wrapper.contains(e.relatedTarget)) return;
    setTermHelp(wrapper, { open: false });
  });

  document.addEventListener('focusin', (e) => {
    const trigger = e.target.closest(TERM_TRIGGER_SELECTOR);
    if (!trigger) return;
    const wrapper = trigger.closest(TERM_HELP_SELECTOR);
    if (!wrapper) return;
    openTermHelp(wrapper, { pinned: false });
  });

  document.addEventListener('focusout', (e) => {
    const wrapper = e.target.closest(TERM_HELP_SELECTOR);
    if (!wrapper || wrapper !== activeTermHelp || isPinned(wrapper)) return;
    const next = e.relatedTarget;
    if (next && wrapper.contains(next)) return;
    setTimeout(() => {
      if (!wrapper.contains(document.activeElement) && !isPinned(wrapper)) {
        setTermHelp(wrapper, { open: false });
      }
    }, 0);
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(TERM_TRIGGER_SELECTOR);
    if (!trigger) return;
    e.preventDefault();
    e.stopPropagation();

    const wrapper = trigger.closest(TERM_HELP_SELECTOR);
    if (!wrapper) return;

    if (wrapper === activeTermHelp) {
      if (isPinned(wrapper) || lastPointerType !== 'mouse') {
        setTermHelp(wrapper, { open: false });
      } else {
        openTermHelp(wrapper, { pinned: true });
      }
      return;
    }

    openTermHelp(wrapper, { pinned: lastPointerType !== 'mouse' });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!activeTermHelp) return;
    const wrapper = activeTermHelp;
    const trigger = wrapper.querySelector(TERM_TRIGGER_SELECTOR);
    closeActiveTermHelp();
    if (trigger instanceof HTMLElement) {
      trigger.focus();
    }
  });

  window.addEventListener('scroll', () => {
    if (activeTermHelp) placeTermHelp(activeTermHelp);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (activeTermHelp) placeTermHelp(activeTermHelp);
  });
})();

/* ------------- Expandable chip spec rows ------------- */
document.addEventListener('click', (e) => {
  if (e.target.closest(TERM_HELP_SELECTOR)) return;
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

/* ------------- Sticky table heads ------------- */
(function () {
  const tables = [...document.querySelectorAll('table.fixing')];
  if (tables.length === 0) return;

  const stickyTables = tables.map((table) => {
    const scrollWrap = table.closest('.table-scroll');
    const thead = table.querySelector('thead');
    if (!scrollWrap || !thead) return null;

    const shell = document.createElement('div');
    shell.className = 'fixing-sticky-shell';
    shell.setAttribute('aria-hidden', 'true');

    const cloneTable = document.createElement('table');
    cloneTable.className = 'fixing';
    const cloneHead = thead.cloneNode(true);
    cloneTable.appendChild(cloneHead);
    shell.appendChild(cloneTable);
    document.body.appendChild(shell);

    const syncWidths = () => {
      const sourceCells = [...thead.querySelectorAll('th')];
      const cloneCells = [...cloneHead.querySelectorAll('th')];
      shell.style.width = `${Math.round(table.getBoundingClientRect().width)}px`;
      cloneTable.style.width = `${Math.round(table.getBoundingClientRect().width)}px`;
      cloneCells.forEach((cell, index) => {
        const source = sourceCells[index];
        if (!source) return;
        cell.style.width = `${Math.round(source.getBoundingClientRect().width)}px`;
        cell.style.minWidth = `${Math.round(source.getBoundingClientRect().width)}px`;
      });
    };

    const syncPosition = () => {
      const tableRect = table.getBoundingClientRect();
      const headRect = thead.getBoundingClientRect();
      const visible = headRect.top <= 0 && tableRect.bottom > headRect.height + 8;
      shell.style.display = visible ? 'block' : 'none';
      if (!visible) return;
      shell.style.left = `${Math.round(tableRect.left)}px`;
      shell.style.top = '0px';
      syncWidths();
    };

    scrollWrap.addEventListener('scroll', syncPosition, { passive: true });
    return { syncWidths, syncPosition, shell };
  }).filter(Boolean);

  const syncAllStickyTables = () => {
    stickyTables.forEach((entry) => {
      entry.syncWidths();
      entry.syncPosition();
    });
  };

  window.addEventListener('scroll', syncAllStickyTables, { passive: true });
  window.addEventListener('resize', syncAllStickyTables);
  syncAllStickyTables();
})();

/* ------------- Hero chart ------------- */
(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const LEFT = 54;
  const RIGHT = 908;
  const TOP = 18;
  const BOTTOM = 338;
  const plotW = RIGHT - LEFT;
  const plotH = BOTTOM - TOP;
  const LAST_FIX_AT_UTC = '2026-04-18T00:30:00Z';
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const svg = document.getElementById('hero-chart');
  if (!svg || typeof SERIES_DATA === 'undefined') return;

  const byId = Object.fromEntries(SERIES_DATA.map((s) => [s.id, s]));
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
  const hitArea = svg.querySelector('[data-hit-area]');
  const tooltipLine = svg.querySelector('[data-tooltip-line]');
  const tooltipPoint = svg.querySelector('[data-tooltip-point]');
  const tooltipBox = svg.querySelector('[data-tooltip-box]');
  const tooltipBg = svg.querySelector('[data-tooltip-bg]');
  const tooltipDate = svg.querySelector('[data-tooltip-date]');
  const tooltipPrice = svg.querySelector('[data-tooltip-price]');
  const statusEl = document.getElementById('hero-chart-status');

  let activeSeries = null;
  let tooltipIndex = null;
  let tooltipPinned = false;

  // Fixed 6-month x-axis labels (today 2026-04-18; 180 days back ~= 2025-10-20)
  const X_TICKS = [
    { day: 21, label: 'NOV 2025' },
    { day: 51, label: 'DEC 2025' },
    { day: 82, label: 'JAN 2026' },
    { day: 113, label: 'FEB 2026' },
    { day: 141, label: 'MAR 2026' },
    { day: 172, label: 'APR 2026' },
  ];

  // Annotations ONLY for H100 SXM Spot (the hand-curated original)
  const ANNOS = {
    'GPUM.H100.SXM.SPOT': [
      { day: 30, text: 'B200 launch' },
      { day: 95, text: 'CoreWeave Q4 earnings' },
      { day: 140, text: 'Blackwell supply easing' },
    ],
  };

  function mkEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function fmtPrice(v) {
    return '$' + v.toFixed(2);
  }

  function xOf(index, length) {
    return LEFT + (index / (length - 1)) * plotW;
  }

  function yOf(value, series) {
    return TOP + (1 - (value - series.yMin) / (series.yMax - series.yMin)) * plotH;
  }

  function dateForPoint(index, length) {
    const date = new Date(LAST_FIX_AT_UTC);
    date.setUTCDate(date.getUTCDate() - ((length - 1) - index));
    return date;
  }

  function tooltipDateText(index, length) {
    return dateFormatter.format(dateForPoint(index, length));
  }

  function tooltipStatusText(series, index) {
    return `${series.label}, ${tooltipDateText(index, series.prices.length)}: $${series.prices[index].toFixed(4)} per GPU-hour.`;
  }

  function setTooltip(index, options = {}) {
    if (!activeSeries) return;
    const length = activeSeries.prices.length;
    const nextIndex = clamp(index, 0, length - 1);
    const x = xOf(nextIndex, length);
    const y = yOf(activeSeries.prices[nextIndex], activeSeries);
    const dateText = tooltipDateText(nextIndex, length);
    const priceText = `$${activeSeries.prices[nextIndex].toFixed(4)} / GPU-hr`;

    tooltipIndex = nextIndex;

    tooltipLine.setAttribute('visibility', 'visible');
    tooltipPoint.setAttribute('visibility', 'visible');
    tooltipBox.setAttribute('visibility', 'visible');

    tooltipLine.setAttribute('x1', x.toFixed(2));
    tooltipLine.setAttribute('x2', x.toFixed(2));
    tooltipPoint.setAttribute('cx', x.toFixed(2));
    tooltipPoint.setAttribute('cy', y.toFixed(2));

    tooltipDate.textContent = dateText;
    tooltipPrice.textContent = priceText;
    tooltipDate.setAttribute('x', '10');
    tooltipDate.setAttribute('y', '15');
    tooltipPrice.setAttribute('x', '10');
    tooltipPrice.setAttribute('y', '30');

    const dateWidth = tooltipDate.getBBox().width;
    const priceWidth = tooltipPrice.getBBox().width;
    const width = Math.max(dateWidth, priceWidth) + 20;
    const height = 38;
    const boxX = clamp(x + 12, LEFT, RIGHT - width);
    const boxY = clamp(y < TOP + 54 ? y + 14 : y - height - 14, TOP + 6, BOTTOM - height - 6);

    tooltipBox.setAttribute('transform', `translate(${boxX.toFixed(2)},${boxY.toFixed(2)})`);
    tooltipBg.setAttribute('width', width.toFixed(2));
    tooltipBg.setAttribute('height', String(height));

    if (options.announce !== false && statusEl) {
      statusEl.textContent = tooltipStatusText(activeSeries, nextIndex);
    }
  }

  function hideTooltip(force = false) {
    if (tooltipPinned && !force) return;
    tooltipIndex = null;
    tooltipLine.setAttribute('visibility', 'hidden');
    tooltipPoint.setAttribute('visibility', 'hidden');
    tooltipBox.setAttribute('visibility', 'hidden');
    if (statusEl) statusEl.textContent = '';
  }

  function nearestIndexFromPointer(event) {
    if (!activeSeries) return 0;
    const rect = svg.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * 1000;
    const clampedX = clamp(svgX, LEFT, RIGHT);
    const rawIndex = ((clampedX - LEFT) / plotW) * (activeSeries.prices.length - 1);
    return Math.round(rawIndex);
  }

  function render(series) {
    const { prices, yMin, yMax, step, today } = series;
    const length = prices.length;

    // Gridlines + Y labels
    gridG.innerHTML = '';
    yLabG.innerHTML = '';
    const ticks = [];
    for (let value = yMin; value <= yMax + 1e-9; value += step) ticks.push(+value.toFixed(4));
    while (ticks.length > 8) ticks.splice(1, 1);
    for (const value of ticks) {
      const y = yOf(value, series);
      gridG.appendChild(mkEl('line', { x1: LEFT, x2: RIGHT, y1: y, y2: y }));
      const label = mkEl('text', { x: 48, y: y + 3 });
      label.textContent = fmtPrice(value);
      yLabG.appendChild(label);
    }

    // Line + area
    let linePath = '';
    for (let index = 0; index < length; index++) {
      linePath += (index === 0 ? 'M' : ' L') + xOf(index, length).toFixed(2) + ',' + yOf(prices[index], series).toFixed(2);
    }
    const areaPath =
      linePath +
      ' L' +
      xOf(length - 1, length).toFixed(2) +
      ',' +
      BOTTOM +
      ' L' +
      xOf(0, length).toFixed(2) +
      ',' +
      BOTTOM +
      ' Z';
    lineP.setAttribute('d', linePath);
    areaP.setAttribute('d', areaPath);

    // Subtle redraw effect: briefly dash the line
    try {
      const lineLength = lineP.getTotalLength();
      lineP.style.transition = 'none';
      lineP.setAttribute('stroke-dasharray', lineLength + ' ' + lineLength);
      lineP.setAttribute('stroke-dashoffset', lineLength);
      lineP.getBoundingClientRect();
      lineP.style.transition = 'stroke-dashoffset 200ms ease';
      lineP.setAttribute('stroke-dashoffset', '0');
      setTimeout(() => {
        lineP.removeAttribute('stroke-dasharray');
        lineP.removeAttribute('stroke-dashoffset');
        lineP.style.transition = '';
      }, 240);
    } catch (_) {}

    // Today rule + label
    const todayY = yOf(today, series);
    todayL.setAttribute('y1', todayY);
    todayL.setAttribute('y2', todayY);
    todayT.setAttribute('y', todayY + 3);
    todayT.textContent = 'TODAY · $' + today.toFixed(4);

    // X ticks + labels
    xTickG.innerHTML = '';
    xLabG.innerHTML = '';
    for (const { day, label } of X_TICKS) {
      const x = xOf(day, length);
      xTickG.appendChild(mkEl('line', { x1: x, x2: x, y1: BOTTOM, y2: BOTTOM + 4 }));
      const tick = mkEl('text', { x: x, y: BOTTOM + 18 });
      tick.textContent = label;
      xLabG.appendChild(tick);
    }

    // Annotations (H100 Spot only)
    annoG.innerHTML = '';
    const annotations = ANNOS[series.id] || [];
    for (const annotation of annotations) {
      const cx = xOf(annotation.day, length);
      const cy = yOf(prices[annotation.day], series);
      annoG.appendChild(mkEl('circle', { cx, cy, r: 2.5 }));
      annoG.appendChild(mkEl('line', { class: 'anno-leader', x1: cx, y1: cy, x2: cx, y2: cy - 24 }));
      const text = mkEl('text', { class: 'anno-label', x: cx + 4, y: cy - 28 });
      text.textContent = annotation.text;
      annoG.appendChild(text);
    }

    titleEl.textContent = series.label + ' · 180 Days';
    svg.setAttribute('aria-label', series.label + ' price over the last 180 days');

    if (document.activeElement === svg || tooltipPinned || tooltipIndex !== null) {
      setTooltip(tooltipIndex ?? (series.prices.length - 1), { announce: false });
    } else {
      hideTooltip(true);
    }
  }

  function setActive(id) {
    const series = byId[id];
    if (!series) return;
    activeSeries = series;
    tooltipPinned = false;
    tooltipIndex = null;
    document.querySelectorAll('.chip-row.active').forEach((row) => row.classList.remove('active'));
    document.querySelectorAll('.chip-row[data-series="' + id + '"]').forEach((row) => row.classList.add('active'));
    render(series);
  }

  hitArea.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || !activeSeries) return;
    tooltipPinned = false;
    setTooltip(nearestIndexFromPointer(event));
  });

  hitArea.addEventListener('pointermove', (event) => {
    if (!activeSeries || tooltipPinned) return;
    setTooltip(nearestIndexFromPointer(event), { announce: false });
  });

  hitArea.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    hideTooltip(true);
  });

  hitArea.addEventListener('pointerdown', (event) => {
    if (!activeSeries || event.pointerType === 'mouse') return;
    tooltipPinned = true;
    setTooltip(nearestIndexFromPointer(event));
  });

  svg.addEventListener('focus', () => {
    if (!activeSeries) return;
    tooltipPinned = false;
    setTooltip(tooltipIndex ?? (activeSeries.prices.length - 1));
  });

  svg.addEventListener('blur', () => {
    hideTooltip(true);
  });

  svg.addEventListener('keydown', (event) => {
    if (!activeSeries) return;
    const length = activeSeries.prices.length;
    const currentIndex = tooltipIndex ?? (length - 1);
    let nextIndex = null;

    if (event.key === 'ArrowLeft') nextIndex = currentIndex - 1;
    if (event.key === 'ArrowRight') nextIndex = currentIndex + 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = length - 1;

    if (event.key === 'Escape') {
      tooltipPinned = false;
      hideTooltip(true);
      return;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    tooltipPinned = true;
    setTooltip(clamp(nextIndex, 0, length - 1));
  });

  document.addEventListener('pointerdown', (event) => {
    if (!tooltipPinned) return;
    if (!svg.contains(event.target)) {
      tooltipPinned = false;
      hideTooltip(true);
    }
  });

  // Click anywhere on a chip-row -> activate that series.
  // (The row-toggle button lives inside the row and handles its own expand; this bubbles up after.)
  document.addEventListener('click', (event) => {
    if (event.target.closest(TERM_HELP_SELECTOR)) return;
    const row = event.target.closest('.chip-row[data-series]');
    if (!row) return;
    setActive(row.dataset.series);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target.closest('.row-toggle')) return;
    if (event.target.closest(TERM_HELP_SELECTOR)) return;
    const row = event.target.closest && event.target.closest('.chip-row[data-series]');
    if (!row) return;
    event.preventDefault();
    setActive(row.dataset.series);
  });

  setActive('GPUM.H100.SXM.SPOT');
})();
