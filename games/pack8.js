/* ============================================================
   PACK 8 — เกม 71-80  (สังเกต / ความจำ / ตัดสินใจ)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }
  /* รูปทรงเรขาคณิต 6 แบบ วาดด้วยโค้ด (ใช้ทำเงาได้) */
  var KINDS = ['circle', 'square', 'triangle', 'star', 'hex', 'drop'];
  function shape(g, kind, x, y, r, col) {
    g.fillStyle = col; g.beginPath();
    if (kind === 'circle') g.arc(x, y, r, 0, 6.2832);
    else if (kind === 'square') { g.rect(x - r * .85, y - r * .85, r * 1.7, r * 1.7); }
    else if (kind === 'triangle') { g.moveTo(x, y - r); g.lineTo(x + r * .92, y + r * .7); g.lineTo(x - r * .92, y + r * .7); g.closePath(); }
    else if (kind === 'star') {
      for (var i = 0; i < 10; i++) {
        var ang = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r;
        g[i ? 'lineTo' : 'moveTo'](x + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
      }
      g.closePath();
    } else if (kind === 'hex') {
      for (var k = 0; k < 6; k++) {
        var an = k * Math.PI / 3;
        g[k ? 'lineTo' : 'moveTo'](x + Math.cos(an) * r, y + Math.sin(an) * r);
      }
      g.closePath();
    } else { g.moveTo(x, y - r); g.quadraticCurveTo(x + r, y - r * .1, x, y + r); g.quadraticCurveTo(x - r, y - r * .1, x, y - r); }
    g.fill();
  }

  /* ---------- 71 เกมสามถ้วย ---------- */
  R('shellgame', {
    time: 0,
    setup: function (a) {
      a.data.LO = { cw: Math.min(a.W * .24, a.mn * .22), cy: a.H * .52 };
      a.data.pos = [0, 1, 2]; a.data.ball = 0; a.data.st = 'show'; a.data.t = 1.0;
      a.data.round = 1; a.data.swaps = 5; a.data.msg = ''; a.data.pair = null; a.data.anim = 0;
    },
    update: function (dt, a) {
      var d = a.data;
      d.t -= dt;
      if (d.st === 'show' && d.t <= 0) { d.st = 'mix'; d.left = d.swaps; d.t = 0; }
      else if (d.st === 'mix') {
        if (d.anim > 0) { d.anim -= dt; if (d.anim <= 0) { var p = d.pair; var t = d.pos[p[0]]; d.pos[p[0]] = d.pos[p[1]]; d.pos[p[1]] = t; d.pair = null; } }
        else if (d.left > 0) {
          var i = a.rndi(0, 2), j = (i + 1 + a.rndi(0, 1)) % 3;
          d.pair = [i, j]; d.animDur = Math.max(.12, .38 - d.round * .02); d.anim = d.animDur; d.left--;
          a.beep(420, .04);
        } else d.st = 'pick';
      } else if (d.st === 'reveal' && d.t <= 0) {
        d.st = 'show'; d.t = .8; d.round++; d.swaps = Math.min(14, d.swaps + 1);
        d.pos = [0, 1, 2]; d.ball = a.rndi(0, 2); d.msg = '';
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO; if (d.st !== 'pick') return;
      for (var s = 0; s < 3; s++) {
        var cx = a.W * (.25 + s * .25);
        if (Math.abs(x - cx) < L.cw * .6) {
          var under = d.pos.indexOf(s);
          if (under === d.ball) { a.add(30); d.msg = a.txt({ th: 'ถูกต้อง! +30', en: 'Correct! +30' }); a.beep(1000, .2, 'triangle'); }
          else { a.add(-10); d.msg = a.txt({ th: 'ผิด −10', en: 'Wrong −10' }); a.beep(180, .25, 'square'); }
          d.st = 'reveal'; d.t = 1.3; return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#3d1060', '#c81d6b');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(0, L.cy + L.cw * .5, a.W, a.H - L.cy - L.cw * .5);
      var show = d.st === 'show' || d.st === 'reveal';
      for (var s = 0; s < 3; s++) {
        var slot = d.pos.indexOf(s);
        var cx = a.W * (.25 + slot * .25);
        if (d.pair && d.anim > 0) {
          var k = d.pair.indexOf(slot);
          if (k >= 0) {
            var other = d.pair[1 - k], p = 1 - d.anim / Math.max(.001, d.animDur || .38);
            cx = a.W * (.25 + (slot + (other - slot) * p) * .25);
          }
        }
        var lift = show && s === d.ball ? L.cw * .5 : 0;
        if (show && s === d.ball) EM(g, '🔴', cx, L.cy + L.cw * .25, L.cw * .32);
        g.fillStyle = a.C.accent;
        g.beginPath();
        g.moveTo(cx - L.cw * .5, L.cy + L.cw * .5 - lift);
        g.lineTo(cx - L.cw * .3, L.cy - L.cw * .5 - lift);
        g.lineTo(cx + L.cw * .3, L.cy - L.cw * .5 - lift);
        g.lineTo(cx + L.cw * .5, L.cy + L.cw * .5 - lift);
        g.closePath(); g.fill();
      }
      if (d.msg) a.text(d.msg, a.W / 2, a.H * .82, a.mn * .06, '#fff');
      a.head(d.st === 'pick' ? a.txt({ th: 'ลูกบอลอยู่ถ้วยไหน?', en: 'Which cup hides the ball?' })
        : a.txt({ th: 'รอบ ' + d.round + ' — ดูให้ดี…', en: 'Round ' + d.round + ' — watch closely…' }));
    }
  });

  /* ---------- 72 นับให้ไว ---------- */
  R('countfast', {
    setup: function (a) { a.data.lv = 1; a.data.st = 'look'; a.data.t = 2.4; mkCount(a); },
    update: function (dt, a) {
      var d = a.data; d.t -= dt;
      if (d.st === 'look' && d.t <= 0) { d.st = 'ask'; }
      else if (d.st === 'fb' && d.t <= 0) { d.lv++; d.st = 'look'; d.t = Math.max(1.1, 2.4 - d.lv * .1); mkCount(a); }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st !== 'ask') return;
      for (var i = 0; i < 4; i++) {
        var b = cbox(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.pick = i;
          if (d.opt[i] === d.count) { a.add(20); a.beep(950, .12); } else { a.add(-5); a.beep(180, .2, 'square'); }
          d.st = 'fb'; d.t = .8; return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#0d3b57', '#2fa86f');
      var d = a.data;
      if (d.st === 'look') {
        d.items.forEach(function (o) { EM(g, o.e, o.x, o.y, d.size); });
        a.head(a.txt({ th: 'นับให้ทัน: ' + d.target, en: 'Count these: ' + d.target }));
        a.text(Math.ceil(Math.max(0, d.t)) + '', a.W / 2, a.H - a.mn * .08, a.mn * .07, a.C.accent);
      } else {
        a.text(a.txt({ th: 'มี ' + d.target + ' กี่ชิ้น?', en: 'How many ' + d.target + '?' }), a.W / 2, a.mn * .18, a.mn * .06, '#fff');
        EM(g, d.target, a.W / 2, a.mn * .30, a.mn * .12);
        for (var i = 0; i < 4; i++) {
          var b = cbox(a, i), col = 'rgba(255,255,255,.92)', tc = a.C.dark;
          if (d.st === 'fb') { if (d.opt[i] === d.count) { col = a.C.good; tc = '#fff'; } else if (d.pick === i) { col = a.C.bad; tc = '#fff'; } }
          a.fillRR(b.x, b.y, b.w, b.h, a.mn * .022, col);
          a.text(d.opt[i] + '', b.x + b.w / 2, b.y + b.h / 2, a.mn * .06, tc);
        }
        a.head(a.txt({ th: 'รอบ ' + d.lv, en: 'Round ' + d.lv }));
      }
    }
  });
  function cbox(a, i) {
    var w = Math.min(a.W * .36, a.mn * .34), h = a.mn * .13, gap = a.mn * .04;
    return { x: (a.W - (w * 2 + gap)) / 2 + (i % 2) * (w + gap), y: a.H * .52 + Math.floor(i / 2) * (h + gap), w: w, h: h };
  }
  function mkCount(a) {
    var d = a.data;
    var pool = ['🍎', '⭐', '🐟', '🎈', '🌸', '🚗'];
    a.shuffle(pool);
    d.target = pool[0];
    d.size = a.mn * .07;
    d.count = a.rndi(4, Math.min(16, 6 + d.lv));
    var total = d.count + a.rndi(6, 10 + d.lv * 2);
    d.items = [];
    for (var i = 0; i < total; i++) {
      d.items.push({
        e: i < d.count ? d.target : pool[1 + (i % 5)],
        x: a.rnd(d.size, a.W - d.size), y: a.rnd(a.mn * .18, a.H - a.mn * .12)
      });
    }
    a.shuffle(d.items);
    var set = [d.count];
    while (set.length < 4) { var v = d.count + a.rndi(-4, 4); if (v > 0 && set.indexOf(v) < 0) set.push(v); }
    d.opt = a.shuffle(set); d.pick = -1;
  }

  /* ---------- 73 หาคู่ที่ซ้ำ ---------- */
  R('spotpair', {
    setup: function (a) { a.data.lv = 1; mkPair(a); a.data.fx = 0; },
    update: function (dt, a) { if (a.data.fx > 0) a.data.fx -= dt; },
    down: function (x, y, a) {
      var d = a.data;
      for (var i = d.o.length - 1; i >= 0; i--) {
        var o = d.o[i];
        if (Math.hypot(x - o.x, y - o.y) < d.size * .6) {
          if (!o.dup) { a.add(-10); a.beep(180, .18, 'square'); d.fx = .25; d.first = -1; d.o.forEach(function (q) { q.sel = 0; }); return; }
          o.sel = 1;
          if (d.first < 0) { d.first = i; a.beep(700, .07); }
          else if (d.first !== i) {
            a.add(30); a.beep(1050, .16, 'triangle'); d.lv++; mkPair(a);
          }
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#1a1040', '#0d5c63');
      var d = a.data;
      d.o.forEach(function (o) {
        g.save(); g.translate(o.x, o.y); g.rotate(o.r);
        if (o.sel) { a.circle(0, 0, d.size * .62, 'rgba(255,255,255,.3)'); }
        EM(g, o.e, 0, 0, d.size); g.restore();
      });
      a.head(a.txt({ th: 'รอบ ' + d.lv + ' — หาไอคอนที่ซ้ำกัน 1 คู่', en: 'Round ' + d.lv + ' — find the only matching pair' }));
      if (d.fx > 0) { g.fillStyle = 'rgba(255,82,82,' + d.fx * 1.2 + ')'; g.fillRect(0, 0, a.W, a.H); }
    }
  });
  function mkPair(a) {
    var d = a.data;
    var ICON = ['🍕', '🎧', '🚗', '⚽', '🌵', '🐶', '📷', '🍩', '🎩', '🔑', '🌈', '🎸', '🧁', '🚀', '⌚', '🎲', '🍔', '🐳', '🎺', '🧩'];
    d.size = a.mn * .07;
    var n = Math.min(18, 8 + d.lv * 2);
    var pool = a.shuffle(ICON.slice()).slice(0, n);
    var dup = pool[0];
    var list = pool.slice(0, n).concat([dup]);
    a.shuffle(list);
    d.o = []; d.first = -1;
    var top = a.mn * .17, m = d.size * .6;
    list.forEach(function (e) {
      var x, y, ok, tries = 0;
      do {
        x = a.rnd(m, a.W - m); y = a.rnd(top + m, a.H - m);
        ok = d.o.every(function (q) { return Math.hypot(q.x - x, q.y - y) > d.size * 1.15; });
      } while (!ok && ++tries < 80);
      d.o.push({ e: e, x: x, y: y, r: a.rnd(-.4, .4), dup: e === dup ? 1 : 0, sel: 0 });
    });
  }

  /* ---------- 74 จับคู่เงา ---------- */
  R('shadowmatch', {
    setup: function (a) { a.data.fb = 0; a.data.pick = -1; mkShadow(a); },
    update: function (dt, a) { if (a.data.fb > 0) { a.data.fb -= dt; if (a.data.fb <= 0) { a.data.pick = -1; mkShadow(a); } } },
    down: function (x, y, a) {
      var d = a.data; if (d.fb > 0) return;
      for (var i = 0; i < 4; i++) {
        var b = sbox(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.pick = i;
          if (i === d.ans) { a.add(20); a.beep(950, .12); } else { a.add(-10); a.beep(180, .2, 'square'); }
          d.fb = .6; return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#180f3d', '#4b2a9e');
      var d = a.data;
      var tr = Math.min(a.W * .14, a.mn * .13);
      a.fillRR(a.W / 2 - tr * 1.5, a.mn * .16, tr * 3, tr * 2.4, a.mn * .03, 'rgba(255,255,255,.14)');
      shape(g, d.kinds[d.ans], a.W / 2, a.mn * .16 + tr * 1.2, tr, d.col);
      for (var i = 0; i < 4; i++) {
        var b = sbox(a, i), col = 'rgba(255,255,255,.14)';
        if (d.fb > 0) { if (i === d.ans) col = a.C.good; else if (d.pick === i) col = a.C.bad; }
        a.fillRR(b.x, b.y, b.w, b.h, a.mn * .026, col);
        shape(g, d.kinds[i], b.x + b.w / 2, b.y + b.h / 2, Math.min(b.w, b.h) * .32, '#0d0a1e');
      }
      a.head(a.txt({ th: 'เลือกเงาที่ตรงกับรูปด้านบน', en: 'Pick the silhouette that matches' }));
    }
  });
  function sbox(a, i) {
    var w = Math.min(a.W * .40, a.mn * .34), gap = a.mn * .035;
    var top = a.mn * .16 + Math.min(a.W * .14, a.mn * .13) * 2.4 + a.mn * .05;   // ใต้กรอบตัวอย่าง
    var h = Math.min(a.mn * .24, (a.H - top - a.mn * .06 - gap) / 2);
    var oy = top + (a.H - top - (h * 2 + gap) - a.mn * .04) / 2;
    return { x: (a.W - (w * 2 + gap)) / 2 + (i % 2) * (w + gap), y: oy + Math.floor(i / 2) * (h + gap), w: w, h: h };
  }
  function mkShadow(a) {
    var d = a.data;
    d.kinds = a.shuffle(KINDS.slice()).slice(0, 4);
    d.ans = a.rndi(0, 3);
    d.col = a.pick([a.C.primary, a.C.secondary, a.C.accent, a.C.good, '#ff6a3d']);
  }

  /* ---------- 75 เรียงขนาด ---------- */
  R('sizeorder', {
    setup: function (a) { a.data.lv = 1; mkSize(a); a.data.fx = 0; },
    update: function (dt, a) { if (a.data.fx > 0) a.data.fx -= dt; },
    down: function (x, y, a) {
      var d = a.data;
      for (var i = 0; i < d.o.length; i++) {
        var o = d.o[i];
        if (o.done) continue;
        if (Math.hypot(x - o.x, y - o.y) < o.r) {
          if (o.rank === d.next) {
            o.done = 1; d.next++; a.beep(560 + d.next * 60, .07);
            if (d.next >= d.o.length) { a.add(30); a.addTime(6); d.lv++; mkSize(a); }
          } else {
            a.add(-5); a.beep(180, .18, 'square'); d.fx = .3;
            d.o.forEach(function (q) { q.done = 0; }); d.next = 0;
          }
          return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#4a3a0a', '#2fa86f');
      var d = a.data;
      d.o.forEach(function (o) {
        shape(g, d.kind, o.x, o.y, o.r, o.done ? 'rgba(255,255,255,.25)' : o.col);
        if (o.done) a.text((o.rank + 1) + '', o.x, o.y, o.r * .7, '#fff');
      });
      a.head(a.txt({ th: 'รอบ ' + d.lv + ' — แตะจากเล็กไปใหญ่', en: 'Round ' + d.lv + ' — tap smallest to largest' }));
      if (d.fx > 0) { g.fillStyle = 'rgba(255,82,82,' + d.fx + ')'; g.fillRect(0, 0, a.W, a.H); }
    }
  });
  function mkSize(a) {
    var d = a.data;
    d.kind = a.pick(KINDS);
    var n = Math.min(7, 4 + Math.floor(d.lv / 2));
    var base = Math.min(a.W / (n + 1), (a.H - a.mn * .24) / 2) * .42;
    d.o = []; d.next = 0;
    var slots = [];
    for (var i = 0; i < n; i++) slots.push(i);
    a.shuffle(slots);
    for (var k = 0; k < n; k++) {
      var r = base * (.55 + k * .45 / n * 1.6);
      d.o.push({
        rank: k, r: r, col: 'hsl(' + (k * 40 + 190) + ',80%,60%)',
        x: a.W * (slots[k] + .5) / n,
        y: a.mn * .2 + (a.H - a.mn * .3) * (slots[k] % 2 ? .32 : .66),
        done: 0
      });
    }
  }

  /* ---------- 76 ชั่งให้สมดุล ---------- */
  R('balancescale', {
    setup: function (a) { a.data.lv = 1; mkScale(a); a.data.fx = 0; a.data.msg = ''; },
    update: function (dt, a) {
      var d = a.data;
      var diff = d.right - d.target;
      var want = Math.max(-.28, Math.min(.28, diff * .05));
      d.tilt += (want - d.tilt) * Math.min(1, dt * 5);
      if (d.fx > 0) { d.fx -= dt; if (d.fx <= 0) { d.msg = ''; if (d.win) { d.lv++; mkScale(a); } } }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.fx > 0) return;
      for (var i = 0; i < d.w.length; i++) {
        var b = wbtn(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.right += d.w[i]; d.used.push(d.w[i]); a.beep(600, .06);
          return;
        }
      }
      var cb = confirmBtn(a);
      if (x > cb.x && x < cb.x + cb.w && y > cb.y && y < cb.y + cb.h) {
        if (d.right === d.target) { a.add(25); d.msg = a.txt({ th: 'สมดุลพอดี! +25', en: 'Balanced! +25' }); d.win = 1; a.beep(1150, .25, 'triangle'); }
        else { a.add(-10); d.msg = a.txt({ th: 'ยังไม่เท่ากัน', en: 'Not equal yet' }); d.win = 0; a.beep(180, .22, 'square'); d.right = 0; d.used = []; }
        d.fx = 1.0;
      }
    },
    draw: function (g, a) {
      a.bg('#0b2e4a', '#1b6f8c');
      var d = a.data;
      var cx = a.W / 2, cy = a.H * .40, arm = Math.min(a.W * .32, a.mn * .30);
      a.fillRR(cx - a.mn * .02, cy, a.mn * .04, a.H * .18, a.mn * .01, '#8d8d9e');
      a.fillRR(cx - a.mn * .12, cy + a.H * .18, a.mn * .24, a.mn * .03, a.mn * .012, '#8d8d9e');
      g.save(); g.translate(cx, cy); g.rotate(d.tilt);
      a.fillRR(-arm, -a.mn * .012, arm * 2, a.mn * .024, a.mn * .012, a.C.accent);
      [-1, 1].forEach(function (s) {
        var px = s * arm;
        g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(px, 0); g.lineTo(px, a.mn * .08); g.stroke();
        a.fillRR(px - a.mn * .09, a.mn * .08, a.mn * .18, a.mn * .022, a.mn * .01, '#d8d8e8');
        var v = s < 0 ? d.target : d.right;
        a.text(v + '', px, a.mn * .04, a.mn * .05, '#fff');
      });
      g.restore();
      for (var i = 0; i < d.w.length; i++) {
        var b = wbtn(a, i);
        a.fillRR(b.x, b.y, b.w, b.h, a.mn * .02, a.C.secondary);
        a.text(d.w[i] + '', b.x + b.w / 2, b.y + b.h / 2, a.mn * .05, '#04263a');
      }
      var cb = confirmBtn(a);
      a.fillRR(cb.x, cb.y, cb.w, cb.h, cb.h * .3, a.C.good);
      a.text(a.txt({ th: 'ยืนยัน', en: 'CONFIRM' }), cb.x + cb.w / 2, cb.y + cb.h / 2, a.mn * .04, '#04331e');
      if (d.msg) a.text(d.msg, a.W / 2, a.H * .24, a.mn * .055, a.C.accent);
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — เติมน้ำหนักให้เท่ากับซ้าย (' + d.target + ')', en: 'Level ' + d.lv + ' — match the left pan (' + d.target + ')' }));
    }
  });
  function wbtn(a, i) {
    var n = a.data.w.length, w = Math.min(a.W * .8 / n * .8, a.mn * .12), gap = a.mn * .02;
    var tot = n * w + (n - 1) * gap;
    return { x: (a.W - tot) / 2 + i * (w + gap), y: a.H - a.mn * .20, w: w, h: a.mn * .08 };
  }
  function confirmBtn(a) { var w = Math.min(a.W * .5, a.mn * .38); return { x: (a.W - w) / 2, y: a.H - a.mn * .10, w: w, h: a.mn * .07 }; }
  function mkScale(a) {
    var d = a.data;
    d.w = [1, 2, 5, 10];
    if (d.lv > 2) d.w = [1, 2, 3, 5, 10];
    d.target = a.rndi(6, 12 + d.lv * 3);
    d.right = 0; d.used = []; d.tilt = -.28; d.win = 0;
  }

  /* ---------- 77 ผสมสี ---------- */
  R('colorblend', {
    setup: function (a) {
      a.data.LO = { bw: Math.min(a.W * .74, a.mn * .7), bh: a.mn * .05 };
      a.data.LO.bx = (a.W - a.data.LO.bw) / 2;
      a.data.rgb = [128, 128, 128]; a.data.drag = -1; a.data.fx = 0; a.data.msg = ''; a.data.lv = 1;
      mkTarget(a);
    },
    update: function (dt, a) { if (a.data.fx > 0) { a.data.fx -= dt; if (a.data.fx <= 0) { a.data.msg = ''; a.data.lv++; mkTarget(a); } } },
    down: function (x, y, a) {
      var d = a.data, L = d.LO; if (d.fx > 0) return;
      for (var i = 0; i < 3; i++) {
        var sy = a.H * .48 + i * a.mn * .11;
        if (y > sy - L.bh && y < sy + L.bh * 2) { d.drag = i; setSlider(a, x); return; }
      }
      var cb = confirmBtn(a);
      if (x > cb.x && x < cb.x + cb.w && y > cb.y && y < cb.y + cb.h) {
        var err = Math.abs(d.rgb[0] - d.tg[0]) + Math.abs(d.rgb[1] - d.tg[1]) + Math.abs(d.rgb[2] - d.tg[2]);
        var pts = Math.max(0, Math.round(60 - err / 6));
        a.add(pts);
        d.msg = a.txt({ th: 'ใกล้เคียง ' + Math.max(0, Math.round(100 - err / 7.65)) + '% • +' + pts, en: Math.max(0, Math.round(100 - err / 7.65)) + '% match • +' + pts });
        a.beep(pts > 40 ? 1100 : 500, .2, 'triangle'); d.fx = 1.4;
      }
    },
    move: function (x, y, a) { if (a.data.drag >= 0 && a.pointer.down) setSlider(a, x); },
    up: function (x, y, a) { a.data.drag = -1; },
    draw: function (g, a) {
      a.bg('#2a1150', '#5b1064');
      var d = a.data, L = d.LO;
      var half = Math.min(a.W * .34, a.mn * .3);
      a.fillRR(a.W / 2 - half, a.mn * .16, half, a.mn * .22, a.mn * .026, 'rgb(' + d.tg.join(',') + ')');
      a.fillRR(a.W / 2, a.mn * .16, half, a.mn * .22, a.mn * .026, 'rgb(' + d.rgb.map(Math.round).join(',') + ')');
      a.text(a.txt({ th: 'เป้าหมาย', en: 'TARGET' }), a.W / 2 - half / 2, a.mn * .42, a.mn * .032, '#fff');
      a.text(a.txt({ th: 'ของคุณ', en: 'YOURS' }), a.W / 2 + half / 2, a.mn * .42, a.mn * .032, '#fff');
      var names = ['R', 'G', 'B'], cols = ['#ff4d4d', '#4dff88', '#4d9bff'];
      for (var i = 0; i < 3; i++) {
        var sy = a.H * .48 + i * a.mn * .11;
        a.fillRR(L.bx, sy, L.bw, L.bh, L.bh / 2, 'rgba(0,0,0,.35)');
        a.fillRR(L.bx, sy, L.bw * (d.rgb[i] / 255), L.bh, L.bh / 2, cols[i]);
        a.circle(L.bx + L.bw * (d.rgb[i] / 255), sy + L.bh / 2, L.bh * .8, '#fff');
        a.text(names[i], L.bx - a.mn * .04, sy + L.bh / 2, a.mn * .04, '#fff', 'right');
      }
      var cb = confirmBtn(a);
      a.fillRR(cb.x, cb.y, cb.w, cb.h, cb.h * .3, a.C.good);
      a.text(a.txt({ th: 'ยืนยัน', en: 'CONFIRM' }), cb.x + cb.w / 2, cb.y + cb.h / 2, a.mn * .04, '#04331e');
      if (d.msg) a.text(d.msg, a.W / 2, a.H * .43, a.mn * .05, a.C.accent);
      a.head(a.txt({ th: 'รอบ ' + d.lv + ' — ปรับ R G B ให้ตรงสีเป้าหมาย', en: 'Round ' + d.lv + ' — match the target color' }));
    }
  });
  function setSlider(a, x) {
    var d = a.data, L = d.LO;
    d.rgb[d.drag] = Math.max(0, Math.min(255, Math.round((x - L.bx) / L.bw * 255)));
  }
  function mkTarget(a) {
    var d = a.data;
    d.tg = [a.rndi(30, 230), a.rndi(30, 230), a.rndi(30, 230)];
    d.rgb = [128, 128, 128];
  }

  /* ---------- 78 ลากตามเส้น ---------- */
  R('pathtrace', {
    setup: function (a) { a.data.lv = 1; mkPath(a); },
    down: function (x, y, a) {
      var d = a.data;
      if (Math.hypot(x - d.p[0].x, y - d.p[0].y) < d.w) { d.i = 0; d.on = 1; }
    },
    move: function (x, y, a) {
      var d = a.data; if (!d.on || !a.pointer.down) return;
      /* หาจุดถัดไปที่ใกล้ที่สุดข้างหน้า */
      var best = -1, bd = 1e9;
      for (var k = d.i; k < Math.min(d.p.length, d.i + 6); k++) {
        var dd = Math.hypot(x - d.p[k].x, y - d.p[k].y);
        if (dd < bd) { bd = dd; best = k; }
      }
      if (bd > d.w) { d.on = 0; d.i = 0; a.beep(180, .2, 'square'); a.add(-10); return; }
      d.i = best;
      if (d.i >= d.p.length - 1) {
        a.add(60); a.addTime(8); a.beep(1150, .25, 'triangle'); d.on = 0; d.lv++; mkPath(a);
      }
    },
    up: function (x, y, a) { a.data.on = 0; a.data.i = 0; },
    draw: function (g, a) {
      a.bg('#06282e', '#0d5c63');
      var d = a.data;
      g.strokeStyle = 'rgba(255,255,255,.20)'; g.lineWidth = d.w * 2; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); d.p.forEach(function (q, i) { g[i ? 'lineTo' : 'moveTo'](q.x, q.y); }); g.stroke();
      g.strokeStyle = a.C.secondary; g.lineWidth = d.w * 2 * .5;
      g.beginPath(); for (var i = 0; i <= d.i; i++) g[i ? 'lineTo' : 'moveTo'](d.p[i].x, d.p[i].y); g.stroke();
      a.circle(d.p[0].x, d.p[0].y, d.w * .7, a.C.good);
      a.circle(d.p[d.p.length - 1].x, d.p[d.p.length - 1].y, d.w * .7, a.C.bad);
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — ลากจากจุดเขียวไปจุดแดง ห้ามหลุด', en: 'Level ' + d.lv + ' — drag from green to red without straying' }));
    }
  });
  function mkPath(a) {
    var d = a.data;
    d.w = Math.max(a.mn * .035, a.mn * .07 - d.lv * a.mn * .003);
    d.p = []; d.i = 0; d.on = 0;
    var top = a.mn * .2, bot = a.H - a.mn * .1;
    var n = 90, amp = Math.min(a.W * .3, a.mn * .28), f1 = a.rnd(1.2, 2.6), f2 = a.rnd(2, 4.5), ph = a.rnd(0, 6.28);
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      d.p.push({
        x: a.W / 2 + Math.sin(t * f1 * Math.PI + ph) * amp * .7 + Math.sin(t * f2 * Math.PI) * amp * .3,
        y: top + (bot - top) * t
      });
    }
  }

  /* ---------- 79 จำตำแหน่งไฟ ---------- */
  R('memoryflash', {
    time: 0,
    setup: function (a) { a.data.lv = 1; a.data.n = 4; mkFlash(a); },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'show') { d.t -= dt; if (d.t <= 0) d.st = 'input'; }
      else if (d.st === 'fb') { d.t -= dt; if (d.t <= 0) { d.lv++; mkFlash(a); } }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO; if (d.st !== 'input') return;
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c >= d.n || r >= d.n) return;
      var i = r * d.n + c; if (d.picked[i]) return;
      d.picked[i] = 1;
      if (d.lit[i]) {
        a.add(10); a.beep(800, .07); d.got++;
        if (d.got >= d.k) { a.add(30); d.st = 'fb'; d.t = .7; a.beep(1150, .2, 'triangle'); }
      } else {
        a.beep(180, .25, 'square');
        a.end(a.txt({ th: 'จำได้ ' + (d.lv - 1) + ' รอบ', en: 'Reached round ' + (d.lv - 1) }));
      }
    },
    draw: function (g, a) {
      a.bg('#0f0a26', '#3a1060');
      var d = a.data, L = d.LO;
      for (var i = 0; i < d.n * d.n; i++) {
        var c = i % d.n, r = Math.floor(i / d.n);
        var on = (d.st === 'show' && d.lit[i]) || (d.picked[i] && d.lit[i]) || (d.st === 'fb' && d.lit[i]);
        a.fillRR(L.ox + c * L.s + 3, L.oy + r * L.s + 3, L.s - 6, L.s - 6, L.s * .16,
          on ? a.C.accent : (d.picked[i] ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.16)'));
      }
      a.head(d.st === 'show' ? a.txt({ th: 'จำให้ได้!', en: 'Memorise!' })
        : a.txt({ th: 'รอบ ' + d.lv + ' — แตะช่องที่สว่าง (' + d.got + '/' + d.k + ')', en: 'Round ' + d.lv + ' — tap the lit tiles (' + d.got + '/' + d.k + ')' }));
    }
  });
  function mkFlash(a) {
    var d = a.data;
    d.n = Math.min(6, 3 + Math.floor(d.lv / 3));
    var top = a.mn * .16;
    var s = Math.min((a.W - a.mn * .1) / d.n, (a.H - top - a.mn * .08) / d.n);
    d.LO = { s: s, ox: (a.W - d.n * s) / 2, oy: top + (a.H - top - a.mn * .08 - d.n * s) / 2 };
    d.k = Math.min(d.n * d.n - 2, 2 + d.lv);
    d.lit = []; d.picked = []; d.got = 0;
    for (var i = 0; i < d.n * d.n; i++) { d.lit.push(0); d.picked.push(0); }
    var placed = 0;
    while (placed < d.k) { var q = a.rndi(0, d.n * d.n - 1); if (!d.lit[q]) { d.lit[q] = 1; placed++; } }
    d.st = 'show'; d.t = 1.1 + d.k * .12;
  }

  /* ---------- 80 หยุดนาฬิกา ---------- */
  R('clockstop', {
    time: 0,
    setup: function (a) {
      a.data.LO = { R: Math.min(a.W * .34, a.H * .28) };
      a.data.ang = 0; a.data.sp = 3.4; a.data.target = a.rndi(0, 11);
      a.data.st = 'run'; a.data.t = 0; a.data.msg = ''; a.data.round = 1; a.data.miss = 0;
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'run') d.ang = (d.ang + d.sp * dt) % 6.2832;
      else { d.t -= dt; if (d.t <= 0) { if (d.miss >= 3) return a.end(a.txt({ th: 'พลาด 3 ครั้ง', en: '3 misses' })); d.st = 'run'; d.target = a.rndi(0, 11); d.msg = ''; d.round++; d.sp += .25; } }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st !== 'run') return;
      var tAng = d.target * (6.2832 / 12);
      /* ระยะเชิงมุมระหว่างเข็มกับเลขเป้าหมาย (0 = ตรงเป๊ะ) */
      var diff = Math.abs(((d.ang - tAng + Math.PI * 3) % 6.2832) - Math.PI);
      var deg = diff * 180 / Math.PI;
      if (deg < 8) { a.add(100); d.msg = a.txt({ th: 'ตรงเป๊ะ! +100', en: 'DEAD ON! +100' }); a.beep(1300, .25, 'triangle'); }
      else if (deg < 18) { a.add(50); d.msg = a.txt({ th: 'เฉียด +50', en: 'Close +50' }); a.beep(950, .15); }
      else if (deg < 32) { a.add(20); d.msg = a.txt({ th: 'พอได้ +20', en: 'Okay +20' }); a.beep(700, .12); }
      else { d.miss++; d.msg = a.txt({ th: 'พลาด (' + d.miss + '/3)', en: 'Miss (' + d.miss + '/3)' }); a.beep(180, .25, 'square'); }
      d.st = 'stop'; d.t = 1.1;
    },
    draw: function (g, a) {
      a.bg('#08213d', '#1b4a8c');
      var d = a.data, L = d.LO, cx = a.W / 2, cy = a.H * .48;
      a.circle(cx, cy, L.R * 1.06, '#e8eefc');
      a.circle(cx, cy, L.R, '#0d1b3a');
      for (var i = 0; i < 12; i++) {
        var ang = i * (6.2832 / 12) - Math.PI / 2;
        var x = cx + Math.cos(ang) * L.R * .78, y = cy + Math.sin(ang) * L.R * .78;
        if (i === d.target) a.circle(x, y, L.R * .16, a.C.accent);
        a.text(((i === 0) ? 12 : i) + '', x, y, L.R * .16, i === d.target ? '#3a2a00' : 'rgba(255,255,255,.8)');
      }
      g.save(); g.translate(cx, cy); g.rotate(d.ang - Math.PI / 2);
      a.fillRR(-L.R * .04, -L.R * .04, L.R * .86, L.R * .08, L.R * .04, a.C.primary);
      g.restore();
      a.circle(cx, cy, L.R * .07, '#fff');
      if (d.msg) a.text(d.msg, cx, cy + L.R * 1.35, a.mn * .055, a.C.accent);
      a.head(a.txt({ th: 'รอบ ' + d.round + ' — หยุดเข็มที่เลข ' + ((d.target === 0) ? 12 : d.target), en: 'Round ' + d.round + ' — stop the hand on ' + ((d.target === 0) ? 12 : d.target) }));
    }
  });
})();
