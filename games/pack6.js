/* ============================================================
   PACK 6 — เกม 51-60  (ปริศนา / ใช้สมอง)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  /* กรอบตารางกลางจอ: คืน {s, ox, oy} */
  function gridBox(a, cols, rows, topPad, botPad) {
    var top = a.mn * (topPad === undefined ? .15 : topPad);
    var bot = a.mn * (botPad === undefined ? .06 : botPad);
    var s = Math.min((a.W - a.mn * .10) / cols, (a.H - top - bot) / rows);
    return { s: s, ox: (a.W - cols * s) / 2, oy: top + (a.H - top - bot - rows * s) / 2 };
  }

  /* ---------- 51 ดับไฟให้หมด ---------- */
  R('lightsout', {
    setup: function (a) { a.data.n = 4; a.data.lv = 1; mkLO(a); },
    down: function (x, y, a) {
      var d = a.data, L = d.LO, n = d.n;
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c >= n || r >= n) return;
      toggle(d, r, c, n); a.beep(520, .06); a.shake(.005, .1);
      a.puff(L.ox + (c + .5) * L.s, L.oy + (r + .5) * L.s, { n: 6, col: a.C.accent, spread: 3.14, spd: L.s * 2, size: L.s * .06, life: .35 });
      if (d.b.every(function (v) { return !v; })) {
        a.add(100); a.addTime(20); a.beep(1200, .3, 'triangle'); a.flash('#ffd23f', .22); a.shake(.014, .3); d.lv++; mkLO(a);
      }
    },
    draw: function (g, a) {
      a.bg('#120a2e', '#3a2a78');
      var d = a.data, L = d.LO, n = d.n, p = L.s * .07;
      for (var i = 0; i < n * n; i++) {
        var c = i % n, r = Math.floor(i / n);
        var on = d.b[i], cx = L.ox + (c + .5) * L.s, cy = L.oy + (r + .5) * L.s;
        var gl = on ? 1 + Math.sin(a.now * 4 + i) * .03 : 1;   // ดวงที่ติดหายใจเบา ๆ
        if (!a.spr(on ? 'lampOn' : 'lampOff', null, cx, cy, (L.s - p * 2) * gl)) {
          a.fillRR(L.ox + c * L.s + p, L.oy + r * L.s + p, L.s - p * 2, L.s - p * 2, L.s * .16, on ? a.C.accent : '#2a2450');
          if (on) { a.circle(cx, cy, L.s * .16, 'rgba(255,255,255,.55)'); }
        }
      }
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — กดให้ไฟดับทั้งหมด', en: 'Level ' + d.lv + ' — turn every light off' }));
    }
  });
  function mkLO(a) {
    var d = a.data, n = d.n;
    d.LO = gridBox(a, n, n);
    d.b = []; for (var i = 0; i < n * n; i++) d.b.push(0);
    var k = Math.min(10, 2 + d.lv);
    for (var j = 0; j < k; j++) toggle(d, a.rndi(0, n - 1), a.rndi(0, n - 1), n);
    if (d.b.every(function (v) { return !v; })) toggle(d, 0, 0, n);
  }
  function toggle(d, r, c, n) {
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (o) {
      var rr = r + o[0], cc = c + o[1];
      if (rr >= 0 && cc >= 0 && rr < n && cc < n) d.b[rr * n + cc] ^= 1;
    });
  }

  /* ---------- 52 หอคอยฮานอย ----------
     สัดส่วนยึดตามภาพปก (วัดจากไฟล์ 052.png): S = ความกว้างฉาก
     เสาห่างกัน .30S หนา .035S สูง .40S  ฐานกว้าง .97S สูง .08S
     จาน 4 ใบ กว้าง .16/.20/.25/.29S หนา .060/.068/.076/.084S  (DISC = สัดส่วนภาพจาน) */
  var DISC = 2.26;
  var HN = { gap: .30, pegW: .035, pegH: .40, baseW: .97, baseH: .08, dw: [.16, .20, .25, .29], dh: [.060, .068, .076, .084] };
  function hnX(a, p) { return a.W / 2 + (p - 1) * HN.gap * a.data.LO.S; }
  function hnDiscW(a, disc) { return HN.dw[disc - 1] * a.data.LO.S; }
  function hnDiscH(a, disc) { return HN.dh[disc - 1] * a.data.LO.S; }
  R('hanoi', {
    setup: function (a) {
      var N = 4;
      a.data.N = N; a.data.pegs = [[4, 3, 2, 1], [], []]; a.data.sel = -1; a.data.mv = 0;
      var S = Math.min(a.W, a.H * 1.5);   /* ความกว้างฉาก (แนวนอนจำกัดด้วยความสูงจอ) */
      a.data.LO = { S: S, base: a.H * (a.port ? .70 : .78), ph: HN.pegH * S };
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      var p = Math.max(0, Math.min(2, Math.round((x - a.W / 2) / (HN.gap * L.S)) + 1));
      if (d.sel < 0) { if (d.pegs[p].length) { d.sel = p; a.beep(600, .06); } return; }
      if (d.sel === p) { d.sel = -1; return; }
      var from = d.pegs[d.sel], to = d.pegs[p];
      var disc = from[from.length - 1];
      if (!to.length || to[to.length - 1] > disc) {
        from.pop(); to.push(disc); d.mv++; a.beep(760, .07); d.sel = -1; a.shake(.005, .1);
        a.puff(hnX(a, p), L.base - to.length * hnDiscH(a, 3), { n: 6, col: '#ffffff', spread: 3.14, spd: L.S * .2, size: L.S * .008, life: .35 });
        if (d.pegs[2].length === d.N) {
          a.flash('#ffd23f', .25); a.shake(.016, .35);
          a.setScore(Math.max(50, 400 - d.mv * 10));
          a.end(a.txt({ th: 'สำเร็จใน ' + d.mv + ' ตา!', en: 'Solved in ' + d.mv + ' moves!' }));
        }
      } else { a.beep(180, .16, 'square'); a.shake(.014, .2); a.flash('#ff4646', .12); d.sel = -1; }
    },
    draw: function (g, a) {
      a.bg('#3a1a0a', '#c8761e');
      var d = a.data, L = d.LO, S = L.S;
      /* ฐานยาวชิ้นเดียว: ผิวบนอยู่ที่ L.base */
      var bi = a.sprImg('base'), bw = HN.baseW * S, bh = HN.baseH * S;
      if (bi) g.drawImage(bi, a.W / 2 - bw / 2, L.base - bh * .22, bw, bh);
      else a.fillRR(a.W / 2 - bw / 2, L.base, bw, bh * .4, bh * .15, '#5a3a18');
      for (var p = 0; p < 3; p++) {
        var cx = hnX(a, p), pegW = HN.pegW * S, pi = a.sprImg('peg');
        var pegH = pi ? pegW * pi.height / pi.width : L.ph;
        if (!a.spr('peg', null, cx, L.base - pegH / 2 + pegW * .3, pegH)) a.fillRR(cx - pegW / 2, L.base - L.ph, pegW, L.ph, pegW / 2, '#5a3a18');
        if (d.sel === p) { g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .008; a.rr(cx - S * .16, L.base - pegH - a.mn * .03, S * .32, pegH + a.mn * .06, a.mn * .02); g.stroke(); }
        var y = L.base, topY = -1;
        d.pegs[p].forEach(function (disc, i) {
          var w = hnDiscW(a, disc), h = hnDiscH(a, disc), col = 'hsl(' + (disc * 55 + 190) + ',75%,58%)';
          var lift = (d.sel === p && i === d.pegs[p].length - 1) ? a.mn * .04 : 0;   // จานบนสุดที่เลือกยกขึ้น
          var dy = y - h * .5 - lift;
          if (!a.spr('d' + disc, null, cx, dy, h, { sx: w / (h * DISC) }))
            a.fillRR(cx - w / 2, dy - h / 2, w, h, h * .3, col);
          y -= h * .78;                       /* จานซ้อนกัน หน้าบนของใบล่างถูกใบบนบังบางส่วน */
          topY = dy - h * .18;
        });
        /* เสาโผล่ทะลุรูจานบนสุด */
        if (topY > 0) {
          g.save(); g.beginPath(); g.rect(cx - pegW, L.base - pegH - a.mn * .02, pegW * 2, topY - (L.base - pegH) + a.mn * .02); g.clip();
          if (!a.spr('peg', null, cx, L.base - pegH / 2 + pegW * .3, pegH)) a.fillRR(cx - pegW / 2, L.base - L.ph, pegW, L.ph, pegW / 2, '#5a3a18');
          g.restore();
        }
      }
      a.head(a.txt({ th: 'ย้ายทั้งกองไปเสาขวา • ตาที่ใช้ ' + d.mv, en: 'Move the stack to the right peg • ' + d.mv + ' moves' }));
    }
  });

  /* ---------- 53 เติมสีให้เต็ม ---------- */
  R('flood', {
    setup: function (a) { a.data.lv = 1; mkFlood(a); },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      for (var i = 0; i < 6; i++) {
        var b = fbtn(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          if (i === d.b[0]) return;
          fill(d, i); d.mv++; a.beep(560, .06); a.shake(.004, .1);
          a.puff(L.ox, L.oy, { n: 8, col: d.cols[i], spread: 1.6, ang: .78, spd: L.s * 6, size: L.s * .3, life: .4, grav: 0 });
          if (d.b.every(function (v) { return v === i; })) {
            a.add(150); a.addTime(20); a.beep(1200, .3, 'triangle'); a.flash('#ffd23f', .25); a.shake(.014, .3); d.lv++; mkFlood(a);
          } else if (d.mv >= d.max) { a.beep(180, .3, 'square'); a.shake(.03, .4); a.flash('#ff4646', .3); a.end(a.txt({ th: 'ใช้ตาครบแล้ว', en: 'Out of moves' })); }
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#0a2233', '#0d5c63');
      var d = a.data, L = d.LO, n = d.n;
      for (var i = 0; i < n * n; i++) {
        var c = i % n, r = Math.floor(i / n);
        a.fillRR(L.ox + c * L.s + 1, L.oy + r * L.s + 1, L.s - 2, L.s - 2, L.s * .12, d.cols[d.b[i]]);
      }
      for (var k = 0; k < 6; k++) {
        var b = fbtn(a, k);
        a.fillRR(b.x, b.y, b.w, b.h, b.h * .28, d.cols[k]);
        if (k === d.b[0]) { g.strokeStyle = '#fff'; g.lineWidth = a.mn * .008; a.rr(b.x, b.y, b.w, b.h, b.h * .28); g.stroke(); }
      }
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — เหลือ ' + (d.max - d.mv) + ' ตา', en: 'Level ' + d.lv + ' — ' + (d.max - d.mv) + ' moves left' }));
    }
  });
  function mkFlood(a) {
    var d = a.data;
    d.n = 9; d.cols = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a', '#ff6a3d', '#b06bff'];
    d.LO = gridBox(a, d.n, d.n, .15, .20);
    d.b = []; for (var i = 0; i < d.n * d.n; i++) d.b.push(a.rndi(0, 5));
    d.mv = 0; d.max = 24 - Math.min(8, d.lv);
  }
  function fbtn(a, i) {
    var w = Math.min(a.W * .13, a.mn * .12), gap = a.mn * .018;
    var tot = 6 * w + 5 * gap;
    return { x: (a.W - tot) / 2 + i * (w + gap), y: a.H - a.mn * .14, w: w, h: a.mn * .085 };
  }
  function fill(d, col) {
    var n = d.n, start = d.b[0], st = [0], seen = {};
    if (start === col) return;
    while (st.length) {
      var i = st.pop(); if (seen[i]) continue; seen[i] = 1;
      if (d.b[i] !== start) continue;
      d.b[i] = col;
      var c = i % n, r = Math.floor(i / n);
      if (c > 0) st.push(i - 1); if (c < n - 1) st.push(i + 1);
      if (r > 0) st.push(i - n); if (r < n - 1) st.push(i + n);
    }
  }

  /* ---------- 54 จับคู่สาม ---------- */
  R('match3', {
    setup: function (a) {
      var cols = a.port ? 6 : 8, rows = a.port ? 8 : 6;
      a.data.cols = cols; a.data.rows = rows;
      a.data.LO = gridBox(a, cols, rows);
      a.data.pal = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a', '#b06bff', '#ff6a3d'];
      a.data.b = []; a.data.sel = -1; a.data.fx = 0;
      do { for (var i = 0; i < cols * rows; i++) a.data.b[i] = a.rndi(0, 5); } while (findM(a.data).length);
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.fx > 0) { d.fx -= dt; if (d.fx > 0) return; resolve(a); }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.fx > 0) return;
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c >= d.cols || r >= d.rows) return;
      var i = r * d.cols + c;
      if (d.sel < 0) { d.sel = i; a.beep(520, .05); return; }
      var sc = d.sel % d.cols, sr = Math.floor(d.sel / d.cols);
      if (Math.abs(sc - c) + Math.abs(sr - r) === 1) {
        var t = d.b[i]; d.b[i] = d.b[d.sel]; d.b[d.sel] = t;
        if (findM(d).length) { a.beep(800, .08); d.fx = .18; }
        else { t = d.b[i]; d.b[i] = d.b[d.sel]; d.b[d.sel] = t; a.beep(180, .12, 'square'); a.shake(.012, .16); }
      }
      d.sel = -1;
    },
    draw: function (g, a) {
      a.bg('#1a0f3d', '#0d3b57');
      var d = a.data, L = d.LO, p = L.s * .08;
      var m = d.fx > 0 ? findM(d) : [];
      for (var i = 0; i < d.b.length; i++) {
        var c = i % d.cols, r = Math.floor(i / d.cols);
        var x = L.ox + c * L.s + p, y = L.oy + r * L.s + p, s = L.s - p * 2;
        var hit = m.indexOf(i) >= 0, sc = hit ? 1.18 : (i === d.sel ? 1.1 + Math.sin(a.now * 10) * .04 : 1);
        if (hit) { a.fillRR(x - p, y - p, s + p * 2, s + p * 2, L.s * .2, 'rgba(255,255,255,.55)'); }
        if (!a.spr('g' + (d.b[i] + 1), null, x + s / 2, y + s / 2, s * sc)) {
          a.fillRR(x, y, s, s, L.s * .2, d.pal[d.b[i]]);
          if (i === d.sel) { g.strokeStyle = '#fff'; g.lineWidth = a.mn * .008; a.rr(x, y, s, s, L.s * .2); g.stroke(); }
        } else if (i === d.sel) { g.strokeStyle = '#fff'; g.lineWidth = a.mn * .006; a.rr(x - p * .5, y - p * .5, s + p, s + p, L.s * .2); g.stroke(); }
      }
      a.head(a.txt({ th: 'แตะสองช่องที่ติดกันเพื่อสลับ', en: 'Tap two neighbours to swap' }));
    }
  });
  function findM(d) {
    var out = [], cols = d.cols, rows = d.rows, i, r, c, run, v;
    for (r = 0; r < rows; r++) { run = 1; for (c = 1; c <= cols; c++) {
      v = c < cols ? d.b[r * cols + c] : -1;
      if (v === d.b[r * cols + c - 1]) run++;
      else { if (run >= 3) for (i = c - run; i < c; i++) out.push(r * cols + i); run = 1; }
    } }
    for (c = 0; c < cols; c++) { run = 1; for (r = 1; r <= rows; r++) {
      v = r < rows ? d.b[r * cols + c] : -1;
      if (v === d.b[(r - 1) * cols + c]) run++;
      else { if (run >= 3) for (i = r - run; i < r; i++) out.push(i * cols + c); run = 1; }
    } }
    return out.filter(function (x, k) { return out.indexOf(x) === k; });
  }
  function resolve(a) {
    var d = a.data, m = findM(d), L = d.LO;
    if (!m.length) return;
    a.add(m.length * 10); a.shake(.008, .14);
    m.forEach(function (i) {
      a.puff(L.ox + (i % d.cols + .5) * L.s, L.oy + (Math.floor(i / d.cols) + .5) * L.s,
             { n: 5, col: d.pal[d.b[i]], spread: 3.14, spd: L.s * 3, size: L.s * .08, life: .45 });
      d.b[i] = -1;
    });
    for (var c = 0; c < d.cols; c++) {
      var col = [];
      for (var r = d.rows - 1; r >= 0; r--) if (d.b[r * d.cols + c] >= 0) col.push(d.b[r * d.cols + c]);
      for (var r2 = d.rows - 1; r2 >= 0; r2--) {
        var k = d.rows - 1 - r2;
        d.b[r2 * d.cols + c] = k < col.length ? col[k] : a.rndi(0, 5);
      }
    }
    a.beep(900, .08);
    if (findM(d).length) d.fx = .18;
  }

  /* ---------- 55 รวมเลข ---------- */
  R('merge', {
    time: 0,
    setup: function (a) {
      a.data.n = 4; a.data.LO = gridBox(a, 4, 4);
      a.data.b = []; for (var i = 0; i < 16; i++) a.data.b.push(0);
      spawn(a); spawn(a); a.data.sw = null;
    },
    down: function (x, y, a) { a.data.sw = { x: x, y: y }; },
    up: function (x, y, a) {
      var d = a.data; if (!d.sw) return;
      var dx = x - d.sw.x, dy = y - d.sw.y; d.sw = null;
      if (Math.abs(dx) < a.mn * .04 && Math.abs(dy) < a.mn * .04) return;
      var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u');
      if (slide(a, dir)) { spawn(a); a.beep(560, .06); a.shake(.004, .08); if (!canMove(a.data)) { a.beep(160, .3, 'square'); a.shake(.03, .4); a.flash('#ff4646', .3); a.end(a.txt({ th: 'เต็มกระดาน — ' + a.score + ' คะแนน', en: 'Board full — ' + a.score + ' points' })); } }
    },
    key: function (k, a) {
      var map = { ArrowLeft: 'l', ArrowRight: 'r', ArrowUp: 'u', ArrowDown: 'd' };
      if (map[k] && slide(a, map[k])) { spawn(a); if (!canMove(a.data)) a.end(); }
    },
    draw: function (g, a) {
      a.bg('#4a2b0a', '#c8761e');
      var d = a.data, L = d.LO, p = L.s * .05;
      a.fillRR(L.ox - p * 2, L.oy - p * 2, L.s * 4 + p * 4, L.s * 4 + p * 4, L.s * .12, 'rgba(0,0,0,.3)');
      for (var i = 0; i < 16; i++) {
        var c = i % 4, r = Math.floor(i / 4), v = d.b[i];
        var x = L.ox + c * L.s + p, y = L.oy + r * L.s + p, s = L.s - p * 2;
        var col = v ? 'hsl(' + ((Math.log2(v) * 32) % 360) + ',78%,58%)' : 'rgba(255,255,255,.12)';
        if (!v || !a.sprTint('tile', col, null, x + s / 2, y + s / 2, s)) a.fillRR(x, y, s, s, L.s * .1, col);
        if (v) {
          var fs = s * (v > 512 ? .28 : v > 64 ? .34 : .42);
          a.text(v + '', x + s / 2, y + s / 2, fs, '#fff');
        }
      }
      var best = 0; d.b.forEach(function (v) { if (v > best) best = v; });
      a.text(a.txt({ th: 'คะแนน ' + a.score + '  •  สูงสุด ' + best, en: 'Score ' + a.score + '  •  Best tile ' + best }),
        a.W / 2, L.oy + L.s * 4 + a.mn * .05, a.mn * .04, 'rgba(255,255,255,.9)');
      a.head(a.txt({ th: 'ปัดนิ้วเพื่อรวมเลขที่เท่ากัน', en: 'Swipe to merge equal tiles' }));
    }
  });
  function spawn(a) {
    var d = a.data, free = [];
    d.b.forEach(function (v, i) { if (!v) free.push(i); });
    if (free.length) d.b[a.pick(free)] = Math.random() < .9 ? 2 : 4;
  }
  function slide(a, dir) {
    var d = a.data, moved = false, gained = 0;
    function line(idx) {
      var vals = idx.map(function (i) { return d.b[i]; }).filter(function (v) { return v; });
      var out = [];
      for (var i = 0; i < vals.length; i++) {
        if (vals[i] === vals[i + 1]) { out.push(vals[i] * 2); gained += vals[i] * 2; i++; d.merged = (d.merged || 0) + 1; }
        else out.push(vals[i]);
      }
      while (out.length < 4) out.push(0);
      idx.forEach(function (i, k) { if (d.b[i] !== out[k]) moved = true; d.b[i] = out[k]; });
    }
    for (var k = 0; k < 4; k++) {
      var idx = [];
      for (var j = 0; j < 4; j++) {
        if (dir === 'l') idx.push(k * 4 + j);
        else if (dir === 'r') idx.push(k * 4 + (3 - j));
        else if (dir === 'u') idx.push(j * 4 + k);
        else idx.push((3 - j) * 4 + k);
      }
      line(idx);
    }
    if (gained) {
      a.add(gained);
      a.puff(a.W / 2, d.LO.oy + d.LO.s * 2, { n: 6 * Math.min(4, d.merged || 1), col: a.C.accent, spread: 3.14, spd: d.LO.s * 3, size: d.LO.s * .07, life: .5 });
      if (gained >= 128) a.flash('#ffd23f', .16);
    }
    d.merged = 0;
    return moved;
  }
  function canMove(d) {
    for (var i = 0; i < 16; i++) {
      if (!d.b[i]) return true;
      var c = i % 4, r = Math.floor(i / 4);
      if (c < 3 && d.b[i] === d.b[i + 1]) return true;
      if (r < 3 && d.b[i] === d.b[i + 4]) return true;
    }
    return false;
  }

  /* ---------- 56 เทน้ำแยกสี ----------  TUBE = สัดส่วนภาพหลอด กว้าง:สูง (วัดจากไฟล์) */
  var TUBE = 0.229;
  R('watersort', {
    time: 0,
    setup: function (a) { a.data.lv = 1; mkTubes(a); a.data.sel = -1; },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      for (var i = 0; i < d.t.length; i++) {
        var b = tube(a, i);
        if (x > b.x - L.gap * .4 && x < b.x + L.tw + L.gap * .4 && y > b.y - a.mn * .04 && y < b.y + L.th + a.mn * .04) {
          if (d.sel < 0) { if (d.t[i].length) { d.sel = i; a.beep(600, .05); } return; }
          if (d.sel === i) { d.sel = -1; return; }
          pour(a, d.sel, i); d.sel = -1; return;
        }
      }
      d.sel = -1;
    },
    draw: function (g, a) {
      a.bg('#0a2a4e', '#1b6ca8');
      var d = a.data, L = d.LO;
      for (var i = 0; i < d.t.length; i++) {
        var b = tube(a, i), lift = d.sel === i ? a.mn * .03 : 0;
        var art = a.hasSpr('tube');
        if (!art) a.fillRR(b.x, b.y - lift, L.tw, L.th, L.tw * .3, 'rgba(255,255,255,.16)');
        /* น้ำสี: ตัดตามรูปด้านในหลอด (ก้นกลม) แต่ละชั้นเป็นแถบเต็ม มีเส้นบางคั่น */
        var ix0 = b.x + L.tw * .15, ix1 = b.x + L.tw * .85, iy0 = b.y - lift, iy1 = b.y - lift + L.th * .965, ir = (ix1 - ix0) / 2;
        g.save(); g.beginPath();
        g.moveTo(ix0, iy0); g.lineTo(ix0, iy1 - ir); g.arc(ix0 + ir, iy1 - ir, ir, Math.PI, 0, true); g.lineTo(ix1, iy0); g.closePath(); g.clip();
        d.t[i].forEach(function (c, k) {
          var hh = (L.th * .965) / L.cap, y1 = iy1 - k * hh;
          g.fillStyle = d.pal[c]; g.fillRect(ix0, y1 - hh, ix1 - ix0, hh + 1);
          if (k) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(ix0, y1 - 1, ix1 - ix0, 2); }
        });
        /* ไฮไลต์แนวตั้งบนผิวน้ำ */
        if (d.t[i].length) { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(ix0 + (ix1 - ix0) * .12, iy1 - d.t[i].length * (L.th * .965 / L.cap), (ix1 - ix0) * .12, L.th); }
        g.restore();
        /* หลอดแก้ว วาดทับน้ำ ยืดให้พอดี tw x th */
        if (art) a.spr('tube', null, b.x + L.tw / 2, b.y - lift + L.th / 2, L.th, { sx: L.tw / (L.th * TUBE) });
        g.strokeStyle = d.sel === i ? a.C.accent : (art ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,.4)');
        g.lineWidth = a.mn * .006; a.rr(b.x, b.y - lift, L.tw, L.th, L.tw * .3); g.stroke();
      }
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — แตะหลอดต้นทางแล้วหลอดปลายทาง', en: 'Level ' + d.lv + ' — tap source tube, then target' }));
    }
  });
  function mkTubes(a) {
    var d = a.data;
    d.pal = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a', '#b06bff'];
    var nCol = Math.min(5, 3 + Math.floor(d.lv / 2)), cap = 4;
    var pool = [];
    for (var c = 0; c < nCol; c++) for (var k = 0; k < cap; k++) pool.push(c);
    a.shuffle(pool);
    d.t = [];
    for (var i = 0; i < nCol; i++) d.t.push(pool.slice(i * cap, (i + 1) * cap));
    d.t.push([]); d.t.push([]);
    var n = d.t.length;
    var tw = Math.min((a.W * .88) / n * .7, a.mn * .12);
    var gap = ((a.W * .88) - tw * n) / (n - 1);
    var th = Math.min(a.H * .38, a.mn * .55);
    d.LO = { tw: tw, gap: gap, cap: cap, th: th, oy: a.mn * .14 + (a.H - a.mn * .2 - th) / 2, ox: a.W * .06 };
  }
  function tube(a, i) { var L = a.data.LO; return { x: L.ox + i * (L.tw + L.gap), y: L.oy }; }
  function pour(a, from, to) {
    var d = a.data, L = d.LO, F = d.t[from], T = d.t[to];
    if (!F.length || T.length >= L.cap) { a.beep(180, .12, 'square'); a.shake(.01, .14); return; }
    var col = F[F.length - 1];
    if (T.length && T[T.length - 1] !== col) { a.beep(180, .12, 'square'); a.shake(.01, .14); return; }
    var n = 0;
    while (F.length && F[F.length - 1] === col && T.length + n < L.cap) { F.pop(); n++; }
    for (var i = 0; i < n; i++) T.push(col);
    a.add(n * 5); a.beep(700, .08); a.shake(.004, .1);
    var tb = tube(a, to);
    a.puff(tb.x + L.tw / 2, tb.y + L.th - T.length * (L.th / L.cap), { n: 6, col: d.pal[col], spread: 2.4, spd: L.tw * 2, size: L.tw * .08, life: .4 });
    var done = d.t.every(function (t) { return !t.length || (t.length === L.cap && t.every(function (v) { return v === t[0]; })); });
    if (done) { a.add(120); a.beep(1200, .3, 'triangle'); a.flash('#ffd23f', .25); a.shake(.014, .3); d.lv++; mkTubes(a); }
  }

  /* ---------- 57 ต่อท่อ ----------
     ภาพท่อ 5 แบบ วาดในท่าเริ่มต้นแล้วโค้ดหมุนให้  (บิต 1=บน 2=ขวา 4=ล่าง 8=ซ้าย)
     straight = แนวตั้ง (บน-ล่าง)   elbow = บน+ขวา   tee = บน+ขวา+ล่าง   end = โผล่ด้านบน
     ค่าในตาราง = [ชื่อภาพ, จำนวนครั้งที่หมุนตามเข็ม 90°] */
  var PIPE_MAP = {
    5: ['straight', 0], 10: ['straight', 1],
    3: ['elbow', 0], 6: ['elbow', 1], 12: ['elbow', 2], 9: ['elbow', 3],
    7: ['tee', 0], 14: ['tee', 1], 13: ['tee', 2], 11: ['tee', 3],
    15: ['cross', 0],
    1: ['end', 0], 2: ['end', 1], 4: ['end', 2], 8: ['end', 3]
  };
  R('pipe', {
    setup: function (a) { a.data.lv = 1; a.data.win = null; mkPipe(a); },
    update: function (dt, a) {
      var d = a.data, L = d.LO, n = d.n, w = d.win; if (!w) return;
      w.t += dt;
      /* น้ำไหลไปตามท่อ ถึงท่อระบายแล้วค้างแป๊บ ค่อยไปด่านถัดไป */
      var prog = Math.min(1, w.t / 1.4);
      if (prog >= 1 && !w.done) {
        w.done = 1; a.beep(1200, .3, 'triangle'); a.flash('#2fe08a', .25); a.shake(.014, .3);
        a.puff(L.ox + (n - .5) * L.s, L.oy + (n - .5) * L.s, { n: 18, col: '#7ec8ff', spread: 3.14, spd: L.s * 3, size: L.s * .08, life: .7 });
      } else if (!w.done && Math.random() < dt * 30) {
        var pt = flowPoint(d, prog);
        a.puff(pt.x, pt.y, { n: 1, col: 'rgba(200,240,255,.8)', spread: 6.28, spd: L.s * .6, size: L.s * .04, life: .35, grav: 0 });
      }
      if (w.t > 2.4) { d.win = null; d.lv++; mkPipe(a); }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO, n = d.n;
      if (d.win) return;
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c >= n || r >= n) return;
      var cell = d.g[r][c]; if (!cell.m) return;
      cell.m = ((cell.m << 1) | (cell.m >> 3)) & 15;
      a.beep(520, .05); a.shake(.004, .08);
      var path = connected(d, true);
      if (path) {
        a.add(120); a.addTime(25); a.beep(900, .15);
        d.win = { t: 0, path: path, done: 0 };
      }
    },
    draw: function (g, a) {
      a.bg('#08243a', '#0d4a5e');
      var d = a.data, L = d.LO, n = d.n, ok = !!d.win;
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
        var x = L.ox + c * L.s, y = L.oy + r * L.s, cell = d.g[r][c];
        a.fillRR(x + 1, y + 1, L.s - 2, L.s - 2, L.s * .1, 'rgba(255,255,255,.06)');
        if (!cell.m) continue;
        var cx = x + L.s / 2, cy = y + L.s / 2, w = L.s * .22;
        var dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        var pc = PIPE_MAP[cell.m], art = pc && a.hasSpr(pc[0]);
        if (ok || !art) {
          /* เชื่อมสำเร็จ: วาดแสงเขียวใต้ท่อ / ไม่มีภาพ: วาดท่อด้วยเส้น */
          g.strokeStyle = ok ? a.C.good : a.C.secondary; g.lineWidth = art ? w * 1.5 : w; g.lineCap = 'round';
          if (art) g.globalAlpha = .55;
          for (var b = 0; b < 4; b++) if (cell.m & (1 << b)) {
            g.beginPath(); g.moveTo(cx, cy);
            g.lineTo(cx + dirs[b][0] * L.s * .5, cy + dirs[b][1] * L.s * .5); g.stroke();
          }
          g.globalAlpha = 1;
        }
        if (art) a.spr(pc[0], null, cx, cy, L.s, { rot: pc[1] * Math.PI / 2 });
        if (r === 0 && c === 0) { if (!a.spr('tap', null, cx, cy, L.s * .8)) a.circle(cx, cy, L.s * .2, a.C.good); }
        if (r === n - 1 && c === n - 1) { if (!a.spr('drain', null, cx, cy, L.s * .8)) a.circle(cx, cy, L.s * .2, a.C.bad); }
      }
      /* น้ำไหลตามเส้นทางท่อตอนชนะ */
      if (d.win) {
        var prog = Math.min(1, d.win.t / 1.4), pts = d.win.path, w2 = L.s * .17;
        var total = (pts.length - 1) * L.s, len = total * prog, acc = 0;
        g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
        [[w2 * 1.6, 'rgba(40,120,220,.9)'], [w2 * .8, 'rgba(160,230,255,.95)']].forEach(function (st) {
          g.strokeStyle = st[1]; g.lineWidth = st[0]; g.beginPath();
          g.moveTo(L.ox + (pts[0][1] + .5) * L.s, L.oy + (pts[0][0] + .5) * L.s);
          acc = 0;
          for (var i = 1; i < pts.length; i++) {
            var x0 = L.ox + (pts[i - 1][1] + .5) * L.s, y0 = L.oy + (pts[i - 1][0] + .5) * L.s;
            var x1 = L.ox + (pts[i][1] + .5) * L.s, y1 = L.oy + (pts[i][0] + .5) * L.s;
            if (acc + L.s <= len) { g.lineTo(x1, y1); acc += L.s; }
            else { var f = (len - acc) / L.s; g.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f); break; }
          }
          g.stroke();
        });
        g.restore();
        if (d.win.done) a.text(a.txt({ th: 'น้ำไหลถึงแล้ว! +120', en: 'Water through! +120' }), a.W / 2, L.oy + n * L.s + a.mn * .05, a.mn * .05, a.C.good);
      }
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — หมุนท่อให้เชื่อมเขียวถึงแดง', en: 'Level ' + d.lv + ' — connect green to red' }));
    }
  });
  /* ตำแหน่งบนเส้นทางน้ำที่สัดส่วน prog (0-1) */
  function flowPoint(d, prog) {
    var L = d.LO, pts = d.win.path, t = prog * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(t)), f = t - i;
    return { x: L.ox + (pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f + .5) * L.s, y: L.oy + (pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f + .5) * L.s };
  }
  function mkPipe(a) {
    var d = a.data;
    d.n = Math.min(6, 4 + Math.floor(d.lv / 2));
    var n = d.n;
    d.LO = gridBox(a, n, n);
    d.g = []; for (var r = 0; r < n; r++) { d.g[r] = []; for (var c = 0; c < n; c++) d.g[r][c] = { m: 0 }; }
    /* สุ่มเส้นทางเดินจาก (0,0) ไป (n-1,n-1) */
    var r0 = 0, c0 = 0;
    while (r0 < n - 1 || c0 < n - 1) {
      var goRight = c0 < n - 1 && (r0 === n - 1 || Math.random() < .5);
      if (goRight) { d.g[r0][c0].m |= 2; d.g[r0][c0 + 1].m |= 8; c0++; }
      else { d.g[r0][c0].m |= 4; d.g[r0 + 1][c0].m |= 1; r0++; }
    }
    /* ใส่ท่อหลอกเพิ่มเล็กน้อย */
    for (var k = 0; k < n; k++) {
      var rr = a.rndi(0, n - 1), cc = a.rndi(0, n - 1);
      if (!d.g[rr][cc].m) d.g[rr][cc].m = a.pick([3, 6, 12, 9, 5, 10]);
    }
    /* สุ่มหมุนทุกชิ้น */
    for (var r2 = 0; r2 < n; r2++) for (var c2 = 0; c2 < n; c2++) {
      var t = a.rndi(0, 3), m = d.g[r2][c2].m;
      for (var i = 0; i < t; i++) m = ((m << 1) | (m >> 3)) & 15;
      d.g[r2][c2].m = m;
    }
    if (connected(d)) d.g[0][0].m = ((d.g[0][0].m << 1) | (d.g[0][0].m >> 3)) & 15;
  }
  /* เชื่อมถึงกันไหม  withPath = true จะคืนลำดับช่องจากก๊อกถึงท่อระบาย (ใช้วาดน้ำไหล) */
  function connected(d, withPath) {
    var n = d.n, seen = {}, st = [[0, 0]], par = {};
    var dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], opp = [4, 8, 1, 2];
    if (!d.g[0][0].m) return false;
    while (st.length) {
      var p = st.shift(), r = p[0], c = p[1], key = r + ',' + c;
      if (seen[key]) continue; seen[key] = 1;
      if (r === n - 1 && c === n - 1) {
        if (!withPath) return true;
        var path = [], k = key;
        while (k) { var q = k.split(','); path.unshift([+q[0], +q[1]]); k = par[k]; }
        return path;
      }
      for (var b = 0; b < 4; b++) {
        if (!(d.g[r][c].m & (1 << b))) continue;
        var nr = r + dirs[b][1], nc = c + dirs[b][0];
        if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
        var nk = nr + ',' + nc;
        if ((d.g[nr][nc].m & opp[b]) && !seen[nk]) { if (!(nk in par)) par[nk] = key; st.push([nr, nc]); }
      }
    }
    return false;
  }

  /* ---------- 58 เก็บกู้ระเบิด ---------- */
  R('minesweep', {
    setup: function (a) {
      a.data.n = 6; a.data.mines = 6; a.data.flagMode = false; mkMine(a);
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO, n = d.n;
      var fb = fmBtn(a);
      if (x > fb.x && x < fb.x + fb.w && y > fb.y && y < fb.y + fb.h) { d.flagMode = !d.flagMode; a.beep(500, .06); return; }
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c >= n || r >= n) return;
      var i = r * n + c;
      if (d.flagMode) { if (!d.open[i]) { d.flag[i] ^= 1; a.beep(700, .05); } return; }
      if (d.flag[i] || d.open[i]) return;
      if (d.mine[i]) {
        a.beep(140, .4, 'sawtooth'); d.boom = 1; for (var k = 0; k < n * n; k++) if (d.mine[k]) d.open[k] = 1;
        a.shake(.05, .6); a.flash('#ff4646', .35);
        a.puff(L.ox + (c + .5) * L.s, L.oy + (r + .5) * L.s, { n: 24, col: '#ff8a3d', spread: 3.14, spd: L.s * 8, size: L.s * .14, life: .8 });
        a.end(a.txt({ th: 'โดนระเบิด!', en: 'Boom!' })); return;
      }
      openCell(d, i); a.beep(620, .05); a.shake(.004, .08);
      var safe = 0; for (var q = 0; q < n * n; q++) if (d.open[q]) safe++;
      if (safe === n * n - d.mines) { a.add(200); a.beep(1200, .3, 'triangle'); a.flash('#ffd23f', .3); a.shake(.014, .3); a.end(a.txt({ th: 'เก็บกู้สำเร็จ!', en: 'All clear!' })); }
    },
    draw: function (g, a) {
      a.bg('#161a33', '#0d3b57');
      var d = a.data, L = d.LO, n = d.n;
      var numCol = ['#00d4ff', '#2fe08a', '#ffd23f', '#ff6a3d', '#ff2e88', '#b06bff', '#fff', '#fff'];
      for (var i = 0; i < n * n; i++) {
        var c = i % n, r = Math.floor(i / n);
        var x = L.ox + c * L.s + 2, y = L.oy + r * L.s + 2, s = L.s - 4;
        if (d.open[i]) {
          a.fillRR(x, y, s, s, L.s * .1, d.mine[i] ? a.C.bad : 'rgba(255,255,255,.16)');
          if (d.mine[i]) { if (!a.spr('mine', null, x + s / 2, y + s / 2, s * .8)) a.text('✸', x + s / 2, y + s / 2, s * .5, '#fff'); }
          else if (d.num[i]) a.text(d.num[i] + '', x + s / 2, y + s / 2, s * .5, numCol[d.num[i] - 1]);
        } else {
          if (!a.spr('tile', null, x + s / 2, y + s / 2, s)) a.fillRR(x, y, s, s, L.s * .1, '#3a4a7a');
          if (d.flag[i] && !a.spr('flag', null, x + s / 2, y + s / 2, s * .7)) a.text('⚑', x + s / 2, y + s / 2, s * .5, a.C.accent);
        }
      }
      var fb = fmBtn(a);
      a.fillRR(fb.x, fb.y, fb.w, fb.h, fb.h * .3, d.flagMode ? a.C.accent : 'rgba(255,255,255,.16)');
      a.text(d.flagMode ? '⚑ ' + a.txt({ th: 'ปักธง', en: 'FLAG' }) : '⛏ ' + a.txt({ th: 'ขุด', en: 'DIG' }),
        fb.x + fb.w / 2, fb.y + fb.h / 2, a.mn * .04, d.flagMode ? '#3a2a00' : '#fff');
      a.head(a.txt({ th: 'ระเบิด ' + d.mines + ' ลูก — เปิดช่องปลอดภัยให้ครบ', en: d.mines + ' mines — clear every safe square' }));
    }
  });
  function mkMine(a) {
    var d = a.data, n = d.n;
    d.LO = gridBox(a, n, n, .15, .17);
    d.mine = []; d.open = []; d.flag = []; d.num = [];
    for (var i = 0; i < n * n; i++) { d.mine.push(0); d.open.push(0); d.flag.push(0); d.num.push(0); }
    var placed = 0;
    while (placed < d.mines) { var k = a.rndi(0, n * n - 1); if (!d.mine[k]) { d.mine[k] = 1; placed++; } }
    for (var j = 0; j < n * n; j++) {
      var c = j % n, r = Math.floor(j / n), cnt = 0;
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        var rr = r + dr, cc = c + dc;
        if (rr >= 0 && cc >= 0 && rr < n && cc < n && d.mine[rr * n + cc]) cnt++;
      }
      d.num[j] = cnt;
    }
  }
  function openCell(d, i) {
    var n = d.n, st = [i];
    while (st.length) {
      var k = st.pop();
      if (d.open[k] || d.flag[k] || d.mine[k]) continue;
      d.open[k] = 1;
      if (d.num[k]) continue;
      var c = k % n, r = Math.floor(k / n);
      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
        var rr = r + dr, cc = c + dc;
        if (rr >= 0 && cc >= 0 && rr < n && cc < n) st.push(rr * n + cc);
      }
    }
  }
  function fmBtn(a) { var w = Math.min(a.W * .4, a.mn * .34); return { x: (a.W - w) / 2, y: a.H - a.mn * .12, w: w, h: a.mn * .08 }; }

  /* ---------- 59 ซูโดกุ 4×4 ---------- */
  R('sudoku4', {
    setup: function (a) { mkSud(a); a.data.sel = -1; },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      for (var k = 0; k < 4; k++) {
        var b = numBtn(a, k);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          if (d.sel >= 0 && !d.fixed[d.sel]) {
            d.b[d.sel] = d.b[d.sel] === k + 1 ? 0 : k + 1; a.beep(620, .05); a.shake(.004, .08);
            a.puff(L.ox + (d.sel % 4 + .5) * L.s, L.oy + (Math.floor(d.sel / 4) + .5) * L.s, { n: 6, col: '#ffffff', spread: 3.14, spd: L.s * 2, size: L.s * .06, life: .35 });
            if (solved(d)) { a.add(250); a.beep(1200, .35, 'triangle'); a.flash('#ffd23f', .3); a.shake(.014, .3); a.end(a.txt({ th: 'ถูกต้องทั้งหมด!', en: 'Solved!' })); }
          }
          return;
        }
      }
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c > 3 || r > 3) return;
      var i = r * 4 + c;
      d.sel = d.fixed[i] ? -1 : i;
    },
    draw: function (g, a) {
      a.bg('#0d2b40', '#177a63');
      var d = a.data, L = d.LO;
      a.fillRR(L.ox - L.s * .06, L.oy - L.s * .06, L.s * 4.12, L.s * 4.12, L.s * .1, 'rgba(255,255,255,.10)');
      for (var i = 0; i < 16; i++) {
        var c = i % 4, r = Math.floor(i / 4);
        var x = L.ox + c * L.s, y = L.oy + r * L.s;
        var box = (Math.floor(r / 2) + Math.floor(c / 2)) % 2;
        a.fillRR(x + 2, y + 2, L.s - 4, L.s - 4, L.s * .08, i === d.sel ? a.C.accent : (box ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.07)'));
        if (d.b[i]) {
          var pp = i === d.sel ? 1 + Math.sin(a.now * 8) * .04 : 1;
          if (!a.spr('s' + d.b[i], null, x + L.s / 2, y + L.s / 2, L.s * .62 * pp, { alpha: d.fixed[i] ? 1 : .85 }))
            a.text(d.b[i] + '', x + L.s / 2, y + L.s / 2, L.s * .5, d.fixed[i] ? '#fff' : (i === d.sel ? '#3a2a00' : a.C.secondary));
        }
      }
      for (var k = 0; k < 4; k++) {
        var b = numBtn(a, k);
        a.fillRR(b.x, b.y, b.w, b.h, b.h * .25, 'rgba(255,255,255,.9)');
        if (!a.spr('s' + (k + 1), null, b.x + b.w / 2, b.y + b.h / 2, b.h * .72)) a.text((k + 1) + '', b.x + b.w / 2, b.y + b.h / 2, b.h * .5, a.C.dark);
      }
      a.head(a.hasSpr('s1') ? a.txt({ th: 'เติมสัญลักษณ์ 4 แบบ ห้ามซ้ำในแถว หลัก และกล่อง', en: 'Place the 4 symbols — no repeats in row, column or box' })
                             : a.txt({ th: 'เติม 1-4 ห้ามซ้ำในแถว หลัก และกล่อง', en: 'Fill 1-4 — no repeats in row, column or box' }));
    }
  });
  function numBtn(a, k) {
    var w = Math.min(a.W * .18, a.mn * .13), gap = a.mn * .025, tot = 4 * w + 3 * gap;
    return { x: (a.W - tot) / 2 + k * (w + gap), y: a.H - a.mn * .13, w: w, h: a.mn * .09 };
  }
  function mkSud(a) {
    var d = a.data;
    d.LO = gridBox(a, 4, 4, .15, .18);
    var base = [1, 2, 3, 4];
    a.shuffle(base);
    var rows = [
      [base[0], base[1], base[2], base[3]],
      [base[2], base[3], base[0], base[1]],
      [base[1], base[0], base[3], base[2]],
      [base[3], base[2], base[1], base[0]]
    ];
    if (Math.random() < .5) { var t = rows[0]; rows[0] = rows[1]; rows[1] = t; }
    if (Math.random() < .5) { var t2 = rows[2]; rows[2] = rows[3]; rows[3] = t2; }
    d.sol = []; rows.forEach(function (r) { r.forEach(function (v) { d.sol.push(v); }); });
    d.b = d.sol.slice(); d.fixed = [];
    var idx = []; for (var i = 0; i < 16; i++) idx.push(i);
    a.shuffle(idx);
    for (var k = 0; k < 9; k++) d.b[idx[k]] = 0;
    for (var j = 0; j < 16; j++) d.fixed.push(d.b[j] ? 1 : 0);
  }
  function solved(d) { for (var i = 0; i < 16; i++) if (d.b[i] !== d.sol[i]) return false; return true; }

  /* ---------- 60 เรียงตัวเลข ---------- */
  R('sequence', {
    setup: function (a) { a.data.lv = 1; mkSeq(a); a.data.fx = 0; },
    update: function (dt, a) { if (a.data.fx > 0) a.data.fx -= dt; },
    down: function (x, y, a) {
      var d = a.data;
      for (var i = 0; i < d.p.length; i++) {
        var p = d.p[i];
        if (p.done) continue;
        if (Math.hypot(x - p.x, y - p.y) < d.r) {
          if (p.n === d.next) {
            p.done = 1; d.next++; a.add(10); a.beep(500 + d.next * 40, .07); a.shake(.004, .08);
            a.puff(p.x, p.y, { n: 6, col: a.C.accent, spread: 3.14, spd: d.r * 4, size: d.r * .12, life: .4 });
            if (d.next > d.count) { a.add(50); a.addTime(8); a.flash('#ffd23f', .22); a.shake(.014, .3); d.lv++; mkSeq(a); }
          } else { a.add(-5); a.beep(180, .15, 'square'); d.fx = .25; a.shake(.016, .2); }
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#2a1150', '#0d5c8f');
      var d = a.data;
      d.p.forEach(function (p) {
        if (p.done) { a.circle(p.x, p.y, d.r * .8, 'rgba(255,255,255,.14)'); return; }
        var nx = p.n === d.next, sc = nx ? 1 + Math.sin(a.now * 6) * .05 : 1;
        if (!a.sprTint('dot', nx ? a.C.accent : '#ffffff', null, p.x, p.y, d.r * 2.1 * sc)) a.circle(p.x, p.y, d.r, nx ? a.C.accent : '#ffffff');
        a.text(p.n + '', p.x, p.y, d.r * .82, a.C.dark);
      });
      a.head(a.txt({ th: 'รอบ ' + d.lv + ' — แตะเลข ' + d.next + ' ต่อไป', en: 'Round ' + d.lv + ' — tap number ' + d.next }));
      if (d.fx > 0) { g.fillStyle = 'rgba(255,82,82,' + d.fx * 1.2 + ')'; g.fillRect(0, 0, a.W, a.H); }
    }
  });
  function mkSeq(a) {
    var d = a.data;
    d.count = Math.min(20, 8 + d.lv * 2);
    d.r = Math.max(a.mn * .04, Math.min(a.mn * .062, Math.sqrt(a.W * (a.H - a.mn * .18) / d.count) * .32));
    d.next = 1; d.p = [];
    var top = a.mn * .16;
    for (var n = 1; n <= d.count; n++) {
      var tries = 0, x, y, ok;
      do {
        x = a.rnd(d.r * 1.2, a.W - d.r * 1.2);
        y = a.rnd(top + d.r * 1.2, a.H - d.r * 1.2);
        ok = d.p.every(function (q) { return Math.hypot(q.x - x, q.y - y) > d.r * 2.2; });
      } while (!ok && ++tries < 60);
      d.p.push({ n: n, x: x, y: y, done: 0 });
    }
    a.shuffle(d.p);
  }
})();
