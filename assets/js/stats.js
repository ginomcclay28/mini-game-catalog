/* ============================================================
   STATS — ยอดวิว + หัวใจ (ไม่ต้องมีเซิร์ฟเวอร์ของตัวเอง)

   • ยอดวิวรายหน้า : badge จาก hits.sh (แบบเดียวกับเว็บ Immersive Lecture)
   • ยอดวิว/หัวใจรายเกม : abacus.jasoncameron.dev (REST ฟรี รองรับ CORS)
   • กันกดหัวใจซ้ำ : ทำ hash จาก IP ของผู้ชม แล้วใช้เป็นคีย์ 1 IP = 1 หัวใจ/เกม
                     ถ้าดึง IP ไม่ได้ จะถอยไปใช้รหัสประจำเบราว์เซอร์แทน

   ข้อจำกัดสำคัญของ abacus: 30 คำขอ / 10 วินาที / IP  (เกินได้ 429 = ตัวเลขหาย)
   หน้ารวม 100 เกมต้องอ่าน 200 คีย์ จึงต้อง
     1) ยิงผ่านคิวจำกัดความเร็ว (24 คำขอ/10 วิ เผื่อที่ให้ปุ่มหัวใจ/ยอดวิว)
     2) จำค่าล่าสุดไว้ใน localStorage โชว์ทันที แล้วค่อยทยอยอัปเดตทีละชุด
     3) โดน 429 ให้รอตาม Retry-After แล้วยิงซ้ำ (สำคัญกับ hit ที่พลาดไม่ได้)

   หมายเหตุ: คีย์ของ abacus มีอายุราว 6 เดือนนับจากครั้งล่าสุดที่ถูกเรียก
   ============================================================ */
