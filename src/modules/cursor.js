/* =============================================================================
 *  cursor.js  —  trailing dot + ring with contextual label
 * ========================================================================== */
import { gsap } from 'gsap';

export function initCursor() {
  const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.getElementById('cursor');
  if (!isFine || !root) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const text = document.getElementById('cursorText');

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...mouse };

  const xSet = gsap.quickSetter(dot, 'x', 'px');
  const ySet = gsap.quickSetter(dot, 'y', 'px');
  const rxSet = gsap.quickSetter(ring, 'x', 'px');
  const rySet = gsap.quickSetter(ring, 'y', 'px');

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    xSet(e.clientX);
    ySet(e.clientY);
  });

  gsap.ticker.add(() => {
    ringPos.x += (mouse.x - ringPos.x) * 0.18;
    ringPos.y += (mouse.y - ringPos.y) * 0.18;
    rxSet(ringPos.x);
    rySet(ringPos.y);
  });

  window.addEventListener('mousedown', () => root.classList.add('is-down'));
  window.addEventListener('mouseup', () => root.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => gsap.to(root, { autoAlpha: 0, duration: 0.2 }));
  document.addEventListener('mouseenter', () => gsap.to(root, { autoAlpha: 1, duration: 0.2 }));

  const HOVER_SEL = 'a, button, [data-cursor], [data-magnetic], input, .cap, .work-item, .cert';

  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest(HOVER_SEL);
    if (!t) return;
    root.classList.add('is-hover');
    const label = t.dataset.cursor || '';
    if (text) text.textContent = label;
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target.closest(HOVER_SEL);
    if (!t) return;
    const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOVER_SEL);
    if (to) return;
    root.classList.remove('is-hover');
    if (text) text.textContent = '';
  });
}
