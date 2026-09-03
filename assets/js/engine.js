/* ============================================================
   MINI GAME ENGINE  v2
   - รองรับ 2 อัตราส่วน: แนวนอน 1280x720 (16:9) และ แนวตั้ง 720x1280 (9:16)
   - โหมดจำลองหน้างาน: ใส่กราฟฟิกจอ (ทีวีขาตั้ง / ตู้คีออสก์ / แท็บเล็ต)
   - จัดการ คะแนน / เวลา / ชีวิต / หน้าเริ่ม / หน้าจบ ให้ทุกเกม
   ============================================================ */
window.MiniGame = (function () {

  /* ด้านสั้นของจอ = 720 เสมอ ด้านยาว = 1280 เสมอ
     เกมจึงคำนวณ layout จาก a.W / a.H ได้ตรงไปตรงมา */
  var SIZE = { land: [1280, 720], port: [720, 1280] };

  /* สัดส่วนกรอบจอ (คิดเป็นเท่าของ "ความสูงจอ") — มี 2 แบบเท่านั้น */
  var DEVS = {
    none: { bx: 0, by: 0, chin: 0, neck: 0, base: 0, bw: 0, rad: .022 },
    touch: { bx: .016, by: .016, chin: .048, neck: .10, base: .028, bw: .55, rad: .018 }
  };

  var W = 1280, H = 720, ori = 'land', dev = 'touch', sim = true;
  var reg = {}, cv, g, def, meta, api, lang = 'th', raf = 0, last = 0, running = false, AC = null;

  var UI = {
    th: {
      back: "กลับ", score: "คะแนน", start: "เริ่มเล่น", again: "เล่นอีกครั้ง", next: "เกมถัดไป →",
      home: "กลับหน้ารวมเกม", over: "จบเกม!", yourScore: "คะแนนของคุณ",
      land: "แนวนอน", port: "แนวตั้ง", sim: "On-Touch Screen",
      demo: "เดโม่ • รูปแบบการเล่นมาตรฐาน • ปรับกราฟฟิก/โลโก้/พื้นหลังได้",
      liked: "ขอบคุณ! คุณกดหัวใจให้เกมนี้แล้ว", likedAlready: "IP นี้กดหัวใจให้เกมนี้ไปแล้ว",
      prevG: "เกมก่อนหน้า", nextG: "เกมถัดไป"
    },
    en: {
      back: "Back", score: "SCORE", start: "Start", again: "Play again", next: "Next game →",
      home: "Back to catalog", over: "Game Over", yourScore: "Your score",
      land: "Landscape", port: "Portrait", sim: "On-Touch Screen",
      demo: "Demo • standard gameplay • graphics, logo & background are customisable",
      liked: "Thanks! You liked this game", likedAlready: "This IP already liked this game",
      prevG: "Previous game", nextG: "Next game"
    }
  };

  function $(s) { return document.querySelector(s); }
  function qs(k) { return new URLSearchParams(location.search).get(k); }
  function px(n) { return n.toFixed(1) + 'px'; }

  function beep(f, d, type) {
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), gg = AC.createGain();
      o.type = type || 'sine'; o.frequency.value = f || 440;
      gg.gain.setValueAtTime(0.09, AC.currentTime);
      gg.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + (d || .12));
      o.connect(gg); gg.connect(AC.destination);
      o.start(); o.stop(AC.currentTime + (d || .12));
    } catch (e) { }
  }

  /* ============ API ที่ส่งให้เกม ============ */
  /* ============================================================
     ระบบภาพประกอบเกม (sprite)
     - โหลดภาพที่ประกาศไว้ใน sprites.js ก่อนเริ่มเกม
     - เกมเรียก a.spr('mole','🐹', x, y, size) -> มีภาพก็วาดภาพ ไม่มีก็วาดอิโมจิ
     - รองรับ sprite sheet แถวเดียว {src, frames, fps}
     ============================================================ */
  var SPR = {};        // key -> {img, frames, fps}
  var sprBase = '';

  function loadSprites(gameId, done) {
    SPR = {};
    var man = (window.GAME_SPRITES || {})[gameId];
    if (!man) return done();
    sprBase = 'assets/sprites/' + gameId + '/';
    var keys = Object.keys(man), left = keys.length;
    if (!left) return done();
    var finished = false;
    function tick() { if (!--left && !finished) { finished = true; done(); } }
    keys.forEach(function (k) {
      var v = man[k], src = typeof v === 'string' ? v : v.src;
      var im = new Image();
      im.onload = function () {
        SPR[k] = { img: im, frames: (v.frames || 1), fps: (v.fps || 10) };
        tick();
      };
      im.onerror = tick;                 // ไม่มีไฟล์ก็ข้ามไป ใช้อิโมจิแทน
      im.src = sprBase + src;
    });
    /* กันเหนียว: ถ้าเน็ตอืดเกิน 2.5 วิ เริ่มเกมเลย ภาพที่มาทีหลังจะโผล่เอง */
    setTimeout(function () { if (!finished) { finished = true; done(); } }, 2500);
  }

  function makeApi() {
    var C = BRAND.colors;
    var a = {
      W: W, H: H, C: C, lang: lang,
      port: H > W,                       // แนวตั้งหรือไม่
      mn: Math.min(W, H), mx: Math.max(W, H),
      cx: W / 2, cy: H / 2,
      score: 0, lives: 0, timeLeft: 0, now: 0, data: {},
      pointer: { x: 0, y: 0, down: false },

      setScore: function (n) { a.score = Math.max(0, Math.round(n)); syncHud(); },
      add: function (n) { a.score = Math.max(0, a.score + n); syncHud(); },
      setLives: function (n) { a.lives = n; $('#sLife').classList.remove('hide'); syncHud(); },
      loseLife: function () { a.lives--; syncHud(); if (a.lives <= 0) a.end(); return a.lives; },
      addTime: function (s) { a.timeLeft += s; syncHud(); },
      end: function (title) { stop(title); },

      rnd: function (mn, mx) { return mn + Math.random() * (mx - mn); },
      rndi: function (mn, mx) { return Math.floor(mn + Math.random() * (mx - mn + 1)); },
      pick: function (ar) { return ar[Math.floor(Math.random() * ar.length)]; },
      shuffle: function (ar) { for (var i = ar.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = ar[i]; ar[i] = ar[j]; ar[j] = t; } return ar; },
      txt: function (o) { return o[lang] || o.th; },
      beep: beep,

      /* มีภาพของคีย์นี้ไหม */
      hasSpr: function (k) { return !!SPR[k]; },

      /* วาดภาพประกอบ ถ้าไม่มีไฟล์จะวาดอิโมจิที่ส่งมาแทน
         a.spr(key, fallbackEmoji, x, y, size, opt)
         x,y = จุดกึ่งกลาง   size = ความสูงที่ต้องการ (กว้างคำนวณตามสัดส่วนภาพ)
         opt = { rot: เรเดียน, alpha: 0-1, flip: true, tint: '#rrggbb' } */
      spr: function (k, emo, x, y, size, opt) {
        var s = SPR[k];
        if (!s) { if (emo) a.emo(emo, x, y, size); return false; }
        opt = opt || {};
        var im = s.img;
        var fw = im.width / s.frames, fh = im.height;
        var fi = s.frames > 1 ? (Math.floor(a.now * s.fps) % s.frames) : 0;
        var w = size * (fw / fh), h = size;
        g.save();
        if (opt.alpha !== undefined) g.globalAlpha = opt.alpha;
        g.translate(x, y);
        if (opt.rot) g.rotate(opt.rot);
        if (opt.flip) g.scale(-1, 1);
        g.drawImage(im, fi * fw, 0, fw, fh, -w / 2, -h / 2, w, h);
        g.restore();
        return true;
      },

      /* วาดอิโมจิ (ของเดิม ย้ายมาไว้ใน engine เพื่อให้ทุกเกมเรียกได้) */
      emo: function (ch, x, y, size) {
        g.font = size + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillStyle = '#fff';
        g.fillText(ch, x, y);
      },

      bg: function (c1, c2) {
        /* ภาพพื้นหลังเฉพาะเกม (แยกแนวนอน/แนวตั้ง) มาก่อน BRAND.gameBg */
        var k = (a.port && SPR.bgPort) ? 'bgPort' : (SPR.bg ? 'bg' : null);
        if (k) { g.drawImage(SPR[k].img, 0, 0, W, H); return; }
        if (a.bgImg && a.bgImg.complete && a.bgImg.naturalWidth) {
          g.drawImage(a.bgImg, 0, 0, W, H);
          g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 0, W, H); return;
        }
        var gr = g.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, c1 || C.bgTop); gr.addColorStop(1, c2 || C.bgBottom);
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
      },
      rr: function (x, y, w, h, r) {
        r = Math.max(0, Math.min(r, w / 2, h / 2));
        g.beginPath();
        g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r);
        g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r);
        g.arcTo(x, y, x + w, y, r); g.closePath();
      },
      fillRR: function (x, y, w, h, r, col) { a.rr(x, y, w, h, r); g.fillStyle = col; g.fill(); },
      text: function (s, x, y, size, col, align, weight) {
        g.font = (weight || 700) + ' ' + (size || 24) + "px Kanit,'Noto Sans Thai',sans-serif";
        g.fillStyle = col || '#fff';
        g.textAlign = align || 'center'; g.textBaseline = 'middle';
        g.fillText(s, x, y);
      },
      /* ข้อความหัวจอ ปรับขนาดอัตโนมัติให้พอดีความกว้าง */
      head: function (s, size, col) {
        size = size || a.mn * .042;
        g.font = '700 ' + size + "px Kanit,'Noto Sans Thai',sans-serif";
        while (g.measureText(s).width > W * .92 && size > 10) {
          size -= 1; g.font = '700 ' + size + "px Kanit,'Noto Sans Thai',sans-serif";
        }
        g.fillStyle = col || 'rgba(255,255,255,.95)';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(s, W / 2, a.mn * .062);
      },
      circle: function (x, y, r, col) { g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fillStyle = col; g.fill(); },
      shadow: function (on) {
        if (on) { g.shadowColor = 'rgba(0,0,0,.28)'; g.shadowBlur = 14; g.shadowOffsetY = 6; }
        else { g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0; }
      }
    };
    if (BRAND.gameBg) { a.bgImg = new Image(); a.bgImg.src = BRAND.gameBg; }
    return a;
  }

  function syncHud() {
    $('#sScore b').textContent = api.score;
    $('#sTime b').textContent = Math.max(0, Math.ceil(api.timeLeft));
    $('#sLife b').textContent = Math.max(0, api.lives);
  }

  /* ============ ขนาดจอ + กรอบจอ ============ */
  function applySize() {
    var s = SIZE[ori]; W = s[0]; H = s[1];
    cv.width = W; cv.height = H;
    $('#dims').textContent = W + ' × ' + H + (ori === 'land' ? '  (16:9)' : '  (9:16)');
    layout();
  }

  function layout() {
    var st = $('#stage'), d = DEVS[sim ? dev : 'none'];
    var availW = st.clientWidth - 26, availH = st.clientHeight - 26;
    if (availW < 40 || availH < 40) return;
    var r = W / H;
    var hFac = 1 + d.by * 2 + d.chin + d.neck + d.base;
    var wFac = Math.max(r + d.bx * 2, d.bw);
    var sh = Math.min(availH / hFac, availW / wFac);   // ความสูงจอ (px จริง)
    var sw = sh * r;

    var E = {
      dev: $('#device'), body: $('#dvBody'), scr: $('#dvScreen'),
      logo: $('#dvLogo'), neck: $('#dvNeck'), base: $('#dvBase'), ov: $('#ov')
    };
    E.dev.className = 'd-' + (sim ? dev : 'none');
    $('#scene').classList.toggle('plain', !sim || dev === 'none');

    E.scr.style.width = px(sw); E.scr.style.height = px(sh);
    E.scr.style.borderRadius = px(d.rad * sh * .55);
    E.body.style.padding = px(d.by * sh) + ' ' + px(d.bx * sh) + ' ' + px((d.by + d.chin) * sh);
    E.body.style.borderRadius = px(d.rad * sh + (d.bx * sh) * .5);

    E.logo.style.display = d.chin ? 'flex' : 'none';
    E.logo.style.height = px(d.chin * sh);
    E.logo.style.fontSize = px(Math.max(7, d.chin * sh * .38));

    E.neck.style.display = d.neck ? 'block' : 'none';
    E.neck.style.width = px(sh * .095); E.neck.style.height = px(d.neck * sh);

    E.base.style.display = d.base ? 'block' : 'none';
    E.base.style.height = px(d.base * sh);
    E.base.style.width = px(d.bw * sh);

    E.ov.style.setProperty('--k', (sh / 720).toFixed(3));
  }

  /* ============ ลูป ============ */
  function frame(ts) {
    if (!running) return;
    /* กันค่า dt ผิดปกติ (ติดลบ / กระโดด) ตอนเฟรมแรกหรือตอนสลับแท็บ */
    var dt = Math.min(.05, Math.max(0, (ts - last) / 1000 || 0)); last = ts;
    api.now += dt;
    if (api.timeLeft > 0) {
      api.timeLeft -= dt; syncHud();
      if (api.timeLeft <= 0) { api.timeLeft = 0; stop(); return; }
    }
    if (def.update) def.update(dt, api);
    if (running) { g.clearRect(0, 0, W, H); def.draw(g, api); }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    api = makeApi();
    var tm = (def.time !== undefined) ? def.time : (meta.time || 0);
    api.timeLeft = tm;
    $('#sTime').classList.toggle('hide', !tm);
    $('#sScore').classList.toggle('hide', !!def.noScore);
    $('#sLife').classList.add('hide');
    if (def.lives) api.setLives(def.lives);
    syncHud();
    if (def.setup) def.setup(api);
    $('#ov').classList.add('hide');
    running = true; last = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  }

  function stop(title) {
    if (!running) return;
    running = false; cancelAnimationFrame(raf);
    var u = UI[lang];
    $('#ovEm').textContent = def.noScore ? '🎉' : (api.score > 0 ? '🏆' : '🙂');
    $('#ovTitle').textContent = title || u.over;
    $('#ovDesc').textContent = '';
    $('#howlist').innerHTML = '';
    if (def.noScore) $('#ovScore').classList.add('hide');
    else {
      $('#ovScore').classList.remove('hide');
      $('#ovScoreLbl').textContent = u.yourScore;
      $('#ovScore b').textContent = api.score;
    }
    $('#ovGo').textContent = u.again;
    $('#ovNext').classList.remove('hide');
    $('#ov').classList.remove('hide');
  }

  /* กลับไปหน้าเริ่มเกม (ใช้ตอนสลับแนวจอ) */
  function showStart() {
    running = false; cancelAnimationFrame(raf);
    var u = UI[lang];
    $('#ovEm').textContent = meta.icon;
    $('#ovTitle').textContent = meta[lang].name;
    $('#ovDesc').textContent = meta[lang].tag;
    $('#ovScore').classList.add('hide');
    $('#ovNext').classList.add('hide');
    $('#howlist').innerHTML = meta[lang].how.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    $('#ovGo').textContent = u.start;
    $('#ov').classList.remove('hide');
    api = makeApi();
    g.clearRect(0, 0, W, H); api.bg();
  }

  /* ============ อินพุต ============ */
  function pt(e) {
    var r = cv.getBoundingClientRect();
    var src = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
    return { x: (src.clientX - r.left) * W / r.width, y: (src.clientY - r.top) * H / r.height };
  }
  function bindPointer() {
    function down(e) {
      if (!running) return; e.preventDefault();
      var p = pt(e); api.pointer.x = p.x; api.pointer.y = p.y; api.pointer.down = true;
      if (def.down) def.down(p.x, p.y, api);
    }
    function move(e) {
      if (!running) return; e.preventDefault();
      var p = pt(e); api.pointer.x = p.x; api.pointer.y = p.y;
      if (def.move) def.move(p.x, p.y, api);
    }
    function up(e) {
      if (!running) return; e.preventDefault();
      var p = pt(e); api.pointer.down = false;
      if (def.up) def.up(p.x, p.y, api);
    }
    cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    cv.addEventListener('touchstart', down, { passive: false });
    cv.addEventListener('touchmove', move, { passive: false });
    cv.addEventListener('touchend', up, { passive: false });
    window.addEventListener('keydown', function (e) {
      if (running && def.key) def.key(e.key, api);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(e.key) >= 0) e.preventDefault();
    });
    window.addEventListener('resize', layout);
  }

  /* ============ เดินหน้า-ถอยหลังตามลำดับที่ผู้ใช้กำลังดูอยู่ ============ */
  /* หน้าแรกเก็บลำดับที่กรอง/เรียงไว้ใน mg_list ปุ่มถัดไปจะเดินตามลำดับนั้น
     ถ้าไม่มีหรือใช้ไม่ได้ จะถอยไปใช้ลำดับเกมทั้งหมดแทน */
  function navList() {
    try {
      var l = JSON.parse(localStorage.getItem('mg_list') || 'null');
      if (l && l.length && l.indexOf(meta.id) >= 0) return l;
    } catch (e) { }
    return GAMES.map(function (g) { return g.id; });
  }
  function goTo(step) {
    var l = navList(), i = l.indexOf(meta.id);
    var id = l[((i + step) % l.length + l.length) % l.length];
    location.href = 'play.html?id=' + id + '&lang=' + lang + '&o=' + ori + '&dev=' + dev + '&sim=' + (sim ? 1 : 0);
  }

  /* ============ ยอดวิว + หัวใจ ============ */
  function initStats() {
    if (!window.Stats || !Stats.on || !meta) return;
    var u = UI[lang], id = meta.id;

    /* badge ยอดวิวของหน้านี้ (hits.sh) — ซ่อนถ้า hitsPath ไม่ใช่รูปแบบโดเมน */
    var badge = $('#hitBadge'), burl = Stats.badge('game-' + id);
    if (burl) {
      badge.onload = function () { badge.classList.remove('hide'); };
      badge.src = burl;
    }

    /* ยอดวิวรายเกม */
    var sv = $('#sView');
    Stats.view(id).then(function (n) {
      if (n === null) return;
      sv.querySelector('b').textContent = n;
      sv.classList.remove('hide');
    });

    /* หัวใจ */
    var lb = $('#likeBtn'), num = lb.querySelector('b');
    function setLiked() { lb.classList.add('on'); lb.firstChild.nodeValue = '❤️ '; }
    if (Stats.liked(id)) setLiked();
    Stats.all([id]).then(function (r) { num.textContent = r.likes[id] || 0; });
    lb.onclick = function () {
      if (lb.classList.contains('on') || lb.disabled) return;
      lb.disabled = true;
      Stats.like(id).then(function (r) {
        lb.disabled = false;
        if (!r.ok) return;
        num.textContent = r.total;
        setLiked();
        $('#tip').textContent = r.already ? u.likedAlready : u.liked;
      });
    };
  }

  /* ============ boot ============ */
  function boot() {
    cv = $('#cv'); g = cv.getContext('2d');
    lang = qs('lang') || localStorage.getItem('mg_lang') || 'th';
    ori = qs('o') || localStorage.getItem('mg_ori') || 'land';
    dev = qs('dev') || localStorage.getItem('mg_dev') || 'touch';
    sim = (qs('sim') || localStorage.getItem('mg_sim') || '1') !== '0';
    if (!SIZE[ori]) ori = 'land';
    if (!DEVS[dev]) dev = 'touch';          // ค่าเก่า (tv/kiosk/tablet) จะถูกแปลงเป็น touch

    var id = qs('id') || GAMES[0].id;
    meta = GAMES.filter(function (x) { return x.id === id; })[0] || GAMES[0];
    def = reg[meta.id];

    var u = UI[lang];
    document.documentElement.lang = lang;
    document.title = meta[lang].name + ' — Mini Game Demo';
    $('#backTxt').textContent = u.back;
    $('#scoreLbl').textContent = u.score;
    $('#gname').textContent = meta[lang].name;
    var nl = navList(), pos = nl.indexOf(meta.id);
    $('#gpos').textContent = (pos + 1) + ' / ' + nl.length;
    $('#prevBtn').title = u.prevG; $('#nextBtn').title = u.nextG;
    $('#prevBtn').onclick = function () { goTo(-1); };
    $('#nextBtn').onclick = function () { goTo(1); };
    $('#ovBack').textContent = u.home;
    $('#ovNext').textContent = u.next;
    $('#tip').textContent = u.demo;
    document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = u[el.getAttribute('data-t')]; });
    var dvl = $('#dvLogo');
    dvl.lastElementChild.textContent = BRAND.name;
    // จุดสีบนคางจอ: ถ้ามีโลโก้เป็นรูปให้ใช้รูปแทน ไม่งั้นใช้สีหลักของแบรนด์
    if (BRAND.logo) dvl.firstElementChild.outerHTML = '<img src="' + BRAND.logo + '" alt="">';
    else dvl.firstElementChild.style.background = BRAND.colors.primary;

    $('#simBtn').onclick = function () {
      sim = !sim; dev = sim ? 'touch' : 'none';
      localStorage.setItem('mg_sim', sim ? '1' : '0');
      localStorage.setItem('mg_dev', dev);
      syncCtl(); layout();
    };
    initStats();
    document.querySelectorAll('#segOri button').forEach(function (b) {
      b.onclick = function () {
        if (ori === b.dataset.o) return;
        ori = b.dataset.o; localStorage.setItem('mg_ori', ori);
        syncCtl(); applySize(); showStart();
      };
    });

    function syncCtl() {
      document.querySelectorAll('#segOri button').forEach(function (b) { b.classList.toggle('on', b.dataset.o === ori); });
      $('#simBtn').classList.toggle('on', sim);
    }
    syncCtl();
    applySize();
    bindPointer();

    if (!def) {
      $('#ovEm').textContent = '🚧'; $('#ovTitle').textContent = meta[lang].name;
      $('#ovDesc').textContent = 'Coming soon'; $('#ovGo').classList.add('hide');
      api = makeApi(); return;
    }

    $('#ovNext').onclick = function () { goTo(1); };
    $('#ovGo').onclick = function () { beep(660, .08); start(); };
    /* โหลดภาพประกอบของเกมนี้ก่อน แล้วค่อยแสดงหน้าเริ่มเกม */
    loadSprites(meta.id, showStart);
  }

  return { register: function (id, d) { reg[id] = d; }, boot: boot };
})();
