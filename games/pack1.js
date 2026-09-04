/* ============================================================
   PACK 1 — เกม 01-10  (responsive: 16:9 และ 9:16)
   ทุก layout คำนวณจาก a.W / a.H / a.mn เท่านั้น ห้ามใส่ค่าคงที่เป็นพิกเซล
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }

  /* ---------- 01 ตีตัวตุ่น ---------- */
  R('whack', {
    setup: function (a) {
      var top = a.mn * .14, cols = 3, rows = a.port ? 4 : 3;
      var cw = a.W / cols, chh = (a.H - top) / rows;
      var rx = Math.min(cw, chh) * .40;
      a.data.top = top; a.data.rx = rx; a.data.holes = [];
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++)
        a.data.holes.push({ x: cw * (c + .5), y: top + chh * (r + .55), up: 0, life: 0, bomb: false, pop: 0 });
      a.data.sp = .4;
    },
    update: function (dt, a) {
      var d = a.data;
      d.holes.forEach(function (h) {
        if (h.up) { h.life -= dt; h.t = (h.t || 0) + dt; if (h.life <= 0) { h.up = 0; h.t = 0; } }
        if (h.pop > 0) h.pop -= dt;
      });
      d.sp -= dt;
      if (d.sp <= 0) {
        var free = d.holes.filter(function (h) { return !h.up; });
        if (free.length) { var h = a.pick(free); h.up = 1; h.bomb = Math.random() < .22; h.life = a.rnd(.7, 1.25); }
        d.sp = a.rnd(.3, .62);
      }
    },
    down: function (x, y, a) {
      var rx = a.data.rx;
      a.data.holes.forEach(function (h) {
        if (h.up && Math.hypot(x - h.x, y - (h.y - rx * .5)) < rx * .9) {
          h.up = 0; h.t = 0; h.pop = .35;
          if (h.bomb) {
            a.add(-15); a.beep(120, .2, 'sawtooth');
            a.shake(.03, .38); a.flash('#ff4646', .22);
            a.puff(h.x, h.y - rx * .4, { n: 16, col: '#2b2b3d', spd: a.mn * .8, size: a.mn * .016 });
          } else {
            a.add(10); a.beep(880, .08);
            a.shake(.012, .22);
            a.puff(h.x, h.y, { n: 10, col: '#c98a56', spread: 2.4 });
          }
        }
      });
    },
    draw: function (g, a) {
      a.bg('#7ec8ff', '#b7f0a8');
      var d = a.data, rx = d.rx;
      g.fillStyle = '#8d5a3b'; g.fillRect(0, d.top * .8, a.W, a.H - d.top * .8);
      d.holes.forEach(function (h) {
        /* ภาพตัวตุ่นมีขอบหลุมติดมาในตัวอยู่แล้ว จึงไม่วาดหลุมซ้อนใต้ตัวที่โผล่
           แต่ระเบิดไม่มีขอบ ต้องวาดหลุมรองให้ ไม่งั้นจะดูลอย */
        if (a.hasSpr('hole')) { if (!(h.up && !h.bomb)) a.spr('hole', null, h.x, h.y, rx * 1.75); }
        else {
          g.beginPath(); g.ellipse(h.x, h.y, rx * 1.12, rx * .44, 0, 0, 6.29);
          g.fillStyle = '#3d2418'; g.fill();
        }
      });
      d.holes.forEach(function (h) {
        if (h.up) {
          /* 0.18 วิแรก = พุ่งขึ้นมาแบบเด้งเกินแล้วเข้าที่ จากนั้นแกว่งเบา ๆ รอโดนตี */
          var t = Math.min(1, (h.t || 0) / .18);
          var rise = a.ease(t);                       // 0..1 ระยะที่โผล่พ้นหลุม
          var sy = 1 + (1 - t) * .35 * Math.cos((h.t || 0) * 22);   // ยืด/ยุบตอนโผล่
          var sway = t >= 1 ? Math.sin((h.t || 0) * 3.4) * .05 : 0; // แกว่งตอนรอ
          a.spr(h.bomb ? 'bomb' : 'mole', h.bomb ? '💣' : '🐹',
                h.x, h.y - rx * .55 * rise, rx * 1.75,
                { sy: sy, sx: 2 - sy, rot: sway });
        }
        if (h.pop > 0) {
          var k = h.pop / .35;                        // 1 -> 0
          a.spr('hit', null, h.x, h.y - rx * .55, rx * 2.1 * (1.5 - k * .5), { alpha: k });
          a.text(h.bomb ? '-15' : '+10', h.x, h.y - rx * (1.2 + (1 - k) * .8),
                 rx * .55, h.bomb ? a.C.bad : a.C.accent);
        }
      });
      a.head(a.txt({ th: 'แตะตัวตุ่น • เลี่ยงระเบิด', en: 'Tap moles • avoid bombs' }));
    }
  });

  /* ---------- 02 ปาลูกโป่ง ---------- */
  R('balloon', {
    setup: function (a) {
      a.data.b = []; a.data.sp = 0; a.data.fx = [];
      a.data.cols = [a.C.primary, a.C.secondary, a.C.good, '#ff6a3d', '#b06bff'];
    },
    update: function (dt, a) {
      var d = a.data;
      d.sp -= dt;
      if (d.sp <= 0) {
        var t = Math.random(), kind = t < .08 ? 'gold' : (t < .22 ? 'spike' : 'norm');
        var r = a.rnd(a.mn * .052, a.mn * .072);
        d.b.push({ x: a.rnd(r + 14, a.W - r - 14), y: a.H + r * 2, r: r, v: a.rnd(a.mn * .10, a.mn * .21), k: kind, c: a.pick(d.cols), w: a.rnd(0, 6.28) });
        d.sp = a.rnd(.26, .52);
      }
      d.b.forEach(function (b) { b.y -= b.v * dt; b.w += dt * 2; b.x += Math.sin(b.w) * .6; });
      d.b = d.b.filter(function (b) { return b.y > -b.r * 3; });
      d.fx.forEach(function (f) { f.t -= dt; }); d.fx = d.fx.filter(function (f) { return f.t > 0; });
    },
    down: function (x, y, a) {
      var d = a.data;
      for (var i = d.b.length - 1; i >= 0; i--) {
        var b = d.b[i];
        if (Math.hypot(x - b.x, y - b.y) < b.r + a.mn * .02) {
          var p = b.k === 'gold' ? 50 : (b.k === 'spike' ? -20 : 10);
          a.add(p); a.beep(b.k === 'spike' ? 140 : 700, .1, b.k === 'spike' ? 'square' : 'sine');
          d.fx.push({ x: b.x, y: b.y, t: .5, p: (p > 0 ? '+' : '') + p, c: p > 0 ? a.C.accent : a.C.bad });
          /* เศษยางกระเด็นเป็นสีของลูกโป่งใบนั้น */
          a.puff(b.x, b.y, { n: b.k === 'spike' ? 18 : 12, col: b.k === 'gold' ? '#ffd75e' : b.c,
                             spd: a.mn * .75, size: a.mn * .011, life: .45 });
          if (b.k === 'spike') { a.shake(.022, .3); a.flash('#ff4646', .16); }
          else a.shake(.008, .16);
          d.b.splice(i, 1); return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#3fa9ff', '#c9f0ff');
      a.data.b.forEach(function (b) {
        g.strokeStyle = 'rgba(255,255,255,.65)'; g.lineWidth = Math.max(2, a.mn * .004);
        g.beginPath(); g.moveTo(b.x, b.y + b.r);
        g.quadraticCurveTo(b.x + b.r * .3, b.y + b.r * 1.6, b.x, b.y + b.r * 2.3); g.stroke();
        var col = b.k === 'gold' ? '#ffd23f' : (b.k === 'spike' ? '#2b2b3d' : b.c);
        if (a.hasSpr('balloon')) {
          /* ภาพลูกโป่งวาดมาเป็นสีขาว ย้อมสีตอนวาดให้เข้ากับแบรนด์ */
          a.sprTint('balloon', col, null, b.x, b.y, b.r * 2.3, { rot: Math.sin(b.w) * .13 });
        } else {
          g.beginPath(); g.ellipse(b.x, b.y, b.r * .86, b.r, 0, 0, 6.29); g.fillStyle = col; g.fill();
          g.beginPath(); g.ellipse(b.x - b.r * .28, b.y - b.r * .32, b.r * .2, b.r * .3, -.4, 0, 6.29);
          g.fillStyle = 'rgba(255,255,255,.55)'; g.fill();
        }
        if (b.k === 'gold') a.spr('star', '⭐', b.x, b.y, b.r * .8);
        if (b.k === 'spike') a.spr('pop', '💥', b.x, b.y, b.r * .72);
      });
      a.data.fx.forEach(function (f) {
        g.globalAlpha = Math.max(0, f.t * 2);
        a.text(f.p, f.x, f.y - (0.5 - f.t) * a.mn * .16, a.mn * .052, f.c); g.globalAlpha = 1;
      });
    }
  });

  /* ---------- 03 จับคู่การ์ด ---------- */
  R('memory', {
    setup: function (a) {
      var faces = ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍'];
      var cols = a.port ? 3 : 4, rows = a.port ? 4 : 3;
      var top = a.mn * .14;
      var cell = Math.min((a.W - a.mn * .10) / cols, (a.H - top - a.mn * .08) / rows);
      a.data.LO = {
        cols: cols, cell: cell, size: cell * .88,
        ox: (a.W - cols * cell) / 2 + cell * .06,
        oy: top + (a.H - top - rows * cell) / 2 + cell * .06
      };
      var deck = a.shuffle(faces.concat(faces));
      a.data.c = deck.map(function (f, i) { return { f: f, r: Math.floor(i / cols), col: i % cols, st: 0 }; });
      a.data.open = []; a.data.lock = 0; a.data.left = 6;
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.lock > 0) {
        d.lock -= dt;
        if (d.lock <= 0) {
          if (d.open[0].f === d.open[1].f) {
            d.open[0].st = 2; d.open[1].st = 2; a.add(20); d.left--; a.beep(900, .12);
            if (!d.left) a.end(a.txt({ th: 'จับคู่ครบแล้ว!', en: 'All matched!' }));
          } else { d.open[0].st = 0; d.open[1].st = 0; a.beep(200, .1, 'square'); }
          d.open = [];
        }
      }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.lock > 0) return;
      d.c.forEach(function (c) {
        var b = cbox(a, c);
        if (c.st === 0 && x > b.x && x < b.x + b.s && y > b.y && y < b.y + b.s) {
          c.st = 1; d.open.push(c); a.beep(520, .06);
          if (d.open.length === 2) d.lock = .65;
        }
      });
    },
    draw: function (g, a) {
      a.bg('#2b1b6b', '#0f3f77');
      var L = a.data.LO;
      a.data.c.forEach(function (c) {
        var b = cbox(a, c), s = b.s;
        if (c.st === 0) {
          a.fillRR(b.x, b.y, s, s, s * .11, '#ff2e88');
          g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = Math.max(2, s * .022);
          a.rr(b.x + s * .08, b.y + s * .08, s * .84, s * .84, s * .07); g.stroke();
          a.text('?', b.x + s / 2, b.y + s / 2, s * .38, 'rgba(255,255,255,.85)');
        } else {
          a.fillRR(b.x, b.y, s, s, s * .11, c.st === 2 ? '#2fe08a' : '#ffffff');
          EM(g, c.f, b.x + s / 2, b.y + s / 2, s * .48);
        }
      });
      a.head(a.txt({ th: 'พลิกการ์ดหาคู่ที่เหมือนกัน', en: 'Flip the cards, find the pairs' }));
    }
  });
  function cbox(a, c) {
    var L = a.data.LO;
    return { x: L.ox + c.col * L.cell, y: L.oy + c.r * L.cell, s: L.size };
  }

  /* ---------- 04 รับผลไม้ ---------- */
  R('catchfruit', {
    lives: 3,
    setup: function (a) {
      a.data.hw = a.mn * .092;                // ครึ่งความกว้างตะกร้า
      /* ภาพตะกร้าสูงกว่ารูปทรงที่โค้ดวาดเดิม จึงต้องยกเส้นปากตะกร้าขึ้น
         ไม่งั้นก้นตะกร้าจะโดนขอบล่างจอตัด */
      a.data.by = a.hasSpr('basket')
        ? a.H - a.mn * .19 - (a.port ? a.mn * .05 : 0)
        : a.H - a.mn * .11 - (a.port ? a.mn * .07 : 0);   // ระดับปากตะกร้า
      a.data.is = a.mn * .161;                // ขนาดของที่ตก
      a.data.bx = a.W / 2; a.data.tx = a.W / 2; a.data.it = []; a.data.sp = .6;
      a.data.good = ['🍎', '🍊', '🍇', '🍓', '🍋', '🍉'];
    },
    update: function (dt, a) {
      var d = a.data;
      d.bump = Math.max(0, (d.bump || 0) - dt);      // ตะกร้าเด้งตอนเพิ่งรับของ
      d.bx += (d.tx - d.bx) * Math.min(1, dt * 14);
      d.sp -= dt;
      if (d.sp <= 0) {
        var bomb = Math.random() < .25;
        d.it.push({ x: a.rnd(d.is, a.W - d.is), y: -d.is, v: a.rnd(a.mn * .30, a.mn * .50), b: bomb, e: bomb ? '💣' : a.pick(d.good), sp: a.rnd(0, 6) });
        d.sp = a.rnd(.42, .8);
      }
      for (var i = d.it.length - 1; i >= 0; i--) {
        var o = d.it[i]; o.y += o.v * dt; o.sp += dt * 3;
        if (o.y > d.by - a.mn * .06 && o.y < d.by + a.mn * .05 && Math.abs(o.x - d.bx) < d.hw + d.is * .3) {
          d.it.splice(i, 1);
          d.bump = .22;                                  // ตะกร้าเด้ง
          if (o.b) {
            a.beep(120, .22, 'sawtooth'); a.loseLife();
            a.shake(.03, .38); a.flash('#ff4646', .22);
            a.puff(o.x, d.by, { n: 16, col: '#2b2b3d', spd: a.mn * .8, size: a.mn * .015 });
          } else {
            a.add(10); a.beep(880, .07);
            a.shake(.01, .18);
            a.puff(o.x, d.by, { n: 8, col: a.C.accent, spread: 2.2, spd: a.mn * .45, size: a.mn * .009, life: .4 });
          }
        } else if (o.y > a.H + d.is) d.it.splice(i, 1);
      }
    },
    move: function (x, y, a) { a.data.tx = Math.max(a.data.hw, Math.min(a.W - a.data.hw, x)); },
    down: function (x, y, a) { a.data.tx = Math.max(a.data.hw, Math.min(a.W - a.data.hw, x)); },
    draw: function (g, a) {
      a.bg('#ff9a5b', '#ffe082');
      var d = a.data;
      g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, a.H - a.mn * .06, a.W, a.mn * .06);
      /* จับคู่อิโมจิเดิมกับคีย์ภาพ ถ้าไม่มีไฟล์ก็ตกกลับไปวาดอิโมจิเหมือนเดิม */
      var KEY = { '🍎': 'apple', '🍊': 'orange', '🍇': 'grape', '🍓': 'straw',
                  '🍋': 'lemon', '🍉': 'melon', '💣': 'bomb' };
      d.it.forEach(function (o) {
        a.spr(KEY[o.e] || '', o.e, o.x, o.y, d.is, { rot: Math.sin(o.sp) * .25 });
      });
      var bx = d.bx, by = d.by, hw = d.hw, bh = a.mn * .10;
      if (a.hasSpr('basket')) {
        /* ให้ความกว้างภาพพอดีกับกรอบรับของ (hw*2) แล้วเผื่อขอบตะกร้าอีกนิด
           ปากตะกร้าในภาพอยู่ค่อนบน จึงเลื่อนจุดกึ่งกลางลงมา by + hw*.8 */
        var bp = 1 + Math.sin(Math.min(1, (d.bump || 0) / .22) * Math.PI) * .12;
        a.spr('basket', null, bx, by + hw * .82, hw * 2.5, { sx: bp, sy: 2 - bp });
      } else {
        a.shadow(true);
        g.beginPath(); g.moveTo(bx - hw, by); g.lineTo(bx + hw, by);
        g.lineTo(bx + hw * .78, by + bh); g.lineTo(bx - hw * .78, by + bh); g.closePath();
        g.fillStyle = a.C.primary; g.fill(); a.shadow(false);
        a.fillRR(bx - hw * 1.08, by - a.mn * .014, hw * 2.16, a.mn * .028, a.mn * .014, '#ffffff');
        a.text('LOGO', bx, by, a.mn * .021, a.C.primary);
      }
    }
  });

  /* ---------- 05 กดเร็วจี๊ด ---------- */
  R('tapspeed', {
    setup: function (a) { a.data.p = 0; a.data.rip = []; a.data.R = Math.min(a.W * .32, a.H * .24); a.data.cy = a.H * .46; },
    update: function (dt, a) {
      var d = a.data; d.p = Math.max(0, d.p - dt * .9);
      d.rip.forEach(function (r) { r.t -= dt; }); d.rip = d.rip.filter(function (r) { return r.t > 0; });
    },
    down: function (x, y, a) {
      var d = a.data;
      if (Math.hypot(x - a.W / 2, y - d.cy) < d.R * 1.16) {
        a.add(1); d.p = Math.min(1, d.p + .075); d.rip.push({ t: .45 });
        a.beep(500 + a.score * 4, .05, 'triangle');
      }
    },
    draw: function (g, a) {
      a.bg('#ff7a18', '#ffd23f');
      var d = a.data, cx = a.W / 2, cy = d.cy, R2 = d.R;
      d.rip.forEach(function (r) {
        g.globalAlpha = r.t * 1.6; g.strokeStyle = '#fff'; g.lineWidth = a.mn * .009;
        g.beginPath(); g.arc(cx, cy, R2 * 1.03 + (0.45 - r.t) * R2 * 1.2, 0, 6.29); g.stroke(); g.globalAlpha = 1;
      });
      a.shadow(true); a.circle(cx, cy, R2 + d.p * a.mn * .02, '#ffffff'); a.shadow(false);
      a.circle(cx, cy, R2 * .86 + d.p * a.mn * .018, a.C.primary);
      a.text('TAP!', cx, cy - R2 * .08, R2 * .40, '#fff');
      a.text(a.score + '', cx, cy + R2 * .30, R2 * .22, 'rgba(255,255,255,.85)');
      var bw = a.W * .62, bx = (a.W - bw) / 2, by = a.H - a.mn * .13, bh = a.mn * .038;
      a.fillRR(bx, by, bw, bh, bh / 2, 'rgba(0,0,0,.28)');
      a.fillRR(bx + bh * .16, by + bh * .16, (bw - bh * .32) * d.p, bh * .68, bh * .34, a.C.accent);
      a.head(a.txt({ th: 'กดรัว ๆ ให้ได้มากที่สุด!', en: 'Tap as fast as you can!' }));
    }
  });

  /* ---------- 06 วัดปฏิกิริยา ---------- */
  R('reaction', {
    time: 0,
    setup: function (a) { a.data.st = 'wait'; a.data.t = a.rnd(1.2, 3.2); a.data.round = 1; a.data.msg = ''; a.data.list = []; },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'wait') { d.t -= dt; if (d.t <= 0) { d.st = 'go'; d.t = 0; a.beep(900, .1); } }
      else if (d.st === 'go') d.t += dt;
      else if (d.st === 'res') { d.t -= dt; if (d.t <= 0) nextR(a); }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.st === 'wait') { d.msg = a.txt({ th: 'เร็วไป! ฟาวล์', en: 'Too early!' }); d.list.push(null); d.st = 'res'; d.t = 1.2; a.beep(140, .25, 'square'); }
      else if (d.st === 'go') {
        var ms = Math.round(d.t * 1000);
        d.list.push(ms); a.add(Math.max(0, 600 - ms));
        d.msg = ms + ' ms'; d.st = 'res'; d.t = 1.2; a.beep(1000, .1);
      }
    },
    draw: function (g, a) {
      var d = a.data;
      g.fillStyle = d.st === 'go' ? a.C.good : (d.st === 'wait' ? '#c9302c' : '#2b2350');
      g.fillRect(0, 0, a.W, a.H);
      a.text(a.txt({ th: 'รอบที่ ', en: 'Round ' }) + d.round + ' / 5', a.W / 2, a.mn * .08, a.mn * .038, 'rgba(255,255,255,.75)');
      if (d.st === 'wait') { EM(g, '✋', a.W / 2, a.H * .44, a.mn * .17); a.text(a.txt({ th: 'รอ... อย่าเพิ่งแตะ', en: 'Wait for green…' }), a.W / 2, a.H * .62, a.mn * .055, '#fff'); }
      else if (d.st === 'go') { EM(g, '👆', a.W / 2, a.H * .44, a.mn * .17); a.text(a.txt({ th: 'แตะเลย!', en: 'TAP NOW!' }), a.W / 2, a.H * .62, a.mn * .08, '#fff'); }
      else a.text(d.msg, a.W / 2, a.H / 2, a.mn * .09, '#fff');
    }
  });
  function nextR(a) {
    var d = a.data; d.round++;
    if (d.round > 5) {
      var ok = d.list.filter(function (v) { return v !== null; });
      var avg = ok.length ? Math.round(ok.reduce(function (s, v) { return s + v; }, 0) / ok.length) : 0;
      a.end(a.txt({ th: 'เฉลี่ย ' + avg + ' ms', en: 'Average ' + avg + ' ms' })); return;
    }
    d.st = 'wait'; d.t = a.rnd(1.2, 3.2);
  }

  /* ---------- 07 จำลำดับสี ---------- */
  R('simon', {
    time: 0,
    setup: function (a) {
      a.data.seq = []; a.data.i = 0; a.data.st = 'show'; a.data.lit = -1; a.data.t = .6; a.data.step = 0;
      a.data.R = Math.min(a.W * .42, a.H * .32); a.data.cy = a.H * .53;
      a.data.cols = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a'];
      a.data.tone = [330, 415, 494, 587];
      a.data.seq.push(a.rndi(0, 3));
    },
    update: function (dt, a) {
      var d = a.data; if (d.st !== 'show') return;
      d.t -= dt; if (d.t > 0) return;
      if (d.lit >= 0) { d.lit = -1; d.t = .18; d.step++; if (d.step >= d.seq.length) { d.st = 'in'; d.i = 0; } }
      else { d.lit = d.seq[d.step]; d.t = .45; a.beep(d.tone[d.lit], .35, 'triangle'); }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st !== 'in') return;
      var q = quad(x, y, a); if (q < 0) return;
      d.lit = q; a.beep(d.tone[q], .2, 'triangle');
      setTimeout(function () { if (d.lit === q) d.lit = -1; }, 200);
      if (q === d.seq[d.i]) {
        d.i++;
        if (d.i >= d.seq.length) { a.add(25); d.st = 'show'; d.step = 0; d.t = .8; d.seq.push(a.rndi(0, 3)); }
      } else { a.beep(110, .4, 'sawtooth'); a.end(a.txt({ th: 'จำได้ ' + (d.seq.length - 1) + ' ลำดับ', en: 'Reached ' + (d.seq.length - 1) + ' steps' })); }
    },
    draw: function (g, a) {
      a.bg('#180f3d', '#0b1a3d');
      var d = a.data, cx = a.W / 2, cy = d.cy, R2 = d.R;
      for (var i = 0; i < 4; i++) {
        g.beginPath(); g.moveTo(cx, cy);
        g.arc(cx, cy, R2, -Math.PI + i * Math.PI / 2 + .03, -Math.PI + (i + 1) * Math.PI / 2 - .03);
        g.closePath();
        g.fillStyle = d.lit === i ? '#ffffff' : d.cols[i];
        g.globalAlpha = d.lit === i ? 1 : .8; g.fill(); g.globalAlpha = 1;
      }
      a.circle(cx, cy, R2 * .35, '#1b1442');
      a.text(d.seq.length + '', cx, cy - R2 * .05, R2 * .2, a.C.accent);
      a.text('LV', cx, cy + R2 * .15, R2 * .075, 'rgba(255,255,255,.6)');
      a.head(d.st === 'show' ? a.txt({ th: 'ดูให้ดี…', en: 'Watch…' }) : a.txt({ th: 'ตาคุณแล้ว!', en: 'Your turn!' }));
    }
  });
  function quad(x, y, a) {
    var cx = a.W / 2, cy = a.data.cy, R2 = a.data.R;
    var dx = x - cx, dy = y - cy, dist = Math.hypot(dx, dy);
    if (dist > R2 || dist < R2 * .35) return -1;
    return Math.max(0, Math.min(3, Math.floor((Math.atan2(dy, dx) + Math.PI) / (Math.PI / 2))));
  }

  /* ---------- 08 วงล้อเสี่ยงโชค ---------- */
  R('wheel', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.prz = a.lang === 'en'
        ? ['10% OFF', 'FREE GIFT', 'TRY AGAIN', '50% OFF', 'STICKER', 'JACKPOT!', 'COUPON', 'KEYCHAIN']
        : ['ลด 10%', 'ของแถม', 'เสียใจด้วย', 'ลด 50%', 'สติกเกอร์', 'แจ็กพอต!', 'คูปอง', 'พวงกุญแจ'];
      a.data.ang = 0; a.data.v = 0; a.data.st = 'idle'; a.data.win = '';
      a.data.R = Math.min(a.W * .44, a.H * .33); a.data.cy = a.H * .55;
      a.data.cols = ['#ff2e88', '#ffd23f', '#00d4ff', '#2fe08a', '#ff6a3d', '#b06bff', '#ff4f81', '#38d9a9'];
    },
    update: function (dt, a) {
      var d = a.data; if (d.st !== 'spin') return;
      d.ang += d.v * dt; d.v *= Math.pow(.35, dt);
      if (d.v < .15) {
        d.st = 'done'; d.v = 0;
        var n = d.prz.length, seg = 6.2832 / n;
        var idx = Math.floor(((-d.ang - Math.PI / 2) % 6.2832 + 6.2832) % 6.2832 / seg);
        d.win = d.prz[idx % n]; a.beep(880, .3, 'triangle');
      }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st === 'spin') return;
      d.st = 'spin'; d.v = a.rnd(13, 20); d.win = ''; a.beep(400, .2, 'square');
    },
    draw: function (g, a) {
      a.bg('#3b1170', '#7b2ff7');
      var d = a.data, cx = a.W / 2, cy = d.cy, R2 = d.R, n = d.prz.length, seg = 6.2832 / n;
      a.circle(cx, cy, R2 * 1.06, '#ffffff');
      for (var i = 0; i < n; i++) {
        g.beginPath(); g.moveTo(cx, cy);
        g.arc(cx, cy, R2, d.ang + i * seg, d.ang + (i + 1) * seg); g.closePath();
        g.fillStyle = d.cols[i % d.cols.length]; g.fill();
        g.save(); g.translate(cx, cy); g.rotate(d.ang + (i + .5) * seg);
        var fs = R2 * .095;
        g.font = '600 ' + fs + 'px Kanit,sans-serif';
        while (g.measureText(d.prz[i]).width > R2 * .68 && fs > 8) { fs -= 1; g.font = '600 ' + fs + 'px Kanit,sans-serif'; }
        g.fillStyle = '#fff'; g.textAlign = 'right'; g.textBaseline = 'middle';
        g.fillText(d.prz[i], R2 * .90, 0); g.restore();
      }
      a.circle(cx, cy, R2 * .26, '#ffffff'); a.circle(cx, cy, R2 * .22, a.C.dark);
      a.text('SPIN', cx, cy, R2 * .09, '#fff');
      g.beginPath(); g.moveTo(cx, cy - R2 * 1.20); g.lineTo(cx - R2 * .09, cy - R2 * .96);
      g.lineTo(cx + R2 * .09, cy - R2 * .96); g.closePath(); g.fillStyle = a.C.accent; g.fill();
      if (d.st === 'done') {
        var bw = Math.min(a.W * .86, a.mn * 1.0);
        a.fillRR((a.W - bw) / 2, a.mn * .03, bw, a.mn * .11, a.mn * .026, 'rgba(0,0,0,.55)');
        a.text('🎉 ' + d.win, a.W / 2, a.mn * .085, a.mn * .055, a.C.accent);
      } else a.head(a.txt({ th: 'แตะที่จอเพื่อหมุนวงล้อ', en: 'Tap anywhere to spin' }));
    }
  });

  /* ---------- 09 สล็อตแมชชีน ---------- */
  R('slot', {
    time: 0,
    setup: function (a) {
      a.data.sym = ['🍒', '🍋', '🔔', '⭐', '💎', '7️⃣'];
      a.data.r = [{ o: 0, v: 0, s: 0 }, { o: 0, v: 0, s: 0 }, { o: 0, v: 0, s: 0 }];
      a.data.st = 'idle'; a.data.msg = '';
      var bw = Math.min(a.W * .84, a.mn * .96);
      var gap = bw * .028, rw = (bw - gap * 4) / 3, bh = rw * 1.45;
      a.data.LO = { bw: bw, gap: gap, rw: rw, bh: bh, bx: (a.W - bw) / 2, by: a.H * .5 - bh * .42 };
    },
    update: function (dt, a) {
      var d = a.data; if (d.st !== 'spin') return;
      var all = true;
      d.r.forEach(function (r) {
        if (r.v > 0) { r.o += r.v * dt; r.s -= dt; if (r.s <= 0) { r.v = 0; r.o = Math.round(r.o); a.beep(420, .12); } else all = false; }
      });
      if (all) {
        d.st = 'idle';
        var v = d.r.map(function (r) { return Math.round(r.o) % 6; });
        if (v[0] === v[1] && v[1] === v[2]) { a.add(100); d.msg = a.txt({ th: '🎉 แจ็กพอต +100', en: '🎉 JACKPOT +100' }); a.beep(1200, .4, 'triangle'); }
        else if (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]) { a.add(30); d.msg = a.txt({ th: 'ได้คู่! +30', en: 'A pair! +30' }); a.beep(760, .2); }
        else d.msg = a.txt({ th: 'ลองใหม่อีกครั้ง', en: 'Try again' });
      }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st === 'spin') return;
      d.st = 'spin'; d.msg = '';
      d.r.forEach(function (r, i) { r.v = a.rnd(16, 22); r.s = 1.1 + i * .45; });
      a.beep(300, .15, 'square');
    },
    draw: function (g, a) {
      a.bg('#5b1064', '#c81d6b');
      var d = a.data, L = d.LO, hh = L.bh * .3;
      a.fillRR(L.bx - L.gap * 1.6, L.by - hh - L.gap * 1.8, L.bw + L.gap * 3.2, L.bh + hh + L.gap * 5, L.gap * 2, '#ffd23f');
      a.fillRR(L.bx - L.gap * .6, L.by - hh - L.gap * .6, L.bw + L.gap * 1.2, hh, L.gap, '#1b1442');
      a.text('LUCKY SLOT', a.W / 2, L.by - hh * .5 - L.gap * .6, hh * .5, a.C.accent);
      a.fillRR(L.bx, L.by, L.bw, L.bh, L.gap * 1.4, '#1b1442');
      for (var i = 0; i < 3; i++) {
        var x = L.bx + L.gap + i * (L.rw + L.gap), y = L.by + L.gap, h = L.bh - L.gap * 2;
        a.fillRR(x, y, L.rw, h, L.gap, '#fff');
        g.save(); a.rr(x, y, L.rw, h, L.gap); g.clip();
        var off = d.r[i].o % 1, base = Math.floor(d.r[i].o);
        for (var k = -1; k <= 1; k++) {
          var s = d.sym[((base + k) % 6 + 6) % 6];
          EM(g, s, x + L.rw / 2, y + h / 2 + (k + off) * h * .78, L.rw * .58);
        }
        g.restore();
      }
      g.strokeStyle = 'rgba(255,46,136,.85)'; g.lineWidth = Math.max(3, a.mn * .006);
      g.beginPath(); g.moveTo(L.bx + L.gap, L.by + L.bh / 2); g.lineTo(L.bx + L.bw - L.gap, L.by + L.bh / 2); g.stroke();
      a.text(d.msg || a.txt({ th: 'แตะเพื่อหมุน', en: 'Tap to spin' }), a.W / 2, L.by + L.bh + a.mn * .075, a.mn * .045, '#fff');
    }
  });

  /* ---------- 10 บัตรขูด ---------- */
  R('scratch', {
    time: 0, noScore: true,
    setup: function (a) {
      var przTH = ['🎁 ของแถม 1 ชิ้น', '💰 ส่วนลด 100 บาท', '☕ กาแฟฟรี 1 แก้ว', '🎫 คูปอง 50%', '😅 เสียใจด้วย', '🏆 รางวัลใหญ่!'];
      var przEN = ['🎁 Free gift', '💰 100 THB off', '☕ Free coffee', '🎫 50% coupon', '😅 Better luck!', '🏆 Grand prize!'];
      a.data.prize = a.pick(a.lang === 'en' ? przEN : przTH);

      var cw = Math.round(Math.min(a.W * .84, a.mn * .95));
      var ch = Math.round(Math.min(a.H * .38, cw * (a.port ? .70 : .52)));
      var L = { cw: cw, ch: ch, x: Math.round((a.W - cw) / 2), y: Math.round(a.H * .5 - ch * .38) };
      a.data.LO = L;

      var c = document.createElement('canvas'); c.width = cw; c.height = ch;
      var cg = c.getContext('2d');
      var gr = cg.createLinearGradient(0, 0, cw, ch);
      gr.addColorStop(0, '#c9cfe0'); gr.addColorStop(.5, '#f0f3fa'); gr.addColorStop(1, '#a8b0c8');
      cg.fillStyle = gr; cg.fillRect(0, 0, cw, ch);
      cg.fillStyle = 'rgba(255,255,255,.5)';
      for (var i = 0; i < 60; i++) cg.fillRect((i * 37) % cw, (i * 61) % ch, cw * .04, 3);
      var fs = Math.round(ch * .13);
      cg.font = '700 ' + fs + 'px Kanit,sans-serif'; cg.fillStyle = 'rgba(90,100,130,.85)';
      cg.textAlign = 'center'; cg.textBaseline = 'middle'; cg.fillText('SCRATCH HERE', cw / 2, ch / 2);
      a.data.foil = c; a.data.fg = cg; a.data.done = false; a.data.last = null; a.data.chk = 0;
    },
    update: function (dt, a) {
      var d = a.data; if (d.done) return;
      d.chk -= dt; if (d.chk > 0) return; d.chk = .3;
      var L = d.LO, im = d.fg.getImageData(0, 0, L.cw, L.ch).data, n = 0, tot = 0;
      for (var i = 3; i < im.length; i += 4 * 60) { tot++; if (im[i] < 40) n++; }
      if (tot && n / tot > .55) { d.done = true; a.beep(1000, .3, 'triangle'); }
    },
    down: function (x, y, a) { a.data.last = null; scr(x, y, a); },
    move: function (x, y, a) { if (a.pointer.down) scr(x, y, a); },
    up: function (x, y, a) { a.data.last = null; },
    draw: function (g, a) {
      a.bg('#0d2b4e', '#1b6ca8');
      var d = a.data, L = d.LO, pad = a.mn * .045;
      a.shadow(true);
      a.fillRR(L.x - pad, L.y - pad * 1.9, L.cw + pad * 2, L.ch + pad * 3.1, a.mn * .035, '#fff');
      a.shadow(false);
      a.text(a.txt({ th: 'บัตรขูดลุ้นโชค', en: 'Lucky Scratch Card' }), a.W / 2, L.y - pad * .85, a.mn * .04, a.C.dark);
      a.fillRR(L.x, L.y, L.cw, L.ch, a.mn * .022, '#f7f4ff');
      var fs = a.mn * .06;
      g.font = '700 ' + fs + 'px Kanit,sans-serif';
      while (g.measureText(d.prize).width > L.cw * .9 && fs > 10) { fs -= 1; g.font = '700 ' + fs + 'px Kanit,sans-serif'; }
      a.text(d.prize, a.W / 2, L.y + L.ch / 2, fs, d.done ? a.C.primary : a.C.dark);
      if (!d.done) { g.save(); a.rr(L.x, L.y, L.cw, L.ch, a.mn * .022); g.clip(); g.drawImage(d.foil, L.x, L.y); g.restore(); }
      a.text(d.done ? a.txt({ th: 'กดเล่นอีกครั้งเพื่อรับใบใหม่', en: 'Play again for a new card' }) : a.txt({ th: 'ลากนิ้วเพื่อขูด', en: 'Drag to scratch' }),
        a.W / 2, L.y + L.ch + pad * 2.1, a.mn * .034, 'rgba(255,255,255,.9)');
    }
  });
  function scr(x, y, a) {
    var d = a.data; if (d.done) return;
    var L = d.LO, lx = x - L.x, ly = y - L.y, m = L.cw * .06;
    if (lx < -m || lx > L.cw + m || ly < -m || ly > L.ch + m) { d.last = null; return; }
    var cg = d.fg, br = Math.max(14, L.cw * .05);
    cg.globalCompositeOperation = 'destination-out';
    cg.lineWidth = br * 2; cg.lineCap = 'round'; cg.lineJoin = 'round';
    if (d.last) { cg.beginPath(); cg.moveTo(d.last.x, d.last.y); cg.lineTo(lx, ly); cg.stroke(); }
    cg.beginPath(); cg.arc(lx, ly, br, 0, 6.29); cg.fill();
    cg.globalCompositeOperation = 'source-over';
    d.last = { x: lx, y: ly };
  }
})();
