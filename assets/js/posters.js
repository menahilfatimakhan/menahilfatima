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
    return `<g class="st" opacity=".8">${s}</g>`;
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

  /* ---------- S1 · Arcelia: a lone hotel tower under a crescent moon ---------- */
  S.arcelia = (u, r) => {
    let win = '';
    for (let row = 0; row < 6; row++) for (let col = 0; col < 3; col++) {
      win += `<rect x="${87 + col * 10}" y="${92 + row * 13}" width="6" height="6" rx="1" fill="#fbbf24" class="a-win" style="--dur:${f(10 + r() * 8)}s;animation-delay:-${f(r() * 12)}s"/>`;
    }
    return bg(u, '#1b1240', '#05040c', '#fde68a') + stars(r, 22, 0, 150) +
      glow(u, 138, 66, 40, 'a-throb', '--dur:8s') +
      `<circle cx="138" cy="66" r="12" fill="#fef3c7"/><circle cx="144" cy="61" r="10.5" fill="#1a1140"/>
      <path d="M80 86 L100 68 L120 86 V174 H80 Z" fill="#161236" stroke="#a5b4fc" stroke-opacity=".55"/>
      <line x1="100" y1="68" x2="100" y2="54" stroke="#a5b4fc" stroke-width="1.4"/>
      <circle cx="100" cy="53" r="2" fill="#f472b6" class="a-pulse" style="--dur:3s;--lo:.2"/>
      ${win}<line x1="44" y1="174" x2="156" y2="174" stroke="#a5b4fc" stroke-opacity=".3"/>`;
  };

  /* ---------- S2 · Dandelions: a flower under a bell jar ---------- */
  S.dandelions = (u, r) => {
    const ring = (n, rx, ry, off, fill) => Array.from({ length: n }, (_, k) =>
      `<ellipse cx="100" cy="${116 - off}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${f(k * 360 / n)} 100 116)"/>`).join('');
    let rays = '';
    for (let k = 0; k < 8; k++) rays += `<polygon points="100,116 98,70 102,70" fill="#fef9c3" opacity=".05" transform="rotate(${k * 45} 100 116)"/>`;
    return bg(u, '#04261f', '#020a08', '#bef264') + stars(r, 18, 0, 150) + glow(u, 100, 116, 60, 'a-throb', '--dur:6s') +
      `<defs><linearGradient id="${u}pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbcfe8"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>
      <defs><clipPath id="${u}jar"><path d="M62 168 V124 A38 44 0 0 1 138 124 V168 Z"/></clipPath></defs>
      <path d="M62 168 V124 A38 44 0 0 1 138 124 V168 Z" fill="#a7f3d0" fill-opacity=".05"/>
      <g clip-path="url(#${u}jar)"><g class="a-spin" style="--dur:60s">${rays}</g></g>
      <path d="M100 168 C96 150 104 136 100 122" stroke="#4ade80" stroke-width="2.2" fill="none"/>
      <ellipse cx="108" cy="150" rx="8" ry="3.2" fill="#22c55e" transform="rotate(-28 108 150)"/>
      <ellipse cx="92" cy="140" rx="7" ry="3" fill="#16a34a" transform="rotate(30 92 140)"/>
      <g class="a-spin" style="--dur:60s">${ring(8, 4.6, 10, 10, `url(#${u}pt)`)}</g>
      <g class="a-spin-r" style="--dur:40s">${ring(6, 3, 6.5, 6, '#fce7f3')}</g>
      <circle cx="100" cy="116" r="4.5" fill="#fde047"/>
      ${orbit(100, 134, 26, 7, 9, 0, '<circle r="1.8" fill="#fde047"/>')}${orbit(100, 104, 22, 6, 12, -5, '<circle r="1.5" fill="#fef08a"/>')}
      <path d="M62 168 V124 A38 44 0 0 1 138 124 V168" fill="none" stroke="#a7f3d0" stroke-opacity=".65" stroke-width="1.5"/>
      <circle cx="100" cy="79" r="3.6" fill="#a7f3d0" opacity=".6"/>
      <path d="M70 120 A30 36 0 0 1 86 88" stroke="#fff" stroke-opacity=".28" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <line x1="130" y1="128" x2="130" y2="156" stroke="#fff" stroke-opacity=".12" stroke-width="2" stroke-linecap="round"/>
      <rect x="56" y="166" width="88" height="3" fill="#b45309"/><rect x="52" y="169" width="96" height="8" rx="3" fill="#3f2a14"/>`;
  };

  /* ---------- S2 · Gaming Hub: a glowing pixel creature ---------- */
  S.gaminghub = (u, r) => {
    const sprite = ['..XXXXX..', '.XXXXXXX.', 'XX.XXX.XX', 'XXXXXXXXX', '.X.X.X.X.', 'X.......X'];
    let px = '';
    sprite.forEach((row, y) => [...row].forEach((c, x) => { if (c === 'X') px += `<rect x="${73 + x * 6}" y="${92 + y * 6}" width="6" height="6"/>`; }));
    return bg(u, '#140628', '#020104', '#f472b6') + stars(r, 20, 0, 150) + glow(u, 100, 110, 56, 'a-throb', '--dur:6s') +
      `<rect x="52" y="68" width="96" height="86" rx="16" fill="none" stroke="#4ade80" stroke-opacity=".3"/>
      <g class="a-float" style="--fy:-5px;--dur:6s" fill="#f472b6">${px}</g>`;
  };

  /* ---------- S2 · sense.ai: a browser with an AI spark ---------- */
  S.senseai = (u, r) =>
    bg(u, '#1e1b4b', '#05050f', '#818cf8') + stars(r, 20, 0, 150) + glow(u, 100, 112, 56, 'a-throb', '--dur:7s') +
    `<rect x="54" y="76" width="92" height="70" rx="9" fill="#0d0d22" stroke="#a5b4fc" stroke-opacity=".6"/>
    <line x1="54" y1="88" x2="146" y2="88" stroke="#a5b4fc" stroke-opacity=".3"/>
    <circle cx="62" cy="82" r="1.8" fill="#f43f5e"/><circle cx="68" cy="82" r="1.8" fill="#fbbf24"/><circle cx="74" cy="82" r="1.8" fill="#22c55e"/>
    <g opacity=".35"><circle cx="100" cy="117" r="9" fill="#818cf8" class="a-pulse" style="--dur:6s;--lo:.15"/></g>
    <g class="a-throb" style="--dur:6s;--s:1.15"><path d="M100 101 Q103 114 116 117 Q103 120 100 133 Q97 120 84 117 Q97 114 100 101 Z" fill="#e0e7ff"/></g>`;

  /* ---------- S3 · Banking System: a bank, its coin and its transactions ---------- */
  S.banking = (u, r) =>
    bg(u, '#0b1b30', '#02060c', '#fbbf24') + stars(r, 20, 0, 150) + glow(u, 100, 112, 62, 'a-throb', '--dur:7s') +
    `<defs><linearGradient id="${u}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef3c7"/><stop offset=".5" stop-color="#f59e0b"/><stop offset="1" stop-color="#b45309"/></linearGradient></defs>
    <path d="M18 153 H90" stroke="#93c5fd" stroke-opacity=".25"/><path d="M110 153 H182" stroke="#93c5fd" stroke-opacity=".25"/>
    <path d="M18 153 H90" stroke="#fde68a" stroke-width="1.6" stroke-dasharray="3 9" class="a-dash" style="--off:-24px;--dur:2.4s"/>
    <path d="M110 153 H182" stroke="#93c5fd" stroke-width="1.6" stroke-dasharray="3 9" class="a-dash" style="--off:-24px;--dur:2.4s"/>
    <polygon points="58,98 100,76 142,98" fill="#0f1d38" stroke="#93c5fd" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="100" cy="90" r="4.5" fill="none" stroke="#fde68a" stroke-width="1.2"/>
    <rect x="58" y="98" width="84" height="7" fill="#13254a" stroke="#93c5fd" stroke-width="1.2"/>
    ${[64, 79, 113, 128].map(x => `<rect x="${x}" y="105" width="8" height="38" fill="#13254a" stroke="#93c5fd" stroke-opacity=".7"/>`).join('')}
    <path d="M93 143 V122 a7 7 0 0 1 14 0 V143 Z" fill="#fde68a" class="a-pulse" style="--dur:4s;--lo:.45"/>
    <rect x="54" y="143" width="92" height="5" fill="#1e3a8a"/><rect x="50" y="148" width="100" height="5" fill="#172554"/>
    <g class="sc-coin"><circle cx="100" cy="56" r="11" fill="url(#${u}gd)" stroke="#fde68a"/><circle cx="100" cy="56" r="7.5" fill="none" stroke="#b45309" stroke-opacity=".7"/>
      <text x="100" y="60" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="10" fill="#78350f">$</text></g>`;

  /* ---------- S3 · Skinsations: a clinic database ---------- */
  S.skinsations = (u, r) =>
    bg(u, '#2b0d26', '#07030a', '#f472b6') + stars(r, 20, 0, 150) + glow(u, 100, 112, 56, 'a-throb', '--dur:7s') +
    `<path d="M66 86 V138 A34 10 0 0 0 134 138 V86" fill="#2a0f24" stroke="#f9a8d4" stroke-opacity=".7"/>
    <path d="M66 104 A34 10 0 0 0 134 104" fill="none" stroke="#f9a8d4" class="a-pulse" style="--dur:4s;--lo:.25"/>
    <path d="M66 121 A34 10 0 0 0 134 121" fill="none" stroke="#f9a8d4" class="a-pulse" style="--dur:4s;--lo:.25;animation-delay:-2s"/>
    <ellipse cx="100" cy="86" rx="34" ry="10" fill="#3b1533" stroke="#f9a8d4"/>
    <g class="a-throb" style="--s:1.12;--dur:5s"><rect x="97" y="79" width="6" height="14" rx="1.5" fill="#fb7185"/><rect x="93" y="83" width="14" height="6" rx="1.5" fill="#fb7185"/></g>`;

  /* ---------- S3 · Finnovation: a chat bubble with a rising line ---------- */
  S.finnovation = (u, r) =>
    bg(u, '#05281c', '#020705', '#34d399') + stars(r, 18, 0, 150) + glow(u, 100, 110, 56, 'a-throb', '--dur:7s') +
    `<path d="M66 74 H134 a12 12 0 0 1 12 12 V126 a12 12 0 0 1 -12 12 H96 L82 150 V138 H66 a12 12 0 0 1 -12 -12 V86 a12 12 0 0 1 12 -12 Z" fill="#0f3d2e" fill-opacity=".6" stroke="#34d399" stroke-opacity=".7"/>
    <polyline points="68,124 86,112 100,118 116,98 132,90" fill="none" stroke="#a7f3d0" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="90" class="a-draw" style="--len:90px;--dur:9s"/>
    <circle cx="132" cy="90" r="3" fill="#34d399" class="a-pulse" style="--dur:4s;--lo:.3"/>`;

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

  /* ---------- S4 · Text Editor: a terminal and a cursor ---------- */
  S.texteditor = (u, r) =>
    bg(u, '#03160b', '#000000', '#22c55e') + stars(r, 16, 0, 150) + glow(u, 100, 112, 56, 'a-throb', '--dur:7s') +
    `<rect x="52" y="80" width="96" height="62" rx="8" fill="#020a05" stroke="#22c55e" stroke-opacity=".6"/>
    <line x1="52" y1="92" x2="148" y2="92" stroke="#22c55e" stroke-opacity=".3"/>
    <text x="62" y="118" ${MONO} font-size="10" fill="#4ade80">&gt; MOV AX</text>
    <rect x="114" y="110" width="6" height="10" fill="#4ade80" class="a-blink" style="--dur:2s"/>`;

  /* ---------- S4 · AfterLight: a small robot and a rising sun ---------- */
  S.afterlight = (u, r) =>
    `<defs><linearGradient id="${u}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140a26"/><stop offset=".5" stop-color="#3b1035"/><stop offset="1" stop-color="#7c2d12"/></linearGradient>
      <radialGradient id="${u}sun"><stop offset="0" stop-color="#fef3c7"/><stop offset=".45" stop-color="#fb923c"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/></radialGradient></defs>
    <rect x="-400" width="1000" height="300" fill="url(#${u}bg)"/>${stars(r, 20, 0, 110)}
    <g class="a-throb" style="--dur:10s;--s:1.05"><circle cx="100" cy="150" r="54" fill="url(#${u}sun)"/></g>
    <rect x="-400" y="150" width="1000" height="150" fill="#0b0507"/>
    <line x1="-400" y1="150" x2="600" y2="150" stroke="#fdba74" stroke-opacity=".5"/>
    <g fill="#0b0507"><rect x="94" y="132" width="12" height="10" rx="3"/><rect x="95.5" y="142" width="9" height="8" rx="2"/><line x1="100" y1="132" x2="100" y2="126" stroke="#0b0507" stroke-width="1.5"/></g>
    <circle cx="102.5" cy="137" r="1.6" fill="#67e8f9" class="a-pulse" style="--dur:4s;--lo:.3"/>`;

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

  /* ---------- S5 · Enmawae Studio: an e-commerce cart receiving an order ---------- */
  S.enmawae = (u, r) => {
    const s = 9;
    const box = `<polygon points="${-s},${-s / 2} 0,0 0,${s} ${-s},${s / 2}" fill="#b45309"/>
      <polygon points="0,0 ${s},${-s / 2} ${s},${s / 2} 0,${s}" fill="#78350f"/>
      <polygon points="0,${-s} ${s},${-s / 2} 0,0 ${-s},${-s / 2}" fill="#fde68a"/>
      <path d="M${-s / 2} ${-s * 0.75} L${s / 2} ${-s * 0.25}" stroke="#be123c" stroke-width="1.6"/>`;
    return bg(u, '#17120a', '#040302', '#e5c07b') + stars(r, 18, 0, 150) + glow(u, 100, 116, 60, 'a-throb', '--dur:7s') +
      `<g transform="translate(112 112)"><g class="sc-parcel">${box}</g></g>
      <g stroke="#e5c07b" stroke-opacity=".35">
        <line x1="92" y1="98" x2="96" y2="136"/><line x1="108" y1="98" x2="109" y2="136"/><line x1="124" y1="98" x2="122" y2="136"/>
        <line x1="76" y1="117" x2="140" y2="117"/></g>
      <path d="M52 84 H66 L78 136 H134 L146 98 H70" fill="none" stroke="#e5c07b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="86" cy="148" r="6" fill="#17120a" stroke="#e5c07b" stroke-width="2.4"/><circle cx="126" cy="148" r="6" fill="#17120a" stroke="#e5c07b" stroke-width="2.4"/>
      <circle cx="148" cy="84" r="8" fill="#e11d48"/>
      <text x="148" y="87.8" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="9" fill="#fff" class="sc-cartA">1</text>
      <text x="148" y="87.8" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="9" fill="#fff" class="sc-cartB">2</text>
      <text x="100" y="172" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-size="7" letter-spacing="2.4" fill="#e5c07b" opacity=".75">ENMAWAE</text>`;
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

  /* ---------- S6 · Umeed-e-Zann: an SOS button ---------- */
  S.umeed = (u, r) =>
    bg(u, '#3a0a1f', '#0a0206', '#fb7185') + stars(r, 20, 0, 150) + glow(u, 100, 114, 56, 'a-throb', '--dur:7s') +
    `<text x="100" y="80" text-anchor="middle" font-size="11" fill="#fda4af" font-family="'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif" direction="rtl">امیدِ زن</text>
    ${[0, 2.2].map(d => `<circle cx="100" cy="116" r="22" fill="none" stroke="#fb7185" stroke-width="1.4" vector-effect="non-scaling-stroke" class="a-ripple" style="--dur:4.4s;--s:2;animation-delay:${d}s"/>`).join('')}
    <circle cx="100" cy="116" r="22" fill="#e11d48"/>
    <text x="100" y="120.5" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#fff">SOS</text>`;

  /* ---------- S6 · CipherChain: a glass block on the chain with a flag inside ---------- */
  S.cipherchain = (u, r) => {
    const mini = (cx, cy, s) => `<g opacity=".7">
      <polygon points="${cx - s},${cy - s / 2} ${cx},${cy} ${cx},${cy + s} ${cx - s},${cy + s / 2}" fill="#312e81"/>
      <polygon points="${cx},${cy} ${cx + s},${cy - s / 2} ${cx + s},${cy + s / 2} ${cx},${cy + s}" fill="#1e1b4b"/>
      <polygon points="${cx},${cy - s} ${cx + s},${cy - s / 2} ${cx},${cy} ${cx - s},${cy - s / 2}" fill="#818cf8"/></g>`;
    const edges = 'M66 95 L100 78 L134 95 L100 112 Z M66 95 V133 L100 150 L134 133 V95 M100 112 V150';
    return bg(u, '#0d0b33', '#020208', '#8b5cf6') + stars(r, 20, 0, 150) + glow(u, 100, 114, 64, 'a-throb', '--dur:7s') +
      `<defs><linearGradient id="${u}fl" x1="0" x2="1"><stop offset="0" stop-color="#e11d48"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>
      <path d="M50 152 L66 141 M150 82 L134 92" stroke="#c7d2fe" stroke-opacity=".5" stroke-width="1.6" stroke-dasharray="4 3" class="a-dash" style="--off:-14px;--dur:2.4s"/>
      ${mini(40, 158, 12)}${mini(160, 74, 12)}
      <g class="a-float" style="--fy:-4px;--dur:8s">
        <path d="M100 78 V116 M100 116 L66 133 M100 116 L134 133" stroke="#a5b4fc" stroke-opacity=".3" stroke-dasharray="2 3"/>
        <line x1="100" y1="138" x2="100" y2="98" stroke="#fde68a" stroke-width="1.8"/>
        <circle cx="100" cy="97" r="2" fill="#fef3c7"/>
        <g class="sc-wave" style="animation-duration:3.4s"><path d="M101 99 C108 96 114 102 122 98 V114 C114 118 108 112 101 115 Z" fill="url(#${u}fl)"/></g>
        <polygon points="66,95 100,112 100,150 66,133" fill="#6366f1" fill-opacity=".16"/>
        <polygon points="100,112 134,95 134,133 100,150" fill="#4338ca" fill-opacity=".2"/>
        <polygon points="100,78 134,95 100,112 66,95" fill="#c7d2fe" fill-opacity=".14"/>
        <path d="${edges}" fill="none" stroke="#c7d2fe" stroke-opacity=".7" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="${edges}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" stroke-dasharray="14 260" class="a-dash" style="--off:-274px;--dur:6s"/>
      </g>`;
  };

  /* ---------- S6 · Head of Neural Nova: a small network ---------- */
  S.neuralnova = (u, r) => {
    const L = [[66, [92, 116, 140]], [100, [86, 112, 138]], [134, [100, 126]]];
    let edges = '', sig = '', nodes = '';
    for (let l = 0; l < L.length - 1; l++) {
      const [x1, ys1] = L[l], [x2, ys2] = L[l + 1];
      ys1.forEach(y1 => ys2.forEach(y2 => { edges += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c4b5fd" stroke-opacity=".22" stroke-width=".8"/>`; }));
      const y1 = ys1[1] || ys1[0], y2 = ys2[0], len = Math.ceil(Math.hypot(x2 - x1, y2 - y1));
      sig += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f0abfc" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="6 ${len + 10}" class="a-dash" style="--off:-${len + 6}px;--dur:4s;animation-delay:${l * 2}s"/>`;
    }
    L.forEach(([x, ys]) => ys.forEach(y => { nodes += `<circle cx="${x}" cy="${y}" r="5" fill="#1a0633" stroke="#e9d5ff" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="2.4" fill="#f0abfc" class="a-pulse" style="--dur:5s;--lo:.3"/>`; }));
    return bg(u, '#1a0633', '#050110', '#c084fc') + stars(r, 20, 0, 150) + glow(u, 100, 112, 58, 'a-throb', '--dur:7s') + edges + sig + nodes;
  };

  /* ---------- S6 · Cyber Fest CTF: a first-place flag on a ringed planet ---------- */
  S.ctf = (u, r) =>
    bg(u, '#1c0b33', '#040208', '#fbbf24') + stars(r, 22, 0, 150) + glow(u, 100, 124, 66, 'a-throb', '--dur:7s') +
    `<defs><radialGradient id="${u}pl" cx="35%" cy="28%"><stop offset="0" stop-color="#fde68a"/><stop offset=".45" stop-color="#d97706"/><stop offset="1" stop-color="#3b1a06"/></radialGradient>
      <linearGradient id="${u}fl" x1="0" x2="1"><stop offset="0" stop-color="#e11d48"/><stop offset="1" stop-color="#f59e0b"/></linearGradient>
      <clipPath id="${u}pc"><circle cx="100" cy="150" r="32"/></clipPath>
      <clipPath id="${u}rf"><rect x="-50" y="150" width="300" height="80"/></clipPath></defs>
    <g transform="rotate(-12 100 150)"><ellipse cx="100" cy="150" rx="56" ry="11" fill="none" stroke="#fde68a" stroke-opacity=".3" stroke-width="2"/></g>
    <circle cx="100" cy="150" r="32" fill="url(#${u}pl)"/>
    <g clip-path="url(#${u}pc)" fill="#fef3c7" opacity=".18"><rect x="60" y="140" width="80" height="3"/><rect x="60" y="152" width="80" height="2"/><rect x="60" y="162" width="80" height="4"/></g>
    <path d="M76 134 A32 32 0 0 1 110 120" stroke="#fff7ed" stroke-opacity=".45" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g transform="rotate(-12 100 150)">
      <ellipse cx="100" cy="150" rx="56" ry="11" fill="none" stroke="#fde68a" stroke-opacity=".8" stroke-width="2.2" clip-path="url(#${u}rf)"/>
      ${orbit(100, 150, 66, 13, 12, 0, '<circle r="3.2" fill="#fef3c7"/>')}
    </g>
    <line x1="100" y1="119" x2="100" y2="62" stroke="#fde68a" stroke-width="2.2"/>
    <circle cx="100" cy="60" r="3.2" fill="#fef3c7"/>
    <circle cx="100" cy="60" r="3.2" fill="none" stroke="#fde68a" stroke-width="1.2" vector-effect="non-scaling-stroke" class="a-ripple" style="--dur:4s;--s:4"/>
    <g class="sc-wave" style="animation-duration:3.4s"><path d="M101 64 C114 59 126 70 146 63 V92 C126 99 114 88 101 93 Z" fill="url(#${u}fl)"/>
      <text x="123" y="83" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" letter-spacing=".5" fill="#fff7ed">1ST</text></g>
    ${sparkle(150, 120, 4, '#fef3c7', '--dur:4s')}${sparkle(52, 98, 3, '#fff', '--dur:5s;animation-delay:-2s')}`;

  /* ---------- S6 · InnovAtrium: two interlocking gears ---------- */
  S.innovatrium = (u, r) =>
    bg(u, '#081530', '#020509', '#93c5fd') + stars(r, 20, 0, 150) + glow(u, 100, 112, 58, 'a-throb', '--dur:7s') +
    `<g class="a-spin" style="--dur:24s"><path d="${gear(88, 116, 28, 12)}" fill="#1d4ed8"/></g><circle cx="88" cy="116" r="8" fill="#081530"/>
    <g class="a-spin-r" style="--dur:18s"><path d="${gear(128, 94, 19, 9)}" fill="#60a5fa"/></g><circle cx="128" cy="94" r="5.5" fill="#081530"/>`;

  /* ---------- S7 · Axionox: QA inspecting each step of an automation ---------- */
  S.axionox = (u, r) => {
    const icons = [
      '<path d="M66 112 l-5 8 h4 l-2 7 l7 -9 h-4 l2 -6 z" fill="#e9d5ff"/>',
      '<circle cx="100" cy="120" r="5" fill="none" stroke="#e9d5ff" stroke-width="2" stroke-dasharray="2 1.6"/><circle cx="100" cy="120" r="1.8" fill="#e9d5ff"/>',
      '<path d="M131 120 l3.5 3.5 l7 -7.5" stroke="#86efac" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    ];
    const peak = [-4.5, -1.8, -7.65];
    const nodes = [64, 100, 136].map((x, i) => `
      <rect x="${x - 12}" y="108" width="24" height="24" rx="7" fill="#1e1036" stroke="#a78bfa" stroke-opacity=".8"/>
      <g opacity=".4"><rect x="${x - 12}" y="108" width="24" height="24" rx="7" fill="${i === 2 ? '#22c55e' : '#c084fc'}" class="a-pulse" style="--dur:9s;--lo:0;animation-delay:${peak[i]}s"/></g>
      ${icons[i]}`).join('');
    return bg(u, '#1f0b36', '#05020a', '#c084fc') + stars(r, 20, 0, 150) + glow(u, 100, 118, 62, 'a-throb', '--dur:7s') +
      `<path d="M76 120 H88 M112 120 H124" stroke="#a78bfa" stroke-opacity=".6" stroke-width="1.4" stroke-dasharray="3 3" class="a-dash" style="--off:-12px;--dur:1.6s"/>
      ${nodes}
      <g class="sc-scanx"><circle cx="0" cy="0" r="18" fill="#c084fc" fill-opacity=".08" stroke="#e9d5ff" stroke-width="2.4"/>
        <line x1="13" y1="13" x2="24" y2="24" stroke="#e9d5ff" stroke-width="4.5" stroke-linecap="round"/></g>`;
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

  /* ======================== CERTIFICATION EMBLEMS ========================
     Drawn for the landscape 'thumb' framing (focus on y 50 to 190). */

  /* UNITAR · Women's Leadership in Disaster Risk Reduction: a dome shields the globe */
  S['cert-unitar'] = (u, r) =>
    bg(u, '#071a2b', '#030a12', '#2dd4bf') + stars(r, 16, 50, 130) + glow(u, 100, 140, 56, 'a-throb', '--dur:7s') +
    `<path d="M50 160 A50 50 0 0 1 150 160" fill="#2dd4bf" fill-opacity=".07" stroke="#5eead4" stroke-width="1.6" class="a-pulse" style="--dur:5s;--lo:.5"/>
    <circle cx="100" cy="160" r="28" fill="#0f2f3a" stroke="#5eead4" stroke-opacity=".7"/>
    <g fill="none" stroke="#5eead4" stroke-opacity=".3"><ellipse cx="100" cy="160" rx="28" ry="8"/><ellipse cx="100" cy="160" rx="11" ry="28"/></g>
    <rect x="-50" y="182" width="300" height="20" fill="#030a12"/>`;

  /* Google Machine Learning Crash Course: gradient descent finds the minimum */
  S['cert-mlcc'] = (u, r) =>
    bg(u, '#0b1030', '#03040d', '#818cf8') + stars(r, 14, 50, 100) +
    `<defs><linearGradient id="${u}cv" x1="0" x2="1"><stop offset="0" stop-color="#818cf8"/><stop offset=".5" stop-color="#a855f7"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>
    <path d="M18 76 C58 76 70 172 100 172 C130 172 142 94 182 72" fill="none" stroke="url(#${u}cv)" stroke-width="2.4"/>
    <circle cx="0" cy="0" r="6" fill="#fde68a" class="sc-gd"/>`;

  /* Google IT Automation with Python: a turning gear and a check */
  S['cert-itauto'] = (u, r) =>
    bg(u, '#0a1a14', '#030806', '#34d399') + stars(r, 12, 50, 110) + glow(u, 100, 122, 52, 'a-throb', '--dur:7s') +
    `<g class="a-spin" style="--dur:20s"><path d="${gear(100, 122, 30, 12)}" fill="#10b981"/></g>
    <circle cx="100" cy="122" r="11" fill="#0a1a14"/>
    <path d="M94 122 l4 4 l8 -8" stroke="#86efac" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

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
      const view = { tall: '0 0 200 300', thumb: '0 50 200 140', emblem: '-25 48 250 141', wide: '-230 0 460 300' }[mode] || '0 0 200 300';
      return `<svg class="scene scene--${mode}" viewBox="${view}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${S[id](u, rng(id))}</svg>`;
    }
  };
})();
