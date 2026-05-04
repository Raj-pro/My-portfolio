/* ============================================================
   RAJ NAYAN — PORTFOLIO  ·  main.js
   ============================================================ */

'use strict';

/* ============================================================
   PRELOADER
============================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const countEl   = document.getElementById('preCount');
  const fillEl    = document.getElementById('preBarFill');

  let n = 0;

  const tick = setInterval(() => {
    const step = Math.floor(Math.random() * 6) + 2;
    n = Math.min(n + step, 100);

    countEl.textContent = n;
    if (fillEl) fillEl.style.width = n + '%';

    if (n >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        revealPage();
      }, 350);
    }
  }, 28);
})();


/* ============================================================
   CUSTOM CURSOR
============================================================ */
(function initCursor() {
  const cursor  = document.getElementById('cursor');
  if (!cursor) return;

  const dot     = cursor.querySelector('.cursor-dot');
  const ring    = cursor.querySelector('.cursor-ring');
  const heroImg = document.querySelector('.hero-img-wrap');

  let mx = 0, my = 0, rx = 0, ry = 0;

  /* Cache hero-image circle bounds; update on resize so the fade zone is accurate. */
  let imgCx = -9999, imgCy = -9999, imgR = 0;
  function cacheImgBounds() {
    if (!heroImg) return;
    const r = heroImg.getBoundingClientRect();
    imgCx = r.left + r.width  / 2;
    imgCy = r.top  + r.height / 2;
    imgR  = r.width / 2;
  }
  cacheImgBounds();
  window.addEventListener('resize', cacheImgBounds);
  /* Re-cache on scroll so fixed-position calc stays correct while user scrolls away. */
  window.addEventListener('scroll', cacheImgBounds, { passive: true });

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    /* Fade cursor ring out as it enters the hero image circle.
       Start fading 50px outside the circle edge, fully hidden at the edge.
       This prevents the mix-blend-mode:difference inversion from looking like
       the cursor is slipping or speeding around the circular photo. */
    if (heroImg) {
      const dist      = Math.hypot(mx - imgCx, my - imgCy);
      const fadeOuter = imgR + 50;   /* fade begins here */
      const fadeInner = imgR;        /* fully hidden at circle edge */
      const opacity   = Math.max(0, Math.min(1, (dist - fadeInner) / (fadeOuter - fadeInner)));
      ring.style.opacity = opacity;
    }

    requestAnimationFrame(animRing);
  })();

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a, button, .cert-item, .proj-card, .skill-group, .feat-cert, .cert-btn, .about-social-link');
    if (t) document.body.classList.add('c-hover');
  });

  document.addEventListener('mouseout', e => {
    const t = e.target.closest('a, button, .cert-item, .proj-card, .skill-group, .feat-cert, .cert-btn, .about-social-link');
    if (t) document.body.classList.remove('c-hover');
  });
})();


/* ============================================================
   NAVIGATION — scroll morph + mobile toggle
============================================================ */
(function initNav() {
  const nav    = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    const scrolled  = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    const bar = document.getElementById('scroll-progress');
    if (bar) bar.style.width = pct + '%';
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active link highlight */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObs.observe(s));
})();


/* ============================================================
   SMOOTH SCROLL — all anchor links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================================
   SCROLL REVEAL — Intersection Observer
============================================================ */
function revealPage() {
  /* Immediately reveal hero elements */
  document.querySelectorAll('#hero .reveal-up, #hero .reveal-left, #hero .reveal-right').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 80);
  });

  /* Observe the rest */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    if (!el.closest('#hero')) obs.observe(el);
  });
}


/* ============================================================
   TYPED ROLE TEXT
============================================================ */
(function initTyped() {
  const el = document.getElementById('typedRole');
  if (!el) return;

  const roles = [
    'Cloud Infrastructure',
    'DevOps Pipelines',
    'Full-Stack Apps',
    'Scalable Systems',
    'K8s Clusters',
    'Secure CI/CD',
  ];

  let rIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = roles[rIdx];

    if (deleting) {
      el.textContent = word.slice(0, --cIdx);
    } else {
      el.textContent = word.slice(0, ++cIdx);
    }

    let delay = deleting ? 55 : 95;

    if (!deleting && cIdx === word.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1800);
})();


