/* ============================================================
   ANDRES TORRES JR. — script.js v2
   Theme · Nav · Scroll · Reveal · Tilt · Particle Canvas
   ============================================================ */

/* ========== Theme (dark default) ========== */
const body         = document.body;
const toggleButton = document.getElementById('darkModeToggle');
const storedTheme  = localStorage.getItem('theme');

const applyTheme = (theme) => {
  if (theme === 'light') {
    body.classList.add('light-mode');
    if (toggleButton) toggleButton.textContent = 'Dark Mode';
  } else {
    body.classList.remove('light-mode');
    if (toggleButton) toggleButton.textContent = 'Light Mode';
  }
};

// Default to dark unless user previously chose light
applyTheme(storedTheme === 'light' ? 'light' : 'dark');

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const goLight = !body.classList.contains('light-mode');
    const newTheme = goLight ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ========== Mobile Menu ========== */
const menuToggle = document.getElementById('menu-toggle');
const navLinks   = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ========== Smooth Scroll ========== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ========== Current Year ========== */
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ========== Active Nav Link ========== */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach((link) => {
  const linkPath = link.getAttribute('href').split('/').pop().split('#')[0] || 'index.html';
  if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
    link.setAttribute('aria-current', 'page');
  }
});

/* ========== Scroll Progress Bar ========== */
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  const updateProgress = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, pct)}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ========== Header scroll shrink ========== */
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

/* ========== Intersection Observer — Section Reveals ========== */
const revealEls = document.querySelectorAll('.reveal, .reveal--stagger');
if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
}

/* ========== Card 3D Tilt ========== */
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect     = card.getBoundingClientRect();
    const x        = e.clientX - rect.left;
    const y        = e.clientY - rect.top;
    const rotX     = ((y - rect.height / 2) / rect.height) * -7;
    const rotY     = ((x - rect.width  / 2) / rect.width)  *  7;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ========== Magnetic Button Effect ========== */
document.querySelectorAll('.button:not(.button--ghost)').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect    = btn.getBoundingClientRect();
    const dx      = e.clientX - (rect.left + rect.width  / 2);
    const dy      = e.clientY - (rect.top  + rect.height / 2);
    const pull    = 0.25;
    btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px) translateY(-2px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ========== Hero Particle Canvas ========== */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const hero   = canvas.parentElement;
  let particles = [];
  let mouse     = { x: -2000, y: -2000 };
  let animId;

  const ACCENT_R = 249, ACCENT_G = 115, ACCENT_B = 22;

  const resize = () => {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  };

  const spawn = () => {
    particles = [];
    const area  = canvas.width * canvas.height;
    const count = Math.max(28, Math.min(70, Math.floor(area / 11000)));
    for (let i = 0; i < count; i++) {
      particles.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        vx:      (Math.random() - 0.5) * 0.45,
        vy:      (Math.random() - 0.5) * 0.45,
        radius:  Math.random() * 1.6 + 0.5,
        opacity: Math.random() * 0.35 + 0.18,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const CONNECT = 130;
    const MOUSE_R = 160;
    const MAX_SPD = 1.6;

    particles.forEach((p, i) => {
      // Mouse attraction
      const mdx  = mouse.x - p.x;
      const mdy  = mouse.y - p.y;
      const mdst = Math.hypot(mdx, mdy);
      if (mdst < MOUSE_R && mdst > 0) {
        const force = ((MOUSE_R - mdst) / MOUSE_R) * 0.012;
        p.vx += (mdx / mdst) * force;
        p.vy += (mdy / mdst) * force;
      }

      // Dampen + clamp speed
      p.vx *= 0.988;
      p.vy *= 0.988;
      const spd = Math.hypot(p.vx, p.vy);
      if (spd > MAX_SPD) { p.vx = (p.vx / spd) * MAX_SPD; p.vy = (p.vy / spd) * MAX_SPD; }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < CONNECT) {
          const alpha = (1 - dist / CONNECT) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    });

    animId = requestAnimationFrame(draw);
  };

  // Track mouse over the hero section (not the canvas which has pointer-events: none)
  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.x = -2000;
    mouse.y = -2000;
  });

  // Init
  resize();
  spawn();
  draw();

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      spawn();
      draw();
    }, 220);
  });
})();
