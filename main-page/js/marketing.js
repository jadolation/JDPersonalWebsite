(function () {
  'use strict';
  const dialog = document.getElementById('lightbox');
  if (!dialog) return;

  const img = dialog.querySelector('img');
  const counter = dialog.querySelector('.lightbox-counter');
  const prevBtn = dialog.querySelector('[data-lightbox-prev]');
  const nextBtn = dialog.querySelector('[data-lightbox-next]');
  const closeBtn = dialog.querySelector('[data-lightbox-close]');
  if (!img || !closeBtn) return;
  let currentGroup = [];
  let currentIndex = -1;

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.documentElement.style.overflow = '';
  }

  function openLightbox(trigger, group) {
    currentGroup = group;
    const fullSrc = trigger.getAttribute('data-full');
    const alt = trigger.querySelector('img').getAttribute('alt') || '';
    img.src = fullSrc;
    img.alt = alt;
    currentIndex = group.indexOf(trigger);
    updateCounter();
    dialog.showModal();
    lockScroll();
    closeBtn.focus();
  }

  function updateCounter() {
    if (counter) counter.textContent = (currentIndex + 1) + ' of ' + currentGroup.length;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    const trigger = currentGroup[currentIndex];
    img.src = trigger.getAttribute('data-full');
    img.alt = trigger.querySelector('img').getAttribute('alt') || '';
    updateCounter();
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    const trigger = currentGroup[currentIndex];
    img.src = trigger.getAttribute('data-full');
    img.alt = trigger.querySelector('img').getAttribute('alt') || '';
    updateCounter();
  }

  function closeLightbox() {
    dialog.close();
    unlockScroll();
    if (currentGroup[currentIndex]) currentGroup[currentIndex].focus();
  }

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeLightbox();
  });

  closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  dialog.addEventListener('close', unlockScroll);

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); showPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showNext(); }
  });

  document.querySelectorAll('.marketing-group').forEach(group => {
    const triggers = Array.from(group.querySelectorAll('.marketing-open'));
    if (!triggers.length) return;
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => openLightbox(trigger, triggers));
    });
  });
})();
