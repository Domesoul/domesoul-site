// ===== Modals =====
/* ===== Accessible, modern modals ===== */
(function () {
  const openers = document.querySelectorAll('[data-modal-open]');
  const modals  = new Map();
  let lastTrigger = null;

  // Build modal registry + wire close buttons/backdrops
  document.querySelectorAll('.modal').forEach(m => {
    const panel = m.querySelector('.modal__panel');
    const backdrop = m.querySelector('.modal__backdrop');
    const closers = m.querySelectorAll('[data-modal-close]');
    modals.set(m.id, { modal: m, panel, backdrop, closers });

    closers.forEach(btn => btn.addEventListener('click', () => closeModal(m.id)));
    if (backdrop) backdrop.addEventListener('click', () => closeModal(m.id));
  });

  // Open handlers
  openers.forEach(btn => {
    btn.addEventListener('click', e => {
      const id = btn.getAttribute('data-modal-open');
      lastTrigger = btn;
      openModal(id);
    });
    // open via keyboard Enter/Space is default for button
  });

  // ESC close + focus trap
  document.addEventListener('keydown', e => {
    const open = document.querySelector('.modal.is-open');
    if (!open) return;

    if (e.key === 'Escape') {
      const id = open.id;
      closeModal(id);
      return;
    }

    if (e.key === 'Tab') {
      trapFocus(open, e);
    }
  });

  function openModal(id) {
    const entry = modals.get(id);
    if (!entry) return;

    // Hide any other open modals
    document.querySelectorAll('.modal.is-open').forEach(m => m.classList.remove('is-open'));

    entry.modal.classList.add('is-open');
    entry.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus the panel (or first focusable inside)
    setTimeout(() => {
      const focusable = getFocusable(entry.modal);
      if (focusable.length) {
        (focusable.find(el => el.tagName !== 'DIV') || entry.panel).focus();
      } else {
        entry.panel.focus();
      }
    }, 0);
  }

  function closeModal(id) {
    const entry = modals.get(id);
    if (!entry) return;

    entry.modal.classList.remove('is-open');
    entry.modal.setAttribute('aria-hidden', 'true');

    // If no other modal is open, restore scroll
    if (!document.querySelector('.modal.is-open')) {
      document.body.classList.remove('modal-open');
    }

    // Return focus to the trigger button
    if (lastTrigger && document.body.contains(lastTrigger)) {
      lastTrigger.focus();
    }
  }

  function getFocusable(root) {
    return Array.from(root.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  }

  function trapFocus(container, e) {
    const nodes = getFocusable(container);
    if (!nodes.length) return;
    const first = nodes[0];
    const last  = nodes[nodes.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus(); e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus(); e.preventDefault();
    }
  }
})();


// ===== Reveal on Scroll =====
(function(){
  const els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
