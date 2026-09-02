/* ============================================================
   PACK 2 — เกม 11-20  (responsive: 16:9 และ 9:16)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }
  /* ข้อความหลายบรรทัด ย่อขนาดอัตโนมัติให้อยู่ในกรอบ */
  function wrap(g, s, cx, cy, maxW, maxH, size, col) {
    var lines, fs = size;
    for (; fs > 9; fs -= 1) {
      g.font = '600 ' + fs + "px Kanit,'Noto Sans Thai',sans-serif";
      lines = []; var words = s.split(' '), line = '';
      for (var i = 0; i < words.length; i++) {
        var t = line ? line + ' ' + words[i] : words[i];
        if (g.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; } else line = t;
      }
      lines.push(line);
      var wide = lines.some(function (l) { return g.measureText(l).width > maxW; });
      if (!wide && lines.length * fs * 1.32 <= maxH) break;
    }
    g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle';
    var lh = fs * 1.32;
    lines.forEach(function (l, i) { g.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * lh); });
  }

  /* ---------- 11 ตอบคำถาม ---------- */
  var QB = {
    th: [
      ['ประเทศไทยมีกี่จังหวัด?', ['77', '76', '80', '72'], 0],
      ['สีที่ได้จากสีเหลือง + สีน้ำเงิน?', ['เขียว', 'ส้ม', 'ม่วง', 'น้ำตาล'], 0],
      ['1 ชั่วโมงมีกี่วินาที?', ['3600', '600', '60', '1800'], 0],
      ['สัตว์ชนิดใดบินได้?', ['ค้างคาว', 'ปลาวาฬ', 'ม้า', 'งู'], 0],
      ['ดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุด?', ['พุธ', 'ศุกร์', 'โลก', 'อังคาร'], 0],
      ['ผลไม้ชนิดใดมีเปลือกหนาม?', ['ทุเรียน', 'กล้วย', 'องุ่น', 'ส้ม'], 0],
      ['น้ำแข็งคือน้ำในสถานะใด?', ['ของแข็ง', 'ของเหลว', 'แก๊ส', 'พลาสมา'], 0],
      ['12 × 12 เท่ากับเท่าไร?', ['144', '124', '132', '148'], 0],
      ['เมืองหลวงของญี่ปุ่นคือ?', ['โตเกียว', 'โอซาก้า', 'เกียวโต', 'โกเบ'], 0],
      ['สามเหลี่ยมมีกี่ด้าน?', ['3', '4', '5', '6'], 0]
    ],
    en: [
      ['How many colors in a rainbow?', ['7', '5', '6', '9'], 0],
      ['Yellow + blue makes…', ['Green', 'Orange', 'Purple', 'Brown'], 0],
      ['Seconds in one hour?', ['3600', '600', '60', '1800'], 0],
      ['Which animal can fly?', ['Bat', 'Whale', 'Horse', 'Snake'], 0],
      ['Closest planet to the Sun?', ['Mercury', 'Venus', 'Earth', 'Mars'], 0],
      ['Largest ocean on Earth?', ['Pacific', 'Atlantic', 'Indian', 'Arctic'], 0],
      ['Ice is water in which state?', ['Solid', 'Liquid', 'Gas', 'Plasma'], 0],
      ['What is 12 × 12?', ['144', '124', '132', '148'], 0],
      ['Capital city of Japan?', ['Tokyo', 'Osaka', 'Kyoto', 'Kobe'], 0],
      ['A triangle has how many sides?', ['3', '4', '5', '6'], 0]
    ]
  };
  R('quiz', {
    setup: function (a) {
      a.data.q = a.shuffle(QB[a.lang].slice());
      a.data.i = 0; a.data.fb = 0; a.data.pick = -1;
      a.data.LO = optLayout(a, a.port ? 1 : 2, a.port ? 4 : 2);
      mkq(a);
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.fb > 0) { d.fb -= dt; if (d.fb <= 0) { d.i++; d.pick = -1; if (d.i >= d.q.length) { d.q = a.shuffle(d.q); d.i = 0; } mkq(a); } }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.fb > 0) return;
      for (var i = 0; i < 4; i++) {
        var b = d.LO.box[i];
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.pick = i;
          if (d.opt[i].ok) { a.add(20); a.beep(900, .12); } else a.beep(160, .22, 'square');
          d.fb = .8; return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#4b1d95', '#8b2fc9');
      var d = a.data, L = d.LO;
      a.fillRR(L.qx, L.qy, L.qw, L.qh, a.mn * .028, 'rgba(255,255,255,.95)');
      wrap(g, d.q[d.i][0], a.W / 2, L.qy + L.qh / 2, L.qw * .88, L.qh * .8, a.mn * (a.port ? .064 : .052), a.C.dark);
      for (var i = 0; i < 4; i++) {
        var b = L.box[i], col = 'rgba(255,255,255,.92)', tc = a.C.dark;
        if (d.fb > 0) {
          if (d.opt[i].ok) { col = a.C.good; tc = '#fff'; }
          else if (d.pick === i) { col = a.C.bad; tc = '#fff'; }
        }
        a.fillRR(b.x, b.y, b.w, b.h, a.mn * .022, col);
        wrap(g, d.opt[i].t, b.x + b.w / 2, b.y + b.h / 2, b.w * .88, b.h * .78, a.mn * (a.port ? .052 : .042), tc);
      }
    }
  });
  function optLayout(a, cols, rows) {
    var qx = a.W * .07, qw = a.W * .86, qy = a.mn * .07, qh = a.port ? a.H * .19 : a.mn * .21;
    var gap = a.mn * .032;
    var ow = (qw - (cols - 1) * gap) / cols;
    var oh = a.port ? a.H * .105 : a.mn * .145;
    var totH = rows * oh + (rows - 1) * gap;
    var oy0 = qy + qh + Math.max(gap, (a.H - qy - qh - totH - a.mn * .05) / 2);
    var box = [];
    for (var i = 0; i < cols * rows; i++)
      box.push({ x: qx + (i % cols) * (ow + gap), y: oy0 + Math.floor(i / cols) * (oh + gap), w: ow, h: oh });
    return { qx: qx, qy: qy, qw: qw, qh: qh, box: box };
  }
  function mkq(a) {
    var q = a.data.q[a.data.i];
    a.data.opt = a.shuffle(q[1].map(function (t, i) { return { t: t, ok: i === q[2] }; }));
  }

  /* ---------- 12 หาตัวที่แตกต่าง ---------- */
  R('oddone', {
    setup: function (a) { a.data.gs = Math.min(a.W * .86, a.H * .62, a.mn * .86); a.data.lv = 1; a.data.fx = 0; mkodd(a); },
    update: function (dt, a) { if (a.data.fx > 0) a.data.fx -= dt; },
    down: function (x, y, a) {
      var d = a.data, n = d.n, s = d.gs / n, ox = (a.W - d.gs) / 2, oy = d.oy;
      var c = Math.floor((x - ox) / s), r = Math.floor((y - oy) / s);
      if (c < 0 || r < 0 || c >= n || r >= n) return;
      if (r * n + c === d.odd) { a.add(15); a.beep(950, .1); d.lv++; mkodd(a); }
      else { a.add(-5); a.beep(180, .15, 'square'); d.fx = .25; }
    },
    draw: function (g, a) {
      a.bg('#123b57', '#0d6b6b');
      var d = a.data, n = d.n, s = d.gs / n, ox = (a.W - d.gs) / 2, oy = d.oy, pad = s * .07;
      for (var i = 0; i < n * n; i++) {
        var c = i % n, r = Math.floor(i / n);
        a.fillRR(ox + c * s + pad, oy + r * s + pad, s - pad * 2, s - pad * 2, s * .12, i === d.odd ? d.c2 : d.c1);
      }
      a.head(a.txt({ th: 'รอบที่ ' + d.lv + ' — แตะช่องที่สีต่าง', en: 'Round ' + d.lv + ' — tap the odd tile' }));
      if (d.fx > 0) { g.fillStyle = 'rgba(255,82,82,' + d.fx * 1.2 + ')'; g.fillRect(0, 0, a.W, a.H); }
    }
  });
  function mkodd(a) {
    var d = a.data;
    d.n = Math.min(7, 2 + Math.floor(d.lv / 2));
    d.oy = a.mn * .15 + (a.H - a.mn * .15 - d.gs) / 2;
    var h = a.rndi(0, 359), s = a.rndi(55, 80), l = a.rndi(45, 62);
    var diff = Math.max(4, 26 - d.lv * 1.6);
    d.c1 = 'hsl(' + h + ',' + s + '%,' + l + '%)';
    d.c2 = 'hsl(' + h + ',' + s + '%,' + (l + diff) + '%)';
    d.odd = a.rndi(0, d.n * d.n - 1);
  }

  /* ---------- 13 จิ๊กซอว์เลื่อน ---------- */
  R('slidepuzzle', {
    setup: function (a) {
      var top = a.mn * .15;
      var cell = Math.min((a.W - a.mn * .14) / 3, (a.H - top - a.mn * .10) / 3, a.mn * .30);
      a.data.LO = { cell: cell, ox: (a.W - cell * 3) / 2, oy: top + (a.H - top - cell * 3) / 2 };
      a.data.n = 3; a.data.t = [0, 1, 2, 3, 4, 5, 6, 7, 8]; a.data.mv = 0;
      for (var i = 0; i < 200; i++) swap(a.data, a.pick(moves(a.data)));
      a.data.mv = 0;
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO, n = 3;
      var c = Math.floor((x - L.ox) / L.cell), r = Math.floor((y - L.oy) / L.cell);
      if (c < 0 || r < 0 || c >= n || r >= n) return;
      var i = r * n + c, b = d.t.indexOf(0);
      if (Math.abs(i % n - b % n) + Math.abs(Math.floor(i / n) - Math.floor(b / n)) === 1) {
        swap(d, i); d.mv++; a.beep(500, .05);
        if (solved(d)) { a.setScore(Math.max(50, 400 - d.mv * 4)); a.end(a.txt({ th: 'สำเร็จใน ' + d.mv + ' ตา!', en: 'Solved in ' + d.mv + ' moves!' })); }
      }
    },
    draw: function (g, a) {
      a.bg('#7a2b0f', '#d9761a');
      var d = a.data, L = L = d.LO, s = L.cell, pad = s * .04;
      a.fillRR(L.ox - pad * 2, L.oy - pad * 2, s * 3 + pad * 4, s * 3 + pad * 4, s * .1, 'rgba(0,0,0,.35)');
      for (var i = 0; i < 9; i++) {
        var v = d.t[i]; if (!v) continue;
        var c = i % 3, r = Math.floor(i / 3);
        var vc = (v - 1) % 3, vr = Math.floor((v - 1) / 3);
        var x = L.ox + c * s + pad, y = L.oy + r * s + pad, sz = s - pad * 2;
        var gr = g.createLinearGradient(x, y, x + sz, y + sz);
        gr.addColorStop(0, 'hsl(' + (vc * 40 + 190) + ',80%,58%)');
        gr.addColorStop(1, 'hsl(' + (vr * 40 + 320) + ',80%,60%)');
        a.rr(x, y, sz, sz, sz * .1); g.fillStyle = gr; g.fill();
        a.text(v + '', x + sz / 2, y + sz / 2, sz * .38, 'rgba(255,255,255,.92)');
      }
      a.head(a.txt({ th: 'เรียง 1-8 ให้ถูกลำดับ • ตาที่ใช้: ' + d.mv, en: 'Order 1-8 • moves: ' + d.mv }));
    }
  });
  function moves(d) { var b = d.t.indexOf(0), n = 3, r = Math.floor(b / n), c = b % n, o = []; if (r > 0) o.push(b - n); if (r < n - 1) o.push(b + n); if (c > 0) o.push(b - 1); if (c < n - 1) o.push(b + 1); return o; }
  function swap(d, i) { var b = d.t.indexOf(0); d.t[b] = d.t[i]; d.t[i] = 0; }
  function solved(d) { for (var i = 0; i < 8; i++) if (d.t[i] !== i + 1) return false; return true; }

  /* ---------- 14 ทุบบล็อก ---------- */
  R('breakout', {
    time: 0, lives: 3,
    setup: function (a) {
      var cols = a.port ? 6 : 10, rows = a.port ? 8 : 5;
      var area = a.W * .94, gap = area * .012, bw = (area - gap * (cols - 1)) / cols;
      var bh = Math.min(bw * .42, a.mn * .05), top = a.mn * .13;
      a.data.LO = { pw: a.mn * .22, ph: a.mn * .028, py: a.H - a.mn * .085, br: a.mn * .018, sp: a.mn * .62 };
      a.data.br = [];
      var cols5 = ['#ff2e88', '#ff6a3d', '#ffd23f', '#2fe08a', '#00d4ff'];
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++)
        a.data.br.push({ x: (a.W - area) / 2 + c * (bw + gap), y: top + r * (bh + gap), w: bw, h: bh, c: cols5[r % 5], on: 1 });
      resetBall(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.px += (d.tx - d.px) * Math.min(1, dt * 16);
      d.bx += d.vx * dt; d.by += d.vy * dt;
      if (d.bx < L.br || d.bx > a.W - L.br) { d.vx *= -1; d.bx = Math.max(L.br, Math.min(a.W - L.br, d.bx)); a.beep(400, .04); }
      if (d.by < L.br) { d.vy *= -1; d.by = L.br; a.beep(400, .04); }
      if (d.vy > 0 && d.by > L.py - L.br && d.by < L.py + L.ph + L.br && Math.abs(d.bx - d.px) < L.pw / 2 + L.br) {
        d.vy = -Math.abs(d.vy); d.vx += (d.bx - d.px) * 2.4; d.by = L.py - L.br; a.beep(660, .05);
        var sp = Math.hypot(d.vx, d.vy), mx = L.sp * 1.35;
        if (sp > mx) { d.vx *= mx / sp; d.vy *= mx / sp; }
      }
      for (var i = 0; i < d.br.length; i++) {
        var b = d.br[i]; if (!b.on) continue;
        if (d.bx > b.x - L.br && d.bx < b.x + b.w + L.br && d.by > b.y - L.br && d.by < b.y + b.h + L.br) {
          b.on = 0; d.vy *= -1; a.add(10); a.beep(880, .05);
          if (!d.br.some(function (q) { return q.on; })) { a.add(150); a.end(a.txt({ th: 'เคลียร์ครบทุกบล็อก!', en: 'All bricks cleared!' })); return; }
          break;
        }
      }
      if (d.by > a.H + L.br * 2) { a.beep(140, .3, 'sawtooth'); if (a.loseLife() > 0) resetBall(a); }
    },
    move: function (x, y, a) { a.data.tx = clampP(a, x); },
    down: function (x, y, a) { a.data.tx = clampP(a, x); },
    draw: function (g, a) {
      a.bg('#0b1d3a', '#123a63');
      var d = a.data, L = d.LO;
      d.br.forEach(function (b) { if (b.on) a.fillRR(b.x, b.y, b.w, b.h, b.h * .22, b.c); });
      a.fillRR(d.px - L.pw / 2, L.py, L.pw, L.ph, L.ph / 2, a.C.accent);
      a.circle(d.bx, d.by, L.br, '#fff');
    }
  });
  function clampP(a, x) { var h = a.data.LO.pw / 2; return Math.max(h, Math.min(a.W - h, x)); }
  function resetBall(a) {
    var d = a.data, L = d.LO;
    d.bx = a.W / 2; d.by = L.py - a.mn * .08;
    d.vx = (Math.random() < .5 ? -1 : 1) * L.sp * .45; d.vy = -L.sp;
    d.tx = a.W / 2; d.px = a.W / 2;
  }

  /* ---------- 15 ชู้ตบาส ---------- */
  R('hoops', {
    setup: function (a) {
      a.data.LO = {
        bx0: a.W * .17, by0: a.H - a.mn * .17, ball: a.mn * .075,
        hy: a.port ? a.H * .27 : a.H * .30,
        hr: a.mn * .075, xmin: a.W * .44, xmax: a.W - a.mn * .13,
        G: a.mn * 1.28
      };
      a.data.b = { x: a.data.LO.bx0, y: a.data.LO.by0, vx: 0, vy: 0, fly: 0 };
      a.data.hx = (a.data.LO.xmin + a.data.LO.xmax) / 2; a.data.hd = 1;
      a.data.aim = null; a.data.fx = 0; a.data.scored = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.hx += d.hd * a.mn * .16 * dt;
      if (d.hx > L.xmax) d.hd = -1; if (d.hx < L.xmin) d.hd = 1;
      if (d.fx > 0) d.fx -= dt;
      if (!d.b.fly) return;
      d.b.vy += L.G * dt; d.b.x += d.b.vx * dt; d.b.y += d.b.vy * dt;
      if (!d.scored && d.b.vy > 0 && d.b.y > L.hy - L.hr * .2 && d.b.y < L.hy + L.hr * .35 && Math.abs(d.b.x - d.hx) < L.hr * .68) {
        a.add(30); d.scored = 1; d.fx = .8; a.beep(1000, .18, 'triangle');
      }
      if (d.b.y > a.H + L.ball || d.b.x < -L.ball || d.b.x > a.W + L.ball) { d.b = { x: L.bx0, y: L.by0, vx: 0, vy: 0, fly: 0 }; }
    },
    down: function (x, y, a) { if (!a.data.b.fly) a.data.aim = { x: x, y: y, sx: x, sy: y }; },
    move: function (x, y, a) { if (a.data.aim) { a.data.aim.x = x; a.data.aim.y = y; } },
    up: function (x, y, a) {
      var d = a.data; if (!d.aim || d.b.fly) { d.aim = null; return; }
      var v = aimV(a); if (v) { d.b.vx = v.vx; d.b.vy = v.vy; d.b.fly = 1; d.scored = 0; a.beep(300, .1); }
      d.aim = null;
    },
    draw: function (g, a) {
      a.bg('#5d1f0a', '#c85a1e');
      var d = a.data, L = d.LO, hy = L.hy, hr = L.hr;
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, a.H - a.mn * .085, a.W, a.mn * .085);
      a.fillRR(d.hx - hr * .12, hy - hr * 1.9, hr * .24, hr * 1.9, hr * .06, '#eee');
      a.fillRR(d.hx - hr, hy - hr * 2.25, hr * 2, hr * 1.4, hr * .12, 'rgba(255,255,255,.9)');
      a.fillRR(d.hx - hr * .5, hy - hr * 1.72, hr, hr * .76, hr * .07, '#ff6a3d');
      g.strokeStyle = a.C.primary; g.lineWidth = hr * .16;
      g.beginPath(); g.moveTo(d.hx - hr * .68, hy); g.lineTo(d.hx + hr * .68, hy); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(2, hr * .04);
      for (var i = 0; i <= 6; i++) {
        g.beginPath(); g.moveTo(d.hx - hr * .68 + i * hr * .227, hy);
        g.lineTo(d.hx - hr * .45 + i * hr * .15, hy + hr * .65); g.stroke();
      }
      if (d.aim) {
        var v = aimV(a);
        if (v) {
          g.fillStyle = 'rgba(255,255,255,.75)';
          for (var t = .05; t < 1.15; t += .07) {
            g.beginPath();
            g.arc(d.b.x + v.vx * t, d.b.y + v.vy * t + L.G * .5 * t * t, a.mn * .008, 0, 6.29); g.fill();
          }
        }
      }
      EM(g, '🏀', d.b.x, d.b.y, L.ball);
      if (d.fx > 0) a.text('+30', d.hx, hy - hr - (0.8 - d.fx) * a.mn * .1, a.mn * .055, a.C.accent);
      a.head(a.txt({ th: 'ลากลงเพื่อเล็ง แล้วปล่อยยิง', en: 'Drag down to aim, release to shoot' }));
    }
  });
  function aimV(a) {
    var d = a.data, L = d.LO;
    var dx = d.aim.sx - d.aim.x, dy = d.aim.sy - d.aim.y;
    var p = Math.min(1, Math.hypot(dx, dy) / (a.mn * .38));
    if (p <= .08) return null;
    return { vx: dx * 3.1 * p * (a.mn / 720), vy: -Math.abs(dy * 3.4 * p * (a.mn / 720)) - a.mn * .26 };
  }

  /* ---------- 16 ยิงเป้าธนู ---------- */
  R('archery', {
    lives: 3,
    setup: function (a) {
      var vert = a.port;                       // แนวตั้ง = ยิงขึ้นบน
      var rr = a.mn * .155;
      a.data.LO = vert
        ? { vert: 1, tf: a.H * .26, bow: a.H - a.mn * .20, lo: a.mn * .20, hi: a.W - a.mn * .20, rr: rr, sp: a.mn * 1.30 }
        : { vert: 0, tf: a.W * .68, bow: a.W * .19, lo: a.mn * .24, hi: a.H - a.mn * .18, rr: rr, sp: a.mn * 1.30 };
      a.data.tm = (a.data.LO.lo + a.data.LO.hi) / 2;
      a.data.tv = a.mn * .27; a.data.ar = []; a.data.fx = [];
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.tm += d.tv * dt;
      if (d.tm < L.lo) { d.tm = L.lo; d.tv = Math.abs(d.tv); }
      if (d.tm > L.hi) { d.tm = L.hi; d.tv = -Math.abs(d.tv); }
      for (var i = d.ar.length - 1; i >= 0; i--) {
        var r = d.ar[i];
        r.p += (L.vert ? -1 : 1) * L.sp * dt;
        var arrived = L.vert ? (r.p < L.tf + L.rr * .1) : (r.p > L.tf - L.rr * .1);
        if (arrived) {
          var dist = Math.abs(r.q - d.tm);
          var p = dist < L.rr * .24 ? 50 : (dist < L.rr * .52 ? 20 : (dist < L.rr * .84 ? 10 : 0));
          d.ar.splice(i, 1);
          if (p) {
            a.add(p); a.beep(p === 50 ? 1200 : 800, .12);
            d.fx.push({ x: L.vert ? r.q : L.tf, y: L.vert ? L.tf : r.q, t: .6, s: '+' + p });
          } else { a.beep(150, .2, 'square'); a.loseLife(); }
        }
      }
      d.fx.forEach(function (f) { f.t -= dt; }); d.fx = d.fx.filter(function (f) { return f.t > 0; });
      d.tv += (Math.random() - .5) * a.mn * .018;
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.ar.length < 3) {
        d.ar.push(L.vert ? { p: L.bow, q: a.W / 2 } : { p: L.bow, q: a.H / 2 });
        a.beep(420, .06);
      }
    },
    draw: function (g, a) {
      a.bg('#1c5e2f', '#8fd14f');
      var d = a.data, L = d.LO, rr = L.rr;
      var tx = L.vert ? d.tm : L.tf, ty = L.vert ? L.tf : d.tm;
      g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, a.H - a.mn * .09, a.W, a.mn * .09);
      var cols = ['#ffffff', '#1b1442', '#00d4ff', '#ff2e88', '#ffd23f'];
      var rad = [1, .84, .68, .48, .24];
      for (var i = 0; i < 5; i++) a.circle(tx, ty, rr * rad[i], cols[i]);
      a.text('★', tx, ty, rr * .24, '#7a4a00');

      var bx = L.vert ? a.W / 2 : L.bow, by = L.vert ? L.bow : a.H / 2;
      g.strokeStyle = '#7a4a12'; g.lineWidth = a.mn * .013;
      g.save(); g.translate(bx, by); if (L.vert) g.rotate(-Math.PI / 2);
      g.beginPath(); g.arc(0, 0, a.mn * .086, -1.15, 1.15); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = Math.max(2, a.mn * .003);
      g.beginPath(); g.moveTo(a.mn * .035, -a.mn * .079); g.lineTo(a.mn * .035, a.mn * .079); g.stroke();
      g.restore();

      d.ar.forEach(function (r) {
        var ax = L.vert ? r.q : r.p, ay = L.vert ? r.p : r.q, len = a.mn * .065;
        g.save(); g.translate(ax, ay); if (L.vert) g.rotate(-Math.PI / 2);
        g.strokeStyle = '#fff'; g.lineWidth = a.mn * .007;
        g.beginPath(); g.moveTo(-len, 0); g.lineTo(0, 0); g.stroke();
        g.beginPath(); g.moveTo(0, 0); g.lineTo(-len * .35, -len * .2); g.lineTo(-len * .35, len * .2); g.closePath();
        g.fillStyle = a.C.accent; g.fill(); g.restore();
      });
      d.fx.forEach(function (f) {
        g.globalAlpha = f.t * 1.6;
        a.text(f.s, f.x, f.y - (0.6 - f.t) * a.mn * .1 - rr, a.mn * .05, a.C.accent); g.globalAlpha = 1;
      });
      a.head(a.txt({ th: 'แตะเพื่อยิง • พลาด 3 ครั้งจบเกม', en: 'Tap to shoot • 3 misses ends it' }));
    }
  });

  /* ---------- 17 นกบินลอดท่อ ---------- */
  R('flappy', {
    time: 0,
    setup: function (a) {
      a.data.LO = {
        bx: a.W * .24, gap: a.port ? a.mn * .40 : a.mn * .30, pw: a.mn * .13,
        G: a.mn * 2.10, flap: -a.mn * .63, spd: a.mn * .34, dist: a.port ? a.mn * .78 : a.mn * .62,
        gy: a.H - a.mn * .05, bird: a.mn * .08
      };
      a.data.y = a.H * .4; a.data.v = 0; a.data.p = []; a.data.spd = a.data.LO.spd;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.v += L.G * dt; d.y += d.v * dt;
      var lastX = d.p.length ? d.p[d.p.length - 1].x : -Infinity;
      if (lastX < a.W - L.dist) d.p.push({ x: a.W + L.pw, cy: a.rnd(L.gap * .7, a.H - L.gap * .7 - a.mn * .06), hit: 0 });
      d.spd += dt * a.mn * .004;
      d.p.forEach(function (p) {
        p.x -= d.spd * dt;
        if (!p.hit && p.x < L.bx) { p.hit = 1; a.add(10); a.beep(880, .07); }
        if (Math.abs(p.x - L.bx) < L.pw * .5 + L.bird * .35 &&
          (d.y < p.cy - L.gap / 2 || d.y > p.cy + L.gap / 2)) dead(a);
      });
      d.p = d.p.filter(function (p) { return p.x > -L.pw; });
      if (d.y > L.gy - L.bird * .35 || d.y < L.bird * .2) dead(a);
    },
    down: function (x, y, a) { a.data.v = a.data.LO.flap; a.beep(600, .05, 'triangle'); },
    draw: function (g, a) {
      a.bg('#4bc3ff', '#d9f6ff');
      var d = a.data, L = d.LO, w = L.pw, lip = w * .16;
      d.p.forEach(function (p) {
        a.fillRR(p.x - w / 2, -20, w, p.cy - L.gap / 2 + 20, w * .1, '#2fbf5b');
        a.fillRR(p.x - w / 2 - lip, p.cy - L.gap / 2 - w * .3, w + lip * 2, w * .3, w * .08, '#249c48');
        a.fillRR(p.x - w / 2, p.cy + L.gap / 2, w, a.H - (p.cy + L.gap / 2), w * .1, '#2fbf5b');
        a.fillRR(p.x - w / 2 - lip, p.cy + L.gap / 2, w + lip * 2, w * .3, w * .08, '#249c48');
      });
      g.fillStyle = '#e0b872'; g.fillRect(0, L.gy, a.W, a.H - L.gy);
      g.save(); g.translate(L.bx, d.y);
      g.rotate(Math.max(-.5, Math.min(.9, d.v / (a.mn * .97))));
      g.scale(-1, 1);                       /* ให้นกหันไปทางขวา */
      EM(g, '🐤', 0, 0, L.bird); g.restore();
    }
  });
  function dead(a) { a.beep(130, .3, 'sawtooth'); a.end(); }

  /* ---------- 18 วิ่งกระโดด ---------- */
  R('runner', {
    time: 0,
    setup: function (a) {
      a.data.LO = {
        gy: a.H - a.mn * .22, px: a.W * .22, size: a.mn * .088,
        G: a.mn * 3.05, jump: -a.mn * 1.08, spd: a.mn * .48
      };
      a.data.y = 0; a.data.v = 0; a.data.ob = []; a.data.spd = a.data.LO.spd; a.data.run = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.run += dt; d.spd += dt * a.mn * .012;
      if (d.y > 0 || d.v < 0) { d.v += L.G * dt; d.y -= d.v * dt; if (d.y <= 0) { d.y = 0; d.v = 0; } }
      var lastX = d.ob.length ? d.ob[d.ob.length - 1].x : -Infinity;
      if (lastX < a.W - a.rnd(a.mn * .55, a.mn * 1.0))
        d.ob.push({ x: a.W + a.mn * .08, h: a.rnd(a.mn * .066, a.mn * .12), hit: 0 });
      d.ob.forEach(function (o) {
        o.x -= d.spd * dt;
        if (!o.hit && o.x < L.px) { o.hit = 1; a.add(10); a.beep(800, .06); }
        if (Math.abs(o.x - L.px) < a.mn * .058 && d.y < o.h - a.mn * .008) { a.beep(130, .3, 'sawtooth'); a.end(); }
      });
      d.ob = d.ob.filter(function (o) { return o.x > -a.mn * .1; });
    },
    down: function (x, y, a) { if (a.data.y <= a.mn * .001) { a.data.v = a.data.LO.jump; a.beep(520, .07, 'triangle'); } },
    draw: function (g, a) {
      a.bg('#2b1055', '#7597de');
      var d = a.data, L = d.LO, gy = L.gy;
      for (var i = 0; i < 7; i++) {
        var bw = a.mn * .21, x = (i * bw * 1.6 - d.run * a.mn * .055) % (a.W + bw * 1.6) - bw;
        a.fillRR(x, gy - a.mn * .27, bw, a.mn * .27, bw * .08, 'rgba(255,255,255,.10)');
      }
      g.fillStyle = '#3a2b6b'; g.fillRect(0, gy, a.W, a.H - gy);
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = a.mn * .006;
      g.setLineDash([a.mn * .055, a.mn * .047]);
      g.lineDashOffset = -(d.run * d.spd) % (a.mn * .102);
      g.beginPath(); g.moveTo(0, gy + a.mn * .06); g.lineTo(a.W, gy + a.mn * .06); g.stroke(); g.setLineDash([]);
      d.ob.forEach(function (o) { a.fillRR(o.x - a.mn * .036, gy - o.h, a.mn * .072, o.h, a.mn * .011, a.C.accent); });
      g.save(); g.translate(L.px, gy - L.size * .5 - d.y);
      g.scale(-1, 1);                        /* ให้ตัววิ่งหันไปทางขวา */
      EM(g, '🏃', 0, 0, L.size); g.restore();
    }
  });

  /* ---------- 19 เขาวงกต ---------- */
  R('maze', {
    setup: function (a) { a.data.lv = 1; mkmaze(a); },
    down: function (x, y, a) { mzmove(x, y, a); },
    move: function (x, y, a) { if (a.pointer.down) mzmove(x, y, a); },
    draw: function (g, a) {
      a.bg('#1a1040', '#3b1a7a');
      var d = a.data, s = d.s, ox = d.ox, oy = d.oy;
      a.fillRR(ox - s * .18, oy - s * .18, d.cols * s + s * .36, d.rows * s + s * .36, s * .2, 'rgba(0,0,0,.3)');
      g.strokeStyle = '#00d4ff'; g.lineWidth = Math.max(3, s * .12); g.lineCap = 'round';
      for (var r = 0; r < d.rows; r++) for (var c = 0; c < d.cols; c++) {
        var w = d.g[r][c], x = ox + c * s, y = oy + r * s;
        g.beginPath();
        if (w.n) { g.moveTo(x, y); g.lineTo(x + s, y); }
        if (w.w) { g.moveTo(x, y); g.lineTo(x, y + s); }
        if (r === d.rows - 1 && w.s) { g.moveTo(x, y + s); g.lineTo(x + s, y + s); }
        if (c === d.cols - 1 && w.e) { g.moveTo(x + s, y); g.lineTo(x + s, y + s); }
        g.stroke();
      }
      a.fillRR(ox + (d.cols - 1) * s + s * .12, oy + (d.rows - 1) * s + s * .12, s * .76, s * .76, s * .12, 'rgba(47,224,138,.35)');
      EM(g, '🏁', ox + (d.cols - .5) * s, oy + (d.rows - .5) * s, s * .66);
      a.circle(ox + (d.px + .5) * s, oy + (d.py + .5) * s, s * .3, a.C.primary);
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — ลากนิ้วไปให้ถึงธง', en: 'Level ' + d.lv + ' — drag to the flag' }));
    }
  });
  function mkmaze(a) {
    var d = a.data, lv = d.lv, top = a.mn * .15;
    var lg = Math.min(17, 9 + lv * 2), sm = Math.min(11, 5 + lv);
    d.cols = a.port ? sm : lg; d.rows = a.port ? lg : sm;
    d.s = Math.floor(Math.min((a.W - a.mn * .10) / d.cols, (a.H - top - a.mn * .08) / d.rows));
    d.ox = (a.W - d.cols * d.s) / 2; d.oy = top + (a.H - top - d.rows * d.s) / 2;
    var G = [], r, c;
    for (r = 0; r < d.rows; r++) { G[r] = []; for (c = 0; c < d.cols; c++) G[r][c] = { n: 1, s: 1, e: 1, w: 1, v: 0 }; }
    var st = [[0, 0]]; G[0][0].v = 1;
    while (st.length) {
      var cur = st[st.length - 1], cr = cur[0], cc = cur[1], nb = [];
      if (cr > 0 && !G[cr - 1][cc].v) nb.push([cr - 1, cc, 'n']);
      if (cr < d.rows - 1 && !G[cr + 1][cc].v) nb.push([cr + 1, cc, 's']);
      if (cc > 0 && !G[cr][cc - 1].v) nb.push([cr, cc - 1, 'w']);
      if (cc < d.cols - 1 && !G[cr][cc + 1].v) nb.push([cr, cc + 1, 'e']);
      if (!nb.length) { st.pop(); continue; }
      var p = nb[Math.floor(Math.random() * nb.length)];
      var opp = { n: 's', s: 'n', e: 'w', w: 'e' }[p[2]];
      G[cr][cc][p[2]] = 0; G[p[0]][p[1]][opp] = 0; G[p[0]][p[1]].v = 1;
      st.push([p[0], p[1]]);
    }
    d.g = G; d.px = 0; d.py = 0;
  }
  function mzmove(x, y, a) {
    var d = a.data;
    var c = Math.floor((x - d.ox) / d.s), r = Math.floor((y - d.oy) / d.s);
    if (c < 0 || r < 0 || c >= d.cols || r >= d.rows) return;
    var dx = c - d.px, dy = r - d.py;
    if (Math.abs(dx) + Math.abs(dy) !== 1) return;
    var w = d.g[d.py][d.px];
    if (dx === 1 && w.e) return; if (dx === -1 && w.w) return;
    if (dy === 1 && w.s) return; if (dy === -1 && w.n) return;
    d.px = c; d.py = r;
    if (c === d.cols - 1 && r === d.rows - 1) { a.add(60); a.addTime(15); a.beep(1000, .25, 'triangle'); d.lv++; mkmaze(a); }
  }

  /* ---------- 20 โยงเส้นจับคู่ ---------- */
  var LM = ['🍕', '🚗', '⚽', '🎧', '🌵', '🐶', '📷', '🍩'];
  R('linematch', {
    setup: function (a) {
      a.data.LO = {
        xL: a.W * .25, xR: a.W * .75,
        cw: a.port ? a.W * .30 : a.mn * .19, chh: a.mn * .115,
        y0: a.mn * .20, y1: a.H - a.mn * .12
      };
      a.data.lv = 1; a.data.drag = null; mklm(a);
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      d.L.forEach(function (o, i) {
        if (!o.done && Math.abs(x - L.xL) < L.cw / 2 && Math.abs(y - o.y) < L.chh / 2) d.drag = { i: i, x: x, y: y };
      });
    },
    move: function (x, y, a) { if (a.data.drag) { a.data.drag.x = x; a.data.drag.y = y; } },
    up: function (x, y, a) {
      var d = a.data, L = d.LO; if (!d.drag) return;
      d.R.forEach(function (o) {
        if (!o.done && Math.abs(x - L.xR) < L.cw / 2 + a.mn * .02 && Math.abs(y - o.y) < L.chh / 2 + a.mn * .02) {
          if (o.e === d.L[d.drag.i].e) {
            o.done = 1; d.L[d.drag.i].done = 1; d.L[d.drag.i].to = o.y; a.add(25); a.beep(900, .1);
            if (d.L.every(function (q) { return q.done; })) { a.add(50); a.addTime(10); d.lv++; mklm(a); }
          } else a.beep(180, .15, 'square');
        }
      });
      d.drag = null;
    },
    draw: function (g, a) {
      a.bg('#0d3b40', '#1f7a5c');
      var d = a.data, L = d.LO;
      g.lineWidth = a.mn * .010; g.lineCap = 'round';
      d.L.forEach(function (o) {
        if (o.done) {
          g.strokeStyle = a.C.accent; g.beginPath();
          g.moveTo(L.xL + L.cw / 2, o.y); g.lineTo(L.xR - L.cw / 2, o.to); g.stroke();
        }
      });
      if (d.drag) {
        g.strokeStyle = 'rgba(255,255,255,.8)'; g.beginPath();
        g.moveTo(L.xL + L.cw / 2, d.L[d.drag.i].y); g.lineTo(d.drag.x, d.drag.y); g.stroke();
      }
      function card(x, o) {
        a.fillRR(x - L.cw / 2, o.y - L.chh / 2, L.cw, L.chh, L.chh * .18, o.done ? 'rgba(255,255,255,.45)' : '#fff');
        EM(g, o.e, x, o.y, L.chh * .58);
      }
      d.L.forEach(function (o) { card(L.xL, o); });
      d.R.forEach(function (o) { card(L.xR, o); });
      a.head(a.txt({ th: 'ลากเส้นจากซ้ายไปหาคู่ทางขวา • รอบ ' + d.lv, en: 'Drag left to its match • round ' + d.lv }));
    }
  });
  function mklm(a) {
    var d = a.data, L = d.LO, n = Math.min(6, 4 + Math.floor(d.lv / 2));
    var pool = a.shuffle(LM.slice()).slice(0, n);
    var ys = []; for (var i = 0; i < n; i++) ys.push(L.y0 + (L.y1 - L.y0) * (n === 1 ? .5 : i / (n - 1)));
    d.L = pool.map(function (e, i) { return { e: e, y: ys[i], done: 0, to: 0 }; });
    d.R = a.shuffle(pool.slice()).map(function (e, i) { return { e: e, y: ys[i], done: 0 }; });
  }
})();
