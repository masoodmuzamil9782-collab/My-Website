/* =============================================================================
 *  interactions.js  —  pointer + click behaviour
 *    magnetic buttons · card tilt · work accordion · capability accordion
 *    email copy · live clock · mobile menu · motion toggle
 * ========================================================================== */
import { gsap } from 'gsap';

export function initInteractions({ content, reducedMotion }) {
  if (!reducedMotion) {
    magnetic();
    tilt();
    portraitFx();
  }
  workAccordion();
  capAccordion();
  emailCopy();
  liveClock(content.profile.timezone);
  mobileMenu();
  motionToggle();
}

/* ------------------------------------------------------------- magnetic */
function magnetic() {
  const strength = 0.35;
  document.querySelectorAll('[data-magnetic]').forEach((elm) => {
    const label = elm.querySelector('span') || elm;
    elm.addEventListener('mousemove', (e) => {
      const r = elm.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      gsap.to(elm, { x: mx * strength, y: my * strength, duration: 0.6, ease: 'power3.out' });
      gsap.to(label, { x: mx * strength * 0.4, y: my * strength * 0.4, duration: 0.6, ease: 'power3.out' });
    });
    elm.addEventListener('mouseleave', () => {
      gsap.to([elm, label], { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ------------------------------------------------------------- tilt */
function tilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach((elm) => {
    const max = 8;
    elm.addEventListener('mousemove', (e) => {
      const r = elm.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(elm, {
        rotateY: px * max,
        rotateX: -py * max,
        transformPerspective: 900,
        transformOrigin: 'center',
        duration: 0.6,
        ease: 'power2.out',
      });
    });
    elm.addEventListener('mouseleave', () => {
      gsap.to(elm, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ------------------------------------------------------------- work accordion */
function workAccordion() {
  const items = document.querySelectorAll('.work-item');
  const toggle = (item) => {
    const open = item.classList.contains('is-open');
    items.forEach((i) => i.classList.remove('is-open'));
    if (!open) item.classList.add('is-open');
  };
  items.forEach((item) => {
    item.addEventListener('click', () => toggle(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(item);
      }
    });
  });
}

/* ------------------------------------------------------------- capability accordion */
function capAccordion() {
  const caps = document.querySelectorAll('.cap');
  const toggle = (cap) => {
    const open = cap.classList.contains('is-open');
    caps.forEach((c) => c.classList.remove('is-open'));
    if (!open) cap.classList.add('is-open');
  };
  caps.forEach((cap) => {
    cap.addEventListener('click', () => toggle(cap));
    cap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(cap);
      }
    });
  });
}

/* ------------------------------------------------------------- email copy */
function emailCopy() {
  const btn = document.getElementById('mailButton');
  if (!btn) return;
  btn.addEventListener('click', async (e) => {
    const email = btn.querySelector('span')?.textContent?.trim();
    if (!email) return;
    // let the mailto: still work on a second click, but copy first
    if (!btn.classList.contains('is-copied')) {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        window.location.href = btn.getAttribute('href');
        return;
      }
      btn.classList.add('is-copied');
      setTimeout(() => btn.classList.remove('is-copied'), 2200);
    }
  });
}

/* ------------------------------------------------------------- live clock */
function liveClock(tz) {
  const elClock = document.getElementById('localClock');
  if (!elClock) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: tz || undefined,
  });
  const tick = () => {
    try {
      elClock.textContent = fmt.format(new Date());
    } catch {
      elClock.textContent = new Date().toLocaleTimeString();
    }
  };
  tick();
  setInterval(tick, 1000);
}

/* ------------------------------------------------------------- mobile menu */
function mobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
  });
  menu.querySelectorAll('[data-menu-link]').forEach((a) =>
    a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ------------------------------------------------------------- motion toggle */
function motionToggle() {
  const btn = document.getElementById('toggleMotion');
  if (!btn) return;
  const sync = () => {
    const reduced = document.body.getAttribute('data-motion') === 'reduced';
    btn.textContent = reduced ? 'enable motion' : 'reduce motion';
  };
  sync();
  btn.addEventListener('click', () => {
    const reduced = document.body.getAttribute('data-motion') === 'reduced';
    if (reduced) {
      document.body.removeAttribute('data-motion');
      localStorage.removeItem('maddy-motion');
    } else {
      document.body.setAttribute('data-motion', 'reduced');
      localStorage.setItem('maddy-motion', 'reduced');
    }
    sync();
    setTimeout(() => window.location.reload(), 120);
  });
}

/* ------------------------------------------------------------- portrait FX
 * Lightweight animated gradient sheen drawn onto the portrait canvas,
 * blended over Maddy's photo for a subtle "scanning" neon effect. */
function portraitFx() {
  const canvas = document.getElementById('portraitFx');
  const reduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.body.getAttribute('data-motion') === 'reduced';
  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');
  let raf;
  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  const draw = () => {
    t += 0.006;
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    const y = (Math.sin(t) * 0.5 + 0.5) * h;
    const g = ctx.createLinearGradient(0, y - 120, 0, y + 120);
    g.addColorStop(0, 'rgba(47,107,255,0)');
    g.addColorStop(0.5, 'rgba(47,107,255,0.24)');
    g.addColorStop(1, 'rgba(93,185,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // faint moving contour lines
    ctx.strokeStyle = 'rgba(93,185,255,0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const yy = ((t * 40 + i * (h / 5)) % h);
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(w, yy + Math.sin(t + i) * 12);
      ctx.stroke();
    }
    raf = requestAnimationFrame(draw);
  };
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}
