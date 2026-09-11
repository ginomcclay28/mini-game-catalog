/* ============================================================
   PACK 11 — เกมที่ 101 ขึ้นไป
   101 บัตรขูด v.2   : เลือกบัตรจากแผง 3x3 → บัตรขยายขึ้นกลางจอ → ขูดเปิดรางวัล
   102 กล่องของขวัญ v.2 : แผง 3x3 กล่องหลากสี สลับตำแหน่งกันทุก 2 วินาที
   103 กล่องของขวัญ v.3 : กล่องหลายสีหลายขนาดไหลมาบนสายพาน
   104 กล่องของขวัญ v.4 : กล่องหลากสีร่วงลงมา แกว่งและสั่นไม่เท่ากัน
   ============================================================ */
(function () {
  var R = MiniGame.register;

  /* ---------- 101 บัตรขูด v.2 ---------- */

  /* สีประจำบัตรทั้ง 9 ใบในแผง (ไล่โทนให้ดูเป็นแผงล็อตเตอรี่) */
  var CARDCOL = [
    ['#ff3b6b', '#ff9068'], ['#ff9f1c', '#ffd166'], ['#2fe08a', '#7ef0c4'],
    ['#00c2ff', '#7fe6ff'], ['#7b5cff', '#c08bff'], ['#ff2e88', '#ff8fc4'],
    ['#1fc8a9', '#8ff0dc'], ['#ffb02e', '#ffe08a'], ['#5a8dff', '#a9c6ff']
  ];

  /* อัตราส่วนบัตร (สูง/กว้าง) — ถ้ามีภาพบัตรจริง ใช้สัดส่วนของภาพแทน จะได้ไม่ต้องวัดเอง */
  function cardAR(a) {
    var im = a.sprImg && a.sprImg('card');
    if (im && im.width) return im.height / im.width;
    return a.port ? .70 : .56;
  }

  function layout(a) {
    var ar = cardAR(a);

    /* บัตรใบใหญ่กลางจอ (ขนาดเท่าเกม 10 เดิม) */
    var bw = Math.round(Math.min(a.W * .84, a.mn * .95));
    var bh = Math.round(Math.min(a.H * .40, bw * ar));
    bw = Math.round(bh / ar);
    var big = { x: Math.round((a.W - bw) / 2), y: Math.round(a.H * .5 - bh * .40), w: bw, h: bh };

    /* แผง 3x3 */
    var headY = a.H * (a.port ? .11 : .105);
    var top = headY + a.mn * .055;
    var availW = a.W * .90, availH = a.H - top - a.mn * .10;
    var gap = a.mn * .022;
    var cw = (availW - gap * 2) / 3, chh = cw * ar;
    if (chh * 3 + gap * 2 > availH) { chh = (availH - gap * 2) / 3; cw = chh / ar; }
    var gridW = cw * 3 + gap * 2, gridH = chh * 3 + gap * 2;
    var gx = (a.W - gridW) / 2, gy = top + (availH - gridH) / 2;

    var cells = [];
    for (var i = 0; i < 9; i++) {
      cells.push({
        x: Math.round(gx + (i % 3) * (cw + gap)),
        y: Math.round(gy + Math.floor(i / 3) * (chh + gap)),
        w: Math.round(cw), h: Math.round(chh)
      });
    }
    return { big: big, cells: cells, headY: headY, ar: ar };
  }

  function newPanel(a) {
    var d = a.data;
    var przTH = ['🎁 ของแถม 1 ชิ้น', '💰 ส่วนลด 100 บาท', '☕ กาแฟฟรี 1 แก้ว', '🎫 คูปอง 50%',
                 '😅 เสียใจด้วย', '🏆 รางวัลใหญ่!', '🧢 หมวกแบรนด์', '🛍️ ถุงผ้า', '😅 ลองใหม่อีกครั้ง'];
    var przEN = ['🎁 Free gift', '💰 100 THB off', '☕ Free coffee', '🎫 50% coupon',
                 '😅 Better luck!', '🏆 Grand prize!', '🧢 Brand cap', '🛍️ Tote bag', '😅 Try again'];
    d.prizes = a.shuffle((a.lang === 'en' ? przEN : przTH).slice());
    d.used = [false, false, false, false, false, false, false, false, false];
    d.st = 'pick'; d.sel = -1; d.t = 0; d.done = false; d.rdy = 0; d.last = null; d.chk = 0;
    d.foil = null; d.fg = null;
  }

  /* สร้างชั้นฟอยล์ให้พอดีกับขนาดบัตรใบใหญ่ */
  function makeFoil(a) {
    var d = a.data, L = d.LO.big;
    var c = document.createElement('canvas'); c.width = L.w; c.height = L.h;
    var cg = c.getContext('2d');
    var fim = a.sprImg && a.sprImg('foil');
    if (fim) cg.drawImage(fim, 0, 0, L.w, L.h);
    else {
      var gr = cg.createLinearGradient(0, 0, L.w, L.h);
      gr.addColorStop(0, '#c9cfe0'); gr.addColorStop(.5, '#f0f3fa'); gr.addColorStop(1, '#a8b0c8');
      cg.fillStyle = gr; cg.fillRect(0, 0, L.w, L.h);
      cg.fillStyle = 'rgba(255,255,255,.5)';
      for (var i = 0; i < 60; i++) cg.fillRect((i * 37) % L.w, (i * 61) % L.h, L.w * .04, 3);
    }
    var fs = Math.round(L.h * .13);
    cg.font = '700 ' + fs + 'px Kanit,sans-serif'; cg.fillStyle = 'rgba(90,100,130,.85)';
    cg.textAlign = 'center'; cg.textBaseline = 'middle';
    cg.fillText(a.txt({ th: 'ขูดตรงนี้', en: 'SCRATCH HERE' }), L.w / 2, L.h / 2);
    d.foil = c; d.fg = cg;
    d.done = false; d.rdy = 0; d.last = null; d.chk = 0;
  }

  /* ขูด */
  function scr(x, y, a) {
    var d = a.data; if (d.done || d.st !== 'scratch') return;
    var L = d.LO.big, lx = x - L.x, ly = y - L.y, m = L.w * .06;
    if (lx < -m || lx > L.w + m || ly < -m || ly > L.h + m) { d.last = null; return; }
    var cg = d.fg, br = Math.max(14, L.w * .05);
    cg.globalCompositeOperation = 'destination-out';
    cg.lineWidth = br * 2; cg.lineCap = 'round'; cg.lineJoin = 'round';
    if (d.last) { cg.beginPath(); cg.moveTo(d.last.x, d.last.y); cg.lineTo(lx, ly); cg.stroke(); }
    cg.beginPath(); cg.arc(lx, ly, br, 0, 6.29); cg.fill();
    cg.globalCompositeOperation = 'source-over';
    d.last = { x: lx, y: ly };
  }

  /* กรอบบัตรเปล่า 1 ใบ (ใช้ทั้งในแผงและตอนซูม) ci = ดัชนีสี */
  function drawCard(g, a, r, ci, label, dim) {
    var col = CARDCOL[ci % CARDCOL.length];
    var rad = Math.min(r.w, r.h) * .10;
    g.save();
    if (dim) g.globalAlpha = .40;
    a.shadow(true);
    a.fillRR(r.x, r.y, r.w, r.h, rad, '#fff');
    a.shadow(false);
    var pad = Math.min(r.w, r.h) * .055;
    if (a.hasSpr('card')) {
      /* ภาพบัตรจริง: ย้อมสีประจำใบ วางเต็มกรอบขาว */
      a.sprTint('card', col[0], null, r.x + r.w / 2, r.y + r.h / 2, r.h - pad * 2);
    } else {
      var gr = g.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
      gr.addColorStop(0, col[0]); gr.addColorStop(1, col[1]);
      a.rr(r.x + pad, r.y + pad, r.w - pad * 2, r.h - pad * 2, rad * .7);
      g.fillStyle = gr; g.fill();
      /* ลายเส้นทแยงจาง ๆ ให้ดูเป็นบัตร */
      g.save(); a.rr(r.x + pad, r.y + pad, r.w - pad * 2, r.h - pad * 2, rad * .7); g.clip();
      g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = Math.max(2, r.h * .035);
      for (var i = -1; i < 6; i++) {
        g.beginPath(); g.moveTo(r.x + i * r.w * .28, r.y + r.h); g.lineTo(r.x + i * r.w * .28 + r.h, r.y); g.stroke();
      }
      g.restore();
    }
    if (label) a.text(label, r.x + r.w / 2, r.y + r.h / 2, r.h * .34, 'rgba(255,255,255,.95)');
    g.restore();
  }

  R('scratch2', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.LO = layout(a);
      newPanel(a);
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'zoom' || d.st === 'unzoom') {
        d.t += dt / .30;
        if (d.t >= 1) {
          d.t = 1;
          if (d.st === 'zoom') { d.st = 'scratch'; makeFoil(a); }
          else { d.st = 'pick'; d.sel = -1; if (d.used.every(function (u) { return u; })) newPanel(a); }
        }
        return;
      }
      if (d.st !== 'scratch') { if (d.rdy > 0) d.rdy -= dt; return; }
      if (d.done) { d.rdy -= dt; return; }
      d.chk -= dt; if (d.chk > 0) return; d.chk = .3;
      var L = d.LO.big, im = d.fg.getImageData(0, 0, L.w, L.h).data, n = 0, tot = 0;
      for (var i = 3; i < im.length; i += 4 * 60) { tot++; if (im[i] < 40) n++; }
      if (tot && n / tot > .55) {
        d.done = true; d.rdy = .7; d.used[d.sel] = true;
        a.beep(1000, .3, 'triangle');
        a.shake(.016, .34); a.flash('#ffd23f', .22);
        a.puff(a.W / 2, L.y + L.h / 2, { n: 22, col: '#ffd23f', spread: 3.14, spd: L.h * 3, size: L.h * .035, life: .8, grav: L.h * 2.4 });
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.st === 'pick') {
        for (var i = 0; i < 9; i++) {
          var c = d.LO.cells[i];
          if (!d.used[i] && x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) {
            d.sel = i; d.st = 'zoom'; d.t = 0; a.beep(680, .09);
            return;
          }
        }
        return;
      }
      if (d.st === 'scratch') {
        if (d.done) { if (d.rdy <= 0) { d.st = 'unzoom'; d.t = 0; a.beep(520, .1); } return; }
        d.last = null; scr(x, y, a);
      }
    },
    move: function (x, y, a) { if (a.pointer.down) scr(x, y, a); },
    up: function (x, y, a) { a.data.last = null; },
    draw: function (g, a) {
      a.bg('#10123a', '#2b1b6e');
      var d = a.data, L = d.LO;

      /* ----- หัวเรื่อง ----- */
      a.text(a.txt({ th: 'เลือกบัตรขูด', en: 'Pick a scratch card' }),
             a.W / 2, L.headY, a.mn * .055, '#fff');

      /* ----- แผงบัตร 3x3 ----- */
      for (var i = 0; i < 9; i++) {
        if (d.sel === i && d.st !== 'pick') continue;          /* ใบที่กำลังซูมวาดทีหลัง */
        var c = L.cells[i];
        drawCard(g, a, c, i, d.used[i] ? '' : String(i + 1), d.used[i]);
        if (d.used[i]) a.text('✓', c.x + c.w / 2, c.y + c.h / 2, c.h * .40, 'rgba(255,255,255,.85)');
      }

      if (d.st === 'pick') {
        a.text(a.txt({ th: 'แตะบัตรที่ต้องการ', en: 'Tap the card you want' }),
               a.W / 2, a.H - a.mn * .05, a.mn * .034, 'rgba(255,255,255,.85)');
        return;
      }

      /* ----- บัตรที่เลือก: ซูมเข้า / ขูด / ซูมออก ----- */
      var from = L.cells[d.sel], to = L.big, t = d.t;
      var e = d.st === 'unzoom' ? 1 - (1 - (1 - t) * (1 - t)) : 1 - (1 - t) * (1 - t);  /* ease-out */
      if (d.st === 'scratch') e = 1;
      var r = {
        x: from.x + (to.x - from.x) * e,
        y: from.y + (to.y - from.y) * e,
        w: from.w + (to.w - from.w) * e,
        h: from.h + (to.h - from.h) * e
      };
      var rad = Math.min(r.w, r.h) * .10;

      /* ฉากหลังมืดลงเล็กน้อยตอนบัตรใหญ่ */
      g.save(); g.globalAlpha = .55 * e; g.fillStyle = '#000'; g.fillRect(0, 0, a.W, a.H); g.restore();

      /* กรอบขาวของบัตร */
      a.shadow(true);
      a.fillRR(r.x - rad * .5, r.y - rad * 1.2, r.w + rad, r.h + rad * 2.0, rad, '#fff');
      a.shadow(false);
      if (e > .55) {
        a.text(a.txt({ th: 'บัตรขูดลุ้นโชค', en: 'Lucky Scratch Card' }),
               r.x + r.w / 2, r.y - rad * .45, r.h * .085, a.C.dark);
      }

      /* พื้นบัตร + รางวัล (แสงถูก clip ให้อยู่ในกรอบบัตร ไม่ล้นออกนอกพื้นที่ขูด) */
      a.fillRR(r.x, r.y, r.w, r.h, rad * .7, '#f7f4ff');
      g.save();
      a.rr(r.x, r.y, r.w, r.h, rad * .7); g.clip();
      var art = a.hasSpr('gift');
      if (a.hasSpr('glow')) a.spr('glow', null, r.x + r.w / 2, r.y + r.h * .44, r.h * 1.02, { rot: a.now * .25, alpha: .9 });
      if (art) a.spr('gift', null, r.x + r.w / 2, r.y + r.h * .38, r.h * .40);
      var prize = d.prizes[d.sel];
      var fs = r.h * (art ? .13 : .16);
      g.font = '700 ' + fs + 'px Kanit,sans-serif';
      while (g.measureText(prize).width > r.w * .9 && fs > 10) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
      a.text(prize, r.x + r.w / 2, r.y + r.h * (art ? .76 : .5), fs, d.done ? a.C.primary : a.C.dark);
      g.restore();

      /* ชั้นฟอยล์ */
      if (d.st === 'scratch' && !d.done && d.foil) {
        g.save(); a.rr(r.x, r.y, r.w, r.h, rad * .7); g.clip();
        g.drawImage(d.foil, r.x, r.y); g.restore();
      } else if (d.st !== 'scratch') {
        /* ระหว่างซูม ยังไม่เปิดให้ขูด แสดงฟอยล์ทึบไว้ก่อน */
        g.save(); a.rr(r.x, r.y, r.w, r.h, rad * .7); g.clip();
        if (d.st === 'zoom' || !d.used[d.sel]) {
          var gr2 = g.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
          gr2.addColorStop(0, '#c9cfe0'); gr2.addColorStop(.5, '#f0f3fa'); gr2.addColorStop(1, '#a8b0c8');
          g.fillStyle = gr2; g.fillRect(r.x, r.y, r.w, r.h);
          a.text(a.txt({ th: 'ขูดตรงนี้', en: 'SCRATCH HERE' }), r.x + r.w / 2, r.y + r.h / 2, r.h * .13, 'rgba(90,100,130,.85)');
        }
        g.restore();
      }

      if (d.st === 'scratch') {
        a.text(d.done ? a.txt({ th: 'แตะที่จอเพื่อกลับไปเลือกใบใหม่', en: 'Tap anywhere to pick another card' })
                      : a.txt({ th: 'ลากนิ้วเพื่อขูด', en: 'Drag to scratch' }),
               a.W / 2, r.y + r.h + rad * 1.9, a.mn * .034, 'rgba(255,255,255,.92)');
      }
    }
  });


  /* ============================================================
     102-104 กล่องของขวัญ v.2 / v.3 / v.4  — ส่วนที่ใช้ร่วมกัน
     ============================================================ */

  /* สีกล่อง: [ตัวกล่องเข้ม, ตัวกล่องอ่อน, ริบบิ้น] */
  var GIFTCOL = [
    ['#e8305f', '#ff7a9c', '#ffd23f'], ['#f07c1a', '#ffb45e', '#fff2b0'],
    ['#1fb36e', '#6fe3a8', '#ffd23f'], ['#0f8fd6', '#65cdf5', '#fff2b0'],
    ['#6c3fd4', '#a985f5', '#ffd23f'], ['#d41f86', '#ff77c2', '#fff2b0'],
    ['#0ea394', '#63ded0', '#ffd23f'], ['#c99a00', '#ffd95e', '#ffffff'],
    ['#3355cc', '#7f9bff', '#ffd23f']
  ];

  function przList(a) {
    var th = ['🎁 ของแถม', '💰 ลด 100.-', '☕ กาแฟฟรี', '🎫 คูปอง 50%', '😅 เสียใจด้วย',
              '🏆 รางวัลใหญ่', '🧢 หมวกแบรนด์', '🛍️ ถุงผ้า', '⭐ แต้มสะสม x2'];
    var en = ['🎁 Free gift', '💰 100 off', '☕ Free coffee', '🎫 50% coupon', '😅 Try again',
              '🏆 Grand prize', '🧢 Brand cap', '🛍️ Tote bag', '⭐ 2× points'];
    return a.shuffle((a.lang === 'en' ? en : th).slice());
  }

  /* องศาการหมุนเฉดสีของกล่องแต่ละใบ — ใช้ภาพกล่องใบเดียว แล้วเปลี่ยนสีให้ครบ 9 แบบ
     (กล่องต้นฉบับเป็นชมพู-เหลือง หมุนเฉดแล้วได้ฟ้า เขียว ม่วง ส้ม ฯลฯ โดยเงาและเส้นขอบยังอยู่ครบ) */
  var HUE = [0, 40, 75, 115, 150, 190, 225, 265, 300];
  var hueCache = {}, hueOK = null;

  function hueImg(a, key, deg) {
    var im = a.sprImg && a.sprImg(key);
    if (!im || !im.width) return null;
    if (!deg) return im;
    if (hueOK === null) {                      /* เบราว์เซอร์รองรับฟิลเตอร์บน canvas ไหม */
      var t = document.createElement('canvas').getContext('2d');
      t.filter = 'hue-rotate(90deg)';
      hueOK = (t.filter === 'hue-rotate(90deg)');
    }
    if (!hueOK) return im;                     /* ไม่รองรับ ใช้สีเดิมทุกใบ ไม่พัง */
    var ck = im.src + '|' + deg;
    if (hueCache[ck]) return hueCache[ck];
    var c = document.createElement('canvas');
    c.width = im.width; c.height = im.height;
    var cx = c.getContext('2d');
    cx.filter = 'hue-rotate(' + deg + 'deg) saturate(1.05)';
    cx.drawImage(im, 0, 0);
    hueCache[ck] = c;
    return c;
  }

  /* วาดกล่องของขวัญ 1 ใบ
     x,y = จุดกึ่งกลางกล่อง   s = ความสูงรวม (รวมฝา)   ci = ดัชนีสี
     opt = { open:true ฝาเปิดลอยขึ้น, alpha, rot, scale } */
  function giftBox(g, a, x, y, s, ci, opt) {
    opt = opt || {};
    var col = GIFTCOL[ci % GIFTCOL.length];
    var sc = opt.scale || 1;
    g.save();
    if (opt.alpha !== undefined) g.globalAlpha = opt.alpha;
    g.translate(x, y);
    if (opt.rot) g.rotate(opt.rot);
    if (sc !== 1) g.scale(sc, sc);

    /* มีภาพกล่อง (ใช้ร่วมกับเกม 29) ก็ใช้ภาพ แล้วหมุนเฉดสีตามใบ */
    var im = hueImg(a, opt.open ? 'boxOpen' : 'box', HUE[ci % HUE.length]);
    if (im) {
      var iw = s * (im.width / im.height), ih = s;
      g.drawImage(im, -iw / 2, -ih / 2, iw, ih);
      if (opt.open) {                          /* แสงวาบตอนเปิด */
        g.globalAlpha = (opt.alpha !== undefined ? opt.alpha : 1) * .7;
        var og = g.createRadialGradient(0, 0, 0, 0, 0, s * .62);
        og.addColorStop(0, 'rgba(255,231,150,.9)'); og.addColorStop(1, 'rgba(255,210,63,0)');
        g.fillStyle = og; g.beginPath(); g.arc(0, 0, s * .62, 0, 6.29); g.fill();
      }
      g.restore();
      return;
    }

    var w = s * .86, h = s * .66;          /* ตัวกล่อง */
    var lidH = s * .20, lidW = w * 1.10;
    var lift = opt.open ? s * .34 : 0;     /* ฝาเปิดลอยขึ้น */
    var by = -h / 2 + lidH * .45;          /* ขอบบนตัวกล่อง */

    /* เงาใต้กล่อง */
    g.save();
    g.globalAlpha = (opt.alpha !== undefined ? opt.alpha : 1) * .22;
    g.fillStyle = '#000';
    g.beginPath(); g.ellipse(0, by + h + s * .03, w * .48, s * .055, 0, 0, 6.29); g.fill();
    g.restore();

    /* ตัวกล่อง */
    var gr = g.createLinearGradient(-w / 2, by, w / 2, by + h);
    gr.addColorStop(0, col[1]); gr.addColorStop(1, col[0]);
    a.rr(-w / 2, by, w, h, s * .06); g.fillStyle = gr; g.fill();

    /* ริบบิ้นแนวตั้ง */
    g.fillStyle = col[2];
    g.fillRect(-w * .085, by, w * .17, h);

    /* ฝากล่อง */
    var lg = g.createLinearGradient(-lidW / 2, by - lidH - lift, lidW / 2, by - lift);
    lg.addColorStop(0, col[1]); lg.addColorStop(1, col[0]);
    a.rr(-lidW / 2, by - lidH - lift, lidW, lidH, s * .05); g.fillStyle = lg; g.fill();
    g.fillStyle = col[2];
    g.fillRect(-w * .085, by - lidH - lift, w * .17, lidH);

    /* โบว์ */
    var byy = by - lidH - lift, br = s * .105;
    g.fillStyle = col[2];
    g.beginPath(); g.ellipse(-br * .95, byy - br * .55, br, br * .68, -.35, 0, 6.29); g.fill();
    g.beginPath(); g.ellipse(br * .95, byy - br * .55, br, br * .68, .35, 0, 6.29); g.fill();
    g.beginPath(); g.arc(0, byy - br * .42, br * .46, 0, 6.29); g.fill();

    /* แสงวาบตอนเปิด */
    if (opt.open) {
      g.globalAlpha = (opt.alpha !== undefined ? opt.alpha : 1) * .75;
      var rg = g.createRadialGradient(0, by, 0, 0, by, s * .62);
      rg.addColorStop(0, 'rgba(255,231,150,.95)'); rg.addColorStop(1, 'rgba(255,210,63,0)');
      g.fillStyle = rg;
      g.beginPath(); g.arc(0, by, s * .62, 0, 6.29); g.fill();
    }
    g.restore();
  }

  /* กล่องข้อความรางวัลกลางจอ (ใช้ร่วมกันทั้ง 3 เกม) */
  function prizePanel(g, a, prize, showTap) {
    var pw = Math.min(a.W * .86, a.mn * 1.0), ph = a.mn * .24;
    a.fillRR((a.W - pw) / 2, a.H / 2 - ph / 2, pw, ph, a.mn * .034, 'rgba(10,5,25,.88)');
    a.text(a.txt({ th: 'คุณได้รับ', en: 'You won' }), a.W / 2, a.H / 2 - ph * .27, a.mn * .036, 'rgba(255,255,255,.75)');
    var fs = a.mn * .062;
    g.font = '700 ' + fs + 'px Kanit,sans-serif';
    while (g.measureText(prize).width > pw * .88 && fs > 10) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
    a.text(prize, a.W / 2, a.H / 2 + ph * .06, fs, a.C.accent);
    if (showTap) a.text(a.txt({ th: 'แตะเพื่อเล่นอีกครั้ง', en: 'Tap to play again' }),
                        a.W / 2, a.H / 2 + ph * .34, a.mn * .028, 'rgba(255,255,255,.6)');
  }

  function confetti(a, x, y) {
    var d = a.data;
    for (var k = 0; k < 70; k++) d.conf.push({
      x: x, y: y, v: a.rnd(-a.mn * .6, a.mn * .6), h: a.rnd(-a.mn * .6, a.mn * .6),
      life: a.rnd(.8, 1.8), c: a.pick(['#ff2e88', '#ffd23f', '#00d4ff', '#2fe08a', '#ff6a3d'])
    });
  }
  function stepConf(dt, a) {
    var d = a.data;
    d.conf.forEach(function (c) { c.y += c.v * dt; c.x += c.h * dt; c.life -= dt; });
    d.conf = d.conf.filter(function (c) { return c.life > 0; });
  }
  function drawConf(g, a) {
    a.data.conf.forEach(function (c) {
      g.fillStyle = c.c; g.globalAlpha = Math.min(1, c.life);
      g.fillRect(c.x, c.y, a.mn * .014, a.mn * .022); g.globalAlpha = 1;
    });
  }

  /* เปิดกล่อง: เอฟเฟกต์ + เก็บรางวัลที่ได้ */
  function openIt(a, prize, x, y) {
    var d = a.data;
    d.open = true; d.prize = prize; d.t = 0; d.ox = x; d.oy = y;
    a.beep(1000, .25, 'triangle'); a.shake(.014, .3); a.flash('#ffd23f', .2);
    confetti(a, a.W / 2, a.H / 2);
  }


  /* ============================================================
     102 เลือกกล่องของขวัญ v.2 — แผง 3x3 สลับตำแหน่งทุก 2 วินาที
     ============================================================ */
  R('giftpick2', {
    time: 0, noScore: true,
    setup: function (a) {
      var d = a.data;
      var gap = a.mn * .05;
      var bw = Math.min((a.W * .88 - gap * 2) / 3, a.mn * .28), bh = bw * (a.port ? .95 : .85);
      var top = a.mn * .16;
      d.LO = { bw: bw, bh: bh, gap: gap,
               ox: (a.W - (bw * 3 + gap * 2)) / 2,
               oy: top + (a.H - top - (bh * 3 + gap * 2)) / 2 };
      newRound102(a);
      d.conf = [];
    },
    update: function (dt, a) {
      var d = a.data;
      stepConf(dt, a);
      if (d.open) { d.t += dt; return; }
      /* อนิเมชันสลับที่ */
      if (d.sw) {
        d.sw.t += dt / .45;
        if (d.sw.t >= 1) {
          d.sw.pairs.forEach(function (p) {
            var t = d.box[p[0]].slot; d.box[p[0]].slot = d.box[p[1]].slot; d.box[p[1]].slot = t;
          });
          d.sw = null;
        }
        return;
      }
      d.wait -= dt;
      if (d.wait <= 0) {
        d.wait = 1;
        /* สุ่ม 2 คู่ที่ไม่ซ้ำกัน */
        var idx = a.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        d.sw = { t: 0, pairs: [[idx[0], idx[1]], [idx[2], idx[3]]] };
        a.beep(420, .05);
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.open) { if (d.t > .8) newRound102(a); return; }
      for (var i = 0; i < 9; i++) {
        var p = boxPos102(a, i), r = d.LO.bw * .5;
        if (Math.abs(x - p.x) < r && Math.abs(y - p.y) < d.LO.bh * .55) {
          d.sel = i; openIt(a, d.box[i].prize, p.x, p.y);
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#12093a', '#6a1b9a');
      var d = a.data, L = d.LO;
      /* กล่องที่อยู่ไกลวาดก่อน เวลาสลับจะได้ซ้อนกันสวย */
      var order = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(function (i, j) { return boxPos102(a, i).y - boxPos102(a, j).y; });
      order.forEach(function (i) {
        var p = boxPos102(a, i), isSel = d.open && d.sel === i;
        var dim = d.open && !isSel ? .45 : 1;
        var pp = isSel ? a.pop(Math.min(1, d.t / .4)) : 1 + Math.sin(a.now * 3 + i) * .02;
        giftBox(g, a, p.x, p.y - (isSel ? Math.min(L.bh * .2, d.t * L.bh * .7) : 0),
                L.bh * pp, d.box[i].col, { open: isSel, alpha: dim, rot: p.rot });
      });
      drawConf(g, a);
      if (d.open) prizePanel(g, a, d.prize, d.t > .8);
      else a.head(a.txt({ th: 'กล่องสลับที่ไปมา จับจังหวะแล้วเลือก 1 กล่อง', en: 'The boxes keep swapping — pick one' }));
    }
  });

  function newRound102(a) {
    var d = a.data, prz = przList(a), cols = a.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    d.box = [];
    for (var i = 0; i < 9; i++) d.box.push({ slot: i, prize: prz[i], col: cols[i] });
    d.open = false; d.sel = -1; d.t = 0; d.sw = null; d.wait = 1;
  }
  function slotPos102(a, s) {
    var L = a.data.LO;
    return { x: L.ox + (s % 3) * (L.bw + L.gap) + L.bw / 2,
             y: L.oy + Math.floor(s / 3) * (L.bh + L.gap) + L.bh / 2 };
  }
  /* ตำแหน่งจริงของกล่อง i ระหว่างสลับที่ = วิ่งโค้งจากช่องเดิมไปช่องใหม่ */
  function boxPos102(a, i) {
    var d = a.data, from = slotPos102(a, d.box[i].slot);
    if (!d.sw) return { x: from.x, y: from.y, rot: 0 };
    var pr = null, other = -1;
    d.sw.pairs.forEach(function (p) {
      if (p[0] === i) { pr = p; other = p[1]; }
      if (p[1] === i) { pr = p; other = p[0]; }
    });
    if (!pr) return { x: from.x, y: from.y, rot: 0 };
    var to = slotPos102(a, d.box[other].slot), t = a.ease(d.sw.t);
    var arc = Math.sin(t * Math.PI) * a.data.LO.bh * (pr[0] === i ? -.30 : .30);
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t + arc,
             rot: Math.sin(t * Math.PI) * (pr[0] === i ? .22 : -.22) };
  }


  /* ============================================================
     103 เลือกกล่องของขวัญ v.3 — กล่องไหลมาบนสายพาน
     ============================================================ */
  R('giftpick3', {
    time: 0, noScore: true,
    setup: function (a) {
      var d = a.data;
      d.beltY = a.H * (a.port ? .62 : .66);          /* เส้นผิวบนของสายพาน */
      d.beltH = a.mn * .085;
      d.spd = a.W * (a.port ? .16 : .13);            /* ความเร็วสายพาน px/วิ */
      d.items = []; d.conf = []; d.scroll = 0;
      d.open = false; d.t = 0; d.sel = null;
      d.prz = przList(a); d.pi = 0;
      /* เติมกล่องให้เต็มสายพานตั้งแต่เริ่ม */
      var x = a.W * .12;
      while (x < a.W * 1.1) x += spawn103(a, x) + a.mn * a.rnd(.20, .28);
    },
    update: function (dt, a) {
      var d = a.data;
      stepConf(dt, a);
      if (d.open) { d.t += dt; return; }
      d.scroll += d.spd * dt;
      d.items.forEach(function (it) { it.x -= d.spd * dt; });
      d.items = d.items.filter(function (it) { return it.x > -a.W * .25; });
      /* เติมกล่องใหม่ทางขวา */
      var last = 0;
      d.items.forEach(function (it) { last = Math.max(last, it.x + it.s * .6); });
      while (last < a.W * 1.15) {
        var nx = last + a.mn * a.rnd(.20, .28);
        last = nx + spawn103(a, nx);
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.open) {
        if (d.t > .8) {
          /* กล่องที่เปิดไปแล้วเอาออกจากสายพาน แล้วเดินสายพานต่อ */
          d.items = d.items.filter(function (it) { return it !== d.sel; });
          d.open = false; d.sel = null;
        }
        return;
      }
      for (var i = d.items.length - 1; i >= 0; i--) {
        var it = d.items[i];
        if (Math.abs(x - it.x) < it.s * .45 && y > it.cy - it.s * .6 && y < it.cy + it.s * .55) {
          d.sel = it; openIt(a, it.prize, it.x, it.cy);
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#1a1040', '#3e2a86');
      var d = a.data;
      drawBelt103(g, a);
      d.items.forEach(function (it) {
        var isSel = d.open && d.sel === it;
        var dim = d.open && !isSel ? .45 : 1;
        var bob = d.open ? 0 : Math.sin(a.now * 6 + it.ph) * it.s * .012;
        var pp = isSel ? a.pop(Math.min(1, d.t / .4)) : 1;
        giftBox(g, a, it.x, it.cy + bob - (isSel ? Math.min(it.s * .25, d.t * it.s * .8) : 0),
                it.s * pp, it.col, { open: isSel, alpha: dim });
      });
      drawConf(g, a);
      if (d.open) prizePanel(g, a, d.prize, d.t > .8);
      else a.head(a.txt({ th: 'แตะเลือกกล่องที่ไหลผ่านสายพาน', en: 'Tap a box as it rides past' }));
    }
  });

  /* ปล่อยกล่องใหม่ที่ตำแหน่ง x คืนค่าครึ่งความกว้างของกล่อง (ไว้คำนวณช่องว่างถัดไป) */
  function spawn103(a, x) {
    var d = a.data;
    var s = a.mn * a.rnd(.14, .26);                 /* ขนาดเล็กใหญ่ไม่เท่ากัน */
    d.items.push({
      x: x, s: s, cy: d.beltY - s * .42, ph: a.rnd(0, 6.28),
      col: a.rndi(0, GIFTCOL.length - 1),
      prize: d.prz[(d.pi++) % d.prz.length]
    });
    return s * .55;
  }

  /* สายพาน: แถบเข้ม + ลูกกลิ้ง + ลายทแยงที่เลื่อนไปตามความเร็ว */
  function drawBelt103(g, a) {
    var d = a.data, y = d.beltY, h = d.beltH;
    /* โครงใต้สายพาน */
    a.fillRR(-a.mn * .05, y + h, a.W + a.mn * .1, a.mn * .05, a.mn * .012, 'rgba(10,8,30,.55)');
    /* ผิวสายพาน */
    var gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, '#3a3a46'); gr.addColorStop(.5, '#23232c'); gr.addColorStop(1, '#14141b');
    g.fillStyle = gr; g.fillRect(0, y, a.W, h);
    /* ลายทแยงเลื่อน */
    g.save(); g.beginPath(); g.rect(0, y, a.W, h); g.clip();
    g.strokeStyle = 'rgba(255,255,255,.10)'; g.lineWidth = Math.max(2, h * .16);
    var step = h * 1.15, off = (-d.scroll) % (step * 2);
    for (var x = off - step * 2; x < a.W + step * 2; x += step * 2) {
      g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + h, y); g.stroke();
    }
    g.restore();
    /* ขอบบน-ล่าง */
    g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(0, y, a.W, Math.max(1, h * .07));
    /* ลูกกลิ้งสองข้าง */
    var rr = h * .72;
    [rr * .9, a.W - rr * .9].forEach(function (cx) {
      var rg = g.createRadialGradient(cx - rr * .3, y + h / 2 - rr * .3, rr * .1, cx, y + h / 2, rr);
      rg.addColorStop(0, '#9aa0b5'); rg.addColorStop(1, '#40465c');
      g.fillStyle = rg; g.beginPath(); g.arc(cx, y + h / 2, rr, 0, 6.29); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = Math.max(1.5, rr * .10);
      g.beginPath();
      var ang = d.scroll / rr;
      g.moveTo(cx + Math.cos(ang) * rr * .62, y + h / 2 + Math.sin(ang) * rr * .62);
      g.lineTo(cx - Math.cos(ang) * rr * .62, y + h / 2 - Math.sin(ang) * rr * .62);
      g.stroke();
    });
  }


  /* ============================================================
     104 เลือกกล่องของขวัญ v.4 — กล่องร่วงลงมา แกว่งและสั่นไม่เท่ากัน
     ============================================================ */
  R('giftpick4', {
    time: 0, noScore: true,
    setup: function (a) {
      var d = a.data;
      d.items = []; d.conf = []; d.open = false; d.t = 0;
      d.prz = przList(a); d.pi = 0;
      /* เริ่มเกมให้มีกล่องกระจายอยู่ทั่วจอแล้ว */
      for (var i = 0; i < 7; i++) { var it = mk104(a); it.y = a.rnd(-a.H * .1, a.H * .9); d.items.push(it); }
    },
    update: function (dt, a) {
      var d = a.data;
      stepConf(dt, a);
      if (d.open) { d.t += dt; return; }
      d.items.forEach(function (it) {
        it.y += it.vy * dt;
        it.ph += dt * it.sway;                   /* จังหวะแกว่งซ้ายขวา */
        it.sh += dt * it.shakeSpd;               /* จังหวะสั่น */
      });
      d.items = d.items.filter(function (it) { return it.y < a.H + it.s; });
      while (d.items.length < 7) d.items.push(mk104(a));
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.open) {
        if (d.t > .8) {
          /* กล่องที่เปิดแล้วหายไป มีใบใหม่ร่วงลงมาแทน */
          d.items = d.items.filter(function (it) { return it !== d.sel; });
          d.open = false; d.sel = null;
        }
        return;
      }
      for (var i = d.items.length - 1; i >= 0; i--) {
        var it = d.items[i], px = x104(a, it);
        if (Math.abs(x - px) < it.s * .48 && Math.abs(y - it.y) < it.s * .52) {
          d.sel = it; it.vy = 0; openIt(a, it.prize, px, it.y);
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#0e0b33', '#4a1b7a');
      var d = a.data;
      d.items.forEach(function (it) {
        var isSel = d.open && d.sel === it;
        var dim = d.open && !isSel ? .45 : 1;
        var rot = isSel ? 0 : Math.sin(it.sh) * it.shake + Math.sin(it.ph) * .10;
        var pp = isSel ? a.pop(Math.min(1, d.t / .4)) : 1;
        giftBox(g, a, x104(a, it), it.y, it.s * pp, it.col, { open: isSel, alpha: dim, rot: rot });
      });
      drawConf(g, a);
      if (d.open) prizePanel(g, a, d.prize, d.t > .8);
      else a.head(a.txt({ th: 'กล่องกำลังร่วงลงมา แตะเลือก 1 กล่อง', en: 'Boxes are falling — tap one' }));
    }
  });

  /* กล่องใหม่ 1 ใบ: ขนาด สี ความเร็วตก ระยะแกว่ง และความแรงสั่น สุ่มแยกกันทุกใบ */
  function mk104(a) {
    var d = a.data, s = a.mn * a.rnd(.15, .26);
    return {
      s: s, col: a.rndi(0, GIFTCOL.length - 1),
      bx: a.rnd(a.W * .14, a.W * .86),       /* แกนกลางที่ใช้แกว่งรอบ ๆ */
      y: -s * a.rnd(.6, 2.4),
      vy: a.mn * a.rnd(.11, .34),            /* บางใบตกช้า บางใบตกเร็ว */
      amp: a.rnd(a.mn * .02, a.mn * .09),    /* ระยะแกว่งซ้ายขวา */
      sway: a.rnd(.9, 2.2), ph: a.rnd(0, 6.28),
      shake: a.rnd(.02, .20),                /* บางใบสั่นแรง บางใบสั่นบาง */
      shakeSpd: a.rnd(7, 20), sh: a.rnd(0, 6.28),
      prize: d.prz[(d.pi++) % d.prz.length]
    };
  }
  function x104(a, it) {
    var x = it.bx + Math.sin(it.ph) * it.amp;
    return Math.max(it.s * .5, Math.min(a.W - it.s * .5, x));
  }


  /* ============================================================
     105 สอยดาว — ดาวหลายขนาดกระพริบและลอยจากขวาไปซ้าย
     ดวงเล็ก = อยู่ไกล เลื่อนช้า   ดวงใหญ่ = อยู่ใกล้ เลื่อนเร็ว (perspective)
     ============================================================ */

  var STARCOL = ['#ffffff', '#fff3b0', '#ffd23f', '#bde3ff', '#9fe8ff', '#ffc2ea', '#d6c3ff'];

  /* ดาวประกาย 4 แฉก + แสงฟุ้ง */
  function sparkle(g, x, y, r, col, alpha, rot) {
    g.save();
    g.globalAlpha = alpha;
    g.translate(x, y);
    if (rot) g.rotate(rot);

    /* แสงฟุ้งรอบดาว */
    var rg = g.createRadialGradient(0, 0, 0, 0, 0, r * 2.2);
    rg.addColorStop(0, col);
    rg.addColorStop(.25, 'rgba(255,255,255,.35)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.globalAlpha = alpha * .55;
    g.fillStyle = rg;
    g.beginPath(); g.arc(0, 0, r * 2.2, 0, 6.29); g.fill();

    /* ตัวดาว 4 แฉก คอดกลาง */
    g.globalAlpha = alpha;
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(0, -r);
    g.quadraticCurveTo(r * .16, -r * .16, r, 0);
    g.quadraticCurveTo(r * .16, r * .16, 0, r);
    g.quadraticCurveTo(-r * .16, r * .16, -r, 0);
    g.quadraticCurveTo(-r * .16, -r * .16, 0, -r);
    g.fill();

    /* ไส้กลางสีขาว */
    g.globalAlpha = alpha * .9;
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(0, 0, r * .20, 0, 6.29); g.fill();
    g.restore();
  }

  R('starpick', {
    time: 0, noScore: true,
    setup: function (a) {
      var d = a.data;
      d.stars = []; d.conf = []; d.open = null; d.t = 0;
      d.prz = przList(a); d.pi = 0;
      d.rMin = a.mn * .016; d.rMax = a.mn * .055;
      for (var i = 0; i < 38; i++) {
        var s = mkStar(a);
        s.x = a.rnd(-a.W * .05, a.W * 1.05);      /* เริ่มเกมให้ดาวกระจายเต็มจอแล้ว */
        d.stars.push(s);
      }
      sortStars(a);
    },
    update: function (dt, a) {
      var d = a.data;
      stepConf(dt, a);
      d.stars.forEach(function (s) { s.ph += dt * s.tw; });
      if (d.open) { d.t += dt; return; }
      var out = false;
      d.stars.forEach(function (s) {
        s.x -= s.spd * dt;
        if (s.x < -a.mn * .12) { reset(a, s); out = true; }
      });
      if (out) sortStars(a);
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.open) {
        if (d.t > .9) {
          /* ดาวที่สอยไปแล้วหายไป มีดวงใหม่ลอยเข้ามาแทน */
          reset(a, d.open); sortStars(a);
          d.open = null; d.t = 0;
        }
        return;
      }
      /* ไล่จากดวงใหญ่ (อยู่หน้า) ไปดวงเล็ก */
      for (var i = d.stars.length - 1; i >= 0; i--) {
        var s = d.stars[i];
        var hit = Math.max(s.r * 1.9, a.mn * .045);
        if ((x - s.x) * (x - s.x) + (y - s.y) * (y - s.y) < hit * hit) {
          d.open = s; d.t = 0;
          d.prize = s.prize;
          a.beep(1180, .28, 'triangle'); a.shake(.012, .3); a.flash('#ffe9a8', .2);
          confetti(a, a.W / 2, a.H / 2);
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#101a5a', '#4b1d7a');            /* ใช้ภาพอวกาศจากเกม 64 ถ้ามี พื้นหลังอยู่นิ่ง */
      var d = a.data;

      d.stars.forEach(function (s) {
        if (s === d.open) return;            /* ดวงที่สอยอยู่วาดทีหลัง */
        var tw = .55 + .45 * Math.sin(s.ph);                 /* กระพริบ เร็ว-ช้าไม่เท่ากัน */
        var al = (d.open ? .35 : 1) * (s.base * tw);
        sparkle(g, s.x, s.y, s.r * (.88 + .12 * tw), s.col, al, s.rot);
      });

      /* ดวงที่ถูกสอย: พุ่งเข้ากลางจอแล้วบานออก */
      if (d.open) {
        var s = d.open, e = Math.min(1, d.t / .45), ee = a.ease(e);
        var cx = s.x + (a.W / 2 - s.x) * ee, cy = s.y + (a.H / 2 - s.y) * ee;
        var rr = s.r + (a.mn * .19 - s.r) * ee;
        sparkle(g, cx, cy, rr * a.pop(Math.min(1, d.t / .5)), '#fff4c2', 1, a.now * 1.6);
      }

      drawConf(g, a);
      if (d.open && d.t > .45) prizePanel(g, a, d.prize, d.t > .9);
      else if (!d.open) a.head(a.txt({ th: 'แตะสอยดาว 1 ดวง ลุ้นรางวัล', en: 'Tap a star to claim your prize' }));
    }
  });

  /* ดาวดวงใหม่ 1 ดวง (ยังไม่กำหนด x) */
  function mkStar(a) {
    var d = a.data, s = {};
    reset(a, s);
    return s;
  }
  /* คืนดาวกลับไปเริ่มใหม่ทางขวาจอ พร้อมสุ่มค่าทั้งหมด */
  function reset(a, s) {
    var d = a.data;
    var f = Math.pow(a.rnd(0, 1), 1.5);                      /* ดวงเล็กเยอะกว่าดวงใหญ่ */
    s.r = d.rMin + (d.rMax - d.rMin) * f;
    var k = (s.r - d.rMin) / (d.rMax - d.rMin);              /* 0 = ไกลสุด, 1 = ใกล้สุด */
    s.spd = a.mn * (.012 + .13 * Math.pow(k, 1.25));         /* ใหญ่กว่า = เลื่อนเร็วกว่า */
    s.base = .45 + .55 * k;                                  /* ดวงไกลจางกว่า */
    s.x = a.W + a.rnd(a.mn * .03, a.mn * .45);
    s.y = a.rnd(a.H * .12, a.H * .93);
    s.tw = a.rnd(1.1, 5.2);                                  /* ความเร็วกระพริบ */
    s.ph = a.rnd(0, 6.28);
    s.rot = a.rnd(0, .8);
    s.col = a.pick(STARCOL);
    s.prize = d.prz[(d.pi++) % d.prz.length];
    return s;
  }
  /* เรียงให้ดวงเล็ก (ไกล) วาดก่อน ดวงใหญ่ (ใกล้) วาดทับ */
  function sortStars(a) {
    a.data.stars.sort(function (p, q) { return p.r - q.r; });
  }


  /* ============================================================
     106 ตู้เป่าตั๋วชิงโชค
     ท่ออคริลิคทรงกระบอกใส่ตั๋วเต็ม → กดปุ่มให้พัดลมเป่าตั๋วปลิว
     → ล้วงมือเข้าไปทางช่องกลม คว้าตั๋วออกมา → เปิดตั๋วดูรางวัล
     ============================================================ */

  var TKCOL = ['#ffd23f', '#ff6a8a', '#5ad1ff', '#8ef0a8', '#ffab5e', '#c9a6ff', '#ffffff'];

  function tkLayout(a) {
    var ty = a.H * (a.port ? .115 : .10);
    var baseH = Math.min(a.mn * .155, a.H * .17);
    var maxTh = a.H - ty - baseH - a.mn * .02;             /* สูงได้เท่าที่เหลือ */
    var tw = Math.min(a.W * (a.port ? .86 : .70), a.mn * .95, maxTh / .78);
    var th = Math.min(maxTh, tw * 1.75);
    var tx = (a.W - tw) / 2;
    var wall = tw * .042;                                  /* ความหนาผนังอคริลิค */
    return {
      tx: tx, ty: ty, tw: tw, th: th, wall: wall,
      ix0: tx + wall, ix1: tx + tw - wall, iy0: ty + wall, iy1: ty + th - wall,
      baseY: ty + th, baseH: baseH,
      holeX: tx + tw / 2, holeY: ty + th * .70, holeR: Math.min(tw * .19, a.mn * .115),
      fanX: tx + tw / 2, fanY: ty + th - wall * 1.9, fanR: tw * .26,
      btnW: tw * .52, btnH: Math.max(a.mn * .052, baseH * .44)
    };
  }

  function mkTicket(a, settled) {
    var L = a.data.LO, w = L.tw * .15;
    return {
      x: a.rnd(L.ix0 + w * .55, L.ix1 - w * .55),
      y: settled ? a.rnd(L.iy1 - L.th * .30, L.iy1 - w * .18) : a.rnd(L.iy0, L.iy1),
      vx: 0, vy: 0, w: w, rot: a.rnd(0, 6.28), vr: a.rnd(-3, 3),
      col: a.pick(TKCOL)
    };
  }

  /* ตั๋ว 1 ใบ  w = ความกว้าง  (สูง = .46 ของกว้าง) */
  function drawTicket(g, a, x, y, w, rot, col, prize) {
    var h = w * .46, r = h * .18;
    g.save();
    g.translate(x, y); if (rot) g.rotate(rot);
    /* ตัวตั๋ว */
    a.rr(-w / 2, -h / 2, w, h, r); g.fillStyle = '#fffdf5'; g.fill();
    /* แถบสีหัวตั๋ว */
    g.save(); a.rr(-w / 2, -h / 2, w, h, r); g.clip();
    g.fillStyle = col; g.fillRect(-w / 2, -h / 2, w * .30, h);
    g.restore();
    /* รอยปรุ + รอยบากสองข้าง */
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = Math.max(1, w * .012);
    g.setLineDash([h * .10, h * .10]);
    g.beginPath(); g.moveTo(-w / 2 + w * .30, -h / 2 + h * .10); g.lineTo(-w / 2 + w * .30, h / 2 - h * .10); g.stroke();
    g.setLineDash([]);
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.beginPath(); g.arc(-w / 2 + w * .30, -h / 2, h * .09, 0, 6.29); g.fill();
    g.beginPath(); g.arc(-w / 2 + w * .30, h / 2, h * .09, 0, 6.29); g.fill();
    /* ข้อความบนตั๋ว */
    if (prize) {
      var fs = h * .30;
      g.font = '700 ' + fs + 'px Kanit,sans-serif';
      while (g.measureText(prize).width > w * .62 && fs > 8) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
      a.text(prize, w * .15 - w * .06, 0, fs, '#1b1230');
    } else {
      g.fillStyle = 'rgba(0,0,0,.16)';
      for (var i = 0; i < 3; i++) g.fillRect(-w / 2 + w * .40, -h * .16 + i * h * .16, w * .42, Math.max(1, h * .055));
    }
    g.restore();
  }

  /* มือการ์ตูน — ยื่นขึ้นมาจากขอบจอด้านล่าง ปลายนิ้วชี้ขึ้น
     x,y = กึ่งกลางฝ่ามือ   s = ขนาดฝ่ามือ   grip 0=แบ 1=กำ   rot = เอียงข้อมือ */
  function drawHand(g, a, x, y, s, grip, rot) {
    var skin = '#ffcf9e', skin2 = '#f0b481', cuff = '#3f7bff';
    g.save();
    g.translate(x, y); if (rot) g.rotate(rot);
    /* แขนเสื้อยาวลงไปถึงขอบจอล่าง */
    a.rr(-s * .34, s * .45, s * .68, a.H, s * .16); g.fillStyle = cuff; g.fill();
    a.rr(-s * .40, s * .40, s * .80, s * .26, s * .10); g.fillStyle = '#2f5fd8'; g.fill();
    /* ฝ่ามือ */
    a.rr(-s * .42, -s * .34, s * .84, s * .80, s * .24); g.fillStyle = skin; g.fill();
    /* นิ้ว 4 นิ้ว ชี้ขึ้น — สั้นลง กำแล้วยิ่งสั้นและงอเข้า */
    var fl = s * (.30 - .20 * grip), fx = -s * .34;
    for (var i = 0; i < 4; i++) {
      var xx = fx + i * s * .21, cur = grip * s * .08 * (1 + i * .15);
      a.rr(xx + cur, -s * .34 - fl, s * .17, fl + s * .16, s * .085);
      g.fillStyle = i % 2 ? skin2 : skin; g.fill();
    }
    /* นิ้วโป้ง ยื่นออกด้านขวา */
    g.save();
    g.translate(s * .34, -s * .12); g.rotate(.5 - grip * .75);
    a.rr(-s * .11, -s * .26, s * .22, s * .42, s * .11); g.fillStyle = skin2; g.fill();
    g.restore();
    g.restore();
  }

  R('ticketblower', {
    time: 0, noScore: true,
    setup: function (a) {
      var d = a.data;
      d.LO = tkLayout(a);
      d.conf = [];
      d.prz = przList(a); d.pi = 0;
      tkIdle(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      stepConf(dt, a);
      d.fanSpin += dt * (d.st === 'blow' || d.st === 'grab' ? 26 : (d.st === 'idle' ? 0 : 6));
      d.t += dt;

      /* ---- ตั๋วในท่อ ---- */
      var blowing = (d.st === 'blow' || d.st === 'grab');
      d.tk.forEach(function (k) {
        if (k === d.held) return;
        if (blowing) {
          /* ลมหมุนวนในท่อ: ขึ้นตรงกลาง ลงริมผนัง + ปั่นป่วนสุ่ม
             ทำให้ตั๋วไหลเวียนทั่วท่อ ไม่กองรวมกันอยู่ด้านบน */
          var cx = (L.ix0 + L.ix1) / 2, halfW = (L.ix1 - L.ix0) / 2;
          var nx = (k.x - cx) / halfW;                          /* -1 = ชิดซ้าย, 1 = ชิดขวา */
          var up = Math.max(0, 1 - (L.iy1 - k.y) / (L.th * .95));   /* ใกล้พัดลม = ลมแรง */
          /* กลางท่อลมพัดขึ้น ริมผนังลมม้วนลง */
          var core = 1 - Math.min(1, Math.abs(nx) / .62);
          k.vy -= a.mn * (2.9 * core - 1.0 * (1 - core)) * (.45 + .85 * up) * dt;
          /* ลมม้วนเป็นวง: บนดันออกข้าง ล่างดูดเข้ากลาง */
          var band = (k.y - L.iy0) / (L.iy1 - L.iy0);            /* 0 บน, 1 ล่าง */
          k.vx += (band < .45 ? Math.sign(nx || 1) : -nx * 1.6) * a.mn * 1.5 * dt;
          /* ปั่นป่วนสุ่มแรง ๆ ให้ปลิวคว้าง */
          k.vx += a.rnd(-1, 1) * a.mn * 4.2 * dt;
          k.vy += a.rnd(-1, 1) * a.mn * 3.2 * dt;
          k.vr += a.rnd(-1, 1) * 26 * dt;
          /* จำกัดความเร็วไม่ให้พุ่งหลุดจนดูแปลก */
          var vmax = a.mn * 1.45;
          k.vx = Math.max(-vmax, Math.min(vmax, k.vx));
          k.vy = Math.max(-vmax, Math.min(vmax, k.vy));
          k.vr = Math.max(-13, Math.min(13, k.vr));
        }
        k.vy += a.mn * (blowing ? .95 : 1.35) * dt;     /* แรงโน้มถ่วง */
        k.vx *= blowing ? .992 : .985;
        k.vy *= blowing ? .992 : .985;
        k.vr *= blowing ? .995 : .99;
        k.x += k.vx * dt; k.y += k.vy * dt; k.rot += k.vr * dt;
        /* ชนผนังท่อ — เด้งแรงขึ้นและมีการหมุนตอนชน */
        var m = k.w * .30;
        if (k.x < L.ix0 + m) { k.x = L.ix0 + m; k.vx = Math.abs(k.vx) * .75 + a.mn * .1; k.vr += a.rnd(2, 7); }
        if (k.x > L.ix1 - m) { k.x = L.ix1 - m; k.vx = -Math.abs(k.vx) * .75 - a.mn * .1; k.vr -= a.rnd(2, 7); }
        if (k.y < L.iy0 + m) { k.y = L.iy0 + m; k.vy = Math.abs(k.vy) * .70 + a.mn * .08; k.vx += a.rnd(-1, 1) * a.mn * .35; k.vr += a.rnd(-5, 5); }
        if (k.y > L.iy1 - m) {
          k.y = L.iy1 - m;
          k.vy = blowing ? -Math.abs(k.vy) * .55 - a.mn * .25 : -Math.abs(k.vy) * .30;
          k.vx *= .88; k.vr *= .85;
        }
      });

      if (d.st === 'blow' && d.t > 8) { d.st = 'idle'; d.t = 0; }   /* เป่านานไปก็หยุดเอง */

      /* ---- อนิเมชันมือล้วงหยิบตั๋ว ---- */
      if (d.st === 'grab') {
        var T = d.t;
        if (T < .55) {                                   /* ยื่นมือขึ้นมาจากขอบจอล่าง เข้าไปในช่อง
                                                            หยุดให้ปลายนิ้วอยู่แค่ขอบบนของวงกลมสีส้ม ไม่เลยเข้าไป */
          d.grip = 0;
          d.handY = a.H + L.holeR * 1.6 + (tkHandTop(a) - (a.H + L.holeR * 1.6)) * a.ease(T / .55);
          d.handX = L.holeX;
        } else if (T < 1.0) {                            /* กำตั๋ว */
          d.grip = a.ease((T - .55) / .45);
          if (!d.held) {
            /* เลือกตั๋วที่อยู่ใกล้มือที่สุด */
            var best = null, bd = 1e9;
            d.tk.forEach(function (k) {
              var dd = (k.x - d.handX) * (k.x - d.handX) + (k.y - d.handY) * (k.y - d.handY);
              if (dd < bd) { bd = dd; best = k; }
            });
            d.held = best; d.heldPrize = d.prz[(d.pi++) % d.prz.length];
            a.beep(520, .08);
          }
        } else if (T < 1.75) {                           /* ดึงมือกลับลงไป */
          d.grip = 1;
          var e2 = a.ease((T - 1.0) / .75), hy = tkHandTop(a);
          d.handX = L.holeX;
          d.handY = hy + (a.H * .92 - hy) * e2;
        } else {
          d.st = 'open'; d.t = 0;
          d.openFrom = { x: d.handX, y: d.handY - L.holeR * .5 };
          a.beep(1000, .26, 'triangle'); a.shake(.012, .28); a.flash('#ffe9a8', .18);
          confetti(a, a.W / 2, a.H / 2);
        }
        if (d.held) { d.held.x = d.handX; d.held.y = d.handY - L.holeR * .75; d.held.rot = -.12; d.held.vx = d.held.vy = 0; }
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.st === 'open') { if (d.t > .8) tkIdle(a); return; }
      if (d.st === 'grab') return;
      /* แตะช่องกลม = ล้วงหยิบ (ต้องเป่าอยู่) */
      if (d.st === 'blow') {
        var dx = x - L.holeX, dy = y - L.holeY;
        if (dx * dx + dy * dy < L.holeR * L.holeR * 2.3) { d.st = 'grab'; d.t = 0; d.grip = 0; a.beep(700, .08); return; }
      }
      /* แตะปุ่มบนฐาน = เป่า */
      var bx = a.W / 2 - L.btnW / 2, by = L.baseY + L.baseH * .26;
      if (x > bx && x < bx + L.btnW && y > by && y < by + L.btnH) {
        d.st = 'blow'; d.t = 0;
        d.tk.forEach(function (k) {
          k.vy = -a.mn * a.rnd(.7, 1.9); k.vx = a.rnd(-1, 1) * a.mn * .9; k.vr = a.rnd(-9, 9);
        });
        a.beep(300, .18, 'sawtooth');
      }
    },
    draw: function (g, a) {
      a.bg('#1b1040', '#4b2a86');
      var d = a.data, L = d.LO;

      drawBase(g, a);

      drawTubeBack(g, a);

      /* ---- ของที่อยู่ "ข้างใน" ท่อ ---- */
      g.save();
      a.rr(L.ix0, L.iy0, L.ix1 - L.ix0, L.iy1 - L.iy0, L.tw * .07); g.clip();
      drawFan(g, a);
      d.tk.forEach(function (k) {
        if (k === d.held && (d.st === 'grab' || d.st === 'open')) return;   /* ใบที่ถืออยู่วาดทีหลัง */
        drawTicket(g, a, k.x, k.y, k.w, k.rot, k.col, null);
      });
      g.restore();

      drawTubeGlass(g, a);

      /* ---- ช่องกลมสำหรับล้วงมือ ---- */
      drawHole(g, a);

      /* ---- มือ (วาดทับวงแหวนสีส้ม ให้ดูเหมือนยื่นเข้ามาจากด้านหน้า) ---- */
      if (d.st === 'grab') drawHand(g, a, d.handX, d.handY, L.holeR * 1.15, d.grip, 0);
      if (d.st === 'grab' && d.held) drawTicket(g, a, d.held.x, d.held.y, d.held.w, d.held.rot, d.held.col, null);

      /* ---- ตั๋วใบที่ได้: ลอยเข้ากลางจอแล้วขยายเป็นใบใหญ่ ---- */
      if (d.st === 'open') {
        var e = Math.min(1, d.t / .5), ee = a.ease(e);
        var bw = Math.min(a.W * .74, a.mn * .86);
        var cx = d.openFrom.x + (a.W / 2 - d.openFrom.x) * ee;
        var cy = d.openFrom.y + (a.H / 2 - d.openFrom.y) * ee;
        var w = d.held.w + (bw - d.held.w) * ee;
        var rot = -.12 * (1 - ee);
        /* พลิกใบตั๋วให้เห็นด้านในตอนใกล้ถึงกลางจอ */
        var flip = e > .62 ? Math.abs(Math.cos((e - .62) / .38 * Math.PI)) : 1;
        var showPrize = e > .62 && (e - .62) / .38 > .5;
        g.save();
        g.translate(cx, cy); g.scale(Math.max(.04, flip), 1); g.translate(-cx, -cy);
        drawTicket(g, a, cx, cy, w, rot, d.held.col, showPrize ? d.heldPrize : null);
        g.restore();
        if (e >= 1) {
          a.text(a.txt({ th: 'คุณได้รับ', en: 'You won' }), a.W / 2, a.H / 2 - bw * .34, a.mn * .036, '#fff');
          if (d.t > .8) a.text(a.txt({ th: 'แตะเพื่อเล่นอีกครั้ง', en: 'Tap to play again' }),
                               a.W / 2, a.H / 2 + bw * .32, a.mn * .028, 'rgba(255,255,255,.7)');
        }
      }

      drawConf(g, a);

      /* ---- ข้อความบอกวิธีเล่น ---- */
      if (d.st === 'idle') a.head(a.txt({ th: 'กดปุ่มให้พัดลมเป่าตั๋ว', en: 'Press the button to blow the tickets' }));
      else if (d.st === 'blow') a.head(a.txt({ th: 'แตะที่ช่องกลม ล้วงมือเข้าไปคว้าตั๋ว', en: 'Tap the hole and reach in for a ticket' }));
    }
  });

  /* จุดกึ่งกลางฝ่ามือที่สูงที่สุด — ให้ปลายนิ้วพอดีขอบบนของวงแหวนสีส้ม ไม่เลยขึ้นไป
     ขนาดมือ s = holeR*1.15  ปลายนิ้วอยู่เหนือกึ่งกลางฝ่ามือ s*.86 */
  function tkHandTop(a) {
    var L = a.data.LO, s = L.holeR * 1.15;
    return (L.holeY - L.holeR * 1.06) + s * .64;   /* s*.64 = ระยะจากกึ่งกลางฝ่ามือถึงปลายนิ้ว */
  }

  function tkIdle(a) {
    var d = a.data;
    d.st = 'idle'; d.t = 0; d.fanSpin = 0;
    d.held = null; d.heldPrize = ''; d.grip = 0;
    d.handX = a.W * 2; d.handY = 0;
    d.tk = [];
    for (var i = 0; i < 72; i++) d.tk.push(mkTicket(a, true));
  }

  /* ตัวท่ออคริลิค ส่วนที่อยู่หลังของข้างใน */
  function drawTubeBack(g, a) {
    var L = a.data.LO;
    a.rr(L.tx, L.ty, L.tw, L.th, L.tw * .10);
    var tg = g.createLinearGradient(L.tx, 0, L.tx + L.tw, 0);
    tg.addColorStop(0, 'rgba(255,255,255,.16)');
    tg.addColorStop(.35, 'rgba(180,220,255,.07)');
    tg.addColorStop(1, 'rgba(255,255,255,.13)');
    g.fillStyle = tg; g.fill();
  }

  /* ผนังท่อ ไฮไลต์แก้ว และฝาบน — วาดทับของข้างใน */
  function drawTubeGlass(g, a) {
    var L = a.data.LO;
    g.lineWidth = L.wall;
    a.rr(L.tx + L.wall / 2, L.ty + L.wall / 2, L.tw - L.wall, L.th - L.wall, L.tw * .10);
    g.strokeStyle = 'rgba(220,240,255,.55)'; g.stroke();
    g.save();
    a.rr(L.tx, L.ty, L.tw, L.th, L.tw * .10); g.clip();
    g.fillStyle = 'rgba(255,255,255,.16)';
    g.fillRect(L.tx + L.tw * .10, L.ty, L.tw * .07, L.th);
    g.fillStyle = 'rgba(255,255,255,.09)';
    g.fillRect(L.tx + L.tw * .80, L.ty, L.tw * .05, L.th);
    g.restore();
    /* ฝาบน */
    a.fillRR(L.tx - L.tw * .04, L.ty - L.tw * .07, L.tw * 1.08, L.tw * .12, L.tw * .05, '#6b7ba8');
    a.fillRR(L.tx - L.tw * .02, L.ty - L.tw * .05, L.tw * 1.04, L.tw * .05, L.tw * .025, 'rgba(255,255,255,.35)');
  }

  /* ฐานตู้ + ปุ่มกด */
  function drawBase(g, a) {
    var d = a.data, L = d.LO;
    var bw = L.tw * 1.30, bx = a.W / 2 - bw / 2;
    a.shadow(true);
    a.fillRR(bx, L.baseY, bw, L.baseH, L.baseH * .22, '#2b2140');
    a.shadow(false);
    a.fillRR(bx, L.baseY, bw, L.baseH * .22, L.baseH * .11, '#3b2f58');

    var btx = a.W / 2 - L.btnW / 2, bty = L.baseY + L.baseH * .26;
    var lit = d.st === 'idle' ? (.65 + .35 * Math.sin(a.now * 4)) : .35;
    g.save(); g.globalAlpha = lit * .5;
    a.fillRR(btx - L.btnH * .22, bty - L.btnH * .22, L.btnW + L.btnH * .44, L.btnH + L.btnH * .44, L.btnH, '#ff7a3d');
    g.restore();
    var bg2 = g.createLinearGradient(0, bty, 0, bty + L.btnH);
    bg2.addColorStop(0, '#ff9a4d'); bg2.addColorStop(1, '#e0451f');
    a.rr(btx, bty, L.btnW, L.btnH, L.btnH * .5); g.fillStyle = bg2; g.fill();
    a.text(a.txt({ th: 'กดเป่าตั๋ว', en: 'BLOW' }), a.W / 2, bty + L.btnH * .52, L.btnH * .46, '#fff');
  }

  /* พัดลมด้านล่างในท่อ */
  function drawFan(g, a) {
    var d = a.data, L = d.LO;
    g.save();
    g.translate(L.fanX, L.fanY);
    g.fillStyle = 'rgba(20,14,40,.55)';
    g.beginPath(); g.arc(0, 0, L.fanR, 0, 6.29); g.fill();
    g.save(); g.rotate(d.fanSpin);
    g.fillStyle = 'rgba(190,210,255,.75)';
    for (var i = 0; i < 3; i++) {
      g.rotate(6.283 / 3);
      g.beginPath();
      g.ellipse(L.fanR * .48, 0, L.fanR * .46, L.fanR * .17, .5, 0, 6.29);
      g.fill();
    }
    g.restore();
    g.fillStyle = '#8fa2cc';
    g.beginPath(); g.arc(0, 0, L.fanR * .17, 0, 6.29); g.fill();
    /* ตะแกรงพัดลม */
    g.strokeStyle = 'rgba(255,255,255,.20)'; g.lineWidth = Math.max(1, L.fanR * .07);
    for (var r = L.fanR * .38; r < L.fanR; r += L.fanR * .26) { g.beginPath(); g.arc(0, 0, r, 0, 6.29); g.stroke(); }
    g.restore();
  }

  /* ============================================================
     107 ตู้เป่าลูกปิงปอง — ตู้แบบเดียวกับเกม 106 แต่เป็นลูกปิงปองสี
     ============================================================ */

  var BALLCOL = [
    ['#ff6a3d', '#ffb08a'], ['#ffd23f', '#fff0a8'], ['#2fe08a', '#a6f5cd'],
    ['#00b6ff', '#93e2ff'], ['#ff3b8e', '#ffa8cc'], ['#a06bff', '#d7c0ff'],
    ['#ffffff', '#ffffff'], ['#19d6c4', '#9df2ea']
  ];

  /* ลูกปิงปอง 1 ลูก */
  function drawBall(g, a, x, y, r, ci, num, rot) {
    var c = BALLCOL[ci % BALLCOL.length];
    g.save();
    g.translate(x, y);
    /* ตัวลูก */
    var rg = g.createRadialGradient(-r * .34, -r * .38, r * .10, 0, 0, r * 1.06);
    rg.addColorStop(0, '#ffffff'); rg.addColorStop(.30, c[1]); rg.addColorStop(1, c[0]);
    g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 6.29); g.fill();
    /* เงาขอบล่าง */
    g.globalAlpha = .18; g.fillStyle = '#000';
    g.beginPath(); g.arc(r * .12, r * .16, r * .92, .6, 2.6); g.fill();
    g.globalAlpha = 1;
    /* วงขาวใส่เลขแบบลูกลอตเตอรี */
    if (rot) g.rotate(rot);
    g.fillStyle = 'rgba(255,255,255,.95)';
    g.beginPath(); g.arc(0, 0, r * .56, 0, 6.29); g.fill();
    a.text(String(num), 0, 0, r * .78, '#26203a');
    /* ไฮไลต์ */
    g.globalAlpha = .55; g.fillStyle = '#fff';
    g.beginPath(); g.ellipse(-r * .36, -r * .42, r * .26, r * .16, -.6, 0, 6.29); g.fill();
    g.restore();
  }

  R('ballblower', {
    time: 0, noScore: true,
    setup: function (a) {
      var d = a.data;
      d.LO = tkLayout(a);
      d.conf = [];
      d.prz = przList(a); d.pi = 0;
      blIdle(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      stepConf(dt, a);
      d.fanSpin += dt * (d.st === 'blow' || d.st === 'grab' ? 26 : (d.st === 'idle' ? 0 : 6));
      d.t += dt;

      var blowing = (d.st === 'blow' || d.st === 'grab');
      var cx = (L.ix0 + L.ix1) / 2, halfW = (L.ix1 - L.ix0) / 2;

      d.tk.forEach(function (b) {
        if (b === d.held) return;
        if (blowing) {
          /* ลมหมุนวนแบบเดียวกับตู้ตั๋ว: ขึ้นตรงกลาง ลงริมผนัง */
          var nx = (b.x - cx) / halfW;
          var up = Math.max(0, 1 - (L.iy1 - b.y) / (L.th * .95));
          var core = 1 - Math.min(1, Math.abs(nx) / .62);
          b.vy -= a.mn * (3.1 * core - 1.0 * (1 - core)) * (.45 + .85 * up) * dt;
          var band = (b.y - L.iy0) / (L.iy1 - L.iy0);
          b.vx += (band < .45 ? Math.sign(nx || 1) : -nx * 1.6) * a.mn * 1.5 * dt;
          b.vx += a.rnd(-1, 1) * a.mn * 4.0 * dt;
          b.vy += a.rnd(-1, 1) * a.mn * 3.0 * dt;
          b.vr += a.rnd(-1, 1) * 22 * dt;
          var vmax = a.mn * 1.5;
          b.vx = Math.max(-vmax, Math.min(vmax, b.vx));
          b.vy = Math.max(-vmax, Math.min(vmax, b.vy));
        }
        b.vy += a.mn * (blowing ? 1.0 : 1.5) * dt;
        b.vx *= .994; b.vy *= .994; b.vr *= .985;
        b.x += b.vx * dt; b.y += b.vy * dt; b.rot += b.vr * dt;
      });

      /* ลูกชนกันเอง — ดันแยกออกและแลกความเร็วเล็กน้อย */
      for (var i = 0; i < d.tk.length; i++) {
        var p = d.tk[i]; if (p === d.held) continue;
        for (var j = i + 1; j < d.tk.length; j++) {
          var q = d.tk[j]; if (q === d.held) continue;
          var dx = q.x - p.x, dy = q.y - p.y, rr = p.r + q.r;
          var d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < rr * rr) {
            var dist = Math.sqrt(d2), ux = dx / dist, uy = dy / dist, ov = (rr - dist) * .5;
            p.x -= ux * ov; p.y -= uy * ov; q.x += ux * ov; q.y += uy * ov;
            var rel = (q.vx - p.vx) * ux + (q.vy - p.vy) * uy;
            if (rel < 0) {
              var imp = rel * .75;
              p.vx += ux * imp; p.vy += uy * imp;
              q.vx -= ux * imp; q.vy -= uy * imp;
              p.vr += rel * .01; q.vr -= rel * .01;
            }
          }
        }
      }

      /* ชนผนังท่อ */
      d.tk.forEach(function (b) {
        if (b === d.held) return;
        if (b.x < L.ix0 + b.r) { b.x = L.ix0 + b.r; b.vx = Math.abs(b.vx) * .72 + a.mn * .05; b.vr += 3; }
        if (b.x > L.ix1 - b.r) { b.x = L.ix1 - b.r; b.vx = -Math.abs(b.vx) * .72 - a.mn * .05; b.vr -= 3; }
        if (b.y < L.iy0 + b.r) { b.y = L.iy0 + b.r; b.vy = Math.abs(b.vy) * .70; b.vx += a.rnd(-1, 1) * a.mn * .3; }
        if (b.y > L.iy1 - b.r) {
          b.y = L.iy1 - b.r;
          b.vy = blowing ? -Math.abs(b.vy) * .60 - a.mn * .25 : -Math.abs(b.vy) * .35;
          b.vx *= .92; b.vr *= .90;
        }
      });

      if (d.st === 'blow' && d.t > 8) { d.st = 'idle'; d.t = 0; }

      /* มือล้วงหยิบลูก */
      if (d.st === 'grab') {
        var T = d.t;
        if (T < .55) {
          d.grip = 0;
          d.handY = a.H + L.holeR * 1.6 + (tkHandTop(a) - (a.H + L.holeR * 1.6)) * a.ease(T / .55);
          d.handX = L.holeX;
        } else if (T < 1.0) {
          d.grip = a.ease((T - .55) / .45);
          if (!d.held) {
            var best = null, bd = 1e9;
            d.tk.forEach(function (b) {
              var dd = (b.x - d.handX) * (b.x - d.handX) + (b.y - d.handY) * (b.y - d.handY);
              if (dd < bd) { bd = dd; best = b; }
            });
            d.held = best; d.heldPrize = d.prz[(d.pi++) % d.prz.length];
            a.beep(560, .08);
          }
        } else if (T < 1.75) {
          d.grip = 1;
          var e2 = a.ease((T - 1.0) / .75), hy = tkHandTop(a);
          d.handX = L.holeX;
          d.handY = hy + (a.H * .92 - hy) * e2;
        } else {
          d.st = 'open'; d.t = 0;
          d.openFrom = { x: d.handX, y: d.handY - L.holeR * .75 };
          a.beep(1000, .26, 'triangle'); a.shake(.012, .28); a.flash('#ffe9a8', .18);
          confetti(a, a.W / 2, a.H / 2);
        }
        if (d.held) { d.held.x = d.handX; d.held.y = d.handY - L.holeR * .75; d.held.vx = d.held.vy = 0; }
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.st === 'open') { if (d.t > .8) blIdle(a); return; }
      if (d.st === 'grab') return;
      if (d.st === 'blow') {
        var dx = x - L.holeX, dy = y - L.holeY;
        if (dx * dx + dy * dy < L.holeR * L.holeR * 2.3) { d.st = 'grab'; d.t = 0; d.grip = 0; a.beep(700, .08); return; }
      }
      var bx = a.W / 2 - L.btnW / 2, by = L.baseY + L.baseH * .26;
      if (x > bx && x < bx + L.btnW && y > by && y < by + L.btnH) {
        d.st = 'blow'; d.t = 0;
        d.tk.forEach(function (b) {
          b.vy = -a.mn * a.rnd(.8, 2.0); b.vx = a.rnd(-1, 1) * a.mn * 1.0; b.vr = a.rnd(-8, 8);
        });
        a.beep(300, .18, 'sawtooth');
      }
    },
    draw: function (g, a) {
      a.bg('#102040', '#2a6a86');
      var d = a.data, L = d.LO;

      drawBase(g, a);
      drawTubeBack(g, a);

      /* ของข้างในท่อ */
      g.save();
      a.rr(L.ix0, L.iy0, L.ix1 - L.ix0, L.iy1 - L.iy0, L.tw * .07); g.clip();
      drawFan(g, a);
      d.tk.forEach(function (b) {
        if (b === d.held && (d.st === 'grab' || d.st === 'open')) return;
        drawBall(g, a, b.x, b.y, b.r, b.col, b.num, b.rot);
      });
      g.restore();

      drawTubeGlass(g, a);
      drawHole(g, a);

      if (d.st === 'grab') {
        drawHand(g, a, d.handX, d.handY, L.holeR * 1.15, d.grip, 0);
        if (d.held) drawBall(g, a, d.held.x, d.held.y, d.held.r, d.held.col, d.held.num, d.held.rot);
      }

      /* ลูกที่ได้: ลอยเข้ากลางจอแล้วขยายใหญ่ */
      if (d.st === 'open') {
        var e = Math.min(1, d.t / .5), ee = a.ease(e);
        var br = d.held.r + (a.mn * .17 - d.held.r) * ee;
        var cx2 = d.openFrom.x + (a.W / 2 - d.openFrom.x) * ee;
        var cy2 = d.openFrom.y + (a.H * .40 - d.openFrom.y) * ee;
        drawBall(g, a, cx2, cy2, br * a.pop(Math.min(1, d.t / .55)), d.held.col, d.held.num, 0);
        if (e >= 1) {
          var pw = Math.min(a.W * .8, a.mn * .95), ph = a.mn * .2;
          a.fillRR((a.W - pw) / 2, a.H * .40 + br + a.mn * .05, pw, ph, a.mn * .03, 'rgba(8,14,30,.88)');
          var ty2 = a.H * .40 + br + a.mn * .05;
          a.text(a.txt({ th: 'คุณได้รับ', en: 'You won' }), a.W / 2, ty2 + ph * .30, a.mn * .034, 'rgba(255,255,255,.75)');
          var fs = a.mn * .056;
          g.font = '700 ' + fs + 'px Kanit,sans-serif';
          while (g.measureText(d.heldPrize).width > pw * .88 && fs > 10) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
          a.text(d.heldPrize, a.W / 2, ty2 + ph * .68, fs, a.C.accent);
          if (d.t > .8) a.text(a.txt({ th: 'แตะเพื่อเล่นอีกครั้ง', en: 'Tap to play again' }),
                               a.W / 2, ty2 + ph * 1.22, a.mn * .028, 'rgba(255,255,255,.65)');
        }
      }

      drawConf(g, a);

      if (d.st === 'idle') a.head(a.txt({ th: 'กดปุ่มให้พัดลมเป่าลูกบอล', en: 'Press the button to blow the balls' }));
      else if (d.st === 'blow') a.head(a.txt({ th: 'แตะที่ช่องกลม ล้วงมือเข้าไปคว้าลูกบอล', en: 'Tap the hole and reach in for a ball' }));
    }
  });

  function blIdle(a) {
    var d = a.data, L = d.LO;
    d.st = 'idle'; d.t = 0; d.fanSpin = 0;
    d.held = null; d.heldPrize = ''; d.grip = 0;
    d.handX = a.W * 2; d.handY = 0;
    d.tk = [];
    var r = Math.min(L.tw * .075, (L.iy1 - L.iy0) * .055);
    var nums = a.shuffle([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
                          21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]);
    for (var i = 0; i < 30; i++) {
      d.tk.push({
        x: a.rnd(L.ix0 + r * 1.1, L.ix1 - r * 1.1),
        y: a.rnd(L.iy1 - L.th * .40, L.iy1 - r * 1.1),
        vx: 0, vy: 0, r: r, rot: a.rnd(0, 6.28), vr: 0,
        col: a.rndi(0, BALLCOL.length - 1), num: nums[i]
      });
    }
  }

  /* ============================================================
     108 สลาก 3 หลัก — โหลแก้ว 3 ใบ ใส่ลูกปิงปองเลข 0-9
     หมุนที่บิดแบบตู้กาชาปองทีละโหล ได้เลขโหลละ 1 ตัว ครบ 3 โหลเป็นเลข 3 หลัก
     ============================================================ */

  function l3Layout(a) {
    var gap = a.W * .030;
    /* โหลทรงกลม ใหญ่ขึ้น 20% จากเดิม */
    var jw = Math.min((a.W * .94 - gap * 2) / 3, a.mn * .36);
    var jh = jw;                                   /* ทรงกลม กว้าง = สูง */
    var ox = (a.W - (jw * 3 + gap * 2)) / 2;
    var jy = a.H * (a.port ? .22 : .17);
    return {
      jw: jw, jh: jh, gap: gap, ox: ox, jy: jy,
      br: jw * .092,                       /* ลูกในโหล */
      knobR: jw * .15,
      trayY: jy + jh + a.mn * .17,
      trayR: jw * .19
    };
  }
  function l3Jar(a, i) {
    var L = a.data.LO;
    return { x: L.ox + i * (L.jw + L.gap), y: L.jy, w: L.jw, h: L.jh };
  }
  /* ขอบเขตวงกลมของโหล */
  function l3Circle(a, r) {
    return { cx: r.x + r.w / 2, cy: r.y + r.h / 2, R: r.w / 2 };
  }

  /* โหลแก้วทรงกลม — ส่วนที่อยู่หลังลูกบอล */
  function l3DrawJar(g, a, r) {
    var c = l3Circle(a, r);
    g.save();
    g.beginPath(); g.arc(c.cx, c.cy, c.R, 0, 6.29);
    var jg = g.createRadialGradient(c.cx - c.R * .35, c.cy - c.R * .40, c.R * .1, c.cx, c.cy, c.R);
    jg.addColorStop(0, 'rgba(255,255,255,.22)');
    jg.addColorStop(.55, 'rgba(190,225,255,.08)');
    jg.addColorStop(1, 'rgba(255,255,255,.18)');
    g.fillStyle = jg; g.fill();
    g.restore();
  }
  /* ผิวแก้ว + ประกาย วาดทับลูกบอล */
  function l3DrawGlass(g, a, r) {
    var c = l3Circle(a, r), w = Math.max(2, r.w * .040);
    /* ขอบแก้ว */
    g.lineWidth = w;
    g.strokeStyle = 'rgba(225,245,255,.62)';
    g.beginPath(); g.arc(c.cx, c.cy, c.R - w / 2, 0, 6.29); g.stroke();
    /* ประกายแสงบนผิวโค้ง */
    g.save();
    g.beginPath(); g.arc(c.cx, c.cy, c.R - w, 0, 6.29); g.clip();
    g.globalAlpha = .30; g.fillStyle = '#fff';
    g.beginPath(); g.ellipse(c.cx - c.R * .42, c.cy - c.R * .34, c.R * .16, c.R * .34, -.5, 0, 6.29); g.fill();
    g.globalAlpha = .16;
    g.beginPath(); g.ellipse(c.cx + c.R * .48, c.cy + c.R * .12, c.R * .09, c.R * .26, -.35, 0, 6.29); g.fill();
    /* เงาขอบล่างให้ดูเป็นทรงกลม */
    g.globalAlpha = .18; g.fillStyle = '#0a0820';
    g.beginPath(); g.arc(c.cx, c.cy + c.R * .12, c.R * .98, .5, 2.64); g.fill();
    g.restore();
  }

  /* ที่บิดแบบตู้กาชาปอง */
  function l3DrawKnob(g, a, cx, cy, R, rot) {
    g.save(); g.translate(cx, cy);
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.beginPath(); g.arc(0, R * .10, R * 1.05, 0, 6.29); g.fill();
    var kg = g.createLinearGradient(-R, -R, R, R);
    kg.addColorStop(0, '#f2f4fa'); kg.addColorStop(1, '#9aa4bd');
    g.fillStyle = kg; g.beginPath(); g.arc(0, 0, R, 0, 6.29); g.fill();
    g.rotate(rot);
    /* ก้านบิด */
    g.fillStyle = '#3d4560';
    a.rr(-R * .16, -R * .82, R * .32, R * 1.64, R * .16); g.fill();
    g.fillStyle = '#e0452a';
    g.beginPath(); g.arc(0, -R * .62, R * .22, 0, 6.29); g.fill();
    g.beginPath(); g.arc(0, R * .62, R * .22, 0, 6.29); g.fill();
    g.fillStyle = '#6d7793';
    g.beginPath(); g.arc(0, 0, R * .20, 0, 6.29); g.fill();
    g.restore();
  }

  R('lotto3', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.LO = l3Layout(a);
      a.data.conf = [];
      l3Reset(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      stepConf(dt, a);
      d.t += dt;

      /* ---- ลูกในโหล: แรงโน้มถ่วง + ชนกันเองไม่ให้ทับ + ตอนหมุนจะถูกคนวนเป็นวง ---- */
      d.jars.forEach(function (J, i) {
        var r = l3Jar(a, i), stir = (J.st === 'spin' || J.st === 'out');
        var C = l3Circle(a, r), cx = C.cx, cy = C.cy;
        var Rin = C.R - Math.max(2, r.w * .040) - L.br;      /* รัศมีที่ลูกวิ่งได้ในโหล */

        J.balls.forEach(function (b) {
          if (stir) {
            /* คนวนเป็นวงรอบกลางโหล เหมือนมีคนหมุนอยู่ */
            var dx = b.x - cx, dy = b.y - cy, dist = Math.sqrt(dx * dx + dy * dy) || 1;
            var f = a.mn * 6.6 * dt;
            b.vx += (-dy / dist) * f; b.vy += (dx / dist) * f;
            b.vy -= a.mn * 2.2 * dt;                       /* ยกลูกให้ลอยคลุกกันทั้งโหล */
            b.vx += a.rnd(-1, 1) * a.mn * 1.1 * dt;
            b.vy += a.rnd(-1, 1) * a.mn * .8 * dt;
          }
          b.vy += a.mn * 2.1 * dt;                         /* แรงโน้มถ่วง */
          b.vx *= .992; b.vy *= .992;
          var vmax = a.mn * (stir ? 1.3 : .9);
          b.vx = Math.max(-vmax, Math.min(vmax, b.vx));
          b.vy = Math.max(-vmax, Math.min(vmax, b.vy));
          b.x += b.vx * dt; b.y += b.vy * dt;
        });

        /* ดันลูกที่ทับกันให้แยกออกจากกัน */
        for (var pass = 0; pass < 2; pass++) {
          for (var p = 0; p < J.balls.length; p++) {
            for (var q = p + 1; q < J.balls.length; q++) {
              var A = J.balls[p], B = J.balls[q];
              var ddx = B.x - A.x, ddy = B.y - A.y, rr = L.br * 2;
              var d2 = ddx * ddx + ddy * ddy;
              if (d2 < 1e-4) { B.x += L.br * .4; continue; }
              if (d2 < rr * rr) {
                var dd = Math.sqrt(d2), ux = ddx / dd, uy = ddy / dd, ov = (rr - dd) * .5;
                A.x -= ux * ov; A.y -= uy * ov; B.x += ux * ov; B.y += uy * ov;
                var rel = (B.vx - A.vx) * ux + (B.vy - A.vy) * uy;
                if (rel < 0) {
                  var imp = rel * .6;
                  A.vx += ux * imp; A.vy += uy * imp;
                  B.vx -= ux * imp; B.vy -= uy * imp;
                }
              }
            }
          }
          /* ชนผนังโหลทรงกลม — ดันกลับเข้ามาตามแนวรัศมี */
          J.balls.forEach(function (b) {
            var ex = b.x - cx, ey = b.y - cy, ed = Math.sqrt(ex * ex + ey * ey);
            if (ed > Rin) {
              var nx = ex / (ed || 1), ny = ey / (ed || 1);
              b.x = cx + nx * Rin; b.y = cy + ny * Rin;
              var vn = b.vx * nx + b.vy * ny;
              if (vn > 0) {                       /* สะท้อนเฉพาะส่วนที่พุ่งออกนอก */
                b.vx -= nx * vn * 1.38; b.vy -= ny * vn * 1.38;
                b.vx *= .92; b.vy *= .92;
              }
            }
          });
        }
      });

      d.jars.forEach(function (J, i) {
        if (J.st === 'spin') {
          J.t += dt;
          J.knob += dt * 9.5;
          if (J.t > .85) {
            J.st = 'out'; J.t = 0;
            /* ดึงลูกออกมา 1 ลูก แล้วปล่อยให้ตกลงถาด */
            J.pick = J.balls.splice(a.rndi(0, J.balls.length - 1), 1)[0];
            J.oy = l3Jar(a, i).y + l3Jar(a, i).h; J.ov = 0;
            a.beep(760, .1);
          }
        } else if (J.st === 'out') {
          /* ลูกตกลงถาด เด้ง 2-3 ที ประมาณ 1 วินาที ยังไม่โชว์เลข */
          J.t += dt; J.knob += dt * 3.2;
          J.ov += a.mn * 3.6 * dt;
          J.oy += J.ov * dt;
          if (J.oy >= L.trayY) {
            J.oy = L.trayY;
            if (Math.abs(J.ov) > a.mn * .22) { J.ov = -Math.abs(J.ov) * .45; a.beep(380, .05); }
            else J.ov = 0;
          }
          if (J.t > 1.0) {
            /* ตกนิ่งแล้ว โชว์เลขเลย */
            J.st = 'done'; J.t = 0;
            a.beep(980, .16, 'triangle');
            d.left--;
            if (d.left <= 0) { d.st = 'result'; d.t = 0; l3Prize(a); a.shake(.014, .32); a.flash('#ffe9a8', .2); confetti(a, a.W / 2, a.H / 2); }
          }
        }
      });
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.st === 'result') { if (d.t > .9) l3Reset(a); return; }
      for (var i = 0; i < 3; i++) {
        var J = d.jars[i]; if (J.st !== 'idle') continue;
        var r = l3Jar(a, i), kx = r.x + r.w / 2, ky = r.y + r.h + L.knobR * 1.25;
        if ((x - kx) * (x - kx) + (y - ky) * (y - ky) < L.knobR * L.knobR * 2.6) {
          J.st = 'spin'; J.t = 0; a.beep(300, .14, 'sawtooth');
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#131a46', '#3a2470');
      var d = a.data, L = d.LO;

      for (var i = 0; i < 3; i++) {
        var J = d.jars[i], r = l3Jar(a, i);
        l3DrawJar(g, a, r);

        /* ลูกในโหล */
        g.save(); a.rr(r.x, r.y, r.w, r.h, r.w * .16); g.clip();
        /* ในโหลไม่โชว์เลข ไปเห็นตอนลูกไหลออกมาแล้ว */
        J.balls.forEach(function (b) { l3Ball(g, a, b.x, b.y, L.br, null, 1); });
        g.restore();

        l3DrawGlass(g, a, r);

        /* คอโหล + ที่บิด */
        var kx = r.x + r.w / 2, ky = r.y + r.h + L.knobR * 1.25;
        a.fillRR(r.x + r.w * .30, r.y + r.h - r.w * .02, r.w * .40, L.knobR * 1.3, r.w * .07, '#2e2750');
        l3DrawKnob(g, a, kx, ky, L.knobR, J.knob);

        /* ถาดรอง */
        var ty = L.trayY;
        l3DrawTray(g, a, kx, ty, L.trayR);

        /* ลูกที่ออกมา */
        if (J.st === 'out' || J.st === 'done') {
          var by = ty, br2 = L.trayR, showN = true;
          if (J.st === 'out') {
            by = J.oy;
            br2 = L.br + (L.trayR - L.br) * Math.min(1, J.t / .28);
            showN = false;                                  /* ยังไม่เห็นเลขระหว่างตก */
          } else {
            br2 = L.trayR * (1 + .05 * Math.sin(a.now * 3 + i));
          }
          l3Ball(g, a, kx, by, br2, showN ? J.pick.n : null, 1);
        } else {
          a.text('?', kx, ty, L.trayR * 1.1, 'rgba(255,255,255,.28)');
        }
      }

      drawConf(g, a);

      if (d.st === 'result') {
        var pw = Math.min(a.W * .84, a.mn * 1.0), ph = a.mn * .30;
        var py = a.H - ph - a.mn * .05;
        a.fillRR((a.W - pw) / 2, py, pw, ph, a.mn * .034, 'rgba(8,6,26,.90)');
        a.text(d.jars.map(function (J) { return J.pick.n; }).join('  '),
               a.W / 2, py + ph * .32, a.mn * .088, a.C.accent);
        var fs = a.mn * .050;
        g.font = '700 ' + fs + 'px Kanit,sans-serif';
        while (g.measureText(d.prize).width > pw * .88 && fs > 10) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
        a.text(d.prize, a.W / 2, py + ph * .66, fs, '#fff');
        if (d.t > .9) a.text(a.txt({ th: 'แตะเพื่อออกสลากใหม่', en: 'Tap for a new draw' }),
                             a.W / 2, py + ph * .88, a.mn * .028, 'rgba(255,255,255,.6)');
      } else {
        a.head(a.txt({ th: 'หมุนที่บิดให้ครบทั้ง 3 โหล ลุ้นเลข 3 หลัก',
                       en: 'Crank all three jars for your 3-digit number' }));
      }
    }
  });

  /* ถาดรองลูกบอล — ถาดเปิดด้านบน มีแอ่งตรงกลาง */
  function l3DrawTray(g, a, cx, cy, R) {
    var w = R * 3.0, h = R * 1.45, x = cx - w / 2, y = cy - R * .30;
    /* ขาถาด */
    a.fillRR(cx - w * .18, y - R * .30, w * .36, R * .55, R * .10, 'rgba(20,16,46,.75)');
    /* ตัวถาด */
    a.shadow(true);
    a.fillRR(x, y, w, h, R * .34, '#3a3060');
    a.shadow(false);
    /* แอ่งด้านใน */
    g.save();
    a.rr(x + R * .16, y + R * .13, w - R * .32, h - R * .30, R * .28); g.clip();
    var ig = g.createLinearGradient(0, y, 0, y + h);
    ig.addColorStop(0, '#1b1636'); ig.addColorStop(1, '#2a2350');
    g.fillStyle = ig; g.fillRect(x, y, w, h);
    /* แอ่งโค้งรับลูก */
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.beginPath(); g.ellipse(cx, cy + R * .16, R * 1.15, R * .46, 0, 0, 6.29); g.fill();
    g.restore();
    /* ขอบถาดด้านหน้า */
    a.fillRR(x, y + h - R * .26, w, R * .30, R * .14, 'rgba(255,255,255,.13)');
  }

  /* ลูกปิงปองขาวมีเลข */
  function l3Ball(g, a, x, y, r, n, al) {
    g.save(); g.globalAlpha = al === undefined ? 1 : al;
    var rg = g.createRadialGradient(x - r * .34, y - r * .38, r * .10, x, y, r * 1.05);
    rg.addColorStop(0, '#ffffff'); rg.addColorStop(.55, '#f6f7fb'); rg.addColorStop(1, '#c9cfdd');
    g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 6.29); g.fill();
    g.strokeStyle = 'rgba(90,100,130,.35)'; g.lineWidth = Math.max(1, r * .06);
    g.beginPath(); g.arc(x, y, r * .97, 0, 6.29); g.stroke();
    if (n !== null && n !== undefined) a.text(String(n), x, y, r * 1.05, '#20223a');
    g.globalAlpha = (al === undefined ? 1 : al) * .6; g.fillStyle = '#fff';
    g.beginPath(); g.ellipse(x - r * .34, y - r * .40, r * .24, r * .15, -.6, 0, 6.29); g.fill();
    g.restore();
  }

  function l3Reset(a) {
    var d = a.data, L = d.LO;
    d.st = 'play'; d.t = 0; d.left = 3; d.prize = '';
    d.jars = [];
    for (var i = 0; i < 3; i++) {
      var r = l3Jar(a, i), balls = [];
      /* โปรยไว้ครึ่งบนของโหล แล้วปล่อยให้ตกลงกองที่ก้นโหลเองด้วยแรงโน้มถ่วง */
      var C0 = l3Circle(a, r);
      for (var n = 0; n <= 9; n++) {
        var ang = a.rnd(0, 6.28), rad0 = a.rnd(0, C0.R * .55);
        balls.push({
          n: n,
          x: C0.cx + Math.cos(ang) * rad0,
          y: C0.cy + Math.sin(ang) * rad0 * .7 - C0.R * .10,
          vx: 0, vy: 0
        });
      }
      d.jars.push({ st: 'idle', t: 0, knob: 0, balls: a.shuffle(balls), pick: null });
    }
  }

  /* รางวัลตามหน้าตาของเลข 3 หลัก */
  function l3Prize(a) {
    var d = a.data, n = d.jars.map(function (J) { return J.pick.n; });
    var s = n.slice().sort(function (p, q) { return p - q; });
    var trip = n[0] === n[1] && n[1] === n[2];
    var pair = n[0] === n[1] || n[1] === n[2] || n[0] === n[2];
    var run = (s[1] === s[0] + 1 && s[2] === s[1] + 1);
    var th = trip ? '🏆 เลขตอง! รับรางวัลใหญ่'
           : run ? '🎁 เลขเรียง! รับรางวัลที่ 2'
           : pair ? '☕ เลขเบิ้ล! รับรางวัลที่ 3'
           : '🎫 รางวัลปลอบใจ';
    var en = trip ? '🏆 Triple! Grand prize'
           : run ? '🎁 Straight! Second prize'
           : pair ? '☕ Pair! Third prize'
           : '🎫 Consolation prize';
    d.prize = a.lang === 'en' ? en : th;
  }


  /* ============================================================
     109 เปิดซองการ์ด — เลือกซอง 10 ซอง ลากนิ้วฉีกปากซอง แล้วดูการ์ดที่ได้
     ============================================================ */

  var PKCOL = [
    ['#ff3b6b', '#ffa36b'], ['#ff9f1c', '#ffe07a'], ['#2fd08a', '#9ff0c8'],
    ['#00b6ff', '#8fe4ff'], ['#7b5cff', '#c9a8ff'], ['#ff2e88', '#ff9ccb'],
    ['#19c9b5', '#8ff0e6'], ['#f25c2a', '#ffb08a'], ['#3f7bff', '#9dc0ff'],
    ['#c44bff', '#e9b3ff']
  ];
  var SEGN = 26;                                  /* จำนวนช่องตามรอยฉีก */

  function pkLayout(a) {
    var cols = 5, rows = 2;
    var gap = a.mn * .022;
    var pw = Math.min((a.W * .92 - gap * (cols - 1)) / cols, a.mn * .21);
    var ph = pw * 1.45;
    var top = a.H * (a.port ? .18 : .17);
    var gw = pw * cols + gap * (cols - 1), gh = ph * rows + gap * 1.6;
    var ox = (a.W - gw) / 2, oy = top + Math.max(0, (a.H - top - gh - a.mn * .06) / 2);
    /* ซองใบใหญ่ตอนเปิด */
    var bh = Math.min(a.H * .70, a.mn * .86), bw = bh / 1.45;
    return {
      pw: pw, ph: ph, gap: gap, ox: ox, oy: oy, cols: cols,
      big: { x: (a.W - bw) / 2, y: a.H * .5 - bh * .52, w: bw, h: bh }
    };
  }
  function pkCell(a, i) {
    var L = a.data.LO;
    return {
      x: L.ox + (i % L.cols) * (L.pw + L.gap),
      y: L.oy + Math.floor(i / L.cols) * (L.ph + L.gap * 1.6),
      w: L.pw, h: L.ph
    };
  }

  /* ซองฟอยล์ 1 ซอง  cut = ความคืบหน้าการฉีก 0-1  lift = ยกแถบบนออก 0-1 */
  function pkDrawPack(g, a, r, ci, dim, cut, lift) {
    var col = PKCOL[ci % PKCOL.length], rad = r.w * .07;
    var lineY = r.y + r.h * .155;                 /* แนวรอยฉีก */
    g.save();
    if (dim !== undefined) g.globalAlpha = dim;

    /* ตัวซอง (ส่วนล่างรอยฉีก) */
    a.shadow(true);
    a.rr(r.x, lineY - rad, r.w, r.h - (lineY - r.y) + rad, rad);
    var bgd = g.createLinearGradient(r.x, lineY, r.x + r.w, r.y + r.h);
    bgd.addColorStop(0, col[0]); bgd.addColorStop(.55, col[1]); bgd.addColorStop(1, col[0]);
    g.fillStyle = bgd; g.fill();
    a.shadow(false);

    /* ลายบนซอง */
    g.save(); a.rr(r.x, lineY - rad, r.w, r.h - (lineY - r.y) + rad, rad); g.clip();
    g.globalAlpha = (dim === undefined ? 1 : dim) * .22; g.fillStyle = '#fff';
    for (var k = -2; k < 7; k++) {
      g.save(); g.translate(r.x + k * r.w * .34, r.y); g.rotate(-.35);
      g.fillRect(0, 0, r.w * .10, r.h * 1.8); g.restore();
    }
    g.globalAlpha = dim === undefined ? 1 : dim;
    /* แถบป้ายกลางซอง */
    a.fillRR(r.x + r.w * .10, r.y + r.h * .40, r.w * .80, r.h * .26, r.w * .06, 'rgba(255,255,255,.92)');
    a.text('★', r.x + r.w / 2, r.y + r.h * .53, r.h * .17, col[0]);
    a.text(a.txt({ th: 'การ์ดสะสม', en: 'CARD PACK' }), r.x + r.w / 2, r.y + r.h * .74, r.h * .085, 'rgba(255,255,255,.95)');
    g.restore();

    /* แถบบนของซอง (ส่วนที่ถูกฉีกออก) */
    if (lift < 1) {
      g.save();
      var ang = lift * .55, dy = -lift * r.h * .55, dx = lift * r.w * .45;
      g.globalAlpha = (dim === undefined ? 1 : dim) * (1 - lift * .85);
      g.translate(r.x + r.w / 2 + dx, lineY + dy); g.rotate(ang); g.translate(-(r.x + r.w / 2), -lineY);
      a.rr(r.x, r.y, r.w, lineY - r.y, rad);
      var tgd = g.createLinearGradient(r.x, r.y, r.x + r.w, lineY);
      tgd.addColorStop(0, col[1]); tgd.addColorStop(1, col[0]);
      g.fillStyle = tgd; g.fill();
      g.restore();
    }

    /* รอยประให้ฉีก + ความคืบหน้า */
    if (cut !== undefined && lift < 1) {
      var x0 = r.x + r.w * .06, x1 = r.x + r.w * .94;
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(1.5, r.h * .012);
      g.setLineDash([r.w * .05, r.w * .04]);
      g.beginPath(); g.moveTo(x0, lineY); g.lineTo(x1, lineY); g.stroke();
      g.setLineDash([]);
      if (cut > 0) {
        g.strokeStyle = '#fff'; g.lineWidth = Math.max(2, r.h * .016);
        g.beginPath(); g.moveTo(x0, lineY); g.lineTo(x0 + (x1 - x0) * cut, lineY); g.stroke();
      }
    }
    g.restore();
  }

  /* ---- การ์ดที่ได้ ---- */
  /* rare: 0 = ไม่ได้รางวัล, 1 = รางวัลธรรมดา (การ์ตูน), 2 = รางวัลพิเศษ (รถ + การ์ดทอง) */
  function pkDrawCard(g, a, cx, cy, w, rare, prize, t) {
    var h = w * 1.40, x = cx - w / 2, y = cy - h / 2, rad = w * .07;
    g.save();
    a.shadow(true);
    a.rr(x, y, w, h, rad);
    if (rare === 2) {
      var gd = g.createLinearGradient(x, y, x + w, y + h);
      gd.addColorStop(0, '#ffe89a'); gd.addColorStop(.35, '#ffc93c');
      gd.addColorStop(.6, '#fff4c8'); gd.addColorStop(1, '#e0a013');
      g.fillStyle = gd;
    } else if (rare === 1) {
      var gd1 = g.createLinearGradient(x, y, x + w, y + h);
      gd1.addColorStop(0, '#8fd8ff'); gd1.addColorStop(1, '#4f7bff');
      g.fillStyle = gd1;
    } else {
      g.fillStyle = '#6f7590';
    }
    g.fill();
    a.shadow(false);

    /* กรอบใน */
    a.fillRR(x + w * .055, y + h * .045, w * .89, h * .91, rad * .7, 'rgba(255,255,255,.92)');
    var ix = x + w * .085, iy = y + h * .085, iw = w * .83, ih = h * .55;
    a.fillRR(ix, iy, iw, ih, rad * .6, rare === 2 ? '#2a1d05' : (rare === 1 ? '#123a63' : '#3b3f52'));

    /* ภาพในกรอบ */
    if (rare === 2) pkDrawCar(g, a, ix + iw / 2, iy + ih * .56, iw * .78);
    else if (rare === 1) pkDrawMascot(g, a, ix + iw / 2, iy + ih * .54, ih * .72);
    else pkDrawSad(g, a, ix + iw / 2, iy + ih * .52, ih * .55);

    /* ข้อความ */
    var ty = y + h * .70;
    a.text(rare === 2 ? a.txt({ th: 'รางวัลพิเศษ', en: 'SPECIAL PRIZE' })
         : rare === 1 ? a.txt({ th: 'ยินดีด้วย', en: 'CONGRATS' })
         : a.txt({ th: 'เสียใจด้วย', en: 'NO LUCK' }),
      cx, ty, h * .055, rare === 2 ? '#a9761a' : (rare === 1 ? '#2a5aa0' : '#6b7085'));
    var fs = h * .075;
    g.font = '700 ' + fs + 'px Kanit,sans-serif';
    while (g.measureText(prize).width > w * .80 && fs > 8) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
    a.text(prize, cx, ty + h * .095, fs, '#23203a');

    /* การ์ดทองมีแสงกวาด + ประกาย */
    if (rare === 2) {
      g.save(); a.rr(x, y, w, h, rad); g.clip();
      var sw = w * .40, sx = x - sw + ((t * .45) % 1.6) * (w + sw * 2);
      var sg = g.createLinearGradient(sx, y, sx + sw, y + h);
      sg.addColorStop(0, 'rgba(255,255,255,0)');
      sg.addColorStop(.5, 'rgba(255,255,255,.75)');
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = sg; g.fillRect(sx, y, sw, h);
      g.restore();
      for (var s = 0; s < 6; s++) {
        var ang = t * 1.4 + s * 1.05;
        var px = cx + Math.cos(ang) * w * .55, py = cy + Math.sin(ang * .8) * h * .44;
        sparkle(g, px, py, w * (.035 + .02 * Math.abs(Math.sin(t * 3 + s))), '#fff6c9', .85, ang);
      }
    }
    g.restore();
  }

  /* ตัวการ์ตูนบนการ์ดรางวัลธรรมดา (ออกแบบเอง) */
  function pkDrawMascot(g, a, cx, cy, s) {
    g.save();
    /* หู */
    g.fillStyle = '#ffd23f';
    g.beginPath(); g.moveTo(cx - s * .30, cy - s * .28); g.lineTo(cx - s * .46, cy - s * .62); g.lineTo(cx - s * .10, cy - s * .44); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx + s * .30, cy - s * .28); g.lineTo(cx + s * .46, cy - s * .62); g.lineTo(cx + s * .10, cy - s * .44); g.closePath(); g.fill();
    /* ตัว */
    var bg2 = g.createRadialGradient(cx - s * .15, cy - s * .18, s * .06, cx, cy, s * .52);
    bg2.addColorStop(0, '#fff3a8'); bg2.addColorStop(1, '#ffc21e');
    g.fillStyle = bg2; g.beginPath(); g.arc(cx, cy, s * .42, 0, 6.29); g.fill();
    /* แก้ม */
    g.fillStyle = '#ff7a9c';
    g.beginPath(); g.arc(cx - s * .27, cy + s * .10, s * .08, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + s * .27, cy + s * .10, s * .08, 0, 6.29); g.fill();
    /* ตา */
    g.fillStyle = '#24203a';
    g.beginPath(); g.arc(cx - s * .13, cy - s * .05, s * .065, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + s * .13, cy - s * .05, s * .065, 0, 6.29); g.fill();
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(cx - s * .11, cy - s * .08, s * .022, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + s * .15, cy - s * .08, s * .022, 0, 6.29); g.fill();
    /* ปาก */
    g.strokeStyle = '#24203a'; g.lineWidth = Math.max(1.5, s * .022); g.lineCap = 'round';
    g.beginPath(); g.arc(cx, cy + s * .06, s * .10, .3, 2.84); g.stroke();
    g.restore();
  }

  /* รถบนการ์ดรางวัลพิเศษ */
  function pkDrawCar(g, a, cx, cy, w) {
    var h = w * .46;
    g.save();
    /* ตัวรถ */
    g.fillStyle = '#e8362f';
    a.rr(cx - w / 2, cy - h * .10, w, h * .52, h * .22); g.fill();
    /* หลังคา */
    g.beginPath();
    g.moveTo(cx - w * .28, cy - h * .08);
    g.quadraticCurveTo(cx - w * .18, cy - h * .56, cx + w * .02, cy - h * .56);
    g.quadraticCurveTo(cx + w * .24, cy - h * .54, cx + w * .30, cy - h * .08);
    g.closePath(); g.fillStyle = '#f04a3d'; g.fill();
    /* กระจก */
    g.fillStyle = '#bfe9ff';
    g.beginPath();
    g.moveTo(cx - w * .22, cy - h * .12);
    g.quadraticCurveTo(cx - w * .14, cy - h * .46, cx + w * .00, cy - h * .46);
    g.lineTo(cx + w * .00, cy - h * .12); g.closePath(); g.fill();
    g.beginPath();
    g.moveTo(cx + w * .04, cy - h * .46);
    g.quadraticCurveTo(cx + w * .18, cy - h * .44, cx + w * .24, cy - h * .12);
    g.lineTo(cx + w * .04, cy - h * .12); g.closePath(); g.fill();
    /* ไฟหน้า */
    g.fillStyle = '#fff3b0';
    g.beginPath(); g.ellipse(cx + w * .47, cy + h * .04, w * .035, h * .09, 0, 0, 6.29); g.fill();
    /* ล้อ */
    [-w * .28, w * .29].forEach(function (ox) {
      g.fillStyle = '#22212c';
      g.beginPath(); g.arc(cx + ox, cy + h * .42, h * .24, 0, 6.29); g.fill();
      g.fillStyle = '#c9ced8';
      g.beginPath(); g.arc(cx + ox, cy + h * .42, h * .11, 0, 6.29); g.fill();
    });
    g.restore();
  }

  /* หน้าเศร้าบนการ์ดที่ไม่ได้รางวัล */
  function pkDrawSad(g, a, cx, cy, s) {
    g.save();
    g.fillStyle = '#aeb3c4';
    g.beginPath(); g.arc(cx, cy, s * .48, 0, 6.29); g.fill();
    g.fillStyle = '#4a4f63';
    g.beginPath(); g.arc(cx - s * .16, cy - s * .08, s * .07, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + s * .16, cy - s * .08, s * .07, 0, 6.29); g.fill();
    g.strokeStyle = '#4a4f63'; g.lineWidth = Math.max(1.5, s * .05); g.lineCap = 'round';
    g.beginPath(); g.arc(cx, cy + s * .34, s * .17, 3.6, 5.8); g.stroke();
    g.restore();
  }

  R('cardpack', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.LO = pkLayout(a);
      a.data.conf = [];
      pkReset(a);
    },
    update: function (dt, a) {
      var d = a.data;
      stepConf(dt, a);
      d.t += dt;
      if (d.st === 'zoom' && d.t >= .32) { d.st = 'tear'; d.t = 0; }
      if (d.st === 'rip') {
        d.lift = Math.min(1, d.t / .45);
        if (d.t >= .45) { d.st = 'card'; d.t = 0; }
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.st === 'pick') {
        for (var i = 0; i < 10; i++) {
          if (d.used[i]) continue;
          var c = pkCell(a, i);
          if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) {
            d.sel = i; d.st = 'zoom'; d.t = 0; pkClearSeg(a); a.beep(660, .09);
            return;
          }
        }
        return;
      }
      if (d.st === 'tear') { pkCut(x, y, a); return; }
      if (d.st === 'card' && d.t > 1.75) {
        d.used[d.sel] = true;
        if (d.used.every(function (u) { return u; })) pkReset(a);
        else { d.st = 'pick'; d.sel = -1; d.t = 0; }
      }
    },
    move: function (x, y, a) { if (a.pointer.down && a.data.st === 'tear') pkCut(x, y, a); },
    draw: function (g, a) {
      a.bg('#161038', '#4a1f6e');
      var d = a.data, L = d.LO;

      /* ---- แผงซอง ---- */
      for (var i = 0; i < 10; i++) {
        if (d.sel === i && d.st !== 'pick') continue;
        var c = pkCell(a, i);
        pkDrawPack(g, a, c, i, d.used[i] ? .30 : 1, undefined, 0);
        if (d.used[i]) a.text('✓', c.x + c.w / 2, c.y + c.h / 2, c.h * .30, 'rgba(255,255,255,.8)');
      }

      if (d.st === 'pick') {
        a.head(a.txt({ th: 'เลือกซองการ์ด 1 ซอง', en: 'Pick one card pack' }));
        drawConf(g, a);
        return;
      }

      /* ฉากหลังมืดลง */
      var e = d.st === 'zoom' ? a.ease(Math.min(1, d.t / .32)) : 1;
      g.save(); g.globalAlpha = .6 * e; g.fillStyle = '#000'; g.fillRect(0, 0, a.W, a.H); g.restore();

      /* ---- ซองใบใหญ่ ---- */
      var from = pkCell(a, d.sel), to = L.big;
      var r = {
        x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e,
        w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e
      };
      /* ซองค่อย ๆ จางหายหลังการ์ดลอยพ้นปากซองแล้ว */
      if (d.st !== 'card' || d.t < .95) {
        g.save();
        if (d.st === 'card' && d.t > .55) g.globalAlpha = 1 - (d.t - .55) / .40;
        pkDrawPack(g, a, r, d.sel, 1, d.st === 'tear' ? pkProgress(a) : 1, d.lift);
        g.restore();
      }

      /* ---- การ์ด ---- */
      if (d.st === 'card') {
        /* 3 ช่วง: ลอยขึ้นพ้นปากซอง → เลื่อนลงมากลางจอ → พลิกเปิดหน้า */
        var ch = Math.min(a.H * .60, a.mn * .72), cw = ch / 1.40;
        var yIn = r.y + r.h * .42;                             /* อยู่ในซอง */
        var yUp = Math.max(ch * .52 + a.mn * .03, r.y - ch * .12);   /* ลอยพ้นปากซอง */
        var yMid = Math.max(ch * .52 + a.mn * .04, a.H * .46);       /* กลางจอ */
        var cy, sx = 1, face = 0, sc = 1;
        if (d.t < .55) {                                        /* ลอยออกจากซอง */
          var e1 = a.ease(d.t / .55);
          cy = yIn + (yUp - yIn) * e1;
          sc = .78 + .22 * e1;
        } else if (d.t < 1.05) {                                /* ลอยลงมากลางจอ */
          var e2 = a.ease((d.t - .55) / .50);
          cy = yUp + (yMid - yUp) * e2;
        } else {                                                /* พลิกเปิด */
          cy = yMid;
          var f = Math.min(1, (d.t - 1.05) / .42);
          var ang = Math.PI * f;
          sx = Math.max(.05, Math.abs(Math.cos(ang)));
          face = Math.cos(ang) < 0 ? 1 : 0;
        }
        g.save();
        g.translate(a.W / 2, cy); g.scale(sx * sc, sc); g.translate(-a.W / 2, -cy);
        if (face) pkDrawCard(g, a, a.W / 2, cy, cw, d.rare, d.prize, a.now);
        else pkDrawBack(g, a, a.W / 2, cy, cw);
        g.restore();
        if (d.t > 1.75) a.text(a.txt({ th: 'แตะเพื่อเลือกซองต่อไป', en: 'Tap to pick another pack' }),
                               a.W / 2, a.H - a.mn * .05, a.mn * .032, 'rgba(255,255,255,.8)');
      } else if (d.st === 'tear') {
        a.text(a.txt({ th: '✂ ลากนิ้วตัดตามรอยประด้านบนซอง', en: '✂ Drag along the dashed line to tear it open' }),
               a.W / 2, r.y + r.h + a.mn * .06, a.mn * .034, 'rgba(255,255,255,.9)');
      }

      drawConf(g, a);
    }
  });

  /* หลังการ์ด */
  function pkDrawBack(g, a, cx, cy, w) {
    var h = w * 1.40, x = cx - w / 2, y = cy - h / 2, rad = w * .07;
    a.shadow(true);
    a.rr(x, y, w, h, rad);
    var gd = g.createLinearGradient(x, y, x + w, y + h);
    gd.addColorStop(0, '#3b2f7a'); gd.addColorStop(1, '#1d1640');
    g.fillStyle = gd; g.fill();
    a.shadow(false);
    a.fillRR(x + w * .07, y + h * .05, w * .86, h * .90, rad * .7, 'rgba(255,255,255,.10)');
    a.text('★', cx, cy, h * .26, 'rgba(255,255,255,.55)');
  }

  function pkProgress(a) {
    var s = a.data.seg, n = 0;
    for (var i = 0; i < s.length; i++) if (s[i]) n++;
    return n / s.length;
  }
  /* ลากนิ้วตัดตามรอยประ */
  function pkCut(x, y, a) {
    var d = a.data, r = d.LO.big;
    var lineY = r.y + r.h * .155, band = r.h * .085;
    if (Math.abs(y - lineY) > band) { d.lastSeg = -1; return; }
    var x0 = r.x + r.w * .06, x1 = r.x + r.w * .94;
    var idx = Math.floor((x - x0) / (x1 - x0) * SEGN);
    if (idx < 0 || idx >= SEGN) { d.lastSeg = -1; return; }
    if (d.lastSeg >= 0) {                       /* เติมช่องที่ลากผ่านเร็ว ๆ ด้วย */
      var lo = Math.min(d.lastSeg, idx), hi = Math.max(d.lastSeg, idx);
      for (var k = lo; k <= hi; k++) d.seg[k] = true;
    } else d.seg[idx] = true;
    d.lastSeg = idx;
    if (pkProgress(a) > .85) {
      d.st = 'rip'; d.t = 0; d.lift = 0;
      a.beep(240, .22, 'sawtooth'); a.shake(.010, .25);
      /* สุ่มระดับรางวัล: 20% ไม่ได้ 65% ธรรมดา 15% พิเศษ */
      var rr = Math.random();
      d.rare = rr < .20 ? 0 : (rr < .85 ? 1 : 2);
      var thP = ['🎁 ของแถม 1 ชิ้น', '☕ กาแฟฟรี 1 แก้ว', '🎫 คูปองส่วนลด 50%', '🧢 หมวกแบรนด์', '🛍️ ถุงผ้า'];
      var enP = ['🎁 Free gift', '☕ Free coffee', '🎫 50% coupon', '🧢 Brand cap', '🛍️ Tote bag'];
      var thS = ['🚗 รถยนต์ 1 คัน', '🏆 รางวัลใหญ่ประจำงาน', '✈️ ตั๋วเครื่องบิน'];
      var enS = ['🚗 A brand-new car', '🏆 Grand prize', '✈️ Flight tickets'];
      d.prize = d.rare === 0 ? a.txt({ th: 'ไม่ได้รางวัล', en: 'Not a winner' })
              : d.rare === 1 ? a.pick(a.lang === 'en' ? enP : thP)
              : a.pick(a.lang === 'en' ? enS : thS);
      if (d.rare === 2) { a.flash('#ffe9a8', .3); confetti(a, a.W / 2, a.H / 2); }
    }
  }

  function pkReset(a) {
    var d = a.data;
    d.st = 'pick'; d.sel = -1; d.t = 0; d.lift = 0; d.lastSeg = -1;
    d.used = [false, false, false, false, false, false, false, false, false, false];
    d.seg = []; for (var i = 0; i < SEGN; i++) d.seg.push(false);
    d.rare = 0; d.prize = '';
  }
  /* เริ่มฉีกซองใหม่ทุกครั้งที่เลือกซอง */
  function pkClearSeg(a) {
    var d = a.data; d.seg = []; for (var i = 0; i < SEGN; i++) d.seg.push(false);
    d.lastSeg = -1; d.lift = 0;
  }


  /* ============================================================
     110 ต้นไม้ของขวัญ — กล่องของขวัญแขวนใต้กิ่ง แกว่งตามลม
     แต่ละกล่องอยู่ 1-4 วินาที แล้วหดเชือกกลับขึ้นไป ปล่อยกล่องใหม่ลงมาแทน
     ============================================================ */

  var TREE_G = ['#1e6b32', '#2a8a3f', '#37a84c', '#46c25a'];   /* เฉดใบไม้ */

  function trLayout(a) {
    var groundY = a.H * .93;
    var cx = a.W / 2;
    var canRX = Math.min(a.W * .46, a.mn * .62);
    var canRY = canRX * (a.port ? .62 : .52);
    var canY = a.H * (a.port ? .30 : .29);
    return {
      groundY: groundY, cx: cx, canRX: canRX, canRY: canRY, canY: canY,
      trunkW: a.mn * .075, trunkTop: canY + canRY * .35,
      boxS: Math.min(a.mn * .075, canRX * .12)
    };
  }

  /* พุ่มใบไม้: ก้อนใบวางซ้อนกันหลายก้อน แต่ละก้อนไหวคนละจังหวะ */
  function trMakeLeaves(a) {
    var L = a.data.LO, out = [];
    var N = 34;
    for (var i = 0; i < N; i++) {
      var ang = a.rnd(0, 6.28), rad = Math.sqrt(a.rnd(0, 1));
      out.push({
        x: L.cx + Math.cos(ang) * L.canRX * rad * .88,
        y: L.canY + Math.sin(ang) * L.canRY * rad * .88,
        r: L.canRX * a.rnd(.20, .34),
        c: a.pick(TREE_G),
        ph: a.rnd(0, 6.28), sp: a.rnd(.5, 1.3), amp: L.canRX * a.rnd(.006, .020)
      });
    }
    /* ก้อนใหญ่วาดก่อน ก้อนเล็กทับทีหลัง */
    out.sort(function (p, q) { return q.r - p.r; });
    return out;
  }

  /* จุดแขวนกล่อง — อยู่ในพุ่มใบไม้ (แขวนจากกิ่งด้านในพุ่ม) */
  function trAnchors(a) {
    var L = a.data.LO, n = 9, out = [];
    for (var i = 0; i < n; i++) {
      var f = (i - (n - 1) / 2) / ((n - 1) / 2);            /* -1 .. 1 */
      out.push({
        x: L.cx + f * L.canRX * .78 + a.rnd(-L.canRX * .05, L.canRX * .05),
        /* ไล่ตามโดมของพุ่ม: กลางพุ่มจุดแขวนสูงกว่าริมพุ่ม + สุ่มระดับให้กระจายทั่วพุ่ม */
        y: L.canY - L.canRY * (.62 - .30 * f * f) + a.rnd(0, L.canRY * .95)
      });
    }
    return out;
  }

  function trNewBox(a, s) {
    var d = a.data, L = d.LO;
    s.st = 'in'; s.t = 0;
    s.len = 0;
    s.size = L.boxS * a.rnd(.78, 1.05);
    s.lenMax = s.size * .5 + s.size * .42;      /* เชือกยาวครึ่งกล่อง (นับจากจุดแขวนถึงหลังคากล่อง) */
    s.life = a.rnd(1, 4);                                    /* อยู่ 1-4 วินาที */
    s.col = a.rndi(0, GIFTCOL.length - 1);
    s.ph = a.rnd(0, 6.28); s.sp = a.rnd(.7, 1.5); s.amp = a.rnd(.05, .13);
    s.prize = d.prz[(d.pi++) % d.prz.length];
  }

  /* ตำแหน่งกล่องตอนนี้ (แกว่งเป็นลูกตุ้ม) */
  function trBoxPos(a, s) {
    var d = a.data;
    var ang = s.amp * Math.sin(a.now * s.sp + s.ph) + d.wind * .8;
    return { x: s.x + Math.sin(ang) * s.len, y: s.y + Math.cos(ang) * s.len, ang: ang };
  }

  R('gifttree', {
    time: 0, noScore: true,
    setup: function (a) {
      var d = a.data;
      d.LO = trLayout(a);
      d.conf = [];
      d.prz = przList(a); d.pi = 0;
      d.leaves = trMakeLeaves(a);
      d.slots = trAnchors(a);
      d.slots.forEach(function (s) { trNewBox(a, s); s.t = a.rnd(0, .4); });
      d.wind = 0; d.gust = 0; d.gustT = a.rnd(2, 5);
      d.open = false; d.t = 0; d.sel = null;
    },
    update: function (dt, a) {
      var d = a.data;
      stepConf(dt, a);
      /* ลมเบา ๆ + ลมกระโชกเป็นระยะ */
      d.gustT -= dt;
      if (d.gustT <= 0) { d.gust = a.rnd(.05, .14) * (Math.random() < .5 ? -1 : 1); d.gustT = a.rnd(2.5, 6); }
      d.gust *= .992;
      d.wind = .035 * Math.sin(a.now * .55) + .02 * Math.sin(a.now * 1.7) + d.gust;

      if (d.open) {
        var before = d.t; d.t += dt;
        /* พอฝาเปิดปุ๊บ ค่อยยิงเอฟเฟกต์ */
        if (before <= .55 && d.t > .55) {
          a.beep(1000, .25, 'triangle'); a.shake(.012, .3); a.flash('#ffd23f', .18);
          confetti(a, a.W / 2, a.H * .44);
        }
        return;
      }

      d.slots.forEach(function (s) {
        s.t += dt;
        if (s.st === 'in') {                        /* หย่อนเชือกลงมา */
          var e = Math.min(1, s.t / .55);
          s.len = s.lenMax * (1 - Math.pow(1 - e, 3));
          if (e >= 1) { s.st = 'hang'; s.t = 0; }
        } else if (s.st === 'hang') {
          if (s.t > s.life) { s.st = 'up'; s.t = 0; }
        } else if (s.st === 'up') {                 /* หดเชือกกลับขึ้นไป */
          var e2 = Math.min(1, s.t / .45);
          s.len = s.lenMax * (1 - a.ease(e2));
          if (e2 >= 1) trNewBox(a, s);
        }
      });
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.open) { if (d.t > 1.3) { d.open = false; trNewBox(a, d.sel); d.sel = null; } return; }
      for (var i = d.slots.length - 1; i >= 0; i--) {
        var s = d.slots[i];
        if (s.st === 'up') continue;
        var p = trBoxPos(a, s);
        if (Math.abs(x - p.x) < s.size * .70 && Math.abs(y - p.y) < s.size * .70) {
          d.sel = s; d.open = true; d.t = 0; d.prize = s.prize;
          d.openFrom = { x: p.x, y: p.y, ang: p.ang };
          a.beep(700, .12);
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#86d6f5', '#cdf0c6');
      var d = a.data, L = d.LO;

      /* ---- พื้นหญ้า ---- */
      var gg = g.createLinearGradient(0, L.groundY - a.mn * .05, 0, a.H);
      gg.addColorStop(0, '#5fbf52'); gg.addColorStop(1, '#2f8a3c');
      g.fillStyle = gg;
      g.beginPath();
      g.moveTo(0, L.groundY);
      g.quadraticCurveTo(a.W * .5, L.groundY - a.mn * .035, a.W, L.groundY);
      g.lineTo(a.W, a.H); g.lineTo(0, a.H); g.closePath(); g.fill();

      /* ---- ลำต้น + กิ่ง ---- */
      trDrawTrunk(g, a);

      /* ---- พุ่มใบไม้ ---- */
      d.leaves.forEach(function (lf) {
        var ox = Math.sin(a.now * lf.sp + lf.ph) * lf.amp + d.wind * L.canRX * .10;
        var oy = Math.cos(a.now * lf.sp * .8 + lf.ph) * lf.amp * .6;
        g.fillStyle = lf.c;
        g.beginPath(); g.ellipse(lf.x + ox, lf.y + oy, lf.r, lf.r * .82, 0, 0, 6.29); g.fill();
      });

      /* ---- เชือก (วาดทับใบไม้ เพราะกล่องห้อยอยู่หน้าพุ่ม) ---- */
      d.slots.forEach(function (s) {
        if (s.len <= 0.5) return;
        var p = trBoxPos(a, s);
        g.strokeStyle = 'rgba(60,42,24,.85)';
        g.lineWidth = Math.max(1.5, a.mn * .004);
        g.beginPath(); g.moveTo(s.x, s.y); g.lineTo(p.x, p.y - s.size * .42); g.stroke();
      });

      /* ---- กล่องของขวัญที่ยังแขวนอยู่ ---- */
      d.slots.forEach(function (s) {
        if (s.len <= 0.5 || (d.open && d.sel === s)) return;
        var p = trBoxPos(a, s);
        giftBox(g, a, p.x, p.y, s.size, s.col, { alpha: d.open ? .40 : 1, rot: p.ang });
      });

      /* ---- กล่องที่เลือก: ลอยขึ้นกลางจอ ขยายใหญ่ แล้วเปิดฝา ---- */
      if (d.open) {
        g.save(); g.globalAlpha = .50 * Math.min(1, d.t / .3);
        g.fillStyle = '#000'; g.fillRect(0, 0, a.W, a.H); g.restore();

        var from = d.openFrom, big = Math.min(a.mn * .34, a.H * .34);
        var e = a.ease(Math.min(1, d.t / .45));
        var bx = from.x + (a.W / 2 - from.x) * e;
        var by = from.y + (a.H * .44 - from.y) * e;
        var bs = d.sel.size + (big - d.sel.size) * e;
        var opened = d.t > .55;
        giftBox(g, a, bx, by, bs * (opened ? a.pop(Math.min(1, (d.t - .55) / .4)) : 1),
                d.sel.col, { open: opened, rot: from.ang * (1 - e) });
      }

      drawConf(g, a);

      if (d.open) { if (d.t > .95) prizePanel(g, a, d.prize, d.t > 1.3); }
      else a.head(a.txt({ th: 'แตะกล่องที่แขวนอยู่บนต้นไม้', en: 'Tap a gift hanging from the tree' }));
    }
  });

  /* ลำต้นและกิ่ง */
  function trDrawTrunk(g, a) {
    var L = a.data.LO, w = L.trunkW, bx = L.cx, by = L.groundY;
    var top = L.trunkTop;
    g.save();
    /* โคนต้นบานออก */
    var tg = g.createLinearGradient(bx - w, 0, bx + w, 0);
    tg.addColorStop(0, '#6b4326'); tg.addColorStop(.45, '#8c5c33'); tg.addColorStop(1, '#5a3720');
    g.fillStyle = tg;
    g.beginPath();
    g.moveTo(bx - w * .95, by);
    g.quadraticCurveTo(bx - w * .42, by - (by - top) * .45, bx - w * .30, top);
    g.lineTo(bx + w * .30, top);
    g.quadraticCurveTo(bx + w * .42, by - (by - top) * .45, bx + w * .95, by);
    g.closePath(); g.fill();

    /* กิ่งแยกซ้ายขวา */
    var br = [
      [-1, .42, .70], [1, .50, .66], [-1, .68, .46], [1, .74, .40]
    ];
    g.strokeStyle = '#6b4326'; g.lineCap = 'round';
    br.forEach(function (b) {
      var y0 = top + (by - top) * (1 - b[1]) * .55;
      var lenX = L.canRX * b[2], lenY = L.canRY * .55;
      g.lineWidth = w * (.34 * b[2] + .12);
      g.beginPath();
      g.moveTo(bx + b[0] * w * .22, y0);
      g.quadraticCurveTo(bx + b[0] * lenX * .55, y0 - lenY * .30,
                         bx + b[0] * lenX, y0 - lenY * .85);
      g.stroke();
    });
    /* ลายเปลือกไม้ */
    g.strokeStyle = 'rgba(40,24,12,.25)'; g.lineWidth = Math.max(1, w * .05);
    for (var i = 0; i < 4; i++) {
      var xx = bx - w * .5 + i * w * .33;
      g.beginPath(); g.moveTo(xx, by - (by - top) * .12);
      g.quadraticCurveTo(xx + w * .10, by - (by - top) * .55, xx + w * .02, top + (by - top) * .06);
      g.stroke();
    }
    g.restore();
  }


  /* ช่องกลมสำหรับล้วงมือ */
  function drawHole(g, a) {
    var d = a.data, L = d.LO;
    g.save();
    g.translate(L.holeX, L.holeY);
    /* ยางขอบช่อง */
    g.lineWidth = L.holeR * .30;
    g.strokeStyle = '#e0452a';
    g.beginPath(); g.arc(0, 0, L.holeR * 1.06, 0, 6.29); g.stroke();
    g.lineWidth = L.holeR * .12;
    g.strokeStyle = 'rgba(255,255,255,.35)';
    g.beginPath(); g.arc(0, 0, L.holeR * 1.14, -2.4, -.8); g.stroke();
    /* เงาในปากช่อง */
    var hg = g.createRadialGradient(0, 0, L.holeR * .5, 0, 0, L.holeR);
    hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(1, 'rgba(0,0,0,.35)');
    g.fillStyle = hg; g.beginPath(); g.arc(0, 0, L.holeR, 0, 6.29); g.fill();
    /* ไฟกะพริบชวนให้ล้วง */
    if (d.st === 'blow') {
      g.globalAlpha = .30 + .30 * Math.sin(a.now * 6);
      g.lineWidth = L.holeR * .14; g.strokeStyle = '#ffd23f';
      g.beginPath(); g.arc(0, 0, L.holeR * 1.26, 0, 6.29); g.stroke();
    }
    g.restore();
  }

})();
