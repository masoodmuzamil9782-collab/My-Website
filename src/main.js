/* =============================================================================
 *  main.js  —  boot sequence
 *  Nothing here needs editing. Content lives in src/content.js
 * ========================================================================== */
import './styles/main.css';
import 'lenis/dist/lenis.css';

import { content } from './content.js';
import { renderContent } from './modules/render.js';
import { initPreloader } from './modules/preloader.js';
import { initScroll } from './modules/scroll.js';
import { initCursor } from './modules/cursor.js';
import { initInteractions } from './modules/interactions.js';
import { initAnimations } from './modules/animations.js';
import { initWebGL } from './three/scene.js';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const savedMotion = localStorage.getItem('maddy-motion');
const reducedMotion = prefersReduced || savedMotion === 'reduced';

if (reducedMotion) document.body.setAttribute('data-motion', 'reduced');
document.body.classList.add('is-loading');

/* 1. Inject all copy / lists from content.js into the DOM */
renderContent(content);

/* 2. Custom cursor (desktop only, handled inside) */
initCursor();

/* 3. Smooth scroll + ScrollTrigger sync + nav behaviour + progress bar */
const scroll = initScroll({ reducedMotion });

/* 4. WebGL hero scene — skipped entirely when motion is reduced */
let webgl = null;
if (!reducedMotion) {
  webgl = initWebGL({ canvas: document.getElementById('webgl') });
}

/* 5. All hover / click / drag interactions */
initInteractions({ content, scroll, reducedMotion });

/* 6. Scroll-driven + entrance animations (GSAP) */
initAnimations({ content, reducedMotion });

/* 7. Preloader hands off to the intro animation, then reveals everything */
initPreloader({
  reducedMotion,
  onComplete() {
    document.body.classList.remove('is-loading');
    document.getElementById('webgl')?.classList.add('is-ready');
    webgl?.start();
    window.dispatchEvent(new CustomEvent('maddy:intro'));
    if (scroll?.refresh) setTimeout(scroll.refresh, 300);
  },
});

/* Expose a tiny debug handle */
window.__maddy = { content, scroll, webgl };
