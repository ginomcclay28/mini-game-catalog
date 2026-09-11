/* ============================================================
   PACK 11 — เกมที่ 101 ขึ้นไป
   101 บัตรขูด v.2 : เลือกบัตรจากแผง 3x3 → บัตรขยายขึ้นกลางจอ → ขูดเปิดรางวัล
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
})();