window.Stats = (function () {
  var CFG = (window.BRAND && BRAND.stats) || {};
  var ON = CFG.enabled !== false;
  var NS = CFG.ns || 'mini-game-demo';
  var API = 'https://abacus.jasoncameron.dev';
  var FRESH = 90000;                      // ค่าที่อ่านมาไม่เกิน 1.5 นาที ถือว่าใหม่ ไม่ต้องอ่านซ้ำ
  var LIMIT = 24, WINDOW = 10500;         // จำกัดคำขอต่อหน้าต่างเวลา (ต่ำกว่าเพดาน 30/10s)
  var CACHE_KEY = 'mg_stats_v2';
  var uidP = null;

  function fnv(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  /* ---------- แคชใน localStorage ---------- */
  var cache = { v: {}, at: {} };          // v[key] = ค่า, at[key] = เวลาที่อ่านมา
  try { var c0 = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); if (c0 && c0.v) cache = c0; } catch (e) { }
  var saveT = null;
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(function () { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { } }, 300);
  }
  function remember(key, val) { cache.v[key] = val; cache.at[key] = Date.now(); save(); }

  /* ---------- คิวจำกัดความเร็ว ---------- */
  var stamps = [], queue = [], pumping = false;
  function pump() {
    if (pumping) return; pumping = true;
    (function step() {
      if (!queue.length) { pumping = false; return; }
      var now = Date.now();
      stamps = stamps.filter(function (t) { return now - t < WINDOW; });
      if (stamps.length >= LIMIT) { setTimeout(step, stamps[0] + WINDOW - now + 50); return; }
      var job = queue.shift(); stamps.push(now);
      try { job.run().then(job.ok, job.fail); } catch (e) { job.fail(e); }
      setTimeout(step, 30);
    })();
  }
  /* enqueue(run, front) : run คืน Promise  front = แทรกหน้าคิว (hit/like ที่ผู้ใช้กดเอง และไม่ถูก dropReads ลบ) */
  function enqueue(run, front) {
    return new Promise(function (ok, fail) {
      var job = { run: run, ok: ok, fail: fail, keep: !!front };
      if (front) queue.unshift(job); else queue.push(job);
      pump();
    });
  }
  /* ล้างงานอ่านค้างในคิว (เช่นเปลี่ยนหน้า/รายการใหม่) เก็บเฉพาะ hit */
  function dropReads() { queue = queue.filter(function (j) { return j.keep; }); }

  /* ---------- เรียก API + รอเมื่อโดน 429 ---------- */
  function rawCall(path, tries) {
    return fetch(API + path, { cache: 'no-store' }).then(function (r) {
      if (r.status === 429 && tries > 0) {
        var wait = parseInt(r.headers.get('Retry-After') || '3000', 10) || 3000;
        if (wait < 100) wait *= 1000;                 // เผื่อเซิร์ฟเวอร์ส่งเป็นวินาที
        return new Promise(function (res) { setTimeout(res, Math.min(wait, 12000) + 200); })
          .then(function () { return rawCall(path, tries - 1); });
      }
      if (r.status === 404) return { value: 0 };     // ยังไม่เคยมีคีย์นี้ = 0
      return r.ok ? r.json() : Promise.reject(r.status);
    }).then(function (j) { return typeof j.value === 'number' ? j.value : 0; });
  }
  function get(key, front) {
    return enqueue(function () { return rawCall('/get/' + NS + '/' + key, 2); }, front)
      .then(function (v) { remember(key, v); return v; });
  }
  function hit(key) {
    var p = enqueue(function () { return rawCall('/hit/' + NS + '/' + key, 3); }, true);
    return p.then(function (v) { remember(key, v); return v; }).catch(function () { return null; });
  }
  /* รหัสผู้ชม: hash ของ IP (ถ้าดึงไม่ได้ ใช้รหัสสุ่มเก็บในเบราว์เซอร์) */
  function uid() {
    if (uidP) return uidP;
    uidP = fetch('https://api.ipify.org?format=json', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) { return fnv('ip:' + (j.ip || '')); })
      .catch(function () {
        var k = null;
        try { k = localStorage.getItem('mg_uid'); } catch (e) { }
        if (!k) {
          k = Math.random().toString(36).slice(2) + Date.now().toString(36);
          try { localStorage.setItem('mg_uid', k); } catch (e) { }
        }
        return fnv('br:' + k);
      });
    return uidP;
  }

  /* localStorage: จำว่าเครื่องนี้กดหัวใจเกมไหนไปแล้ว (ไว้โชว์ผลทันที) */
  function liked(id) {
    try { return localStorage.getItem('mg_like_' + id) === '1'; } catch (e) { return false; }
  }
  function markLiked(id) { try { localStorage.setItem('mg_like_' + id, '1'); } catch (e) { } }

  function snapshot(ids) {
    var r = { views: {}, likes: {} };
    ids.forEach(function (id) { r.views[id] = cache.v['views_' + id] || 0; r.likes[id] = cache.v['likes_' + id] || 0; });
    return r;
  }

  return {
    on: ON,
    liked: liked,

    /* URL ของ badge ยอดวิวรายหน้า
       hits.sh ต้องการ path ที่ขึ้นต้นด้วยโดเมนจริง ถ้าไม่ใช่จะคืน badge ว่า "Not a valid URI"
       จึงเช็ครูปแบบก่อน ถ้าไม่ผ่านคืน null แล้วผู้เรียกจะซ่อน badge ไป */
    badge: function (page) {
      var p = (CFG.hitsPath || '').replace(/^https?:\/\//, '').replace(/^\/+|\/+$/g, '');
      var host = p.split('/')[0];
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(host)) return null;
      var c = (BRAND.colors || {});
      return 'https://hits.sh/' + p + '/' + page + '.svg'
        + '?label=views&bgLeft=10131d&bgRight=' + (c.primary || '#ff6b57').replace('#', '')
        + '&color=ffffff&border=round';
    },

    /* นับยอดวิวของเกมหนึ่ง (เรียกตอนเปิดหน้าเล่น) */
    view: function (id) {
      if (!ON) return Promise.resolve(null);
      return hit('views_' + id);
    },

    /* ดึงยอดวิว + หัวใจของทุกเกม -> {views:{id:n}, likes:{id:n}}
       คืนค่าที่จำไว้ทันที แล้วทยอยอ่านของจริง เรียก onUpdate(r) ทุกครั้งที่ได้ค่าใหม่มาชุดหนึ่ง
       ids เรียงตามความสำคัญ (ที่แสดงอยู่บนจอมาก่อน) จะถูกอ่านก่อน */
    all: function (ids, onUpdate) {
      if (!ON) return Promise.resolve({ views: {}, likes: {} });
      dropReads();
      var seen = {}, order = [];
      ids.forEach(function (id) { if (!seen[id]) { seen[id] = 1; order.push(id); } });
      var now = Date.now(), keys = [];
      order.forEach(function (id) { keys.push('likes_' + id); keys.push('views_' + id); });
      var stale = keys.filter(function (k) { return !(cache.at[k] && now - cache.at[k] < FRESH); });
      var snap = snapshot(order);
      if (!stale.length) return Promise.resolve(snap);
      var dirty = 0;
      function flush() { if (dirty && onUpdate) { dirty = 0; onUpdate(snapshot(order)); } }
      var flushT = setInterval(flush, 1500);
      var p = Promise.all(stale.map(function (k) {
        return get(k, false).then(function () { dirty++; }, function () { });
      })).then(function () { clearInterval(flushT); flush(); return snapshot(order); });
      /* มี onUpdate = คืนค่าที่จำไว้ทันที ของจริงทยอยมาทาง onUpdate  ไม่มี = รอจนครบ */
      if (onUpdate) { p.catch(function () { }); return Promise.resolve(snap); }
      return p;
    },

    /* กดหัวใจ -> {ok, total, already}
       already = true แปลว่า IP นี้เคยกดเกมนี้ไปแล้ว จึงไม่นับซ้ำ */
    like: function (id) {
      if (!ON) return Promise.resolve({ ok: false });
      return uid().then(function (u) {
        return hit('v_' + id + '_' + u).then(function (n) {
          if (n === null) return { ok: false };
          if (n > 1) { markLiked(id); return get('likes_' + id, true).then(function (t) { return { ok: true, total: t, already: true }; }); }
          return hit('likes_' + id).then(function (t) {
            if (t === null) return { ok: false };
            markLiked(id);
            return { ok: true, total: t, already: false };
          });
        });
      }).catch(function () { return { ok: false }; });
    }
  };
})();
