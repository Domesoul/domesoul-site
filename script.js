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
// ===== Scroll-triggered reveal (IntersectionObserver) =====
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // respect accessibility

  // Pick elements to reveal on scroll
  const targets = document.querySelectorAll([
    // Hero CTAs, Featured buttons, Quick-link pills
    '.hero .ds-btn',
    '.featured-mini .btn',
    '.ds-quick-links .ds-pill',
    // Any section cards or items you want to reveal
    '.cards-grid .card',
    // Footer icons (will trigger when footer enters view)
    '.footer-socials .social-icon'
  ].join(','));

  // Initialize state
  targets.forEach((el, i) => {
    el.classList.add('reveal-init'); // hidden state
    // tiny built-in stagger via CSS variable
    el.style.setProperty('--reveal-delay', `${60 + i * 70}ms`);
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        entry.target.classList.remove('reveal-init');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => io.observe(el));
})();
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const extra = document.querySelectorAll([
    '.footer',
    '.footer .footer-social h3',
    '.footer-divider',
    '.footer-bottom'
  ].join(','));

  let baseDelay = 80;
  extra.forEach((el, i) => {
    el.classList.add('reveal-init');
    el.style.setProperty('--reveal-delay', `${baseDelay + i * 90}ms`);
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        entry.target.classList.remove('reveal-init');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  extra.forEach(el => io.observe(el));
})();
// ===== Inline audio previews (one-at-a-time) =====
(() => {
  const toggles = document.querySelectorAll('.ds-audio-toggle');
  if (!toggles.length) return;

  const allAudios = Array.from(document.querySelectorAll('audio'));
  const labelDefault = '▶ Preview (0:30)';

  function resetOthers(except) {
    allAudios.forEach(a => {
      if (a !== except) {
        a.pause();
        a.currentTime = 0;
        const btn = document.querySelector(`.ds-audio-toggle[data-audio="${a.id}"]`);
        if (btn) btn.classList.remove('is-playing'), btn.textContent = labelDefault;
      }
    });
  }

  toggles.forEach(btn => {
    const id = btn.dataset.audio;
    const audio = document.getElementById(id);
    if (!audio) return;

    // ensure initial label
    if (!btn.textContent.trim()) btn.textContent = labelDefault;

    btn.addEventListener('click', () => {
      if (audio.paused) {
        resetOthers(audio);
        audio.play().catch(()=>{ /* ignore autoplay errors */ });
        btn.classList.add('is-playing');
        btn.textContent = '⏸ Pause';
      } else {
        audio.pause();
        btn.classList.remove('is-playing');
        btn.textContent = labelDefault;
      }
    });

    audio.addEventListener('ended', () => {
      btn.classList.remove('is-playing');
      btn.textContent = labelDefault;
    });
  });
})();

// ===== Modal deep-linking: ?modal=<id or alias> =====
(() => {
  const params = new URLSearchParams(location.search);
  const q = params.get('modal');
  if (!q) return;

  // Accept raw element id OR short alias; map aliases to your actual modal ids
  const aliasMap = {
    'wtll-lyrics': 'lyricsLight',
    'wtll-story': 'wtllStory',
    'heaven-lyrics': 'lyricsHeaven',
    'heaven-story': 'storyHeaven',
    'siwly-lyrics': 'lyricsLove',
    'siwly-story': 'storyLove'
  };

  const targetId = aliasMap[q] || q; // try alias, else use given string as id
  const modal = document.getElementById(targetId);
  if (!modal) return;

  // Your site likely opens modals by toggling a class; do the same:
  modal.classList.add('is-open');

  // Optional: focus the panel for accessibility
  const panel = modal.querySelector('.modal__panel');
  if (panel) panel.setAttribute('tabindex', '-1'), panel.focus();

  // Close handlers for backdrop/X buttons (if not already wired)
  const closers = modal.querySelectorAll('[data-modal-close], .modal__backdrop');
  closers.forEach(el => el.addEventListener('click', () => modal.classList.remove('is-open'), { once: true }));
})();
// Focus trap for modals (enhanced a11y)
(function () {
  const focusable = 'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function trapFocus(modal) {
    const nodes = Array.from(modal.querySelectorAll(focusable));
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];

    function handle(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    modal.__trapHandler = handle;
    modal.addEventListener('keydown', handle);
    first.focus();
  }
  function untrap(modal) {
    if (modal.__trapHandler) modal.removeEventListener('keydown', modal.__trapHandler);
  }

  window.DSopenModal = (id) => {
    const m = document.getElementById(id);
    if (!m) return;
    m.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    trapFocus(m);
  };
  window.DScloseModal = (modal) => {
    const m = typeof modal === 'string' ? document.getElementById(modal) : modal;
    if (!m) return;
    m.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    untrap(m);
  };

  // Wire data-modal buttons
  document.querySelectorAll('[data-modal]').forEach(btn=>{
    btn.addEventListener('click', ()=> DSopenModal(btn.dataset.modal));
  });
  document.querySelectorAll('[data-modal-close]').forEach(el=>{
    el.addEventListener('click', ()=> DScloseModal(el.closest('.modal')));
  });
})();