/* ============================================================
   COUNT-UP ANIMATION
============================================================ */
(function initCountUp() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);

      const target = parseInt(e.target.getAttribute('data-count'));
      let cur = 0;
      const inc = target / 45;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, target);
        e.target.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(timer);
      }, 45);
    });
  }, { threshold: 0.6 });

  nums.forEach(n => obs.observe(n));
})();


/* ============================================================
   MAGNETIC BUTTONS
============================================================ */
(function initMagnetic() {
  document.querySelectorAll('.mag').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ============================================================
   CERTIFICATE FILTERING
============================================================ */
(function initCertFilter() {
  const btns  = document.querySelectorAll('.cert-btn');
  const items = document.querySelectorAll('.cert-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;

        if (match) {
          item.classList.remove('cert-hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.88)';
          /* Force reflow */
          void item.offsetWidth;
          item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.transition = 'opacity 0.25s ease';
          item.style.opacity = '0';
          setTimeout(() => item.classList.add('cert-hidden'), 260);
        }
      });
    });
  });
})();


/* ============================================================
   LIGHTBOX
============================================================ */
(function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const closeBtn = document.getElementById('lb-close');
  if (!lb) return;

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 320);
  }

  document.querySelectorAll('.cert-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) open(img.src, img.alt);
    });
  });

  document.querySelectorAll('.feat-cert').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) open(img.src, img.alt);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  lb.querySelector('.lb-bg').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


