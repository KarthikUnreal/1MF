// ── LAUFBAHN SHARED JS v5 ──

// ── SCROLL RESTORATION: always start at top ──
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ── BINDER HOLES ──
function buildBinder() {
  document.querySelectorAll('.binder-hole').forEach(e => e.remove());
  const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  for (let y = 80; y < h; y += 180) {
    const hole = document.createElement('div');
    hole.className = 'binder-hole';
    hole.style.top = y + 'px';
    document.body.appendChild(hole);
  }
}

// ── PROGRESS BAR ──
const progBar = document.getElementById('progress-bar');
if (progBar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progBar.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });
}

// ── NAV SCROLL ──
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── STAGE TRACKER ──
const tracker = document.getElementById('stage-tracker');
if (tracker) {
  window.addEventListener('scroll', () => {
    tracker.classList.toggle('visible', window.scrollY > 200);
  }, { passive: true });
}

// ── BACK TO TOP ──
const backTop = document.getElementById('back-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
}

// ── REVEAL ON SCROLL ──
function checkReveal(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.98 && rect.bottom > 0;
}

function runReveal() {
  document.querySelectorAll('.reveal:not(.seen)').forEach(el => {
    if (checkReveal(el)) el.classList.add('seen');
  });
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('seen');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── MARGIN NOTES ──
const ioMargin = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.3 });
document.querySelectorAll('.margin-note').forEach(el => ioMargin.observe(el));

// ── BLUEPRINT PAGE LOAD REVEAL ──
const revealOverlay = document.getElementById('blueprint-reveal');
if (revealOverlay) {
  // Trigger reveals immediately once overlay is gone
  setTimeout(() => {
    revealOverlay.classList.add('done');
    runReveal(); // show everything currently in viewport
    setTimeout(() => revealOverlay.remove(), 600);
  }, 1500);
}

// ── HERO UNDERLINE ──
const heroBp = document.getElementById('hero-bp');
if (heroBp) {
  const ioHero = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) heroBp.classList.add('seen'); });
  }, { threshold: 0.5 });
  ioHero.observe(heroBp);
}

// ── SKILL BARS ──
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(fill => {
    const id = fill.id;
    const valEl = document.getElementById(id + '-val');
    const target = parseInt(fill.dataset.target || 0);
    fill.style.width = target + '%';
    let cur = 0;
    const interval = setInterval(() => {
      cur = Math.min(cur + 2, target);
      if (valEl) valEl.textContent = cur + '%';
      if (cur >= target) clearInterval(interval);
    }, 18);
  });
}
const profileMock = document.getElementById('profile-mock');
if (profileMock) {
  const ioProfile = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateSkills(); ioProfile.unobserve(e.target); } });
  }, { threshold: 0.3 });
  ioProfile.observe(profileMock);
}

// ── TWEAKS PANEL ──
let tweaksOpen = false;
window.toggleTweaks = function() {
  tweaksOpen = !tweaksOpen;
  document.getElementById('tweaks').classList.toggle('collapsed', !tweaksOpen);
  document.getElementById('tweaks-arrow').textContent = tweaksOpen ? '▼' : '▲';
};
window.setAccent = function(light, dark, el) {
  document.querySelectorAll('.accent-dot').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.style.setProperty('--accent', isDark ? dark : light);
};
window.setDensity = function(mode, btn) {
  document.querySelectorAll('#density-seg button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('section').forEach(s => {
    s.style.paddingTop = mode === 'compact' ? '40px' : '72px';
    s.style.paddingBottom = mode === 'compact' ? '40px' : '72px';
  });
};

// ── EASTER EGG ──
const eggModal = document.getElementById('egg-modal');
window.openEgg = function() { if (eggModal) eggModal.classList.add('open'); };
window.closeEgg = function() { if (eggModal) eggModal.classList.remove('open'); };

// ── QUIZ ──
const quizModal = document.getElementById('quiz-modal');
window.openQuiz = function() { if (quizModal) quizModal.classList.add('open'); };
window.closeQuiz = function() { if (quizModal) quizModal.classList.remove('open'); };

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input,textarea,[contenteditable]')) return;
  if (e.key === 'f' || e.key === 'F') window.openEgg();
  if (e.key === 'Escape') { window.closeEgg(); window.closeQuiz(); }
  if (e.key === 'q' || e.key === 'Q') window.openQuiz();
});

// ── DATES ──
const fmtDate = (d) => d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase();
const today = new Date();
document.querySelectorAll('.auto-date').forEach(el => el.textContent = fmtDate(today));

// ── INIT ──
buildBinder();
window.addEventListener('resize', buildBinder);
new ResizeObserver(buildBinder).observe(document.body);

// Run reveal check immediately + on scroll
window.addEventListener('scroll', runReveal, { passive: true });

// Run after fonts and layout settle
window.addEventListener('load', () => {
  runReveal();
  buildBinder();
});

// Fallback: run after short delay
setTimeout(runReveal, 200);
setTimeout(runReveal, 800);
