/* ============================================================
   PACK 4 — เกม 31-40
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }
  /* ระยะจากจุด p ถึงเส้นตรง ab */
  function segDist(px, py, ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
    var t = l ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l)) : 0;
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  /* ---------- 31 ปาดผลไม้ ---------- */
  R('fruitninja', {
    setup: function (a) {
      a.data.LO = { r: a.mn * .055, G: a.mn * 1.55 };
      a.data.f = []; a.data.sp = .3; a.data.trail = []; a.data.flash = 0; a.data.combo = 0;
      a.data.kinds = ['🍉', '🍎', '🍊', '🍇', '🍓', '🥝', '🍍'];
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.sp -= dt;
      if (d.sp <= 0) {
        var n = a.rndi(1, 3);
        for (var i = 0; i < n; i++) {
          var bomb = Math.random() < .18;
          d.f.push({
            x: a.rnd(a.W * .15, a.W * .85), y: a.H + L.r,
            vx: a.rnd(-a.mn * .18, a.mn * .18), vy: -a.rnd(a.mn * .95, a.mn * 1.25),
            e: bomb ? '💣' : a.pick(d.kinds), b: bomb, rot: a.rnd(0, 6.28), vr: a.rnd(-4, 4), cut: 0
          });
        }
        d.sp = a.rnd(.55, 1.0);
      }
      d.f.forEach(function (o) { o.vy += L.G * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.rot += o.vr * dt; });
      d.f = d.f.filter(function (o) { return o.y < a.H + L.r * 4; });
      d.trail.forEach(function (p) { p.t -= dt; });
      d.trail = d.trail.filter(function (p) { return p.t > 0; });
      if (d.flash > 0) d.flash -= dt;
      if (d.combo > 0) d.combo -= dt;
    },
    down: function (x, y, a) { a.data.trail = [{ x: x, y: y, t: .28 }]; },
    move: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (!a.pointer.down) return;
      var last = d.trail[d.trail.length - 1];
      d.trail.push({ x: x, y: y, t: .28 });
      if (d.trail.length > 14) d.trail.shift();
      if (!last) return;
      var hits = 0;
      for (var i = d.f.length - 1; i >= 0; i--) {
        var o = d.f[i];
        if (o.cut) continue;
        if (segDist(o.x, o.y, last.x, last.y, x, y) < L.r) {
          o.cut = 1;
          if (o.b) { a.add(-30); d.flash = .3; a.beep(110, .3, 'sawtooth'); }
          else { hits++; a.beep(700 + hits * 120, .07); }
          d.f.splice(i, 1);
        }
      }
      if (hits) { a.add(10 * hits * (hits > 1 ? 2 : 1)); if (hits > 1) d.combo = .8; }
    },
    up: function (x, y, a) { a.data.trail = []; },
    draw: function (g, a) {
      a.bg('#3a0b4a', '#c81d6b');
      var d = a.data, L = d.LO;
      d.f.forEach(function (o) {
        g.save(); g.translate(o.x, o.y); g.rotate(o.rot); EM(g, o.e, 0, 0, L.r * 2); g.restore();
      });
      if (d.trail.length > 1) {
        g.lineCap = 'round'; g.lineJoin = 'round';
        for (var i = 1; i < d.trail.length; i++) {
          g.strokeStyle = 'rgba(255,255,255,' + (i / d.trail.length * .9) + ')';
          g.lineWidth = a.mn * .012 * (i / d.trail.length) + 2;
          g.beginPath(); g.moveTo(d.trail[i - 1].x, d.trail[i - 1].y); g.lineTo(d.trail[i].x, d.trail[i].y); g.stroke();
        }
      }
      if (d.combo > 0) a.text('COMBO x2', a.W / 2, a.H * .3, a.mn * .07, a.C.accent);
      if (d.flash > 0) { g.fillStyle = 'rgba(255,82,82,' + d.flash * 1.6 + ')'; g.fillRect(0, 0, a.W, a.H); }
      a.head(a.txt({ th: 'ลากนิ้วฟันผลไม้ • เลี่ยงระเบิด', en: 'Swipe the fruit • avoid bombs' }));
    }
  });

  /* ---------- 32 บีบพลาสติกกันกระแทก ---------- */
  R('bubblewrap', {
    setup: function (a) { a.data.lv = 1; sheet(a); },
    down: function (x, y, a) { pop(x, y, a); },
    move: function (x, y, a) { if (a.pointer.down) pop(x, y, a); },
    draw: function (g, a) {
      a.bg('#1b6ca8', '#7b2ff7');
      var d = a.data, L = d.LO;
      a.fillRR(L.ox - L.s * .3, L.oy - L.s * .3, L.cols * L.s + L.s * .6, L.rows * L.s + L.s * .6, L.s * .3, 'rgba(255,255,255,.10)');
      for (var i = 0; i < d.b.length; i++) {
        var c = i % L.cols, r = Math.floor(i / L.cols);
        var cx = L.ox + (c + .5) * L.s, cy = L.oy + (r + .5) * L.s;
        if (d.b[i]) {
          a.circle(cx, cy, L.s * .40, 'rgba(255,255,255,.22)');
          g.beginPath(); g.arc(cx - L.s * .1, cy - L.s * .12, L.s * .12, 0, 6.29);
          g.fillStyle = 'rgba(255,255,255,.5)'; g.fill();
        } else {
          a.circle(cx, cy, L.s * .30, 'rgba(0,0,0,.22)');
        }
      }
      a.head(a.txt({ th: 'แผ่นที่ ' + d.lv + ' — กดให้แตกทุกเม็ด', en: 'Sheet ' + d.lv + ' — pop them all' }));
    }
  });
  function sheet(a) {
    var d = a.data, cols = 5 + d.lv, rows = Math.round(cols * (a.H - a.mn * .2) / a.W);
    rows = Math.max(3, rows);
    var s = Math.min((a.W * .9) / cols, (a.H - a.mn * .22) / rows);
    d.LO = { cols: cols, rows: rows, s: s, ox: (a.W - cols * s) / 2, oy: a.mn * .16 + (a.H - a.mn * .16 - rows * s) / 2 };
    d.b = []; for (var i = 0; i < cols * rows; i++) d.b.push(1);
    d.left = cols * rows;
  }
  function pop(x, y, a) {
    var d = a.data, L = d.LO;
    var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
    if (c < 0 || r < 0 || c >= L.cols || r >= L.rows) return;
    var i = r * L.cols + c; if (!d.b[i]) return;
    d.b[i] = 0; d.left--; a.add(5); a.beep(a.rnd(700, 1100), .04, 'triangle');
    if (!d.left) { a.add(50); d.lv++; a.beep(1200, .25, 'triangle'); sheet(a); }
  }

  /* ---------- 33 หลบอุกกาบาต ---------- */
  R('dodgerock', {
    time: 0,
    setup: function (a) {
      a.data.LO = { pr: a.mn * .045, spd: a.mn * .45 };
      a.data.px = a.W / 2; a.data.py = a.H * .78; a.data.tx = a.W / 2; a.data.ty = a.H * .78;
      a.data.r = []; a.data.sp = .5; a.data.t = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.t += dt; a.setScore(Math.floor(d.t * 10));
      d.px += (d.tx - d.px) * Math.min(1, dt * 15);
      d.py += (d.ty - d.py) * Math.min(1, dt * 15);
      d.sp -= dt;
      if (d.sp <= 0) {
        var rr = a.rnd(a.mn * .035, a.mn * .075);
        d.r.push({ x: a.rnd(rr, a.W - rr), y: -rr * 2, r: rr, v: L.spd * a.rnd(.8, 1.4) * (1 + d.t / 30), rot: 0, vr: a.rnd(-3, 3) });
        d.sp = Math.max(.14, a.rnd(.35, .6) - d.t * .008);
      }
      for (var i = d.r.length - 1; i >= 0; i--) {
        var o = d.r[i]; o.y += o.v * dt; o.rot += o.vr * dt;
        if (Math.hypot(o.x - d.px, o.y - d.py) < o.r + L.pr) { a.beep(120, .35, 'sawtooth'); return a.end(); }
        if (o.y > a.H + o.r * 2) d.r.splice(i, 1);
      }
    },
    down: function (x, y, a) { a.data.tx = x; a.data.ty = y; },
    move: function (x, y, a) { if (a.pointer.down) { a.data.tx = x; a.data.ty = y; } },
    draw: function (g, a) {
      a.bg('#150a35', '#3a2a78');
      var d = a.data, L = d.LO;
      for (var i = 0; i < 40; i++) {
        var sx = (i * 137) % a.W, sy = ((i * 311) + d.t * 40) % a.H;
        g.fillStyle = 'rgba(255,255,255,' + (.12 + (i % 5) * .06) + ')';
        g.fillRect(sx, sy, 2, 2);
      }
      d.r.forEach(function (o) {
        g.save(); g.translate(o.x, o.y); g.rotate(o.rot);
        g.beginPath();
        for (var k = 0; k < 7; k++) {
          var ang = k / 7 * 6.283, rr = o.r * (k % 2 ? .78 : 1);
          g[k ? 'lineTo' : 'moveTo'](Math.cos(ang) * rr, Math.sin(ang) * rr);
        }
        g.closePath(); g.fillStyle = '#8d7a6b'; g.fill();
        g.fillStyle = 'rgba(0,0,0,.25)';
        g.beginPath(); g.arc(o.r * .2, -o.r * .2, o.r * .25, 0, 6.29); g.fill();
        g.restore();
      });
      g.save(); g.translate(d.px, d.py);
      g.fillStyle = a.C.accent;
      g.beginPath(); g.moveTo(0, -L.pr * 1.4); g.lineTo(L.pr, L.pr); g.lineTo(0, L.pr * .5); g.lineTo(-L.pr, L.pr); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,110,60,.8)';
      g.beginPath(); g.moveTo(-L.pr * .4, L.pr * .8); g.lineTo(0, L.pr * (1.6 + Math.sin(d.t * 30) * .3)); g.lineTo(L.pr * .4, L.pr * .8); g.closePath(); g.fill();
      g.restore();
      a.head(a.txt({ th: 'ลากนิ้วบังคับยาน', en: 'Drag to fly' }));
    }
  });

  /* ---------- 34 สลับเลน ---------- */
  R('laneswitch', {
    time: 0,
    setup: function (a) {
      var roadW = Math.min(a.W * .8, a.mn * .95);
      a.data.LO = { rw: roadW, rx: (a.W - roadW) / 2, lw: roadW / 3, py: a.H - a.mn * .22, sz: a.mn * .085, spd: a.mn * .55 };
      a.data.lane = 1; a.data.px = a.data.LO.rx + a.data.LO.lw * 1.5;
      a.data.ob = []; a.data.t = 0; a.data.spd = a.data.LO.spd;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.t += dt; d.spd += dt * a.mn * .02;
      var tx = L.rx + L.lw * (d.lane + .5);
      d.px += (tx - d.px) * Math.min(1, dt * 14);
      /* เว้นระยะระหว่างสิ่งกีดขวาง: สร้างอันใหม่เมื่ออันล่าสุดร่วงลงมาไกลพอแล้ว */
      var lastY = d.ob.length ? d.ob[d.ob.length - 1].y : Infinity;
      if (lastY > a.mn * .55) {
        var lane = a.rndi(0, 2);
        d.ob.push({ lane: lane, y: -a.mn * .1, coin: Math.random() < .3, hit: 0 });
      }
      for (var i = d.ob.length - 1; i >= 0; i--) {
        var o = d.ob[i]; o.y += d.spd * dt;
        var ox = L.rx + L.lw * (o.lane + .5);
        if (!o.hit && Math.abs(o.y - L.py) < L.sz * .8 && o.lane === d.lane) {
          if (o.coin) { o.hit = 1; a.add(25); a.beep(1000, .08); d.ob.splice(i, 1); continue; }
          a.beep(130, .3, 'sawtooth'); return a.end();
        }
        if (o.y > a.H + L.sz) { if (!o.coin) a.add(10); d.ob.splice(i, 1); }
      }
    },
    /* ลากหรือกดค้างแล้วเลื่อน รถจะวิ่งไปเลนที่นิ้วอยู่ (แตะเฉย ๆ ก็ได้) */
    down: function (x, y, a) { setLane(x, a); },
    move: function (x, y, a) { if (a.pointer.down) setLane(x, a); },
    draw: function (g, a) {
      a.bg('#241238', '#5b3a9e');
      var d = a.data, L = d.LO;
      g.fillStyle = '#2f2a52'; g.fillRect(L.rx, 0, L.rw, a.H);
      g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = a.mn * .006;
      g.setLineDash([a.mn * .06, a.mn * .05]); g.lineDashOffset = -(d.t * d.spd) % (a.mn * .11);
      for (var i = 1; i < 3; i++) { g.beginPath(); g.moveTo(L.rx + L.lw * i, 0); g.lineTo(L.rx + L.lw * i, a.H); g.stroke(); }
      g.setLineDash([]);
      d.ob.forEach(function (o) {
        var ox = L.rx + L.lw * (o.lane + .5);
        if (o.coin) { a.circle(ox, o.y, L.sz * .38, a.C.accent); a.text('★', ox, o.y, L.sz * .34, '#8a6a00'); }
        else a.fillRR(ox - L.sz * .45, o.y - L.sz * .45, L.sz * .9, L.sz * .9, L.sz * .15, a.C.bad);
      });
      EM(g, '🏎️', d.px, L.py, L.sz * 1.15);
      a.head(a.txt({ th: 'ลากนิ้วซ้าย-ขวาเพื่อเปลี่ยนเลน', en: 'Drag left or right to change lane' }));
    }
  });
  function setLane(x, a) {
    var d = a.data, L = d.LO;
    var l = Math.floor((x - L.rx) / L.lw);
    l = Math.max(0, Math.min(2, l));
    if (l !== d.lane) { d.lane = l; a.beep(520, .05, 'triangle'); }
  }

  /* ---------- 35 ผ่านวงสี ---------- */
  R('colorswitch', {
    time: 0,
    setup: function (a) {
      a.data.LO = { R: Math.min(a.W * .32, a.mn * .30), G: a.mn * 2.0, jump: -a.mn * .82, br: a.mn * .028, gap: a.mn * .50 };
      a.data.cols = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a'];
      a.data.y = 0; a.data.vy = 0; a.data.ci = 0; a.data.cam = -a.H * .62;
      a.data.rings = [];
      for (var i = 0; i < 4; i++) a.data.rings.push({ y: -a.data.LO.gap * (i + 1), rot: a.rnd(0, 6.28), sp: a.rnd(1.1, 2.2) * (Math.random() < .5 ? -1 : 1), st: 0 });
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.vy += L.G * dt; d.y += d.vy * dt;
      d.rings.forEach(function (r) { r.rot += r.sp * dt; });
      var target = d.y - a.H * .62;
      if (target < d.cam) d.cam = target;
      /* เช็คสีเฉพาะตอนเข้าวงจากด้านล่างเท่านั้น (ขาออกไม่เช็ค) */
      d.rings.forEach(function (r) {
        var dy = d.y - r.y;
        if (r.st === 0 && dy < L.R && dy > 0 && d.vy < 0) {
          r.st = 1;
          var ang = ((Math.PI / 2 - r.rot) % 6.2832 + 6.2832) % 6.2832;
          var q = Math.floor(ang / (Math.PI / 2)) % 4;
          if (q !== d.ci) { a.beep(120, .35, 'sawtooth'); a.end(); }
        }
        if (r.st === 1 && dy < -L.R) {
          r.st = 0; a.add(15); a.beep(950, .1);
          d.ci = a.rndi(0, 3);
          var top = Math.min.apply(null, d.rings.map(function (x) { return x.y; }));
          r.y = top - L.gap; r.rot = a.rnd(0, 6.28); r.sp = a.rnd(1.1, 2.4) * (Math.random() < .5 ? -1 : 1);
        }
      });
      if (d.y > d.cam + a.H + L.br * 4) { a.beep(120, .3, 'sawtooth'); a.end(); }
    },
    down: function (x, y, a) { a.data.vy = a.data.LO.jump; a.beep(600, .05, 'triangle'); },
    draw: function (g, a) {
      a.bg('#0f0a26', '#241a4d');
      var d = a.data, L = d.LO, cx = a.W / 2;
      g.save(); g.translate(0, -d.cam);
      d.rings.forEach(function (r) {
        for (var i = 0; i < 4; i++) {
          g.beginPath();
          g.arc(cx, r.y, L.R, r.rot + i * Math.PI / 2, r.rot + (i + 1) * Math.PI / 2);
          g.strokeStyle = d.cols[i]; g.lineWidth = L.br * 2; g.stroke();
        }
      });
      a.circle(cx, d.y, L.br * 1.5, d.cols[d.ci]);
      g.restore();
      a.head(a.txt({ th: 'แตะให้กระโดด • ผ่านเฉพาะสีที่ตรงกัน', en: 'Tap to hop • pass only your own color' }));
    }
  });

  /* ---------- 36 แตะให้ตรงวง ---------- */
  R('rhythmring', {
    setup: function (a) {
      a.data.LO = { Rt: a.mn * .16, Rmax: Math.min(a.W * .44, a.mn * .42) };
      a.data.r = a.data.LO.Rmax; a.data.sp = a.mn * .45; a.data.msg = ''; a.data.fx = 0; a.data.lv = 1;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (d.fx > 0) { d.fx -= dt; if (d.fx <= 0) d.msg = ''; return; }
      d.r -= d.sp * dt;
      if (d.r < L.Rt * .25) { d.msg = a.txt({ th: 'หลุด −5', en: 'Miss −5' }); a.add(-5); a.beep(160, .2, 'square'); d.fx = .45; d.r = L.Rmax; }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO; if (d.fx > 0) return;
      var diff = Math.abs(d.r - L.Rt);
      if (diff < L.Rt * .12) { a.add(30); d.msg = a.txt({ th: 'เป๊ะ! +30', en: 'PERFECT +30' }); a.beep(1200, .15, 'triangle'); d.lv++; d.sp += a.mn * .03; }
      else if (diff < L.Rt * .32) { a.add(15); d.msg = a.txt({ th: 'ดี +15', en: 'Good +15' }); a.beep(800, .1); }
      else { a.add(-5); d.msg = a.txt({ th: 'พลาด −5', en: 'Off −5' }); a.beep(180, .18, 'square'); }
      d.fx = .45; d.r = L.Rmax;
    },
    draw: function (g, a) {
      a.bg('#2b0b4a', '#0b3a6b');
      var d = a.data, L = d.LO, cx = a.W / 2, cy = a.H * .52;
      g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = a.mn * .006;
      g.beginPath(); g.arc(cx, cy, L.Rmax, 0, 6.29); g.stroke();
      g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .016;
      g.beginPath(); g.arc(cx, cy, L.Rt, 0, 6.29); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = a.mn * .012;
      g.beginPath(); g.arc(cx, cy, Math.max(2, d.r), 0, 6.29); g.stroke();
      a.circle(cx, cy, L.Rt * .55, 'rgba(255,255,255,.14)');
      a.text('LV ' + d.lv, cx, cy, L.Rt * .3, 'rgba(255,255,255,.8)');
      if (d.msg) a.text(d.msg, cx, cy + L.Rmax + a.mn * .09, a.mn * .055, a.C.accent);
      a.head(a.txt({ th: 'แตะตอนวงขาวซ้อนวงเหลือง', en: 'Tap when the white ring meets the gold one' }));
    }
  });

  /* ---------- 37 กดสีให้ตรงกฎ ---------- */
  R('colorrule', {
    setup: function (a) {
      var bw = Math.min(a.W * .40, a.mn * .38), gap = a.mn * .04;
      var ty = a.mn * .16, tBottom = ty + a.mn * .18;
      var bh = Math.min(a.mn * .28, (a.H - tBottom - a.mn * .10 - gap) / 2);
      a.data.LO = {
        bw: bw, bh: bh, gap: gap,
        ox: (a.W - (bw * 2 + gap)) / 2,
        oy: tBottom + (a.H - tBottom - (bh * 2 + gap) - a.mn * .05) / 2,
        tw: Math.min(a.W * .5, a.mn * .45), ty: ty
      };
      a.data.lv = 1; a.data.fb = 0; a.data.pick = -1; mkcol(a);
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.fb > 0) { d.fb -= dt; if (d.fb <= 0) { d.pick = -1; mkcol(a); } }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO; if (d.fb > 0) return;
      for (var i = 0; i < 4; i++) {
        var b = cbtn(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.pick = i;
          if (i === d.ans) { a.add(15); a.beep(950, .1); d.lv++; }
          else { a.add(-5); a.beep(170, .2, 'square'); }
          d.fb = .5; return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#3a2a78', '#0b1a3d');
      var d = a.data, L = d.LO;
      a.fillRR((a.W - L.tw) / 2, L.ty, L.tw, a.mn * .18, a.mn * .03, '#ffffff');
      a.fillRR((a.W - L.tw) / 2 + a.mn * .02, L.ty + a.mn * .02, L.tw - a.mn * .04, a.mn * .14, a.mn * .02, d.target);
      for (var i = 0; i < 4; i++) {
        var b = cbtn(a, i);
        a.fillRR(b.x, b.y, b.w, b.h, a.mn * .028, d.opt[i]);
        if (d.fb > 0 && i === d.ans) { g.strokeStyle = '#fff'; g.lineWidth = a.mn * .012; a.rr(b.x, b.y, b.w, b.h, a.mn * .028); g.stroke(); }
        if (d.fb > 0 && d.pick === i && i !== d.ans) a.text('✕', b.x + b.w / 2, b.y + b.h / 2, a.mn * .09, 'rgba(0,0,0,.55)');
      }
      a.head(a.txt({ th: 'รอบ ' + d.lv + ' — แตะสีที่ตรงกับกรอบด้านบน', en: 'Round ' + d.lv + ' — tap the matching color' }));
    }
  });
  function cbtn(a, i) {
    var L = a.data.LO;
    return { x: L.ox + (i % 2) * (L.bw + L.gap), y: L.oy + Math.floor(i / 2) * (L.bh + L.gap), w: L.bw, h: L.bh };
  }
  function mkcol(a) {
    var d = a.data;
    var h = a.rndi(0, 359), s = a.rndi(60, 90), l = a.rndi(45, 62);
    var spread = Math.max(5, 30 - d.lv * 1.5);
    d.target = 'hsl(' + h + ',' + s + '%,' + l + '%)';
    d.ans = a.rndi(0, 3);
    d.opt = [];
    for (var i = 0; i < 4; i++) {
      if (i === d.ans) d.opt.push(d.target);
      else d.opt.push('hsl(' + (h + a.rndi(-spread, spread)) + ',' + s + '%,' + (l + a.rndi(-spread, spread) * .6) + '%)');
    }
  }

  /* ---------- 38 เดาะบอล ---------- */
  R('juggle', {
    time: 0,
    setup: function (a) {
      a.data.LO = { r: a.mn * .075, G: a.mn * 1.5, kick: -a.mn * .78 };
      a.data.x = a.W / 2; a.data.y = a.H * .3; a.data.vx = a.rnd(-a.mn * .1, a.mn * .1); a.data.vy = 0;
      a.data.rot = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.vy += L.G * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.rot += d.vx * dt * .02;
      if (d.x < L.r) { d.x = L.r; d.vx = Math.abs(d.vx); }
      if (d.x > a.W - L.r) { d.x = a.W - L.r; d.vx = -Math.abs(d.vx); }
      if (d.y < L.r) { d.y = L.r; d.vy = Math.abs(d.vy) * .6; }
      if (d.y > a.H + L.r * 2) { a.beep(130, .3, 'sawtooth'); a.end(); }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (Math.hypot(x - d.x, y - d.y) < L.r * 1.5) {
        d.vy = L.kick; d.vx += (d.x - x) * 3.5;
        d.vx = Math.max(-a.mn * .6, Math.min(a.mn * .6, d.vx));
        a.add(1); a.beep(500 + a.score * 8, .06, 'triangle');
      }
    },
    draw: function (g, a) {
      a.bg('#1c5e2f', '#8fd14f');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(0,0,0,.18)';
      g.beginPath(); g.ellipse(d.x, a.H - a.mn * .04, L.r * .9, L.r * .22, 0, 0, 6.29); g.fill();
      g.save(); g.translate(d.x, d.y); g.rotate(d.rot); EM(g, '⚽', 0, 0, L.r * 2); g.restore();
      a.text(a.score + '', a.W / 2, a.H * .5, a.mn * .22, 'rgba(255,255,255,.13)');
      a.head(a.txt({ th: 'แตะที่ลูกบอลไม่ให้ตกพื้น', en: 'Tap the ball, keep it up' }));
    }
  });

  /* ---------- 39 บินลอดอุโมงค์ ---------- */
  R('tunnelfly', {
    time: 0,
    setup: function (a) {
      a.data.LO = { px: a.W * .26, pr: a.mn * .04, spd: a.mn * .55, step: a.mn * .04 };
      a.data.y = a.H / 2; a.data.ty = a.H / 2; a.data.seg = [];
      a.data.cy = a.H / 2; a.data.half = a.mn * .22; a.data.t = 0; a.data.spd = a.data.LO.spd;
      for (var x = 0; x < a.W + a.data.LO.step * 2; x += a.data.LO.step)
        a.data.seg.push({ x: x, cy: a.H / 2, h: a.data.half });
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.t += dt; d.spd += dt * a.mn * .012;
      a.setScore(Math.floor(d.t * 12));
      d.y += (d.ty - d.y) * Math.min(1, dt * 12);
      var move = d.spd * dt;
      d.seg.forEach(function (s) { s.x -= move; });
      while (d.seg.length && d.seg[0].x < -L.step) d.seg.shift();
      while (d.seg[d.seg.length - 1].x < a.W + L.step) {
        d.cy += a.rnd(-1, 1) * a.mn * .035;
        d.half = Math.max(a.mn * .10, d.half - a.mn * .0006);
        d.cy = Math.max(d.half + a.mn * .05, Math.min(a.H - d.half - a.mn * .05, d.cy));
        d.seg.push({ x: d.seg[d.seg.length - 1].x + L.step, cy: d.cy, h: d.half });
      }
      var here = null;
      d.seg.forEach(function (s) { if (Math.abs(s.x - L.px) < L.step) here = s; });
      if (here && Math.abs(d.y - here.cy) > here.h - L.pr) { a.beep(130, .3, 'sawtooth'); a.end(); }
    },
    down: function (x, y, a) { a.data.ty = y; },
    move: function (x, y, a) { if (a.pointer.down) a.data.ty = y; },
    draw: function (g, a) {
      a.bg('#050b22', '#0d2b5e');
      var d = a.data, L = d.LO;
      g.fillStyle = '#12306b';
      g.beginPath(); g.moveTo(0, 0);
      d.seg.forEach(function (s) { g.lineTo(s.x, s.cy - s.h); });
      g.lineTo(a.W, 0); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(0, a.H);
      d.seg.forEach(function (s) { g.lineTo(s.x, s.cy + s.h); });
      g.lineTo(a.W, a.H); g.closePath(); g.fill();
      g.strokeStyle = a.C.secondary; g.lineWidth = a.mn * .006;
      g.beginPath(); d.seg.forEach(function (s, i) { g[i ? 'lineTo' : 'moveTo'](s.x, s.cy - s.h); }); g.stroke();
      g.beginPath(); d.seg.forEach(function (s, i) { g[i ? 'lineTo' : 'moveTo'](s.x, s.cy + s.h); }); g.stroke();
      EM(g, '✈️', L.px, d.y, L.pr * 2.6);   /* หันไปทางขวาตามทิศที่บิน */
      a.head(a.txt({ th: 'ลากขึ้น-ลงหลบผนัง', en: 'Drag up and down to avoid the walls' }));
    }
  });

  /* ---------- 40 ซิกแซก ---------- */
  R('zigzag', {
    time: 0,
    setup: function (a) {
      var s = a.mn * .11;
      a.data.LO = { s: s, spd: a.mn * .42, br: s * .34 };
      a.data.cells = [{ c: 0, r: 0 }]; a.data.dir = 1;   // 1 = ไปขวา-บน, -1 = ไปซ้าย-บน
      a.data.buildDir = 1; a.data.runLeft = 4;
      buildPath(a, 60);
      a.data.x = 0; a.data.y = 0; a.data.t = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.t += dt;
      var v = L.spd * (1 + d.t * .02) * dt;
      d.x += d.dir * v * .7071; d.y -= v * .7071;
      a.setScore(Math.floor(-d.y / L.s * 5));
      /* ต่อทางเมื่อใกล้หมด */
      var topRow = d.cells[d.cells.length - 1].r;
      if (-d.y / L.s > topRow - 25) buildPath(a, 30);
      /* อยู่บนทางไหม */
      var cc = Math.round(d.x / L.s), cr = Math.round(-d.y / L.s);
      var on = d.cells.some(function (c) { return c.c === cc && c.r === cr; });
      if (!on) { a.beep(130, .3, 'sawtooth'); a.end(); }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      d.dir *= -1;
      /* สแนปเข้ากึ่งกลางช่อง เพื่อไม่ให้ตำแหน่งเพี้ยนสะสมทุกครั้งที่เลี้ยว */
      d.x = Math.round(d.x / L.s) * L.s;
      d.y = -Math.round(-d.y / L.s) * L.s;
      a.beep(620, .05, 'triangle');
    },
    draw: function (g, a) {
      a.bg('#101a3d', '#2a1a5e');
      var d = a.data, L = d.LO, offX = a.W / 2 - d.x, offY = a.H * .70 - d.y;
      g.save();
      g.translate(offX, offY);
      d.cells.forEach(function (c) {
        var x = c.c * L.s, y = -c.r * L.s, sy = y + offY;
        if (sy < -L.s || sy > a.H + L.s) return;
        a.fillRR(x - L.s * .5, y - L.s * .5, L.s, L.s, L.s * .12, 'rgba(255,255,255,.9)');
      });
      a.circle(d.x, d.y, L.br, a.C.primary);
      g.restore();
      a.head(a.txt({ th: 'แตะเพื่อเปลี่ยนทิศ', en: 'Tap to change direction' }));
    }
  });
  function buildPath(a, n) {
    var d = a.data;
    var c = d.cells.length ? d.cells[d.cells.length - 1].c : 0;
    var r = d.cells.length ? d.cells[d.cells.length - 1].r : 0;
    var dir = d.buildDir || 1;
    var left = d.runLeft || 0;
    for (var i = 0; i < n; i++) {
      if (left <= 0) { dir = -dir; left = 2 + Math.floor(Math.random() * 5); }
      c += dir; r += 1; left--;
      d.cells.push({ c: c, r: r });
    }
    d.buildDir = dir; d.runLeft = left;
    if (d.cells.length > 400) d.cells.splice(0, d.cells.length - 400);
  }
})();
