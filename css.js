/**
 * css.js — dynamic light-theme loader for NeonVault
 *
 * Usage:
 *   ThemeLoader.enableLight();   // enable light theme
 *   ThemeLoader.disableLight();  // disable light theme
 *   ThemeLoader.toggle();        // toggle theme
 *   ThemeLoader.initFromStorage(); // (optional) restore saved preference
 *
 * Place this file in your static JS and include it before </body> or bundle it.
 */

const ThemeLoader = (function () {
  const STYLE_ID = 'nv-light-css';
  const STORAGE_KEY = 'nv-theme';
  // Update this path if you place light.css in a different folder
  const LIGHT_CSS_PATH = '/light.css?v=1';

  function createLink() {
    const link = document.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = LIGHT_CSS_PATH;
    link.crossOrigin = 'anonymous';
    // Append to head so it loads after existing styles
    document.head.appendChild(link);
    return link;
  }

  function removeLink() {
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();
  }

  function clearInlineBackgrounds() {
    // Remove inline backgrounds/padding that block theme variables
    document.querySelectorAll('.glass, .glass-soft, .note-card, .note-row').forEach(el => {
      if (!el || !el.style) return;
      if (el.style.background) el.style.background = '';
      if (el.style.padding) el.style.padding = '';
    });
  }

  function enableLight() {
    // Add class to body
    document.body.classList.add('nv-light-theme');

    // Inject stylesheet if not present
    if (!document.getElementById(STYLE_ID)) {
      createLink();
    } else {
      // Refresh href to bust cache if needed
      const l = document.getElementById(STYLE_ID);
      l.href = LIGHT_CSS_PATH;
    }

    // Clear inline styles that would override CSS
    clearInlineBackgrounds();

    // Persist choice
    try { localStorage.setItem(STORAGE_KEY, 'light'); } catch (e) {}
  }

  function disableLight() {
    document.body.classList.remove('nv-light-theme');
    removeLink();
    try { localStorage.setItem(STORAGE_KEY, 'dark'); } catch (e) {}
  }

  function toggle() {
    if (document.body.classList.contains('nv-light-theme')) {
      disableLight();
    } else {
      enableLight();
    }
  }

  function initFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light') enableLight();
    } catch (e) {}
  }

  // Optional: expose a small helper to programmatically load the CSS file (returns a Promise)
  function loadLightCssOnce() {
    return new Promise((resolve, reject) => {
      if (document.getElementById(STYLE_ID)) {
        resolve(document.getElementById(STYLE_ID));
        return;
      }
      const link = createLink();
      link.onload = () => resolve(link);
      link.onerror = (err) => reject(err);
    });
  }

  // Expose API
  return {
    enableLight,
    disableLight,
    toggle,
    initFromStorage,
    loadLightCssOnce
  };
})();

// Auto-initialize from saved preference on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  ThemeLoader.initFromStorage();
});
