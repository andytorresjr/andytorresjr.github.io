<<<<<<< ours
// Example: Smooth scroll behavior (optional)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const toggleButton = document.getElementById('darkModeToggle');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
=======
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const storedTheme = localStorage.getItem('theme');
const body = document.body;
const toggleButton = document.getElementById('darkModeToggle');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const yearEl = document.getElementById('current-year');

const applyTheme = (theme) => {
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    if (toggleButton) toggleButton.textContent = 'Light Mode';
  } else {
    body.classList.remove('dark-mode');
    if (toggleButton) toggleButton.textContent = 'Dark Mode';
  }
};

const preferredTheme = storedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
applyTheme(preferredTheme);

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const newTheme = body.classList.toggle('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    toggleButton.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
>>>>>>> theirs
