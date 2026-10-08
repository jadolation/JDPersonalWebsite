(function () {
  'use strict';
  const root = document.getElementById('deployed');
  if (!root) return;

  const panels = root.querySelectorAll('.deployed-panel');
  const tabs = root.querySelectorAll('.logo-strip button[role="tab"]');
  if (!panels.length || !tabs.length) return;

  function activate(index) {
    panels.forEach((panel, i) => {
      const active = i === index;
      panel.setAttribute('data-active', active ? '' : null);
    });
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => activate(idx));
    tab.addEventListener('keydown', (e) => {
      let target = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = idx + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = idx - 1;
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = tabs.length - 1;
      else return;
      e.preventDefault();
      target = ((target % tabs.length) + tabs.length) % tabs.length;
      tabs[target].focus();
      activate(target);
    });
  });

  root.querySelectorAll('a[data-placeholder]').forEach(a => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const panel = entry.target.closest('.deployed-panel');
        if (!panel) continue;
        const lastRow = entry.target.lastElementChild;
        if (lastRow) {
          const h = Math.ceil(lastRow.getBoundingClientRect().height);
          panel.style.setProperty('--last-row-h', h + 'px');
          const side = panel.querySelector('.deployed-side');
          if (side) side.style.paddingBottom = 'calc((var(--last-row-h) - var(--btn-h, 3rem)) / 2)';
        }
      }
    });
    panels.forEach(p => {
      const facts = p.querySelector('.deployed-facts');
      if (facts) ro.observe(facts);
    });
  }
})();
