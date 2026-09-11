/* =============================================================================
 *  animations.js  —  entrance + scroll-driven motion
 *    · hero headline split reveal + role scramble
 *    · [data-reveal]  fade/translate on enter
 *    · [data-lines]   masked line reveal for headings
 *    · [data-count-to] animated counters
 *    · [data-marquee] velocity-reactive infinite strip
 *
 *  Principle: the page is fully visible with no JS. Hidden states are applied
 *  by gsap.set() at init (synchronously), never by resting CSS — so a slow or
 *  broken script can never leave content invisible.
 * ========================================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations({ reducedMotion }) {
  if (reducedMotion) {
    document.querySelectorAll('[data-count-to]').forEach((elm) => {
      elm.innerHTML =
        (elm.dataset.countPrefix || '') +
        elm.dataset.countTo +
        `<span class="u">${elm.dataset.countSuffix || ''}</span>`;
    });
    return; // everything already visible; no marquee motion
  }

  heroIntro();
  genericReveals();
  lineReveals();
  counters();
  initMarquee();

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* ------------------------------------------------------------------ hero */
function heroIntro() {
  const splitTargets = document.querySelectorAll('.hero__title [data-split]');
  splitTargets.forEach((elm) => new SplitType(elm, { types: 'chars', tagName: 'span' }));

  const chars = document.querySelectorAll('.hero__title .char');
  gsap.set(chars, { yPercent: 120 });
  gsap.set(['.hero__eyebrow', '.hero__lede', '.hero__role', '.hero__actions'], {
    y: 26,
    autoAlpha: 0,
  });
  gsap.set(['.hero__scroll', '.hero__side'], { autoAlpha: 0 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  tl.to(chars, {
    yPercent: 0,
    duration: 1.1,
    stagger: { each: 0.018, from: 'start' },
  })
    .to('.hero__eyebrow', { y: 0, autoAlpha: 1, duration: 0.8 }, 0.15)
    .to(
      ['.hero__lede', '.hero__role', '.hero__actions'],
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 },
      0.35
    )
    .to(['.hero__scroll', '.hero__side'], { autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 0.6);

  window.addEventListener(
    'maddy:intro',
    () => {
      tl.play();
      scramble(document.getElementById('roleScramble'));
    },
    { once: true }
  );

  // safety: if the intro event somehow never fires, reveal after 4s
  setTimeout(() => {
    if (tl.progress() === 0) tl.play();
  }, 4000);
}

/* ------------------------------------------------------- generic reveals */
function genericReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((elm) => {
    gsap.set(elm, { y: 30, autoAlpha: 0 });
    gsap.to(elm, {
      y: 0,
      autoAlpha: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: elm, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('[data-reveal-eyebrow]').forEach((elm) => {
    if (elm.closest('.hero')) return; // hero owns its own eyebrow
    gsap.set(elm, { y: 20, autoAlpha: 0 });
    gsap.to(elm, { y: 0, autoAlpha: 1, duration: 0.8, scrollTrigger: { trigger: elm, start: 'top 90%' } });
  });
}

/* -------------------------------------------------------- line reveals */
function lineReveals() {
  gsap.utils.toArray('[data-lines]').forEach((elm) => {
    const split = new SplitType(elm, { types: 'lines', tagName: 'span' });
    const inners = [];
    split.lines.forEach((line) => {
      const html = line.innerHTML;
      line.innerHTML = `<span class="line-mask"><span class="line-inner">${html}</span></span>`;
      inners.push(line.querySelector('.line-inner'));
    });
    gsap.set(inners, { yPercent: 110 });
    gsap.to(inners, {
      yPercent: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: elm, start: 'top 88%' },
    });
  });
}

/* -------------------------------------------------------------- counters */
function counters() {
  gsap.utils.toArray('[data-count-to]').forEach((elm) => {
    const to = parseFloat(elm.dataset.countTo);
    const decimals = parseInt(elm.dataset.countDecimals || '0', 10);
    const prefix = elm.dataset.countPrefix || '';
    const suffix = elm.dataset.countSuffix || '';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: elm,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: to,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            elm.innerHTML = prefix + obj.v.toFixed(decimals) + `<span class="u">${suffix}</span>`;
          },
        }),
    });
  });
}

/* ------------------------------------------------------------------ scramble
 * Time-based (not frame-based) so it always finishes in ~0.75s and never
 * gets stuck looking like garbage on a slow device. */
function scramble(elm) {
  if (!elm) return;
  const finalText = elm.dataset.finalText || elm.textContent;
  elm.dataset.finalText = finalText;
  const glyphs = '01<>-_/[]{}=+*#%$ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DURATION = 750;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / DURATION);
    const reveal = Math.floor(p * finalText.length);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ') out += ' ';
      else if (i < reveal) out += finalText[i];
      else out += glyphs[(Math.random() * glyphs.length) | 0];
    }
    elm.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else elm.textContent = finalText;
  };
  requestAnimationFrame(step);
}

/* ------------------------------------------------------------------ marquee */
function initMarquee() {
  document.querySelectorAll('[data-marquee]').forEach((track) => {
    const base = parseFloat(track.dataset.marqueeSpeed || '1');
    let x = 0;
    let vel = 0;
    let dir = -1;

    window.addEventListener(
      'wheel',
      (e) => {
        vel += Math.sign(e.deltaY) * 0.6;
        dir = e.deltaY > 0 ? -1 : 1;
      },
      { passive: true }
    );

    const groupWidth = () => track.firstElementChild?.offsetWidth || 0;

    const loop = () => {
      vel *= 0.9;
      x += base * dir + vel;
      const w = groupWidth();
      if (w > 0) {
        if (x <= -w) x += w;
        if (x >= 0) x -= w;
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      requestAnimationFrame(loop);
    };
    loop();
  });
}
