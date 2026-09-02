/* ============================================================
   CATALOG APP — grid / pagination / filter / modal / i18n
   ============================================================ */
(function () {
  var PER = 10;
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  var lang = lsGet('mg_lang') || 'th';
  var ori = lsGet('mg_ori') || 'land';
  var dev = lsGet('mg_dev') || 'touch';

  /* จำหน้า / ฟิลเตอร์ / การเรียง — อ่านจาก URL ก่อน แล้วค่อยจาก localStorage
     ทำให้รีเฟรช กด back จากเกม หรือกดปุ่มย้อนกลับของเบราว์เซอร์ แล้วยังอยู่ที่เดิม */
  var Q = new URLSearchParams(location.search);
  function restore(key, ls, allow, def) {
    var v = Q.get(key) || lsGet(ls) || def;
    return allow.indexOf(v) >= 0 ? v : def;
  }
  var cat = restore('cat', 'mg_cat', ['all'].concat(Object.keys(CATS)), 'all');
  var sort = restore('sort', 'mg_sort', ['order', 'likes', 'views'], 'order');
  var page = Math.max(1, parseInt(Q.get('p') || lsGet('mg_page') || '1', 10) || 1);
  var current = 0;
  var DEVKEYS = ['touch', 'none'];
  if (DEVKEYS.indexOf(dev) < 0) dev = 'touch';   // ค่าเก่า tv/kiosk/tablet -> touch
  var S = { likes: {}, views: {} };          // ตัวเลขจาก Stats

  var T = {
    th: {
      heroTitle: "100+ เกมทัชสกรีน พร้อมใช้งานทันที",
      heroDesc: "เลือกแนวเกมที่ชอบ กดทดลองเล่นได้จริงบนหน้าเว็บนี้เลย ทุกเกมออกแบบมาสำหรับจอสัมผัสโดยเฉพาะ เล่นง่าย เข้าใจใน 3 วินาที เหมาะกับงานอีเวนต์ บูธแสดงสินค้า และหน้าร้าน",
      startAt: "เริ่มต้น", perGame: "บาท / เกม", tryPlay: "ทดลองเล่น", nextGame: "เกมถัดไป",
      hHow: "วิธีเล่น", hDev: "ใช้กับอุปกรณ์อะไรได้บ้าง", hCus: "เปลี่ยนกราฟฟิกส่วนไหนได้บ้าง",
      lockNote: "🔒 รูปแบบการเล่น กติกา และระบบคะแนน เป็นแบบมาตรฐานตามราคานี้ หากต้องการปรับกลไกการเล่นใหม่ คิดราคาเพิ่มตามงาน",
      all: "ทั้งหมด", prev: "ก่อนหน้า", next: "ถัดไป",
      pgnote: function (a, b, c) { return "แสดงเกมที่ " + a + "–" + b + " จากทั้งหมด " + c + " เกม"; },
      footNote: "ราคา 9,500 บาท/เกม เป็นราคาสำหรับรูปแบบการเล่นมาตรฐานตามที่แสดงในเว็บนี้<br>ลูกค้าปรับแต่งได้ในส่วนของกราฟฟิก โลโก้ และภาพพื้นหลัง",
      sec: "วินาที", noTime: "ไม่จำกัดเวลา",
      hSim: "ดูตัวอย่างบนจอหน้างาน", land: "แนวนอน 16:9", port: "แนวตั้ง 9:16",
      simNote: "เลือกแนวจอที่จะใช้จริงหน้างาน แล้วกดทดลองเล่น เกมจะจัดวางใหม่ให้พอดีจอนั้นโดยอัตโนมัติ",
      devs: { touch: "On-Touch Screen", none: "ไม่ใส่กรอบ" },
      sortLbl: "เรียงลำดับ", viewsLbl: "ยอดวิว",
      sorts: { order: "ตามลำดับเกม", likes: "❤️ ยอดนิยม", views: "👁 ดูมากสุด" },
      likedMsg: "ขอบคุณ! บันทึกหัวใจของคุณแล้ว",
      alreadyMsg: "IP นี้เคยกดหัวใจให้เกมนี้ไปแล้ว จึงไม่นับซ้ำ"
    },
    en: {
      heroTitle: "100+ Touchscreen Games, Ready to Deploy",
      heroDesc: "Browse the styles you like and play every one of them right here in the browser. Each game is built for touch screens — simple enough to understand in three seconds. Perfect for events, trade-show booths and retail.",
      startAt: "From", perGame: "THB / game", tryPlay: "Try it now", nextGame: "Next game",
      hHow: "How to play", hDev: "Works on", hCus: "What you can re-skin",
      lockNote: "🔒 Gameplay, rules and scoring are fixed at this price. Custom mechanics are quoted separately.",
      all: "All", prev: "Prev", next: "Next",
      pgnote: function (a, b, c) { return "Showing " + a + "–" + b + " of " + c + " games"; },
      footNote: "THB 9,500 per game covers the standard gameplay shown on this site.<br>Customisation covers graphics, logo and background art.",
      sec: "sec", noTime: "No time limit",
      hSim: "Preview on the real screen", land: "Landscape 16:9", port: "Portrait 9:16",
      simNote: "Pick the screen orientation you'll use on site, then hit play — the game re-lays itself out to fit.",
      devs: { touch: "On-Touch Screen", none: "No frame" },
      sortLbl: "Sort by", viewsLbl: "views",
      sorts: { order: "Game order", likes: "❤️ Most loved", views: "👁 Most viewed" },
      likedMsg: "Thanks! Your like has been saved",
      alreadyMsg: "This IP already liked this game, so it wasn't counted twice"
    }
  };

  var $ = function (s) { return document.querySelector(s); };
  var grid = $('#grid'), pager = $('#pager'), filters = $('#filters');
  var mask = $('#mask');

  function t(k) { return T[lang][k]; }

  /* -------- filtered + sorted list -------- */
  function list() {
    var L = cat === 'all' ? GAMES.slice() : GAMES.filter(function (g) { return g.cat === cat; });
    if (sort !== 'order') {
      var key = sort === 'likes' ? S.likes : S.views;
      L.sort(function (a, b) {
        var d = (key[b.id] || 0) - (key[a.id] || 0);
        return d || GAMES.indexOf(a) - GAMES.indexOf(b);
      });
    }
    return L;
  }

  /* -------- static text -------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var v = T[lang][el.getAttribute('data-t')];
      if (typeof v === 'string') el.innerHTML = v;
    });
    $('#brandName').textContent = BRAND.name;
    $('#brandTag').textContent = BRAND.tagline[lang];
    $('#mPrice').textContent = BRAND.price.toLocaleString();
    if (BRAND.logo) $('#logoMark').innerHTML = '<img src="' + BRAND.logo + '" alt="logo" style="width:100%;height:100%;object-fit:contain">';
    $('#sortSeg').innerHTML = ['order', 'likes', 'views'].map(function (k) {
      return '<button data-s="' + k + '"' + (k === sort ? ' class="on"' : '') + '>' + T[lang].sorts[k] + '</button>';
    }).join('');
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
  }

  /* -------- filters -------- */
  function renderFilters() {
    var html = '<button class="chip' + (cat === 'all' ? ' on' : '') + '" data-c="all">' + t('all') + ' (' + GAMES.length + ')</button>';
    Object.keys(CATS).forEach(function (k) {
      var n = GAMES.filter(function (g) { return g.cat === k; }).length;
      html += '<button class="chip' + (cat === k ? ' on' : '') + '" data-c="' + k + '">' + CATS[k][lang] + ' (' + n + ')</button>';
    });
    filters.innerHTML = html;
  }

  /* บันทึกตำแหน่งที่กำลังดู + ลำดับเกมที่กรองไว้ (หน้าเล่นใช้ทำปุ่มถัดไป/ก่อนหน้า) */
  function saveNav(L) {
    lsSet('mg_cat', cat); lsSet('mg_sort', sort); lsSet('mg_page', page);
    try { lsSet('mg_list', JSON.stringify(L.map(function (g) { return g.id; }))); } catch (e) { }
    try { history.replaceState(null, '', '?cat=' + cat + '&sort=' + sort + '&p=' + page); } catch (e) { }
  }

  /* -------- grid -------- */
  function renderGrid() {
    var L = list();
    var maxPage = Math.max(1, Math.ceil(L.length / PER));
    if (page > maxPage) page = maxPage;
    saveNav(L);
    var s = (page - 1) * PER, e = Math.min(s + PER, L.length);
    var html = '';
    for (var i = s; i < e; i++) {
      var g = L[i], d = g[lang];
      var no = GAMES.indexOf(g) + 1;
      html += '<article class="card" data-id="' + g.id + '">' +
        '<div class="thumb" style="background:linear-gradient(140deg,' + g.c1 + ',' + g.c2 + ')">' +
        '<span class="no">#' + (no < 10 ? '0' + no : no) + '</span>' +
        '<div class="ico">' + g.icon + '</div>' +
        '<div class="play-ov"><span>▶</span></div>' +
        '</div>' +
        '<div class="cbody">' +
        '<h3>' + d.name + '</h3>' +
        '<p>' + d.tag + '</p>' +
        '<div class="cmeta">' +
        '<span class="tagc">' + CATS[g.cat][lang] + '</span>' +
        '<span class="tagt">⏱ ' + (g.time ? g.time + ' ' + t('sec') : t('noTime')) + '</span>' +
        '</div>' + statsRow(g, i) + '</div></article>';
    }
    grid.innerHTML = html;

    var p = '<button data-p="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>← ' + t('prev') + '</button>';
    for (var k = 1; k <= maxPage; k++) p += '<button data-p="' + k + '" class="' + (k === page ? 'on' : '') + '">' + k + '</button>';
    p += '<button data-p="' + (page + 1) + '"' + (page === maxPage ? ' disabled' : '') + '>' + t('next') + ' →</button>';
    pager.innerHTML = p;
    $('#pgnote').textContent = T[lang].pgnote(L.length ? s + 1 : 0, e, L.length);
  }

  /* -------- แถบหัวใจ + ยอดวิว บนการ์ด -------- */
  function statsRow(g, i) {
    if (!window.Stats || !Stats.on) return '';
    var on = Stats.liked(g.id);
    return '<div class="cstats">' +
      '<button class="heart' + (on ? ' on' : '') + '" data-h="' + g.id + '">' +
      (on ? '❤️' : '🤍') + ' <b>' + (S.likes[g.id] || 0) + '</b></button>' +
      '<span class="vcount">👁 <b>' + (S.views[g.id] || 0) + '</b></span>' +
      (sort !== 'order' ? '<span class="rank">#' + (i + 1) + '</span>' : '') +
      '</div>';
  }

  /* กดหัวใจ (ใช้ร่วมกันทั้งการ์ดและป๊อบอัพ) */
  function doLike(id, btn, msgEl) {
    if (!window.Stats || !Stats.on) return;
    if (btn.classList.contains('on') || btn.disabled) return;
    btn.disabled = true;
    Stats.like(id).then(function (r) {
      btn.disabled = false;
      if (!r.ok) { if (msgEl) msgEl.textContent = '—'; return; }
      S.likes[id] = r.total;
      btn.classList.add('on', 'pop');
      btn.innerHTML = '❤️ <b>' + r.total + '</b>';
      setTimeout(function () { btn.classList.remove('pop'); }, 460);
      if (msgEl) msgEl.textContent = r.already ? T[lang].alreadyMsg : T[lang].likedMsg;
      /* อัปเดตปุ่มอีกที่ที่แสดงเกมเดียวกัน */
      document.querySelectorAll('[data-h="' + id + '"]').forEach(function (b) {
        if (b !== btn) { b.classList.add('on'); b.innerHTML = '❤️ <b>' + r.total + '</b>'; }
      });
      if ($('#mHeart').dataset.h === id) $('#mHeart').innerHTML = '❤️ <b>' + r.total + '</b>';
    });
  }

  /* โหลดตัวเลขทั้งหมด แล้ววาดใหม่ */
  function loadStats() {
    if (!window.Stats || !Stats.on) return;
    var b = $('#hitBadge'), url = Stats.badge('home');
    if (url) { b.onload = function () { b.style.display = 'block'; }; b.src = url; }
    Stats.all(GAMES.map(function (g) { return g.id; })).then(function (r) {
      S = r; renderGrid();
      if (mask.classList.contains('show')) fillModalStats(GAMES[current]);
    });
  }

  function fillModalStats(g) {
    var h = $('#mHeart'), on = !!(window.Stats && Stats.on && Stats.liked(g.id));
    h.dataset.h = g.id;
    h.className = 'heart' + (on ? ' on' : '');
    h.innerHTML = (on ? '❤️' : '🤍') + ' <b>' + (S.likes[g.id] || 0) + '</b>';
    $('#mViews').textContent = S.views[g.id] || 0;
    $('#mLikeMsg').textContent = '';
    $('.m-stats').style.display = (window.Stats && Stats.on) ? 'flex' : 'none';
  }

  /* -------- modal -------- */
  function openModal(id) {
    var idx = GAMES.findIndex(function (g) { return g.id === id; });
    if (idx < 0) return;
    current = idx;
    var g = GAMES[idx], d = g[lang];
    $('#mHero').style.background = 'linear-gradient(140deg,' + g.c1 + ',' + g.c2 + ')';
    $('#mIco').textContent = g.icon;
    $('#mName').textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1) + '. ' + d.name;
    $('#mTag').textContent = d.tag;
    $('#mHow').innerHTML = d.how.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    $('#mCus').innerHTML = d.custom.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    $('#mDev').innerHTML = g.devices.map(function (k) {
      return '<span class="dev">✓ ' + DEVICES[k][lang] + '</span>';
    }).join('');
    $('#spIco').textContent = g.icon;
    $('#spScr').style.background = 'linear-gradient(140deg,' + g.c1 + ',' + g.c2 + ')';
    fillModalStats(g);
    syncSim();
    mask.classList.add('show');
    document.body.style.overflow = 'hidden';
    $('#modal').scrollTop = 0;
    $('.m-body').scrollTop = 0;
  }
  function closeModal() {
    mask.classList.remove('show');
    document.body.style.overflow = '';
  }
  function play() {
    location.href = 'play.html?id=' + GAMES[current].id + '&lang=' + lang +
      '&o=' + ori + '&dev=' + dev + '&sim=' + (dev === 'none' ? 0 : 1);
  }

  /* ---- ตัวเลือกแนวจอ / แบบจอ ---- */
  function syncSim() {
    $('#simPrev').className = 'simprev o-' + ori + ' d-' + dev;
    document.querySelectorAll('#segOri2 button').forEach(function (b) { b.classList.toggle('on', b.dataset.o === ori); });
    document.querySelectorAll('#segDev2 button').forEach(function (b) { b.classList.toggle('on', b.dataset.d === dev); });
  }
  function buildSim() {
    $('#segDev2').innerHTML = DEVKEYS.map(function (k) {
      return '<button data-d="' + k + '">' + T[lang].devs[k] + '</button>';
    }).join('');
    $('#segDev2').onclick = function (e) {
      var b = e.target.closest('button[data-d]'); if (!b) return;
      dev = b.dataset.d; lsSet('mg_dev', dev); syncSim();
    };
    $('#segOri2').onclick = function (e) {
      var b = e.target.closest('button[data-o]'); if (!b) return;
      ori = b.dataset.o; lsSet('mg_ori', ori); syncSim();
    };
  }

  /* -------- events -------- */
  grid.addEventListener('click', function (e) {
    var h = e.target.closest('.heart');
    if (h) { e.stopPropagation(); doLike(h.dataset.h, h, null); return; }
    var c = e.target.closest('.card');
    if (c) openModal(c.dataset.id);
  });
  $('#mHeart').onclick = function () { doLike($('#mHeart').dataset.h, $('#mHeart'), $('#mLikeMsg')); };
  $('#sortSeg').onclick = function (e) {
    var b = e.target.closest('button[data-s]'); if (!b) return;
    sort = b.dataset.s; page = 1;
    document.querySelectorAll('#sortSeg button').forEach(function (x) { x.classList.toggle('on', x.dataset.s === sort); });
    renderGrid();
  };
  pager.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-p]');
    if (!b || b.disabled) return;
    page = +b.dataset.p;
    renderGrid();
    window.scrollTo({ top: document.querySelector('.wrap').offsetTop - 80, behavior: 'smooth' });
  });
  filters.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    cat = b.dataset.c; page = 1;
    renderFilters(); renderGrid();
  });
  $('#mClose').onclick = closeModal;
  mask.addEventListener('click', function (e) { if (e.target === mask) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  $('#mPlay').onclick = play;
  $('#mPlay2').onclick = play;
  $('#mNext').onclick = function () { openModal(GAMES[(current + 1) % GAMES.length].id); };
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.onclick = function () {
      lang = b.dataset.lang;
      lsSet('mg_lang', lang);
      applyStatic(); renderFilters(); renderGrid(); buildSim(); syncSim();
      if (mask.classList.contains('show')) openModal(GAMES[current].id);
    };
  });

  applyStatic(); renderFilters(); renderGrid(); buildSim(); syncSim(); loadStats();
})();
