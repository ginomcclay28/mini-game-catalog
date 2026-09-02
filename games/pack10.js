/* ============================================================
   PACK 10 — เกม 91-100  (2 ผู้เล่นบนจอเดียวกัน)
   แนวนอน = ซ้าย/ขวา  •  แนวตั้ง = ล่าง/บน (ฝั่งบนกลับหัวให้หันเข้าหากัน)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }
  var P1 = '#00d4ff', P2 = '#ff2e88';

  /* กรอบของผู้เล่น i (0 = ล่าง/ซ้าย, 1 = บน/ขวา) */
  function side(a, i) {
    if (a.port) return { x: 0, y: i ? 0 : a.H / 2, w: a.W, h: a.H / 2, flip: i === 1 };
    return { x: i ? a.W / 2 : 0, y: 0, w: a.W / 2, h: a.H, flip: false };
  }
  /* วาดในระบบพิกัดของฝั่งนั้น (0,0 = มุมบนซ้ายของฝั่ง) */
  function inSide(g, a, i, fn) {
    var s = side(a, i);
    g.save(); g.translate(s.x, s.y);
    if (s.flip) { g.translate(s.w, s.h); g.rotate(Math.PI); }
    fn(s.w, s.h);
    g.restore();
  }
  /* แปลงพิกัดสัมผัสเป็นพิกัดภายในฝั่ง คืน null ถ้าไม่ได้อยู่ในฝั่งนั้น */
  function local(a, i, x, y) {
    var s = side(a, i);
    var lx = x - s.x, ly = y - s.y;
    if (lx < 0 || ly < 0 || lx > s.w || ly > s.h) return null;
    return s.flip ? { x: s.w - lx, y: s.h - ly, w: s.w, h: s.h } : { x: lx, y: ly, w: s.w, h: s.h };
  }
  function which(a, x, y) { return local(a, 0, x, y) ? 0 : (local(a, 1, x, y) ? 1 : -1); }
  function divider(g, a) {
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = Math.max(2, a.mn * .006); g.setLineDash([a.mn * .03, a.mn * .03]);
    g.beginPath();
    if (a.port) { g.moveTo(0, a.H / 2); g.lineTo(a.W, a.H / 2); } else { g.moveTo(a.W / 2, 0); g.lineTo(a.W / 2, a.H); }
    g.stroke(); g.setLineDash([]);
  }
  /* ป้ายผลผู้ชนะกลางจอ */
  function banner(a, g, txt, col) {
    var w = Math.min(a.W * .82, a.mn * .9);
    a.fillRR((a.W - w) / 2, a.H / 2 - a.mn * .10, w, a.mn * .20, a.mn * .03, 'rgba(10,5,25,.88)');
    a.text(txt, a.W / 2, a.H / 2, a.mn * .07, col || a.C.accent);
  }

  /* ---------- 91 ชักเย่อ ---------- */
  R('vstug', {
    noScore: true,
    setup: function (a) { a.data.pos = 0; a.data.s = [0, 0]; a.data.over = 0; },
    update: function (dt, a) {
      var d = a.data;
      d.pos *= Math.pow(.6, dt);
      if (!d.over && Math.abs(d.pos) > 1) { d.over = d.pos > 0 ? 1 : 2; a.beep(1200, .35, 'triangle'); a.end(win(a, d.over)); }
      if (!d.over && a.timeLeft <= .05) {
        d.over = d.s[0] === d.s[1] ? 3 : (d.s[0] > d.s[1] ? 1 : 2);
      }
    },
    down: function (x, y, a) {
      var d = a.data, w = which(a, x, y); if (w < 0 || d.over) return;
      d.s[w]++; d.pos += (w === 0 ? -.045 : .045); a.beep(400 + d.s[w] * 3, .04, 'triangle');
    },
    draw: function (g, a) {
      a.bg('#1a1040', '#3a1060');
      var d = a.data;
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          g.fillStyle = i ? 'rgba(255,46,136,.16)' : 'rgba(0,212,255,.16)';
          g.fillRect(0, 0, w, h);
          a.text('P' + (i + 1) + '  ' + d.s[i], w / 2, h * .18, a.mn * .06, i ? P2 : P1);
          a.text(a.txt({ th: 'แตะรัว!', en: 'TAP!' }), w / 2, h * .78, a.mn * .05, 'rgba(255,255,255,.55)');
        });
      });
      divider(g, a);
      var cx = a.W / 2, cy = a.H / 2;
      var off = d.pos * Math.min(a.W, a.H) * .3;
      if (a.port) {
        g.strokeStyle = '#c9a227'; g.lineWidth = a.mn * .02;
        g.beginPath(); g.moveTo(cx, cy - a.mn * .3); g.lineTo(cx, cy + a.mn * .3); g.stroke();
        a.circle(cx, cy + off, a.mn * .05, a.C.accent);
      } else {
        g.strokeStyle = '#c9a227'; g.lineWidth = a.mn * .02;
        g.beginPath(); g.moveTo(cx - a.mn * .3, cy); g.lineTo(cx + a.mn * .3, cy); g.stroke();
        a.circle(cx + off, cy, a.mn * .05, a.C.accent);
      }
      if (d.over) banner(a, g, d.over === 3 ? a.txt({ th: 'เสมอ!', en: 'DRAW!' }) : win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });
  function win(a, p) { return a.txt({ th: 'ผู้เล่น ' + p + ' ชนะ!', en: 'Player ' + p + ' wins!' }); }

  /* ---------- 92 ปิงปอง 2 คน ---------- */
  R('vspong', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.LO = { pw: a.port ? a.mn * .26 : a.mn * .03, ph: a.port ? a.mn * .03 : a.mn * .26, r: a.mn * .028, sp: a.mn * .62 };
      a.data.p = [a.port ? a.W / 2 : a.H / 2, a.port ? a.W / 2 : a.H / 2];
      a.data.s = [0, 0]; a.data.over = 0; serve(a, 0);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO; if (d.over) return;
      d.x += d.vx * dt; d.y += d.vy * dt;
      if (a.port) {
        if (d.x < L.r) { d.x = L.r; d.vx = Math.abs(d.vx); } if (d.x > a.W - L.r) { d.x = a.W - L.r; d.vx = -Math.abs(d.vx); }
        var top = a.mn * .06, bot = a.H - a.mn * .06;
        if (d.vy < 0 && d.y < top + L.ph) { if (Math.abs(d.x - d.p[1]) < L.pw / 2 + L.r) { d.vy = Math.abs(d.vy) * 1.04; d.vx += (d.x - d.p[1]) * 2; d.y = top + L.ph + L.r; a.beep(700, .05); } }
        if (d.vy > 0 && d.y > bot - L.ph) { if (Math.abs(d.x - d.p[0]) < L.pw / 2 + L.r) { d.vy = -Math.abs(d.vy) * 1.04; d.vx += (d.x - d.p[0]) * 2; d.y = bot - L.ph - L.r; a.beep(700, .05); } }
        if (d.y < -L.r * 3) point(a, 0); else if (d.y > a.H + L.r * 3) point(a, 1);
      } else {
        if (d.y < L.r) { d.y = L.r; d.vy = Math.abs(d.vy); } if (d.y > a.H - L.r) { d.y = a.H - L.r; d.vy = -Math.abs(d.vy); }
        var lft = a.mn * .06, rgt = a.W - a.mn * .06;
        if (d.vx < 0 && d.x < lft + L.pw) { if (Math.abs(d.y - d.p[0]) < L.ph / 2 + L.r) { d.vx = Math.abs(d.vx) * 1.04; d.vy += (d.y - d.p[0]) * 2; d.x = lft + L.pw + L.r; a.beep(700, .05); } }
        if (d.vx > 0 && d.x > rgt - L.pw) { if (Math.abs(d.y - d.p[1]) < L.ph / 2 + L.r) { d.vx = -Math.abs(d.vx) * 1.04; d.vy += (d.y - d.p[1]) * 2; d.x = rgt - L.pw - L.r; a.beep(700, .05); } }
        if (d.x < -L.r * 3) point(a, 1); else if (d.x > a.W + L.r * 3) point(a, 0);
      }
    },
    down: function (x, y, a) { pad(a, x, y); },
    move: function (x, y, a) { if (a.pointer.down) pad(a, x, y); },
    draw: function (g, a) {
      a.bg('#06121f', '#0d3b57');
      var d = a.data, L = d.LO;
      divider(g, a);
      if (a.port) {
        a.fillRR(d.p[1] - L.pw / 2, a.mn * .06 - L.ph, L.pw, L.ph, L.ph / 2, P2);
        a.fillRR(d.p[0] - L.pw / 2, a.H - a.mn * .06, L.pw, L.ph, L.ph / 2, P1);
        a.text(d.s[1] + '', a.W * .12, a.H * .30, a.mn * .1, 'rgba(255,46,136,.5)');
        a.text(d.s[0] + '', a.W * .12, a.H * .70, a.mn * .1, 'rgba(0,212,255,.5)');
      } else {
        a.fillRR(a.mn * .06 - L.pw, d.p[0] - L.ph / 2, L.pw, L.ph, L.pw / 2, P1);
        a.fillRR(a.W - a.mn * .06, d.p[1] - L.ph / 2, L.pw, L.ph, L.pw / 2, P2);
        a.text(d.s[0] + '', a.W * .30, a.H * .16, a.mn * .1, 'rgba(0,212,255,.5)');
        a.text(d.s[1] + '', a.W * .70, a.H * .16, a.mn * .1, 'rgba(255,46,136,.5)');
      }
      a.circle(d.x, d.y, L.r, '#fff');
      if (d.over) banner(a, g, win(a, d.over), d.over === 2 ? P2 : P1);
      a.head(a.txt({ th: 'ใครถึง 7 แต้มก่อนชนะ', en: 'First to 7 points' }));
    }
  });
  function pad(a, x, y) {
    var d = a.data, L = d.LO, w = which(a, x, y); if (w < 0) return;
    if (a.port) d.p[w] = Math.max(L.pw / 2, Math.min(a.W - L.pw / 2, x));
    else d.p[w] = Math.max(L.ph / 2, Math.min(a.H - L.ph / 2, y));
  }
  function serve(a, to) {
    var d = a.data, L = d.LO;
    d.x = a.W / 2; d.y = a.H / 2;
    var ang = a.rnd(-.5, .5);
    if (a.port) { d.vx = Math.sin(ang) * L.sp; d.vy = (to ? -1 : 1) * Math.cos(ang) * L.sp; }
    else { d.vy = Math.sin(ang) * L.sp; d.vx = (to ? 1 : -1) * Math.cos(ang) * L.sp; }
  }
  function point(a, p) {
    var d = a.data;
    d.s[p]++; a.beep(p ? 400 : 900, .2);
    if (d.s[p] >= 7) { d.over = p + 1; a.beep(1200, .35, 'triangle'); a.end(win(a, p + 1)); }
    else serve(a, p);
  }

  /* ---------- 93 แอร์ฮอกกี้ ---------- */
  R('vsair', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.LO = { mr: a.mn * .07, pr: a.mn * .04, gw: Math.min(a.W, a.H) * .34 };
      a.data.m = [{ x: a.W / 2, y: a.H * .75 }, { x: a.W / 2, y: a.H * .25 }];
      if (!a.port) { a.data.m = [{ x: a.W * .25, y: a.H / 2 }, { x: a.W * .75, y: a.H / 2 }]; }
      a.data.s = [0, 0]; a.data.over = 0; puck(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO; if (d.over) return;
      d.px += d.pvx * dt; d.py += d.pvy * dt;
      d.pvx *= Math.pow(.75, dt); d.pvy *= Math.pow(.75, dt);
      var gx0 = a.W / 2 - L.gw / 2, gx1 = a.W / 2 + L.gw / 2;
      var gy0 = a.H / 2 - L.gw / 2, gy1 = a.H / 2 + L.gw / 2;
      if (a.port) {
        if (d.px < L.pr) { d.px = L.pr; d.pvx = Math.abs(d.pvx); } if (d.px > a.W - L.pr) { d.px = a.W - L.pr; d.pvx = -Math.abs(d.pvx); }
        if (d.py < L.pr) { if (d.px > gx0 && d.px < gx1) return goal(a, 0); d.py = L.pr; d.pvy = Math.abs(d.pvy); }
        if (d.py > a.H - L.pr) { if (d.px > gx0 && d.px < gx1) return goal(a, 1); d.py = a.H - L.pr; d.pvy = -Math.abs(d.pvy); }
      } else {
        if (d.py < L.pr) { d.py = L.pr; d.pvy = Math.abs(d.pvy); } if (d.py > a.H - L.pr) { d.py = a.H - L.pr; d.pvy = -Math.abs(d.pvy); }
        if (d.px < L.pr) { if (d.py > gy0 && d.py < gy1) return goal(a, 1); d.px = L.pr; d.pvx = Math.abs(d.pvx); }
        if (d.px > a.W - L.pr) { if (d.py > gy0 && d.py < gy1) return goal(a, 0); d.px = a.W - L.pr; d.pvx = -Math.abs(d.pvx); }
      }
      d.m.forEach(function (m) {
        var dx = d.px - m.x, dy = d.py - m.y, len = Math.hypot(dx, dy) || 1;
        if (len < L.mr + L.pr) {
          var sp = Math.max(a.mn * .55, Math.hypot(d.pvx, d.pvy));
          d.pvx = dx / len * sp; d.pvy = dy / len * sp;
          d.px = m.x + dx / len * (L.mr + L.pr); d.py = m.y + dy / len * (L.mr + L.pr);
          a.beep(620, .05);
        }
      });
    },
    down: function (x, y, a) { mallet(a, x, y); },
    move: function (x, y, a) { if (a.pointer.down) mallet(a, x, y); },
    draw: function (g, a) {
      a.bg('#0d2a3d', '#1b6f8c');
      var d = a.data, L = d.LO;
      divider(g, a);
      g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 3;
      g.beginPath(); g.arc(a.W / 2, a.H / 2, Math.min(a.W, a.H) * .16, 0, 6.29); g.stroke();
      g.fillStyle = a.C.accent;
      if (a.port) {
        g.fillRect(a.W / 2 - L.gw / 2, 0, L.gw, a.mn * .02);
        g.fillRect(a.W / 2 - L.gw / 2, a.H - a.mn * .02, L.gw, a.mn * .02);
      } else {
        g.fillRect(0, a.H / 2 - L.gw / 2, a.mn * .02, L.gw);
        g.fillRect(a.W - a.mn * .02, a.H / 2 - L.gw / 2, a.mn * .02, L.gw);
      }
      a.circle(d.m[0].x, d.m[0].y, L.mr, P1);
      a.circle(d.m[1].x, d.m[1].y, L.mr, P2);
      a.circle(d.px, d.py, L.pr, '#fff');
      a.text(d.s[0] + ' : ' + d.s[1], a.W / 2, a.mn * .07, a.mn * .06, '#fff');
      if (d.over) banner(a, g, win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });
  function mallet(a, x, y) {
    var d = a.data, L = d.LO, w = which(a, x, y); if (w < 0) return;
    var s = side(a, w);
    d.m[w].x = Math.max(s.x + L.mr, Math.min(s.x + s.w - L.mr, x));
    d.m[w].y = Math.max(s.y + L.mr, Math.min(s.y + s.h - L.mr, y));
  }
  function puck(a) {
    var d = a.data;
    d.px = a.W / 2; d.py = a.H / 2;
    d.pvx = a.rnd(-a.mn * .2, a.mn * .2); d.pvy = a.rnd(-a.mn * .2, a.mn * .2);
  }
  function goal(a, p) {
    var d = a.data;
    d.s[p]++; a.beep(p ? 400 : 950, .25, 'triangle');
    if (d.s[p] >= 5) { d.over = p + 1; a.end(win(a, p + 1)); } else puck(a);
  }

  /* ---------- 94 กดเร็วแข่งกัน ---------- */
  R('vstap', {
    noScore: true,
    setup: function (a) { a.data.s = [0, 0]; a.data.go = 0; a.data.cd = 3; },
    update: function (dt, a) {
      var d = a.data;
      if (!d.go) { d.cd -= dt; if (d.cd <= 0) { d.go = 1; a.beep(1000, .2, 'triangle'); } a.addTime(dt); }
      if (d.go && a.timeLeft <= .05 && !d.over) d.over = d.s[0] === d.s[1] ? 3 : (d.s[0] > d.s[1] ? 1 : 2);
    },
    down: function (x, y, a) {
      var d = a.data, w = which(a, x, y); if (w < 0 || !d.go) return;
      d.s[w]++; a.beep(420 + d.s[w] * 4, .035, 'triangle');
    },
    draw: function (g, a) {
      a.bg('#2a0d4a', '#c8461e');
      var d = a.data, mx = Math.max(1, d.s[0], d.s[1]);
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          g.fillStyle = i ? 'rgba(255,46,136,.18)' : 'rgba(0,212,255,.18)';
          g.fillRect(0, 0, w, h);
          var r = Math.min(w, h) * .22;
          a.circle(w / 2, h * .5, r, i ? P2 : P1);
          a.text(d.s[i] + '', w / 2, h * .5, r * .7, '#fff');
          a.text('P' + (i + 1), w / 2, h * .16, a.mn * .05, 'rgba(255,255,255,.75)');
          var bw = w * .7;
          a.fillRR((w - bw) / 2, h * .84, bw, a.mn * .03, a.mn * .015, 'rgba(0,0,0,.35)');
          a.fillRR((w - bw) / 2, h * .84, bw * (d.s[i] / mx), a.mn * .03, a.mn * .015, i ? P2 : P1);
        });
      });
      divider(g, a);
      if (!d.go) banner(a, g, Math.ceil(d.cd) + '', '#fff');
      if (d.over) banner(a, g, d.over === 3 ? a.txt({ th: 'เสมอ!', en: 'DRAW!' }) : win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });

  /* ---------- 95 ดวลปฏิกิริยา ---------- */
  R('vsreact', {
    time: 0, noScore: true,
    setup: function (a) { a.data.s = [0, 0]; a.data.st = 'wait'; a.data.t = a.rnd(1.4, 3.6); a.data.msg = ''; a.data.over = 0; },
    update: function (dt, a) {
      var d = a.data;
      if (d.over) return;
      d.t -= dt;
      if (d.st === 'wait' && d.t <= 0) { d.st = 'go'; a.beep(1000, .12); }
      else if (d.st === 'res' && d.t <= 0) {
        if (d.s[0] >= 5 || d.s[1] >= 5) { d.over = d.s[0] > d.s[1] ? 1 : 2; a.end(win(a, d.over)); return; }
        d.st = 'wait'; d.t = a.rnd(1.4, 3.6); d.msg = '';
      }
    },
    down: function (x, y, a) {
      var d = a.data, w = which(a, x, y); if (w < 0 || d.over) return;
      if (d.st === 'wait') {
        d.s[1 - w]++; d.msg = a.txt({ th: 'P' + (w + 1) + ' แตะก่อนสัญญาณ!', en: 'P' + (w + 1) + ' jumped the gun!' });
        a.beep(160, .3, 'square'); d.st = 'res'; d.t = 1.3;
      } else if (d.st === 'go') {
        d.s[w]++; d.msg = a.txt({ th: 'P' + (w + 1) + ' เร็วกว่า!', en: 'P' + (w + 1) + ' was faster!' });
        a.beep(1050, .2, 'triangle'); d.st = 'res'; d.t = 1.3;
      }
    },
    draw: function (g, a) {
      var d = a.data;
      g.fillStyle = d.st === 'go' ? '#2fe08a' : (d.st === 'wait' ? '#b8281f' : '#2b2350');
      g.fillRect(0, 0, a.W, a.H);
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          a.text('P' + (i + 1) + '  ' + d.s[i], w / 2, h * .2, a.mn * .07, i ? P2 : P1);
        });
      });
      divider(g, a);
      a.text(d.st === 'go' ? a.txt({ th: 'แตะเลย!', en: 'TAP!' }) : (d.msg || a.txt({ th: 'รอ…', en: 'Wait…' })),
        a.W / 2, a.H / 2, a.mn * .08, '#fff');
      if (d.over) banner(a, g, win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });

  /* ---------- 96 ดันตกเวที ---------- */
  R('vssumo', {
    time: 0, noScore: true,
    setup: function (a) { a.data.pos = 0; a.data.round = [0, 0]; a.data.msg = ''; a.data.t = 0; a.data.over = 0; },
    update: function (dt, a) {
      var d = a.data;
      if (d.t > 0) { d.t -= dt; if (d.t <= 0) { d.msg = ''; d.pos = 0; } return; }
      if (d.over) return;
      d.pos *= Math.pow(.72, dt);
      if (Math.abs(d.pos) > 1) {
        var w = d.pos > 0 ? 0 : 1;
        d.round[w]++; d.msg = a.txt({ th: 'P' + (w + 1) + ' ชนะยกนี้', en: 'P' + (w + 1) + ' takes the round' });
        a.beep(1000, .25, 'triangle'); d.t = 1.4;
        if (d.round[w] >= 3) { d.over = w + 1; a.end(win(a, w + 1)); }
      }
    },
    down: function (x, y, a) {
      var d = a.data, w = which(a, x, y); if (w < 0 || d.t > 0 || d.over) return;
      d.pos += (w === 0 ? .05 : -.05); a.beep(380, .04, 'square');
    },
    draw: function (g, a) {
      a.bg('#3a1a0a', '#c8761e');
      var d = a.data, cx = a.W / 2, cy = a.H / 2, Rr = Math.min(a.W, a.H) * .38;
      a.circle(cx, cy, Rr, '#e3c08a'); a.circle(cx, cy, Rr * .92, '#c99a5b');
      var off = d.pos * Rr * .8;
      var ax = a.port ? cx : cx - Rr * .3 + off, ay = a.port ? cy + Rr * .3 - off : cy;
      var bx = a.port ? cx : cx + Rr * .3 + off, by = a.port ? cy - Rr * .3 - off : cy;
      if (a.port) { ax = cx; bx = cx; ay = cy + Rr * .3 - off; by = cy - Rr * .3 - off; }
      EM(g, '🐯', ax, ay, Rr * .38);
      EM(g, '🐻', bx, by, Rr * .38);
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          a.text('P' + (i + 1) + '  ' + d.round[i] + '/3', w / 2, h * .12, a.mn * .05, i ? P2 : P1);
        });
      });
      divider(g, a);
      if (d.msg) banner(a, g, d.msg);
      if (d.over) banner(a, g, win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });

  /* ---------- 97 เก็บของแข่งกัน ---------- */
  R('vscatch', {
    noScore: true,
    setup: function (a) {
      a.data.LO = { hw: a.mn * .10, is: a.mn * .07 };
      a.data.b = [null, null]; a.data.it = [[], []]; a.data.sp = [.5, .8]; a.data.s = [0, 0]; a.data.over = 0;
      [0, 1].forEach(function (i) { var s = side(a, i); a.data.b[i] = s.w / 2; });
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (!d.over && a.timeLeft <= .05) d.over = d.s[0] === d.s[1] ? 3 : (d.s[0] > d.s[1] ? 1 : 2);
      [0, 1].forEach(function (i) {
        var s = side(a, i);
        d.sp[i] -= dt;
        if (d.sp[i] <= 0) {
          var bomb = Math.random() < .22;
          d.it[i].push({ x: a.rnd(L.is, s.w - L.is), y: -L.is, v: a.rnd(a.mn * .32, a.mn * .5), b: bomb, e: bomb ? '💣' : a.pick(['🍎', '⭐', '🎁', '🍬']) });
          d.sp[i] = a.rnd(.45, .8);
        }
        for (var k = d.it[i].length - 1; k >= 0; k--) {
          var o = d.it[i][k]; o.y += o.v * dt;
          if (o.y > s.h - L.is * 1.2 && Math.abs(o.x - d.b[i]) < L.hw) {
            d.it[i].splice(k, 1);
            if (o.b) { d.s[i] = Math.max(0, d.s[i] - 15); a.beep(150, .2, 'square'); }
            else { d.s[i] += 10; a.beep(880, .06); }
          } else if (o.y > s.h + L.is) d.it[i].splice(k, 1);
        }
      });
    },
    down: function (x, y, a) { vcatch(a, x, y); },
    move: function (x, y, a) { if (a.pointer.down) vcatch(a, x, y); },
    draw: function (g, a) {
      a.bg('#0d3b40', '#2fa86f');
      var d = a.data, L = d.LO;
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          g.fillStyle = i ? 'rgba(255,46,136,.10)' : 'rgba(0,212,255,.10)';
          g.fillRect(0, 0, w, h);
          d.it[i].forEach(function (o) { EM(g, o.e, o.x, o.y, L.is); });
          g.beginPath();
          g.moveTo(d.b[i] - L.hw, h - L.is * 1.2); g.lineTo(d.b[i] + L.hw, h - L.is * 1.2);
          g.lineTo(d.b[i] + L.hw * .8, h - L.is * .3); g.lineTo(d.b[i] - L.hw * .8, h - L.is * .3);
          g.closePath(); g.fillStyle = i ? P2 : P1; g.fill();
          a.text('P' + (i + 1) + '  ' + d.s[i], w / 2, h * .1, a.mn * .05, i ? P2 : P1);
        });
      });
      divider(g, a);
      if (d.over) banner(a, g, d.over === 3 ? a.txt({ th: 'เสมอ!', en: 'DRAW!' }) : win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });
  function vcatch(a, x, y) {
    var d = a.data, L = d.LO, w = which(a, x, y); if (w < 0) return;
    var lo = local(a, w, x, y);
    d.b[w] = Math.max(L.hw, Math.min(lo.w - L.hw, lo.x));
  }

  /* ---------- 98 จับคู่ผลัดกัน ---------- */
  R('vsmemory', {
    time: 0, noScore: true,
    setup: function (a) {
      var faces = ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍'];
      var cols = a.port ? 3 : 4, rows = a.port ? 4 : 3;
      var top = a.mn * .16, bot = a.mn * .16;
      var cell = Math.min((a.W - a.mn * .12) / cols, (a.H - top - bot) / rows);
      a.data.LO = { cols: cols, cell: cell, ox: (a.W - cols * cell) / 2, oy: top + (a.H - top - bot - rows * cell) / 2 };
      a.data.c = a.shuffle(faces.concat(faces)).map(function (f, i) { return { f: f, r: Math.floor(i / cols), col: i % cols, st: 0 }; });
      a.data.open = []; a.data.lock = 0; a.data.turn = 0; a.data.s = [0, 0]; a.data.left = 6; a.data.over = 0;
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.lock <= 0) return;
      d.lock -= dt; if (d.lock > 0) return;
      if (d.open[0].f === d.open[1].f) {
        d.open[0].st = 2; d.open[1].st = 2; d.s[d.turn]++; d.left--; a.beep(950, .12);
        if (!d.left) { d.over = d.s[0] === d.s[1] ? 3 : (d.s[0] > d.s[1] ? 1 : 2); a.end(d.over === 3 ? a.txt({ th: 'เสมอ!', en: 'Draw!' }) : win(a, d.over)); }
      } else { d.open[0].st = 0; d.open[1].st = 0; d.turn = 1 - d.turn; a.beep(220, .12, 'square'); }
      d.open = [];
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO; if (d.lock > 0 || d.over) return;
      d.c.forEach(function (c) {
        var bx = L.ox + c.col * L.cell, by = L.oy + c.r * L.cell, s = L.cell * .9;
        if (c.st === 0 && x > bx && x < bx + s && y > by && y < by + s) {
          c.st = 1; d.open.push(c); a.beep(560, .05);
          if (d.open.length === 2) d.lock = .7;
        }
      });
    },
    draw: function (g, a) {
      a.bg('#1b1442', '#3a2a78');
      var d = a.data, L = d.LO;
      d.c.forEach(function (c) {
        var bx = L.ox + c.col * L.cell, by = L.oy + c.r * L.cell, s = L.cell * .9;
        if (c.st === 0) { a.fillRR(bx, by, s, s, s * .12, d.turn ? P2 : P1); a.text('?', bx + s / 2, by + s / 2, s * .4, 'rgba(255,255,255,.85)'); }
        else { a.fillRR(bx, by, s, s, s * .12, c.st === 2 ? '#2fe08a' : '#fff'); EM(g, c.f, bx + s / 2, by + s / 2, s * .5); }
      });
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          var on = d.turn === i;
          a.text('P' + (i + 1) + '  ' + d.s[i] + (on ? '  ●' : ''), w / 2, h * .08, a.mn * .05, on ? (i ? P2 : P1) : 'rgba(255,255,255,.4)');
        });
      });
      if (d.over) banner(a, g, d.over === 3 ? a.txt({ th: 'เสมอ!', en: 'DRAW!' }) : win(a, d.over), d.over === 2 ? P2 : P1);
      else a.head(a.txt({ th: 'ตาของผู้เล่น ' + (d.turn + 1), en: 'Player ' + (d.turn + 1) + '\'s turn' }));
    }
  });

  /* ---------- 99 ยิงเป้าแข่งกัน ---------- */
  R('vsshoot', {
    noScore: true,
    setup: function (a) {
      a.data.LO = { r: a.mn * .10 };
      a.data.t = [{ p: .3, d: 1 }, { p: .7, d: -1 }]; a.data.s = [0, 0]; a.data.fx = [0, 0]; a.data.over = 0;
    },
    update: function (dt, a) {
      var d = a.data;
      if (!d.over && a.timeLeft <= .05) d.over = d.s[0] === d.s[1] ? 3 : (d.s[0] > d.s[1] ? 1 : 2);
      d.t.forEach(function (t, i) {
        t.p += t.d * dt * .55;
        if (t.p > .85) { t.p = .85; t.d = -1; } if (t.p < .15) { t.p = .15; t.d = 1; }
        if (d.fx[i] > 0) d.fx[i] -= dt;
      });
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO, w = which(a, x, y); if (w < 0 || d.over) return;
      var lo = local(a, w, x, y);
      var tx = lo.w * d.t[w].p, ty = lo.h * .45;
      var dist = Math.hypot(lo.x - tx, lo.y - ty);
      var p = dist < L.r * .25 ? 50 : (dist < L.r * .55 ? 25 : (dist < L.r ? 10 : 0));
      if (p) { d.s[w] += p; d.fx[w] = .3; a.beep(p === 50 ? 1150 : 800, .1); }
      else { a.beep(200, .12, 'square'); }
    },
    draw: function (g, a) {
      a.bg('#123b57', '#0d6b6b');
      var d = a.data, L = d.LO;
      var cols = ['#f2f2f2', '#1b1442', '#00d4ff', '#ff2e88'], rad = [1, .72, .48, .22];
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          g.fillStyle = i ? 'rgba(255,46,136,.10)' : 'rgba(0,212,255,.10)';
          g.fillRect(0, 0, w, h);
          var tx = w * d.t[i].p, ty = h * .45;
          for (var k = 0; k < 4; k++) a.circle(tx, ty, L.r * rad[k], cols[k]);
          if (d.fx[i] > 0) { g.strokeStyle = a.C.accent; g.lineWidth = 4; g.beginPath(); g.arc(tx, ty, L.r * (1.2 + (0.3 - d.fx[i]) * 2), 0, 6.29); g.stroke(); }
          a.text('P' + (i + 1) + '  ' + d.s[i], w / 2, h * .12, a.mn * .05, i ? P2 : P1);
          a.text(a.txt({ th: 'แตะที่เป้า', en: 'Tap the target' }), w / 2, h * .82, a.mn * .035, 'rgba(255,255,255,.5)');
        });
      });
      divider(g, a);
      if (d.over) banner(a, g, d.over === 3 ? a.txt({ th: 'เสมอ!', en: 'DRAW!' }) : win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });

  /* ---------- 100 วิ่งแข่ง ---------- */
  R('vsrun', {
    time: 0, noScore: true,
    setup: function (a) { a.data.p = [0, 0]; a.data.nx = [0, 0]; a.data.over = 0; a.data.goal = 100; },
    update: function (dt, a) {
      var d = a.data;
      [0, 1].forEach(function (i) { d.p[i] = Math.max(0, d.p[i] - dt * 3); });
      if (!d.over) [0, 1].forEach(function (i) {
        if (d.p[i] >= d.goal) { d.over = i + 1; a.beep(1250, .35, 'triangle'); a.end(win(a, i + 1)); }
      });
    },
    down: function (x, y, a) {
      var d = a.data, w = which(a, x, y); if (w < 0 || d.over) return;
      var lo = local(a, w, x, y);
      var half = lo.x < lo.w / 2 ? 0 : 1;
      if (half === d.nx[w]) { d.p[w] += 2.2; d.nx[w] = 1 - half; a.beep(500 + d.p[w] * 2, .04, 'triangle'); }
      else { d.p[w] = Math.max(0, d.p[w] - .8); a.beep(200, .05, 'square'); }
    },
    draw: function (g, a) {
      a.bg('#3a1060', '#c8761e');
      var d = a.data;
      [0, 1].forEach(function (i) {
        inSide(g, a, i, function (w, h) {
          g.fillStyle = i ? 'rgba(255,46,136,.12)' : 'rgba(0,212,255,.12)';
          g.fillRect(0, 0, w, h);
          g.fillStyle = 'rgba(255,255,255,.10)';
          g.fillRect(0, h * .4, w, h * .22);
          g.fillStyle = '#fff';
          for (var k = 0; k < 10; k++) g.fillRect(w * .93 + (k % 2 ? 6 : 0), h * .4 + k * h * .022, 6, h * .022);
          var px = w * .08 + (w * .82) * Math.min(1, d.p[i] / d.goal);
          EM(g, i ? '🏃' : '🏃', px, h * .51, Math.min(w, h) * .16);
          a.text('P' + (i + 1) + '  ' + Math.floor(d.p[i]) + '/' + d.goal, w / 2, h * .14, a.mn * .05, i ? P2 : P1);
          var nz = d.nx[i];
          a.fillRR(nz ? w / 2 : 0, h * .72, w / 2, h * .2, a.mn * .02, 'rgba(255,255,255,.22)');
          a.text(a.txt({ th: 'แตะฝั่งนี้', en: 'TAP HERE' }), (nz ? .75 : .25) * w, h * .82, a.mn * .04, '#fff');
        });
      });
      divider(g, a);
      if (d.over) banner(a, g, win(a, d.over), d.over === 2 ? P2 : P1);
    }
  });
})();
