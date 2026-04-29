/* ============================================================
   MENAHIL FATIMA — PORTFOLIO WEBSITE
   Vanilla JavaScript — No frameworks, no libraries
   ============================================================ */

(function () {
  'use strict';

  // ======================== IMAGE MAP ========================
  const IMAGE_MAP = {
    s1e1: 'images/p2.jfif', s1e2: 'images/p10.jfif',
    s2e1: 'images/p3.jfif', s2we: 'images/p6.jfif',
    s3e1: 'images/p4.jfif', s3e2: 'images/p1.jpeg',
    s4e1: 'images/p5.jfif', s4e2: 'images/p9.jfif',
    s4e3: 'images/p11.jfif',
    s5e1: 'images/p11.jfif', s5e2: 'images/p7.jfif', // Deepfake (s5e1) now uses p11.jfif
  };

  const GRADIENT_MAP = {
    s3ta: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    s4we: 'linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0f3460 100%)',
    s5we: 'linear-gradient(135deg, #0f1a0a 0%, #1a2e16 50%, #0a3420 100%)',
    s5nn: 'linear-gradient(135deg, #1a0a1e 0%, #2e1642 50%, #1a0a2e 100%)',
    s6we: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a3a 50%, #1a1a2e 100%)',
  };

  // ======================== EPISODE DATA ========================
  const EPISODES = {};

  const ACTUAL_TECH = {
    s1e1: ['HTML5', 'CSS3', 'Front-End Development'],
    s1e2: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript (Vanilla)', 'Front-End Development'],
    s2e1: ['C++', 'OOP', 'Custom Data Structures', 'File I/O', 'Terminal UI Design'],
    s2we: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript (Vanilla)', 'Responsive Web Design', 'Git', 'GitHub'],
    s3e1: ['C++', 'MySQL', 'OOP', 'MySQL Connector/ODBC', 'File I/O'],
    s3e2: ['MySQL', 'Relational Database Design', 'ERD', 'Schema Normalization (3NF)', 'SQL Scripting'],
    s4e1: ['Python', 'NLP', 'RAG', 'LLMs', 'HuggingFace Transformers', 'Vector Embeddings', 'External APIs'],
    s4e2: ['Python', 'Beautiful Soup 4', 'Requests', 'Schedule / Cron', 'Email Automation (smtplib)', 'Web Scraping'],
    s4e3: ['C++', 'JavaScript', 'HTML5', 'CSS3', 'UI/UX Design', 'Browser-Based Game Architecture'],
    s5e1: ['Python', 'TensorFlow', 'Keras', 'CNN Design', 'Transfer Learning', 'Grad-CAM (XAI)', 'NumPy', 'Pandas'],
    s5e2: ['Flutter', 'Dart', 'AI Integration', 'REST APIs', 'Mobile UI/UX', 'State Management'],
    s6we: ['MongoDB', 'Express.js', 'React', 'Node.js (MERN Stack)', 'RESTful API Design', 'JWT Authentication'],
    s3ta: ['Leadership', 'Technical Communication', 'Academic Support', 'Lab Facilitation'],
    s4we: ['Research', 'Data Analysis', 'Social Impact', 'Field Outreach'],
    s5we: ['Network Security', 'Threat Intelligence', 'Phishing Detection', 'Data Protection'],
    s5nn: ['Leadership', 'AI/ML', 'Hackathon Direction', 'Event Management']
  };

  function extractEpisodeData() {
    document.querySelectorAll('.episode-detail').forEach(detail => {
      const id = detail.id.replace('detail-', '');
      if (id === 's4rp') return; // Skip AzureIQ-RAG

      const seasonEl = detail.querySelector('.detail-season');
      const matchEl = detail.querySelector('.detail-match');
      const statusEl = detail.querySelector('.detail-status');
      const titleEl = detail.querySelector('.detail-title');
      const taglineEl = detail.querySelector('.detail-tagline');
      const metaEls = detail.querySelectorAll('.detail-meta span');
      const tabs = {};

      detail.querySelectorAll('.detail-tab-content').forEach(tc => {
        const key = tc.dataset.content;
        tabs[key] = tc.innerHTML;
      });

      const collabEl = detail.querySelector('.detail-collaborators');
      const collaborators = [];
      if (collabEl) {
        collabEl.querySelectorAll('span').forEach(s => collaborators.push(s.textContent));
      }

      const card = document.querySelector(`[data-episode="${id}"]`);
      const cardTitle = card ? card.querySelector('.card-title')?.textContent : '';

      EPISODES[id] = {
        season: seasonEl?.textContent || '',
        match: matchEl?.textContent || '',
        matchClass: matchEl?.classList.contains('gold') ? 'gold' : matchEl?.classList.contains('fire') ? 'fire' : '',
        status: statusEl?.textContent || '',
        title: titleEl?.textContent || '',
        shortTitle: cardTitle || titleEl?.textContent || '',
        tagline: taglineEl?.textContent || '',
        meta: Array.from(metaEls).map(e => e.textContent),
        genres: ACTUAL_TECH[id] || [],
        tabs,
        collaborators,
        image: IMAGE_MAP[id] || null,
        gradient: GRADIENT_MAP[id] || 'linear-gradient(135deg, #111118 0%, #1a1a2e 100%)',
      };
    });
  }

  // ======================== STARFIELD ========================
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const stars = [];
    const STAR_COUNT = 200;

    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    function createStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1.8 + 0.3,
          speed: Math.random() * 0.15 + 0.02, opacity: Math.random() * 0.6 + 0.1,
          twinkleSpeed: Math.random() * 0.008 + 0.002, twinkleOffset: Math.random() * Math.PI * 2,
          isBlush: Math.random() > 0.8 });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;
      for (const star of stars) {
        star.y -= star.speed;
        star.x += Math.sin(time + star.twinkleOffset) * 0.05;
        if (star.y < -5) { star.y = height + 5; star.x = Math.random() * width; }
        if (star.x < -5) star.x = width + 5;
        if (star.x > width + 5) star.x = -5;
        const twinkle = Math.sin(time * star.twinkleSpeed * 100 + star.twinkleOffset);
        const opacity = star.opacity + twinkle * 0.15;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.isBlush
          ? `rgba(200, 200, 230, ${Math.max(0.05, opacity * 0.7)})`
          : `rgba(232, 232, 237, ${Math.max(0.05, opacity)})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    resize(); createStars(); draw();
    window.addEventListener('resize', () => { resize(); createStars(); });
  }

  // ======================== LANDING → PORTFOLIO ========================
  function initLandingNavigation() {
    const landing = document.getElementById('landing');
    const portfolio = document.getElementById('portfolio');
    if (!landing || !portfolio) return;
    document.querySelectorAll('.profile-card').forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault();
        landing.style.opacity = '0';
        landing.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { landing.style.display = 'none'; portfolio.classList.add('visible'); window.scrollTo(0, 0); }, 500);
      });
    });
  }

  // ======================== NAVBAR ========================
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.92)';
        navbar.style.borderBottomColor = 'rgba(99, 102, 241, 0.2)';
      } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.borderBottomColor = 'rgba(99, 102, 241, 0.15)';
      }
    });

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', hamburger.getAttribute('aria-expanded') !== 'true');
      });
    }
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (hamburger && mobileMenu) { hamburger.classList.remove('active'); mobileMenu.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
      });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 100;
      sections.forEach(section => {
        const top = section.offsetTop, height = section.offsetHeight, id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
          });
        }
      });
    });
  }

  // ======================== SCROLL REVEAL ========================
  function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => observer.observe(el));
  }

  // ======================== INJECT CARD IMAGES ========================
  function initEpisodeCardImages() {
    document.querySelectorAll('.episode-card[data-episode]').forEach(card => {
      const id = card.dataset.episode;
      if (id === 's4rp') {
        card.style.display = 'none'; // Hide AzureIQ-RAG card
        return;
      }
      const img = IMAGE_MAP[id];
      const gradient = GRADIENT_MAP[id];

      const titleEl = card.querySelector('.card-title');
      const labelEl = card.querySelector('.card-season-label');
      const title = titleEl?.textContent || '';
      const label = labelEl?.textContent || '';

      if (img) {
        card.innerHTML = `<img class="card-bg-img" src="${img}" alt="${title}" loading="lazy"><div class="card-scrim"></div><div class="card-overlay-text"><div class="card-ep-label">${label}</div><div class="card-ep-title">${title}</div></div>`;
      } else if (gradient) {
        card.innerHTML = `<div class="card-gradient-bg" style="background:${gradient}"></div><div class="card-scrim"></div><div class="card-overlay-text"><div class="card-ep-label">${label}</div><div class="card-ep-title">${title}</div></div>`;
      }
    });

    document.querySelectorAll('.episode-card.coming-soon').forEach(card => {
      if (!card.dataset.episode) {
        const gradient = 'linear-gradient(135deg, #111118 0%, #1a1a2e 100%)';
        card.innerHTML = `<div class="card-gradient-bg" style="background:${gradient}"></div><div class="card-scrim"></div><div class="card-overlay-text"><div class="card-ep-label">S6 · TBA</div><div class="card-ep-title">Coming Soon</div></div>`;
      }
    });
  }

  // ======================== EPISODE DETAIL SCREEN ========================
  function showEpisodeDetail(episodeId) {
    const ep = EPISODES[episodeId];
    if (!ep) return;

    const screen = document.getElementById('episode-detail-screen');
    const portfolio = document.getElementById('portfolio');
    if (!screen || !portfolio) return;

    let heroImg = ep.image
      ? `<img class="eds-hero-img" src="${ep.image}" alt="${ep.title}">`
      : `<div class="eds-hero-img-gradient" style="background:${ep.gradient}"></div>`;

    const techPills = ep.genres.map(g => `<span class="genre-pill">${g}</span>`).join('');

    const tabKeys = Object.keys(ep.tabs);
    const tabBtns = tabKeys.map((k, i) => {
      let label = k === 'plot' ? 'The Plot' : k === 'features' ? 'Key Features' : k === 'tech' ? 'Tech Stack' : 'Cast';
      return `<button class="eds-tab${i === 0 ? ' active' : ''}" data-tab="${k}">${label}</button>`;
    }).join('');

    const tabPanels = tabKeys.map((k, i) => {
      if (k === 'learned') return '';
      return `<div class="eds-tab-panel${i === 0 ? ' active' : ''}" data-panel="${k}">${ep.tabs[k]}</div>`;
    }).join('');

    let castHTML = '';
    if (ep.collaborators.length > 0) {
      const members = [];
      ep.collaborators.forEach(c => {
        const parts = c.replace('Collaborators: ', '').replace('Mentor: ', '').replace('Mentors: ', '').split(',');
        parts.forEach(p => {
          const name = p.trim().split('·')[0].split('—')[0].split(':').pop().trim();
          if (name) {
            const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            members.push(`<div class="eds-cast-member"><div class="eds-cast-avatar">${initials}</div><div><div class="eds-cast-name">${name}</div><div class="eds-cast-role">Collaborator</div></div></div>`);
          }
        });
      });
      if (members.length) castHTML = `<div class="eds-cast"><div class="eds-cast-label">CAST</div><div class="eds-cast-grid">${members.join('')}</div></div>`;
    }

    let learnedHTML = '';
    if (ep.tabs.learned) {
      const temp = document.createElement('div');
      temp.innerHTML = ep.tabs.learned;
      const text = temp.querySelector('p')?.textContent || temp.textContent;
      learnedHTML = `<div class="eds-learned"><div class="eds-learned-label">WHAT I LEARNED</div><blockquote>"${text}"</blockquote></div>`;
    }

    let awardsHTML = ep.meta[2] && ep.meta[2].includes('Winner') || ep.meta[2] && ep.meta[2].includes('Award')
      ? `<div style="margin-bottom:0.8rem;padding:0.6rem 1rem;background:rgba(212,168,71,0.06);border-left:3px solid var(--gold);border-radius:4px;"><div style="font-size:0.82rem;color:var(--gold);">${ep.meta[2]}</div></div>`
      : '';

    const otherIds = Object.keys(EPISODES).filter(k => k !== episodeId).slice(0, 8);
    const moreCards = otherIds.map(oid => {
      const o = EPISODES[oid];
      const src = o.image || '';
      const bg = o.gradient;
      const inner = src
        ? `<img src="${src}" alt="${o.shortTitle}" loading="lazy">`
        : `<div style="width:100%;height:100%;background:${bg}"></div>`;
      return `<div class="eds-more-card" data-episode="${oid}">${inner}<div class="mlt-scrim"></div><div class="mlt-text"><div class="mlt-title">${o.shortTitle}</div><div class="mlt-year">${o.meta[0] || ''}</div></div></div>`;
    }).join('');

    // Final fix for label spelling: only replace S/E when followed by digits
    let seasonLabel = ep.season
        .replace(/^S(\d+)/, 'SEASON $1')
        .replace(/E(\d+)/, 'EPISODE $1')
        .replace('·', '›');

    screen.innerHTML = `
      <div class="eds-container">
        <button class="eds-back" id="edsBackBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Dashboard
        </button>
        <div class="eds-hero">
          ${heroImg}
          <div class="eds-hero-meta">
            <div class="eds-badges">
              <span class="eds-match">${ep.match}</span>
              <span class="eds-year">${ep.meta[0] || ''}</span>
              ${ep.status.includes('Award') || ep.status.includes('Published') ? '<span class="eds-featured-tag">Featured</span>' : ''}
            </div>
            <div class="eds-season-ep">${seasonLabel}</div>
            <h1 class="eds-title">${ep.title}</h1>
            <div class="eds-tech-pills">${techPills}</div>
            <p class="eds-desc">${ep.tagline}</p>
            ${awardsHTML}
            <div class="eds-actions">
              <button class="eds-view-btn" id="edsViewDetailsBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> View Details</button>
              <button class="eds-bookmark"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
            </div>
          </div>
        </div>

        <div id="edsTabsAnchor" class="eds-tabs">${tabBtns}</div>
        ${tabPanels}
        ${learnedHTML}
        ${castHTML}

        <div class="eds-more">
          <h3>More Like This</h3>
          <div class="eds-more-scroll">${moreCards}</div>
        </div>
      </div>`;

    portfolio.style.display = 'none';
    screen.classList.add('active');
    window.scrollTo(0, 0);

    // Back button
    document.getElementById('edsBackBtn').addEventListener('click', () => {
      screen.classList.remove('active');
      screen.innerHTML = '';
      portfolio.style.display = '';
    });

    // View Details scroll behavior
    document.getElementById('edsViewDetailsBtn').addEventListener('click', () => {
      document.getElementById('edsTabsAnchor').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Tab switching
    screen.querySelectorAll('.eds-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        screen.querySelectorAll('.eds-tab').forEach(t => t.classList.remove('active'));
        screen.querySelectorAll('.eds-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = screen.querySelector(`.eds-tab-panel[data-panel="${btn.dataset.tab}"]`);
        if (panel) panel.classList.add('active');
      });
    });

    // More Like This clicks
    screen.querySelectorAll('.eds-more-card').forEach(card => {
      card.addEventListener('click', () => showEpisodeDetail(card.dataset.episode));
    });
  }

  function initEpisodeCards() {
    document.querySelectorAll('.episode-card[data-episode]').forEach(card => {
      card.addEventListener('click', () => showEpisodeDetail(card.dataset.episode));
    });
  }

  function initSaveButton() {
    const saveBtn = document.getElementById('saveBtn');
    if (!saveBtn) return;
    saveBtn.addEventListener('click', () => {
      saveBtn.classList.toggle('saved');
      saveBtn.innerHTML = saveBtn.classList.contains('saved') ? '<i data-lucide="check"></i> Saved' : '<i data-lucide="plus"></i> Save';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  function initHeroScroll() {
    const viewDetailsBtn = document.querySelector('.hero-btn-primary');
    if (!viewDetailsBtn) return;
    viewDetailsBtn.addEventListener('click', e => {
      e.preventDefault();
      showEpisodeDetail('s5e1');
    });
  }

  function initLucideIcons() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function init() {
    initStarfield();
    initLandingNavigation();
    initNavbar();
    initScrollReveal();
    extractEpisodeData();
    initEpisodeCardImages();
    initEpisodeCards();
    initSaveButton();
    initHeroScroll();
    setTimeout(initLucideIcons, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
