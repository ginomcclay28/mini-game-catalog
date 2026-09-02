/* ============================================================
   PACK 5 — เกม 41-50  (ทักษะ / แม่นยำ)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }
  /* ขวานวาดด้วยโค้ด: ด้ามชี้ไปทาง -X ใบมีดอยู่ทาง +X */
  function drawAxe(g, a, s) {
    a.fillRR(-s * .48, -s * .075, s * .78, s * .15, s * .07, '#8a5a2b');
    g.beginPath();
    g.moveTo(s * .16, -s * .11); g.lineTo(s * .48, -s * .36);
    g.lineTo(s * .58, 0); g.lineTo(s * .48, s * .36); g.lineTo(s * .16, s * .11);
    g.closePath();
    g.fillStyle = '#ccd4e2'; g.fill();
    g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = Math.max(1, s * .025); g.stroke();
    a.fillRR(s * .08, -s * .12, s * .10, s * .24, s * .04, '#5d5d70');
  }
  function angDiff(a1, a2) {
    var d = Math.abs(a1 - a2) % 6.2832;
    return d > Math.PI ? 6.2832 - d : d;
  }

  /* ---------- 41 ปาลูกดอกใส่ผลไม้ ---------- */
  /* ผลไม้ผ่าซีก วาดด้วยโค้ดล้วน เปลี่ยนสี/ชนิดได้ที่ตารางนี้ */
  var FRUITS = [
    { th: 'แตงโม', en: 'Watermelon', rind: '#1c6b30', rind2: '#39a251', flesh: '#ff4767', core: '#ff8ba3', seed: '#241309', seeds: 12 },
    { th: 'ส้ม', en: 'Orange', rind: '#d96604', rind2: '#ff9a1f', flesh: '#ffae37', core: '#ffd489', seed: '#b85c00', seeds: 8 },
    { th: 'กีวี', en: 'Kiwi', rind: '#6f4f26', rind2: '#a37a3c', flesh: '#84c94f', core: '#eef7d6', seed: '#241f10', seeds: 14 },
    { th: 'มะนาว', en: 'Lemon', rind: '#cdb211', rind2: '#f3de45', flesh: '#fbefa2', core: '#fffad4', seed: '#bda000', seeds: 8 },
    { th: 'แก้วมังกร', en: 'Dragon fruit', rind: '#d92d70', rind2: '#ff639b', flesh: '#fdf2f6', core: '#ffffff', seed: '#2b2b2b', seeds: 16 }
  ];
  function drawFruit(g, a, cx, cy, R, f, rot) {
    a.circle(cx, cy, R, f.rind);
    a.circle(cx, cy, R * .93, f.rind2);
    a.circle(cx, cy, R * .85, f.flesh);
    g.save(); g.translate(cx, cy); g.rotate(rot);
    g.strokeStyle = 'rgba(255,255,255,.30)'; g.lineWidth = Math.max(1, R * .022);
    for (var i = 0; i < 8; i++) {
      g.beginPath(); g.moveTo(0, 0);
      g.lineTo(Math.cos(i * .7854) * R * .85, Math.sin(i * .7854) * R * .85); g.stroke();
    }
    a.circle(0, 0, R * .15, f.core);
    for (var k = 0; k < f.seeds; k++) {
      var an = k * (6.2832 / f.seeds) + .35, rr = R * (k % 2 ? .42 : .63);
      g.save(); g.translate(Math.cos(an) * rr, Math.sin(an) * rr); g.rotate(an);
      g.beginPath(); g.ellipse(0, 0, R * .052, R * .03, 0, 0, 6.2832);
      g.fillStyle = f.seed; g.fill(); g.restore();
    }
    g.restore();
  }
  /* ลูกดอก: ปลายแหลมอยู่ที่ (0,0) ชี้ไปทาง +X ตัวลูกดอกยื่นไปทาง -X */
  function drawDart(g, a, len, colBody, colFin) {
    var w = len * .13;
    g.beginPath(); g.moveTo(0, 0);
    g.lineTo(-len * .22, -w * .48); g.lineTo(-len * .22, w * .48); g.closePath();
    g.fillStyle = '#dfe3ee'; g.fill();
    a.fillRR(-len * .60, -w * .5, len * .40, w, w * .38, colBody);
    g.fillStyle = 'rgba(255,255,255,.28)';
    g.fillRect(-len * .56, -w * .34, len * .32, w * .16);
    a.fillRR(-len * .82, -w * .21, len * .24, w * .42, w * .2, '#98a0b6');
    g.beginPath();
    g.moveTo(-len * .70, 0); g.lineTo(-len * 1.02, -w * 1.2);
    g.lineTo(-len * .86, 0); g.lineTo(-len * 1.02, w * 1.2);
    g.closePath(); g.fillStyle = colFin; g.fill();
  }
  R('dart', {
    lives: 3,
    setup: function (a) {
      var Rr = Math.min(a.W * .30, a.H * .25);
      a.data.LO = { R: Rr, cx: a.W / 2, cy: a.H * .40, dart: Rr * .62, fly: a.mn * 1.7, sy: a.H - a.mn * .11 };
      a.data.rot = 0; a.data.sp = 1.4; a.data.stuck = []; a.data.fl = null;
      a.data.round = 1; a.data.need = 4; a.data.f = FRUITS[0]; a.data.pop = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.rot += d.sp * dt;
      if (d.pop > 0) d.pop -= dt;
      if (!d.fl) return;
      d.fl.y -= L.fly * dt;
      /* ปลายลูกดอกแตะขอบผลไม้ */
      if (d.fl.y <= L.cy + L.R) {
        var ang = ((Math.PI / 2 - d.rot) % 6.2832 + 6.2832) % 6.2832;
        var clash = d.stuck.some(function (s) { return angDiff(s, ang) < .30; });
        d.fl = null;
        if (clash) { a.beep(150, .25, 'square'); a.loseLife(); }
        else {
          d.stuck.push(ang); a.add(20); a.beep(900, .1); d.pop = .18;
          if (d.stuck.length >= d.need) {
            a.add(50); d.round++; d.stuck = []; d.sp *= 1.16;
            d.need = Math.min(8, d.need + 1); d.f = a.pick(FRUITS);
            a.beep(1200, .2, 'triangle');
          }
        }
      }
    },
    down: function (x, y, a) { if (!a.data.fl) { a.data.fl = { y: a.data.LO.sy }; a.beep(450, .05); } },
    draw: function (g, a) {
      a.bg('#2b0f4a', '#c81d6b');
      var d = a.data, L = d.LO;
      var R2 = L.R * (1 + (d.pop > 0 ? d.pop * .3 : 0));

      /* เส้นนำวิถี */
      g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = Math.max(1, a.mn * .004);
      g.setLineDash([a.mn * .02, a.mn * .03]);
      g.beginPath(); g.moveTo(L.cx, L.sy); g.lineTo(L.cx, L.cy + R2); g.stroke(); g.setLineDash([]);

      /* เงาใต้ผลไม้ */
      g.fillStyle = 'rgba(0,0,0,.22)';
      g.beginPath(); g.ellipse(L.cx, L.cy + R2 * 1.25, R2 * .78, R2 * .12, 0, 0, 6.2832); g.fill();

      drawFruit(g, a, L.cx, L.cy, R2, d.f, d.rot);

      /* ลูกดอกที่ปักอยู่ หมุนไปพร้อมผลไม้ ปลายจิ้มที่ขอบ */
      g.save(); g.translate(L.cx, L.cy); g.rotate(d.rot);
      d.stuck.forEach(function (s) {
        g.save(); g.rotate(s); g.translate(R2 * .95, 0); g.rotate(Math.PI);
        drawDart(g, a, L.dart, a.C.primary, a.C.accent);
        g.restore();
      });
      g.restore();

      /* ลูกดอกที่กำลังลอย (ปลายชี้ขึ้น) */
      if (d.fl) {
        g.save(); g.translate(L.cx, d.fl.y); g.rotate(-Math.PI / 2);
        drawDart(g, a, L.dart, a.C.primary, a.C.accent); g.restore();
      } else {
        g.save(); g.translate(L.cx, L.sy); g.rotate(-Math.PI / 2); g.globalAlpha = .5;
        drawDart(g, a, L.dart, a.C.primary, a.C.accent); g.globalAlpha = 1; g.restore();
      }

      a.text(a.txt({ th: 'รอบ ' + d.round + ' • ' + d.f.th + ' • ปักแล้ว ' + d.stuck.length + '/' + d.need, en: 'Round ' + d.round + ' • ' + d.f.en + ' • ' + d.stuck.length + '/' + d.need }),
        a.W / 2, a.H - a.mn * .04, a.mn * .038, 'rgba(255,255,255,.9)');
      a.head(a.txt({ th: 'แตะปาลูกดอกใส่ขอบผลไม้ • อย่าให้โดนลูกเดิม', en: 'Tap to throw at the rim • don\'t hit a stuck dart' }));
    }
  });

  /* ---------- 42 โยนขวดให้ตั้ง ---------- */
  function drawBottle(g, a, w, h, col, liq) {
    var bodyH = h * .66, neckH = h * .18, capH = h * .1;
    var top = -h / 2;
    /* น้ำในขวด */
    a.fillRR(-w / 2, top + neckH + capH + bodyH * .45, w, bodyH * .55, w * .22, liq);
    /* ตัวขวด (โปร่งแสงเล็กน้อย + ขอบเข้มให้เห็นชัดบนพื้นหลังทุกสี) */
    g.globalAlpha = .8;
    a.fillRR(-w / 2, top + neckH + capH, w, bodyH, w * .28, col);
    g.globalAlpha = 1;
    g.strokeStyle = 'rgba(12,32,48,.6)'; g.lineWidth = Math.max(1.5, w * .07);
    a.rr(-w / 2, top + neckH + capH, w, bodyH, w * .28); g.stroke();
    /* ฉลาก */
    a.fillRR(-w / 2, top + neckH + capH + bodyH * .22, w, bodyH * .24, w * .05, 'rgba(255,255,255,.9)');
    /* คอขวด */
    a.fillRR(-w * .22, top + capH, w * .44, neckH + w * .1, w * .12, col);
    /* ฝา */
    a.fillRR(-w * .26, top, w * .52, capH, w * .1, a.C.primary);
    /* ขอบขวด */
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = Math.max(1, w * .05);
    a.rr(-w / 2, top + neckH + capH, w, bodyH, w * .28); g.stroke();
  }
  R('bottleflip', {
    time: 0, lives: 3,
    setup: function (a) {
      var bw = a.mn * .085;
      a.data.LO = {
        bw: bw, bh: bw * 2.4, G: a.mn * 2.3,
        gy: a.H - a.mn * .07, sx: a.W * .17, ph: a.mn * .04, maxP: a.mn * .34
      };
      a.data.streak = 0; a.data.msg = ''; a.data.fx = 0; a.data.aim = null;
      newPad(a); resetBottle(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO, b = d.b;
      if (d.fx > 0) { d.fx -= dt; if (d.fx <= 0) d.msg = ''; }
      if (!b.fly) return;
      b.vy += L.G * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.rot += b.vrot * dt;
      var bottom = b.y + L.bh / 2;
      /* ลงบนแท่น */
      if (b.vy > 0 && bottom >= d.pad.y && bottom <= d.pad.y + L.ph + Math.abs(b.vy) * dt
        && b.x > d.pad.x - d.pad.w / 2 && b.x < d.pad.x + d.pad.w / 2) {
        land(a, true); return;
      }
      /* ตกพื้น */
      if (bottom >= L.gy) { land(a, false); return; }
      if (b.x < -L.bw * 2 || b.x > a.W + L.bw * 2) land(a, false);
    },
    down: function (x, y, a) { if (!a.data.b.fly) a.data.aim = { x: x, y: y }; },
    move: function (x, y, a) { if (a.data.aim) { a.data.aim.x = x; a.data.aim.y = y; } },
    up: function (x, y, a) {
      var d = a.data, L = d.LO; if (!d.aim || d.b.fly) { d.aim = null; return; }
      var v = flipV(a); d.aim = null;
      if (!v) return;
      d.b.vx = v.vx; d.b.vy = v.vy; d.b.vrot = v.vrot; d.b.fly = 1;
      a.beep(380, .08);
    },
    draw: function (g, a) {
      a.bg('#0b2033', '#1a5f7d');
      var d = a.data, L = d.LO, b = d.b;
      /* พื้น */
      g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(0, L.gy, a.W, a.H - L.gy);
      /* แท่นเป้าหมาย */
      a.fillRR(d.pad.x - d.pad.w / 2, d.pad.y, d.pad.w, L.ph, L.ph * .35, a.C.accent);
      a.fillRR(d.pad.x - d.pad.w / 2, d.pad.y + L.ph, d.pad.w * .18, a.H - d.pad.y - L.ph, 0, 'rgba(0,0,0,.22)');
      /* แท่นเริ่ม */
      a.fillRR(L.sx - L.bw * 1.3, L.gy - L.ph, L.bw * 2.6, L.ph, L.ph * .35, 'rgba(255,255,255,.35)');
      /* เส้นเล็งและแถบแรง */
      if (d.aim) {
        var v = flipV(a);
        if (v) {
          /* จุดนำวิถี วาดจนกว่าจะตกถึงพื้น จะได้เห็นว่าถึงแท่นหรือยัง */
          g.fillStyle = 'rgba(255,255,255,.75)';
          for (var t = .04; t < 3; t += .055) {
            var px = b.x + v.vx * t, py = b.y + v.vy * t + L.G * .5 * t * t;
            if (py > L.gy || px < -20 || px > a.W + 20) break;
            g.beginPath(); g.arc(px, py, a.mn * .008, 0, 6.2832); g.fill();
          }
          var bw2 = a.mn * .35, bx2 = (a.W - bw2) / 2;
          a.fillRR(bx2, a.mn * .13, bw2, a.mn * .026, a.mn * .013, 'rgba(0,0,0,.35)');
          a.fillRR(bx2, a.mn * .13, bw2 * v.p, a.mn * .026, a.mn * .013, a.C.accent);
        }
      }
      g.save(); g.translate(b.x, b.y); g.rotate(b.rot);
      drawBottle(g, a, L.bw, L.bh, '#eaf8ff', a.C.secondary);
      g.restore();
      if (d.msg) a.text(d.msg, a.W / 2, a.H * .28, a.mn * .06, d.ok ? a.C.good : a.C.bad);
      a.text(a.txt({ th: 'ลงตั้งติดกัน ' + d.streak + ' ครั้ง', en: 'Streak ' + d.streak }),
        a.W / 2, a.H - a.mn * .03, a.mn * .036, 'rgba(255,255,255,.85)');
      a.head(a.txt({ th: 'ลากขึ้นจากขวดแล้วปล่อย ให้ขวดลงตั้งบนแท่น', en: 'Drag upward from the bottle and land it upright' }));
    }
  });
  function flipV(a) {
    var d = a.data, L = d.LO;
    var dx = d.aim.x - d.b.x, dy = d.aim.y - d.b.y, len = Math.hypot(dx, dy);
    if (len < a.mn * .05 || dy > -a.mn * .02) return null;
    var p = Math.min(1, len / L.maxP);
    var sp = a.mn * (.70 + p * 1.30);
    return { vx: dx / len * sp, vy: dy / len * sp, vrot: (4 + p * 10) * (dx >= 0 ? 1 : -1), p: p };
  }
  /* วางแท่นโดยอิงจากจุดเริ่มต้นของขวด ไม่ให้ไกล/สูงเกินกว่าที่แรงสูงสุดจะไปถึง */
  function newPad(a) {
    var d = a.data, L = d.LO;
    var w = Math.max(a.mn * .12, a.mn * .28 - d.streak * a.mn * .012);
    var startY = L.gy - L.ph - L.bh / 2;
    var x = L.sx + a.rnd(a.W * .26, a.W * .52);
    x = Math.min(x, a.W - w / 2 - a.mn * .04);
    d.pad = { x: x, y: startY - a.rnd(a.mn * .10, a.mn * .40), w: w };
  }
  function resetBottle(a) {
    var L = a.data.LO;
    a.data.b = { x: L.sx, y: L.gy - L.ph - L.bh / 2, vx: 0, vy: 0, rot: 0, vrot: 0, fly: 0 };
  }
  function land(a, onPad) {
    var d = a.data, b = d.b;
    var r = ((b.rot % 6.2832) + 6.2832 + Math.PI) % 6.2832 - Math.PI;   /* ปรับให้อยู่ช่วง -π..π */
    var upright = Math.abs(r) < .50;
    b.fly = 0; b.vrot = 0;
    if (onPad && upright) {
      d.streak++; a.add(50 + d.streak * 10); d.ok = 1;
      d.msg = a.txt({ th: 'ตั้งได้! +' + (50 + d.streak * 10), en: 'Stuck it! +' + (50 + d.streak * 10) });
      a.beep(1150, .25, 'triangle'); d.fx = 1.0;
      newPad(a); resetBottle(a);
    } else {
      d.ok = 0; d.streak = 0;
      d.msg = onPad ? a.txt({ th: 'ล้ม!', en: 'Tipped over!' }) : a.txt({ th: 'ไม่ถึงแท่น', en: 'Missed the platform' });
      a.beep(170, .3, 'square'); d.fx = 1.0;
      if (a.loseLife() > 0) resetBottle(a);
    }
  }

  /* ---------- 43 ยิงจุดโทษ ---------- */
  R('penalty', {
    time: 0, lives: 3,
    setup: function (a) {
      var gw = Math.min(a.W * .8, a.mn * .9);
      a.data.LO = { gw: gw, gx: (a.W - gw) / 2, gy: a.H * .16, gh: a.mn * .28, bx: a.W / 2, by: a.H - a.mn * .15, br: a.mn * .04, kw: gw * .22 };
      a.data.aim = null; a.data.ball = null; a.data.kx = a.W / 2; a.data.msg = ''; a.data.fx = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (d.fx > 0) { d.fx -= dt; if (d.fx <= 0) { d.msg = ''; d.ball = null; } }
      if (!d.ball || d.fx > 0) return;
      d.ball.x += d.ball.vx * dt; d.ball.y += d.ball.vy * dt;
      d.kx += (d.ball.tk - d.kx) * Math.min(1, dt * 6);
      if (d.ball.y <= L.gy + L.gh) {
        var inGoal = d.ball.x > L.gx && d.ball.x < L.gx + L.gw;
        var saved = Math.abs(d.ball.x - d.kx) < L.kw / 2 + L.br;
        if (inGoal && !saved) { a.add(50); d.msg = a.txt({ th: 'ประตู! +50', en: 'GOAL! +50' }); a.beep(1100, .25, 'triangle'); }
        else { d.msg = saved ? a.txt({ th: 'เซฟไว้ได้', en: 'Saved!' }) : a.txt({ th: 'ออกนอกกรอบ', en: 'Off target' }); a.beep(180, .25, 'square'); a.loseLife(); }
        d.fx = 1.1;
      }
    },
    down: function (x, y, a) { if (!a.data.ball) a.data.aim = { x: x, y: y }; },
    move: function (x, y, a) { if (a.data.aim) { a.data.aim.x = x; a.data.aim.y = y; } },
    up: function (x, y, a) {
      var d = a.data, L = d.LO; if (!d.aim || d.ball) { d.aim = null; return; }
      var dx = d.aim.x - L.bx, dy = d.aim.y - L.by;
      if (dy > -a.mn * .08) { d.aim = null; return; }
      var t = .9, sp = a.mn * 1.5;
      var len = Math.hypot(dx, dy);
      d.ball = { x: L.bx, y: L.by, vx: dx / len * sp, vy: dy / len * sp, tk: L.gx + L.gw * a.pick([.2, .5, .8]) };
      d.aim = null; a.beep(320, .1);
    },
    draw: function (g, a) {
      a.bg('#1c5e2f', '#8fd14f');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(255,255,255,.9)';
      a.fillRR(L.gx - a.mn * .012, L.gy, a.mn * .024, L.gh, 0, '#fff');
      a.fillRR(L.gx + L.gw - a.mn * .012, L.gy, a.mn * .024, L.gh, 0, '#fff');
      a.fillRR(L.gx - a.mn * .012, L.gy, L.gw + a.mn * .024, a.mn * .024, 0, '#fff');
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.5;
      for (var i = 1; i < 10; i++) {
        g.beginPath(); g.moveTo(L.gx + L.gw / 10 * i, L.gy); g.lineTo(L.gx + L.gw / 10 * i, L.gy + L.gh); g.stroke();
      }
      a.fillRR(d.kx - L.kw / 2, L.gy + L.gh * .25, L.kw, L.gh * .7, a.mn * .02, a.C.accent);
      EM(g, '🧤', d.kx, L.gy + L.gh * .55, a.mn * .07);
      if (d.aim) {
        g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = a.mn * .008; g.setLineDash([10, 8]);
        g.beginPath(); g.moveTo(L.bx, L.by); g.lineTo(d.aim.x, d.aim.y); g.stroke(); g.setLineDash([]);
      }
      var bx = d.ball ? d.ball.x : L.bx, by = d.ball ? d.ball.y : L.by;
      EM(g, '⚽', bx, by, L.br * 2.2);
      if (d.msg) a.text(d.msg, a.W / 2, a.H * .58, a.mn * .07, a.C.accent);
      a.head(a.txt({ th: 'ลากเล็งมุมประตูแล้วปล่อย', en: 'Drag toward a corner and release' }));
    }
  });

  /* ---------- 44 พัตต์กอล์ฟ ---------- */
  R('golfputt', {
    time: 0,
    setup: function (a) { a.data.lv = 1; a.data.shots = 0; mkHole(a); a.data.aim = null; },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      var sp = Math.hypot(d.vx, d.vy);
      if (sp < a.mn * .02) { d.vx = 0; d.vy = 0; return; }
      d.x += d.vx * dt; d.y += d.vy * dt;
      d.vx *= Math.pow(.28, dt); d.vy *= Math.pow(.28, dt);
      if (d.x < L.pad + L.r) { d.x = L.pad + L.r; d.vx = Math.abs(d.vx) * .8; }
      if (d.x > a.W - L.pad - L.r) { d.x = a.W - L.pad - L.r; d.vx = -Math.abs(d.vx) * .8; }
      if (d.y < L.top + L.r) { d.y = L.top + L.r; d.vy = Math.abs(d.vy) * .8; }
      if (d.y > a.H - L.pad - L.r) { d.y = a.H - L.pad - L.r; d.vy = -Math.abs(d.vy) * .8; }
      d.obs.forEach(function (o) {
        if (d.x > o.x - L.r && d.x < o.x + o.w + L.r && d.y > o.y - L.r && d.y < o.y + o.h + L.r) {
          var ox = Math.min(Math.abs(d.x - o.x), Math.abs(d.x - o.x - o.w));
          var oy = Math.min(Math.abs(d.y - o.y), Math.abs(d.y - o.y - o.h));
          if (ox < oy) { d.vx *= -.8; d.x += d.vx > 0 ? L.r : -L.r; } else { d.vy *= -.8; d.y += d.vy > 0 ? L.r : -L.r; }
          a.beep(300, .05);
        }
      });
      if (Math.hypot(d.x - d.hx, d.y - d.hy) < L.hr * .8 && sp < a.mn * .9) {
        a.add(Math.max(20, 150 - d.shots * 25)); a.beep(1200, .3, 'triangle');
        d.lv++; d.shots = 0; mkHole(a);
      }
    },
    down: function (x, y, a) { if (!Math.hypot(a.data.vx, a.data.vy)) a.data.aim = { x: x, y: y }; },
    move: function (x, y, a) { if (a.data.aim) { a.data.aim.x = x; a.data.aim.y = y; } },
    /* เล็งแบบ "ลากไปทางที่อยากให้ลูกวิ่ง" ยิ่งลากไกลยิ่งแรง */
    up: function (x, y, a) {
      var d = a.data; if (!d.aim) return;
      var dx = d.aim.x - d.x, dy = d.aim.y - d.y, len = Math.hypot(dx, dy);
      if (len > a.mn * .03) {
        var p = Math.min(1, len / (a.mn * .45));
        d.vx = dx / len * a.mn * 1.5 * p; d.vy = dy / len * a.mn * 1.5 * p;
        d.shots++; a.beep(420, .08);
      }
      d.aim = null;
    },
    draw: function (g, a) {
      a.bg('#1c6b34', '#3ba05a');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(255,255,255,.08)';
      for (var i = 0; i < 20; i++) g.fillRect(0, L.top + i * (a.H / 20), a.W, 2);
      d.obs.forEach(function (o) { a.fillRR(o.x, o.y, o.w, o.h, a.mn * .012, '#7a4a12'); });
      a.circle(d.hx, d.hy, L.hr, '#12331d');
      g.strokeStyle = '#fff'; g.lineWidth = a.mn * .008;
      g.beginPath(); g.moveTo(d.hx, d.hy); g.lineTo(d.hx, d.hy - a.mn * .12); g.stroke();
      g.beginPath(); g.moveTo(d.hx, d.hy - a.mn * .12); g.lineTo(d.hx + a.mn * .07, d.hy - a.mn * .10);
      g.lineTo(d.hx, d.hy - a.mn * .08); g.closePath(); g.fillStyle = a.C.bad; g.fill();
      if (d.aim) {
        var dx = d.aim.x - d.x, dy = d.aim.y - d.y, len = Math.hypot(dx, dy) || 1;
        var p = Math.min(1, len / (a.mn * .45));
        var ex = d.x + dx / len * (a.mn * .45) * p, ey = d.y + dy / len * (a.mn * .45) * p;
        g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = a.mn * .008; g.setLineDash([a.mn * .018, a.mn * .014]);
        g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(ex, ey); g.stroke(); g.setLineDash([]);
        /* หัวลูกศรบอกทิศที่ลูกจะวิ่ง */
        var an = Math.atan2(dy, dx), hs = a.mn * .035;
        g.save(); g.translate(ex, ey); g.rotate(an);
        g.beginPath(); g.moveTo(hs, 0); g.lineTo(-hs * .5, -hs * .55); g.lineTo(-hs * .5, hs * .55);
        g.closePath(); g.fillStyle = a.C.accent; g.fill(); g.restore();
        var bw = a.mn * .3, bx = (a.W - bw) / 2;
        a.fillRR(bx, a.mn * .12, bw, a.mn * .024, a.mn * .012, 'rgba(0,0,0,.35)');
        a.fillRR(bx, a.mn * .12, bw * p, a.mn * .024, a.mn * .012, a.C.accent);
      }
      a.circle(d.x, d.y, L.r, '#fff');
      a.head(a.txt({ th: 'หลุมที่ ' + d.lv + ' • ลากไปทางที่อยากให้ลูกวิ่ง • ตีไปแล้ว ' + d.shots + ' ครั้ง', en: 'Hole ' + d.lv + ' • drag toward the target • ' + d.shots + ' putts' }));
    }
  });
  function mkHole(a) {
    var d = a.data;
    d.LO = { r: a.mn * .028, hr: a.mn * .045, pad: a.mn * .04, top: a.mn * .14 };
    d.x = a.W / 2; d.y = a.H - a.mn * .14; d.vx = 0; d.vy = 0;
    d.hx = a.rnd(a.W * .25, a.W * .75); d.hy = a.rnd(d.LO.top + a.mn * .1, a.H * .42);
    d.obs = [];
    var n = Math.min(4, d.lv);
    for (var i = 0; i < n; i++) {
      var w = a.rnd(a.mn * .12, a.mn * .3), h = a.mn * .045;
      if (Math.random() < .5) { var t = w; w = h; h = t; }
      d.obs.push({ x: a.rnd(a.mn * .06, a.W - w - a.mn * .06), y: a.rnd(a.H * .3, a.H * .74), w: w, h: h });
    }
  }

  /* ---------- 45 หนังสติ๊ก ---------- */
  R('slingshot', {
    time: 0,
    setup: function (a) {
      a.data.LO = { ox: a.W * .14, oy: a.H - a.mn * .22, r: a.mn * .035, G: a.mn * 1.5, gy: a.H - a.mn * .08 };
      a.data.lv = 1; a.data.shots = 5; a.data.aim = null; a.data.b = null; mkCrates(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (!d.b) return;
      d.b.vy += L.G * dt; d.b.x += d.b.vx * dt; d.b.y += d.b.vy * dt;
      for (var i = d.cr.length - 1; i >= 0; i--) {
        var c = d.cr[i];
        if (d.b.x > c.x - L.r && d.b.x < c.x + c.s + L.r && d.b.y > c.y - L.r && d.b.y < c.y + c.s + L.r) {
          /* ทำลายกล่องที่โดนและกล่องรอบ ๆ */
          var hitX = c.x + c.s / 2, hitY = c.y + c.s / 2;
          for (var k = d.cr.length - 1; k >= 0; k--) {
            var q = d.cr[k];
            if (Math.hypot(q.x + q.s / 2 - hitX, q.y + q.s / 2 - hitY) < q.s * 1.4) { d.cr.splice(k, 1); a.add(20); }
          }
          a.beep(300, .18, 'square'); d.b = null;
          if (!d.cr.length) { a.add(80); d.lv++; d.shots = 5; mkCrates(a); a.beep(1200, .25, 'triangle'); }
          return;
        }
      }
      if (d.b.y > L.gy || d.b.x > a.W + L.r * 3) {
        d.b = null;
        if (--d.shots <= 0 && d.cr.length) a.end(a.txt({ th: 'กระสุนหมด', en: 'Out of ammo' }));
      }
    },
    down: function (x, y, a) { if (!a.data.b) a.data.aim = { x: x, y: y }; },
    move: function (x, y, a) { if (a.data.aim) { a.data.aim.x = x; a.data.aim.y = y; } },
    up: function (x, y, a) {
      var d = a.data, L = d.LO; if (!d.aim || d.b) { d.aim = null; return; }
      var dx = L.ox - d.aim.x, dy = L.oy - d.aim.y, len = Math.hypot(dx, dy);
      if (len > a.mn * .04) {
        var p = Math.min(1, len / (a.mn * .35));
        d.b = { x: L.ox, y: L.oy, vx: dx / len * a.mn * 1.7 * p, vy: dy / len * a.mn * 1.7 * p };
        a.beep(280, .1);
      }
      d.aim = null;
    },
    draw: function (g, a) {
      a.bg('#3c1a6b', '#c85a1e');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(0, L.gy, a.W, a.H - L.gy);
      d.cr.forEach(function (c) { a.fillRR(c.x, c.y, c.s, c.s, c.s * .12, c.col); });
      g.strokeStyle = '#7a4a12'; g.lineWidth = a.mn * .018;
      g.beginPath(); g.moveTo(L.ox - a.mn * .04, L.gy); g.lineTo(L.ox, L.oy);
      g.moveTo(L.ox + a.mn * .04, L.gy); g.lineTo(L.ox, L.oy); g.stroke();
      if (d.aim) {
        var dx = L.ox - d.aim.x, dy = L.oy - d.aim.y, len = Math.hypot(dx, dy);
        var p = Math.min(1, len / (a.mn * .35));
        var vx = dx / len * a.mn * 1.7 * p, vy = dy / len * a.mn * 1.7 * p;
        g.fillStyle = 'rgba(255,255,255,.7)';
        for (var t = .05; t < 1.3; t += .08) {
          g.beginPath(); g.arc(L.ox + vx * t, L.oy + vy * t + L.G * .5 * t * t, a.mn * .008, 0, 6.29); g.fill();
        }
      }
      var bx = d.b ? d.b.x : L.ox, by = d.b ? d.b.y : L.oy;
      a.circle(bx, by, L.r, a.C.accent);
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' • เหลือ ' + d.shots + ' นัด', en: 'Level ' + d.lv + ' • ' + d.shots + ' shots left' }));
    }
  });
  function mkCrates(a) {
    var d = a.data, s = a.mn * .075, cols = ['#ff6a3d', '#ffd23f', '#2fe08a', '#00d4ff'];
    d.cr = [];
    var baseX = a.W * .62, rows = 3 + Math.min(3, d.lv);
    for (var r = 0; r < rows; r++) for (var c = 0; c < 3; c++) {
      if (Math.random() < .15) continue;
      d.cr.push({ x: baseX + c * s * 1.05, y: d.LO.gy - (r + 1) * s * 1.05, s: s, col: cols[(r + c) % 4] });
    }
  }

  /* ---------- 46 ยิงปืนใหญ่ ---------- */
  R('cannonball', {
    setup: function (a) {
      a.data.LO = { cx: a.W * .12, cy: a.H - a.mn * .16, gy: a.H - a.mn * .10, wallX: a.W * .48, G: a.mn * 1.4 };
      a.data.st = 'angle'; a.data.ang = 0; a.data.pow = 0; a.data.dir = 1;
      a.data.wallH = a.mn * .3; a.data.tx = a.W * .78; a.data.b = null; a.data.msg = ''; a.data.fx = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (d.fx > 0) { d.fx -= dt; if (d.fx <= 0) d.msg = ''; }
      if (d.st === 'angle') { d.ang += dt * 1.4 * d.dir; if (d.ang > 1.35) d.dir = -1; if (d.ang < .12) d.dir = 1; }
      else if (d.st === 'pow') { d.pow += dt * 1.6 * d.dir; if (d.pow > 1) d.dir = -1; if (d.pow < .1) d.dir = 1; }
      else if (d.b) {
        d.b.vy += L.G * dt; d.b.x += d.b.vx * dt; d.b.y += d.b.vy * dt;
        if (d.b.x > L.wallX - a.mn * .02 && d.b.x < L.wallX + a.mn * .02 && d.b.y > L.gy - d.wallH) {
          d.msg = a.txt({ th: 'ชนกำแพง', en: 'Hit the wall' }); a.beep(160, .25, 'square'); d.b = null; d.st = 'angle'; d.fx = .8; return;
        }
        if (d.b.y > L.gy) {
          if (Math.abs(d.b.x - d.tx) < a.mn * .07) {
            a.add(40); d.msg = a.txt({ th: 'โดนเป้า! +40', en: 'Direct hit! +40' }); a.beep(1100, .25, 'triangle');
            d.tx = Math.min(a.W - a.mn * .1, d.tx + a.mn * .05); d.wallH = Math.min(a.mn * .45, d.wallH + a.mn * .02);
          } else { d.msg = a.txt({ th: 'พลาด', en: 'Miss' }); a.beep(200, .2, 'square'); }
          d.b = null; d.st = 'angle'; d.fx = .8;
        }
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.st === 'angle') { d.st = 'pow'; d.pow = .1; d.dir = 1; a.beep(500, .05); }
      else if (d.st === 'pow') {
        d.st = 'fly';
        var sp = a.mn * (.9 + d.pow * 1.35);
        d.b = { x: L.cx, y: L.cy, vx: Math.cos(d.ang) * sp, vy: -Math.sin(d.ang) * sp };
        a.beep(180, .2, 'sawtooth');
      }
    },
    draw: function (g, a) {
      a.bg('#3a0f5e', '#c81d6b');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, L.gy, a.W, a.H - L.gy);
      a.fillRR(L.wallX - a.mn * .02, L.gy - d.wallH, a.mn * .04, d.wallH, a.mn * .008, '#8d8d9e');
      a.circle(d.tx, L.gy - a.mn * .03, a.mn * .05, a.C.accent);
      a.circle(d.tx, L.gy - a.mn * .03, a.mn * .025, a.C.bad);
      g.save(); g.translate(L.cx, L.cy); g.rotate(-d.ang);
      a.fillRR(0, -a.mn * .022, a.mn * .13, a.mn * .044, a.mn * .01, '#3a3a4e'); g.restore();
      a.circle(L.cx, L.cy, a.mn * .04, '#22222e');
      if (d.b) a.circle(d.b.x, d.b.y, a.mn * .022, '#1b1442');
      /* แถบมุมและแถบแรง */
      var bw = a.W * .34, bx = a.W - bw - a.mn * .05, bh = a.mn * .035;
      a.fillRR(bx, a.mn * .13, bw, bh, bh / 2, 'rgba(0,0,0,.35)');
      a.fillRR(bx, a.mn * .13, bw * (d.ang / 1.45), bh, bh / 2, a.C.secondary);
      a.fillRR(bx, a.mn * .19, bw, bh, bh / 2, 'rgba(0,0,0,.35)');
      a.fillRR(bx, a.mn * .19, bw * d.pow, bh, bh / 2, a.C.accent);
      a.text(a.txt({ th: 'มุม', en: 'ANGLE' }), bx - a.mn * .04, a.mn * .13 + bh / 2, a.mn * .03, '#fff', 'right');
      a.text(a.txt({ th: 'แรง', en: 'POWER' }), bx - a.mn * .04, a.mn * .19 + bh / 2, a.mn * .03, '#fff', 'right');
      if (d.msg) a.text(d.msg, a.W / 2, a.H * .42, a.mn * .06, a.C.accent);
      a.head(d.st === 'angle' ? a.txt({ th: 'แตะล็อกมุม', en: 'Tap to lock the angle' })
        : d.st === 'pow' ? a.txt({ th: 'แตะล็อกแรงแล้วยิง', en: 'Tap to lock power and fire' })
          : a.txt({ th: 'กำลังบิน…', en: 'In flight…' }));
    }
  });

  /* ---------- 47 ตกปลา ---------- */
  R('fishing', {
    setup: function (a) {
      a.data.LO = { top: a.H * .22, bx: a.W / 2, hr: a.mn * .03, spd: a.mn * .95 };
      a.data.f = []; a.data.hook = null; a.data.sp = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.sp -= dt;
      if (d.sp <= 0) {
        var bad = Math.random() < .25;
        var big = Math.random() < .3;
        var dir = Math.random() < .5 ? 1 : -1;
        d.f.push({
          x: dir > 0 ? -a.mn * .1 : a.W + a.mn * .1, y: a.rnd(L.top + a.mn * .1, a.H - a.mn * .08),
          v: dir * a.rnd(a.mn * .12, a.mn * .3), s: big ? a.mn * .10 : a.mn * .07,
          e: bad ? a.pick(['🐡', '🥾', '🗑️']) : (big ? a.pick(['🐟', '🐠']) : a.pick(['🐟', '🦐', '🐙'])),
          p: bad ? -20 : (big ? 40 : 20), dir: dir
        });
        d.sp = a.rnd(.4, .9);
      }
      d.f.forEach(function (o) { o.x += o.v * dt; });
      d.f = d.f.filter(function (o) { return o.x > -a.mn * .25 && o.x < a.W + a.mn * .25; });
      if (d.hook) {
        d.hook.y += d.hook.dir * L.spd * dt;
        if (d.hook.dir > 0) {
          for (var i = d.f.length - 1; i >= 0; i--) {
            var o = d.f[i];
            if (Math.hypot(o.x - L.bx, o.y - d.hook.y) < o.s * .6 + L.hr) {
              d.hook.dir = -1; d.hook.catch = o; d.f.splice(i, 1);
              a.beep(o.p > 0 ? 900 : 180, .12, o.p > 0 ? 'sine' : 'square'); break;
            }
          }
          if (d.hook.y > a.H - a.mn * .04) d.hook.dir = -1;
        } else if (d.hook.y <= L.top) {
          if (d.hook.catch) a.add(d.hook.catch.p);
          d.hook = null;
        }
      }
    },
    down: function (x, y, a) { if (!a.data.hook) { a.data.hook = { y: a.data.LO.top, dir: 1, catch: null }; a.beep(420, .06); } },
    draw: function (g, a) {
      a.bg('#0a2a4e', '#0d6f8f');
      var d = a.data, L = d.LO;
      g.fillStyle = '#7ec8ff'; g.fillRect(0, 0, a.W, L.top);
      g.fillStyle = 'rgba(255,255,255,.12)';
      for (var i = 0; i < 6; i++) g.fillRect(0, L.top + i * (a.H / 6), a.W, a.mn * .004);
      EM(g, '🚤', L.bx, L.top - a.mn * .05, a.mn * .12);
      d.f.forEach(function (o) {
        g.save(); g.translate(o.x, o.y); if (o.dir > 0) g.scale(-1, 1); EM(g, o.e, 0, 0, o.s); g.restore();
      });
      if (d.hook) {
        g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(L.bx, L.top); g.lineTo(L.bx, d.hook.y); g.stroke();
        /* ตะขอวาดด้วยโค้ด ไม่ใช้อีโมจิ (ฟอนต์บางเครื่องไม่มี) */
        g.strokeStyle = '#e2e6f2'; g.lineWidth = Math.max(2, L.hr * .45); g.lineCap = 'round';
        g.beginPath(); g.arc(L.bx, d.hook.y, L.hr * .75, -Math.PI * .15, Math.PI * .95); g.stroke();
        if (d.hook.catch) EM(g, d.hook.catch.e, L.bx + a.mn * .05, d.hook.y, d.hook.catch.s);
      }
      a.head(a.txt({ th: 'แตะหย่อนเบ็ด • เลี่ยงขยะและปลาปักเป้า', en: 'Tap to drop the hook • avoid trash' }));
    }
  });

  /* ---------- 48 ตู้คีบตุ๊กตา ---------- */
  R('cranegrab', {
    time: 0,
    setup: function (a) {
      a.data.LO = { top: a.mn * .16, floor: a.H - a.mn * .12, cw: a.mn * .09 };
      a.data.cx = a.W * .2; a.data.dir = 1; a.data.st = 'move'; a.data.cy = a.data.LO.top;
      a.data.tries = 5; a.data.hold = null; a.data.msg = '';
      a.data.items = [];
      var e = ['🧸', '🐰', '🐤', '🐼', '🦄', '🐙'];
      for (var i = 0; i < 6; i++)
        a.data.items.push({ x: a.W * (.14 + i * .145), y: a.data.LO.floor - a.mn * .05, e: e[i], got: 0 });
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (d.st === 'move') { d.cx += d.dir * a.mn * .42 * dt; if (d.cx > a.W * .88) d.dir = -1; if (d.cx < a.W * .12) d.dir = 1; }
      else if (d.st === 'down') {
        d.cy += a.mn * .5 * dt;
        if (d.cy >= L.floor - a.mn * .07) {
          d.st = 'up';
          var best = null, bd = 1e9;
          d.items.forEach(function (o) { if (o.got) return; var dd = Math.abs(o.x - d.cx); if (dd < bd) { bd = dd; best = o; } });
          if (best && bd < L.cw * .8 && Math.random() < .75) { d.hold = best; best.got = 1; a.beep(1000, .2, 'triangle'); d.msg = a.txt({ th: 'คีบติด!', en: 'Got it!' }); }
          else { a.beep(200, .2, 'square'); d.msg = a.txt({ th: 'พลาด', en: 'Missed' }); d.tries--; }
        }
      } else if (d.st === 'up') {
        d.cy -= a.mn * .5 * dt;
        if (d.hold) { d.hold.x = d.cx; d.hold.y = d.cy + a.mn * .07; }
        if (d.cy <= L.top) {
          d.cy = L.top;
          if (d.hold) { a.add(50); d.hold = null; }
          d.st = 'move';
          if (d.tries <= 0 || d.items.every(function (o) { return o.got; }))
            a.end(a.txt({ th: 'จบเกม', en: 'Game over' }));
        }
      }
    },
    down: function (x, y, a) { if (a.data.st === 'move') { a.data.st = 'down'; a.beep(400, .07); } },
    draw: function (g, a) {
      a.bg('#5b1064', '#ff2e88');
      var d = a.data, L = d.LO;
      a.fillRR(a.mn * .04, L.top - a.mn * .05, a.W - a.mn * .08, L.floor - L.top + a.mn * .1, a.mn * .03, 'rgba(255,255,255,.10)');
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(a.mn * .04, L.floor, a.W - a.mn * .08, a.H - L.floor - a.mn * .02);
      d.items.forEach(function (o) { if (!o.got || d.hold === o) EM(g, o.e, o.x, o.y, a.mn * .1); });
      g.strokeStyle = '#ddd'; g.lineWidth = a.mn * .008;
      g.beginPath(); g.moveTo(d.cx, L.top - a.mn * .05); g.lineTo(d.cx, d.cy); g.stroke();
      g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .014;
      g.beginPath(); g.moveTo(d.cx - L.cw / 2, d.cy + L.cw * .6); g.lineTo(d.cx, d.cy); g.lineTo(d.cx + L.cw / 2, d.cy + L.cw * .6); g.stroke();
      a.text(a.txt({ th: 'เหลือ ' + Math.max(0, d.tries) + ' สิทธิ์  ' + d.msg, en: Math.max(0, d.tries) + ' tries left  ' + d.msg }),
        a.W / 2, a.H - a.mn * .05, a.mn * .04, '#fff');
      a.head(a.txt({ th: 'แตะเพื่อหยุดและคีบ', en: 'Tap to stop and grab' }));
    }
  });

  /* ---------- 49 โยนห่วง ---------- */
  R('ringtoss', {
    setup: function (a) {
      a.data.LO = { ox: a.W / 2, oy: a.H - a.mn * .12, G: a.mn * 1.5 };
      a.data.pegs = []; a.data.aim = null; a.data.r = null; a.data.left = 10; a.data.msg = '';
      for (var i = 0; i < 5; i++)
        a.data.pegs.push({ x: a.W * (.18 + i * .16), y: a.H * (.30 + (i % 2) * .08), on: 0, p: 20 + i * 10 });
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (!d.r) return;
      d.r.vy += L.G * dt; d.r.x += d.r.vx * dt; d.r.y += d.r.vy * dt;
      for (var i = 0; i < d.pegs.length; i++) {
        var p = d.pegs[i];
        if (!p.on && Math.hypot(p.x - d.r.x, p.y - d.r.y) < a.mn * .045 && d.r.vy > 0) {
          p.on = 1; a.add(p.p); d.msg = '+' + p.p; a.beep(1000, .15, 'triangle'); d.r = null;
          if (d.pegs.every(function (q) { return q.on; })) { a.add(100); d.pegs.forEach(function (q) { q.on = 0; }); }
          return;
        }
      }
      if (d.r.y > a.H + a.mn * .08 || d.r.x < -a.mn * .1 || d.r.x > a.W + a.mn * .1) {
        d.r = null; d.msg = a.txt({ th: 'พลาด', en: 'Miss' });
        if (--d.left <= 0) a.end(a.txt({ th: 'ห่วงหมดแล้ว', en: 'Out of rings' }));
      }
    },
    down: function (x, y, a) { if (!a.data.r) a.data.aim = { x: x, y: y }; },
    move: function (x, y, a) { if (a.data.aim) { a.data.aim.x = x; a.data.aim.y = y; } },
    up: function (x, y, a) {
      var d = a.data, L = d.LO; if (!d.aim || d.r) { d.aim = null; return; }
      var dx = d.aim.x - L.ox, dy = d.aim.y - L.oy, len = Math.hypot(dx, dy);
      if (len > a.mn * .05 && dy < 0) {
        var p = Math.min(1, len / (a.mn * .5));
        d.r = { x: L.ox, y: L.oy, vx: dx / len * a.mn * 1.5 * p, vy: dy / len * a.mn * 1.5 * p };
        a.beep(380, .07);
      }
      d.aim = null;
    },
    draw: function (g, a) {
      a.bg('#1b3a6b', '#2fa86f');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, a.H * .42, a.W, a.H - a.H * .42);
      d.pegs.forEach(function (p) {
        a.fillRR(p.x - a.mn * .012, p.y - a.mn * .09, a.mn * .024, a.mn * .09, a.mn * .01, '#c9a227');
        a.circle(p.x, p.y, a.mn * .022, '#8a6a12');
        if (p.on) { g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .012; g.beginPath(); g.ellipse(p.x, p.y - a.mn * .01, a.mn * .045, a.mn * .018, 0, 0, 6.29); g.stroke(); }
        a.text(p.p + '', p.x, p.y + a.mn * .05, a.mn * .032, 'rgba(255,255,255,.8)');
      });
      if (d.aim) {
        g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = a.mn * .006; g.setLineDash([9, 7]);
        g.beginPath(); g.moveTo(L.ox, L.oy); g.lineTo(d.aim.x, d.aim.y); g.stroke(); g.setLineDash([]);
      }
      var rx = d.r ? d.r.x : L.ox, ry = d.r ? d.r.y : L.oy;
      g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .014;
      g.beginPath(); g.ellipse(rx, ry, a.mn * .045, a.mn * .020, 0, 0, 6.29); g.stroke();
      a.text(a.txt({ th: 'เหลือ ' + d.left + ' ห่วง  ' + d.msg, en: d.left + ' rings left  ' + d.msg }),
        a.W / 2, a.H - a.mn * .04, a.mn * .04, '#fff');
      a.head(a.txt({ th: 'ลากขึ้นเพื่อเล็งแล้วปล่อย', en: 'Drag upward to aim and release' }));
    }
  });

  /* ---------- 50 ปาขวาน ---------- */
  R('axethrow', {
    lives: 3,
    setup: function (a) {
      var Rr = Math.min(a.W * .28, a.H * .24);
      a.data.LO = { R: Rr, cx: a.W / 2, cy: a.H * .34, fly: a.mn * 1.5, sy: a.H - a.mn * .14 };
      a.data.ax = null; a.data.rot = 0; a.data.stuck = []; a.data.wob = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.wob += dt * 2.2;
      d.rot += dt * 9;
      if (!d.ax) return;
      d.ax.y -= L.fly * dt; d.ax.rot += dt * 16;
      if (d.ax.y <= L.cy) {
        var off = Math.abs(d.ax.x - L.cx) + Math.abs(d.ax.y - L.cy);
        var dist = Math.hypot(d.ax.x - L.cx, L.cy - L.cy);
        dist = Math.abs(d.ax.x - L.cx);
        var p = dist < L.R * .18 ? 50 : (dist < L.R * .5 ? 20 : (dist < L.R ? 10 : 0));
        if (p) { a.add(p); d.stuck.push({ x: d.ax.x, y: L.cy + a.rnd(-L.R * .2, L.R * .2) }); a.beep(p === 50 ? 1200 : 800, .14); }
        else { a.beep(150, .25, 'square'); a.loseLife(); }
        d.ax = null;
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (!d.ax) { d.ax = { x: L.cx + Math.sin(d.wob) * L.R * 1.1, y: L.sy, rot: 0 }; a.beep(400, .06); }
    },
    draw: function (g, a) {
      a.bg('#2b1a0e', '#7a4a12');
      var d = a.data, L = d.LO;
      a.fillRR(L.cx - L.R * 1.15, L.cy - L.R * 1.15, L.R * 2.3, L.R * 2.3, L.R * .08, '#8d5a3b');
      g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2;
      for (var i = 0; i < 8; i++) {
        g.beginPath(); g.moveTo(L.cx - L.R * 1.15, L.cy - L.R * 1.15 + i * L.R * .29);
        g.lineTo(L.cx + L.R * 1.15, L.cy - L.R * 1.15 + i * L.R * .29); g.stroke();
      }
      var cols = ['#f4efe6', '#00d4ff', '#ff2e88', '#ffd23f'];
      var rad = [1, .55, .28, .12];
      for (var k = 0; k < 4; k++) a.circle(L.cx, L.cy, L.R * rad[k], cols[k]);
      d.stuck.forEach(function (s) {
        g.save(); g.translate(s.x, s.y); g.rotate(-Math.PI * .35); drawAxe(g, a, L.R * .46); g.restore();
      });
      if (d.ax) { g.save(); g.translate(d.ax.x, d.ax.y); g.rotate(d.ax.rot); drawAxe(g, a, L.R * .46); g.restore(); }
      else {
        var sx = L.cx + Math.sin(d.wob) * L.R * 1.1;
        g.save(); g.translate(sx, L.sy); g.rotate(d.rot); drawAxe(g, a, L.R * .46); g.restore();
        g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.setLineDash([6, 8]);
        g.beginPath(); g.moveTo(sx, L.sy); g.lineTo(sx, L.cy); g.stroke(); g.setLineDash([]);
      }
      a.head(a.txt({ th: 'แตะปาให้ตรงกลางเป้า', en: 'Tap to throw at the bullseye' }));
    }
  });
})();
