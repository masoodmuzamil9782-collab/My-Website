/* =============================================================================
 *  scroll.js  —  Lenis smooth scroll + GSAP ScrollTrigger sync
 *                + progress bar + nav show/hide + active-link spy
 * ========================================================================== */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScroll({ reducedMotion }) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reducedMotion,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ---- progress bar ---- */
  const progress = document.getElementById('scrollProgress');
  /* ---- nav ---- */
  const nav = document.getElementById('nav');
  let lastY = 0;

  lenis.on('scroll', ({ scroll, limit }) => {
    const p = limit > 0 ? scroll / limit : 0;
    if (progress) progress.style.width = (p * 100).toFixed(2) + '%';

    if (nav) {
      nav.classList.toggle('is-solid', scroll > 40);
      if (scroll > lastY && scroll > 400) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
    }
    lastY = scroll;
  });

  /* ---- anchor links go through Lenis ---- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      document.body.classList.remove('menu-open');
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    });
  });

  /* ---- active section spy for nav links ---- */
  const linkFor = {};
  document.querySelectorAll('[data-nav-link]').forEach((l) => {
    linkFor[l.getAttribute('href').slice(1)] = l;
  });
  ['work', 'capabilities', 'about', 'process'].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec || !linkFor[id]) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => linkFor[id].classList.toggle('is-active', self.isActive),
    });
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh());

  return {
    lenis,
    refresh: () => ScrollTrigger.refresh(),
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    scrollTo: (t, o) => lenis.scrollTo(t, o),
  };
}
