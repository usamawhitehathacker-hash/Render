/* ============================================
   PRADA — Landing Page Interactions
   ============================================ */

// ---- Side Menu ----
const menuBtn = document.getElementById('menuBtn');
const menuClose = document.getElementById('menuClose');
const sidemenu = document.getElementById('sidemenu');
const backdrop = document.getElementById('backdrop');

function openMenu() {
  sidemenu.classList.add('open');
  backdrop.classList.add('open');
  sidemenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  sidemenu.classList.remove('open');
  backdrop.classList.remove('open');
  sidemenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
menuBtn?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
backdrop?.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Close menu on link click
sidemenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

// ---- Nav condense on scroll ----
const nav = document.getElementById('nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 40) {
    nav.style.padding = '';
    nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.04)';
  } else {
    nav.style.boxShadow = '';
  }
  lastY = y;
});

// ---- Reveal on scroll ----
const revealTargets = document.querySelectorAll(
  '.split, .section-head, .card, .world__item, .editorial__content, .newsletter__inner'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealTargets.forEach((el) => io.observe(el));

// ---- Smooth-scroll for same-page anchors ----
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ---- Tiny parallax on hero image ----
const heroImg = document.querySelector('.hero__media img');
if (heroImg && window.matchMedia('(min-width: 900px)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `scale(1.04) translateY(${y * 0.15}px)`;
    }
  }, { passive: true });
}
