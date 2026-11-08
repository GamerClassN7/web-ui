/* ME theme switcher: style (me2/me3) + mode (light/dark).
   Persisted in localStorage (wrapped: storage can be blocked, e.g. file:// in some browsers). */
(function () {
  var root = document.documentElement;
  var KEY = 'me-theme';
  var STYLES = ['me1', 'me2', 'me3'];
  var MODES = ['light', 'dark'];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function write(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  var saved = read();
  // Optional URL override, e.g. index.html?style=me2&mode=light (used for screenshots/testing, not persisted)
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('style')) saved.style = q.get('style');
    if (q.get('mode')) saved.mode = q.get('mode');
  } catch (e) { /* ignore */ }
  var state = {
    style: STYLES.indexOf(saved.style) > -1 ? saved.style : 'me3',
    mode: MODES.indexOf(saved.mode) > -1
      ? saved.mode
      : (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  };

  function apply() {
    root.setAttribute('data-me', state.style);
    root.setAttribute('data-bs-theme', state.mode);
    document.querySelectorAll('[data-set-style]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-style') === state.style));
    });
    document.querySelectorAll('[data-set-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-mode') === state.mode));
    });
    var label = document.getElementById('me-current');
    if (label) label.textContent = state.style.toUpperCase().replace('ME', 'Mass Effect ') + ' · ' + (state.mode === 'dark' ? 'Dark' : 'Light');
  }

  // Apply right away (this script is loaded in <head>) to avoid a flash of the wrong theme.
  apply();

  document.addEventListener('DOMContentLoaded', function () {
    apply();

    document.addEventListener('click', function (e) {
      var s = e.target.closest('[data-set-style]');
      var m = e.target.closest('[data-set-mode]');
      if (s) { state.style = s.getAttribute('data-set-style'); }
      if (m) { state.mode = m.getAttribute('data-set-mode'); }
      if (s || m) { write(state); apply(); }
    });

    // Keep the range "fill" in sync (--bs-range-fill is 0..1) as a fallback in case the
    // Bootstrap JS range plugin does not initialise on this page.
    function fill(input) {
      var min = +input.min || 0, max = +input.max || 100;
      var host = input.closest('.form-range') || input;
      host.style.setProperty('--bs-range-fill', (input.value - min) / (max - min));
    }
    document.querySelectorAll('.form-range-input').forEach(function (i) {
      fill(i);
      i.addEventListener('input', function () { fill(i); });
    });
  });
})();
