/* ============================================================
   AVNISH SINGH — PACS IMPLEMENTATION ENGINEER PORTFOLIO
   script.js — Interactions, Animations & Utilities
   ============================================================ */

/* ── PAGE LOADER ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 900);
});

/* ── NAVBAR: scroll state & active section ─────────────────── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  /* Scrolled state */
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  /* Active link highlighting */
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });

  /* Scroll-to-top button */
  const btn = document.getElementById('scroll-top');
  btn.classList.toggle('visible', window.scrollY > 400);
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ── MOBILE NAV ─────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── DARK / LIGHT TOGGLE ────────────────────────────────────── */
const themeBtn  = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
let isLight = false;

themeBtn.addEventListener('click', () => {
  isLight = !isLight;
  document.body.classList.toggle('light', isLight);
  themeIcon.textContent = isLight ? '🌙' : '☀️';
});

/* ── SCROLL-TO-TOP ──────────────────────────────────────────── */
document.getElementById('scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── TYPING ANIMATION ───────────────────────────────────────── */
const roles = [
  'PACS Implementation/ Service Engineer',
  'DICOM/ Modalities Integrations',
  'HL7 & Mirth Connect Expert',
  'Radiology Workflow Architect'
];

let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const word = roles[rIdx];

  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 50 : 80);
}

/* Start typing after loader */
setTimeout(type, 1200);

/* ── REVEAL ON SCROLL ───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      /* Staggered children if data-stagger */
      const stagger = e.target.dataset.stagger;
      if (stagger) {
        e.target.querySelectorAll(':scope > *').forEach((child, i) => {
          child.style.transitionDelay = `${i * Number(stagger)}ms`;
          child.classList.add('visible');
        });
      }
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── ANIMATED SKILL BARS ────────────────────────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach(bar => {
        const target = bar.dataset.width;
        setTimeout(() => { bar.style.width = target; }, 150);
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ── CONTACT FORM VALIDATION ────────────────────────────────── */
const contactForm = document.getElementById('contact-form');

function validateField(group, value, pattern) {
  const valid = value.trim() && (!pattern || pattern.test(value.trim()));
  group.classList.toggle('error', !valid);
  return valid;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameGroup  = document.getElementById('fg-name');
  const emailGroup = document.getElementById('fg-email');
  const subjGroup  = document.getElementById('fg-subject');
  const msgGroup   = document.getElementById('fg-message');

  const name    = document.getElementById('c-name').value;
  const email   = document.getElementById('c-email').value;
  const subject = document.getElementById('c-subject').value;
  const message = document.getElementById('c-message').value;

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const ok = [
    validateField(nameGroup,  name,    null),
    validateField(emailGroup, email,   emailRx),
    validateField(subjGroup,  subject, null),
    validateField(msgGroup,   message, null)
  ].every(Boolean);

  if (ok) {
    const success = document.getElementById('form-success');
    contactForm.style.display = 'none';
    success.classList.add('visible');
  }
});

/* Clear error on input */
document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.closest('.form-group')?.classList.remove('error');
  });
});

/* ── SMOOTH SCROLL for ALL anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── COUNTER ANIMATION in hero stats ────────────────────────── */
function animateCounter(el, end, suffix = '') {
  const dur = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * end) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const val  = parseInt(el.dataset.val);
        const suf  = el.dataset.suffix || '';
        animateCounter(el, val, suf);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