/* ============================================================
   PARALLAX — hero depth scroll
   Intro text and picture scale up (come closer) on scroll-down,
   scale back (move away) on scroll-up. Stops wherever scroll stops.
============================================================ */
(function initParallax() {
  const hero    = document.getElementById('hero');
  const content = document.querySelector('.hero-content');
  const visual  = document.querySelector('.hero-visual');
  const fcards  = document.querySelectorAll('.fcard');

  function update() {
    const y     = window.scrollY;
    const heroH = hero ? hero.offsetHeight : window.innerHeight;
    const prog  = Math.min(Math.max(y / heroH, 0), 1);

    /* Depth zoom — faster multipliers so movement is clearly visible */
    if (content) {
      const scale = 1 + prog * 0.20;
      const ty    = -prog * 45;
      const op    = prog > 0.65 ? Math.max(0, 1 - (prog - 0.65) / 0.35) : 1;
      content.style.transform = `translateY(${ty}px) scale(${scale})`;
      content.style.opacity   = op;
    }
    if (visual) {
      const scale = 1 + prog * 0.26;
      const ty    = -prog * 65;
      const op    = prog > 0.70 ? Math.max(0, 1 - (prog - 0.70) / 0.30) : 1;
      visual.style.transform  = `translateY(${ty}px) scale(${scale})`;
      visual.style.opacity    = op;
    }

    /* Floating cards — subtle independent drift for depth */
    if (y < window.innerHeight * 1.2) {
      fcards.forEach((fc, i) => {
        fc.style.transform = `translateY(${y * (0.06 + i * 0.03)}px)`;
      });
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ============================================================
   ABOUT SECTION — bidirectional slide
   Image slides in from the left, content from the right as the
   section enters the viewport. Both slide back out the same way
   when the section leaves — whether scrolling down past it or
   back up above it.
============================================================ */
(function initAboutSlide() {
  const section = document.getElementById('about');
  const imgSide = section?.querySelector('.about-img-side');
  const content = section?.querySelector('.about-content');
  if (!section || !imgSide || !content) return;

  function update() {
    const rect    = section.getBoundingClientRect();
    const winH    = window.innerHeight;
    const winW    = window.innerWidth;
    const secMid  = rect.top + rect.height / 2;
    const viewMid = winH / 2;
    const maxDist = winH / 2 + rect.height / 2;
    const dist    = secMid - viewMid;   // positive = section below, negative = above

    /* absProg: 0 when section is off-screen, 1 when centred */
    const absProg  = Math.max(0, 1 - Math.abs(dist) / maxDist);
    const entering = dist >= 0;

    let tx, op;

    if (entering) {
      /* Section 1 → 2: slide in from a quarter-width offset */
      const t = Math.pow(1 - absProg, 0.72);
      tx = t * (winW * 0.25);
      op = Math.min(1, absProg * 2.0);
    } else {
      /* Section 2 → 3: hold at centre until absProg drops below DWELL,
         then shoot fully off-screen */
      const DWELL = 0.62;
      if (absProg >= DWELL) {
        tx = 0;
        op = 1;
      } else {
        /* Remap 0→DWELL to 0→1 so the exit curve starts fresh from centre */
        const exitT = Math.pow(1 - absProg / DWELL, 0.72);
        tx = exitT * (winW * 0.6 + 100);
        op = Math.max(0, 1 - exitT * 2.2);
      }
    }

    imgSide.style.transform = `translateX(${-tx}px)`;
    imgSide.style.opacity   = op;

    content.style.transform = `translateX(${tx}px)`;
    content.style.opacity   = op;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ============================================================
   CONTACT FORM — feedback on submit
============================================================ */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-submit');
    const span = btn.querySelector('span');
    const orig = span.textContent;

    btn.disabled = true;
    span.textContent = 'Sent! ✓';
    btn.style.background = 'var(--accent-2)';

    setTimeout(() => {
      span.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
})();


/* ============================================================
   TITLE FLY — click "Raj Nayan" to explode letters
============================================================ */
(function initTitleFly() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  title.style.cursor = 'pointer';
  let flying = false;

  title.addEventListener('click', () => {
    if (flying) return;
    flying = true;

    const lines = Array.from(title.querySelectorAll('.title-line'));
    const saved = lines.map(l => l.innerHTML);
    const isGrad = lines.map(l => l.classList.contains('is-grad'));

    /* Replace each line with individual letter spans */
    lines.forEach((line, li) => {
      const text = line.textContent;
      line.innerHTML = [...text].map(ch => {
        if (/\s/.test(ch)) return `<span style="display:inline-block;width:0.3em"> </span>`;
        /* For the gradient line give each char its own gradient so it stays visible while flying */
        const gradStyle = isGrad[li]
          ? 'background:linear-gradient(135deg,#5b8cff,#00e5b3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;'
          : '';
        return `<span class="tfly" style="display:inline-block;${gradStyle}">${ch}</span>`;
      }).join('');

      /* Fire each char in a random direction */
      line.querySelectorAll('.tfly').forEach(span => {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 280 + Math.random() * 500;
        const dx    = Math.cos(angle) * dist;
        const dy    = Math.sin(angle) * dist;
        const rot   = (Math.random() - 0.5) * 1080;
        const dur   = 550 + Math.random() * 350;

        /* Two rAFs ensure the initial state is painted before transition starts */
        requestAnimationFrame(() => requestAnimationFrame(() => {
          span.style.transition = `transform ${dur}ms cubic-bezier(0.2,0.8,0.3,1), opacity ${dur}ms ease-in`;
          span.style.transform  = `translate(${dx}px,${dy}px) rotate(${rot}deg)`;
          span.style.opacity    = '0';
        }));
      });
    });

    /* Letters fall from top when reappearing */
    setTimeout(() => {
      const tmp = document.createElement('div');

      lines.forEach((line, li) => {
        tmp.innerHTML = saved[li];
        const text = tmp.textContent;

        line.innerHTML = [...text].map(ch => {
          if (/\s/.test(ch)) return `<span style="display:inline-block;width:0.3em"> </span>`;
          const g = isGrad[li]
            ? 'background:linear-gradient(135deg,#5b8cff,#00e5b3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;'
            : '';
          return `<span class="tfall" style="display:inline-block;transform:translateY(-110vh);opacity:0;${g}">${ch}</span>`;
        }).join('');

        /* Staggered fall per letter */
        line.querySelectorAll('.tfall').forEach((span, i) => {
          setTimeout(() => {
            span.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease';
            span.style.transform  = 'translateY(0)';
            span.style.opacity    = '1';
          }, i * 55 + 20);
        });
      });

      /* Once all letters have landed, restore real DOM structure */
      setTimeout(() => {
        lines.forEach((line, li) => { line.innerHTML = saved[li]; });
        flying = false;
      }, 1100);
    }, 950);
  });
})();


/* ============================================================
   DIRECTIONAL NAV HIDE / REVEAL
   Hides navbar when scrolling down, reveals on scroll up.
============================================================ */
(function initNavHide() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastY = 0, ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.scrollY;

      if (y > 140 && y > lastY + 6) {
        nav.classList.add('nav-hide');
      } else if (y < lastY - 4) {
        nav.classList.remove('nav-hide');
      }

      if (Math.abs(y - lastY) > 2) lastY = y;
      ticking = false;
    });
  }, { passive: true });
})();


/* ============================================================
   HERO GRID DOTS PARALLAX
   The CSS grid background-position moves slower than scroll.
============================================================ */
(function initGridParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      hero.style.setProperty('--grid-y', `${y * 0.28}px`);
    }
  }, { passive: true });
})();




