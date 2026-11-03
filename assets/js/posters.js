/* ============================================================
   ANIMATED EPISODE POSTERS
   One hand-built SVG scene per episode (viewBox 200 x 300).
   Scenes keep their focal point in the 50 to 190 band so the
   same art works as a portrait card and as a wide crop.
   Animations come from utility classes in style.css
   (a-spin, a-pulse, a-ox ...) plus a few scene keyframes (sc-*).
   ============================================================ */

window.POSTERS = (function () {
  'use strict';

  // Small seeded random generator so each poster is stable between renders
  function rng(seed) {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => {
      h += 0x6D2B79F5;
      let t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = n => Math.round(n * 10) / 10;
  const MONO = "font-family=\"'JetBrains Mono', monospace\"";

  function bg(u, top, bottom, glow) {
    return `<defs>
      <linearGradient id="${u}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
      ${glow ? `<radialGradient id="${u}gl"><stop offset="0" stop-color="${glow}" stop-opacity=".5"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>` : ''}
    </defs><rect x="-400" width="1000" height="300" fill="url(#${u}bg)"/>`;
  }

  function stars(r, n, y0 = 0, y1 = 300, color = '#fff') {
    let s = '';
    for (let i = 0; i < n; i++) {
      s += `<circle cx="${f(r() * 200)}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(0.35 + r() * 0.9)}" fill="${color}" class="a-pulse" style="--dur:${f(2 + r() * 4)}s;animation-delay:-${f(r() * 5)}s"/>`;
    }
    return `<g opacity=".8">${s}</g>`;
  }

  const glow = (u, cx, cy, rad, cls = 'a-throb', style = '--dur:5s') =>
    `<g class="${cls}" style="${style}"><circle cx="${cx}" cy="${cy}" r="${rad}" fill="url(#${u}gl)"/></g>`;

  const sparkle = (x, y, s, fill, style = '') =>
    `<path class="a-twinkle" style="${style}" fill="${fill}" d="M${x} ${y - s}C${x + s * .12} ${y - s * .15} ${x + s * .15} ${y - s * .12} ${x + s} ${y}C${x + s * .15} ${y + s * .12} ${x + s * .12} ${y + s * .15} ${x} ${y + s}C${x - s * .12} ${y + s * .15} ${x - s * .15} ${y + s * .12} ${x - s} ${y}C${x - s * .15} ${y - s * .12} ${x - s * .12} ${y - s * .15} ${x} ${y - s}Z"/>`;

  // Orbiting element: elliptical motion from two offset oscillations
  const orbit = (cx, cy, ax, ay, dur, phase, inner) =>
    `<g transform="translate(${cx} ${cy})"><g class="a-ox" style="--ax:${ax}px;--dur:${dur}s;--ph:${phase}s"><g class="a-oy" style="--ay:${ay}px;--dur:${dur}s;--ph:${phase}s">${inner}</g></g></g>`;

  function gear(cx, cy, r, teeth) {
    const pts = [], ri = r * 0.78, da = Math.PI / teeth;
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      [[a - da * 0.55, ri], [a - da * 0.32, r], [a + da * 0.32, r], [a + da * 0.55, ri]]
        .forEach(([ang, rad]) => pts.push(`${f(cx + Math.cos(ang) * rad)},${f(cy + Math.sin(ang) * rad)}`));
    }
    return `M${pts.join('L')}Z`;
  }

  const S = {};

  /* ---------- S1 · Arcelia: hotel tower at night ---------- */
  S.arcelia = (u, r) => {
    let win = '';
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 4; col++) {
        win += `<rect x="${76 + col * 13}" y="${80 + row * 14}" width="8" height="7" rx="1" fill="#fbbf24" class="a-win" style="--dur:${f(5 + r() * 6)}s;animation-delay:-${f(r() * 8)}s"/>`;
      }
    }
    let side = '';
    for (let i = 0; i < 14; i++) {
      const left = i < 7;
      side += `<rect x="${f((left ? 28 : 144) + (i % 3) * 11)}" y="${f((left ? 136 : 116) + Math.floor((i % 7) / 3) * 22 + r() * 4)}" width="6" height="5" fill="#fde68a" opacity="${f(0.25 + r() * 0.6)}"/>`;
    }
    return bg(u, '#1b1240', '#05040c', '#fde68a') + stars(r, 26, 0, 140) +
      glow(u, 152, 54, 42, 'a-throb', '--dur:6s') +
      `<circle cx="152" cy="54" r="13" fill="#fef3c7"/><circle cx="158" cy="49" r="11.5" fill="#1a1140"/>
      <rect x="20" y="128" width="46" height="130" fill="#0d0a22"/><rect x="136" y="108" width="46" height="150" fill="#0d0a22"/>${side}
      <path d="M68 70 L100 44 L132 70 V258 H68Z" fill="#161236" stroke="#7c6ce0" stroke-opacity=".55"/>
      <line x1="100" y1="44" x2="100" y2="24" stroke="#a5b4fc" stroke-width="1.5"/>
      <circle cx="100" cy="23" r="2.3" fill="#f43f5e" class="a-pulse" style="--dur:1.4s;--lo:.1"/>
      ${win}<rect x="-400" y="256" width="1000" height="44" fill="#05040c"/>`;
  };

  /* ---------- S2 · Dandelions: a glass conservatory in bloom ---------- */
  S.dandelions = (u, r) => {
    const archY = x => f(112 - 62 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 100) / 56, 2))));
    const mullions = [58, 72, 86, 100, 114, 128, 142].map(x => `<line x1="${x}" y1="176" x2="${x}" y2="${archY(x)}"/>`).join('');
    const stems = [
      ['M70 176 C66 152 80 140 72 120', 72, 120, '#f472b6', 0],
      ['M100 176 C104 148 92 128 100 94', 100, 94, '#fde047', 0.5],
      ['M130 176 C136 154 122 140 130 116', 130, 116, '#c084fc', 1]
    ];
    const plants = stems.map(([d, x, y, col, dl]) => {
      const petals = [0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - 6}" rx="3.6" ry="6.5" fill="${col}" transform="rotate(${a} ${x} ${y})"/>`).join('');
      return `<path d="${d}" stroke="#4ade80" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="80" class="a-draw" style="--len:80px;--dur:9s;animation-delay:${dl}s"/>
        <g class="a-pop" style="--dur:9s;animation-delay:${f(dl + 1.6)}s">${petals}<circle cx="${x}" cy="${y}" r="3" fill="#fef9c3"/></g>`;
    }).join('');
    const leaves = [[76, 150, -30], [96, 140, 35], [126, 148, 30], [104, 120, -35]].map(([x, y, a], i) =>
      `<g class="a-pop" style="--dur:9s;animation-delay:${f(0.8 + i * 0.3)}s"><ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="#22c55e" transform="rotate(${a} ${x} ${y})"/></g>`).join('');
    let flies = '';
    for (let i = 0; i < 8; i++) flies += `<circle cx="${f(16 + r() * 168)}" cy="${f(40 + r() * 170)}" r="1.3" fill="#fde047" class="a-pulse" style="--dur:${f(1.4 + r() * 2)}s;animation-delay:-${f(r() * 3)}s;--lo:.05"/>`;
    return bg(u, '#04261f', '#020a08', '#a3e635') + stars(r, 16, 0, 80) + glow(u, 100, 126, 74, 'a-pulse', '--dur:5s;--lo:.35') +
      `<path d="M44 176 V112 A56 62 0 0 1 156 112 V176 Z" fill="#a7f3d0" fill-opacity=".05"/>
      ${plants}${leaves}
      <g stroke="#a7f3d0" stroke-opacity=".28" fill="none">${mullions}<line x1="44" y1="140" x2="156" y2="140"/><path d="M44 112 H156"/></g>
      <path d="M44 176 V112 A56 62 0 0 1 156 112 V176" fill="none" stroke="#a7f3d0" stroke-opacity=".7" stroke-width="1.6"/>
      <path d="M52 108 A50 56 0 0 1 80 60" stroke="#fff" stroke-opacity=".3" stroke-width="3" fill="none" stroke-linecap="round"/>
      <line x1="100" y1="50" x2="100" y2="40" stroke="#a7f3d0" stroke-width="1.5"/><circle cx="100" cy="38" r="3" fill="#fde047" class="a-pulse" style="--dur:2s;--lo:.4"/>
      <rect x="38" y="176" width="124" height="8" rx="2" fill="#14532d"/>
      <g transform="translate(152 78)"><g class="a-float" style="--fy:-8px;--dur:3.4s">
        <ellipse cx="-4" cy="0" rx="5" ry="7" fill="#f9a8d4" class="sc-flapL"/><ellipse cx="4" cy="0" rx="5" ry="7" fill="#f472b6" class="sc-flapR"/>
        <line x1="0" y1="-5" x2="0" y2="6" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/></g></g>
      ${flies}${sparkle(30, 46, 5, '#d9f99d', '--dur:3s')}`;
  };

  /* ---------- S2 · Gaming Hub: CRT with a pong rally ---------- */
  S.gaminghub = (u, r) => {
    const sprite = ['...XXX...', '..XXXXX..', '.XX.X.XX.', '.XXXXXXX.', '.X.X.X.X.'];
    let px = '';
    sprite.forEach((row, y) => [...row].forEach((c, x) => { if (c === 'X') px += `<rect x="${82 + x * 4}" y="${58 + y * 4}" width="4" height="4"/>`; }));
    return bg(u, '#140628', '#020104', '#4ade80') + stars(r, 14, 0, 40) +
      `<defs><pattern id="${u}sl" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" opacity=".35"/></pattern></defs>
      <rect x="24" y="46" width="152" height="126" rx="14" fill="#04120a" stroke="#4ade80" stroke-opacity=".55" stroke-width="1.5"/>
      ${glow(u, 100, 110, 80, 'a-pulse', '--dur:4s;--lo:.4')}
      <g class="a-float" style="--fy:-3px;--dur:2s" fill="#f472b6">${px}</g>
      <line x1="100" y1="84" x2="100" y2="164" stroke="#4ade80" stroke-dasharray="4 4" opacity=".4"/>
      <rect x="34" y="114" width="4" height="22" rx="1" fill="#4ade80" class="sc-padL"/>
      <rect x="162" y="114" width="4" height="22" rx="1" fill="#4ade80" class="sc-padR"/>
      <g class="sc-ballx"><rect x="42" y="122" width="5" height="5" fill="#bbf7d0" class="sc-bally"/></g>
      <rect x="24" y="46" width="152" height="126" rx="14" fill="url(#${u}sl)"/>
      <text x="100" y="190" text-anchor="middle" ${MONO} font-size="9" fill="#4ade80" class="a-blink" style="--dur:1.6s">INSERT COIN</text>`;
  };

  /* ---------- S2 · sense.ai: a website building itself ---------- */
  S.senseai = (u, r) => {
    const blocks = [
      [36, 71, 30, 5, '#a5b4fc'], [118, 72, 44, 3, '#475569'], [36, 86, 76, 9, `url(#${u}g)`], [36, 100, 60, 5, '#64748b'],
      [36, 110, 30, 10, '#8b5cf6'], [118, 84, 44, 38, '#312e81'], [36, 134, 38, 26, '#1e1b4b'], [80, 134, 38, 26, '#1e1b4b'], [124, 134, 38, 26, '#1e1b4b']
    ];
    const b = blocks.map(([x, y, w, h, fill], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h > 12 ? 4 : 2}" fill="${fill}" ${h > 20 ? 'stroke="#6366f1" stroke-opacity=".5"' : ''} class="a-build" style="--dur:7s;animation-delay:${f(i * 0.32)}s"/>`).join('');
    return bg(u, '#1e1b4b', '#05050f', '#818cf8') + stars(r, 18) + glow(u, 100, 110, 90, 'a-pulse', '--dur:5s;--lo:.4') +
      `<defs><linearGradient id="${u}g" x1="0" x2="1"><stop offset="0" stop-color="#818cf8"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>
      <rect x="28" y="52" width="144" height="116" rx="9" fill="#0d0d22" stroke="#a5b4fc" stroke-opacity=".35"/>
      <line x1="28" y1="64" x2="172" y2="64" stroke="#a5b4fc" stroke-opacity=".25"/>
      <circle cx="36" cy="58" r="2" fill="#f43f5e"/><circle cx="43" cy="58" r="2" fill="#fbbf24"/><circle cx="50" cy="58" r="2" fill="#22c55e"/>
      ${b}
      <g transform="translate(140 150)"><g class="sc-cursor"><path d="M0 0 L0 13 L3.5 9.5 L6 15 L8 14 L5.5 8.5 L10 8.5Z" fill="#fff" stroke="#0d0d22" stroke-width=".7"/></g></g>
      ${sparkle(164, 40, 8, '#e0e7ff', '--dur:2.5s')}${sparkle(40, 186, 5, '#c4b5fd', '--dur:3.2s;animation-delay:-1s')}`;
  };

  /* ---------- S3 · Banking: vault door ---------- */
  S.banking = (u, r) => {
    let bolts = '', ticks = '', coins = '';
    for (let k = 0; k < 10; k++) bolts += `<rect x="97" y="52" width="6" height="9" rx="1.5" fill="#94a3b8" transform="rotate(${k * 36} 100 108)"/>`;
    for (let k = 0; k < 24; k++) ticks += `<line x1="100" y1="88" x2="100" y2="${k % 3 ? 91 : 93}" stroke="#cbd5e1" stroke-width=".8" transform="rotate(${k * 15} 100 108)"/>`;
    for (let i = 0; i < 4; i++) coins += `<ellipse cx="154" cy="${184 - i * 6}" rx="14" ry="4" fill="#fbbf24" stroke="#b45309" class="a-pop" style="--dur:5s;animation-delay:${f(i * 0.4)}s"/>`;
    for (let i = 0; i < 3; i++) coins += `<ellipse cx="44" cy="${186 - i * 6}" rx="12" ry="3.6" fill="#fcd34d" stroke="#b45309" class="a-pop" style="--dur:5s;animation-delay:${f(1.8 + i * 0.4)}s"/>`;
    return bg(u, '#0b1b30', '#02060c', '#fbbf24') + stars(r, 20) + glow(u, 100, 108, 80, 'a-pulse', '--dur:4s;--lo:.3') +
      `<circle cx="100" cy="108" r="62" fill="#16233a" stroke="#64748b" stroke-width="3"/>
      <g class="a-spin" style="--dur:40s">${bolts}</g>
      <circle cx="100" cy="108" r="48" fill="#1e2d47" stroke="#94a3b8" stroke-width="1.5"/>
      <g class="sc-dial">
        <line x1="100" y1="108" x2="100" y2="72" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <line x1="100" y1="108" x2="131" y2="126" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <line x1="100" y1="108" x2="69" y2="126" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <circle cx="100" cy="72" r="4" fill="#e2e8f0"/><circle cx="131" cy="126" r="4" fill="#e2e8f0"/><circle cx="69" cy="126" r="4" fill="#e2e8f0"/>
        <circle cx="100" cy="108" r="21" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>${ticks}
      </g>
      <circle cx="100" cy="108" r="6" fill="#fbbf24"/>${coins}`;
  };

  /* ---------- S3 · Skinsations: database receiving records ---------- */
  S.skinsations = (u, r) => {
    let rows = '';
    for (let i = 0; i < 8; i++) {
      const side = i % 2 ? 1 : -1;
      rows += `<g transform="translate(100 72)"><rect x="-10" y="-2.5" width="20" height="5" rx="2.5" fill="${i % 3 ? '#fbcfe8' : '#f0abfc'}" class="sc-in" style="--dx:${f(side * (80 + r() * 30))}px;--dy:${f(-50 + r() * 100)}px;--dur:4s;animation-delay:-${f(i * 0.5)}s"/></g>`;
    }
    return bg(u, '#2b0d26', '#07030a', '#f472b6') + stars(r, 22) + glow(u, 100, 110, 80, 'a-pulse', '--dur:4s;--lo:.3') +
      `<g opacity=".14" stroke="#f9a8d4" fill="none"><rect x="14" y="160" width="38" height="24"/><rect x="150" y="40" width="38" height="24"/><path d="M52 172 H70 M150 52 H134"/></g>
      <path d="M58 72 V152 A42 12 0 0 0 142 152 V72" fill="#2a0f24" stroke="#f9a8d4" stroke-opacity=".7"/>
      <path d="M58 99 A42 12 0 0 0 142 99" fill="none" stroke="#f9a8d4" class="a-pulse" style="--dur:2.1s"/>
      <path d="M58 126 A42 12 0 0 0 142 126" fill="none" stroke="#f9a8d4" class="a-pulse" style="--dur:2.1s;animation-delay:-.7s"/>
      <path d="M58 152 A42 12 0 0 0 142 152" fill="none" stroke="#f9a8d4" class="a-pulse" style="--dur:2.1s;animation-delay:-1.4s"/>
      <ellipse cx="100" cy="72" rx="42" ry="12" fill="#3b1533" stroke="#f9a8d4"/>
      ${rows}
      <g class="a-throb" style="--s:1.18;--dur:2.4s"><rect x="96" y="65" width="8" height="14" rx="1.5" fill="#fb7185"/><rect x="93" y="68" width="14" height="8" rx="1.5" fill="#fb7185"/></g>`;
  };

  /* ---------- S3 · Finnovation: chart + chat ---------- */
  S.finnovation = (u, r) => {
    let candles = '', pts = [];
    for (let i = 0; i < 8; i++) {
      const x = 38 + i * 18, mid = 160 - i * 8 - r() * 8, h = 12 + r() * 14, up = r() > 0.28;
      pts.push(`${x},${f(mid)}`);
      candles += `<g class="a-grow" style="transform-origin:50% 100%;--dur:8s;animation-delay:${f(i * 0.22)}s">
        <line x1="${x}" y1="${f(mid - h / 2 - 6)}" x2="${x}" y2="${f(mid + h / 2 + 6)}" stroke="${up ? '#34d399' : '#f43f5e'}" stroke-width="1"/>
        <rect x="${x - 4}" y="${f(mid - h / 2)}" width="8" height="${f(h)}" rx="1" fill="${up ? '#34d399' : '#f43f5e'}"/></g>`;
    }
    return bg(u, '#05281c', '#020705', '#34d399') + stars(r, 16) +
      `<g stroke="#34d399" stroke-opacity=".08">${[90, 115, 140, 165, 190].map(y => `<line x1="20" y1="${y}" x2="180" y2="${y}"/>`).join('')}</g>
      ${candles}
      <polyline points="${pts.join(' ')}" fill="none" stroke="#a7f3d0" stroke-width="1.4" stroke-dasharray="200" class="a-draw" style="--len:200px;--dur:8s"/>
      <rect x="26" y="46" width="64" height="26" rx="11" fill="#0f3d2e" stroke="#34d399" stroke-opacity=".6"/>
      <path d="M36 72 L32 80 L44 72" fill="#0f3d2e"/>
      <circle cx="46" cy="59" r="2.8" fill="#a7f3d0" class="sc-typing"/><circle cx="58" cy="59" r="2.8" fill="#a7f3d0" class="sc-typing" style="animation-delay:.18s"/><circle cx="70" cy="59" r="2.8" fill="#a7f3d0" class="sc-typing" style="animation-delay:.36s"/>
      <g class="a-pop" style="--dur:6s;animation-delay:1s"><rect x="108" y="30" width="66" height="22" rx="10" fill="#34d399"/>
      <text x="141" y="44.5" text-anchor="middle" ${MONO} font-size="8" font-weight="600" fill="#022c22">grounded ✓</text></g>`;
  };

  /* ---------- S3 · TA: lightbulb with the four labs in orbit ---------- */
  S.ta = (u, r) => {
    const labs = ['PF', 'AI', 'ICT', 'Φ'];
    const tags = labs.map((t, i) => orbit(100, 104, 74, 22, 10, f(-i * 2.5),
      `<rect x="-12" y="-7.5" width="24" height="15" rx="7.5" fill="#1c1404" stroke="#fbbf24"/><text x="0" y="3" text-anchor="middle" ${MONO} font-size="8" fill="#fde68a">${t}</text>`)).join('');
    return bg(u, '#2b1b06', '#070401', '#fde68a') + stars(r, 20) + glow(u, 100, 94, 74, 'a-throb', '--dur:3s;--s:1.12') +
      `<ellipse cx="100" cy="104" rx="74" ry="22" fill="none" stroke="#fde68a" stroke-opacity=".25" stroke-dasharray="2 4"/>
      <path d="M100 62 a30 30 0 0 0 -17 54 c4 4 6 8 6 13 h22 c0-5 2-9 6-13 a30 30 0 0 0 -17 -54z" fill="#fde68a" fill-opacity=".14" stroke="#fde68a" stroke-width="2"/>
      <circle cx="100" cy="96" r="15" fill="#fde68a" class="a-pulse" style="--dur:2.2s;--lo:.15"/>
      <path d="M92 124 V108 l4 -6 l4 6 l4 -6 l4 6 V124" stroke="#fbbf24" stroke-width="2" fill="none" class="sc-flicker"/>
      <rect x="89" y="129" width="22" height="5" rx="2" fill="#a8a29e"/><rect x="90" y="135" width="20" height="5" rx="2" fill="#78716c"/><rect x="94" y="141" width="12" height="4" rx="2" fill="#57534e"/>
      ${tags}`;
  };

  /* ---------- S4 · Text Editor: 8086 terminal ---------- */
  S.texteditor = (u, r) => {
    const lines = ['ORG 100h', 'MOV AH, 0Eh', "MOV AL, 'M'", 'INT 10h', 'CMP AL, 1Bh', 'JNE edit_loop'];
    const t = lines.map((l, i) => `<text x="34" y="${84 + i * 14}" ${MONO} font-size="8.5" fill="#4ade80" class="sc-type" style="animation-delay:${f(i * 0.7)}s"><tspan fill="#166534">${String(i + 1).padStart(2, '0')}</tspan>  ${l}</text>`).join('');
    return bg(u, '#03160b', '#000000', '#22c55e') + stars(r, 12, 0, 40) +
      `<rect x="22" y="48" width="156" height="128" rx="8" fill="#020a05" stroke="#22c55e" stroke-opacity=".5"/>
      ${glow(u, 100, 112, 90, 'a-pulse', '--dur:3s;--lo:.25')}
      <text x="32" y="60" ${MONO} font-size="7" fill="#4ade80" opacity=".7">EDIT.ASM</text>
      <line x1="22" y1="66" x2="178" y2="66" stroke="#22c55e" stroke-opacity=".3"/>
      ${t}<rect x="34" y="164" width="6" height="9" fill="#4ade80" class="a-blink" style="--dur:1s"/>`;
  };

  /* ---------- S4 · AfterLight: a child-bot projecting memories of the old city ---------- */
  S.afterlight = (u, r) => {
    let dust = '';
    for (let i = 0; i < 14; i++) dust += `<circle cx="${f(10 + r() * 180)}" cy="${f(130 + r() * 70)}" r="${f(0.5 + r())}" fill="#fdba74" class="a-rise" style="--dur:${f(7 + r() * 6)}s;animation-delay:-${f(r() * 10)}s;--dx:${f(15 + r() * 25)}px;--dy:-${f(50 + r() * 50)}px;--rot:0deg"/>`;
    const holo = [[52, 98, 14, 32], [68, 82, 16, 48], [86, 72, 12, 58], [100, 88, 18, 42], [120, 78, 14, 52], [136, 94, 14, 36]]
      .map(([x, y, w, h]) => {
        let wins = '';
        for (let yy = y + 5; yy < y + h - 4; yy += 7) for (let xx = x + 3; xx < x + w - 3; xx += 5) wins += `<rect x="${xx}" y="${yy}" width="2" height="2.5" fill="#67e8f9" opacity=".55"/>`;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#67e8f9" fill-opacity=".06" stroke="#67e8f9" stroke-opacity=".8" stroke-width=".8"/>${wins}`;
      }).join('');
    const person = (x) => `<circle cx="${x}" cy="124" r="1.6" fill="#a5f3fc"/><path d="M${x} 126 v4 M${x - 1.6} 131 l1.6 -2 1.6 2" stroke="#a5f3fc" stroke-width="1" fill="none" stroke-linecap="round"/>`;
    return `<defs>
        <linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120a24"/><stop offset=".35" stop-color="#341036"/><stop offset=".55" stop-color="#9a3412"/><stop offset=".62" stop-color="#2a0f12"/><stop offset="1" stop-color="#050203"/></linearGradient>
        <radialGradient id="${u}sun"><stop offset="0" stop-color="#fef3c7"/><stop offset=".25" stop-color="#fdba74"/><stop offset=".6" stop-color="#f97316" stop-opacity=".45"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/></radialGradient>
        <linearGradient id="${u}bm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#67e8f9" stop-opacity=".4"/><stop offset="1" stop-color="#67e8f9" stop-opacity=".02"/></linearGradient>
        <clipPath id="${u}hc"><rect x="48" y="66" width="108" height="68"/></clipPath>
      </defs>
      <rect x="-400" width="1000" height="300" fill="url(#${u}sky)"/>${stars(r, 24, 0, 80)}
      <g class="a-throb" style="--dur:7s;--s:1.06"><circle cx="100" cy="168" r="70" fill="url(#${u}sun)"/></g>
      <g class="sc-drift"><path d="M-20 160 V142 H-4 V128 L2 122 L8 130 V142 H18 V120 H28 L32 116 V140 H44 V134 H54 V150 H150 V132 H158 V118 L164 112 L168 122 V140 H180 V126 H192 L196 132 V144 H220 V170 H-20Z" fill="#2a1030" opacity=".85"/></g>
      <polygon points="69,150 50,134 154,134" fill="url(#${u}bm)" class="a-pulse" style="--dur:2.6s;--lo:.5"/>
      <g class="sc-holo">
        ${holo}${person(78)}${person(112)}${person(140)}
        <line x1="48" y1="134" x2="156" y2="134" stroke="#67e8f9" stroke-opacity=".8"/>
        <g clip-path="url(#${u}hc)"><g class="a-scan" style="--sy:66px;--dur:3.2s"><rect x="48" y="66" width="108" height="2" fill="#a5f3fc" opacity=".8"/></g></g>
      </g>
      <path d="M-400 300 V172 H20 L28 158 H92 L98 166 H130 L140 176 H600 V300Z" fill="#0b0507"/>
      <path d="M150 176 L156 168 L166 170 L172 176Z" fill="#160a0c"/>
      <g class="a-throb" style="--dur:3s;--s:1.15">
        <path d="M160 170 C160 164 159 160 160 156" stroke="#4ade80" stroke-width="1.4" fill="none"/>
        <ellipse cx="156.5" cy="159" rx="3.5" ry="1.6" fill="#4ade80" transform="rotate(-30 156.5 159)"/>
        <ellipse cx="163" cy="157" rx="3.5" ry="1.6" fill="#86efac" transform="rotate(30 163 157)"/>
      </g>
      <g class="a-sway" style="transform-origin:50% 0%;--sw:12deg;--dur:2.8s">
        <path d="M61 158 v10 M71 158 v10" stroke="#3b4252" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="61" cy="169.5" rx="3" ry="1.6" fill="#67e8f9" opacity=".5"/><ellipse cx="71" cy="169.5" rx="3" ry="1.6" fill="#67e8f9" opacity=".5"/>
      </g>
      <rect x="57" y="146" width="18" height="13" rx="4" fill="#1f2433" stroke="#67e8f9" stroke-opacity=".6"/>
      <circle cx="66" cy="152" r="1.6" fill="#f472b6" class="a-pulse" style="--dur:1.6s"/>
      <g class="a-float" style="--fy:-1.5px;--dur:3s">
        <rect x="55" y="128" width="22" height="17" rx="6" fill="#1f2433" stroke="#67e8f9"/>
        <circle cx="69" cy="136" r="3.4" fill="#67e8f9"/><circle cx="69" cy="136" r="6" fill="#67e8f9" opacity=".25" class="a-pulse" style="--dur:2.6s"/>
        <line x1="62" y1="128" x2="60" y2="121" stroke="#67e8f9"/><circle cx="60" cy="120" r="1.6" fill="#f472b6" class="a-pulse" style="--dur:1.2s"/>
      </g>${dust}`;
  };

  /* ---------- S4 · Grantify: radar sweep synced with blips ---------- */
  S.grantify = (u, r) => {
    let blips = '';
    const DUR = 4;
    for (let i = 0; i < 16; i++) {
      const ang = r() * 360, rad = 12 + r() * 50;
      const x = 100 + Math.sin(ang * Math.PI / 180) * rad, y = 108 - Math.cos(ang * Math.PI / 180) * rad;
      const hit = (((ang - 60) % 360) + 360) % 360 / 360 * DUR;
      blips += `<circle cx="${f(x)}" cy="${f(y)}" r="2.2" fill="${i % 5 === 0 ? '#fbbf24' : '#7dd3fc'}" class="sc-blip" style="--dur:${DUR}s;animation-delay:${f(hit - DUR)}s"/>`;
    }
    return bg(u, '#071a33', '#02060d', '#38bdf8') + stars(r, 18) +
      `<defs><linearGradient id="${u}sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8" stop-opacity="0"/><stop offset="1" stop-color="#38bdf8" stop-opacity=".55"/></linearGradient></defs>
      <g fill="none" stroke="#38bdf8" stroke-opacity=".28"><circle cx="100" cy="108" r="22"/><circle cx="100" cy="108" r="44"/><circle cx="100" cy="108" r="66"/>
      <line x1="34" y1="108" x2="166" y2="108"/><line x1="100" y1="42" x2="100" y2="174"/></g>
      <g class="a-spin" style="--dur:${DUR}s;transform-box:view-box;transform-origin:100px 108px">
        <path d="M100 108 L100 42 A66 66 0 0 1 157.2 75 Z" fill="url(#${u}sw)"/>
        <line x1="100" y1="108" x2="157.2" y2="75" stroke="#7dd3fc" stroke-width="1.5"/>
      </g>${blips}<circle cx="100" cy="108" r="3" fill="#7dd3fc"/>
      <text x="100" y="194" text-anchor="middle" ${MONO} font-size="7" fill="#7dd3fc" class="a-pulse" style="--dur:2s;--lo:.4">SCANNING 280 SOURCES</text>`;
  };

  /* ---------- S4 · Women Empowerment Training: network forming ---------- */
  S.wet = (u, r) => {
    const nodes = [[100, 104]];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 - Math.PI / 2, rad = 46 + r() * 14;
      nodes.push([f(100 + Math.cos(a) * rad), f(104 + Math.sin(a) * rad * 0.9)]);
    }
    let edges = '', dots = '';
    const line = (a, b, i) => {
      const len = Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1]));
      return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#f0abfc" stroke-opacity=".55" stroke-width="1" stroke-dasharray="${len}" class="a-draw" style="--len:${len}px;--dur:7s;animation-delay:${f(i * 0.25)}s"/>`;
    };
    for (let i = 1; i < nodes.length; i++) { edges += line(nodes[0], nodes[i], i); edges += line(nodes[i], nodes[i % 7 + 1], i + 7); }
    nodes.forEach((n, i) => { dots += `<circle cx="${n[0]}" cy="${n[1]}" r="${i ? 4 : 7}" fill="${i % 2 ? '#67e8f9' : '#f0abfc'}" class="a-pulse" style="--dur:${f(2 + r() * 2)}s;animation-delay:-${f(r() * 3)}s;--lo:.5"/>`; });
    const bars = [14, 22, 32].map((h, i) => `<rect x="${32 + i * 10}" y="${186 - h}" width="7" height="${h}" rx="1.5" fill="#e879f9" class="a-grow" style="transform-origin:50% 100%;--dur:7s;animation-delay:${f(1 + i * 0.3)}s"/>`).join('');
    return bg(u, '#2b0a2c', '#070208', '#f0abfc') + stars(r, 22) + glow(u, 100, 104, 70, 'a-pulse', '--dur:4s;--lo:.3') +
      edges + `<circle cx="100" cy="104" r="7" fill="none" stroke="#f0abfc" class="a-ripple" style="--dur:2.6s;--s:3"/>` + dots + bars;
  };

  /* ---------- S5 · Osso.ai: atom over the MERN stack ---------- */
  S.osso = (u, r) => {
    const electrons = [0, 60, 120].map((a, i) =>
      `<g transform="rotate(${a} 100 100)">${orbit(100, 100, 50, 18, 3 + i * 0.6, f(-i), '<circle r="3.2" fill="#e0f2fe"/>')}</g>`).join('');
    const tiles = ['M', 'E', 'R', 'N'].map((l, i) => `<g><rect x="${48 + i * 28}" y="162" width="22" height="22" rx="5" fill="#0f2740" stroke="#61dafb" stroke-opacity=".5"/>
      <rect x="${48 + i * 28}" y="162" width="22" height="22" rx="5" fill="#61dafb" class="a-pulse" style="--dur:4s;--lo:0;animation-delay:${i}s" opacity=".3"/>
      <text x="${59 + i * 28}" y="177" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="600" font-size="11" fill="#e0f2fe">${l}</text></g>`).join('');
    return bg(u, '#0a1b30', '#02050a', '#61dafb') + stars(r, 22) + glow(u, 100, 100, 70, 'a-throb', '--dur:4s') +
      `<g fill="none" stroke="#61dafb" stroke-width="1.6" opacity=".85"><ellipse cx="100" cy="100" rx="50" ry="18"/><ellipse cx="100" cy="100" rx="50" ry="18" transform="rotate(60 100 100)"/><ellipse cx="100" cy="100" rx="50" ry="18" transform="rotate(120 100 100)"/></g>
      <circle cx="100" cy="100" r="7" fill="#61dafb"/>${electrons}${tiles}`;
  };

  /* ---------- S5 · APAC Cybersecurity Clinic: globe + shield ---------- */
  S.apac = (u, r) => {
    let lon = '', nodes = '';
    for (let i = 0; i < 4; i++) lon += `<ellipse cx="100" cy="104" rx="48" ry="48" fill="none" stroke="#fb7185" stroke-opacity=".3" class="sc-lon" style="animation-delay:-${i * 1.5}s"/>`;
    for (let i = 0; i < 9; i++) {
      const a = r() * Math.PI * 2, rad = r() * 42;
      nodes += `<circle cx="${f(100 + Math.cos(a) * rad)}" cy="${f(104 + Math.sin(a) * rad)}" r="1.8" fill="#fecdd3" class="a-pulse" style="--dur:${f(1.5 + r() * 2)}s;animation-delay:-${f(r() * 3)}s;--lo:.1"/>`;
    }
    const shield = 'M100 72 L124 81 V101 C124 118 113 129 100 135 C87 129 76 118 76 101 V81 Z';
    return bg(u, '#2c0a14', '#070205', '#fb7185') + stars(r, 20) + glow(u, 100, 104, 70) +
      `<circle cx="100" cy="104" r="48" fill="#14060b" stroke="#fb7185" stroke-opacity=".55"/>
      <g fill="none" stroke="#fb7185" stroke-opacity=".22"><ellipse cx="100" cy="104" rx="48" ry="12"/><ellipse cx="100" cy="84" rx="42" ry="9"/><ellipse cx="100" cy="124" rx="42" ry="9"/></g>
      ${lon}${nodes}
      ${[0, 1, 2].map(i => `<path d="${shield}" fill="none" stroke="#fb7185" stroke-width="1.5" class="a-ripple" style="--dur:3s;--s:1.7;animation-delay:${i}s"/>`).join('')}
      <path d="${shield}" fill="#1a070d" stroke="#fb7185" stroke-width="2"/>
      <path d="M89 103 l8 8 l15 -16" stroke="#fecdd3" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };

  /* ---------- S5 · Enmawae Studio: a boutique at night ---------- */
  S.enmawae = (u, r) => {
    const stripes = Array.from({ length: 7 }, (_, i) => {
      const x = 30 + i * 20, col = i % 2 ? '#7f1d1d' : '#e5c07b';
      return `<rect x="${x}" y="62" width="20" height="12" fill="${col}"/><path d="M${x} 74 a10 6 0 0 0 20 0Z" fill="${col}"/>`;
    }).join('');
    const cone = (x) => `<polygon points="${x},84 ${x - 20},162 ${x + 20},162" fill="url(#${u}sp)" class="a-pulse" style="--dur:4s;--lo:.6"/>`;
    return `<defs>
        <linearGradient id="${u}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17110a"/><stop offset="1" stop-color="#040302"/></linearGradient>
        <radialGradient id="${u}gl"><stop offset="0" stop-color="#fbbf24" stop-opacity=".45"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
        <linearGradient id="${u}sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a" stop-opacity=".45"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></linearGradient>
        <radialGradient id="${u}wn" cx="50%" cy="10%" r="90%"><stop offset="0" stop-color="#3a2a12"/><stop offset="1" stop-color="#0d0a07"/></radialGradient>
      </defs>
      <rect x="-400" width="1000" height="300" fill="url(#${u}bg)"/>${stars(r, 22, 0, 60)}
      ${glow(u, 100, 120, 80, 'a-pulse', '--dur:5s;--lo:.35')}
      <rect x="28" y="52" width="144" height="6" fill="#2a1f10"/>
      <rect x="34" y="58" width="132" height="132" fill="#15100a" stroke="#e5c07b" stroke-opacity=".3"/>
      <line x1="76" y1="52" x2="78" y2="44" stroke="#e5c07b" stroke-opacity=".6"/><line x1="124" y1="52" x2="122" y2="44" stroke="#e5c07b" stroke-opacity=".6"/>
      <rect x="60" y="32" width="80" height="14" rx="3" fill="#0b0805" stroke="#e5c07b" stroke-opacity=".8"/>
      <text x="100" y="42" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="600" font-size="8" letter-spacing="2.6" fill="#fde68a" class="sc-flicker">ENMAWAE</text>
      ${stripes}
      <rect x="44" y="84" width="112" height="84" rx="3" fill="url(#${u}wn)" stroke="#e5c07b" stroke-opacity=".6"/>
      ${cone(70)}${cone(122)}
      <g class="a-sway" style="transform-origin:50% 100%;--sw:3deg;--dur:6s">
        <circle cx="70" cy="96" r="3" fill="#e5c07b"/><rect x="68.5" y="98" width="3" height="5" fill="#d6c3a5"/>
        <path d="M60 106 Q64 102 70 102 Q76 102 80 106 L88 156 H52 Z" fill="#7f1d1d"/>
        <path d="M62 112 Q70 116 78 112" stroke="#fca5a5" stroke-opacity=".5" fill="none"/>
        <line x1="70" y1="156" x2="70" y2="162" stroke="#e5c07b"/><ellipse cx="70" cy="163" rx="9" ry="2" fill="#e5c07b"/>
      </g>
      <g class="a-sway" style="transform-origin:50% 100%;--sw:3deg;--dur:6s;animation-delay:-3s">
        <circle cx="122" cy="96" r="3" fill="#e5c07b"/><rect x="120.5" y="98" width="3" height="5" fill="#d6c3a5"/>
        <path d="M116 103 L122 118 L128 103 Z" fill="#f1f5f9"/>
        <path d="M108 106 Q114 102 116 103 L122 118 L128 103 Q130 102 136 106 L134 156 H110 Z" fill="#0f172a" stroke="#e5c07b" stroke-opacity=".5"/>
        <path d="M122 106 L117 103.5 V108.5 Z M122 106 L127 103.5 V108.5 Z" fill="#be123c"/>
        <circle cx="122" cy="132" r="1.4" fill="#e5c07b"/><circle cx="122" cy="142" r="1.4" fill="#e5c07b"/>
        <line x1="122" y1="156" x2="122" y2="162" stroke="#e5c07b"/><ellipse cx="122" cy="163" rx="9" ry="2" fill="#e5c07b"/>
      </g>
      <g class="a-pop" style="--dur:4s;animation-delay:1.4s"><rect x="126" y="130" width="46" height="10" rx="5" fill="#14532d"/>
        <text x="149" y="137.3" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5.5" fill="#86efac">✓ tests pass</text></g>
      <g class="a-float" style="--fy:-3px;--dur:4s">
        <rect x="120" y="144" width="62" height="44" rx="7" fill="#fffaf0"/>
        <rect x="126" y="150" width="16" height="22" rx="2" fill="#7f1d1d"/>
        <text x="146" y="156" font-family="'Space Grotesk', sans-serif" font-weight="600" font-size="6" fill="#1c1917">Gown</text>
        <text x="146" y="164" font-family="'JetBrains Mono', monospace" font-size="5" fill="#78716c">Rs 24,900</text>
        <g class="sc-press"><rect x="146" y="170" width="30" height="10" rx="5" fill="#b45309"/>
        <text x="161" y="177" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="600" font-size="5.5" fill="#fff">Add</text></g>
      </g>
      <g transform="translate(176 200)"><g class="sc-click"><path d="M0 0 L0 11 L3 8 L5 12.5 L6.8 11.7 L4.8 7.3 L8.5 7.3Z" fill="#fff" stroke="#1c1917" stroke-width=".6"/></g></g>
      <g transform="translate(176 22)">
        <path d="M-9 -4 H-6 L-3 6 H6 L8 -1 H-5" stroke="#e5c07b" stroke-width="1.4" fill="none" stroke-linejoin="round"/>
        <circle cx="-2" cy="9" r="1.4" fill="#e5c07b"/><circle cx="5" cy="9" r="1.4" fill="#e5c07b"/>
        <circle cx="8" cy="-6" r="5" fill="#e11d48"/>
        <text x="8" y="-3.8" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="6" fill="#fff" class="sc-badgeA">1</text>
        <text x="8" y="-3.8" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="6" fill="#fff" class="sc-badgeB">2</text>
      </g>`;
  };

  /* ---------- S5 · AI-Generated Image Detection: scan + Grad-CAM ---------- */
  S.imagedetect = (u, r) =>
    bg(u, '#0a1222', '#020308', '#22d3ee') + stars(r, 18) +
    `<defs><radialGradient id="${u}hm"><stop offset="0" stop-color="#ef4444" stop-opacity=".85"/><stop offset=".45" stop-color="#f59e0b" stop-opacity=".5"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
      <linearGradient id="${u}sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity="0"/><stop offset="1" stop-color="#22d3ee" stop-opacity=".35"/></linearGradient>
      <clipPath id="${u}fr"><rect x="48" y="44" width="104" height="132" rx="6"/></clipPath></defs>
    <rect x="48" y="44" width="104" height="132" rx="6" fill="#0b1424" stroke="#64748b"/>
    <g clip-path="url(#${u}fr)">
      <path d="M60 178 C62 148 80 138 100 138 C120 138 138 148 140 178Z" fill="#1e293b"/>
      <circle cx="100" cy="100" r="24" fill="#243146"/>
      <path d="M76 98 C76 70 124 70 124 98 C118 84 82 84 76 98Z" fill="#334155"/>
      <circle cx="84" cy="80" r="20" fill="url(#${u}hm)" class="a-pulse" style="--dur:3s;--lo:.15"/>
      <circle cx="122" cy="86" r="16" fill="url(#${u}hm)" class="a-pulse" style="--dur:3s;--lo:.15;animation-delay:-1s"/>
      <circle cx="64" cy="150" r="18" fill="url(#${u}hm)" class="a-pulse" style="--dur:3s;--lo:.15;animation-delay:-2s"/>
      <g class="a-scan" style="--sy:128px;--dur:3.6s"><rect x="48" y="34" width="104" height="10" fill="url(#${u}sc)"/><rect x="48" y="44" width="104" height="1.6" fill="#22d3ee"/></g>
    </g>
    <g stroke="#22d3ee" stroke-width="2" fill="none"><path d="M44 54 V40 H58"/><path d="M142 40 H156 V54"/><path d="M44 166 V180 H58"/><path d="M142 180 H156 V166"/></g>
    <rect x="70" y="186" width="60" height="13" rx="6.5" fill="#020617" stroke="#22d3ee"/>
    <text x="100" y="195" text-anchor="middle" ${MONO} font-size="7" fill="#f87171" class="sc-swapA">AI-GENERATED</text>
    <text x="100" y="195" text-anchor="middle" ${MONO} font-size="7" fill="#4ade80" class="sc-swapB">REAL</text>`;

  /* ---------- S5 · SUID misconfigurations: lock pops ---------- */
  S.suid = (u, r) =>
    bg(u, '#121c05', '#030500', '#a3e635') + stars(r, 18) + glow(u, 100, 118, 70, 'a-pulse', '--dur:4s;--lo:.3') +
    `<text x="100" y="64" text-anchor="middle" ${MONO} font-size="13" fill="#d9f99d">-rw<tspan fill="#f43f5e" class="a-fpulse">s</tspan>r-xr-x</text>
    <g class="sc-unlock"><path d="M84 112 V96 a16 16 0 0 1 32 0 V112" stroke="#a3e635" stroke-width="6" fill="none" stroke-linecap="round"/></g>
    <rect x="72" y="108" width="56" height="46" rx="9" fill="#1a2e05" stroke="#a3e635" stroke-width="2"/>
    <circle cx="100" cy="126" r="5" fill="#a3e635"/><rect x="98" y="128" width="4" height="12" rx="2" fill="#a3e635"/>
    <text x="100" y="182" text-anchor="middle" ${MONO} font-size="10" fill="#bef264" class="sc-swapA">$ whoami</text>
    <text x="100" y="182" text-anchor="middle" ${MONO} font-size="10" fill="#f43f5e" class="sc-swapB"># root</text>`;

  /* ---------- S6 · Umeed-e-Zann: SOS with a 3-second ring ---------- */
  S.umeed = (u, r) =>
    bg(u, '#3a0a1f', '#0a0206', '#fb7185') + stars(r, 20) + glow(u, 100, 108, 70) +
    `<rect x="60" y="40" width="80" height="148" rx="14" fill="#12060c" stroke="#f9a8d4" stroke-opacity=".7"/>
    <rect x="88" y="45" width="24" height="4" rx="2" fill="#2a0a16"/>
    <text x="100" y="70" text-anchor="middle" font-size="11" fill="#fda4af" font-family="'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif" direction="rtl">امیدِ زن</text>
    ${[0, 0.8, 1.6].map(d => `<circle cx="100" cy="110" r="20" fill="none" stroke="#fb7185" stroke-width="1.5" class="a-ripple" style="--dur:2.4s;--s:2.1;animation-delay:${d}s"/>`).join('')}
    <circle cx="100" cy="110" r="27" fill="none" stroke="#fecdd3" stroke-opacity=".25" stroke-width="2.5"/>
    <g transform="rotate(-90 100 110)"><circle cx="100" cy="110" r="27" fill="none" stroke="#fecdd3" stroke-width="2.5" stroke-dasharray="170" stroke-linecap="round" class="sc-count"/></g>
    <circle cx="100" cy="110" r="20" fill="#e11d48"/>
    <text x="100" y="114" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="11" fill="#fff">SOS</text>
    <g fill="#2a0a16" stroke="#f9a8d4" stroke-opacity=".5"><circle cx="78" cy="160" r="9"/><circle cx="100" cy="160" r="9"/><circle cx="122" cy="160" r="9"/></g>
    <path d="M78 164 c-4-3-6-5-6-7.5 a2.6 2.6 0 0 1 6-1.2 a2.6 2.6 0 0 1 6 1.2 c0 2.5-2 4.5-6 7.5z" fill="#fb7185"/>
    <path d="M94 157 h12 M100 155 v9 M96 157 l-2 4 h4z M104 157 l-2 4 h4z" stroke="#fda4af" stroke-width="1" fill="none"/>
    <path d="M122 165 c-3-4-4.5-6-4.5-8 a4.5 4.5 0 0 1 9 0 c0 2-1.5 4-4.5 8z" fill="#fda4af"/><circle cx="122" cy="157" r="1.5" fill="#2a0a16"/>`;

  /* ---------- S6 · CipherChain: a cryptex that rolls to FLAG!, its cipher halo and the chain ---------- */
  S.cipherchain = (u, r) => {
    const C = { x: 100, y: 104 };
    // Cryptex: brass caps and five letter rings that roll into place spelling FLAG!
    const WORD = ['F', 'L', 'A', 'G', '!'];
    const GLYPHS = 'ABCDEF0123456789XZK';
    const rings = WORD.map((ch, i) => {
      const x = f(66 + i * 13.6), land = 9 + (i % 3);
      let col = '';
      for (let j = 0; j < 14; j++) col += `<tspan x="${f(+x + 6.5)}" dy="${j ? 11 : 0}">${j === land ? ch : GLYPHS[(r() * GLYPHS.length) | 0]}</tspan>`;
      return `<rect x="${x}" y="88" width="13" height="32" rx="3" fill="url(#${u}ring)"/>
        <g clip-path="url(#${u}rc${i})"><text y="108" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-weight="500" font-size="11" fill="#e0e7ff" class="sc-roll" style="--to:-${land * 11}px;animation-delay:${f(i * 0.12)}s">${col}</text></g>
        <rect x="${x}" y="88" width="13" height="32" rx="3" fill="#fde68a" class="sc-solved"/>
        <rect x="${x}" y="88" width="13" height="32" rx="3" fill="url(#${u}cyl)"/>`;
    }).join('');
    const ringClips = WORD.map((_, i) => `<clipPath id="${u}rc${i}"><rect x="${f(66 + i * 13.6)}" y="88" width="13" height="32" rx="3"/></clipPath>`).join('');
    const cap = (side) => {
      const x = side < 0 ? 50 : 134, knob = side < 0 ? 45 : 150;
      return `<g class="${side < 0 ? 'sc-capL' : 'sc-capR'}">
        <rect x="${knob}" y="95" width="5" height="18" rx="2" fill="#b45309"/>
        <rect x="${x}" y="85" width="16" height="38" rx="5" fill="url(#${u}brass)"/>
        <g stroke="#78350f" stroke-opacity=".55">${[4, 8, 12].map(d => `<line x1="${x + d}" y1="88" x2="${x + d}" y2="120"/>`).join('')}</g>
        <rect x="${x + 2}" y="87" width="12" height="3" rx="1.5" fill="#fff" opacity=".35"/></g>`;
    };
    const cryptex = `${cap(-1)}${cap(1)}
      <rect x="64" y="86" width="72" height="36" rx="4" fill="#0b0a24"/>
      ${rings}
      <line x1="64" y1="104" x2="136" y2="104" stroke="#fde68a" stroke-opacity=".25" stroke-dasharray="1 2"/>
      <rect x="64" y="86" width="72" height="36" rx="4" fill="none" stroke="#c7d2fe" stroke-opacity=".5"/>`;

    // Cipher halo: hex text running around two counter-rotating rings
    const hex = n => Array.from({ length: n }, () => (r() * 255 | 0).toString(16).padStart(2, '0')).join(' ');

    // Orbiting blocks, drawn twice: once behind the gem (far side) and once in front (near side)
    const cube = s => `
      <polygon points="${-s},${-s / 2} 0,0 0,${s} ${-s},${s / 2}" fill="#4338ca"/>
      <polygon points="0,0 ${s},${-s / 2} ${s},${s / 2} 0,${s}" fill="#2e2a7a"/>
      <polygon points="0,${-s} ${s},${-s / 2} 0,0 ${-s},${-s / 2}" fill="#c7d2fe"/>
      <path d="M0 ${-s} L${s} ${-s / 2} V${s / 2} L0 ${s} L${-s} ${s / 2} V${-s / 2} Z M0 0 V${s} M0 0 L${s} ${-s / 2} M0 0 L${-s} ${-s / 2}" fill="none" stroke="#e0e7ff" stroke-opacity=".55" stroke-width=".5"/>
      <polygon points="0,${-s} ${s},${-s / 2} 0,0 ${-s},${-s / 2}" fill="#fde68a" class="sc-lit"/>`;
    const blocks = clip => `<g clip-path="url(#${u}${clip})">${Array.from({ length: 4 }, (_, i) => `
      <g transform="translate(100 112)"><g class="a-ox" style="--ax:82px;--dur:16s;--ph:${f(-i * 4)}s">
        <g class="a-oy" style="--ay:24px;--dur:16s;--ph:${f(-i * 4)}s"><g class="sc-depth" style="--dur:16s;--ph:${f(-i * 4)}s">
          <g style="animation-delay:${f(i * 0.5)}s">${cube(6)}</g>
        </g></g></g></g>`).join('')}</g>`;
    const orbitRing = clip => `<g clip-path="url(#${u}${clip})">
      <ellipse cx="100" cy="112" rx="82" ry="24" fill="none" stroke="#e0e7ff" stroke-opacity=".45" stroke-width=".8" stroke-dasharray="3 7" class="a-dash" style="--off:-20px;--dur:1.4s"/></g>`;

    // Solve moment (every 6s): sparks burst as the cryptex opens
    let sparks = '';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + r() * 0.3, d = 34 + r() * 40;
      sparks += `<circle cx="${C.x}" cy="${C.y}" r="${f(1 + r() * 1.2)}" fill="${i % 3 ? '#fde68a' : '#e0e7ff'}" class="sc-burst" style="--dx:${f(Math.cos(a) * d)}px;--dy:${f(Math.sin(a) * d)}px"/>`;
    }

    const hashes = ['keccak256(answer)', '0x9f3c…e21b', '✓ solved'];

    return `<defs>
        <linearGradient id="${u}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0b36"/><stop offset=".55" stop-color="#080622"/><stop offset="1" stop-color="#020208"/></linearGradient>
        <radialGradient id="${u}gl"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".6"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
        <radialGradient id="${u}fx"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#e0e7ff" stop-opacity=".8"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></radialGradient>
        <linearGradient id="${u}brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fef3c7"/><stop offset=".35" stop-color="#f59e0b"/><stop offset="1" stop-color="#78350f"/></linearGradient>
        <linearGradient id="${u}ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f46e5"/><stop offset=".5" stop-color="#312e81"/><stop offset="1" stop-color="#14123d"/></linearGradient>
        <linearGradient id="${u}cyl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset=".32" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".08"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></linearGradient>
        <linearGradient id="${u}beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff7ed" stop-opacity=".95"/><stop offset=".4" stop-color="#fde68a" stop-opacity=".45"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></linearGradient>
        <linearGradient id="${u}fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#818cf8" stop-opacity=".3"/><stop offset="1" stop-color="#818cf8" stop-opacity="0"/></linearGradient>
        <linearGradient id="${u}pil" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c4b5fd" stop-opacity=".9"/><stop offset="1" stop-color="#c4b5fd" stop-opacity="0"/></linearGradient>
        <linearGradient id="${u}ped" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#312e81"/><stop offset="1" stop-color="#0f0c2e"/></linearGradient>
        <path id="${u}r1" d="M100 38 a66 66 0 1 1 0 132 a66 66 0 1 1 0 -132"/>
        <path id="${u}r2" d="M100 52 a52 52 0 1 0 0 104 a52 52 0 1 0 0 -104"/>
        ${ringClips}
        <clipPath id="${u}back"><rect x="-400" y="0" width="1000" height="112"/></clipPath>
        <clipPath id="${u}front"><rect x="-400" y="112" width="1000" height="200"/></clipPath>
      </defs>
      <rect x="-400" width="1000" height="300" fill="url(#${u}bg)"/>
      ${stars(r, 20, 0, 150)}
      <rect x="-400" y="157" width="1000" height="1" fill="#a78bfa" opacity=".18"/>
      ${glow(u, C.x, C.y, 84, 'a-throb', '--dur:4s;--s:1.08')}

      <g class="a-spin" style="--dur:60s;transform-box:view-box;transform-origin:100px 104px">
        <circle cx="100" cy="104" r="66" fill="none" stroke="#a5b4fc" stroke-opacity=".12"/>
        <text font-family="'JetBrains Mono', monospace" font-size="6.2" fill="#a5b4fc" opacity=".24" letter-spacing=".4"><textPath href="#${u}r1">${hex(36)}</textPath></text>
      </g>

      ${orbitRing('back')}${blocks('back')}

      <ellipse cx="100" cy="156" rx="40" ry="8" fill="#1e1b4b" opacity=".8"/>
      <ellipse cx="100" cy="156" rx="40" ry="8" fill="none" stroke="#c7d2fe" stroke-opacity=".55"/>
      <ellipse cx="100" cy="156" rx="54" ry="11" fill="none" stroke="#a78bfa" stroke-opacity=".35" stroke-dasharray="4 6" class="a-dash" style="--off:-20px;--dur:2s"/>

      <polygon points="90,104 110,104 124,8 76,8" fill="url(#${u}beam)" class="sc-beam"/>
      <g class="a-float" style="--fy:-4px;--dur:4s">
        <rect x="44" y="82" width="112" height="44" rx="10" fill="#8b5cf6" opacity=".18"/>
        ${cryptex}
      </g>

      ${orbitRing('front')}${blocks('front')}

      <circle cx="${C.x}" cy="${C.y}" r="34" fill="url(#${u}fx)" class="sc-flash"/>
      <circle cx="${C.x}" cy="${C.y}" r="12" fill="none" stroke="#fde68a" stroke-width="1.5" vector-effect="non-scaling-stroke" class="sc-flashring"/>
      ${sparks}
      <rect x="58" y="176" width="84" height="15" rx="7.5" fill="#0b0a24" stroke="#818cf8" stroke-opacity=".5"/>
      ${hashes.map((h, i) => `<text x="100" y="186.5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7" fill="${i === 2 ? '#86efac' : '#c7d2fe'}" class="sc-cyc" style="animation-delay:-${[0, 4, 2][i]}s">${h}</text>`).join('')}`;
  };

  /* ---------- S6 · Head of Neural Nova: signals through a network ---------- */
  S.neuralnova = (u, r) => {
    const L = [[40, [78, 104, 130]], [80, [64, 90, 116, 142]], [120, [64, 90, 116, 142]], [160, [90, 118]]];
    let edges = '', sig = '', nodes = '', rays = '';
    for (let l = 0; l < L.length - 1; l++) {
      const [x1, ys1] = L[l], [x2, ys2] = L[l + 1];
      ys1.forEach(y1 => ys2.forEach(y2 => {
        edges += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c4b5fd" stroke-opacity=".16" stroke-width=".7"/>`;
        if (r() > 0.55) {
          const len = Math.ceil(Math.hypot(x2 - x1, y2 - y1));
          sig += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f0abfc" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="6 ${len + 10}" class="a-dash" style="--off:-${len + 6}px;--dur:2.4s;animation-delay:${f(l * 0.8 - 2.4)}s"/>`;
        }
      }));
    }
    L.forEach(([x, ys], l) => ys.forEach(y => {
      nodes += `<circle cx="${x}" cy="${y}" r="5" fill="#1a0633" stroke="#e9d5ff" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="2.6" fill="#f0abfc" class="a-pulse" style="--dur:2.4s;--lo:.15;animation-delay:${f(l * 0.8 - 2.4)}s"/>`;
    }));
    for (let k = 0; k < 16; k++) rays += `<polygon points="100,104 97,20 103,20" fill="#e9d5ff" opacity=".07" transform="rotate(${k * 22.5} 100 104)"/>`;
    return bg(u, '#1a0633', '#050110', '#c084fc') + stars(r, 22) + glow(u, 100, 104, 70, 'a-throb', '--dur:3s;--s:1.15') +
      `<g class="a-spin" style="--dur:50s">${rays}</g>${edges}${sig}${nodes}`;
  };

  /* ---------- S6 · Cyber Fest CTF: the flag planted on the #1 podium ---------- */
  S.ctf = (u, r) => {
    let rain = '';
    for (let c = 0; c < 8; c++) {
      let col = '';
      const glyphs = 'flag{1st}0x7f'.split('');
      for (let k = 0; k < 7; k++) col += `<tspan x="${f(10 + c * 26)}" dy="12">${glyphs[(r() * glyphs.length) | 0]}</tspan>`;
      rain += `<text y="0" font-family="'JetBrains Mono', monospace" font-size="8" fill="#fbbf24" opacity=".13" class="a-fall" style="--dur:${f(8 + r() * 6)}s;animation-delay:-${f(r() * 12)}s;--fy0:-90px;--fy1:310px;--rot:0deg">${col}</text>`;
    }
    const firework = (cx, cy, col, delay) => {
      let rays = '';
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2, x = f(cx + Math.cos(a) * 17), y = f(cy + Math.sin(a) * 17);
        rays += `<line x1="${f(cx + Math.cos(a) * 6)}" y1="${f(cy + Math.sin(a) * 6)}" x2="${x}" y2="${y}" stroke="${col}" stroke-width="1.3" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="1.4" fill="${col}"/>`;
      }
      return `<g class="sc-fw" style="animation-delay:${delay}s">${rays}</g>`;
    };
    let confetti = '';
    const C = ['#f43f5e', '#38bdf8', '#fde68a', '#a78bfa', '#34d399', '#fb923c'];
    for (let i = 0; i < 24; i++) {
      confetti += `<g transform="translate(${f(r() * 200)} 0)"><rect x="-1.5" y="-3" width="3" height="6" rx=".6" fill="${C[i % 6]}" class="a-fall" style="--dur:${f(4 + r() * 4)}s;animation-delay:-${f(r() * 8)}s;--rot:${f(180 + r() * 540)}deg;--fy0:-20px;--fy1:320px"/></g>`;
    }
    const cone = (x, delay) => `<g class="a-sway" style="transform-origin:50% 100%;--sw:16deg;--dur:6s;animation-delay:${delay}s"><polygon points="${x},236 ${x - 30},10 ${x + 30},10" fill="url(#${u}cn)"/></g>`;
    return `<defs>
        <linearGradient id="${u}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c0b33"/><stop offset=".55" stop-color="#0d0618"/><stop offset="1" stop-color="#040208"/></linearGradient>
        <radialGradient id="${u}gl"><stop offset="0" stop-color="#fbbf24" stop-opacity=".55"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
        <linearGradient id="${u}cn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fde68a" stop-opacity=".35"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></linearGradient>
        <linearGradient id="${u}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef3c7"/><stop offset=".45" stop-color="#f59e0b"/><stop offset="1" stop-color="#b45309"/></linearGradient>
        <linearGradient id="${u}fl" x1="0" x2="1"><stop offset="0" stop-color="#e11d48"/><stop offset="1" stop-color="#f59e0b"/></linearGradient>
        <linearGradient id="${u}ry" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fde68a" stop-opacity=".5"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></linearGradient>
      </defs>
      <rect x="-400" width="1000" height="300" fill="url(#${u}bg)"/>
      ${stars(r, 26, 0, 130)}${rain}
      ${cone(28, 0)}${cone(172, -3)}
      ${firework(42, 66, '#f472b6', 0)}${firework(160, 56, '#67e8f9', 1.1)}${firework(150, 112, '#fde68a', 2.2)}
      ${glow(u, 100, 132, 66, 'a-throb', '--dur:3s;--s:1.12')}
      ${[88, 96, 104, 112].map((x, i) => `<rect x="${x - 1}" y="60" width="2" height="78" fill="url(#${u}ry)" class="a-pulse" style="--dur:${f(1.6 + i * 0.3)}s;--lo:.2;animation-delay:-${i * 0.4}s"/>`).join('')}
      <rect x="46" y="158" width="36" height="30" rx="2" fill="#2e1a4f" stroke="#a78bfa" stroke-opacity=".5"/>
      <text x="64" y="179" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="14" fill="#c4b5fd">2</text>
      <rect x="118" y="166" width="36" height="22" rx="2" fill="#2e1a4f" stroke="#a78bfa" stroke-opacity=".5"/>
      <text x="136" y="182" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#c4b5fd">3</text>
      <rect x="82" y="138" width="36" height="50" rx="2" fill="url(#${u}gd)"/>
      <rect x="82" y="138" width="36" height="4" fill="#fef3c7" opacity=".7"/>
      <text x="100" y="172" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="24" fill="#78350f">1</text>
      <rect x="28" y="188" width="144" height="3" rx="1.5" fill="#fbbf24" opacity=".45"/>
      <line x1="100" y1="138" x2="100" y2="46" stroke="#fde68a" stroke-width="2"/>
      <circle cx="100" cy="44" r="3.4" fill="#fef3c7"/>
      <circle cx="100" cy="44" r="3.4" fill="none" stroke="#fde68a" stroke-width="1.2" class="a-ripple" style="--dur:2.4s;--s:5"/>
      <g class="sc-wave"><path d="M101 48 C114 44 128 54 148 47 V77 C128 84 114 73 101 77 Z" fill="url(#${u}fl)"/>
        <text x="124" y="66" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="10" letter-spacing="1" fill="#fff7ed">1ST</text></g>
      <rect x="54" y="18" width="92" height="15" rx="7.5" fill="#0b0614" stroke="#fbbf24" stroke-opacity=".7"/>
      <text x="100" y="28.5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6.5" fill="#fde68a" class="a-pulse" style="--dur:2s;--lo:.55">RANK #1 · 26 TEAMS</text>
      ${sparkle(30, 140, 5, '#fef3c7', '--dur:2.4s')}${sparkle(172, 146, 4, '#fef3c7', '--dur:3s;animation-delay:-1s')}
      ${confetti}`;
  };

  /* ---------- S6 · InnovAtrium: gears behind the university ---------- */
  S.innovatrium = (u, r) =>
    bg(u, '#081530', '#020509', '#93c5fd') + stars(r, 22) + glow(u, 100, 80, 70, 'a-pulse', '--dur:4s;--lo:.4') +
    `<g class="a-spin" style="--dur:14s"><path d="${gear(70, 70, 30, 12)}" fill="#1d4ed8" opacity=".9"/></g><circle cx="70" cy="70" r="9" fill="#081530"/>
    <g class="a-spin-r" style="--dur:10.5s"><path d="${gear(121, 58, 22, 9)}" fill="#60a5fa"/></g><circle cx="121" cy="58" r="6" fill="#081530"/>
    <g class="a-spin" style="--dur:8s"><path d="${gear(150, 92, 14, 7)}" fill="#93c5fd" opacity=".8"/></g><circle cx="150" cy="92" r="4" fill="#081530"/>
    <path d="M50 114 L100 92 L150 114 Z" fill="#0f1d38" stroke="#93c5fd"/>
    <rect x="52" y="114" width="96" height="8" fill="#13254a" stroke="#93c5fd" stroke-opacity=".7"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${58 + i * 19}" y="122" width="8" height="42" fill="#13254a" stroke="#93c5fd" stroke-opacity=".55"/>`).join('')}
    <rect x="93" y="140" width="14" height="24" rx="2" fill="#fde68a" class="a-pulse" style="--dur:3s;--lo:.35"/>
    <rect x="48" y="164" width="104" height="6" fill="#1e3a8a"/><rect x="42" y="170" width="116" height="6" fill="#172554"/>`;

  /* ---------- S7 · Axionox: QA inspecting an automation flow ---------- */
  S.axionox = (u, r) => {
    const N = [[58, 62, 'Trigger'], [142, 94, 'Automate'], [58, 126, 'Deliver'], [142, 158, 'QA']];
    const nodes = N.map(([x, y, t]) => `<rect x="${x - 27}" y="${y - 11}" width="54" height="22" rx="11" fill="#1e1036" stroke="#a78bfa"/><text x="${x}" y="${y + 3}" text-anchor="middle" ${MONO} font-size="7.5" fill="#e9d5ff">${t}</text>`).join('');
    let links = '';
    for (let i = 0; i < 3; i++) {
      const [x1, y1] = N[i], [x2, y2] = N[i + 1];
      const d = `M${x1 + (x2 > x1 ? 27 : -27)} ${y1} C${x2} ${y1} ${x1} ${y2} ${x2 + (x2 > x1 ? -27 : 27)} ${y2}`;
      links += `<path d="${d}" fill="none" stroke="#a78bfa" stroke-opacity=".3"/><path d="${d}" fill="none" stroke="#f0abfc" stroke-width="1.4" stroke-dasharray="4 7" class="a-dash" style="--off:-22px;--dur:1s"/>`;
    }
    return bg(u, '#1f0b36', '#05020a', '#c084fc') + stars(r, 22) + glow(u, 100, 110, 80, 'a-pulse', '--dur:4s;--lo:.3') + links + nodes +
      `<g class="a-pop" style="--dur:8s;animation-delay:5.4s"><circle cx="176" cy="158" r="8" fill="#22c55e"/><path d="M172 158 l3 3 l6 -6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>
      <g class="sc-mag"><circle cx="0" cy="0" r="12" fill="#fde68a" fill-opacity=".12" stroke="#fde68a" stroke-width="2.5"/><line x1="9" y1="9" x2="18" y2="18" stroke="#fde68a" stroke-width="4" stroke-linecap="round"/></g>`;
  };

  /* ---------- S7 · Thesis: a wearable that only scans on events ---------- */
  S.thesis = (u, r) => {
    let wave = '';
    for (let k = 0; k < 3; k++) {
      const x = 63 + k * 74;
      wave += `${k ? 'H' : `M${x} 126 H`}${x + 26} l3 -3 3 3 H${x + 40} l3 5 4 -30 4 34 3 -9 H${x + 74}`;
    }
    return bg(u, '#0b1026', '#02030a', '#f43f5e') + stars(r, 22) + glow(u, 100, 118, 72, 'a-pulse', '--dur:2.4s;--lo:.35') +
      `<defs><clipPath id="${u}scr"><rect x="63" y="77" width="74" height="82" rx="16"/></clipPath></defs>
      ${[0, 1].map(i => `<rect x="56" y="70" width="88" height="96" rx="22" fill="none" stroke="#f43f5e" stroke-width="1.5" class="a-ripple" style="--dur:2.4s;--s:1.5;animation-delay:${f(-2.11 + i * 0.25)}s"/>`).join('')}
      <rect x="76" y="20" width="48" height="56" rx="10" fill="#1e1b2e"/><rect x="76" y="160" width="48" height="70" rx="10" fill="#1e1b2e"/>
      <g stroke="#3b3656" stroke-dasharray="2 3"><line x1="82" y1="24" x2="82" y2="70"/><line x1="118" y1="24" x2="118" y2="70"/><line x1="82" y1="166" x2="82" y2="226"/><line x1="118" y1="166" x2="118" y2="226"/></g>
      <rect x="56" y="70" width="88" height="96" rx="22" fill="#0f1220" stroke="#94a3b8" stroke-width="2"/>
      <rect x="144" y="100" width="5" height="16" rx="2" fill="#94a3b8"/>
      <rect x="63" y="77" width="74" height="82" rx="16" fill="#020617"/>
      <g clip-path="url(#${u}scr)">
        <rect x="92" y="77" width="18" height="82" fill="#f43f5e" class="sc-event"/>
        <g class="sc-scroll"><path d="${wave}" fill="none" stroke="#fda4af" stroke-width="1.8" stroke-linejoin="round"/></g>
      </g>
      <path d="M72 89 c-2-1.6-3.4-3-3.4-4.3 a1.6 1.6 0 0 1 3.4-.6 a1.6 1.6 0 0 1 3.4 .6 c0 1.3-1.4 2.7-3.4 4.3z" fill="#f43f5e" class="a-beat"/>
      <text x="79" y="89" ${MONO} font-size="7" fill="#fecdd3">72</text>
      <rect x="112" y="84" width="14" height="6" rx="1.5" fill="none" stroke="#86efac"/><rect x="113.5" y="85.5" width="10" height="3" fill="#86efac"/><rect x="126" y="86" width="1.5" height="2" fill="#86efac"/>
      <text x="100" y="152" text-anchor="middle" ${MONO} font-size="5.5" fill="#94a3b8">EVENT MODE</text>`;
  };

  let uid = 0;
  return {
    has: id => Boolean(S[id]),
    /**
     * Returns the scene SVG.
     * mode: 'tall' (portrait card), 'thumb' (small landscape crop),
     *       'wide' (banner framing: art on the right, room for text on the left)
     */
    render(id, mode = 'tall') {
      if (!S[id]) return '';
      const u = `p${id.slice(0, 3)}${uid++}`;
      const view = { tall: '0 0 200 300', thumb: '0 50 200 140', wide: '-230 0 460 300' }[mode] || '0 0 200 300';
      return `<svg class="scene scene--${mode}" viewBox="${view}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${S[id](u, rng(id))}</svg>`;
    }
  };
})();
