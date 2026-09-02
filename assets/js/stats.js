/* ============================================================
   STATS — ยอดวิว + หัวใจ (ไม่ต้องมีเซิร์ฟเวอร์ของตัวเอง)

   • ยอดวิวรายหน้า : badge จาก hits.sh (แบบเดียวกับเว็บ Immersive Lecture)
   • ยอดวิว/หัวใจรายเกม : abacus.jasoncameron.dev (REST ฟรี รองรับ CORS)
   • กันกดหัวใจซ้ำ : ทำ hash จาก IP ของผู้ชม แล้วใช้เป็นคีย์ 1 IP = 1 หัวใจ/เกม
                     ถ้าดึง IP ไม่ได้ จะถอยไปใช้รหัสประจำเบราว์เซอร์แทน

   หมายเหตุ: คีย์ของ abacus มีอายุราว 6 เดือนนับจากครั้งล่าสุดที่ถูกเรียก
   เกมที่ไม่มีคนเปิดเลยเกินครึ่งปี ตัวเลขจะรีเซ็ต
   ============================================================ */
window.Stats = (function () {
  var CFG = (window.BRAND && BRAND.stats) || {};
  var ON = CFG.enabled !== false;
  var NS = CFG.ns || 'mini-game-demo';
  var API = 'https://abacus.jasoncameron.dev';
  var TTL = 120000;                       // แคชตัวเลขไว้ 2 นาที
  var uidP = null, mem = null, memAt = 0, memKey = '';

  function fnv(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
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

  function call(path) {
    return fetch(API + path, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) { return typeof j.value === 'number' ? j.value : 0; });
  }
  function get(key) { return call('/get/' + NS + '/' + key).catch(function () { return 0; }); }
  function hit(key) { return call('/hit/' + NS + '/' + key).catch(function () { return null; }); }

  /* ยิงหลายคำขอพร้อมกันแบบจำกัดจำนวน ไม่ให้ยิงรัวเกินไป */
  function pool(items, worker, limit) {
    limit = limit || 8;
    var i = 0, out = new Array(items.length);
    function next() {
      if (i >= items.length) return Promise.resolve();
      var k = i++;
      return worker(items[k]).then(function (v) { out[k] = v; return next(); });
    }
    var runners = [];
    for (var n = 0; n < Math.min(limit, items.length); n++) runners.push(next());
    return Promise.all(runners).then(function () { return out; });
  }

  /* localStorage: จำว่าเครื่องนี้กดหัวใจเกมไหนไปแล้ว (ไว้โชว์ผลทันที) */
  function liked(id) {
    try { return localStorage.getItem('mg_like_' + id) === '1'; } catch (e) { return false; }
  }
  function markLiked(id) { try { localStorage.setItem('mg_like_' + id, '1'); } catch (e) { } }

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
      mem = null;
      return hit('views_' + id);
    },

    /* ดึงยอดวิว + หัวใจของทุกเกม -> {views:{id:n}, likes:{id:n}} */
    all: function (ids) {
      if (!ON) return Promise.resolve({ views: {}, likes: {} });
      var mk = ids.join(',');
      if (mem && mk === memKey && Date.now() - memAt < TTL) return Promise.resolve(mem);
      var keys = [];
      ids.forEach(function (id) { keys.push(['views', id]); keys.push(['likes', id]); });
      return pool(keys, function (k) { return get(k[0] + '_' + k[1]); }, 8)
        .then(function (vals) {
          var r = { views: {}, likes: {} };
          keys.forEach(function (k, i) { r[k[0]][k[1]] = vals[i] || 0; });
          mem = r; memAt = Date.now(); memKey = mk;
          return r;
        })
        .catch(function () { return { views: {}, likes: {} }; });
    },

    /* กดหัวใจ -> {ok, total, already}
       already = true แปลว่า IP นี้เคยกดเกมนี้ไปแล้ว จึงไม่นับซ้ำ */
    like: function (id) {
      if (!ON) return Promise.resolve({ ok: false });
      return uid().then(function (u) {
        return hit('v_' + id + '_' + u).then(function (n) {
          if (n === null) return { ok: false };
          if (n > 1) { markLiked(id); return get('likes_' + id).then(function (t) { return { ok: true, total: t, already: true }; }); }
          return hit('likes_' + id).then(function (t) {
            markLiked(id); mem = null;
            return { ok: true, total: t, already: false };
          });
        });
      }).catch(function () { return { ok: false }; });
    }
  };
})();
