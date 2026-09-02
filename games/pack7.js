/* ============================================================
   PACK 7 — เกม 61-70  (อาร์เคด)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }

  /* ---------- 61 เรียงบล็อกตก ---------- */
  var SHAPES = [
    [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]],
    [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]],
    [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]]
  ];
  var SCOL = ['#00d4ff', '#ffd23f', '#b06bff', '#2fe08a', '#ff2e88', '#4f7cff', '#ff6a3d'];
  R('tetris', {
    time: 0,
    setup: function (a) {
      var cols = 10, rows = 18;
      var s = Math.min((a.W * .62) / cols, (a.H - a.mn * .19) / rows);
      a.data.LO = {
        cols: cols, rows: rows, s: s, ox: (a.W - cols * s) / 2,
        oy: a.mn * .15 + (a.H - a.mn * .19 - rows * s) / 2
      };
      a.data.b = []; for (var i = 0; i < cols * rows; i++) a.data.b.push(-1);
      a.data.acc = 0; a.data.step = .55; a.data.sw = null;
      newPiece(a);
    },
    update: function (dt, a) {
      var d = a.data;
      d.acc += dt;
      if (d.acc < d.step) return; d.acc = 0;
      if (!move(a, 0, 1)) lock(a);
    },
    down: function (x, y, a) { a.data.sw = { x: x, y: y, t: 0 }; },
    up: function (x, y, a) {
      var d = a.data; if (!d.sw) return;
      var dx = x - d.sw.x, dy = y - d.sw.y; d.sw = null;
      if (dy > a.mn * .09 && Math.abs(dy) > Math.abs(dx)) {
        while (move(a, 0, 1)) { }
        lock(a); a.beep(300, .07); return;
      }
      if (Math.abs(dx) < a.mn * .04 && Math.abs(dy) < a.mn * .04) {
        var L = d.LO;
        if (x < L.ox + L.cols * L.s * .33) move(a, -1, 0);
        else if (x > L.ox + L.cols * L.s * .67) move(a, 1, 0);
        else rotate(a);
        a.beep(520, .04);
      }
    },
    key: function (k, a) {
      if (k === 'ArrowLeft') move(a, -1, 0);
      if (k === 'ArrowRight') move(a, 1, 0);
      if (k === 'ArrowUp') rotate(a);
      if (k === 'ArrowDown') move(a, 0, 1);
    },
    draw: function (g, a) {
      a.bg('#0a0a1e', '#1b1442');
      var d = a.data, L = d.LO;
      a.fillRR(L.ox - 4, L.oy - 4, L.cols * L.s + 8, L.rows * L.s + 8, 8, 'rgba(255,255,255,.08)');
      for (var i = 0; i < d.b.length; i++) {
        if (d.b[i] < 0) continue;
        var c = i % L.cols, r = Math.floor(i / L.cols);
        a.fillRR(L.ox + c * L.s + 1, L.oy + r * L.s + 1, L.s - 2, L.s - 2, L.s * .16, SCOL[d.b[i]]);
      }
      d.p.forEach(function (o) {
        if (o[1] < 0) return;
        a.fillRR(L.ox + o[0] * L.s + 1, L.oy + o[1] * L.s + 1, L.s - 2, L.s - 2, L.s * .16, SCOL[d.pc]);
      });
      a.head(a.txt({ th: 'แตะซ้าย/ขวาเลื่อน • แตะกลางหมุน • ปัดลงเพื่อทิ้ง', en: 'Tap sides to move • middle to rotate • swipe down to drop' }));
    }
  });
  function cells(sh, x, y) {
    var out = [];
    for (var r = 0; r < sh.length; r++) for (var c = 0; c < sh[r].length; c++) if (sh[r][c]) out.push([x + c, y + r]);
    return out;
  }
  function fits(a, sh, x, y) {
    var d = a.data, L = d.LO;
    return cells(sh, x, y).every(function (o) {
      if (o[0] < 0 || o[0] >= L.cols || o[1] >= L.rows) return false;
      if (o[1] < 0) return true;
      return d.b[o[1] * L.cols + o[0]] < 0;
    });
  }
  function newPiece(a) {
    var d = a.data;
    d.pc = a.rndi(0, 6); d.sh = SHAPES[d.pc].map(function (r) { return r.slice(); });
    d.x = Math.floor(d.LO.cols / 2) - 1; d.y = -d.sh.length;
    d.p = cells(d.sh, d.x, d.y);
    if (!fits(a, d.sh, d.x, d.y + 1) && d.y >= 0) { a.beep(140, .35, 'sawtooth'); a.end(); }
  }
  function move(a, dx, dy) {
    var d = a.data;
    if (!fits(a, d.sh, d.x + dx, d.y + dy)) return false;
    d.x += dx; d.y += dy; d.p = cells(d.sh, d.x, d.y); return true;
  }
  function rotate(a) {
    var d = a.data, sh = d.sh;
    var n = sh.length, m = sh[0].length, out = [];
    for (var c = 0; c < m; c++) { out[c] = []; for (var r = 0; r < n; r++) out[c][r] = sh[n - 1 - r][c]; }
    if (fits(a, out, d.x, d.y)) { d.sh = out; d.p = cells(d.sh, d.x, d.y); }
  }
  function lock(a) {
    var d = a.data, L = d.LO;
    var dead = false;
    d.p.forEach(function (o) {
      if (o[1] < 0) { dead = true; return; }
      d.b[o[1] * L.cols + o[0]] = d.pc;
    });
    if (dead) { a.beep(140, .35, 'sawtooth'); return a.end(); }
    var cleared = 0;
    for (var r = L.rows - 1; r >= 0; r--) {
      var full = true;
      for (var c = 0; c < L.cols; c++) if (d.b[r * L.cols + c] < 0) full = false;
      if (full) {
        cleared++;
        d.b.splice(r * L.cols, L.cols);
        for (var k = 0; k < L.cols; k++) d.b.unshift(-1);
        r++;
      }
    }
    if (cleared) { a.add(cleared * 100); a.beep(900, .18, 'triangle'); d.step = Math.max(.16, d.step - .015 * cleared); }
    newPiece(a);
  }

  /* ---------- 62 บอลตกหอ ---------- */
  R('towerdrop', {
    time: 0,
    setup: function (a) {
      a.data.LO = { r: a.mn * .035, G: a.mn * 1.6, gap: a.mn * .18, bar: a.mn * .034 };
      a.data.pl = []; a.data.y = 0; a.data.vy = 0; a.data.cam = 0; a.data.drag = null; a.data.rot = 0;
      for (var i = 1; i <= 14; i++) a.data.pl.push(mkPl(a, i * a.data.LO.gap * 1.5));
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.vy += L.G * dt; d.y += d.vy * dt;
      d.cam = d.y - a.H * .35;
      d.pl.forEach(function (p) {
        if (p.done) return;
        if (d.y + L.r > p.y && d.y + L.r < p.y + L.bar + Math.abs(d.vy) * dt && d.vy > 0) {
          var gx = ((p.gx + d.rot) % a.W + a.W) % a.W;
          var inGap = Math.abs(((a.W / 2 - gx + a.W * 1.5) % a.W) - a.W / 2) < p.gw / 2;
          if (inGap) { p.done = 1; a.add(10); a.beep(880, .06); }
          else if (p.bad) { a.beep(140, .35, 'sawtooth'); a.end(); }
          else { d.vy = -L.G * .38; d.y = p.y - L.r; a.beep(400, .05); }
        }
      });
      /* เติมชั้นใหม่ด้านล่าง */
      var last = d.pl[d.pl.length - 1];
      if (last.y - d.y < a.H * 2) d.pl.push(mkPl(a, last.y + L.gap * 1.5));
      if (d.pl.length > 30) d.pl.shift();
      if (d.y < d.cam - a.H) { }
    },
    down: function (x, y, a) { a.data.drag = x; },
    move: function (x, y, a) {
      var d = a.data;
      if (a.pointer.down && d.drag !== null) { d.rot = (d.rot || 0) + (x - d.drag); d.drag = x; }
    },
    up: function (x, y, a) { a.data.drag = null; },
    draw: function (g, a) {
      a.bg('#2b0a3d', '#7b1f5e');
      var d = a.data, L = d.LO;
      g.save(); g.translate(0, -d.cam);
      d.pl.forEach(function (p) {
        if (p.y - d.cam < -L.bar * 2 || p.y - d.cam > a.H + L.bar) return;
        var gx = ((p.gx + (d.rot || 0)) % a.W + a.W) % a.W;
        g.fillStyle = p.bad ? a.C.bad : (p.done ? 'rgba(255,255,255,.2)' : '#4f7cff');
        for (var k = -1; k <= 1; k++) {
          var x0 = gx + k * a.W;
          g.fillRect(x0 + p.gw / 2, p.y, a.W - p.gw, L.bar);
        }
      });
      a.circle(a.W / 2, d.y, L.r, a.C.accent);
      g.restore();
      a.head(a.txt({ th: 'ลากซ้าย-ขวาเลื่อนช่องว่างให้ตรงลูกบอล', en: 'Drag to line the gap up with the ball' }));
    }
  });
  function mkPl(a, y) {
    return { y: y, gx: a.rnd(0, a.W), gw: a.mn * (.18 + Math.random() * .1), bad: Math.random() < .18, done: 0 };
  }

  /* ---------- 63 กระโดดขึ้นแท่น ---------- */
  R('platformjump', {
    time: 0,
    setup: function (a) {
      a.data.LO = { pw: a.mn * .16, ph: a.mn * .022, r: a.mn * .035, G: a.mn * 1.7, jump: -a.mn * .82 };
      a.data.x = a.W / 2; a.data.y = a.H * .7; a.data.vy = 0; a.data.tx = a.W / 2; a.data.cam = 0; a.data.best = 0;
      a.data.pl = [{ x: a.W / 2 - a.data.LO.pw / 2, y: a.H * .8 }];
      for (var i = 1; i < 22; i++)
        a.data.pl.push({ x: a.rnd(0, a.W - a.data.LO.pw), y: a.H * .8 - i * a.mn * .17 });
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.x += (d.tx - d.x) * Math.min(1, dt * 12);
      d.vy += L.G * dt; d.y += d.vy * dt;
      if (d.vy > 0) d.pl.forEach(function (p) {
        if (d.y + L.r > p.y && d.y + L.r < p.y + L.ph + Math.abs(d.vy) * dt && d.x > p.x - L.r && d.x < p.x + L.pw + L.r) {
          d.vy = L.jump; a.beep(620, .05, 'triangle');
        }
      });
      if (d.y < d.cam + a.H * .4) d.cam = d.y - a.H * .4;
      var h = Math.max(0, Math.floor((a.H * .8 - d.y) / (a.mn * .06)));
      if (h > d.best) { d.best = h; a.setScore(h); }
      var top = Math.min.apply(null, d.pl.map(function (p) { return p.y; }));
      while (top > d.cam - a.H * .3) { top -= a.mn * .17; d.pl.push({ x: a.rnd(0, a.W - L.pw), y: top }); }
      d.pl = d.pl.filter(function (p) { return p.y < d.cam + a.H + L.ph * 4; });
      if (d.y > d.cam + a.H + L.r * 4) { a.beep(140, .3, 'sawtooth'); a.end(); }
    },
    down: function (x, y, a) { a.data.tx = Math.max(0, Math.min(a.W, x)); },
    move: function (x, y, a) { if (a.pointer.down) a.data.tx = Math.max(0, Math.min(a.W, x)); },
    draw: function (g, a) {
      a.bg('#1a0f45', '#5b6fd8');
      var d = a.data, L = d.LO;
      g.save(); g.translate(0, -d.cam);
      d.pl.forEach(function (p) {
        if (p.y - d.cam < -L.ph || p.y - d.cam > a.H + L.ph) return;
        a.fillRR(p.x, p.y, L.pw, L.ph, L.ph / 2, a.C.good);
      });
      EM(g, '🦘', d.x, d.y, L.r * 2.4);
      g.restore();
      a.head(a.txt({ th: 'ลากซ้าย-ขวา • กระโดดขึ้นไปให้สูงที่สุด', en: 'Drag sideways • climb as high as you can' }));
    }
  });

  /* ---------- 64 ยิงยานอวกาศ ---------- */
  R('spacewar', {
    time: 0, lives: 3,
    setup: function (a) {
      a.data.LO = { pr: a.mn * .045, py: a.H - a.mn * .13, bs: a.mn * 1.1, er: a.mn * .045 };
      a.data.x = a.W / 2; a.data.tx = a.W / 2; a.data.b = []; a.data.e = []; a.data.eb = [];
      a.data.fire = 0; a.data.sp = .8; a.data.t = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.t += dt;
      d.x += (d.tx - d.x) * Math.min(1, dt * 14);
      d.fire -= dt;
      if (d.fire <= 0) { d.b.push({ x: d.x, y: L.py - L.pr }); d.fire = .26; }
      d.b.forEach(function (o) { o.y -= L.bs * dt; });
      d.b = d.b.filter(function (o) { return o.y > -10; });
      d.sp -= dt;
      if (d.sp <= 0) {
        d.e.push({ x: a.rnd(L.er, a.W - L.er), y: -L.er, v: a.mn * (.16 + Math.min(.3, d.t * .01)), f: a.rnd(1, 2.4) });
        d.sp = Math.max(.28, .9 - d.t * .02);
      }
      for (var i = d.e.length - 1; i >= 0; i--) {
        var e = d.e[i]; e.y += e.v * dt; e.f -= dt;
        if (e.f <= 0) { e.f = a.rnd(1.4, 3); d.eb.push({ x: e.x, y: e.y, v: a.mn * .5 }); }
        var hit = false;
        for (var k = d.b.length - 1; k >= 0; k--) {
          if (Math.hypot(d.b[k].x - e.x, d.b[k].y - e.y) < L.er) { d.b.splice(k, 1); hit = true; break; }
        }
        if (hit) { d.e.splice(i, 1); a.add(15); a.beep(800, .07); continue; }
        if (e.y > a.H + L.er || Math.hypot(e.x - d.x, e.y - L.py) < L.er + L.pr) {
          d.e.splice(i, 1);
          if (e.y <= a.H + L.er) { a.beep(150, .3, 'sawtooth'); if (a.loseLife() <= 0) return; }
        }
      }
      for (var j = d.eb.length - 1; j >= 0; j--) {
        var b = d.eb[j]; b.y += b.v * dt;
        if (Math.hypot(b.x - d.x, b.y - L.py) < L.pr) { d.eb.splice(j, 1); a.beep(150, .3, 'sawtooth'); if (a.loseLife() <= 0) return; }
        else if (b.y > a.H) d.eb.splice(j, 1);
      }
    },
    down: function (x, y, a) { a.data.tx = x; },
    move: function (x, y, a) { if (a.pointer.down) a.data.tx = x; },
    draw: function (g, a) {
      a.bg('#05061a', '#1a1050');
      var d = a.data, L = d.LO;
      for (var i = 0; i < 30; i++) {
        var sx = (i * 179) % a.W, sy = ((i * 233) + d.t * 60) % a.H;
        g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(sx, sy, 2, 2);
      }
      d.b.forEach(function (o) { a.fillRR(o.x - 2, o.y - a.mn * .02, 4, a.mn * .04, 2, a.C.accent); });
      d.eb.forEach(function (o) { a.circle(o.x, o.y, a.mn * .01, a.C.bad); });
      d.e.forEach(function (o) { EM(g, '👾', o.x, o.y, L.er * 2.2); });
      /* อีโมจิจรวดชี้เฉียงขึ้นขวา 45° หมุนกลับให้หัวชี้ตรงขึ้นด้านบน */
      g.save(); g.translate(d.x, L.py); g.rotate(-Math.PI / 4);
      EM(g, '🚀', 0, 0, L.pr * 2.2); g.restore();
      a.head(a.txt({ th: 'ลากบังคับยาน • ยิงเอง', en: 'Drag to steer • it fires by itself' }));
    }
  });

  /* ---------- 65 ป้องกันฐาน ---------- */
  R('defendbase', {
    setup: function (a) {
      a.data.LO = { br: a.mn * .09, er: a.mn * .042 };
      a.data.e = []; a.data.sp = .7; a.data.hp = 5; a.data.t = 0; a.data.fx = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.t += dt; if (d.fx > 0) d.fx -= dt;
      d.sp -= dt;
      if (d.sp <= 0) {
        var ang = a.rnd(0, 6.283), rr = Math.max(a.W, a.H) * .6;
        d.e.push({ x: a.W / 2 + Math.cos(ang) * rr, y: a.H / 2 + Math.sin(ang) * rr, v: a.mn * (.09 + Math.min(.16, d.t * .006)), e: a.pick(['👾', '🦠', '🤖', '👻']) });
        d.sp = Math.max(.25, .8 - d.t * .012);
      }
      for (var i = d.e.length - 1; i >= 0; i--) {
        var o = d.e[i];
        var dx = a.W / 2 - o.x, dy = a.H / 2 - o.y, len = Math.hypot(dx, dy);
        o.x += dx / len * o.v * dt; o.y += dy / len * o.v * dt;
        if (len < L.br) {
          d.e.splice(i, 1); d.hp--; d.fx = .35; a.beep(160, .3, 'sawtooth');
          if (d.hp <= 0) return a.end(a.txt({ th: 'ฐานถูกทำลาย', en: 'The base fell' }));
        }
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      for (var i = d.e.length - 1; i >= 0; i--) {
        if (Math.hypot(x - d.e[i].x, y - d.e[i].y) < L.er * 1.2) { d.e.splice(i, 1); a.add(15); a.beep(900, .07); return; }
      }
    },
    draw: function (g, a) {
      a.bg('#140a30', '#3d1060');
      var d = a.data, L = d.LO, cx = a.W / 2, cy = a.H / 2;
      g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2;
      for (var k = 1; k <= 3; k++) { g.beginPath(); g.arc(cx, cy, L.br * (1 + k * .9), 0, 6.29); g.stroke(); }
      a.circle(cx, cy, L.br, a.C.secondary);
      a.circle(cx, cy, L.br * .68, '#1b1442');
      a.text('LOGO', cx, cy, L.br * .3, '#fff');
      d.e.forEach(function (o) { EM(g, o.e, o.x, o.y, L.er * 2); });
      for (var i = 0; i < 5; i++)
        a.circle(a.mn * .06 + i * a.mn * .05, a.H - a.mn * .06, a.mn * .017, i < d.hp ? a.C.bad : 'rgba(255,255,255,.2)');
      if (d.fx > 0) { g.fillStyle = 'rgba(255,82,82,' + d.fx + ')'; g.fillRect(0, 0, a.W, a.H); }
      a.head(a.txt({ th: 'แตะทำลายศัตรูก่อนถึงฐาน', en: 'Tap the enemies before they reach the base' }));
    }
  });

  /* ---------- 66 ขุดหาสมบัติ ---------- */
  R('digger', {
    setup: function (a) {
      var cols = a.port ? 6 : 9, rows = a.port ? 9 : 6;
      var s = Math.min((a.W - a.mn * .08) / cols, (a.H - a.mn * .22) / rows);
      a.data.LO = { cols: cols, rows: rows, s: s, ox: (a.W - cols * s) / 2, oy: a.mn * .16 };
      a.data.cell = [];
      var loot = ['💎', '💰', '🥇', '👑', '🏺'];
      for (var i = 0; i < cols * rows; i++) {
        var t = Math.random();
        a.data.cell.push({ dug: 0, kind: t < .22 ? 'gem' : (t < .45 ? 'rock' : 'dirt'), e: a.pick(loot), p: a.pick([20, 30, 50]) });
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c >= L.cols || r >= L.rows) return;
      var o = d.cell[r * L.cols + c]; if (o.dug) return;
      o.dug = 1;
      if (o.kind === 'gem') { a.add(o.p); a.beep(1000, .12, 'triangle'); }
      else if (o.kind === 'rock') { a.addTime(-3); a.beep(180, .2, 'square'); }
      else { a.add(5); a.beep(500, .05); }
    },
    draw: function (g, a) {
      a.bg('#5b3a12', '#c8924a');
      var d = a.data, L = d.LO;
      for (var i = 0; i < d.cell.length; i++) {
        var c = i % L.cols, r = Math.floor(i / L.cols), o = d.cell[i];
        var x = L.ox + c * L.s + 2, y = L.oy + r * L.s + 2, s = L.s - 4;
        if (!o.dug) {
          a.fillRR(x, y, s, s, L.s * .1, 'hsl(28,45%,' + (34 + (r * 3) % 12) + '%)');
          g.fillStyle = 'rgba(0,0,0,.14)';
          g.fillRect(x + s * .2, y + s * .3, s * .12, s * .08);
          g.fillRect(x + s * .6, y + s * .6, s * .14, s * .07);
        } else {
          a.fillRR(x, y, s, s, L.s * .1, 'rgba(0,0,0,.35)');
          if (o.kind === 'gem') EM(g, o.e, x + s / 2, y + s / 2, s * .6);
          else if (o.kind === 'rock') EM(g, '🌰', x + s / 2, y + s / 2, s * .55);
        }
      }
      a.head(a.txt({ th: 'แตะขุด • เจอหินเสียเวลา 3 วินาที', en: 'Tap to dig • rocks cost 3 seconds' }));
    }
  });

  /* ---------- 67 พินบอล ---------- */
  /* ตู้พินบอล 2D เต็มรูปแบบ: ขอบตู้ รางปล่อยลูกพร้อมสปริง โค้งนำลูกด้านบน
     หมุดชน สลิงช็อต เป้าล้ม แป้นตีสองข้าง และช่องลูกตกตรงกลาง */
  function segHit(b, r, ax, ay, bx, by, rest, boost) {
    var dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    var t = L2 ? Math.max(0, Math.min(1, ((b.x - ax) * dx + (b.y - ay) * dy) / L2)) : 0;
    var px = ax + t * dx, py = ay + t * dy;
    var nx = b.x - px, ny = b.y - py, dist = Math.hypot(nx, ny);
    if (dist > r || dist < .0001) return false;
    nx /= dist; ny /= dist;
    b.x = px + nx * r; b.y = py + ny * r;
    var vn = b.vx * nx + b.vy * ny;
    if (vn < 0) { b.vx -= (1 + rest) * vn * nx; b.vy -= (1 + rest) * vn * ny; }
    if (boost) { b.vx += nx * boost; b.vy += ny * boost; }
    return true;
  }
  function circHit(b, r, cx, cy, cr, rest, boost) {
    var nx = b.x - cx, ny = b.y - cy, dist = Math.hypot(nx, ny);
    if (dist > r + cr || dist < .0001) return false;
    nx /= dist; ny /= dist;
    b.x = cx + nx * (r + cr); b.y = cy + ny * (r + cr);
    var vn = b.vx * nx + b.vy * ny;
    if (vn < 0) { b.vx -= (1 + rest) * vn * nx; b.vy -= (1 + rest) * vn * ny; }
    if (boost) { b.vx += nx * boost; b.vy += ny * boost; }
    return true;
  }
  function flipTip(f, L) { return { x: f.px + Math.cos(f.ang) * L.fl, y: f.py + Math.sin(f.ang) * L.fl }; }
  function serveBall(a) {
    var L = a.data.LO;
    a.data.b = { x: L.laneCx, y: L.botY - L.br * 1.4, vx: 0, vy: 0 };
    a.data.state = 'ready'; a.data.chg = 0; a.data.charge = 0;
  }
  R('pinball', {
    time: 0, lives: 3,
    setup: function (a) {
      var ph = Math.min(a.H * .94, Math.min(a.W * .62, a.H * .50) / .55);
      var pw = ph * .55;
      var ox = (a.W - pw) / 2, oy = (a.H - ph) / 2 + a.mn * .02;
      var wt = pw * .045, lw = pw * .13;
      var innerL = ox + wt, laneR = ox + pw - wt, innerR = laneR - lw;
      var topY = oy + wt, botY = oy + ph - wt, cx = (innerL + innerR) / 2;
      var L = {
        ox: ox, oy: oy, pw: pw, ph: ph, wt: wt, lw: lw,
        innerL: innerL, innerR: innerR, laneR: laneR, topY: topY, botY: botY,
        cx: cx, br: pw * .036, G: a.mn * .95, maxV: a.mn * 2.0,
        fl: pw * .22, fy: oy + ph * .80, drainW: pw * .44,
        laneCx: (innerR + laneR) / 2, archY: topY + pw * .34
      };
      L.flpLx = cx - L.drainW / 2 - pw * .02;
      L.flpRx = cx + L.drainW / 2 + pw * .02;
      a.data.LO = L;
      /* กำแพงทั้งหมด [ax, ay, bx, by, ความเด้ง] */
      a.data.walls = [
        [innerL, L.archY - pw * .05, innerL, oy + ph * .60, .55],
        [innerL, oy + ph * .60, L.flpLx - pw * .03, oy + ph * .81, .5],
        [innerR, L.archY, innerR, oy + ph * .60, .55],
        [innerR, oy + ph * .60, L.flpRx + pw * .03, oy + ph * .81, .5],
        [laneR, topY + pw * .12, laneR, botY, .4],
        [laneR, topY + pw * .12, cx + pw * .08, topY, .5],
        [cx + pw * .08, topY, innerL, L.archY - pw * .05, .5],
        [innerR, botY, laneR, botY, .3]
      ];
      a.data.bump = [
        { x: cx - pw * .19, y: oy + ph * .34, r: pw * .085, t: 0 },
        { x: cx + pw * .17, y: oy + ph * .30, r: pw * .075, t: 0 },
        { x: cx + pw * .01, y: oy + ph * .47, r: pw * .09, t: 0 }
      ];
      a.data.sling = [
        { ax: innerL + pw * .04, ay: oy + ph * .63, bx: L.flpLx - pw * .02, by: oy + ph * .765, t: 0 },
        { ax: innerR - pw * .04, ay: oy + ph * .63, bx: L.flpRx + pw * .02, by: oy + ph * .765, t: 0 }
      ];
      a.data.targ = [];
      for (var i = 0; i < 4; i++)
        a.data.targ.push({ x: cx - pw * .24 + i * pw * .16, y: oy + ph * .175, w: pw * .11, on: 1 });
      /* มุมพักของแป้นตี เลือกให้ปลายแป้นทั้งสองข้างเหลือช่องลูกตกกว้างพอให้ลูกลอดได้ */
      a.data.f = [
        { px: L.flpLx, py: L.fy, rest: .55, act: -.45, ang: .55, up: 0, t: 9 },
        { px: L.flpRx, py: L.fy, rest: Math.PI - .55, act: Math.PI + .45, ang: Math.PI - .55, up: 0, t: 9 }
      ];
      a.data.ballNo = 1;
      serveBall(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO, b = d.b;
      d.f.forEach(function (f) {
        f.ang += ((f.up ? f.act : f.rest) - f.ang) * Math.min(1, dt * 22); f.t += dt;
      });
      d.bump.forEach(function (o) { if (o.t > 0) o.t -= dt; });
      d.sling.forEach(function (o) { if (o.t > 0) o.t -= dt; });
      if (d.state === 'ready') { if (d.charge) d.chg = Math.min(1, d.chg + dt * 1.4); return; }

      b.vy += L.G * dt;
      b.vx *= Math.pow(.9, dt); b.vy *= Math.pow(.995, dt);
      var sp = Math.hypot(b.vx, b.vy);
      if (sp > L.maxV) { b.vx *= L.maxV / sp; b.vy *= L.maxV / sp; }

      /* ขยับทีละก้าวเล็ก กันลูกทะลุกำแพงตอนความเร็วสูง */
      var steps = Math.max(1, Math.min(12, Math.ceil(sp * dt / (L.br * .6))));
      for (var s = 0; s < steps; s++) {
        var h = dt / steps;
        b.x += b.vx * h; b.y += b.vy * h;
        for (var w = 0; w < d.walls.length; w++) {
          var q = d.walls[w]; segHit(b, L.br, q[0], q[1], q[2], q[3], q[4], 0);
        }
        for (var i = 0; i < d.bump.length; i++) {
          var o = d.bump[i];
          if (circHit(b, L.br, o.x, o.y, o.r, .5, a.mn * .55)) { o.t = .18; a.add(100); a.beep(950, .07); }
        }
        for (var k = 0; k < d.sling.length; k++) {
          var sl = d.sling[k];
          if (segHit(b, L.br, sl.ax, sl.ay, sl.bx, sl.by, .5, a.mn * .48)) { sl.t = .18; a.add(25); a.beep(700, .05); }
        }
        for (var t2 = 0; t2 < d.targ.length; t2++) {
          var tg = d.targ[t2]; if (!tg.on) continue;
          if (segHit(b, L.br, tg.x - tg.w / 2, tg.y, tg.x + tg.w / 2, tg.y, .4, 0)) {
            tg.on = 0; a.add(50); a.beep(1100, .08);
            if (d.targ.every(function (z) { return !z.on; })) {
              a.add(500); a.beep(1400, .3, 'triangle');
              d.targ.forEach(function (z) { z.on = 1; });
            }
          }
        }
        for (var fi = 0; fi < d.f.length; fi++) {
          var f = d.f[fi], tip = flipTip(f, L);
          var boost = (f.up && f.t < .16) ? a.mn * .95 : 0;
          if (segHit(b, L.br, f.px, f.py, tip.x, tip.y, .35, boost) && boost) a.beep(520, .05);
        }
      }
      /* ลูกไหลกลับลงรางปล่อย = ส่งกลับให้ยิงใหม่ ไม่เสียลูก */
      if (b.y > L.botY - L.br * 1.6 && b.x > L.innerR) { serveBall(a); return; }
      /* ลูกตกช่องกลางระหว่างแป้นตี */
      if (b.y > L.oy + L.ph + L.br * 2) {
        a.beep(160, .35, 'sawtooth');
        if (a.loseLife() > 0) { d.ballNo++; serveBall(a); }
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.state === 'ready') { d.charge = 1; return; }
      var f = d.f[x < a.W / 2 ? 0 : 1];
      f.up = 1; f.t = 0; a.beep(430, .04);
    },
    up: function (x, y, a) {
      var d = a.data;
      if (d.state === 'ready' && d.charge) {
        d.state = 'play'; d.charge = 0;
        d.b.vy = -a.mn * (.85 + d.chg * 1.15); d.b.vx = -a.mn * .02;
        a.beep(280, .2, 'square'); d.chg = 0;
        return;
      }
      d.f.forEach(function (f) { f.up = 0; });
    },
    draw: function (g, a) {
      a.bg('#120826', '#2a1050');
      var d = a.data, L = d.LO, b = d.b;

      /* ตัวตู้ + ขอบ */
      a.fillRR(L.ox - L.wt, L.oy - L.wt, L.pw + L.wt * 2, L.ph + L.wt * 2, L.wt * 1.4, '#3a3a52');
      a.fillRR(L.ox - L.wt * .4, L.oy - L.wt * .4, L.pw + L.wt * .8, L.ph + L.wt * .8, L.wt * 1.1, '#1b1b2e');
      /* พื้นสนาม */
      var gr = g.createLinearGradient(0, L.oy, 0, L.oy + L.ph);
      gr.addColorStop(0, '#22467e'); gr.addColorStop(1, '#0b1830');
      g.fillStyle = gr; a.rr(L.ox, L.oy, L.pw, L.ph, L.wt); g.fill();
      /* รางปล่อยลูก */
      a.fillRR(L.innerR + L.wt * .25, L.topY, L.lw - L.wt * .5, L.ph - L.wt * 2, L.wt * .5, 'rgba(0,0,0,.4)');
      /* ลายวงกลมตกแต่งกลางสนาม */
      g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = L.wt * .4;
      g.beginPath(); g.arc(L.cx, L.oy + L.ph * .40, L.pw * .34, 0, 6.2832); g.stroke();
      a.text('PINBALL', L.cx, L.oy + L.ph * .40, L.pw * .10, 'rgba(255,255,255,.07)');

      /* เป้าล้ม */
      d.targ.forEach(function (o) {
        a.fillRR(o.x - o.w / 2, o.y - L.pw * .022, o.w, L.pw * .044, L.pw * .012,
          o.on ? a.C.good : 'rgba(255,255,255,.14)');
      });

      /* กำแพง */
      g.lineCap = 'round'; g.strokeStyle = '#8fb0ff'; g.lineWidth = L.wt * .5;
      d.walls.forEach(function (q) { g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q[2], q[3]); g.stroke(); });

      /* สลิงช็อต */
      d.sling.forEach(function (o) {
        g.strokeStyle = o.t > 0 ? '#fff' : a.C.primary;
        g.lineWidth = L.wt * (o.t > 0 ? 1.0 : .8);
        g.beginPath(); g.moveTo(o.ax, o.ay); g.lineTo(o.bx, o.by); g.stroke();
      });

      /* หมุดชน */
      d.bump.forEach(function (o) {
        var k = 1 + (o.t > 0 ? o.t * 1.2 : 0);
        a.circle(o.x, o.y, o.r * k, o.t > 0 ? '#ffffff' : a.C.accent);
        a.circle(o.x, o.y, o.r * .64 * k, a.C.primary);
        a.circle(o.x, o.y, o.r * .26 * k, '#fff');
      });

      /* แป้นตี */
      d.f.forEach(function (f) {
        var tip = flipTip(f, L);
        g.strokeStyle = f.up ? '#fff' : a.C.secondary;
        g.lineWidth = L.br * 1.5; g.lineCap = 'round';
        g.beginPath(); g.moveTo(f.px, f.py); g.lineTo(tip.x, tip.y); g.stroke();
        a.circle(f.px, f.py, L.br * .5, '#cfd8ff');
      });

      /* สปริงปล่อยลูก */
      var spx = L.laneCx, spTop = L.botY - L.br * 2.2 + d.chg * L.br * 1.6;
      g.strokeStyle = '#c9c9dd'; g.lineWidth = L.wt * .3;
      g.beginPath();
      for (var i = 0; i <= 6; i++) {
        var yy = spTop + (L.botY - spTop) * (i / 6);
        g[i ? 'lineTo' : 'moveTo'](spx + (i % 2 ? L.lw * .22 : -L.lw * .22), yy);
      }
      g.stroke();

      /* ลูกบอล */
      var by = b.y + (d.state === 'ready' ? d.chg * L.br * 1.6 : 0);
      a.circle(b.x, by, L.br, '#e9edff');
      a.circle(b.x - L.br * .3, by - L.br * .3, L.br * .28, '#ffffff');

      /* แถบแรงตอนดึงสปริง */
      if (d.state === 'ready') {
        var bw = L.pw * .5, bx = L.cx - bw / 2, byy = L.oy + L.ph * .90;
        a.fillRR(bx, byy, bw, L.pw * .045, L.pw * .022, 'rgba(0,0,0,.45)');
        a.fillRR(bx, byy, bw * d.chg, L.pw * .045, L.pw * .022, a.C.accent);
      }

      a.text(a.txt({ th: 'ลูกที่ ' + Math.min(d.ballNo, 3) + '/3', en: 'BALL ' + Math.min(d.ballNo, 3) + '/3' }),
        L.ox + L.pw * .18, L.oy + L.ph * .955, L.pw * .07, 'rgba(255,255,255,.75)');

      a.head(d.state === 'ready'
        ? a.txt({ th: 'กดค้างเพื่อดึงสปริง แล้วปล่อยเพื่อยิงลูก', en: 'Hold to pull the plunger, release to launch' })
        : a.txt({ th: 'แตะครึ่งซ้าย/ขวาของจอเพื่อตีแป้น', en: 'Tap the left or right half to flip' }));
    }
  });

  /* ---------- 68 ข้ามถนน ---------- */
  R('froggy', {
    time: 0,
    setup: function (a) {
      var lanes = a.port ? 8 : 6;
      var top = a.mn * .16;
      var lh = (a.H - top - a.mn * .08) / (lanes + 1);
      a.data.LO = { lanes: lanes, lh: lh, top: top, size: lh * .7 };
      a.data.row = lanes; a.data.cars = []; a.data.round = 1;
      mkLanes(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.cars.forEach(function (c) {
        c.x += c.v * dt;
        if (c.v > 0 && c.x > a.W + c.w) c.x = -c.w;
        if (c.v < 0 && c.x < -c.w) c.x = a.W + c.w;
      });
      var py = L.top + (d.row + .5) * L.lh;
      var px = a.W / 2;
      var hit = d.cars.some(function (c) {
        return c.lane === d.row && Math.abs(c.x + c.w / 2 - px) < c.w / 2 + L.size * .35;
      });
      if (hit) { a.beep(140, .35, 'sawtooth'); a.end(); }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (y < a.H / 2) { d.row--; a.add(5); a.beep(620, .05, 'triangle'); }
      else d.row = Math.min(d.LO.lanes, d.row + 1);
      if (d.row < 0) { a.add(50); d.round++; d.row = d.LO.lanes; mkLanes(a); a.beep(1100, .2, 'triangle'); }
    },
    draw: function (g, a) {
      a.bg('#123b1f', '#2fa050');
      var d = a.data, L = d.LO;
      for (var i = 0; i <= L.lanes; i++) {
        var y = L.top + i * L.lh;
        g.fillStyle = i === L.lanes || i === 0 ? '#2e7d3a' : '#3a3a48';
        g.fillRect(0, y, a.W, L.lh);
        if (i > 0 && i < L.lanes) {
          g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.setLineDash([a.mn * .04, a.mn * .04]);
          g.beginPath(); g.moveTo(0, y); g.lineTo(a.W, y); g.stroke(); g.setLineDash([]);
        }
      }
      d.cars.forEach(function (c) {
        var y = L.top + (c.lane + .5) * L.lh;
        a.fillRR(c.x, y - L.size * .35, c.w, L.size * .7, L.size * .15, c.col);
      });
      EM(g, '🐸', a.W / 2, L.top + (d.row + .5) * L.lh, L.size);
      a.head(a.txt({ th: 'รอบ ' + d.round + ' — แตะครึ่งบนเพื่อก้าวไปข้างหน้า', en: 'Round ' + d.round + ' — tap the top half to hop' }));
    }
  });
  function mkLanes(a) {
    var d = a.data, L = d.LO, cols = ['#ff2e88', '#ffd23f', '#00d4ff', '#ff6a3d', '#b06bff'];
    d.cars = [];
    for (var i = 1; i < L.lanes; i++) {
      var n = a.rndi(1, 2), dir = i % 2 ? 1 : -1;
      var v = dir * a.mn * (.15 + Math.random() * .2) * (1 + d.round * .12);
      for (var k = 0; k < n; k++)
        d.cars.push({ lane: i, x: a.rnd(0, a.W), w: a.mn * (.12 + Math.random() * .1), v: v, col: a.pick(cols) });
    }
  }

  /* ---------- 69 ปีนหน้าผา ---------- */
  var CLIMB_OB = ['🌰', '🦅', '🌵'];
  R('climbup', {
    time: 0,
    setup: function (a) {
      a.data.LO = { wall: a.mn * .16, r: a.mn * .038, up: a.mn * .42, jd: .26 };
      a.data.side = -1; a.data.pos = -1; a.data.from = -1; a.data.jt = 1; a.data.jump = 0;
      a.data.y = a.H * .7; a.data.cam = 0; a.data.ob = []; a.data.t = 0; a.data.trail = [];
      for (var i = 1; i < 16; i++)
        a.data.ob.push({ y: a.H * .7 - i * a.mn * .3, side: Math.random() < .5 ? -1 : 1, e: a.pick(CLIMB_OB) });
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.t += dt;
      d.y -= L.up * dt * (1 + d.t * .02);
      a.setScore(Math.floor((a.H * .7 - d.y) / (a.mn * .06)));
      d.cam = d.y - a.H * .62;

      /* อนิเมชันกระโดดข้ามฝั่ง */
      if (d.jump) {
        d.jt = Math.min(1, d.jt + dt / L.jd);
        var e = d.jt * d.jt * (3 - 2 * d.jt);                 /* smoothstep ให้ออกตัวและลงนุ่ม */
        d.pos = d.from + (d.side - d.from) * e;
        d.trail.push({ x: climbX(a, d.pos), y: d.y + hopY(a, d.jt), t: .22 });
        if (d.jt >= 1) { d.jump = 0; d.pos = d.side; a.beep(760, .05, 'triangle'); }
      }
      d.trail.forEach(function (p) { p.t -= dt; });
      d.trail = d.trail.filter(function (p) { return p.t > 0; });

      /* ระหว่างลอยข้าม ยังไม่นับชน (เป็นจังหวะหลบพอดี) */
      if (!d.jump) d.ob.forEach(function (o) {
        if (o.hit) return;
        if (o.side === d.side && Math.abs(o.y - d.y) < L.r * 1.6) { o.hit = 1; a.beep(140, .35, 'sawtooth'); a.end(); }
      });

      var top = Math.min.apply(null, d.ob.map(function (o) { return o.y; }));
      while (top > d.cam - a.H * .4) { top -= a.mn * (.24 + Math.random() * .16); d.ob.push({ y: top, side: Math.random() < .5 ? -1 : 1, e: a.pick(CLIMB_OB) }); }
      d.ob = d.ob.filter(function (o) { return o.y < d.cam + a.H * 1.2; });
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.jump) return;                     /* กำลังลอยอยู่ กดซ้ำไม่ได้ */
      d.from = d.pos; d.side = -d.side; d.jt = 0; d.jump = 1;
      a.beep(520, .06, 'triangle');
    },
    draw: function (g, a) {
      a.bg('#0a1a3d', '#2a6ba8');
      var d = a.data, L = d.LO;
      g.fillStyle = '#4a3a2e'; g.fillRect(0, 0, L.wall, a.H); g.fillRect(a.W - L.wall, 0, L.wall, a.H);
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2;
      for (var k = 0; k < 14; k++) {
        var wy = ((k * a.mn * .18) - d.cam * .5) % (a.H + a.mn * .2) - a.mn * .1;
        g.beginPath(); g.moveTo(0, wy); g.lineTo(L.wall, wy + a.mn * .04);
        g.moveTo(a.W - L.wall, wy + a.mn * .04); g.lineTo(a.W, wy); g.stroke();
      }
      g.save(); g.translate(0, -d.cam);
      d.ob.forEach(function (o) {
        var sy = o.y - d.cam; if (sy < -a.mn * .1 || sy > a.H + a.mn * .1) return;
        EM(g, o.e, climbX(a, o.side), o.y, L.r * 2);
      });
      /* เส้นทางกระโดด + เงาตามหลัง */
      if (d.jump) {
        g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = Math.max(2, L.r * .3);
        g.setLineDash([L.r * .5, L.r * .6]);
        g.beginPath();
        for (var s = 0; s <= 12; s++) {
          var e2 = s / 12, ee = e2 * e2 * (3 - 2 * e2);
          var px2 = climbX(a, d.from + (d.side - d.from) * ee), py2 = d.y + hopY(a, e2);
          g[s ? 'lineTo' : 'moveTo'](px2, py2);
        }
        g.stroke(); g.setLineDash([]);
      }
      d.trail.forEach(function (p) {
        g.globalAlpha = p.t * 2.2; EM(g, '🧗', p.x, p.y, L.r * 2.0); g.globalAlpha = 1;
      });
      var cx = climbX(a, d.pos), cy = d.y + hopY(a, d.jump ? d.jt : 1);
      g.save(); g.translate(cx, cy);
      if (d.jump) g.rotate(Math.sin(d.jt * Math.PI) * .55 * (d.side > 0 ? 1 : -1));
      EM(g, '🧗', 0, 0, L.r * 2.2); g.restore();
      g.restore();
      a.head(a.txt({ th: 'แตะเพื่อกระโดดข้ามผนัง หลบสิ่งกีดขวาง', en: 'Tap to leap to the other wall and dodge' }));
    }
  });
  /* pos: -1 = ผนังซ้าย, 1 = ผนังขวา */
  function climbX(a, pos) {
    var L = a.data.LO, lx = L.wall + L.r, rx = a.W - L.wall - L.r;
    return lx + (rx - lx) * (pos + 1) / 2;
  }
  function hopY(a, t) {
    if (t >= 1) return 0;
    return -Math.sin(t * Math.PI) * a.data.LO.r * 1.8;    /* โค้งกระโดดขึ้นแล้วลง */
  }

  /* ---------- 70 ทาสีให้เต็ม ---------- */
  R('paintfill', {
    setup: function (a) {
      var cols = a.port ? 12 : 20, rows = a.port ? 20 : 12;
      var s = Math.min((a.W - a.mn * .08) / cols, (a.H - a.mn * .26) / rows);
      a.data.LO = { cols: cols, rows: rows, s: s, ox: (a.W - cols * s) / 2, oy: a.mn * .16, brush: s * 1.1 };
      a.data.cell = []; a.data.lv = 1;
      mkPaint(a);
    },
    down: function (x, y, a) { brush(x, y, a); },
    move: function (x, y, a) { if (a.pointer.down) brush(x, y, a); },
    draw: function (g, a) {
      a.bg('#2a1150', '#0d5c8f');
      var d = a.data, L = d.LO;
      for (var i = 0; i < d.cell.length; i++) {
        var c = i % L.cols, r = Math.floor(i / L.cols), o = d.cell[i];
        var col = o === 2 ? '#1b1442' : (o === 1 ? a.C.primary : 'rgba(255,255,255,.14)');
        a.fillRR(L.ox + c * L.s + 1, L.oy + r * L.s + 1, L.s - 2, L.s - 2, L.s * .18, col);
      }
      var pct = Math.round(d.done / d.total * 100);
      var bw = a.W * .6, bx = (a.W - bw) / 2, by = a.H - a.mn * .10;
      a.fillRR(bx, by, bw, a.mn * .04, a.mn * .02, 'rgba(0,0,0,.35)');
      a.fillRR(bx, by, bw * Math.min(1, pct / 100), a.mn * .04, a.mn * .02, a.C.good);
      a.text(pct + '%', a.W / 2, by + a.mn * .02, a.mn * .028, '#fff');
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — ทาให้ถึง 90% • เลี่ยงช่องดำ', en: 'Level ' + d.lv + ' — reach 90% • avoid the black cells' }));
    }
  });
  function mkPaint(a) {
    var d = a.data, L = d.LO;
    d.cell = []; d.done = 0; d.total = 0;
    for (var i = 0; i < L.cols * L.rows; i++) {
      var bad = Math.random() < .04 + d.lv * .012;
      d.cell.push(bad ? 2 : 0);
      if (!bad) d.total++;
    }
  }
  function brush(x, y, a) {
    var d = a.data, L = d.LO;
    var c0 = Math.floor((x - L.ox) / L.s), r0 = Math.floor((y - L.oy) / L.s);
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      var c = c0 + dc, r = r0 + dr;
      if (c < 0 || r < 0 || c >= L.cols || r >= L.rows) continue;
      var i = r * L.cols + c, o = d.cell[i];
      if (o === 2) { a.add(-10); d.cell[i] = 3; a.beep(170, .15, 'square'); }
      else if (o === 0) { d.cell[i] = 1; d.done++; a.add(2); }
    }
    if (d.done / d.total >= .9) {
      a.add(120); a.addTime(15); a.beep(1200, .3, 'triangle'); d.lv++; mkPaint(a);
    }
  }
})();
