/* ===== Domé Soul — unified, accessible UI ===== */

/* 1) Nav toggle (mobile) */
(() => {
  const btn = document.querySelector('.nav-toggle');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

/* 2) Modals (data-modal-target="#id", [data-modal-close], backdrop click, Esc, focus trap) */
(() => {
  const body = document.body;
  const focusables = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';
  function open(modal){ if(!modal) return;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); body.classList.add('modal-open');
    const panel = modal.querySelector('.modal__panel') || modal; panel.setAttribute('tabindex','-1'); panel.focus();
  }
  function close(modal){ if(!modal) return;
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true');
    if(!document.querySelector('.modal.is-open')) body.classList.remove('modal-open');
  }
  document.addEventListener('click',(e)=>{
    const opener = e.target.closest('[data-modal-target]');
    if(opener){ open(document.querySelector(opener.getAttribute('data-modal-target'))); }
    if(e.target.closest('[data-modal-close]')){ close(e.target.closest('.modal')); }
    if(e.target.classList.contains('modal__backdrop')){ close(e.target.closest('.modal')); }
  });
  document.addEventListener('keydown',(e)=>{
    const m = document.querySelector('.modal.is-open'); if(!m) return;
    if(e.key==='Escape') close(m);
    if(e.key==='Tab'){ const nodes=[...m.querySelectorAll(focusables)].filter(n=>!n.disabled);
      const first=nodes[0], last=nodes[nodes.length-1];
      if(e.shiftKey && document.activeElement===first){ last.focus(); e.preventDefault(); }
      if(!e.shiftKey && document.activeElement===last){ first.focus(); e.preventDefault(); }
    }
  });
})();

/* 3) Reveal-on-scroll (staggered) */
(() => {
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.reveal, .reveal-stagger > *');
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('is-visible'); obs.unobserve(en.target); }
    });
  }, { threshold: .12 });
  targets.forEach((el,i)=>{ el.style.setProperty('--reveal-delay', `${60 + i*60}ms`); io.observe(el); });
})();

/* 4) Audio preview (one-at-a-time) */
(() => {
  const toggles = document.querySelectorAll('.ds-audio-toggle'); if(!toggles.length) return;
  const labelDefault = '▶ Preview (0:30)'; let current=null, currentBtn=null;
  function stopAll(){ if(current){ current.pause(); current.currentTime=0; if(currentBtn){ currentBtn.textContent=labelDefault; currentBtn.classList.remove('is-playing'); } current=null; currentBtn=null; } }
  toggles.forEach(btn=>{
    const audio = document.getElementById(btn.dataset.audio); if(!audio) return;
    if(!btn.textContent.trim()) btn.textContent = labelDefault;
    btn.addEventListener('click', ()=>{
      if(current===audio && !audio.paused){ stopAll(); return; }
      stopAll(); audio.play().catch(()=>{}); current=audio; currentBtn=btn; btn.textContent='⏸ Pause'; btn.classList.add('is-playing');
    });
    audio.addEventListener('ended', stopAll);
  });
})();

/* 5) Newsletter / Contact forms (Formspree) */
(() => {
  document.querySelectorAll('form[action*="formspree.io"]').forEach(form=>{
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const pot = form.querySelector('input[name="_gotcha"]'); if(pot && pot.value) return;
      if(status){ status.hidden=false; status.className='form-status'; status.textContent='Sending…'; }
      try{
        const res = await fetch(form.action, { method:'POST', headers:{'Accept':'application/json'}, body:new FormData(form) });
        if(res.ok){ form.reset(); if(status){ status.classList.add('success'); status.textContent='Done! Check your inbox for confirmation.'; } }
        else { if(status){ status.classList.add('error'); status.textContent='Something went wrong. Try again.'; } }
      }catch{ if(status){ status.classList.add('error'); status.textContent='Network error. Try again.'; } }
    });
  });
})();

/* 6) Year in footer */
(() => { const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); })();
// Auto-apply AOS animations to common blocks
document.addEventListener('DOMContentLoaded', () => {
  const map = [
    ['.hero', 'fade-up'],
    ['.feature-hero__wrap', 'fade-up'],
    ['.music-card', 'fade-up'],
    ['.story-card', 'fade-up'],
    ['.press-card', 'fade-up'],
    ['.donate-card', 'fade-up'],
    ['.newsletter', 'zoom-in'],
    ['.social-tiles .tile', 'fade-up']
  ];
  map.forEach(([sel, effect]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.getAttribute('data-aos')) {
        el.setAttribute('data-aos', effect);
        el.setAttribute('data-aos-delay', String(50 + i * 60));
      }
    });
  });
});
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if ((path === '' && href === 'index.html') || href === path) a.classList.add('active');
  });
})();
<script>
(function(){
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){ en.target.classList.add('is-visible'); obs.unobserve(en.target); }
    });
  }, { threshold:.12 });
  els.forEach(el=>io.observe(el));
})();
</script>

