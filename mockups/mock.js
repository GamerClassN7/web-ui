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
  root.setAttribute('data-bs-theme', qs.get('theme') === 'light' ? 'light' : 'dark');

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

  var FRAME_ME3 = '<svg class="scr-frame" viewBox="0 0 1023 638" aria-hidden="true"><path d="M150 135 H475 C499 135 507 111 539 111 H835 Q865 111 867 143 C888 250 888 345 872 424 L866 493H495C470 493 456 519 430 519H178Q150 519 150 490V420"/></svg>';

  function px(v) { return v + 'px'; }
  /* Pixel corrections measured with tools/elements.py (best-shift search of each element vs the reference).
     [dx, dy] added to the layout numbers read by eye. Per screen, plus _all for the whole game. */
  var ADJ = {
    me3: { _all: { desc: [-4, -2], foot: [2, 0] }, graphics: { title: [0, 2] }, keys: { rows: [0, -6] }, gameplay: { rows: [3, -5] }, calibration: { rows: [0, -4] }, controls: { rows: [-1, -1] } },
    me1: { _all: { title: [0, 0], foot: [2, 0], rows: [0, -1] }, graphics: { desc: [0, -7] } },
    me2: { _all: { foot: [0, 4], title: [2, 0] }, graphics: { rows: [0, 0] }, keys: { rows: [-1, 0] }, calibration: { rows: [-1, -1], desc: [3, 0] }, gameplay: { rows: [-4, 1] }, sound: { rows: [0, 0] } }
  };
  function adjust(name, L) {
    var A = ADJ[GAME] || {}, out = {};
    ['title', 'rows', 'desc', 'foot', 'head'].forEach(function (k) {
      if (!L[k]) return;
      var a = (A[name] && A[name][k]) || [0, 0], g = (A._all && A._all[k]) || [0, 0], v = L[k].slice();
      v[0] += a[0] + g[0]; v[1] += a[1] + g[1]; out[k] = v;
    });
    return out;
  }
  function render(name) {
    var S = D[name], L = adjust(name, S.L);
    var h = '<div class="scr-title" style="left:' + px(L.title[0]) + ';top:' + px(L.title[1]) + '"><b>Options</b>' + (GAME === 'me1' ? '' : '<small>' + S.sub + '</small>') + '</div>';
    if (GAME === 'me3') h += FRAME_ME3;
    if (GAME === 'me1') h += '<div class="me1-head" style="left:' + px(L.head[0]) + ';top:' + px(L.head[1]) + ';width:' + px(L.head[2]) + ';height:' + px(L.head[3]) + '"><span>' + S.sub + '</span></div>';
    if (S.keys && GAME === 'me2') h += '<div class="me2-cols" style="left:' + px(L.rows[0] + 339) + ';top:' + px(L.rows[1] - 26) + '"><span>Primary</span><span>Secondary</span></div>';
    var rowTop = L.rows[1];
    h += '<div class="' + (S.keys ? 'me-keys ' : '') + 'me-rows" style="left:' + px(L.rows[0]) + ';top:' + px(rowTop) + ';width:' + px(L.rows[2]) + (L.rows[3] ? ';gap:' + px(L.rows[3] - (GAME === 'me2' ? 20 : GAME === 'me1' ? 22 : 24.7)) : '') + '">';
    if (S.keys && GAME === 'me1') h += '<div class="me1-keys-cols" style="top:-17px"><span>Action</span><span>Primary Key</span><span>Secondary Key</span></div>';
    else if (S.keys) h += '<div class="me-keys-head"><span>General Bindings</span><span></span><span></span></div>';
    h += S.rows.map(row).join('');
    if (S.scroll) h += '<div class="me-scroll"><i></i></div>';
    h += '</div>';
    if (S.n7) h += '<img class="n7-box" src="../assets/skins/n7-' + GAME + '.svg" style="left:' + px(S.n7[0]) + ';top:' + px(S.n7[1]) + ';width:' + px(S.n7[2]) + ';height:' + px(S.n7[3]) + '" alt="">';
    h += '<div class="me-desc" style="left:' + px(L.desc[0]) + ';top:' + px(L.desc[1]) + ';width:' + px(L.desc[2]) + ';height:' + px(L.desc[3]) + '">' + S.desc + '</div>';
    h += '<div class="me-foot btn-group" style="left:' + px(L.foot[0]) + ';top:' + px(L.foot[1]) + ';width:' + px(L.foot[2]) + ';height:' + px(L.foot[3]) + '"><a class="btn btn-solid">' + (GAME === 'me1' ? 'Default' : 'Reset to Defaults') + '</a>' + (GAME === 'me3' ? '<a class="btn btn-solid">Back</a>' : '') + '</div>';
    if (GAME === 'me1') h += '<img class="back-icon" src="../assets/icons/back-me1.svg" style="left:782px;top:548px;width:60px;height:20.5px" alt="">';
    if (GAME === 'me2') h += '<img class="back-icon" src="../assets/icons/back-me2.svg" style="left:906px;top:588px" alt="">';
    return h;
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
    Object.keys(D).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = k; sel.appendChild(o); });
    sel.addEventListener('change', function () { show(sel.value); });
    var wrap = document.getElementById('wrap'), mode = document.getElementById('mode'), ov = document.getElementById('ov');
    function setMode() { wrap.className = 'cmp-wrap mode-' + mode.value; wrap.style.setProperty('--ov', ov.value / 100); }
    mode.addEventListener('change', setMode); ov.addEventListener('input', setMode);
    mode.value = qs.get('mode') || 'side'; setMode();
    show(D[cur] ? cur : 'graphics');
  });
})();
