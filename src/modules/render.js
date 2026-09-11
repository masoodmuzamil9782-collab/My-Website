/* =============================================================================
 *  render.js  —  turns content.js into DOM
 * ========================================================================== */

/** Resolve "a.b.c" against an object */
function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

/** Bind [data-content] text and [data-content-attr] attributes */
function bind(root, content) {
  root.querySelectorAll('[data-content]').forEach((el) => {
    const val = get(content, el.dataset.content);
    if (val != null && val !== '') el.textContent = val;
  });
  root.querySelectorAll('[data-content-attr]').forEach((el) => {
    // format: "href:profile.mailto" or "href:profile.mailto; title:profile.name"
    el.dataset.contentAttr.split(';').forEach((pair) => {
      const [attr, path] = pair.split(':').map((s) => s.trim());
      const val = get(content, path);
      if (attr && val != null) el.setAttribute(attr, val);
    });
  });
}

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

export function renderContent(content) {
  document.title = `${content.profile.name} — ${content.profile.role}`;

  /* ---- STRIP MARQUEE ---- */
  const stripHTML = content.strip.map((s) => `<span>${s}</span>`).join('');
  document.querySelectorAll('[data-marquee-content]').forEach((g) => {
    g.innerHTML = stripHTML;
  });

  /* ---- IMPACT / STATS ---- */
  const impact = document.getElementById('impactGrid');
  if (impact) {
    content.stats.forEach((s, i) => {
      const node = el('div', 'stat');
      node.dataset.reveal = 'stat';
      node.innerHTML = `
        <span class="stat__idx">S${String(i + 1).padStart(2, '0')}</span>
        <div class="stat__num"
             data-count-to="${s.value}"
             data-count-decimals="${s.decimals || 0}"
             data-count-prefix="${s.prefix || ''}"
             data-count-suffix="${s.suffix || ''}">
          ${s.prefix || ''}0<span class="u">${s.suffix || ''}</span>
        </div>
        <p class="stat__label">${s.label}</p>`;
      impact.appendChild(node);
    });
  }

  /* ---- SELECTED WORK ---- */
  const work = document.getElementById('workList');
  if (work) {
    content.projects.forEach((p, i) => {
      const item = el('article', 'work-item');
      item.dataset.reveal = 'work';
      item.tabIndex = 0;
      item.setAttribute('data-cursor', 'Open');
      item.innerHTML = `
        <div class="work-item__bg" aria-hidden="true"></div>
        <div class="work-item__main">
          <div class="work-item__top">
            <span>${String(i + 1).padStart(2, '0')}</span>
            <span class="cat">${p.category || ''}</span>
            <span>${p.year || ''}</span>
          </div>
          <h3 class="work-item__name">${p.name}</h3>
          <p class="work-item__client">${p.client}</p>
          <p class="work-item__summary">${p.summary || ''}</p>
          <div class="work-item__tags">
            ${(p.tags || []).map((t) => `<span>${t}</span>`).join('')}
          </div>
        </div>
        <div class="work-item__metric">
          <b>${p.metric || ''}</b>
          <span>${p.metricSub || ''}</span>
        </div>
        <span class="work-item__arrow" aria-hidden="true">&rarr;</span>`;
      work.appendChild(item);
    });
  }

  /* ---- CAPABILITIES ---- */
  const caps = document.getElementById('capsList');
  if (caps) {
    content.capabilities.forEach((c, i) => {
      const cap = el('div', 'cap');
      cap.dataset.reveal = 'cap';
      cap.tabIndex = 0;
      cap.setAttribute('data-cursor', 'More');
      cap.innerHTML = `
        <div class="cap__row">
          <span class="cap__idx">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="cap__title">${c.title}</h3>
          <span class="cap__plus" aria-hidden="true"></span>
        </div>
        <div class="cap__panel">
          <div class="cap__panel-inner">
            <p class="cap__desc">${c.desc}</p>
            <div class="cap__stack">
              ${(c.stack || []).map((s) => `<span>${s}</span>`).join('')}
            </div>
          </div>
        </div>`;
      caps.appendChild(cap);
    });
  }

  /* ---- ABOUT ---- */
  const aboutParas = document.getElementById('aboutParagraphs');
  if (aboutParas) {
    content.about.paragraphs.forEach((t) => {
      const p = el('p', null, t);
      p.dataset.reveal = 'para';
      aboutParas.appendChild(p);
    });
  }
  const aboutFacts = document.getElementById('aboutFacts');
  if (aboutFacts) {
    content.about.facts.forEach((f) => {
      aboutFacts.appendChild(el('li', null, `<b>${f.k}</b><span>${f.v}</span>`));
    });
  }

  /* ---- PROCESS ---- */
  const process = document.getElementById('processList');
  if (process) {
    content.process.forEach((s, i) => {
      const step = el('div', 'step');
      step.dataset.reveal = 'step';
      step.innerHTML = `
        <span class="step__num">0${i + 1} / 0${content.process.length}</span>
        <h3 class="step__title">${s.title}</h3>
        <p class="step__desc">${s.desc}</p>`;
      process.appendChild(step);
    });
  }

  /* ---- CERTIFICATES ---- */
  const certGrid = document.getElementById('certGrid');
  if (certGrid && Array.isArray(content.certificates)) {
    content.certificates.forEach((c, i) => {
      const node = el('article', 'cert');
      node.dataset.reveal = 'cert';
      node.innerHTML = `
        <span class="cert__idx">C${String(i + 1).padStart(2, '0')}</span>
        ${c.year ? `<span class="cert__year">${c.year}</span>` : ''}
        <h3 class="cert__title">${c.title}</h3>
        <p class="cert__note">${c.note || ''}</p>`;
      certGrid.appendChild(node);
    });
  }

  /* ---- SOCIALS ---- */
  const socials = document.getElementById('socials');
  if (socials) {
    content.socials.forEach((s) => {
      const a = el('a', null, s.label);
      a.href = s.url;
      const inPage = /^(mailto:|tel:)/.test(s.url);
      a.target = inPage ? '_self' : '_blank';
      a.rel = 'noopener';
      a.dataset.cursor = inPage ? 'Open' : 'Visit';
      socials.appendChild(a);
    });
  }

  /* ---- YEAR ---- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();


  /* ---- generic bindings LAST so injected nodes are covered ---- */
  bind(document, content);
}
