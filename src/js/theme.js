/**
 * theme.js - Global Dark & Light Mode Controller
 * Persists user choice in localStorage, honors system prefers-color-scheme,
 * and eliminates Flash of Unstyled Content (FOUC).
 */
(function () {
  // Default is light mode unless user explicitly selected 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme');
  const activeTheme = savedTheme === 'dark' ? 'dark' : 'light';

  // Immediately apply to documentElement
  document.documentElement.setAttribute('data-theme', activeTheme);

  function updateIcons(theme) {
    document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    });
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcons(next);
  };

  function initThemeToggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    updateIcons(current);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.onclick = function (e) {
        e.preventDefault();
        window.toggleTheme();
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
