/* ============================================================
   MENAHIL FATIMA: PORTFOLIO
   Vanilla JS, no frameworks. Content lives in data.js.
   ============================================================ */

(function () {
  'use strict';

  const { EPISODES, SEASONS, FEATURED } = window.SERIES;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  /* ==========================================================
     STARFIELD: depth layers, scroll parallax, twinkle,
     shooting stars and a hyperspace "warp" transition
     ========================================================== */
  const Starfield = (() => {
    const canvas = $('#starfield');
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, stars = [], shooting = [], warp = null;
    let mx = 0, my = 0, tmx = 0, tmy = 0, running = false, lastShoot = 0;

    const LAYERS = [
      { p: 0.03, r: [0.35, 0.8], a: [0.25, 0.55], density: 0.00016 },
      { p: 0.10, r: [0.6, 1.2], a: [0.4, 0.8], density: 0.00007 },
      { p: 0.24, r: [1.0, 1.9], a: [0.65, 1], density: 0.000022 }
    ];
    const TINTS = ['255,255,255', '255,255,255', '255,255,255', '199,210,254', '186,230,253', '253,230,138'];
    const rand = (a, b) => a + Math.random() * (b - a);

    function build() {
      stars = [];
      const area = W * H;
      LAYERS.forEach((L, li) => {
        const n = Math.round(area * L.density);
        for (let i = 0; i < n; i++) {
          stars.push({
            x: Math.random() * W, y: Math.random() * H * 1.2,
            r: rand(L.r[0], L.r[1]), a: rand(L.a[0], L.a[1]),
            tw: rand(0.6, 2.2), ph: Math.random() * Math.PI * 2,
            p: L.p, li, tint: TINTS[(Math.random() * TINTS.length) | 0]
          });
        }
      });
    }

    function resize() {
      const nw = window.innerWidth, nh = window.innerHeight;
      const rebuild = Math.abs(nw - W) > 40 || Math.abs(nh - H) > 160 || !stars.length;
      W = nw; H = nh;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (rebuild) build();
      if (!running) draw(performance.now());
    }

    function spawnShooting() {
      const fromLeft = Math.random() > 0.5;
      shooting.push({
        x: fromLeft ? rand(0, W * 0.5) : rand(W * 0.5, W), y: rand(0, H * 0.45),
        vx: (fromLeft ? 1 : -1) * rand(7, 11), vy: rand(2.5, 4.5), life: 1
      });
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const sy = window.scrollY || 0;
      const time = t / 1000;
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      const fade = warp ? clamp(1 - warp.k * 2.2) : 1;
      const span = H * 1.2;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        let y = (s.y - sy * s.p) % span; if (y < 0) y += span;
        y -= H * 0.1;
        const x = s.x + mx * s.p * 60;
        const yy = y + my * s.p * 40;
        if (yy < -4 || yy > H + 4) continue;
        const alpha = s.a * (0.6 + 0.4 * Math.sin(time * s.tw + s.ph)) * fade;
        if (alpha <= 0.01) continue;
        ctx.fillStyle = `rgba(${s.tint},${alpha.toFixed(3)})`;
        if (s.r < 1) {
          ctx.fillRect(x, yy, s.r * 1.4, s.r * 1.4);
        } else {
          ctx.beginPath(); ctx.arc(x, yy, s.r, 0, 6.283); ctx.fill();
          if (s.li === 2) {
            ctx.fillStyle = `rgba(${s.tint},${(alpha * 0.12).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(x, yy, s.r * 3.2, 0, 6.283); ctx.fill();
          }
        }
      }

      // Shooting stars
      if (!warp && t - lastShoot > 4200 + Math.random() * 6000) { spawnShooting(); lastShoot = t; }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.x += s.vx; s.y += s.vy; s.life -= 0.012;
        if (s.life <= 0) { shooting.splice(i, 1); continue; }
        const tx = s.x - s.vx * 12, ty = s.y - s.vy * 12;
        const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
        g.addColorStop(0, `rgba(255,255,255,${s.life})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty); ctx.stroke();
      }

      // Warp streaks
      if (warp) {
        const k = clamp((t - warp.start) / warp.dur);
        warp.k = k;
        const cx = W / 2, cy = H / 2;
        const accel = k < 0.75 ? k / 0.75 : 1;
        const out = k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1;
        for (const p of warp.parts) {
          p.d += p.v * (1 + accel * accel * 26);
          const len = 2 + accel * accel * p.v * 26;
          if (p.d > Math.max(W, H)) { p.d = rand(4, 60); }
          const c = Math.cos(p.ang), sn = Math.sin(p.ang);
          ctx.strokeStyle = `rgba(${p.tint},${(clamp(p.d / 160) * out).toFixed(3)})`;
          ctx.lineWidth = p.w;
          ctx.beginPath();
          ctx.moveTo(cx + c * p.d, cy + sn * p.d);
          ctx.lineTo(cx + c * (p.d - len), cy + sn * (p.d - len));
          ctx.stroke();
        }
        if (k >= 1) { warp = null; }
      }
    }

    function loop(t) {
      if (!running) return;
      draw(t);
      requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true; requestAnimationFrame(loop);
    }

    function stop() { running = false; }

    function doWarp(dur = 1300) {
      if (reduceMotion) return;
      const parts = [];
      for (let i = 0; i < 420; i++) {
        parts.push({
          ang: Math.random() * Math.PI * 2, d: rand(4, Math.max(W, H) * 0.6),
          v: rand(1.2, 4), w: rand(0.6, 1.8), tint: TINTS[(Math.random() * TINTS.length) | 0]
        });
      }
      warp = { start: performance.now(), dur, parts, k: 0 };
    }

    resize();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
    window.addEventListener('pointermove', e => {
      tmx = (e.clientX / W - 0.5) * 2; tmy = (e.clientY / H - 0.5) * 2;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    if (reduceMotion) window.addEventListener('scroll', () => draw(performance.now()), { passive: true });
    start();

    return { warp: doWarp };
  })();

  /* ==========================================================
     LETTER SPLIT (with per-letter gradient colours)
     ========================================================== */
  const GRADS = {
    sun: ['#fbbf24', '#f97316', '#ec4899'],
    cosmic: ['#818cf8', '#a855f7', '#ec4899'],
    gold: ['#fde68a', '#e3b552', '#f59e0b'],
    ice: ['#67e8f9', '#38bdf8', '#818cf8']
  };

  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function lerpStops(stops, t) {
    const seg = (stops.length - 1) * t, i = Math.min(stops.length - 2, Math.floor(seg)), f = seg - i;
    const a = hexToRgb(stops[i]), b = hexToRgb(stops[i + 1]);
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`;
  }

  function splitText(root) {
    if (root.dataset.splitDone) return;
    root.dataset.splitDone = '1';
    const label = root.textContent.replace(/\s+/g, ' ').trim();
    let i = 0;
    (function walk(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) {
          const text = child.textContent;
          if (!text.trim()) { child.textContent = text.length ? ' ' : ''; return; }
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            for (const c of part) {
              const ch = document.createElement('span');
              ch.className = 'ch'; ch.textContent = c; ch.style.setProperty('--i', i++);
              w.appendChild(ch);
            }
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(root);

    $$('[data-grad]', root).forEach(g => {
      const stops = GRADS[g.dataset.grad] || GRADS.cosmic;
      const chs = $$('.ch', g);
      chs.forEach((ch, k) => { ch.style.color = lerpStops(stops, chs.length > 1 ? k / (chs.length - 1) : 0); });
    });

    if (root.dataset.splitDelay) root.style.setProperty('--base', root.dataset.splitDelay + 'ms');
    root.setAttribute('aria-label', label);
    Array.from(root.children).forEach(c => c.setAttribute('aria-hidden', 'true'));
  }

  /* ==========================================================
     SCRAMBLE / DECODE TEXT
     ========================================================== */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\[]{}';
  function scramble(el, dur = 1100) {
    if (!el.dataset.final) el.dataset.final = el.textContent;
    const final = el.dataset.final;
    el.setAttribute('aria-label', final);
    if (reduceMotion) { el.textContent = final; return; }
    cancelAnimationFrame(el._raf);
    const start = performance.now();
    const n = final.length;
    (function frame(now) {
      const p = clamp((now - start) / dur);
      const solid = Math.floor(p * n);
      let out = '';
      for (let i = 0; i < n; i++) {
        const c = final[i];
        if (i < solid || c === ' ' || c === '✦') out += c;
        else out += Math.random() < 0.5 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : c.toUpperCase() === c ? GLYPHS[(Math.random() * 26) | 0] : GLYPHS[(Math.random() * 26) | 0].toLowerCase();
      }
      el.textContent = out;
      if (p < 1) el._raf = requestAnimationFrame(frame);
      else el.textContent = final;
    })(start);
  }

  /* ==========================================================
     RENDER: posters, cards, seasons, billboard
     ========================================================== */
  const hueOf = ep => (typeof ep.hue === 'number' ? ep.hue : Array.from(ep.id).reduce((a, c) => a + c.charCodeAt(0) * 7, 0) % 360);
  const seasonOf = ep => SEASONS.find(s => s.n === ep.season);

  // Animated scene from posters.js; falls back to an image, then a generated planet
  // mode: 'tall' | 'thumb' | 'banner' (banner = wide art plus a tall version for phones)
  function posterHTML(ep, mode = 'tall') {
    if (window.POSTERS && window.POSTERS.has(ep.id)) {
      if (mode === 'banner') return window.POSTERS.render(ep.id, 'wide') + window.POSTERS.render(ep.id, 'tall');
      return window.POSTERS.render(ep.id, mode);
    }
    return ep.image
      ? `<img src="${esc(ep.image)}" alt="" loading="lazy" decoding="async">`
      : `<span class="poster-gen" style="--h:${hueOf(ep)}"><span class="pg-planet"></span><span class="pg-ring"></span></span>`;
  }

  // Only animate scenes that are on screen
  const sceneIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('is-live', e.isIntersecting));
  }, { rootMargin: '100px' }) : null;
  function watchScenes(root) {
    $$('svg.scene', root).forEach(svg => (sceneIO ? sceneIO.observe(svg) : svg.classList.add('is-live')));
  }

  const KIND_LABEL = { work: 'Work', leadership: 'Lead', award: 'Award', research: 'Research' };

  function cardHTML(ep, i, season) {
    const kind = KIND_LABEL[ep.kind];
    const ribbon = ep.soon ? '<span class="ribbon soon">Coming soon</span>'
      : season.live ? '<span class="ribbon">New episode</span>' : '';
    return `
      <button class="card" data-open="${ep.id}" style="--h:${hueOf(ep)};--i:${i}" aria-label="${esc(ep.title)}, ${esc(ep.label)}. ${esc(ep.tagline)}">
        <span class="poster">${posterHTML(ep)}</span>
        <span class="card-scrim"></span>
        <span class="card-mf"><img src="assets/images/logo/mf-mark.svg" alt="" class="mf-logo"></span>
        ${kind ? `<span class="card-kind ${ep.kind === 'award' ? 'k-award' : ''}">${kind}</span>` : ''}
        <span class="card-text">
          <span class="card-label">${esc(ep.label)}</span>
          <span class="card-title">${esc(ep.title)}</span>
          ${ep.subtitle ? `<span class="card-subtitle">${esc(ep.subtitle)}</span>` : ''}
          <span class="card-hover">
            <span class="card-hover-top">
              <span class="play-circle"><svg class="ic ic-fill"><use href="#i-play"/></svg></span>
              <span class="match">${ep.match}% Match</span>
            </span>
            <p>${esc(ep.tagline)}</p>
            <span class="card-genres">${ep.genres.map(esc).join(' · ')}</span>
          </span>
        </span>
        ${ribbon}
      </button>`;
  }

  function renderSeasons() {
    const host = $('#seasonRows');
    host.innerHTML = SEASONS.map(season => {
      const cards = season.episodes.map((id, i) => cardHTML(EPISODES[id], i, season)).join('');
      const finale = season.finale ? `
        <div class="card card-finale" style="--i:${season.episodes.length}" aria-label="${esc(season.finale.label)}: ${esc(season.finale.title)}, ${esc(season.finale.when)}">
          <svg class="ic"><use href="#i-cap"/></svg>
          <small>${esc(season.finale.label)}</small>
          <strong>${esc(season.finale.title)}</strong>
          <span>${esc(season.finale.when)}</span>
        </div>` : '';
      return `
        <div class="season" id="season-${season.n}">
          <div class="season-head" data-reveal>
            <h3><span class="sn">S${season.n}</span>${esc(season.title)}</h3>
            <span class="season-period">${esc(season.period)}</span>
            ${season.live ? '<span class="season-live"><span class="live-dot"></span>NOW STREAMING</span>' : ''}
          </div>
          <p class="season-desc" data-reveal style="--d:1">${esc(season.desc)}</p>
          <div class="row-wrap">
            <button class="row-arrow prev" aria-label="Scroll season ${season.n} left" hidden><svg class="ic"><use href="#i-left"/></svg></button>
            <div class="row">${cards}${finale}</div>
            <button class="row-arrow next" aria-label="Scroll season ${season.n} right"><svg class="ic"><use href="#i-right"/></svg></button>
          </div>
        </div>`;
    }).join('');

    $$('.row-wrap', host).forEach(wrap => {
      const row = $('.row', wrap), prev = $('.prev', wrap), next = $('.next', wrap);
      const update = () => {
        prev.hidden = row.scrollLeft < 8;
        next.hidden = row.scrollLeft + row.clientWidth >= row.scrollWidth - 8;
      };
      row.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      prev.addEventListener('click', () => row.scrollBy({ left: -row.clientWidth * 0.8, behavior: 'smooth' }));
      next.addEventListener('click', () => row.scrollBy({ left: row.clientWidth * 0.8, behavior: 'smooth' }));
      requestAnimationFrame(update);
      row._update = update;
    });
    watchScenes(host);
  }

  function renderFeatured() {
    const ep = EPISODES[FEATURED];
    if (!ep) return;
    $('#featured').innerHTML = `
      <div class="billboard" style="--h:${hueOf(ep)}">
        <div class="bb-media">${posterHTML(ep, 'banner')}</div>
        <div class="bb-shade"></div>
        <div class="bb-content">
          <p class="bb-series" data-reveal><img src="assets/images/logo/mf-mark.svg" alt="" class="mf-logo"> SERIES</p>
          <h2 class="bb-title${ep.title.length > 16 ? ' bb-title--long' : ''}" data-split>${esc(ep.title)}</h2>
          ${ep.subtitle ? `<p class="bb-subtitle" data-reveal style="--d:1">${esc(ep.subtitle)}${ep.org ? ` · ${esc(ep.org)}` : ''}</p>` : ''}
          <p class="bb-top" data-reveal style="--d:2">${ep.soon
            ? '<span class="soon-pill"><span class="live-dot"></span>In production</span> Coming soon'
            : '<span class="top10"><span>TOP</span><b>10</b></span> #1 in Projects this season'}</p>
          <p class="bb-meta" data-reveal style="--d:3">
            <span class="match">${ep.match}% Match</span><span>${esc(ep.dates)}</span><span class="badge-box">${esc(ep.label)}</span>
          </p>
          <p class="bb-desc" data-reveal style="--d:4">${esc(ep.plot[0])}</p>
          <div class="bb-actions" data-reveal style="--d:5">
            <button class="btn btn-white" data-open="${ep.id}"><svg class="ic ic-fill"><use href="#i-play"/></svg><span>${ep.soon ? 'Watch trailer' : 'Play'}</span></button>
            <button class="btn btn-ghost" data-open="${ep.id}"><svg class="ic"><use href="#i-info"/></svg><span>More info</span></button>
          </div>
        </div>
        <div class="bb-rating">${esc(ep.genres.join(' · '))}</div>
      </div>`;
    watchScenes($('#featured'));
  }

  /* ==========================================================
     EPISODE MODAL (Netflix-style detail page)
     ========================================================== */
  const Modal = (() => {
    const modal = $('#modal');
    const panel = $('#modalPanel');
    let current = null, lastFocus = null, closeTimer = null;

    const initials = n => n.replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

    function moreLikeThis(ep) {
      const score = o => o.genres.filter(g => ep.genres.includes(g)).length * 2 + (o.kind === ep.kind ? 1 : 0) + Math.random() * 0.9;
      return Object.values(EPISODES)
        .filter(o => o.id !== ep.id && o.season !== ep.season)
        .map(o => [score(o), o]).sort((a, b) => b[0] - a[0]).slice(0, 6).map(x => x[1]);
    }

    function html(ep) {
      const season = seasonOf(ep);
      const myList = store.get('mf-mylist', []);
      const inList = myList.includes(ep.id);
      const kind = { work: 'Work Experience', leadership: 'Leadership', award: 'Award', research: 'Research', project: 'Project' }[ep.kind] || 'Series';
      const cast = ep.cast || [];

      return `
        <button class="m-close" data-close aria-label="Close episode"><svg class="ic"><use href="#i-x"/></svg></button>
        <div class="m-hero" style="--h:${hueOf(ep)}">
          ${posterHTML(ep, 'banner')}
          <div class="m-hero-shade"></div>
          <div class="m-hero-content">
            <p class="bb-series"><img src="assets/images/logo/mf-mark.svg" alt="" class="mf-logo"> ${esc(kind.toUpperCase())}</p>
            <h2 class="m-title" id="modalTitle">${esc(ep.title)}</h2>
            ${ep.subtitle ? `<p class="m-subtitle">${esc(ep.subtitle)}</p>` : ''}
            <div class="m-actions">
              <button class="btn btn-white btn-sm" data-jump="#mPlot"><svg class="ic ic-fill"><use href="#i-play"/></svg><span>${ep.soon ? 'Watch trailer' : 'Play'}</span></button>
              <button class="icon-btn ${inList ? 'is-on' : ''}" data-mylist="${ep.id}" aria-pressed="${inList}" title="${inList ? 'Remove from My List' : 'Add to My List'}">
                <svg class="ic"><use href="#${inList ? 'i-check' : 'i-plus'}"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="m-body">
          <div class="m-grid">
            <div>
              <div class="m-meta">
                <span class="match">${ep.match}% Match</span>
                <span>${esc(ep.dates)}</span>
                <span class="badge-box">${esc(ep.label)}</span>
                ${ep.soon ? '<span class="badge-box">Coming soon</span>' : ''}
              </div>
              <p class="m-tagline">${esc(ep.tagline)}</p>
              <div class="m-plot" id="mPlot">${ep.plot.map(p => `<p>${esc(p)}</p>`).join('')}</div>
              ${ep.award ? `<div class="m-award"><svg class="ic"><use href="#i-trophy"/></svg><span>${esc(ep.award)}</span></div>` : ''}
            </div>
            <div class="m-side">
              ${ep.org ? `<p><span>Where: </span><b>${esc(ep.org)}</b></p>` : ''}
              <p><span>Genres: </span><b>${ep.genres.map(esc).join(', ')}</b></p>
              ${cast.length ? `<p><span>Cast: </span><b>${cast.map(c => esc(c.name)).join(', ')}</b></p>` : ''}
              <p><span>Season: </span><b>${season.n}, ${esc(season.title)}</b></p>
            </div>
          </div>

          ${ep.points && ep.points.length ? `
          <div class="m-section">
            <h3>${ep.kind === 'work' || ep.kind === 'leadership' ? 'What I did' : 'Key points'}</h3>
            <ol class="m-points">${ep.points.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
          </div>` : ''}

          ${ep.tech && ep.tech.length ? `
          <div class="m-section">
            <h3>Stack &amp; tools</h3>
            <div class="chips">${ep.tech.map(t => `<span>${esc(t)}</span>`).join('')}</div>
          </div>` : ''}

          ${ep.learned ? `<div class="m-quote"><small>WHAT I LEARNED</small><p>${esc(ep.learned)}</p></div>` : ''}

          ${cast.length ? `
          <div class="m-section">
            <h3>Cast</h3>
            <div class="m-cast">${cast.map(c => `
              <div class="cast"><span class="cast-av">${initials(c.name)}</span><div><b>${esc(c.name)}</b><small>${esc(c.role)}</small></div></div>`).join('')}
            </div>
          </div>` : ''}

          <div class="m-section">
            <h3>Season ${season.n}: ${esc(season.title)}</h3>
            <ul class="ep-list">${season.episodes.map((id, i) => {
              const o = EPISODES[id];
              return `<li><button class="ep-row ${id === ep.id ? 'is-current' : ''}" data-open="${id}" ${id === ep.id ? 'aria-current="true"' : ''}>
                <span class="ep-num">${i + 1}</span>
                <span class="ep-thumb" style="--h:${hueOf(o)}">${posterHTML(o, 'thumb')}</span>
                <span class="ep-info"><b>${esc(o.title)}</b><span>${esc(o.tagline)}</span></span>
                <span class="ep-date">${esc(o.dates)}</span>
              </button></li>`;
            }).join('')}</ul>
          </div>

          <div class="m-section">
            <h3>More like this</h3>
            <div class="more-grid">${moreLikeThis(ep).map(o => `
              <button class="more-card" data-open="${o.id}" style="--h:${hueOf(o)}">
                <span class="more-thumb" style="display:block">${posterHTML(o, 'thumb')}<span class="card-label">${esc(o.label)}</span></span>
                <span class="more-body" style="display:block">
                  <span class="match">${o.match}% Match</span>
                  <b>${esc(o.title)}</b>
                  <p>${esc(o.tagline)}</p>
                </span>
              </button>`).join('')}
            </div>
          </div>
        </div>`;
    }

    function open(id, push = true) {
      const ep = EPISODES[id];
      if (!ep) return;
      clearTimeout(closeTimer);
      const wasOpen = !modal.hidden && !modal.classList.contains('is-closing');
      if (!wasOpen) lastFocus = document.activeElement;
      modal.classList.remove('is-closing');
      panel.innerHTML = html(ep);
      watchScenes(panel);
      current = id;

      if (wasOpen) {
        modal.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = '';
        if (push) history.replaceState({ ep: id }, '', '#ep-' + id);
      } else {
        modal.hidden = false;
        modal.scrollTop = 0;
        document.body.classList.add('modal-open');
        if (push) history.pushState({ ep: id }, '', '#ep-' + id);
      }
      panel.focus({ preventScroll: true });
    }

    function hide() {
      if (modal.hidden) return;
      current = null;
      modal.classList.add('is-closing');
      closeTimer = setTimeout(() => {
        modal.hidden = true;
        modal.classList.remove('is-closing');
        panel.innerHTML = '';
        document.body.classList.remove('modal-open');
        if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 280);
    }

    function close() {
      if (history.state && history.state.ep) history.back();
      else { hide(); if (location.hash.startsWith('#ep-')) history.replaceState(null, '', location.pathname + location.search); }
    }

    window.addEventListener('popstate', e => {
      if (e.state && e.state.ep) open(e.state.ep, false);
      else hide();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hidden) close();
      // Keep focus inside the dialog
      if (e.key === 'Tab' && !modal.hidden) {
        const f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', panel).filter(x => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    return { open, close, get current() { return current; } };
  })();

  /* ==========================================================
     LANDING → APP
     ========================================================== */
  const body = document.body;
  const app = $('#app');
  const landing = $('#landing');
  function setProfile(name) {
    const btn = $(`.profile[data-profile="${name}"]`) || $('.profile[data-profile="Explorer"]');
    name = btn.dataset.profile;
    $('#profileName').textContent = name;
    // Show the chosen character in the nav (gradient ids re-prefixed so they stay unique)
    const av = $('.avatar', btn);
    const nav = $('#navAvatar');
    nav.className = 'nav-profile-orb ' + Array.from(av.classList).filter(c => c.startsWith('avatar--')).join(' ');
    nav.innerHTML = $('svg', av).outerHTML.replace(/av(\d)-/g, 'nav-av$1-');
    try { sessionStorage.setItem('mf-profile', name); } catch (e) { /* ignore */ }
  }

  // Landing: the scene takes on the colour of the hovered profile, and drifts with the cursor
  $$('.profile').forEach(p => {
    const tint = () => landing.style.setProperty('--acc', p.style.getPropertyValue('--acc'));
    p.addEventListener('mouseenter', tint);
    p.addEventListener('focus', tint);
  });
  landing.addEventListener('pointermove', e => {
    if (reduceMotion) return;
    landing.style.setProperty('--lx', ((e.clientX / window.innerWidth) - 0.5).toFixed(3) * 2);
    landing.style.setProperty('--ly', ((e.clientY / window.innerHeight) - 0.5).toFixed(3) * 2);
  }, { passive: true });

  $('#skipIntro').addEventListener('click', () => { setProfile('Explorer'); enterApp(false); });

  function enterApp(instant) {
    const show = () => {
      body.classList.remove('is-landing');
      app.setAttribute('aria-hidden', 'false');
      landing.setAttribute('aria-hidden', 'true');
      if (!instant) {
        app.classList.add('is-entering');
        setTimeout(() => app.classList.remove('is-entering'), 1200);
      }
      if (!location.hash || location.hash === '#') window.scrollTo(0, 0);
      requestAnimationFrame(() => { onScroll(); $$('.row').forEach(r => r._update && r._update()); });
    };
    if (instant || reduceMotion) { show(); return; }
    landing.classList.add('is-leaving');
    Starfield.warp(1400);
    setTimeout(show, 950);
  }

  function backToLanding() {
    body.classList.add('is-landing');
    app.setAttribute('aria-hidden', 'true');
    landing.removeAttribute('aria-hidden');
    landing.classList.remove('is-leaving');
    window.scrollTo(0, 0);
    const first = $('.profile');
    if (first) first.focus({ preventScroll: true });
  }

  $$('.profile').forEach(p => p.addEventListener('click', () => { setProfile(p.dataset.profile); enterApp(false); }));
  $('#switchProfile').addEventListener('click', backToLanding);

  /* ==========================================================
     NAV: indicator, active section, mobile menu
     ========================================================== */
  const nav = $('#nav');
  const pill = $('.nav-pill');
  const indicator = $('.nav-indicator');
  const navLinks = $$('.nav-link');
  let activeLink = null;

  function moveIndicator(link) {
    if (!link) { indicator.style.setProperty('--o', 0); return; }
    indicator.style.setProperty('--x', link.offsetLeft + 'px');
    indicator.style.setProperty('--w', link.offsetWidth + 'px');
    indicator.style.setProperty('--o', 1);
  }
  navLinks.forEach(l => l.addEventListener('mouseenter', () => moveIndicator(l)));
  pill.addEventListener('mouseleave', () => moveIndicator(activeLink));

  const sectionIds = navLinks.map(l => l.getAttribute('href').slice(1));
  function updateActiveNav() {
    const y = window.innerHeight * 0.35;
    let id = null;
    sectionIds.forEach(sid => {
      const s = document.getElementById(sid);
      if (s && s.getBoundingClientRect().top <= y) id = sid;
    });
    const link = id ? navLinks.find(l => l.getAttribute('href') === '#' + id) : null;
    if (link !== activeLink) {
      navLinks.forEach(l => l.classList.toggle('is-active', l === link));
      activeLink = link;
      if (!pill.matches(':hover')) moveIndicator(link);
    }
  }

  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 960) setMenu(false); });

  /* ==========================================================
     SCROLL ENGINE (one rAF per frame)
     ========================================================== */
  const marqueeSec = $('.marquee-sec');
  const marqueeTrack = $('.marquee-track');
  const planet = $('.planet-big');
  const words = $('#scrollWords');
  const pillarsSec = $('#pillars');
  const pillars = $$('.pillar');
  const timeline = $('#timeline');
  const timelineFill = $('.timeline-fill');
  let wordEls = [];
  let activePillar = -1;
  let billboard = null;
  const desktop = () => window.innerWidth > 960;

  // Split the statement into words for the scroll-lit effect
  if (words) {
    const text = words.textContent.replace(/\s+/g, ' ').trim();
    words.setAttribute('aria-label', text);
    words.innerHTML = text.split(' ').map(w => `<span class="sw" aria-hidden="true">${esc(w)}</span>`).join(' ');
    wordEls = $$('.sw', words);
  }

  function setPillar(i) {
    if (i === activePillar) return;
    activePillar = i;
    pillars.forEach((p, k) => p.classList.toggle('is-active', k === i));
    const tag = pillars[i] && $('[data-scramble-live]', pillars[i]);
    if (tag) scramble(tag, 900);
  }

  pillars.forEach((p, i) => {
    $('.pillar-title', p).addEventListener('click', () => {
      if (!desktop()) return;
      const r = pillarsSec.getBoundingClientRect();
      const total = pillarsSec.offsetHeight - window.innerHeight;
      const top = window.scrollY + r.top + total * ((i + 0.5) / pillars.length);
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  function onScroll() {
    if (body.classList.contains('is-landing')) return;
    const vh = window.innerHeight;
    const sy = window.scrollY;

    nav.classList.toggle('is-scrolled', sy > 24);
    updateActiveNav();

    // Marquee: moves sideways as you scroll past
    if (marqueeSec && !reduceMotion) {
      const r = marqueeSec.getBoundingClientRect();
      if (r.bottom > -200 && r.top < vh + 200) {
        const p = clamp((vh - r.top) / (vh + r.height));
        const travel = marqueeTrack.scrollWidth - window.innerWidth * 0.6;
        marqueeTrack.style.setProperty('--mx', (window.innerWidth * 0.15 - p * travel * 0.55).toFixed(1) + 'px');
        planet.style.setProperty('--py', (-p * 90).toFixed(1) + 'px');
        planet.style.setProperty('--pr', (p * 50).toFixed(1) + 'deg');
      }
    }

    // Statement: words light up with scroll
    if (wordEls.length) {
      const r = words.getBoundingClientRect();
      const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.3));
      const lit = Math.round(p * wordEls.length);
      wordEls.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    }

    // Pillars: sticky accordion
    if (pillarsSec) {
      if (desktop()) {
        const r = pillarsSec.getBoundingClientRect();
        const total = pillarsSec.offsetHeight - vh;
        const p = clamp(-r.top / total);
        setPillar(Math.min(pillars.length - 1, Math.floor(p * pillars.length)));
      } else if (activePillar !== -2) {
        activePillar = -2;
        pillars.forEach(p => p.classList.add('is-active'));
      }
    }

    // Billboard parallax
    const bb = billboard || (billboard = $('.billboard'));
    if (bb && !reduceMotion) {
      const r = bb.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        bb.style.setProperty('--bb-y', ((r.top + r.height / 2 - vh / 2) * -0.12).toFixed(1) + 'px');
      }
    }

    // Timeline progress
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      timelineFill.style.setProperty('--p', clamp((vh * 0.65 - r.top) / r.height).toFixed(3));
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); }
  }, { passive: true });
  window.addEventListener('resize', () => { activePillar = -1; onScroll(); });

  /* ==========================================================
     REVEALS (IntersectionObserver)
     ========================================================== */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const start = performance.now(), dur = 1600;
    (function f(now) {
      const p = clamp((now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(f);
    })(start);
  }

  function initReveals() {
    $$('[data-split]').forEach(splitText);

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-in');
        if (el.hasAttribute('data-scramble')) scramble(el);
        if (el.id === 'orbs') setTimeout(() => $$('[data-count]', el).forEach(countUp), 500);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    $$('[data-split], [data-reveal], [data-scramble], .row, #orbs, .tl-item, .capsule').forEach(el => io.observe(el));
  }

  /* ==========================================================
     GLOBAL INTERACTIONS
     ========================================================== */
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); Modal.open(opener.dataset.open); return; }

    if (e.target.closest('[data-close]')) { Modal.close(); return; }

    const jump = e.target.closest('[data-jump]');
    if (jump) {
      const t = $(jump.dataset.jump);
      if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    const scrollTo = e.target.closest('[data-scroll]');
    if (scrollTo) {
      const t = $(scrollTo.dataset.scroll);
      if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }

    const ml = e.target.closest('[data-mylist]');
    if (ml) {
      const id = ml.dataset.mylist;
      let list = store.get('mf-mylist', []);
      const on = !list.includes(id);
      list = on ? [...list, id] : list.filter(x => x !== id);
      store.set('mf-mylist', list);
      ml.classList.toggle('is-on', on);
      ml.setAttribute('aria-pressed', on);
      ml.title = on ? 'Remove from My List' : 'Add to My List';
      $('use', ml).setAttribute('href', on ? '#i-check' : '#i-plus');
    }
  });

  // Cursor spotlight on cards and buttons
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest('.spot, .btn');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ==========================================================
     BOOT
     ========================================================== */
  function init() {
    renderFeatured();
    renderSeasons();
    // Small animated emblems (e.g. certifications) declared in the HTML
    $$('[data-poster]').forEach(el => {
      el.innerHTML = window.POSTERS ? window.POSTERS.render(el.dataset.poster, 'emblem') : '';
      watchScenes(el);
    });
    initReveals();
    $('#year').textContent = new Date().getFullYear();

    // Landing name reveal
    const ln = $('.landing-name');
    if (ln) {
      requestAnimationFrame(() => ln.classList.add('is-in'));
      const chars = $$('.ch', ln).length;
      setTimeout(() => ln.classList.add('is-shiny'), reduceMotion ? 0 : 900 + chars * 26 + 1100);
    }

    // Deep link (e.g. #seasons or #ep-cipherchain) skips the profile picker
    let saved = 'Explorer';
    try { saved = sessionStorage.getItem('mf-profile') || 'Explorer'; } catch (e) { /* ignore */ }
    setProfile(saved);

    const hash = location.hash;
    if (hash && hash !== '#') {
      enterApp(true);
      if (hash.startsWith('#ep-')) {
        const id = hash.slice(4);
        if (EPISODES[id]) {
          history.replaceState(null, '', location.pathname + location.search);
          Modal.open(id);
        }
      } else {
        const target = document.getElementById(hash.slice(1));
        const jump = () => target && target.scrollIntoView({ behavior: 'instant' });
        // Wait for web fonts so the section offsets are final
        (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(jump));
      }
    }

    // A section link used while the profile picker is showing skips straight in
    // and an episode link (#ep-...) pasted or re-clicked opens that episode
    window.addEventListener('hashchange', () => {
      const h = location.hash;
      if (!h || h === '#') return;
      if (body.classList.contains('is-landing')) enterApp(true);
      if (h.startsWith('#ep-')) {
        const id = h.slice(4);
        if (EPISODES[id] && Modal.current !== id) {
          history.replaceState({ ep: id }, '', h);
          Modal.open(id, false);
        }
      }
    });
  }

  init();
})();
