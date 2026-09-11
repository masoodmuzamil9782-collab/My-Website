/* =============================================================================
 *  preloader.js  —  0→100 count, name reveal, curtain lift
 * ========================================================================== */
import { gsap } from 'gsap';

export function initPreloader({ onComplete, reducedMotion }) {
  const root = document.getElementById('preloader');
  const countEl = document.getElementById('preloadCount');
  const barEl = document.getElementById('preloadBar');
  const labelEl = document.querySelector('[data-preload-label]');
  const nameSpans = document.querySelectorAll('[data-preload-name] span');

  if (!root) {
    onComplete?.();
    return;
  }

  const finish = () => {
    onComplete?.();
  };

  if (reducedMotion) {
    gsap.set(nameSpans, { y: 0, opacity: 1 });
    gsap.to(root, {
      autoAlpha: 0,
      duration: 0.4,
      onComplete: () => {
        root.remove();
        finish();
      },
    });
    return;
  }

  const state = { n: 0 };
  const phases = [
    [0, 35, 'Loading assets'],
    [35, 68, 'Compiling shaders'],
    [68, 92, 'Warming the pixels'],
    [92, 100, 'Ready'],
  ];

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      root.remove();
      finish();
    },
  });

  phases.forEach(([from, to, label], i) => {
    tl.to(state, {
      n: to,
      duration: 0.5 + Math.random() * 0.5,
      ease: 'power1.inOut',
      onStart: () => {
        if (labelEl) labelEl.textContent = label;
      },
      onUpdate: () => {
        const v = Math.round(state.n);
        if (countEl) countEl.textContent = v;
        if (barEl) barEl.style.width = v + '%';
      },
    }, i === 0 ? 0 : '+=0.05');
  });

  tl.to(nameSpans, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.06,
    ease: 'expo.out',
  }, '-=0.5');

  tl.to({}, { duration: 0.35 });

  tl.to(root.querySelector('.preloader__inner'), {
    y: -40,
    autoAlpha: 0,
    duration: 0.6,
    ease: 'power3.in',
  });

  tl.to(root, {
    yPercent: -100,
    duration: 0.9,
    ease: 'expo.inOut',
  }, '-=0.2');
}