/* ============================================================
   SPLIT-TEXT CHARACTER REVEAL
   Add data-split="chars" to any element for char-by-char entry.
============================================================ */
(function initTextSplit() {
  document.querySelectorAll('[data-split]').forEach(el => {
    const text  = el.textContent.trim();
    let ci      = 0;

    el.innerHTML = text.split(' ').map(word =>
      `<span class="st-word">${
        word.split('').map(ch =>
          `<span class="st-char" style="--ci:${ci++}">${ch}</span>`
        ).join('')
      }</span>`
    ).join(' ');
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('[data-split]').forEach(el => obs.observe(el));
})();


/* ============================================================
   TIMELINE LINE DRAW
   Animates the vertical line ::before scaleY via CSS custom
   property as the #experience section scrolls into view.
============================================================ */
(function initTimelineDraw() {
  const section  = document.getElementById('experience');
  const timeline = document.querySelector('.timeline');
  if (!section || !timeline) return;

  function update() {
    const rect = section.getBoundingClientRect();
    const vh   = window.innerHeight;

    /* 0 = section top hits bottom of viewport, 1 = section bottom hits top */
    const progress = Math.max(0, Math.min(1,
      (vh - rect.top) / (rect.height + vh * 0.3)
    ));

    timeline.style.setProperty('--tl-scale', progress);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ============================================================
   3D CARD TILT
   Perspective tilt on project cards and timeline cards.
============================================================ */
(function initTilt3D() {
  const STRENGTH  = 8;   /* max degrees */
  const LIFT      = 14;  /* translateZ px */
  const EASE_OUT  = 'transform 0.65s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.3s';
  const EASE_MOVE = 'transform 0.12s ease';

  document.querySelectorAll('.proj-card, .project-featured').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const dx  = ((e.clientX - r.left) / r.width  - 0.5) * 2;  /* -1…1 */
      const dy  = ((e.clientY - r.top)  / r.height - 0.5) * 2;  /* -1…1 */

      card.style.transition = EASE_MOVE;
      card.style.transform  = `perspective(900px)
        rotateX(${-dy * STRENGTH}deg)
        rotateY(${dx * STRENGTH}deg)
        translateZ(${LIFT}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = EASE_OUT;
      card.style.transform  = '';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = EASE_MOVE;
    });
  });
})();


/* ============================================================
   SCROLL VELOCITY — subtle motion blur on fast scroll
============================================================ */
(function initScrollVelocity() {
  let lastY    = 0;
  let velocity = 0;
  let raf;

  function tick() {
    const y     = window.scrollY;
    velocity    = Math.abs(y - lastY);
    lastY       = y;

    const blur  = Math.min(velocity * 0.06, 1.2);
    document.documentElement.style.setProperty('--scroll-blur', `${blur}px`);
    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);
})();


/* ============================================================
   SECTION BACKGROUND PARALLAX
   Each section's content shifts subtly at a rate slower
   than the scroll, giving depth between sections.
============================================================ */
(function initSectionParallax() {
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    sections.forEach(sec => {
      const rect  = sec.getBoundingClientRect();
      const vh    = window.innerHeight;

      /* Only apply when section is visible */
      if (rect.bottom < 0 || rect.top > vh) return;

      /* How far through the viewport: -1 (entering bottom) → +1 (leaving top) */
      const factor = ((vh / 2) - (rect.top + rect.height / 2)) / vh;
      const shift  = factor * 22;   /* max 22px drift */

      sec.style.setProperty('--sec-y', `${shift}px`);
    });
  }, { passive: true });
})();


/* ============================================================
   STAGGER GRID CHILDREN
   Sets --i on each grid child so CSS can stagger transition-delay.
============================================================ */
(function initStagger() {
  ['.skills-grid', '.projects-grid', '.cert-gallery', '.featured-certs'].forEach(sel => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    Array.from(grid.children).forEach((child, i) => {
      if (!child.style.getPropertyValue('--delay')) {
        child.style.setProperty('--delay', `${i * 0.07}s`);
      }
    });
  });
})();


/* ============================================================
   SD-IN REVEAL SYSTEM
   IntersectionObserver activates .sd-active on .sd-in elements.
   Also stamps --cr, --ti, --cr-deg variables for stagger/spin.
============================================================ */
(function initScrollDrivenReveal() {

  /* --cr (card row index) on direct children of grid containers */
  ['.projects-grid', '.skills-grid', '.featured-certs'].forEach(sel => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    Array.from(grid.children).forEach((child, i) => {
      child.style.setProperty('--cr', i);
    });
  });

  /* --cr on proj-cards and skill-groups individually if above missed them */
  document.querySelectorAll('.proj-card.sd-in').forEach((el, i) =>
    el.style.setProperty('--cr', i));

  document.querySelectorAll('.sk-parent.sd-in').forEach((el, i) =>
    el.style.setProperty('--cr', i));

  /* --ti (tag index) on every span inside skill cards */
  document.querySelectorAll('.sk-parent').forEach(group => {
    group.querySelectorAll('.sg-tags span').forEach((tag, i) =>
      tag.style.setProperty('--ti', i));
  });

  /* --cr on feat-cert items inside featured-certs */
  document.querySelectorAll('.featured-certs .feat-cert').forEach((el, i) =>
    el.style.setProperty('--cr', i));

  /* --cr + --cr-deg on cert-items (alternating tilt ±3deg) */
  document.querySelectorAll('.cert-item').forEach((el, i) => {
    el.style.setProperty('--cr', i);
    const tilt = i % 2 === 0 ? '3deg' : '-3deg';
    el.style.setProperty('--cr-deg', tilt);
  });

  /* Observer: add .sd-active when element enters viewport */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('sd-active');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.sd-in').forEach(el => obs.observe(el));
})();


/* ============================================================
   SITE-WIDE GLITCH HOVER
   Stamps .glitch on every interactive element so the chitchat
   ::before animation fires on hover across the whole site.
============================================================ */
(function initSitewideGlitch() {
  [
    '.nav-link',
    '.nav-cta',
    '.btn-primary',
    '.btn-ghost',
    '.about-social-link',
    '.pf-link',
    '.pc-cta',
    '.cert-btn',
    '.btn-submit',
    '.ci',
    '.tl-tags span',
    '.pf-tags span',
    '.footer-nav a',
    '.footer-socials a',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('glitch'));
  });
})();


/* ============================================================
   WORD-LEVEL GLITCH
   Wraps every word in body text with .gw so hovering any word
   triggers the chitchat animation independently.
============================================================ */
(function initWordGlitch() {

  /* Tags whose content we must never touch */
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A']);

  /* Selectors whose subtree we skip entirely */
  const SKIP_TREE = [
    '[data-split]',       /* hero title — already split into chars */
    '#typedRole',         /* typed animation owns its textContent */
    '.cursor-blink',      /* blinking cursor char */
    '.sg-tags',           /* skill tags — dedicated glitch */
    '.preloader',
    '.glitch',            /* element-level glitch already applied */
    '.gw',                /* don't double-wrap */
    '.st-char',
    '.st-word',
    '.stat-num',          /* counter animation owns this textContent */
    '.stat-plus',
    '.about-intro strong', /* gradient text — background-clip:text breaks with child spans */
    'svg',
  ].join(', ');

  function wrapTextNodes(root) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest(SKIP_TREE)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(textNode => {
      const parts = textNode.textContent.split(/(\s+)/);
      if (parts.length === 1 && !parts[0].trim()) return;

      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const s = document.createElement('span');
          s.className = 'gw';
          s.textContent = part;
          frag.appendChild(s);
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  /* Every selector below is body text — NOT interactive elements */
  [
    '.hero-badge',
    '.hero-role',
    '.hero-bio',
    '.stat-label',
    '.about-intro',
    '.about-text',
    '.about-location',
    '.pf-eyebrow',
    '.pf-title',
    '.pf-desc',
    '.pc-title',
    '.pc-desc',
    '.tl-role',
    '.tl-company',
    '.tl-date',
    '.tl-loc',
    '.tl-list li',
    '.feat-cert-name',
    '.cert-item-overlay span',
    '.section-title',
    '.section-num',
    '.footer-name',
    '.footer-copy',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => wrapTextNodes(el));
  });
})();
