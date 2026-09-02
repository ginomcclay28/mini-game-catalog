/* ============================================================
   PACK 3 — เกม 21-30  (responsive: 16:9 และ 9:16)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }

  /* ---------- 21 แยกประเภทลงถัง ---------- */
  var BINS = [
    { e: '🍎', c: '#2fe08a', th: 'ผลไม้', en: 'Fruit', it: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍', '🍑', '🥝'] },
    { e: '🐶', c: '#00d4ff', th: 'สัตว์', en: 'Animal', it: ['🐶', '🐱', '🐼', '🦊', '🐸', '🐵', '🐷', '🐰'] },
    { e: '🚗', c: '#ffd23f', th: 'ยานพาหนะ', en: 'Vehicle', it: ['🚗', '🚕', '🚌', '🚲', '✈️', '🚀', '🚂', '🛵'] }
  ];
  R('sortbin', {
    setup: function (a) {
      var bw = Math.min(a.W / 3 * .84, a.mn * .30), bh = bw * (a.port ? 1.05 : .78);
      a.data.LO = { bw: bw, bh: bh, by: a.H - bh - a.mn * .07, is: a.mn * .12, home: { x: a.W / 2, y: a.H * .26 } };
      a.data.drag = null; a.data.fx = 0; a.data.fxc = '';
      newItem(a);
    },
    update: function (dt, a) { if (a.data.fx > 0) a.data.fx -= dt; },
    down: function (x, y, a) { if (Math.hypot(x - a.data.ix, y - a.data.iy) < a.data.LO.is * .7) a.data.drag = 1; },
    move: function (x, y, a) { if (a.data.drag) { a.data.ix = x; a.data.iy = y; } },
    up: function (x, y, a) {
      var d = a.data, L = d.LO; if (!d.drag) return; d.drag = null;
      for (var i = 0; i < 3; i++) {
        var bx = a.W / 6 + i * a.W / 3;
        if (Math.abs(x - bx) < L.bw / 2 + a.mn * .03 && y > L.by - a.mn * .05) {
          if (i === d.cat) { a.add(20); a.beep(900, .12); d.fxc = a.C.good; }
          else { a.add(-10); a.beep(170, .2, 'square'); d.fxc = a.C.bad; }
          d.fx = .35; newItem(a); return;
        }
      }
      d.ix = L.home.x; d.iy = L.home.y;
    },
    draw: function (g, a) {
      a.bg('#0f4c3a', '#2fa86f');
      var d = a.data, L = d.LO;
      for (var i = 0; i < 3; i++) {
        var b = BINS[i], bx = a.W / 6 + i * a.W / 3;
        a.fillRR(bx - L.bw / 2, L.by, L.bw, L.bh, L.bw * .09, b.c);
        a.fillRR(bx - L.bw * .56, L.by - L.bh * .13, L.bw * 1.12, L.bh * .17, L.bw * .05, 'rgba(0,0,0,.28)');
        EM(g, b.e, bx, L.by + L.bh * .40, L.bw * .34);
        a.text(a.lang === 'en' ? b.en : b.th, bx, L.by + L.bh * .80, L.bw * .14, 'rgba(0,0,0,.6)');
      }
      a.shadow(true); EM(g, d.item, d.ix, d.iy, L.is); a.shadow(false);
      a.head(a.txt({ th: 'ลากของลงถังให้ถูกประเภท', en: 'Drag the item into the right bin' }));
      if (d.fx > 0) {
        g.fillStyle = d.fxc; g.globalAlpha = d.fx;
        g.fillRect(0, 0, a.W, a.mn * .012); g.fillRect(0, a.H - a.mn * .012, a.W, a.mn * .012);
        g.globalAlpha = 1;
      }
    }
  });
  function newItem(a) {
    var d = a.data;
    d.cat = a.rndi(0, 2); d.item = a.pick(BINS[d.cat].it);
    d.ix = d.LO.home.x; d.iy = d.LO.home.y;
  }

  /* ---------- 22 วางบล็อกซ้อน ---------- */
  R('stack', {
    time: 0,
    setup: function (a) {
      var bh = a.mn * .058, w0 = a.mn * .42;
      a.data.LO = {
        bh: bh, baseY: a.H - a.mn * .12, edge: a.mn * .03,
        vis: Math.max(4, Math.floor((a.H - a.mn * .26) / bh)), sp0: a.mn * .47
      };
      a.data.t = [{ x: (a.W - w0) / 2, w: w0 }];
      /* บล็อกแรกเริ่มตรงกับฐานพอดี ผู้เล่นที่แตะทันทีจะไม่แพ้ตั้งแต่ตาแรก */
      a.data.cur = { x: (a.W - w0) / 2, w: w0, dir: 1, sp: a.data.LO.sp0 };
      a.data.fall = []; a.data.msg = '';
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO, c = d.cur;
      c.x += c.dir * c.sp * dt;
      if (c.x < L.edge) { c.x = L.edge; c.dir = 1; }
      if (c.x + c.w > a.W - L.edge) { c.x = a.W - L.edge - c.w; c.dir = -1; }
      d.fall.forEach(function (f) { f.v += a.mn * 2.2 * dt; f.y += f.v * dt; });
      d.fall = d.fall.filter(function (f) { return f.y < a.H + a.mn * .2; });
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO, top = d.t[d.t.length - 1], c = d.cur;
      var lo = Math.max(top.x, c.x), hi = Math.min(top.x + top.w, c.x + c.w), ov = hi - lo;
      if (ov <= a.mn * .006) { a.beep(120, .35, 'sawtooth'); a.end(a.txt({ th: 'หอสูง ' + (d.t.length - 1) + ' ชั้น', en: 'Tower height: ' + (d.t.length - 1) })); return; }
      var yTop = L.baseY - d.t.length * L.bh + scroll(a);
      if (c.x < lo) d.fall.push({ x: c.x, w: lo - c.x, y: yTop, v: 0 });
      if (c.x + c.w > hi) d.fall.push({ x: hi, w: c.x + c.w - hi, y: yTop, v: 0 });
      var perfect = Math.abs(ov - top.w) < a.mn * .009;
      if (perfect) { a.add(30); d.msg = 'PERFECT!'; a.beep(1200, .15, 'triangle'); }
      else { a.add(10); d.msg = ''; a.beep(600, .08); }
      var nw = perfect ? top.w : ov;
      d.t.push({ x: lo, w: nw });
      d.cur = { x: c.dir > 0 ? L.edge : a.W - L.edge - nw, w: nw, dir: c.dir, sp: Math.min(a.mn * .95, c.sp + a.mn * .017) };
    },
    draw: function (g, a) {
      a.bg('#141a3d', '#3d2f8f');
      var d = a.data, L = d.LO, sc = scroll(a);
      d.t.forEach(function (b, i) {
        var y = L.baseY - i * L.bh + sc; if (y < -L.bh) return;
        a.fillRR(b.x, y, b.w, L.bh * .9, L.bh * .18, 'hsl(' + ((i * 16 + 200) % 360) + ',78%,60%)');
      });
      var cy = L.baseY - d.t.length * L.bh + sc;
      a.fillRR(d.cur.x, cy, d.cur.w, L.bh * .9, L.bh * .18, a.C.accent);
      d.fall.forEach(function (f) { g.globalAlpha = .7; a.fillRR(f.x, f.y, f.w, L.bh * .9, L.bh * .18, '#ffffff'); g.globalAlpha = 1; });
      if (d.msg) a.text(d.msg, a.W / 2, a.mn * .14, a.mn * .055, a.C.accent);
      a.head(a.txt({ th: 'แตะเพื่อวางบล็อก', en: 'Tap to drop the block' }));
    }
  });
  function scroll(a) { var d = a.data, L = d.LO; return Math.max(0, (d.t.length - L.vis) * L.bh); }

  /* ---------- 23 หยุดเข็มให้ตรงกลาง ---------- */
  R('timingbar', {
    setup: function (a) {
      a.data.LO = { bw: a.W * .82, bh: a.port ? a.mn * .15 : a.mn * .11, by: a.H * .46 };
      a.data.LO.bx = (a.W - a.data.LO.bw) / 2;
      a.data.p = 0; a.data.dir = 1; a.data.sp = .9; a.data.zone = .18;
      a.data.msg = ''; a.data.fx = 0; a.data.lv = 1;
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.fx > 0) { d.fx -= dt; if (d.fx <= 0) d.msg = ''; return; }
      d.p += d.dir * d.sp * dt;
      if (d.p > 1) { d.p = 1; d.dir = -1; } if (d.p < 0) { d.p = 0; d.dir = 1; }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.fx > 0) return;
      var off = Math.abs(d.p - .5);
      if (off < d.zone / 2) { a.add(30); d.msg = a.txt({ th: 'เป๊ะ! +30', en: 'PERFECT +30' }); a.beep(1100, .15, 'triangle'); d.zone = Math.max(.06, d.zone - .018); d.sp += .1; d.lv++; }
      else if (off < d.zone) { a.add(10); d.msg = a.txt({ th: 'เฉียด! +10', en: 'Close +10' }); a.beep(700, .1); }
      else { d.msg = a.txt({ th: 'พลาด', en: 'Miss' }); a.beep(170, .2, 'square'); }
      d.fx = .6;
    },
    draw: function (g, a) {
      a.bg('#3a0b4a', '#0b3a6b');
      var d = a.data, L = d.LO, pad = L.bh * .12;
      a.fillRR(L.bx, L.by, L.bw, L.bh, L.bh / 2, 'rgba(0,0,0,.4)');
      a.fillRR(L.bx + L.bw * (.5 - d.zone), L.by + pad, L.bw * d.zone * 2, L.bh - pad * 2, L.bh / 2, 'rgba(255,210,63,.45)');
      a.fillRR(L.bx + L.bw * (.5 - d.zone / 2), L.by + pad, L.bw * d.zone, L.bh - pad * 2, L.bh / 2, a.C.good);
      var mx = L.bx + L.bw * d.p;
      a.fillRR(mx - L.bh * .09, L.by - L.bh * .3, L.bh * .18, L.bh * 1.6, L.bh * .09, '#fff');
      a.circle(mx, L.by - L.bh * .40, L.bh * .18, a.C.primary);
      a.text(a.txt({ th: 'แตะให้เข็มหยุดในโซนเขียว', en: 'Stop the marker in the green' }), a.W / 2, L.by - a.mn * .16, a.mn * .042, '#fff');
      a.text('LV ' + d.lv, a.W / 2, L.by - a.mn * .10, a.mn * .032, 'rgba(255,255,255,.65)');
      if (d.msg) a.text(d.msg, a.W / 2, L.by + L.bh + a.mn * .13, a.mn * .062, a.C.accent);
    }
  });

  /* ---------- 24 กดแถบดนตรี ---------- */
  R('pianotiles', {
    lives: 3,
    setup: function (a) {
      a.data.LO = { lw: a.W / 4, th: Math.max(a.mn * .21, a.W / 4 * .55), sp0: a.mn * .45 };
      a.data.t = []; a.data.sp = a.data.LO.sp0; a.data.next = 0; a.data.hitfx = [];
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.sp += dt * a.mn * .017; d.next -= dt;
      if (d.next <= 0) { d.t.push({ l: a.rndi(0, 3), y: -L.th }); d.next = (L.th * 1.5) / d.sp; }
      for (var i = d.t.length - 1; i >= 0; i--) {
        var t = d.t[i]; t.y += d.sp * dt;
        if (t.y > a.H) { d.t.splice(i, 1); a.beep(140, .2, 'square'); a.loseLife(); }
      }
      d.hitfx.forEach(function (f) { f.t -= dt; }); d.hitfx = d.hitfx.filter(function (f) { return f.t > 0; });
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO, l = Math.floor(x / L.lw);
      for (var i = d.t.length - 1; i >= 0; i--) {
        var t = d.t[i];
        if (t.l === l && t.y + L.th > 0 && t.y < a.H) {
          d.t.splice(i, 1); a.add(10); a.beep([392, 494, 587, 698][l], .12, 'triangle');
          d.hitfx.push({ l: l, t: .3 }); return;
        }
      }
      a.beep(150, .12, 'square'); a.add(-5);
    },
    draw: function (g, a) {
      a.bg('#0a0a1e', '#1b1442');
      var d = a.data, L = d.LO, pad = L.lw * .06;
      for (var i = 0; i < 4; i++) {
        g.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.02)';
        g.fillRect(i * L.lw, 0, L.lw, a.H);
      }
      var cols = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a'];
      d.t.forEach(function (t) { a.fillRR(t.l * L.lw + pad, t.y, L.lw - pad * 2, L.th, L.lw * .08, cols[t.l]); });
      d.hitfx.forEach(function (f) {
        g.globalAlpha = f.t * 3; g.fillStyle = cols[f.l];
        g.fillRect(f.l * L.lw, a.H - a.mn * .17, L.lw, a.mn * .17); g.globalAlpha = 1;
      });
      g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(0, a.H - a.mn * .009, a.W, a.mn * .009);
    }
  });

  /* ---------- 25 งูกินหาง ---------- */
  R('snake', {
    time: 0,
    setup: function (a) {
      var cs = a.mn * .062;
      var cols = Math.floor((a.W - a.mn * .06) / cs), rows = Math.floor((a.H - a.mn * .17) / cs);
      a.data.LO = {
        cs: cs, cols: cols, rows: rows,
        ox: (a.W - cols * cs) / 2, oy: a.mn * .13 + (a.H - a.mn * .13 - rows * cs) / 2
      };
      var mx = Math.floor(cols / 2), my = Math.floor(rows / 2);
      a.data.s = [[mx, my], [mx - 1, my], [mx - 2, my]];
      a.data.d = [1, 0]; a.data.nd = [1, 0]; a.data.acc = 0; a.data.step = .13;
      a.data.f = [Math.min(cols - 1, mx + 5), my]; a.data.sw = null;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO; d.acc += dt;
      if (d.acc < d.step) return; d.acc = 0;
      d.d = d.nd;
      var h = [d.s[0][0] + d.d[0], d.s[0][1] + d.d[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] >= L.cols || h[1] >= L.rows) { a.beep(130, .3, 'sawtooth'); return a.end(); }
      for (var i = 0; i < d.s.length; i++) if (d.s[i][0] === h[0] && d.s[i][1] === h[1]) { a.beep(130, .3, 'sawtooth'); return a.end(); }
      d.s.unshift(h);
      if (h[0] === d.f[0] && h[1] === d.f[1]) {
        a.add(10); a.beep(900, .08); d.step = Math.max(.06, d.step - .003);
        do { d.f = [a.rndi(0, L.cols - 1), a.rndi(0, L.rows - 1)]; }
        while (d.s.some(function (p) { return p[0] === d.f[0] && p[1] === d.f[1]; }));
      } else d.s.pop();
    },
    down: function (x, y, a) { a.data.sw = { x: x, y: y }; },
    up: function (x, y, a) {
      var d = a.data; if (!d.sw) return;
      var dx = x - d.sw.x, dy = y - d.sw.y; d.sw = null;
      if (Math.abs(dx) < a.mn * .03 && Math.abs(dy) < a.mn * .03) return;
      if (Math.abs(dx) > Math.abs(dy)) turn(a, dx > 0 ? [1, 0] : [-1, 0]);
      else turn(a, dy > 0 ? [0, 1] : [0, -1]);
    },
    key: function (k, a) {
      if (k === 'ArrowUp') turn(a, [0, -1]); if (k === 'ArrowDown') turn(a, [0, 1]);
      if (k === 'ArrowLeft') turn(a, [-1, 0]); if (k === 'ArrowRight') turn(a, [1, 0]);
    },
    draw: function (g, a) {
      a.bg('#10261a', '#1e5b3a');
      var d = a.data, L = d.LO, cs = L.cs;
      g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1;
      for (var c = 0; c <= L.cols; c++) { g.beginPath(); g.moveTo(L.ox + c * cs, L.oy); g.lineTo(L.ox + c * cs, L.oy + L.rows * cs); g.stroke(); }
      for (var r = 0; r <= L.rows; r++) { g.beginPath(); g.moveTo(L.ox, L.oy + r * cs); g.lineTo(L.ox + L.cols * cs, L.oy + r * cs); g.stroke(); }
      EM(g, '🍎', L.ox + (d.f[0] + .5) * cs, L.oy + (d.f[1] + .5) * cs, cs * .74);
      d.s.forEach(function (p, i) {
        a.fillRR(L.ox + p[0] * cs + cs * .08, L.oy + p[1] * cs + cs * .08, cs * .84, cs * .84, cs * .2, i ? a.C.good : a.C.accent);
      });
      a.head(a.txt({ th: 'ปัดนิ้วเพื่อเปลี่ยนทิศ', en: 'Swipe to steer' }));
    }
  });
  function turn(a, nd) { var d = a.data.d; if (nd[0] === -d[0] && nd[1] === -d[1]) return; a.data.nd = nd; }

  /* ---------- 26 โอเอกซ์ ---------- */
  R('tictactoe', {
    time: 0,
    setup: function (a) {
      var top = a.mn * .15;
      var s = Math.min((a.W - a.mn * .14) / 3, (a.H - top - a.mn * .10) / 3, a.mn * .26);
      a.data.LO = { s: s, ox: (a.W - s * 3) / 2, oy: top + (a.H - top - s * 3) / 2 };
      a.data.b = [0, 0, 0, 0, 0, 0, 0, 0, 0]; a.data.turn = 1; a.data.win = null; a.data.lock = 0;
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.lock > 0) {
        d.lock -= dt;
        if (d.lock <= 0) {
          if (d.win !== null || d.b.indexOf(0) < 0) newBoard(a);
          else if (d.turn === 2) {
            var m = aiMove(d.b);
            if (m >= 0) {
              d.b[m] = 2; a.beep(300, .1); check(a);
              if (d.win === null && d.b.indexOf(0) >= 0) d.turn = 1; else d.lock = 1.3;
            }
          }
        }
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO; if (d.lock > 0 || d.turn !== 1) return;
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c > 2 || r > 2) return;
      var i = r * 3 + c; if (d.b[i]) return;
      d.b[i] = 1; a.beep(660, .1); check(a);
      if (d.win !== null || d.b.indexOf(0) < 0) d.lock = 1.4; else { d.turn = 2; d.lock = .45; }
    },
    draw: function (g, a) {
      a.bg('#0b2e4a', '#1b6f8c');
      var d = a.data, L = d.LO, s = L.s;
      a.fillRR(L.ox - s * .09, L.oy - s * .09, s * 3.18, s * 3.18, s * .12, 'rgba(255,255,255,.12)');
      g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = s * .04; g.lineCap = 'round';
      for (var i = 1; i < 3; i++) {
        g.beginPath(); g.moveTo(L.ox + i * s, L.oy + s * .07); g.lineTo(L.ox + i * s, L.oy + s * 2.93); g.stroke();
        g.beginPath(); g.moveTo(L.ox + s * .07, L.oy + i * s); g.lineTo(L.ox + s * 2.93, L.oy + i * s); g.stroke();
      }
      d.b.forEach(function (v, i) {
        if (!v) return;
        var cx = L.ox + (i % 3 + .5) * s, cy = L.oy + (Math.floor(i / 3) + .5) * s;
        g.lineWidth = s * .095;
        if (v === 1) { g.strokeStyle = a.C.accent; g.beginPath(); g.arc(cx, cy, s * .31, 0, 6.29); g.stroke(); }
        else {
          g.strokeStyle = a.C.primary; g.beginPath();
          g.moveTo(cx - s * .28, cy - s * .28); g.lineTo(cx + s * .28, cy + s * .28);
          g.moveTo(cx + s * .28, cy - s * .28); g.lineTo(cx - s * .28, cy + s * .28); g.stroke();
        }
      });
      if (d.win) {
        g.strokeStyle = '#fff'; g.lineWidth = s * .08;
        var A = d.win[0], B = d.win[2];
        g.beginPath();
        g.moveTo(L.ox + (A % 3 + .5) * s, L.oy + (Math.floor(A / 3) + .5) * s);
        g.lineTo(L.ox + (B % 3 + .5) * s, L.oy + (Math.floor(B / 3) + .5) * s); g.stroke();
      }
      a.head(a.txt({ th: 'คุณคือ O • ชนะ +100 / เสมอ +30', en: 'You are O • win +100 / draw +30' }));
    }
  });
  var LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  function winner(b) { for (var i = 0; i < 8; i++) { var L = LINES[i]; if (b[L[0]] && b[L[0]] === b[L[1]] && b[L[1]] === b[L[2]]) return L; } return null; }
  function check(a) {
    var d = a.data, L = winner(d.b);
    if (L) { d.win = L; if (d.b[L[0]] === 1) { a.add(100); a.beep(1100, .3, 'triangle'); } else a.beep(160, .3, 'square'); }
    else if (d.b.indexOf(0) < 0) a.add(30);
  }
  function newBoard(a) { a.data.b = [0, 0, 0, 0, 0, 0, 0, 0, 0]; a.data.win = null; a.data.turn = 1; a.data.lock = 0; }
  function aiMove(b) {
    var i, L, k;
    for (k = 0; k < 8; k++) { L = LINES[k]; for (i = 0; i < 3; i++) if (!b[L[i]] && b[L[(i + 1) % 3]] === 2 && b[L[(i + 2) % 3]] === 2) return L[i]; }
    for (k = 0; k < 8; k++) { L = LINES[k]; for (i = 0; i < 3; i++) if (!b[L[i]] && b[L[(i + 1) % 3]] === 1 && b[L[(i + 2) % 3]] === 1) return L[i]; }
    if (!b[4]) return 4;
    var pref = [0, 2, 6, 8, 1, 3, 5, 7];
    for (k = 0; k < pref.length; k++) if (!b[pref[k]]) return pref[k];
    return -1;
  }

  /* ---------- 27 เรียงตัวอักษร ---------- */
  var WORDS = ['PROMOTION', 'DISCOUNT', 'CUSTOMER', 'ARCADE', 'BRANDING', 'TOUCHSCREEN', 'MARKETING', 'EVENT', 'REWARD', 'JACKPOT'];
  R('wordscramble', {
    setup: function (a) {
      a.data.pool = a.shuffle(WORDS.slice()); a.data.i = 0; a.data.fx = 0;
      a.data.slotY = a.port ? a.H * .30 : a.H * .36;
      a.data.tileY = a.data.slotY + a.mn * .22;
      mkw(a);
    },
    update: function (dt, a) {
      if (a.data.fx > 0) { a.data.fx -= dt; if (a.data.fx <= 0) { a.data.i = (a.data.i + 1) % a.data.pool.length; mkw(a); } }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.fx > 0) return;
      for (var i = 0; i < d.ans.length; i++) {
        var b = cell(a, i, d.ans.length, d.slotY);
        if (d.ans[i] && x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.let.push(d.ans[i]); d.ans[i] = null; a.beep(360, .05); return;
        }
      }
      for (var j = 0; j < d.let.length; j++) {
        var c = cell(a, j, d.w.length, d.tileY);
        if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h) {
          var k = d.ans.indexOf(null); if (k < 0) return;
          d.ans[k] = d.let[j]; d.let.splice(j, 1); a.beep(620, .05);
          if (d.ans.indexOf(null) < 0) {
            if (d.ans.join('') === d.w) { a.add(30); a.beep(1000, .2, 'triangle'); d.ok = 1; }
            else { a.beep(170, .2, 'square'); d.ok = 0; }
            d.fx = .7;
          }
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#4a1d0e', '#7b2ff7');
      var d = a.data;
      a.head(a.txt({ th: 'เรียงตัวอักษรให้เป็นคำที่ถูกต้อง', en: 'Arrange the letters into the word' }));
      for (var i = 0; i < d.ans.length; i++) {
        var b = cell(a, i, d.ans.length, d.slotY);
        var col = d.fx > 0 ? (d.ok ? a.C.good : a.C.bad) : 'rgba(255,255,255,.92)';
        a.fillRR(b.x, b.y, b.w, b.h, b.w * .16, d.ans[i] ? col : 'rgba(255,255,255,.2)');
        if (d.ans[i]) a.text(d.ans[i], b.x + b.w / 2, b.y + b.h / 2, b.w * .58, d.fx > 0 ? '#fff' : a.C.dark);
      }
      for (var j = 0; j < d.let.length; j++) {
        var c = cell(a, j, d.w.length, d.tileY);
        a.fillRR(c.x, c.y, c.w, c.h, c.w * .16, a.C.accent);
        a.text(d.let[j], c.x + c.w / 2, c.y + c.h / 2, c.w * .58, '#5a3a00');
      }
      a.text(a.txt({ th: 'แตะช่องคำตอบเพื่อเอาตัวอักษรคืน', en: 'Tap a filled slot to take the letter back' }),
        a.W / 2, a.H - a.mn * .07, a.mn * .030, 'rgba(255,255,255,.7)');
    }
  });
  function cell(a, i, n, y) {
    var gap = a.mn * .012;
    var w = Math.min(a.mn * .10, (a.W * .92 - gap * (n - 1)) / n);
    var tot = n * w + (n - 1) * gap;
    return { x: (a.W - tot) / 2 + i * (w + gap), y: y, w: w, h: w * 1.18 };
  }
  function mkw(a) {
    var d = a.data; d.w = d.pool[d.i];
    d.ans = d.w.split('').map(function () { return null; });
    do { d.let = a.shuffle(d.w.split('')); } while (d.let.join('') === d.w && d.w.length > 2);
    d.ok = 0;
  }

  /* ---------- 28 คิดเลขเร็ว ---------- */
  R('mathquick', {
    setup: function (a) {
      var qw = a.W * .84, gap = a.mn * .035;
      var ow = (qw - gap) / 2, oh = a.port ? a.H * .115 : a.mn * .17;
      var qy = a.mn * .10, qh = a.port ? a.H * .16 : a.mn * .21;
      var totH = oh * 2 + gap;
      var oy = qy + qh + Math.max(gap, (a.H - qy - qh - totH - a.mn * .06) / 2);
      a.data.LO = { qx: (a.W - qw) / 2, qw: qw, qy: qy, qh: qh, ow: ow, oh: oh, gap: gap, oy: oy };
      a.data.fb = 0; a.data.pick = -1; mkm(a);
    },
    update: function (dt, a) { if (a.data.fb > 0) { a.data.fb -= dt; if (a.data.fb <= 0) { a.data.pick = -1; mkm(a); } } },
    down: function (x, y, a) {
      var d = a.data; if (d.fb > 0) return;
      for (var i = 0; i < 4; i++) {
        var b = mbox(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.pick = i;
          if (d.opt[i] === d.ans) { a.add(15); a.addTime(1); a.beep(950, .1); }
          else { a.add(-5); a.beep(170, .2, 'square'); }
          d.fb = .55; return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#7a5c00', '#2fa86f');
      var d = a.data, L = d.LO;
      a.fillRR(L.qx, L.qy, L.qw, L.qh, a.mn * .028, 'rgba(255,255,255,.95)');
      a.text(d.q, a.W / 2, L.qy + L.qh / 2, a.mn * .085, a.C.dark);
      for (var i = 0; i < 4; i++) {
        var b = mbox(a, i), col = 'rgba(255,255,255,.92)', tc = a.C.dark;
        if (d.fb > 0) { if (d.opt[i] === d.ans) { col = a.C.good; tc = '#fff'; } else if (d.pick === i) { col = a.C.bad; tc = '#fff'; } }
        a.fillRR(b.x, b.y, b.w, b.h, a.mn * .022, col);
        a.text(d.opt[i] + '', b.x + b.w / 2, b.y + b.h / 2, a.mn * .062, tc);
      }
    }
  });
  function mbox(a, i) {
    var L = a.data.LO;
    return { x: L.qx + (i % 2) * (L.ow + L.gap), y: L.oy + Math.floor(i / 2) * (L.oh + L.gap), w: L.ow, h: L.oh };
  }
  function mkm(a) {
    var d = a.data, op = a.pick(['+', '-', '×']), x, y, r;
    if (op === '×') { x = a.rndi(2, 12); y = a.rndi(2, 12); r = x * y; }
    else if (op === '+') { x = a.rndi(10, 89); y = a.rndi(10, 89); r = x + y; }
    else { x = a.rndi(30, 99); y = a.rndi(5, 29); r = x - y; }
    d.q = x + ' ' + op + ' ' + y + ' = ?'; d.ans = r;
    var set = [r];
    while (set.length < 4) { var v = r + a.rndi(-12, 12); if (v !== r && v >= 0 && set.indexOf(v) < 0) set.push(v); }
    d.opt = a.shuffle(set);
  }

  /* ---------- 29 เลือกกล่องของขวัญ ---------- */
  R('giftpick', {
    time: 0, noScore: true,
    setup: function (a) {
      var th = ['🎁 ของแถม', '💰 ลด 100.-', '☕ กาแฟฟรี', '🎫 คูปอง 50%', '😅 เสียใจด้วย', '🏆 รางวัลใหญ่', '🧢 หมวกแบรนด์', '🛍️ ถุงผ้า', '⭐ แต้มสะสม x2'];
      var en = ['🎁 Free gift', '💰 100 off', '☕ Free coffee', '🎫 50% coupon', '😅 Try again', '🏆 Grand prize', '🧢 Brand cap', '🛍️ Tote bag', '⭐ 2× points'];
      a.data.prz = a.shuffle((a.lang === 'en' ? en : th).slice());
      var gap = a.mn * .05;
      var bw = Math.min((a.W * .88 - gap * 2) / 3, a.mn * .28), bh = bw * (a.port ? .95 : .72);
      var top = a.mn * .16;
      a.data.LO = {
        bw: bw, bh: bh, gap: gap,
        ox: (a.W - (bw * 3 + gap * 2)) / 2,
        oy: top + (a.H - top - (bh * 3 + gap * 2)) / 2
      };
      a.data.open = -1; a.data.t = 0; a.data.conf = [];
    },
    update: function (dt, a) {
      var d = a.data; if (d.open >= 0) d.t += dt;
      d.conf.forEach(function (c) { c.y += c.v * dt; c.x += c.h * dt; c.life -= dt; });
      d.conf = d.conf.filter(function (c) { return c.life > 0; });
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.open >= 0) { if (d.t > .8) { d.open = -1; d.t = 0; d.prz = a.shuffle(d.prz); } return; }
      for (var i = 0; i < 9; i++) {
        var b = gbox(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.open = i; d.t = 0; a.beep(1000, .25, 'triangle');
          for (var k = 0; k < 70; k++) d.conf.push({
            x: a.W / 2, y: a.H / 2, v: a.rnd(-a.mn * .6, a.mn * .6), h: a.rnd(-a.mn * .6, a.mn * .6),
            life: a.rnd(.8, 1.8), c: a.pick(['#ff2e88', '#ffd23f', '#00d4ff', '#2fe08a', '#ff6a3d'])
          });
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#5b0f4a', '#c81d6b');
      var d = a.data, L = d.LO;
      for (var i = 0; i < 9; i++) {
        var b = gbox(a, i), lift = d.open === i ? Math.min(L.bh * .2, d.t * L.bh * .7) : 0;
        a.fillRR(b.x, b.y - lift, b.w, b.h, b.w * .09, d.open === i ? '#ffd23f' : '#ff5c9c');
        g.fillStyle = 'rgba(255,255,255,.85)';
        g.fillRect(b.x + b.w / 2 - b.w * .05, b.y - lift, b.w * .1, b.h);
        a.fillRR(b.x - b.w * .035, b.y - lift - b.h * .09, b.w * 1.07, b.h * .17, b.w * .05, '#ffffff');
        EM(g, '🎀', b.x + b.w / 2, b.y - lift - b.h * .005, b.w * .22);
      }
      d.conf.forEach(function (c) {
        g.fillStyle = c.c; g.globalAlpha = Math.min(1, c.life);
        g.fillRect(c.x, c.y, a.mn * .014, a.mn * .022); g.globalAlpha = 1;
      });
      if (d.open >= 0) {
        var pw = Math.min(a.W * .86, a.mn * 1.0), ph = a.mn * .24;
        a.fillRR((a.W - pw) / 2, a.H / 2 - ph / 2, pw, ph, a.mn * .034, 'rgba(10,5,25,.88)');
        a.text(a.txt({ th: 'คุณได้รับ', en: 'You won' }), a.W / 2, a.H / 2 - ph * .27, a.mn * .036, 'rgba(255,255,255,.75)');
        var fs = a.mn * .062;
        g.font = '700 ' + fs + 'px Kanit,sans-serif';
        while (g.measureText(d.prz[d.open]).width > pw * .88 && fs > 10) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
        a.text(d.prz[d.open], a.W / 2, a.H / 2 + ph * .06, fs, a.C.accent);
        if (d.t > .8) a.text(a.txt({ th: 'แตะเพื่อเล่นอีกครั้ง', en: 'Tap to play again' }), a.W / 2, a.H / 2 + ph * .34, a.mn * .028, 'rgba(255,255,255,.6)');
      } else a.head(a.txt({ th: 'เลือก 1 กล่อง ลุ้นรางวัล', en: 'Pick one box and win' }));
    }
  });
  function gbox(a, i) {
    var L = a.data.LO;
    return { x: L.ox + (i % 3) * (L.bw + L.gap), y: L.oy + Math.floor(i / 3) * (L.bh + L.gap), w: L.bw, h: L.bh };
  }

  /* ---------- 30 หาของที่ซ่อน ---------- */
  var ICONS = ['🍕', '🎧', '🚗', '⚽', '🌵', '🐶', '📷', '🍩', '🎩', '🔑', '🌈', '🎸', '🧁', '🚀', '⌚', '🎲'];
  R('hiddenobj', {
    setup: function (a) {
      a.data.LO = { hb: a.mn * .14, is: a.mn * .066 };
      a.data.lv = 1; a.data.fx = 0; mkh(a);
    },
    update: function (dt, a) { if (a.data.fx > 0) a.data.fx -= dt; },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      for (var i = d.o.length - 1; i >= 0; i--) {
        var o = d.o[i];
        if (Math.hypot(x - o.x, y - o.y) < L.is * .62) {
          if (o.e === d.target) { a.add(25); a.beep(1000, .12); d.lv++; mkh(a); }
          else { a.add(-10); a.beep(170, .18, 'square'); d.fx = .25; }
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#2a1150', '#0f5c4a');
      var d = a.data, L = d.LO;
      d.o.forEach(function (o) { g.save(); g.translate(o.x, o.y); g.rotate(o.r); EM(g, o.e, 0, 0, L.is); g.restore(); });
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 0, a.W, L.hb);
      var cy = L.hb * .5;
      a.text(a.txt({ th: 'หาให้เจอ:', en: 'Find:' }), a.W * .5 - a.mn * .12, cy, a.mn * .042, '#fff', 'right');
      EM(g, d.target, a.W * .5 - a.mn * .05, cy, a.mn * .068);
      a.text(a.txt({ th: 'รอบ ' + d.lv, en: 'Round ' + d.lv }), a.W * .5 + a.mn * .09, cy, a.mn * .036, 'rgba(255,255,255,.75)', 'left');
      if (d.fx > 0) { g.fillStyle = 'rgba(255,82,82,' + d.fx * 1.2 + ')'; g.fillRect(0, 0, a.W, a.H); }
    }
  });
  function mkh(a) {
    var d = a.data, L = d.LO;
    var pool = a.shuffle(ICONS.slice());
    d.target = pool[0];
    var n = Math.min(70, 22 + d.lv * 5);
    d.o = [];
    var m = L.is * .6;
    for (var i = 0; i < n; i++)
      d.o.push({ e: pool[1 + (i % (pool.length - 1))], x: a.rnd(m, a.W - m), y: a.rnd(L.hb + m, a.H - m), r: a.rnd(-.5, .5) });
    d.o.push({ e: d.target, x: a.rnd(m, a.W - m), y: a.rnd(L.hb + m, a.H - m), r: a.rnd(-.4, .4) });
    a.shuffle(d.o);
  }
})();
