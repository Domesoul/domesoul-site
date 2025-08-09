/* ===== Accessible, modern modals (supports data-attrs AND legacy onclick) ===== */
(function () {
  let lastTrigger = null;
  const modals = new Map();

  function registerModals() {
    document.querySelectorAll('.modal').forEach(m => {
      const panel = m.querySelector('.modal__panel') || m;
      const backdrop = m.querySelector('.modal__backdrop');
      const closers = m.querySelectorAll('[data-modal-close]');
      modals.set(m.id, { modal: m, panel, backdrop, closers });

      closers.forEach(btn => btn.addEventListener('click', () => closeModal(m.id)));
      if (backdrop) backdrop.addEventListener('click', () => closeModal(m.id));
      m.setAttribute('aria-hidden', m.classList.contains('is-open') ? 'false' : 'true');
    });
  }

  function bindOpeners() {
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        lastTrigger = btn;
        openModal(btn.getAttribute('data-modal-open'));
      });
    });
  }

  function getFocusable(root) {
    return Array.from(root.querySelectorAll(
      'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled'));
  }

  function trapFocus(container, e) {
    const nodes = getFocusable(container);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  function openModal(id) {
    const entry = modals.get(id);
    if (!entry) return console.warn('Modal not found:', id);
    document.querySelectorAll('.modal.is-open').forEach(m => m.classList.remove('is-open'));

    entry.modal.classList.add('is-open');
    entry.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    setTimeout(() => {
      const focusable = getFocusable(entry.modal);
      (focusable[0] || entry.panel).focus();
    }, 0);
  }

  function closeModal(id) {
    const entry = modals.get(id);
    if (!entry) return;
    entry.modal.classList.remove('is-open');
    entry.modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.is-open')) document.body.classList.remove('modal-open');
    if (lastTrigger && document.body.contains(lastTrigger)) lastTrigger.focus();
  }

  // expose legacy helpers so inline onclick still works
  window.openModal = openModal;
  window.closeModal = closeModal;

  // ESC + focus trap
  document.addEventListener('keydown', e => {
    const open = document.querySelector('.modal.is-open');
    if (!open) return;
    if (e.key === 'Escape') closeModal(open.id);
    if (e.key === 'Tab') trapFocus(open, e);
  });

  // init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { registerModals(); bindOpeners(); });
  } else { registerModals(); bindOpeners(); }
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
// Simple modal controller for <div class="modal"> pattern
document.addEventListener('DOMContentLoaded', () => {
  const openers = document.querySelectorAll('[data-modal-target]');
  const body = document.body;

  const openModal = (modal) => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    body.style.overflow = 'hidden';
    const panel = modal.querySelector('.modal__panel');
    if (panel) panel.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-open');
    body.style.overflow = '';
  };

  openers.forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-modal-target');
      openModal(document.querySelector(sel));
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-modal-close]')) {
      closeModal(e.target.closest('.modal'));
    }
    if (e.target.classList.contains('modal__backdrop')) {
      closeModal(e.target.closest('.modal'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.is-open').forEach(closeModal);
    }
  });
});
// Simple modal toggler (works for all cards)
document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-modal]');
  if (openBtn) {
    const id = openBtn.getAttribute('data-modal');
    const modal = document.getElementById(id);
    if (modal) modal.removeAttribute('aria-hidden');
  }

  const closeBtn = e.target.closest('[data-modal-close]');
  if (closeBtn) {
    closeBtn.closest('.modal')?.setAttribute('aria-hidden', 'true');
  }
});

