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

    /* ใช้ภาพถ้าลูกค้าใส่มา (ภาพควรเป็นสีขาว/เทาเพื่อให้ย้อมสีได้) */
    if (a.hasSpr(opt.open ? 'boxOpen' : 'box')) {
      g.restore();
      a.sprTint(opt.open ? 'boxOpen' : 'box', col[0], null, x, y, s * sc,
                { rot: opt.rot, alpha: opt.alpha });
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
        d.sw.t += dt / .55;
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
        d.wait = 2;
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
    d.open = false; d.sel = -1; d.t = 0; d.sw = null; d.wait = 2;
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

})();
