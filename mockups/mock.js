/* Mockup renderer: builds each game screen from compact data, using the real ME widget classes
   (css/me-theme.css + css/me-widgets.css + css/me-me2.css ...), and wires up the compare toolbar.
   Reference PNGs live in refs/<game>/ea/. Layout numbers (x,y,w,h in px of the 1023-wide PNG)
   were read from those PNGs. */
(function () {
  var qs = new URLSearchParams(location.search);
  var GAME = document.body.getAttribute('data-game');           // me1 | me2 | me3
  if (qs.get('bare')) document.body.classList.add('bare');
  var root = document.documentElement;
  root.setAttribute('data-me', GAME);
  // Light/dark: URL ?theme= wins, else the mode saved by js/me.js (shared with the showcase), else dark.
  var KEY = 'me-theme';
  function readSaved() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(patch) {
    var st = readSaved(); for (var k in patch) st[k] = patch[k];
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* storage blocked */ }
  }
  var THEME = qs.get('theme') || readSaved().mode;
  THEME = THEME === 'light' ? 'light' : 'dark';
  root.setAttribute('data-bs-theme', THEME);

  var DATA = {};

  /* =============================== ME3 =============================== */
  var L3 = { title: [150, 112], rows: [146, 186, 690], desc: [150, 420, 712, 72], foot: [617, 497, 241, 21] };
  DATA.me3 = {
    graphics: { file: '1-graphics.png', sub: 'Graphics', L: L3, scroll: true, desc: "Change the game's screen size/resolution.",
      rows: [
        { t: 'picker', l: 'Resolution', v: '1680x1050', sel: true, drop: true, arrows: false },
        { t: 'picker', l: 'Windowed Mode', v: 'Windowed', dimR: true },
        { t: 'picker', l: 'Monitor Selection', v: '[1] - Generic PnP Monitor', dimL: true },
        { t: 'onoff', l: 'Dynamic Shadows', on: 0 }, { t: 'onoff', l: 'Motion Blur', on: 0 }, { t: 'onoff', l: 'VSYNC', on: 0 },
        { t: 'picker', l: 'Framerate Cap', v: '240', dis: true },
        { t: 'onoff', l: 'Film Grain', on: 0 }, { t: 'onoff', l: 'Antialiasing', on: 0 }] },
    calibration: { file: '2-calibration.png', sub: 'Calibration', L: L3, n7: [434, 283, 261, 130], desc: 'Adjust the game’s brightness. "N" and "7" should both be visible.',
      rows: [
        { t: 'picker', l: 'Brightness', v: '0', sel: true },
        { t: 'onoff', l: 'Enable HDR', on: 0, labels: ['Auto', 'Off'] },
        { t: 'picker', l: 'HDR Contrast', v: '0', dis: true }, { t: 'picker', l: 'HDR Brightness', v: '1000', dis: true }] },
    sound: { file: '3-sound.png', sub: 'Sound', L: L3, desc: 'Increase or decrease music volume.',
      rows: [
        { t: 'slider', l: 'Dialog Volume', pct: 100 }, { t: 'slider', l: 'Sound Effects Volume', pct: 100 },
        { t: 'slider', l: 'Music Volume', pct: 100, sel: true }] },
    controls: { file: '4-controls.png', sub: 'Controls', L: L3, desc: 'Use LT to tight aim and RT to shoot.<br>Use LB to select weapons and RB to select powers.',
      rows: [
        { t: 'onoff', l: 'Invert Y-Axis', on: 1 }, { t: 'onoff', l: 'Mouse Dampening', on: 0 },
        { t: 'slider', l: 'Mouse Sensitivity', pct: 50 },
        { t: 'picker', l: 'Camera Sensitivity', v: 'Medium' }, { t: 'picker', l: 'Stick Configuration', v: 'Default', dimL: true },
        { t: 'picker', l: 'Trigger Configuration', v: 'Default', sel: true, dimL: true }] },
    keys: { file: '5-key-bindings.png', sub: 'Key Bindings', L: L3, keys: true, scroll: true, desc: '',
      rows: [
        { t: 'key', l: 'Move Forward', a: 'W', b: '', sel: true }, { t: 'key', l: 'Move Backward', a: 'S', b: '' },
        { t: 'key', l: 'Strafe Left', a: 'A', b: '' }, { t: 'key', l: 'Strafe Right', a: 'D', b: '' },
        { t: 'key', l: 'Walk', a: 'Left Control', b: '' }, { t: 'key', l: 'Use / Cover / Storm', a: 'Spacebar', b: '' },
        { t: 'key', l: 'Navigational Assistance', a: 'V', b: 'M' }, { t: 'key', l: 'Cover Turn', a: 'Middle Mouse Button', b: '' }] },
    gameplay: { file: '6-gameplay.png', sub: 'Gameplay', L: L3, scroll: true, desc: "Remove a squadmate's equipped helmet in most circumstances.",
      rows: [
        { t: 'picker', l: 'Auto Level-Up', v: 'Squad & Player' }, { t: 'onoff', l: 'Squadmate Power Use', on: 0 },
        { t: 'onoff', l: 'Subtitles', on: 1 }, { t: 'onoff', l: 'Autosave', on: 0 }, { t: 'onoff', l: 'Hints', on: 0 },
        { t: 'onoff', l: 'Action Icons', on: 0 }, { t: 'picker', l: 'Conversation Mode', v: 'Full Decisions' },
        { t: 'picker', l: "Shepard's Helmet", v: 'Default' }, { t: 'picker', l: 'Squadmate Helmets', v: 'Default Off', sel: true }] }
  };

  /* =============================== ME2 =============================== */
  // layout per screen (the EA screenshots were taken at different window sizes)
  var P2 = 25.7;
  DATA.me2 = {
    graphics: { file: 'graphics-picture-1.png', sub: 'Graphics', L: { title: [122, 112], rows: [122, 203, 860, P2], desc: [120, 484, 866, 64], foot: [377, 582, 165, 24] }, desc: 'Change game resolution.',
      rows: [
        { t: 'picker', l: 'Resolution', v: '1152x720', sel: true, boxed: true, drop: true, aL: false, aR: false },
        { t: 'picker', l: 'Windowed Mode', v: 'Windowed', aL: true, aR: false },
        { t: 'picker', l: 'Monitor Selection', v: '[1] - Generic PnP Monitor', boxed: true, drop: true, aL: false, aR: false },
        { t: 'onoff', l: 'Dynamic Shadows', on: 0, aR: true }, { t: 'onoff', l: 'Motion Blur', on: 0, aR: true }, { t: 'onoff', l: 'VSYNC', on: 0, aR: true },
        { t: 'picker', l: 'Framerate Cap', v: '240', dis: true, aL: true, aR: false },
        { t: 'onoff', l: 'Film Grain', on: 0, aR: true }, { t: 'onoff', l: 'Antialiasing', on: 0, aR: true }, { t: 'onoff', l: 'Ambient Occlusion', on: 0, aR: true }] },
    calibration: { file: 'calibration-picture-2.png', sub: 'Calibration', L: { title: [123, 112], rows: [123, 203, 860, P2], desc: [120, 329, 866, 64], foot: [377, 583, 165, 24] }, n7: [401, 400, 293, 155], desc: 'Adjust the game’s brightness. "N" and "7" should both be visible.',
      rows: [
        { t: 'picker', l: 'Brightness', v: '0', sel: true, aL: true, aR: true },
        { t: 'onoff', l: 'Enable HDR', on: 0, labels: ['Auto', 'Off'], aR: true },
        { t: 'picker', l: 'HDR Contrast', v: '0', dis: true, aL: true, aR: true }, { t: 'picker', l: 'HDR Brightness', v: '1000', dis: true, aL: true, aR: true }] },
    sound: { file: 'sound-picture-3.png', sub: 'Sound', L: { title: [122, 110], rows: [122, 199, 860, P2], desc: [120, 300, 866, 64], foot: [376, 582, 165, 24] }, desc: 'Increase or decrease music volume.',
      rows: [
        { t: 'slider', l: 'Dialog Volume', pct: 100 }, { t: 'slider', l: 'Sound Effects Volume', pct: 100 }, { t: 'slider', l: 'Music Volume', pct: 100, sel: true }] },
    controls: { file: 'controls-picture-4.png', sub: 'Controls', L: { title: [121, 112], rows: [121, 203, 860, P2], desc: [119, 380, 866, 66], foot: [375, 586, 165, 24] }, desc: 'Enables or Disables inverted vertical camera movement.',
      rows: [
        { t: 'onoff', l: 'Invert Y-Axis', on: 1, sel: true, aL: true },
        { t: 'onoff', l: 'Mouse Dampening', on: 0, aR: true },
        { t: 'slider', l: 'Mouse Sensitivity', pct: 50 },
        { t: 'picker', l: 'Camera Sensitivity', v: 'Medium', aL: true, aR: true },
        { t: 'picker', l: 'Stick Configuration', v: 'Default', aL: false, aR: true },
        { t: 'picker', l: 'Shooting Configuration', v: 'Default', aL: false, aR: true }] },
    keys: { file: 'key-bindings-picture-5.png', sub: 'Key Bindings', L: { title: [125, 112], rows: [125, 200, 862, P2], desc: [122, 484, 868, 64], foot: [380, 587, 165, 24] }, keys: true, scroll: true, desc: '',
      rows: [
        { t: 'key', l: 'Move Forward', a: 'W', b: '', sel: true }, { t: 'key', l: 'Move Backward', a: 'S', b: '' },
        { t: 'key', l: 'Strafe Left', a: 'A', b: '' }, { t: 'key', l: 'Strafe Right', a: 'D', b: '' },
        { t: 'key', l: 'Walk', a: 'Left Control', b: '' }, { t: 'key', l: 'Use / Cover / Sprint', a: 'Spacebar', b: '' },
        { t: 'key', l: 'Map', a: 'M', b: '' }, { t: 'key', l: 'Quick Save', a: 'F5', b: '' }, { t: 'key', l: 'Quick Load', a: 'F9', b: '' }] },
    gameplay: { file: 'gameplay-picture-6.png', sub: 'Gameplay', L: { title: [38, 118], rows: [38, 206, 858, P2], desc: [36, 360, 864, 62], foot: [291, 588, 165, 24] }, desc: 'This difficulty is intended for players who are familiar with shooters and RPGs. This is the baseline Mass Effect 2 experience.',
      rows: [
        { t: 'picker', l: 'Combat Difficulty', v: 'Normal', sel: true, aL: true, aR: true },
        { t: 'picker', l: 'Auto Level Up', v: 'Off', aL: false, aR: true },
        { t: 'onoff', l: 'Squad Power Usage', on: 0, aR: true },
        { t: 'onoff', l: 'Subtitles', on: 1, aL: true },
        { t: 'onoff', l: 'Autosave', on: 0, aR: true }] }
  };

  /* =============================== ME1 =============================== */
  // layout numbers read from refs/me1/ea/*.png (1023 px wide); rows = [x, top, width, pitch]
  function L1(top, pitch, extra) {
    var o = { title: [170, 79], head: [10, 105, 740, 70], rows: [10, top, 740, pitch], desc: [10, 422, 740, 103], foot: [183, 545, 151, 24] };
    for (var k in (extra || {})) o[k] = extra[k];
    return o;
  }
  DATA.me1 = {
    graphics: { file: 'graphics-picture-1.png', sub: 'Graphics', L: L1(185, 22.7), desc: 'Sets the resolution of the display',
      rows: [
        { t: 'picker', l: 'Resolution', v: '1920 x 1200 (16:9)', sel: true },
        { t: 'picker', l: 'Window Mode', v: 'Borderless' },
        { t: 'picker', l: 'Monitor Selection', v: '[1] - Generic PnP Monitor' },
        { t: 'onoff', l: 'Dynamic Shadows', on: 0 }, { t: 'onoff', l: 'Motion Blur', on: 0 }, { t: 'onoff', l: 'VSYNC', on: 0 },
        { t: 'picker', l: 'Framerate Cap', v: '240', dis: true },
        { t: 'onoff', l: 'Film Grain', on: 0 }, { t: 'onoff', l: 'Antialiasing', on: 0 }, { t: 'onoff', l: 'Ambient Occlusion', on: 0 }] },
    calibration: { file: 'calibration-picture-2.png', sub: 'Calibration', L: L1(178, 24), n7: [425, 287, 292, 113], desc: 'Adjust the game’s brightness. "N" and "7" should both be visible.',
      rows: [
        { t: 'slider', l: 'Brightness', pct: 50, val: '0', sel: true },
        { t: 'onoff', l: 'Enable HDR', on: 0, labels: ['Auto', 'Off'] },
        { t: 'slider', l: 'HDR Contrast', pct: 50, val: '0', dis: true },
        { t: 'slider', l: 'HDR Brightness', pct: 8, val: '1000', dis: true }] },
    sound: { file: 'sound-picture-3.png', sub: 'Sound', L: L1(185, 22.7), desc: 'Increase or decrease dialog volume.',
      rows: [
        { t: 'slider', l: 'Dialog Volume', pct: 100, val: '100', sel: true },
        { t: 'slider', l: 'Sound Effects Volume', pct: 100, val: '100' },
        { t: 'slider', l: 'Music Volume', pct: 100, val: '100' }] },
    controls: { file: 'controls-picture-4.png', sub: 'Controls', L: L1(181, 25.6),
      desc: 'This setting affects the overall speed of the camera rotation in relation to mouse movement.<br>The higher the sensitivity, the more responsive camera rotation becomes.',
      rows: [
        { t: 'onoff', l: 'Invert Y Axis', on: 1 },
        { t: 'slider', l: 'Mouse Sensitivity', pct: 50, val: '50', sel: true },
        { t: 'onoff', l: 'Mako Camera-Relative Steering', on: 0 },
        { t: 'picker', l: 'Camera Sensitivity', v: 'Normal' },
        { t: 'picker', l: 'Stick Configuration', v: 'Default' },
        { t: 'picker', l: 'Shooting Configuration', v: 'Default' }] },
    keys: { file: 'key-bindings-picture-5.png', sub: 'Key Bindings', keys: true, scroll: true, desc: '',
      L: L1(207, 24, { rows: [10, 207, 740, 24] }),
      rows: [
        { t: 'group', l: 'General' },
        { t: 'key', l: 'Move Forward', a: 'W', b: '' }, { t: 'key', l: 'Move Backward', a: 'S', b: '' },
        { t: 'key', l: 'Move Left', a: 'A', b: '' }, { t: 'key', l: 'Move Right', a: 'D', b: '' },
        { t: 'key', l: 'Toggle Walk', a: 'T', b: '' }, { t: 'key', l: 'Toggle Crouch', a: 'Left Control', b: '' }] },
    gameplay: { file: 'gameplay-picture-6.png', sub: 'Gameplay', desc: 'Adjust the difficulty of combat across the game.',
      L: L1(179, 25.4, { title: [166, 75], head: [5, 101, 750, 72], rows: [5, 179, 750, 25.4], desc: [5, 415, 751, 112], foot: [181, 548, 153, 24] }),
      rows: [
        { t: 'picker', l: 'Combat Difficulty', v: 'Normal', sel: true },
        { t: 'picker', l: 'Auto Level-Up', v: 'Off' },
        { t: 'picker', l: 'Level Scaling', v: 'Legendary Mode' },
        { t: 'picker', l: 'Squad Power Usage', v: 'Defensive' },
        { t: 'onoff', l: 'Subtitles', on: 1 }, { t: 'onoff', l: 'Auto Save', on: 0 }, { t: 'onoff', l: 'Enable Tutorials', on: 0 },
        { t: 'text', l: 'Reset Tutorials' }] }
  };

  var D = DATA[GAME] || DATA.me3;

  function arrow(side, dim, hide) {
    return '<button class="me-arrow' + (side === 'r' ? ' r' : '') + (dim ? ' dim' : '') + '" tabindex="-1" aria-hidden="true"' + (hide ? ' style="visibility:hidden"' : '') + '></button>';
  }
  function row(r) {
    var cls = 'me-row' + (r.sel ? ' selected' : '') + (r.dis ? ' disabled' : '');
    var mid = '', aside = '<span></span>';
    var me2 = GAME === 'me2', me1 = GAME === 'me1';
    var aL = me2 ? r.aL !== false && (r.aL || r.t === 'slider') : r.arrows !== false;
    var aR = me2 ? (r.aR === true || r.t === 'slider') : r.arrows !== false;
    if (me1) {
      if (r.t === 'group') return '<div class="me-row selected group"><span class="me-row-label">' + r.l + '</span><span></span><span></span></div>';
      if (r.t === 'text') return '<div class="me-row"><span class="me-row-label">' + r.l + '</span><span></span><span></span></div>';
      if (r.t === 'picker') return '<div class="' + cls + '"><span class="me-row-label">' + r.l + '</span><div class="me-picker"><span class="me-picker-value">' + r.v + '</span><span class="me-picker-drop"></span></div><span></span></div>';
      if (r.t === 'slider') return '<div class="' + cls + '"><span class="me-row-label">' + r.l + '</span><div class="me-picker slider">' + arrow('l', false, false) +
        '<div class="form-range"><input class="form-range-input" type="range" min="0" max="100" value="' + r.pct + '" tabindex="-1"></div>' + arrow('r', false, false) +
        '<span class="me-row-aside me1-val">' + (r.val || r.pct) + '</span></div><span></span></div>';
    }
    if (r.t === 'picker') {
      mid = '<div class="me-picker' + (r.arrows === false ? ' no-arrows' : '') + (r.boxed ? ' boxed' : '') + '">' +
        (r.arrows === false && !me2 ? '' : arrow('l', r.dimL || r.dis, !aL)) + '<span class="me-picker-value">' + r.v + '</span>' + (r.drop ? '<span class="me-picker-drop"></span>' : '') + (r.arrows === false && !me2 ? '' : arrow('r', r.dimR || r.dis, !aR)) + '</div>';
    } else if (r.t === 'onoff') {
      var lab = r.labels || ['On', 'Off'];
      var oo = '<div class="me-onoff btn-group">' +
        '<label class="btn btn-check"><input type="radio" tabindex="-1"' + (r.on === 0 ? ' checked' : '') + '>' + lab[0] + '</label>' +
        '<label class="btn btn-check"><input type="radio" tabindex="-1"' + (r.on === 1 ? ' checked' : '') + '>' + lab[1] + '</label></div>';
      mid = me2 ? '<div class="me-picker has-onoff">' + arrow('l', false, !aL) + oo + arrow('r', false, !aR) + '</div>' : oo;
    } else if (r.t === 'slider') {
      mid = '<div class="me-picker">' + arrow('l', false, false) + '<div class="form-range"><input class="form-range-input" type="range" min="0" max="100" value="' + r.pct + '" tabindex="-1"></div>' + arrow('r', !me2 && r.pct >= 100, me2 && r.pct >= 100) + '</div>';
      aside = '<span class="me-row-aside">' + (r.pct + '%') + '</span>';
    } else if (r.t === 'key') {
      return '<div class="' + cls + '"><span class="me-row-label">' + r.l + '</span><span class="key-cell">' + r.a + '</span><span class="key-cell">' + r.b + '</span></div>';
    }
    return '<div class="' + cls + '"><span class="me-row-label">' + r.l + '</span>' + mid + aside + '</div>';
  }

  // ME3 frame. The description panel is not a separate box in the game: it fills the frame interior below y=421
  // (slanted right edge, the bottom notch and the rounded bottom-left corner), light band at the top fading to navy.
  var FRAME_ME3 = '<svg class="scr-frame" viewBox="0 0 1023 638" aria-hidden="true">' +
    '<defs><linearGradient id="me3-desc" x1="0" y1="421" x2="0" y2="519" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0" stop-color="#1f4a92"/><stop offset=".07" stop-color="#1a3d78"/><stop offset=".2" stop-color="#1c324b"/><stop offset=".38" stop-color="#0a1630"/><stop offset=".6" stop-color="#060c1a"/><stop offset="1" stop-color="#05091a"/></linearGradient></defs>' +
    '<path class="scr-desc" d="M155 421H872.6L866 493H495C470 493 456 519 430 519H178Q150 519 150 490V427Z" fill="url(#me3-desc)"/>' +
    '<path class="scr-desc-sheen" d="M150 506L869.4 447 866 493H495C470 493 456 519 430 519H178Q150 519 150 490Z"/>' +
    '<path class="scr-desc-top" d="M155 421.5H872.5"/><path d="M150 135 H475 C499 135 507 111 539 111 H835 Q865 111 867 143 C888 250 888 345 872 424 L866 493H495C470 493 456 519 430 519H178Q150 519 150 490V420"/></svg>';

  function px(v) { return v + 'px'; }
  /* Pixel corrections measured with tools/elements.py (best-shift search of each element vs the reference).
     [dx, dy] added to the layout numbers read by eye. Per screen, plus _all for the whole game. */
  // Per-screen nudges (x, y) on top of the layout numbers above, measured by registering every element
  // of the render against the reference PNG (edge correlation). Keys: title, rows, desc, foot, head, back.
  var ADJ = {
    me3: { _all: { desc: [-4, -2], foot: [0, 0] }, graphics: { title: [0, 2] }, keys: { title: [0, -2], rows: [0, -6], foot: [0, -4] }, gameplay: { title: [0, -3], rows: [1, -5], foot: [0, -5] }, calibration: { rows: [0, -4], foot: [0, -3] }, controls: { rows: [0, -1], foot: [0, 0] }, sound: { title: [0, 2], foot: [-2, -1] } },
    me1: { _all: { title: [0, -2], foot: [-1, 0], rows: [0, -1] }, graphics: { desc: [0, -7], back: [-3, -1] }, calibration: { back: [-4, -1] }, sound: { back: [-5, -1] }, controls: { back: [-5, -2] }, keys: { foot: [0, -2], back: [-6, -2] }, gameplay: { rows: [1, 0], back: [2, 1] } },
    me2: { _all: { foot: [0, 0], title: [2, 0] }, graphics: { foot: [0, 4] }, keys: { rows: [-1, -2], back: [4, 2] }, calibration: { rows: [-1, -1], desc: [3, 0], foot: [0, 1], back: [-1, -2] }, gameplay: { rows: [-1, 1], back: [-4, -2] }, sound: { title: [0, -2], foot: [0, -1], back: [-1, -4] }, controls: { foot: [0, -1], back: [-3, 0] } }
  };
  function adjust(name, L) {
    var A = ADJ[GAME] || {}, out = {};
    ['title', 'rows', 'desc', 'foot', 'head', 'back'].forEach(function (k) {
      if (!L[k]) return;
      var a = (A[name] && A[name][k]) || [0, 0], g = (A._all && A._all[k]) || [0, 0], v = L[k].slice();
      v[0] += a[0] + g[0]; v[1] += a[1] + g[1]; out[k] = v;
    });
    return out;
  }
  function render(name) {
    var S = D[name], L = adjust(name, Object.assign({ back: GAME === 'me1' ? [782, 548] : [906, 588] }, S.L));
    var h = '<div class="scr-title" style="left:' + px(L.title[0]) + ';top:' + px(L.title[1]) + '"><b>Options</b>' + (GAME === 'me1' ? '' : '<small>' + S.sub + '</small>') + '</div>';
    if (GAME === 'me3') h += FRAME_ME3;
    if (GAME === 'me1') h += '<div class="me1-head" style="left:' + px(L.head[0]) + ';top:' + px(L.head[1]) + ';width:' + px(L.head[2]) + ';height:' + px(L.head[3]) + '"><span>' + S.sub + '</span></div>';
    if (S.keys && GAME === 'me2') h += '<div class="me2-cols" style="left:' + px(L.rows[0] + 339) + ';top:' + px(L.rows[1] - 26) + '"><span>Primary</span><span>Secondary</span></div>';
    var rowTop = L.rows[1];
    h += '<div class="' + (S.keys ? 'me-keys ' : '') + 'me-rows" style="left:' + px(L.rows[0]) + ';top:' + px(rowTop) + ';width:' + px(L.rows[2]) + (L.rows[3] ? ';gap:' + px(L.rows[3] - (GAME === 'me2' ? 20 : GAME === 'me1' ? 22 : 24.7)) : '') + '">';
    if (S.keys && GAME === 'me1') h += '<div class="me1-keys-cols" style="top:-17px"><span>Action</span><span>Primary Key</span><span>Secondary Key</span></div>';
    else if (S.keys) h += '<div class="me-keys-head"><span>General Bindings</span><span></span><span></span></div>';
    h += S.rows.map(function (r, i) { return row(r).replace('<div class="', '<div data-i="' + i + '" class="'); }).join('');
    if (S.scroll) h += '<div class="me-scroll"><i></i></div>';
    h += '</div>';
    if (S.n7) h += '<img class="n7-box" src="../assets/skins/n7-' + GAME + '.svg" style="left:' + px(S.n7[0]) + ';top:' + px(S.n7[1]) + ';width:' + px(S.n7[2]) + ';height:' + px(S.n7[3]) + '" alt="">';
    h += '<div class="me-desc" style="left:' + px(L.desc[0]) + ';top:' + px(L.desc[1]) + ';width:' + px(L.desc[2]) + ';height:' + px(L.desc[3]) + '">' + S.desc + '</div>';
    h += '<div class="me-foot btn-group" style="left:' + px(L.foot[0]) + ';top:' + px(L.foot[1]) + ';width:' + px(L.foot[2]) + ';height:' + px(L.foot[3]) + '"><a class="btn btn-solid">' + (GAME === 'me1' ? 'Default' : 'Reset to Defaults') + '</a>' + (GAME === 'me3' ? '<a class="btn btn-solid">Back</a>' : '') + '</div>';
    if (GAME === 'me1') h += '<img class="back-icon" src="../assets/icons/back-me1.svg" style="left:' + px(L.back[0]) + ';top:' + px(L.back[1]) + ';width:60px;height:20.5px" alt="">';
    if (GAME === 'me2') h += '<img class="back-icon" src="../assets/icons/back-me2.svg" style="left:' + px(L.back[0]) + ';top:' + px(L.back[1]) + '" alt="">';
    return h;
  }

  /* ---------------- interactivity: every widget can be used for testing ----------------
     The first render is exactly the reference state; clicking / keys change the data and re-render. */
  var RES = ['1152x720', '1280x720', '1366x768', '1600x900', '1680x1050', '1920x1080', '1920x1200', '2560x1440', '3840x2160'];
  var OPTS = {
    'Resolution': GAME === 'me1' ? ['1280 x 720 (16:9)', '1600 x 900 (16:9)', '1920 x 1080 (16:9)', '1920 x 1200 (16:9)', '2560 x 1440 (16:9)', '3840 x 2160 (16:9)'] : RES,
    'Windowed Mode': ['Fullscreen', 'Windowed'], 'Window Mode': ['Fullscreen', 'Windowed', 'Borderless'],
    'Monitor Selection': ['[1] - Generic PnP Monitor', '[2] - Generic PnP Monitor'],
    'Framerate Cap': ['30', '60', '120', '144', '165', '240', 'Unlimited'],
    'Camera Sensitivity': GAME === 'me1' ? ['Low', 'Normal', 'High'] : ['Low', 'Medium', 'High'],
    'Stick Configuration': ['Default', 'Southpaw', 'Legacy'], 'Trigger Configuration': ['Default', 'Swapped'], 'Shooting Configuration': ['Default', 'Swapped'],
    'Auto Level-Up': GAME === 'me3' ? ['Off', 'Squad Only', 'Squad & Player'] : ['Off', 'Squad Only', 'Squad & Player'], 'Auto Level Up': ['Off', 'Squad Only', 'Squad & Player'],
    'Conversation Mode': ['Full Decisions', 'Auto Dialogue', 'Auto Decisions'],
    "Shepard's Helmet": ['Default', 'Default Off', 'Always On'], 'Squadmate Helmets': ['Default', 'Default Off', 'Always Off'],
    'Combat Difficulty': ['Casual', 'Normal', 'Veteran', 'Hardcore', 'Insanity'], 'Level Scaling': ['Legendary Mode', 'Original'],
    'Squad Power Usage': ['Off', 'Defensive', 'Offensive', 'All']
  };
  function numeric(v) { return /^-?\d+$/.test(String(v)); }
  function optsFor(r) {
    if (OPTS[r.l]) return OPTS[r.l].indexOf(r.v) > -1 ? OPTS[r.l] : [r.v].concat(OPTS[r.l]);
    if (numeric(r.v)) { var n = +r.v, a = []; for (var k = n - 10; k <= n + 10; k++) a.push(String(k)); return a; }   // e.g. Brightness 0 -> -10..10
    return [r.v];
  }
  var DEFAULTS = JSON.parse(JSON.stringify(DATA));
  var capture = null;                                    // key-binding cell waiting for a key

  function rowOf(el) { var e = el.closest('[data-i]'); return e ? { el: e, r: D[cur].rows[+e.getAttribute('data-i')] } : null; }
  function select(r) { D[cur].rows.forEach(function (x) { if (x.t !== 'group') x.sel = x === r; }); }
  function setPicker(r, v) {
    var o = optsFor(r), i = o.indexOf(v); if (i < 0) return; r.v = v;
    if (GAME === 'me2') { if (!r.drop) { r.aL = i > 0; r.aR = i < o.length - 1; } }
    else { r.dimL = i === 0; r.dimR = i === o.length - 1; }
  }
  function step(r, dir) {
    if (r.dis) return;
    if (r.t === 'picker') { var o = optsFor(r), i = o.indexOf(r.v) + dir; if (i >= 0 && i < o.length) setPicker(r, o[i]); }
    else if (r.t === 'onoff') { setOnOff(r, dir > 0 ? 1 : 0); }
    else if (r.t === 'slider') { setPct(r, Math.max(0, Math.min(100, r.pct + dir * 5))); }
  }
  function setOnOff(r, on) { r.on = on; if (GAME === 'me2') { r.aL = on === 1; r.aR = on === 0; } }
  function setPct(r, pct) {
    if (r.val !== undefined && numeric(r.val)) { var off = r._off !== undefined ? r._off : (r._off = r.pct - +r.val); r.val = String(pct - off); }
    r.pct = pct;
  }
  function closeDrop() { var d = document.querySelector('.mock-drop'); if (d) d.remove(); }
  function openDrop(r, rowEl) {
    closeDrop(); if (r.dis) return;
    // position in the stage's own CSS px (offsets, not screen rects: the view may be zoomed to fit the window)
    var stg = document.getElementById('stage'), pk = rowEl.querySelector('.me-picker'), x = 0, y = 0;
    for (var e = pk; e && e !== stg; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; }
    var d = document.createElement('div'); d.className = 'mock-drop'; d.setAttribute('role', 'listbox');
    d.style.left = x + 'px'; d.style.top = (y + pk.offsetHeight + 2) + 'px'; d.style.width = pk.offsetWidth + 'px';
    optsFor(r).forEach(function (v) {
      var o = document.createElement('button'); o.type = 'button'; o.textContent = v; o.setAttribute('role', 'option');
      if (v === r.v) o.setAttribute('aria-selected', 'true');
      o.addEventListener('click', function (e) { e.stopPropagation(); setPicker(r, v); closeDrop(); show(cur); });
      d.appendChild(o);
    });
    stg.appendChild(d); var s = d.querySelector('[aria-selected]'); if (s) s.scrollIntoView({ block: 'nearest' });
  }
  function hasDrop(r) { return r.t === 'picker' && (r.drop || GAME === 'me1'); }
  function keyName(e) {
    if (e.key === ' ') return 'Spacebar';
    if (['Control', 'Shift', 'Alt'].indexOf(e.key) > -1) return (e.location === 2 ? 'Right ' : 'Left ') + e.key;
    if (e.key.length === 1) return e.key.toUpperCase();
    return e.key.replace(/^Arrow/, '') ;
  }

  function wire() {
    var stg = document.getElementById('stage');
    stg.addEventListener('click', function (e) {
      if (e.target.closest('.mock-drop') || e.target.matches('.form-range-input')) return;
      var foot = e.target.closest('.me-foot .btn');
      if (foot) { if (foot === foot.parentNode.firstElementChild) { D[cur] = DATA[GAME][cur] = JSON.parse(JSON.stringify(DEFAULTS[GAME][cur])); closeDrop(); show(cur); } return; }
      var hit = rowOf(e.target); closeDrop();
      if (!hit || hit.r.t === 'group') return;
      var r = hit.r, t = e.target; e.preventDefault();
      select(r);
      if (!r.dis) {
        var arrow = t.closest('.me-arrow'), lab = t.closest('.me-onoff .btn-check'), key = t.closest('.key-cell');
        if (arrow) step(r, arrow.classList.contains('r') ? 1 : -1);
        else if (lab) setOnOff(r, GAME === 'me1' ? 1 - r.on : (lab === lab.parentNode.firstElementChild ? 0 : 1));   // ME1 shows one box that toggles
        else if (key && r.t === 'key') { show(cur); var cells = document.querySelectorAll('#stage [data-i="' + D[cur].rows.indexOf(r) + '"] .key-cell'); var c = cells[key === hit.el.querySelectorAll('.key-cell')[0] ? 0 : 1]; c.textContent = 'Press a key…'; capture = { r: r, col: c === cells[0] ? 'a' : 'b' }; return; }
        else if (hasDrop(r) && t.closest('.me-picker')) { show(cur); openDrop(r, document.querySelector('#stage [data-i="' + D[cur].rows.indexOf(r) + '"]')); return; }
      }
      show(cur);
    });
    stg.addEventListener('input', function (e) {
      if (!e.target.matches('.form-range-input')) return;
      var hit = rowOf(e.target); if (!hit || hit.r.dis) return;
      setPct(hit.r, +e.target.value);
      var host = e.target.closest('.form-range'); host.style.setProperty('--bs-range-fill', hit.r.pct / 100);
      var as = hit.el.querySelector('.me-row-aside'); if (as) as.textContent = hit.r.val !== undefined ? hit.r.val : hit.r.pct + (GAME === 'me1' ? '' : '%');
    });
    stg.addEventListener('change', function (e) { if (e.target.matches('.form-range-input')) { var h = rowOf(e.target); if (h) select(h.r); show(cur); } });
    document.addEventListener('click', function (e) { if (!e.composedPath().some(function (n) { return n.id === 'stage'; })) closeDrop(); });   // path is fixed at dispatch (the target may be re-rendered)
    document.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('select, input:not(.form-range-input), textarea')) return;
      if (capture) {
        e.preventDefault();
        if (e.key !== 'Escape') capture.r[capture.col] = e.key === 'Backspace' || e.key === 'Delete' ? '' : keyName(e);
        capture = null; show(cur); return;
      }
      var rows = D[cur].rows, i = rows.findIndex(function (x) { return x.sel && x.t !== 'group'; }), r = rows[i], drop = document.querySelector('.mock-drop');
      if (drop && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault(); var o = optsFor(r), k = o.indexOf(r.v);
        if (e.key === 'Escape' || e.key === 'Enter') { closeDrop(); show(cur); return; }
        k = Math.max(0, Math.min(o.length - 1, k + (e.key === 'ArrowDown' ? 1 : -1))); setPicker(r, o[k]); show(cur);
        openDrop(r, document.querySelector('#stage [data-i="' + i + '"]')); return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); var d = e.key === 'ArrowDown' ? 1 : -1, j = i;
        do { j += d; } while (rows[j] && (rows[j].t === 'group'));
        if (rows[j]) { select(rows[j]); show(cur); }
      } else if (r && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); step(r, e.key === 'ArrowRight' ? 1 : -1); show(cur); }
      else if (r && e.key === 'Enter' && hasDrop(r)) { e.preventDefault(); openDrop(r, document.querySelector('#stage [data-i="' + i + '"]')); }
    });
  }

  var cur = qs.get('screen') || 'graphics';
  function show(name) {
    cur = name;
    var stg = document.getElementById('stage'); stg.setAttribute('data-screen', name); stg.innerHTML = render(name);
    document.getElementById('ref').src = '../refs/' + GAME + '/ea/' + D[name].file;
    document.getElementById('sel').value = name;
    document.querySelectorAll('.form-range-input').forEach(function (i) { i.closest('.form-range').style.setProperty('--bs-range-fill', (i.value - i.min) / (i.max - i.min)); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sel = document.getElementById('sel');
    Object.keys(D).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = D[k].sub; sel.appendChild(o); });
    sel.addEventListener('change', function () { show(sel.value); });
    var wrap = document.getElementById('wrap'), mode = document.getElementById('mode'), ov = document.getElementById('ov');
    function setMode() { wrap.className = 'cmp-wrap mode-' + mode.value; wrap.style.setProperty('--ov', ov.value / 100); fit(); }
    // scale the view down to the window width (side by side needs 2 x 1023px); never in ?bare=1 (measuring renders stay 1:1)
    function fit() {
      if (document.body.classList.contains('bare')) return;
      var need = (mode.value === 'side' ? 2 * 1023 + 12 : 1023) + 32;
      wrap.style.zoom = Math.min(1, document.documentElement.clientWidth / need);
    }
    window.addEventListener('resize', fit);
    mode.addEventListener('change', setMode); ov.addEventListener('input', setMode);
    mode.value = qs.get('mode') || 'side'; setMode();
    show(D[cur] ? cur : 'graphics');
    buildSwitcher();
    wire();
  });

  // Game (ME1/ME2/ME3) + Light/Dark switcher in the toolbar. Each game is its own page (it loads its
  // own CSS layer), so switching games navigates, carrying the current screen, view and theme along.
  function link(game) {
    var q = new URLSearchParams(location.search);
    q.set('screen', cur); q.set('theme', THEME);
    var m = document.getElementById('mode').value;
    if (m !== 'side') q.set('mode', m); else q.delete('mode');
    return game + '.html?' + q.toString();
  }
  function buildSwitcher() {
    var bar = document.querySelector('.cmp-bar'), title = bar.querySelector('strong');
    var box = document.createElement('div'); box.className = 'cmp-switch';
    box.innerHTML =
      '<div class="cmp-seg" role="group" aria-label="Game">' + ['me1', 'me2', 'me3'].map(function (g) {
        return '<a data-game-link="' + g + '"' + (g === GAME ? ' aria-current="page"' : '') + '>' + g.toUpperCase() + '</a>';
      }).join('') + '</div>' +
      '<div class="cmp-seg" role="group" aria-label="Mode">' + ['light', 'dark'].map(function (t) {
        return '<button type="button" data-theme="' + t + '" aria-pressed="' + (t === THEME) + '">' + (t === 'light' ? 'Light' : 'Dark') + '</button>';
      }).join('') + '</div>';
    if (title) bar.replaceChild(box, title); else bar.insertBefore(box, bar.firstChild);
    save({ style: GAME, mode: THEME });

    function refreshLinks() { box.querySelectorAll('[data-game-link]').forEach(function (a) { a.href = link(a.getAttribute('data-game-link')); }); }
    refreshLinks();
    document.getElementById('sel').addEventListener('change', refreshLinks);
    document.getElementById('mode').addEventListener('change', refreshLinks);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-theme]'); if (!b) return;
      THEME = b.getAttribute('data-theme');
      root.setAttribute('data-bs-theme', THEME);
      box.querySelectorAll('[data-theme]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      save({ mode: THEME });
      try { var q = new URLSearchParams(location.search); q.set('theme', THEME); history.replaceState(null, '', '?' + q.toString()); } catch (err) { /* ignore */ }
      refreshLinks();
    });
  }
})();