// Count-up on scroll
(() => {
  const nums = document.querySelectorAll('.impact__num');
  if (!nums.length) return;
  const io = new IntersectionObserver((entries,obs)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, target=+el.dataset.count || 0, dur=900, t0=performance.now();
      function tick(now){
        const p=Math.min(1,(now-t0)/dur);
        el.textContent = Math.round(target*p).toLocaleString();
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },{threshold:.35});
  nums.forEach(n=>io.observe(n));
})();
// Domé Soul — unified Formspree subscribe handlers (main + footer)
(function () {
  function wireForm(formId, statusId) {
    const form = document.getElementById(formId);
    const statusEl = document.getElementById(statusId);
    if (!form || !statusEl) return;

    function showStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.hidden = false;
      statusEl.className = 'form-status ' + (type || '');
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot
      const gotcha = form.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value) return;

      form.setAttribute('aria-busy', 'true');
      showStatus('Subscribing…', '');

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });

        if (res.ok) {
          form.reset();
          showStatus('You’re in! Check your inbox for a confirmation email.', 'success');
        } else {
          const j = await res.json().catch(() => ({}));
          const msg = (j && j.errors && j.errors[0] && j.errors[0].message) || 'Something went wrong. Please try again.';
          showStatus(msg, 'error');
        }
      } catch (err) {
        showStatus('Network error. Please try again.', 'error');
      } finally {
        form.removeAttribute('aria-busy');
      }
    });
  }

  // Wire up both forms if present (safe if one is missing)
  wireForm('ds-subscribe', 'ds-subscribe-status');
  wireForm('ds-footer-subscribe', 'ds-footer-subscribe-status');
})();
// Domé Soul — wire all Formspree newsletter forms on the page
(function () {
  const forms = Array.from(document.querySelectorAll('form#ds-subscribe, form#ds-footer-subscribe'));
  if (!forms.length) return;

  function wire(form){
    const statusEl = form.querySelector('.form-status');
    const showStatus = (msg, type) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.hidden = false;
      statusEl.className = 'form-status ' + (type || '');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const gotcha = form.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value) return; // bot

      form.setAttribute('aria-busy','true');
      showStatus('Subscribing…','');

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, { method:'POST', headers:{'Accept':'application/json'}, body:data });
        if (res.ok){
          form.reset();
          showStatus('You’re in! Check your inbox for a confirmation email.','success');
        } else {
          const j = await res.json().catch(()=>({}));
          const msg = (j && j.errors && j.errors[0] && j.errors[0].message) || 'Something went wrong. Please try again.';
          showStatus(msg, 'error');
        }
      } catch {
        showStatus('Network error. Please try again.','error');
      } finally {
        form.removeAttribute('aria-busy');
      }
    });
  }

  forms.forEach(wire);
})();

