/* ============================================================
   PACK 9 — เกม 81-90  (เสี่ยงโชค / จังหวะ)
   ============================================================ */
(function () {
  var R = MiniGame.register;
  function EM(g, ch, x, y, s) {
    g.font = s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#fff';           /* รีเซ็ตสี กันความจาง/สีตกค้างจากที่วาดก่อนหน้า */
    g.fillText(ch, x, y);
  }
  function bigBtn(a, yFrac, wFrac) {
    var w = Math.min(a.W * (wFrac || .5), a.mn * .42), h = a.mn * .09;
    return { x: (a.W - w) / 2, y: a.H * yFrac, w: w, h: h };
  }

  /* ---------- 81 ทอยเต๋า ---------- */
  R('dice', {
    time: 0,
    setup: function (a) {
      a.data.LO = { s: Math.min(a.W * .22, a.mn * .20), cy: a.H * .44 };
      a.data.v = [1, 2, 3]; a.data.st = 'idle'; a.data.t = 0; a.data.msg = '';
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.st !== 'roll') return;
      d.t -= dt;
      d.v = [a.rndi(1, 6), a.rndi(1, 6), a.rndi(1, 6)];
      if (d.t <= 0) {
        d.st = 'idle';
        var sum = d.v[0] + d.v[1] + d.v[2];
        a.add(sum);
        a.shake(.012, .18);
        for (var i = 0; i < 3; i++)
          a.puff(a.W / 2 + (i - 1) * d.LO.s * 1.25, d.LO.cy + d.LO.s * .5, { n: 6, col: '#ffd23f', spread: 2.6, spd: a.mn * .35, size: a.mn * .01, life: .45 });
        if (d.v[0] === d.v[1] && d.v[1] === d.v[2]) { a.add(100); d.msg = a.txt({ th: 'ตองสาม! +100', en: 'TRIPLE! +100' }); a.beep(1300, .35, 'triangle'); a.flash('#ffd23f', .3); }
        else { d.msg = a.txt({ th: 'รวม ' + sum + ' แต้ม', en: 'Total ' + sum }); a.beep(800, .15); }
      }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st === 'roll') return;
      d.st = 'roll'; d.t = 1.0; d.msg = ''; a.beep(300, .2, 'square');
    },
    draw: function (g, a) {
      a.bg('#1b1442', '#c8461e');
      var d = a.data, L = d.LO;
      g.fillStyle = 'rgba(0,0,0,.25)';
      g.beginPath(); g.ellipse(a.W / 2, L.cy + L.s * .9, L.s * 2.2, L.s * .5, 0, 0, 6.29); g.fill();
      for (var i = 0; i < 3; i++) {
        var x = a.W / 2 + (i - 1) * L.s * 1.25, y = L.cy + (d.st === 'roll' ? Math.sin(a.now * 25 + i) * L.s * .2 : 0);
        var rot = d.st === 'roll' ? Math.sin(a.now * 21 + i * 2) * .35 : 0;
        if (!a.spr('die', null, x, y, L.s, { rot: rot })) a.fillRR(x - L.s / 2, y - L.s / 2, L.s, L.s, L.s * .18, '#fff');
        var pips = [[], [[0, 0]], [[-1, -1], [1, 1]], [[-1, -1], [0, 0], [1, 1]],
        [[-1, -1], [1, -1], [-1, 1], [1, 1]], [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]],
        [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]][d.v[i]];
        g.save(); g.translate(x, y); g.rotate(rot);
        pips.forEach(function (p) { a.circle(p[0] * L.s * .25, p[1] * L.s * .25, L.s * .08, '#1b1442'); });
        g.restore();
      }
      if (d.msg) a.text(d.msg, a.W / 2, a.H * .70, a.mn * .07, a.C.accent);
      var b = bigBtn(a, .80);
      a.fillRR(b.x, b.y, b.w, b.h, b.h / 2, a.C.primary);
      a.text(a.txt({ th: 'แตะเพื่อทอย', en: 'TAP TO ROLL' }), b.x + b.w / 2, b.y + b.h / 2, a.mn * .042, '#fff');
      a.head(a.txt({ th: 'ทอยลูกเต๋า 3 ลูก ลุ้นแต้มรวม', en: 'Roll three dice, chase the total' }));
    }
  });

  /* ---------- 82 กบข้ามแม่น้ำ ---------- */
  /* กบต้องกระโดดขึ้นใบบัวที่ลอยไปมาเท่านั้น มีเกาะหินบางแถวให้ยืนพักได้ */
  function rowY(a, i) {
    var L = a.data.LO;
    if (i <= 0) return a.H - L.bank / 2;
    if (i > L.rows) return L.top + L.bank / 2;
    return (a.H - L.bank) - (i - .5) * L.rh;
  }
  function drawPad(g, a, x, y, w, h) {
    if (a.spr('pad', null, x, y, h * 1.25, { sx: w / (h * 1.25) })) return;
    g.save(); g.translate(x, y);
    g.beginPath(); g.ellipse(0, 0, w / 2, h / 2, 0, 0, 6.2832);
    g.fillStyle = '#2ea24c'; g.fill();
    g.beginPath(); g.ellipse(0, -h * .08, w / 2 * .82, h / 2 * .78, 0, 0, 6.2832);
    g.fillStyle = '#48c165'; g.fill();
    /* รอยบากของใบบัว */
    g.beginPath(); g.moveTo(0, 0);
    g.arc(0, 0, w / 2 * 1.02, -.34, .34); g.closePath();
    g.fillStyle = 'rgba(10,50,80,.85)'; g.fill();
    /* เส้นใบ */
    g.strokeStyle = 'rgba(20,90,45,.5)'; g.lineWidth = Math.max(1, h * .05);
    for (var k = 0; k < 6; k++) {
      var an = .55 + k * .87;
      g.beginPath(); g.moveTo(0, 0);
      g.lineTo(Math.cos(an) * w / 2 * .85, Math.sin(an) * h / 2 * .85); g.stroke();
    }
    g.restore();
  }
  function drawRock(g, a, x, y, w, h) {
    if (a.spr('rock', null, x, y, h * 1.15, { sx: w / (h * 1.15) })) return;
    a.fillRR(x - w / 2, y - h / 2, w, h, h * .35, '#6f6a63');
    a.fillRR(x - w / 2 + w * .06, y - h / 2 + h * .12, w * .88, h * .5, h * .3, '#8b857c');
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.beginPath(); g.ellipse(x - w * .18, y + h * .1, w * .09, h * .12, 0, 0, 6.2832); g.fill();
    g.beginPath(); g.ellipse(x + w * .22, y - h * .05, w * .07, h * .1, 0, 0, 6.2832); g.fill();
  }
  function mkRiver(a) {
    var d = a.data, L = d.LO;
    d.rows = [];
    for (var i = 0; i < L.rows; i++) {
      var isRock = (i > 0 && i < L.rows - 1) && Math.random() < .22;
      var r = { rock: isRock, v: 0, pads: [] };
      if (isRock) {
        r.rockW = a.mn * .24; r.rockX = a.rnd(r.rockW, a.W - r.rockW);
      } else {
        var dir = (i % 2 ? 1 : -1);
        r.v = dir * a.mn * (.09 + Math.random() * .10) * (1 + (d.round - 1) * .12);
        var n = a.rndi(2, 3), gap = a.W / n;
        for (var k = 0; k < n; k++)
          r.pads.push({ x: gap * (k + .5) + a.rnd(-gap * .18, gap * .18), w: a.mn * (.13 + Math.random() * .07) });
      }
      d.rows.push(r);
    }
    d.row = 0; d.x = a.W / 2; d.pad = -1; d.hop = 0; d.ht = 1; d.splash = 0;
  }
  function riverDrown(a) {
    var d = a.data;
    a.beep(150, .35, 'sawtooth');
    d.splash = .5; a.shake(.013, .15);
    a.puff(d.x, rowY(a, d.row), { n: 14, col: '#bfe8ff', spread: 2.8, spd: a.mn * .45, size: a.mn * .011, life: .5, grav: a.mn * 1.6 });
    if (a.loseLife() > 0) { d.row = 0; d.x = a.W / 2; d.pad = -1; d.hop = 0; d.ht = 1; }
  }
  function riverLand(a) {
    var d = a.data, L = d.LO;
    d.row = d.trow; d.x = d.tx; d.pad = -1;
    if (d.row <= 0) return;
    if (d.row > L.rows) {                       /* ถึงฝั่งตรงข้าม */
      a.add(100 + d.round * 20); a.beep(1250, .3, 'triangle'); a.flash('#ffd23f', .25);
      a.puff(d.x, rowY(a, d.row), { n: 16, col: '#ffd23f', spread: 6.28, spd: a.mn * .4, size: a.mn * .01, life: .6 });
      d.round++; mkRiver(a); return;
    }
    var r = d.rows[d.row - 1];
    if (r.rock) {
      if (Math.abs(d.x - r.rockX) < r.rockW / 2) { a.add(10); a.beep(680, .07); return; }
      riverDrown(a); return;
    }
    for (var i = 0; i < r.pads.length; i++) {
      if (Math.abs(d.x - r.pads[i].x) < r.pads[i].w / 2) {
        d.pad = i; a.add(10); a.beep(760, .07); return;
      }
    }
    riverDrown(a);
  }
  R('riverhop', {
    time: 0, lives: 3,
    setup: function (a) {
      var rows = a.port ? 8 : 5;
      var top = a.mn * .14, bank = a.mn * .11;
      var rh = (a.H - top - bank * 2) / rows;
      a.data.LO = {
        rows: rows, rh: rh, top: top, bank: bank,
        fr: Math.min(rh * .34, a.mn * .05), padH: Math.min(rh * .62, a.mn * .08),
        hopT: .20, side: a.mn * .17
      };
      a.data.round = 1;
      mkRiver(a);
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (d.splash > 0) d.splash -= dt;
      d.rows.forEach(function (r) {
        if (r.rock) return;
        r.pads.forEach(function (p) {
          p.x += r.v * dt;
          if (r.v > 0 && p.x - p.w / 2 > a.W) p.x = -p.w / 2;
          if (r.v < 0 && p.x + p.w / 2 < 0) p.x = a.W + p.w / 2;
        });
      });
      if (d.hop) {
        d.ht += dt / L.hopT;
        if (d.ht >= 1) { d.ht = 1; d.hop = 0; riverLand(a); }
        return;
      }
      /* ยืนบนใบบัว = ลอยไปกับใบบัว */
      if (d.row > 0 && d.row <= L.rows) {
        var r = d.rows[d.row - 1];
        if (!r.rock && d.pad >= 0) {
          d.x = r.pads[d.pad].x;
          if (d.x < -L.fr || d.x > a.W + L.fr) riverDrown(a);
        }
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.hop) return;
      var dir = x < a.W * .28 ? -1 : (x > a.W * .72 ? 1 : 0);
      d.fx0 = d.x; d.fy0 = rowY(a, d.row);
      /* แตะกลางจอ: เหนือกบ = กระโดดหน้า  ใต้กบ = ถอยหลัง 1 แถว */
      if (dir === 0 && y > d.fy0 + L.fr * 1.2) { if (d.row <= 0) return; d.trow = d.row - 1; d.tx = d.x; }
      else if (dir === 0) { d.trow = Math.min(L.rows + 1, d.row + 1); d.tx = d.x; }
      else { d.trow = d.row; d.tx = Math.max(L.fr, Math.min(a.W - L.fr, d.x + dir * L.side)); }
      d.fy1 = rowY(a, d.trow);
      d.hop = 1; d.ht = 0; d.pad = -1;
      a.beep(560, .06, 'triangle');
    },
    draw: function (g, a) {
      a.bg('#0a3b5e', '#0d6b8a');
      var d = a.data, L = d.LO;
      /* แม่น้ำ */
      var top = L.top + L.bank, bot = a.H - L.bank;
      if (!a.hasSpr('bg')) {
        var gr = g.createLinearGradient(0, top, 0, bot);
        gr.addColorStop(0, '#0f5f86'); gr.addColorStop(1, '#0a4767');
        g.fillStyle = gr; g.fillRect(0, top, a.W, bot - top);
      }
      /* คลื่น */
      g.strokeStyle = 'rgba(255,255,255,.10)'; g.lineWidth = Math.max(1, a.mn * .004);
      for (var i = 0; i < L.rows * 2; i++) {
        var wy = top + (i + .5) * (bot - top) / (L.rows * 2);
        g.beginPath();
        for (var x = 0; x <= a.W; x += a.mn * .05)
          g.lineTo(x, wy + Math.sin(x / (a.mn * .09) + a.now * 1.6 + i) * a.mn * .008);
        g.stroke();
      }
      /* ฝั่ง */
      a.fillRR(0, a.H - L.bank, a.W, L.bank, 0, '#2f8a3f');
      a.fillRR(0, L.top, a.W, L.bank, 0, '#2f8a3f');
      g.fillStyle = 'rgba(0,0,0,.15)';
      g.fillRect(0, a.H - L.bank, a.W, a.mn * .008);
      g.fillRect(0, L.top + L.bank - a.mn * .008, a.W, a.mn * .008);
      a.text(a.txt({ th: 'ฝั่งปลายทาง', en: 'GOAL' }), a.W / 2, L.top + L.bank / 2, a.mn * .04, 'rgba(255,255,255,.85)');

      /* ใบบัว / เกาะหิน */
      d.rows.forEach(function (r, i) {
        var y = rowY(a, i + 1);
        if (r.rock) drawRock(g, a, r.rockX, y, r.rockW, L.padH * 1.05);
        else r.pads.forEach(function (p) {
          drawPad(g, a, p.x, y, p.w, L.padH);
          if (p.x - p.w / 2 < 0) drawPad(g, a, p.x + a.W, y, p.w, L.padH);
          if (p.x + p.w / 2 > a.W) drawPad(g, a, p.x - a.W, y, p.w, L.padH);
        });
      });

      /* กบ */
      var fx, fy, sc = 1;
      if (d.hop) {
        fx = d.fx0 + (d.tx - d.fx0) * d.ht;
        fy = d.fy0 + (d.fy1 - d.fy0) * d.ht - Math.sin(d.ht * Math.PI) * L.rh * .45;
        sc = 1 + Math.sin(d.ht * Math.PI) * .22;
      } else { fx = d.x; fy = rowY(a, d.row); }
      if (d.splash > 0) {
        g.strokeStyle = 'rgba(255,255,255,' + d.splash * 1.6 + ')';
        g.lineWidth = a.mn * .008;
        g.beginPath(); g.arc(fx, fy, (0.5 - d.splash) * a.mn * .3 + a.mn * .03, 0, 6.2832); g.stroke();
      }
      g.save(); g.translate(fx, fy); g.scale(sc, sc);
      a.spr('frog', '🐸', 0, 0, L.fr * (a.hasSpr('frog') ? 2.9 : 2.4)); g.restore();

      a.text(a.txt({ th: 'รอบ ' + d.round + ' • แถวที่ ' + d.row + '/' + (L.rows + 1), en: 'Round ' + d.round + ' • row ' + d.row + '/' + (L.rows + 1) }),
        a.W / 2, a.H - L.bank / 2, a.mn * .036, 'rgba(255,255,255,.9)');
      a.head(a.txt({ th: 'แตะเหนือกบ = กระโดดหน้า • ใต้กบ = ถอย • ขอบซ้าย-ขวา = ขยับข้าง', en: 'Tap above the frog to hop • below to hop back • edges to move sideways' }));
    }
  });

  /* ---------- 83 เป่ายิ้งฉุบ ---------- */
  R('rps', {
    time: 0,
    setup: function (a) { a.data.me = 0; a.data.cpu = 0; a.data.st = 'ask'; a.data.t = 0; a.data.msg = ''; a.data.pk = -1; a.data.cp = -1; },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'pump') {
        /* กำหมัดขึ้นลง 4 ครั้งก่อนเปิด */
        d.t -= dt;
        var beat = Math.floor((1.25 - d.t) / .3);
        if (beat !== d.beat && beat < 4) { d.beat = beat; a.beep(420 + beat * 40, .05, 'triangle'); }
        if (d.t <= 0) { rpsReveal(a); }
        return;
      }
      if (d.st !== 'show') return;
      d.t -= dt;
      if (d.t <= 0) {
        if (d.me >= 5 || d.cpu >= 5) {
          a.end(d.me > d.cpu ? a.txt({ th: 'คุณชนะ ' + d.me + '-' + d.cpu, en: 'You win ' + d.me + '-' + d.cpu })
            : a.txt({ th: 'คุณแพ้ ' + d.me + '-' + d.cpu, en: 'You lose ' + d.me + '-' + d.cpu }));
        } else { d.st = 'ask'; d.msg = ''; d.pk = -1; d.cp = -1; }
      }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st !== 'ask') return;
      for (var i = 0; i < 3; i++) {
        var b = rbtn(a, i);
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
          d.pk = i; d.cp = a.rndi(0, 2);
          d.st = 'pump'; d.t = 1.25; d.beat = -1; d.msg = ''; a.beep(600, .06); return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#2a1150', '#0d5c8f');
      var d = a.data, E = ['✊', '✋', '✌️'], K = ['rock', 'paper', 'scissors'];
      a.text(a.txt({ th: 'คุณ', en: 'YOU' }), a.W * .3, a.mn * .17, a.mn * .04, '#fff');
      a.text(a.txt({ th: 'คอม', en: 'CPU' }), a.W * .7, a.mn * .17, a.mn * .04, '#fff');
      a.text(d.me + '', a.W * .3, a.mn * .26, a.mn * .09, a.C.accent);
      a.text(d.cpu + '', a.W * .7, a.mn * .26, a.mn * .09, a.C.bad);
      if (d.st === 'pump') {
        /* ทั้งคู่กำหมัด โยกขึ้นลง 4 จังหวะ */
        var ph = (1.25 - d.t) / .3, bob = Math.abs(Math.sin(Math.min(ph, 4) * Math.PI)) * a.mn * .05;
        a.spr(K[0], E[0], a.W * .3, a.H * .48 - bob, a.mn * .2, { rot: -.15 + bob / a.mn * 2 });
        a.spr(K[0], E[0], a.W * .7, a.H * .48 - bob, a.mn * .2, { flip: true, rot: .15 - bob / a.mn * 2 });
        var cnt = Math.min(4, Math.floor(ph) + 1);
        a.text(a.txt({ th: ['เป่า', 'ยิ้ง', 'ฉุบ', '!'].slice(0, cnt).join('  '), en: ['Rock', 'Paper', 'Scissors', 'SHOOT!'].slice(0, cnt).join('  ') }), a.W / 2, a.H * .64, a.mn * .06, a.C.accent);
      } else if (d.st === 'show') {
        var sh = (1.3 - d.t) < .15 ? (1 + (.15 - (1.3 - d.t)) * 2) : 1;     /* เด้งตอนโชว์ */
        a.spr(K[d.pk], E[d.pk], a.W * .3, a.H * .48, a.mn * .2 * sh);
        a.spr(K[d.cp], E[d.cp], a.W * .7, a.H * .48, a.mn * .2 * sh, { flip: true });
        a.text(d.msg, a.W / 2, a.H * .64, a.mn * .06, '#fff');
      }
      for (var i = 0; i < 3; i++) {
        var b = rbtn(a, i);
        a.fillRR(b.x, b.y, b.w, b.h, b.w * .16, d.st === 'ask' ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.25)');
        a.spr(K[i], E[i], b.x + b.w / 2, b.y + b.h / 2, b.w * .62);
      }
      a.head(a.txt({ th: 'ใครถึง 5 แต้มก่อนชนะ', en: 'First to five points wins' }));
    }
  });
  function rpsReveal(a) {
    var d = a.data, r = (d.pk - d.cp + 3) % 3;
    a.puff(a.W / 2, a.H * .48, { n: 14, col: '#fff7c0', spread: 6.28, spd: a.mn * .5, size: a.mn * .01, life: .4, grav: 0 });
    if (r === 0) { d.msg = a.txt({ th: 'เสมอ', en: 'Draw' }); a.beep(500, .12); a.shake(.007, .12); }
    else if (r === 1) { d.me++; a.add(20); d.msg = a.txt({ th: 'คุณชนะรอบนี้!', en: 'You win the round!' }); a.beep(1000, .18, 'triangle'); a.flash('#ffd23f', .22); }
    else { d.cpu++; d.msg = a.txt({ th: 'คอมชนะรอบนี้', en: 'Computer wins it' }); a.beep(200, .22, 'square'); a.shake(.017, .2); }
    d.st = 'show'; d.t = 1.3;
  }
  function rbtn(a, i) {
    var w = Math.min(a.W * .26, a.mn * .22), gap = a.mn * .03, tot = 3 * w + 2 * gap;
    return { x: (a.W - tot) / 2 + i * (w + gap), y: a.H - a.mn * .22, w: w, h: w };
  }

  /* ---------- 84 ตู้กาชาปอง ---------- */
  var CRANK = { x: -.016, y: .63 };      /* ตำแหน่งลูกบิดบนภาพตู้ (สัดส่วนของความสูงตู้) */
  R('capsule', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.prz = a.lang === 'en'
        ? ['🎁 Free gift', '🥤 Free drink', '🎫 20% coupon', '🧢 Brand cap', '⭐ Rare figure!', '😅 Try again']
        : ['🎁 ของแถม', '🥤 เครื่องดื่มฟรี', '🎫 คูปองลด 20%', '🧢 หมวกแบรนด์', '⭐ ฟิกเกอร์หายาก!', '😅 ลองใหม่'];
      a.data.st = 'idle'; a.data.t = 0; a.data.crank = 0; a.data.cap = null; a.data.win = '';
      a.data.cols = ['#ff2e88', '#ffd23f', '#00d4ff', '#2fe08a', '#ff6a3d', '#b06bff'];
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'turn') {
        d.crank += dt * 9; d.t -= dt;
        if (d.t <= 0) { d.st = 'roll'; d.cap = { x: a.W * .5, y: a.H * .58, v: 0, col: a.pick(d.cols) }; }
      } else if (d.st === 'roll') {
        d.cap.v += a.mn * 1.6 * dt; d.cap.y += d.cap.v * dt;
        d.cap.rot = (d.cap.rot || 0) + dt * 5;
        if (d.cap.y > a.H * .78) { d.cap.y = a.H * .78; d.st = 'ready'; a.beep(700, .15); a.shake(.008, .12); a.puff(d.cap.x, d.cap.y + a.mn * .06, { n: 8, col: '#fff', spread: 3, spd: a.mn * .3, size: a.mn * .008, life: .35 }); }
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.st === 'idle') { d.st = 'turn'; d.t = .8; d.win = ''; a.beep(350, .25, 'square'); }
      else if (d.st === 'ready') {
        var idx = Math.random() < .12 ? 4 : a.rndi(0, 5);
        d.win = d.prz[idx]; d.st = 'open'; a.beep(1200, .3, 'triangle'); a.flash('#ffd23f', .25);
        for (var c = 0; c < 3; c++) a.puff(d.cap.x, d.cap.y, { n: 8, col: d.cols[(idx + c) % 6], spread: 6.28, spd: a.mn * .6, size: a.mn * .012, life: .7 });
      } else if (d.st === 'open') { d.st = 'idle'; d.cap = null; d.win = ''; }
    },
    draw: function (g, a) {
      a.bg('#5b1064', '#ff6a3d');
      var d = a.data;
      var mw = Math.min(a.W * .56, a.mn * .5), mx = (a.W - mw) / 2, my = a.mn * .16, mh = Math.min(a.H * .5, a.mn * .58);
      var art = a.spr('machine', null, a.W / 2, my + mh / 2, mh * 1.04, { rot: d.st === 'turn' ? Math.sin(a.now * 40) * .015 : 0 });
      if (!art) {
        a.fillRR(mx, my, mw, mh, a.mn * .04, '#e8e8f4');
        a.fillRR(mx + mw * .08, my + mh * .08, mw * .84, mh * .48, a.mn * .03, 'rgba(120,180,255,.5)');
        for (var i = 0; i < 12; i++)
          a.circle(mx + mw * (.18 + (i % 4) * .21), my + mh * (.18 + Math.floor(i / 4) * .13), mw * .07, d.cols[i % 6]);
        a.fillRR(mx + mw * .3, my + mh * .62, mw * .4, mh * .14, a.mn * .02, '#1b1442');
        a.text(a.txt({ th: 'กาชาปอง', en: 'GACHA' }), a.W / 2, my + mh * .69, a.mn * .04, a.C.accent);
      }
      /* มือหมุน: ตำแหน่งลูกบิดบนภาพ (วัดจากไฟล์จริงทีหลัง) */
      var kx = a.W / 2 + (art ? mh * CRANK.x : 0), ky = my + mh * (art ? CRANK.y : .86);
      if (!art) {
        g.save(); g.translate(kx, ky); g.rotate(d.crank);
        a.fillRR(-a.mn * .05, -a.mn * .012, a.mn * .1, a.mn * .024, a.mn * .012, '#8d8d9e'); g.restore();
        a.circle(kx, ky, a.mn * .02, '#5a5a6e');
      } else if (d.st === 'turn' && Math.random() < .3) a.puff(kx, ky, { n: 1, col: '#fff', spread: 6.28, spd: a.mn * .25, size: a.mn * .006, life: .3, grav: 0 });
      if (d.cap) {
        var wob = d.st === 'ready' ? Math.sin(a.now * 6) * .12 : (d.cap.rot || 0);
        if (!a.sprTint('capsule', d.cap.col, null, d.cap.x, d.cap.y, a.mn * .15, { rot: wob })) {
          a.circle(d.cap.x, d.cap.y, a.mn * .07, d.cap.col);
          g.save(); a.rr(d.cap.x - a.mn * .07, d.cap.y - a.mn * .07, a.mn * .14, a.mn * .07, 0); g.clip();
          a.circle(d.cap.x, d.cap.y, a.mn * .07, 'rgba(255,255,255,.75)'); g.restore();
        }
      }
      if (d.st === 'open') {
        var pw = Math.min(a.W * .82, a.mn * .8), py = a.H - a.mn * .28;
        a.fillRR((a.W - pw) / 2, py, pw, a.mn * .2, a.mn * .03, 'rgba(10,5,25,.9)');
        a.text(d.win, a.W / 2, py + a.mn * .1, a.mn * .06, a.C.accent);
      }
      a.head(d.st === 'idle' ? a.txt({ th: 'แตะเพื่อหมุนตู้', en: 'Tap to turn the crank' })
        : d.st === 'ready' ? a.txt({ th: 'แตะแคปซูลเพื่อเปิด', en: 'Tap the capsule to open it' })
          : d.st === 'open' ? a.txt({ th: 'แตะเพื่อเล่นอีกครั้ง', en: 'Tap to play again' })
            : a.txt({ th: 'กำลังหมุน…', en: 'Turning…' }));
    }
  });

  /* ---------- 85 ทุบวัดพลัง ---------- */
  var TW = { h: 1.12, s0: .19, s1: .80, w: .30, bell: .095 };   /* ภาพหอ: ความสูงเทียบแถบ, ช่องไฟ บน/ล่าง/กว้าง (วัดจากไฟล์จริงทีหลัง) */
  R('hammerpower', {
    time: 0,
    setup: function (a) {
      a.data.LO = { tx: a.W / 2, top: a.mn * .16, bot: a.H - a.mn * .16 };
      a.data.p = 0; a.data.dir = 1; a.data.st = 'aim'; a.data.puck = 0; a.data.t = 0; a.data.msg = '';
      a.data.lit = 0; a.data.ring = 0; a.data.ringT = 0; a.data.rot = -.5;
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'aim') { d.p += d.dir * dt * 1.5; if (d.p > 1) { d.p = 1; d.dir = -1; } if (d.p < 0) { d.p = 0; d.dir = 1; } return; }
      d.t -= dt;
      /* ลำดับ: ยกค้อน (2.4-2.1) -> ฟาดลง (2.1-1.95) -> ไฟค่อย ๆ วิ่งขึ้น -> ค้าง -> กลับ */
      /* ค้อนหมุนรอบปลายด้าม: พัก -.5, ยกขึ้นถึง -1.1, ฟาดลงถึง +.05 */
      if (d.t > 2.1) d.rot = -.5 - .6 * (2.4 - d.t) / .3;
      else if (d.t > 1.95) d.rot = -1.1 + 1.15 * (2.1 - d.t) / .15;
      else {
        if (!d.impact) {
          d.impact = 1; d.rot = .05;
          a.shake(.006 + d.power * .012, .18); a.beep(120, .12, 'square');
          a.puff(d.LO.tx, d.LO.bot - a.mn * .02, { n: 10, col: '#ffb060', spread: 2.6, spd: a.mn * .45, size: a.mn * .009, life: .4 });
          var pts = Math.round(d.power * 100); a.add(pts); d.pts = pts;
        }
        if (d.t < 1.7) d.rot += (-.5 - d.rot) * Math.min(1, dt * 4);
        if (d.puck < d.power) {
          d.puck = Math.min(d.power, d.puck + dt * 1.3);
          var lv = Math.floor(d.puck * 8 + .5);
          if (lv > d.lit) { d.lit = lv; a.beep(380 + lv * 110, .06, 'triangle'); }
          if (d.puck >= d.power) {
            if (d.power > .95) { a.add(100); d.msg = a.txt({ th: 'ตีระฆัง! +100', en: 'RANG THE BELL! +100' }); d.ring = 6; d.ringT = 0; d.t = Math.max(d.t, 1.4); }
            else d.msg = '+' + d.pts;
          }
        }
      }
      if (d.ring > 0) { d.ringT -= dt; if (d.ringT <= 0) { d.ringT = .11; d.ring--; a.beep(d.ring % 2 ? 2300 : 2700, .1, 'triangle'); } }
      if (d.t <= 0) { d.st = 'aim'; d.puck = 0; d.lit = 0; d.msg = ''; d.rot = -.5; d.impact = 0; }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st !== 'aim') return;
      d.power = d.p; d.st = 'hit'; d.t = 2.4; d.impact = 0; d.puck = 0; d.lit = 0; d.msg = '';
      a.beep(500, .08, 'triangle');
    },
    draw: function (g, a) {
      a.bg('#3a0f1e', '#c8461e');
      var d = a.data, L = d.LO, tw = a.mn * .13;
      var ti = a.sprImg('tower'), y0 = L.top, y1 = L.bot, sw = tw, artW = 0;
      if (ti) {
        var th = (L.bot - L.top) * TW.h, tcy = (L.top + L.bot) / 2;
        artW = th * ti.width / ti.height;
        a.spr('tower', null, L.tx, tcy, th);
        y0 = tcy - th / 2 + th * TW.s0; y1 = tcy - th / 2 + th * TW.s1; sw = artW * TW.w;
      } else a.fillRR(L.tx - tw / 2, L.top, tw, L.bot - L.top, tw * .2, 'rgba(0,0,0,.35)');
      var levels = 8;
      for (var i = 0; i < levels; i++) {
        var y = y1 - (i + 1) * (y1 - y0) / levels;
        var on = d.puck > (i + .5) / levels;
        a.fillRR(L.tx - sw / 2 + 3, y + 3, sw - 6, (y1 - y0) / levels - 6, 4,
          on ? 'hsl(' + (i * 15) + ',85%,58%)' : 'rgba(255,255,255,.12)');
      }
      if (!ti) EM(g, '🔔', L.tx, L.top - a.mn * .04, a.mn * .09);
      else if (d.ring > 0 || (d.st === 'hit' && d.puck >= .95)) {   /* ระฆังส่องแสงกระพริบตอนดัง */
        var gl = d.ring > 0 ? .5 + Math.sin(a.now * 40) * .3 : .25;
        g.fillStyle = 'rgba(255,220,80,' + gl + ')';
        g.beginPath(); g.arc(L.tx, tcy - th / 2 + th * TW.bell, artW * .4, 0, 6.29); g.fill();
      }
      var bw = a.mn * .05, bx = L.tx + Math.max(tw, artW / 2 + a.mn * .03), by = L.top + a.mn * .02, bh = L.bot - L.top - a.mn * .04;
      a.fillRR(bx, by, bw, bh, bw / 2, 'rgba(0,0,0,.35)');
      a.fillRR(bx, by + bh * (1 - d.p), bw, bh * d.p, bw / 2, a.C.accent);
      /* ค้อน: ภาพหัวอยู่บนขวา ด้ามล่างซ้าย หมุนรอบปลายด้าม (มุมล่างซ้ายของภาพ) */
      var hi = a.sprImg('hammer'), hs = a.mn * (hi ? .34 : .12);
      if (hi) {
        var hw = hs * hi.width / hi.height, Px = L.tx - hs * .6, Py = L.bot - hs * .12, c = Math.cos(d.rot), sn = Math.sin(d.rot);
        a.spr('hammer', null, Px + .4 * hw * c + .4 * hs * sn, Py + .4 * hw * sn - .4 * hs * c, hs, { rot: d.rot });
      } else EM(g, '🔨', L.tx - tw, L.bot - a.mn * .04, a.mn * .1);
      if (d.msg) a.text(d.msg, a.W / 2, a.H - a.mn * .07, a.mn * .06, a.C.accent);
      a.head(d.st === 'aim' ? a.txt({ th: 'แตะตอนแถบขึ้นสูงสุด', en: 'Tap when the bar peaks' }) : a.txt({ th: 'ดูผล…', en: 'Watching…' }));
    }
  });

  /* ---------- 86 ปล่อยจรวด ---------- */
  R('rocketlaunch', {
    time: 15,
    setup: function (a) {
      a.data.LO = { Rt: a.mn * .12, Rmax: Math.min(a.W * .36, a.mn * .34) };
      a.data.r = a.data.LO.Rmax; a.data.sp = a.mn * .42; a.data.alt = 0; a.data.vy = a.mn * .3; a.data.best = 0;
      a.data.msg = ''; a.data.fx = 0; a.data.fail = 0;
    },
    /* หมดเวลา 15 วิ = สรุประยะทาง */
    timeout: function (a) { var d = a.data; a.end(a.txt({ th: 'ไปได้ไกล ' + Math.floor(d.best / 10) + ' เมตร', en: 'Reached ' + Math.floor(d.best / 10) + ' m' })); },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.vy -= a.mn * .22 * dt;
      d.alt = Math.max(0, d.alt + d.vy * dt);
      d.best = Math.max(d.best, d.alt);
      a.setScore(Math.floor(d.best / 10));
      if (d.fx > 0) d.fx -= dt;
      d.r -= d.sp * dt;
      if (d.r < L.Rt * .3) { d.r = L.Rmax; d.fail++; d.vy -= a.mn * .18; d.msg = a.txt({ th: 'พลาดจังหวะ', en: 'Missed the beat' }); a.beep(170, .2, 'square'); }
      if (d.alt <= 0 && d.vy < 0) { a.beep(140, .35, 'sawtooth'); a.end(a.txt({ th: 'จรวดตก • ไปได้ไกล ' + Math.floor(d.best / 10) + ' เมตร', en: 'Came down • reached ' + Math.floor(d.best / 10) + ' m' })); }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      var diff = Math.abs(d.r - L.Rt);
      var fl = { n: 12, col: '#ffb040', ang: Math.PI / 2, spread: 1.2, spd: a.mn * .6, size: a.mn * .022, life: .5, grav: 0 };
      if (diff < L.Rt * .2) { d.vy += a.mn * .40; d.msg = a.txt({ th: 'เป๊ะ!', en: 'PERFECT!' }); a.beep(1150, .12, 'triangle'); a.flash('#ffd23f', .15); fl.n = 18; a.puff(a.W / 2, a.H * .42 + L.Rt * .8, fl); }
      else if (diff < L.Rt * .5) { d.vy += a.mn * .22; d.msg = a.txt({ th: 'ดี', en: 'Good' }); a.beep(800, .1); a.puff(a.W / 2, a.H * .42 + L.Rt * .8, fl); }
      else { d.vy -= a.mn * .08; d.msg = a.txt({ th: 'หลุด', en: 'Off' }); a.beep(200, .16, 'square'); a.shake(.010, .15); }
      d.r = L.Rmax; d.fx = .3; d.sp = Math.min(a.mn * .6, d.sp + a.mn * .006);   /* เร็วขึ้นช้าลง มีเพดาน */
    },
    draw: function (g, a) {
      var alt = a.data.alt;
      var t = Math.min(1, alt / (a.mn * 12));
      var sky = 'rgb(' + Math.round(80 - 70 * t) + ',' + Math.round(180 - 170 * t) + ',' + Math.round(255 - 200 * t) + ')';
      var bk = (a.port && a.hasSpr('bgPort')) ? 'bgPort' : (a.hasSpr('bg') ? 'bg' : null);
      if (bk) {   /* ท้องฟ้าค่อย ๆ กลายเป็นอวกาศตามความสูง */
        var sg = g.createLinearGradient(0, 0, 0, a.H); sg.addColorStop(0, sky); sg.addColorStop(1, '#8fd0ff');
        g.fillStyle = sg; g.fillRect(0, 0, a.W, a.H);
        g.globalAlpha = .15 + .85 * t; g.drawImage(a.sprImg(bk), 0, 0, a.W, a.H); g.globalAlpha = 1;
      } else a.bg(sky, '#050b22');
      var d = a.data, L = d.LO, cx = a.W / 2, cy = a.H * .42;
      /* ดาว/ละอองที่วิ่งสวน: ใหญ่ขึ้น มี 3 ระยะ (parallax) ยิ่งเร็วยิ่งยืดเป็นเส้น */
      var streak = Math.min(a.mn * .12, Math.max(0, d.vy) * .1);   /* เส้นความเร็ว บางลงครึ่งหนึ่ง */
      for (var i = 0; i < 34; i++) {
        var lyr = i % 3, sx = (i * 191) % a.W, sy = ((i * 271) + alt * (.25 + lyr * .25)) % a.H;
        var rr = a.mn * (.004 + lyr * .004), al = Math.min(1, .55 + t * .35 + lyr * .15);
        g.fillStyle = 'rgba(255,255,255,' + al + ')';
        g.beginPath(); g.arc(sx, sy, rr, 0, 6.29); g.fill();
        if (streak > rr) { g.fillRect(sx - rr * .25, sy, rr * .5, streak * (.5 + lyr * .5)); }
      }
      g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .014;
      g.beginPath(); g.arc(cx, cy, L.Rt, 0, 6.29); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = a.mn * .010;
      g.beginPath(); g.arc(cx, cy, Math.max(2, d.r), 0, 6.29); g.stroke();
      /* หัวจรวดชี้ตรงขึ้น เอียงเล็กน้อยตอนกำลังตก */
      var rr = a.hasSpr('rocket') ? (d.vy > 0 ? Math.sin(a.now * 9) * .04 : .22) : (-Math.PI / 4 + (d.vy > 0 ? .18 : 0));
      a.spr('rocket', '🚀', cx, cy, L.Rt * (a.hasSpr('rocket') ? 1.7 : 1.3), { rot: rr });
      if (d.fx > 0) { g.fillStyle = 'rgba(255,180,60,' + d.fx + ')'; g.beginPath(); g.arc(cx, cy + L.Rt, L.Rt * .5 * d.fx * 3, 0, 6.29); g.fill(); }
      a.text(a.txt({ th: 'ระยะทาง ' + Math.floor(d.best / 10) + ' ม.', en: 'Distance ' + Math.floor(d.best / 10) + ' m' }),
        a.W / 2, a.H - a.mn * .12, a.mn * .05, '#fff');
      if (d.msg) a.text(d.msg, a.W / 2, a.H - a.mn * .05, a.mn * .045, a.C.accent);
      a.head(a.txt({ th: 'แตะตอนวงขาวซ้อนวงเหลืองเพื่อเร่งเครื่อง', en: 'Tap when the rings align to add thrust' }));
    }
  });

  /* ---------- 87 จับสลาก ---------- */
  R('luckydraw', {
    time: 0, noScore: true,
    setup: function (a) {
      a.data.prz = a.lang === 'en'
        ? ['🎁 Free gift', '💰 200 THB off', '☕ Free drink', '🎫 Buy 1 Get 1', '🏆 Grand prize!', '😅 Try again', '🛍️ Tote bag']
        : ['🎁 ของแถม', '💰 ส่วนลด 200 บาท', '☕ เครื่องดื่มฟรี', '🎫 ซื้อ 1 แถม 1', '🏆 รางวัลใหญ่!', '😅 เสียใจด้วย', '🛍️ ถุงผ้า'];
      a.data.st = 'idle'; a.data.t = 0; a.data.win = ''; a.data.shake = 0;
    },
    update: function (dt, a) {
      var d = a.data;
      d.shake += dt * 6;
      if (d.st === 'pull') {
        d.t -= dt;
        if (d.t <= 0) {
          d.st = 'open'; d.win = a.pick(d.prz); a.beep(1150, .3, 'triangle'); a.flash('#ffd23f', .25);
          a.puff(a.W / 2, a.H * .36, { n: 20, col: '#fff7e0', spread: 6.28, spd: a.mn * .5, size: a.mn * .011, life: .6 });
          a.puff(a.W / 2, a.H * .36, { n: 12, col: '#ffd23f', spread: 6.28, spd: a.mn * .4, size: a.mn * .009, life: .6 });
        }
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.st === 'idle') { d.st = 'pull'; d.t = .9; a.beep(400, .2, 'square'); a.shake(.007, .12); }
      else if (d.st === 'open') { d.st = 'idle'; d.win = ''; }
    },
    draw: function (g, a) {
      a.bg('#20104a', '#2fa86f');
      var d = a.data;
      var bw = Math.min(a.W * .5, a.mn * .46), bx = (a.W - bw) / 2, by = a.H * .28, bh = bw * .8;
      g.save(); g.translate(a.W / 2, 0); g.rotate(Math.sin(d.shake) * (d.st === 'idle' ? .02 : .06)); g.translate(-a.W / 2, 0);
      if (!a.spr('box', null, a.W / 2, by + bh / 2, bh * 1.15)) {
        a.fillRR(bx, by, bw, bh, bw * .08, '#c94f2a');
        a.fillRR(bx, by, bw, bh * .18, bw * .06, '#a33a1c');
        a.fillRR(bx + bw * .35, by + bh * .3, bw * .3, bh * .16, bw * .03, '#1b1442');
        a.text(a.txt({ th: 'จับสลาก', en: 'DRAW' }), a.W / 2, by + bh * .62, a.mn * .05, '#fff');
      }
      g.restore();
      if (d.st === 'pull') {
        var dip = Math.sin((.9 - d.t) / .9 * Math.PI);          /* มือจุ่มลงแล้วดึงขึ้น */
        if (a.hasSpr('hand')) {
          var hh = a.H * .5, hb = by + bh * .05 + dip * bh * .3;
          a.spr('hand', null, a.W / 2, hb - hh / 2, hh);
        } else EM(g, '✋', a.W / 2, by + bh * .35 + dip * bh * .1, a.mn * .1);
      }
      if (d.st === 'open') {
        var pw = Math.min(a.W * .8, a.mn * .78);
        a.fillRR((a.W - pw) / 2, a.H * .66, pw, a.mn * .22, a.mn * .03, '#fff7e0');
        a.text(d.win, a.W / 2, a.H * .66 + a.mn * .11, a.mn * .055, '#5a3a00');
      }
      a.head(d.st === 'open' ? a.txt({ th: 'แตะเพื่อจับใหม่', en: 'Tap to draw again' }) : a.txt({ th: 'แตะเพื่อล้วงสลาก', en: 'Tap to pull a ticket' }));
    }
  });

  /* ---------- 88 แข่งม้า ---------- */
  R('horserace', {
    time: 0,
    setup: function (a) {
      a.data.n = 4; a.data.pick = -1; a.data.st = 'pick'; a.data.t = 0; a.data.msg = '';
      a.data.pos = [0, 0, 0, 0]; a.data.sp = [0, 0, 0, 0];
      /* เลนอยู่บนพื้นดินของภาพพื้นหลัง (แนวนอนเริ่ม 39% / แนวตั้ง 29% ของความสูง) */
      var trackTop = a.hasSpr('bg') ? a.H * (a.port ? .29 : .385) + a.mn * .01 : a.mn * .22;
      a.data.LO = { top: trackTop, lh: (a.H - trackTop - a.mn * .06) / 4, finish: a.W - a.mn * .12, start: a.mn * .12 };
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (d.st !== 'race') { if (d.st === 'done') { d.t -= dt; if (d.t <= 0) { d.st = 'pick'; d.pos = [0, 0, 0, 0]; d.pick = -1; d.msg = ''; } } return; }
      for (var i = 0; i < d.n; i++) {
        d.sp[i] += (a.rnd(.6, 1.5) - d.sp[i]) * dt * 3;
        d.pos[i] += d.sp[i] * a.mn * .22 * dt;
        if (Math.random() < dt * 8) a.puff(L.start + d.pos[i] - L.lh * .3, L.top + (i + .85) * L.lh, { n: 1, col: 'rgba(255,235,200,.5)', ang: Math.PI, spread: .8, spd: a.mn * .15, size: a.mn * .01, life: .4, grav: -a.mn * .1 });
        if (d.pos[i] >= L.finish - L.start) {
          d.st = 'done'; d.t = 2.2;
          a.puff(L.finish, L.top + (i + .5) * L.lh, { n: 16, col: '#fff', spread: 6.28, spd: a.mn * .4, size: a.mn * .01, life: .6 });
          if (i === d.pick) { a.add(100); d.msg = a.txt({ th: 'ม้าของคุณชนะ! +100', en: 'Your pick won! +100' }); a.beep(1250, .3, 'triangle'); a.flash('#ffd23f', .3); }
          else { d.msg = a.txt({ th: 'หมายเลข ' + (i + 1) + ' เข้าก่อน', en: 'Number ' + (i + 1) + ' took it' }); a.beep(300, .2, 'square'); a.shake(.010, .15); }
          return;
        }
      }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      if (d.st !== 'pick') return;
      var i = Math.floor((y - L.top) / L.lh);
      if (i < 0 || i >= d.n) return;
      d.pick = i; d.st = 'race'; d.sp = [1, 1, 1, 1]; a.beep(700, .12);
    },
    draw: function (g, a) {
      a.bg('#0f3d1e', '#43a047');
      var d = a.data, L = d.LO, E = ['🐎', '🐕', '🐢', '🐇'], K = ['horse', 'dog', 'turtle', 'rabbit'];
      var cols = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a'];
      for (var i = 0; i < d.n; i++) {
        var y = L.top + i * L.lh;
        g.fillStyle = i % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.10)';
        g.fillRect(0, y, a.W, L.lh);
        a.circle(a.mn * .06, y + L.lh / 2, a.mn * .035, cols[i]);
        a.text((i + 1) + '', a.mn * .06, y + L.lh / 2, a.mn * .04, '#1b1442');
        if (d.pick === i) { g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .008; g.strokeRect(2, y + 2, a.W - 4, L.lh - 4); }
        var bob = d.st === 'race' ? Math.abs(Math.sin(a.now * 12 + i * 1.7)) * L.lh * .08 : 0;
        a.spr(K[i], E[i], L.start + d.pos[i], y + L.lh / 2 - bob, L.lh * .74);
      }
      g.fillStyle = '#fff';
      for (var k = 0; k < 12; k++) g.fillRect(L.finish + (k % 2 ? a.mn * .012 : 0), L.top + k * (L.lh * 4 / 12), a.mn * .012, L.lh * 4 / 12);
      if (d.msg) a.text(d.msg, a.W / 2, a.H - a.mn * .07, a.mn * .055, a.C.accent);
      a.head(d.st === 'pick' ? a.txt({ th: 'แตะเลือกตัวที่คิดว่าจะชนะ', en: 'Tap the runner you think will win' })
        : a.txt({ th: 'กำลังแข่ง!', en: 'And they\'re off!' }));
    }
  });

  /* ---------- 89 เปิดแผ่นหาสมบัติ ---------- */
  R('treasuredig', {
    time: 0,
    setup: function (a) { a.data.lv = 1; mkTiles(a); },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      var bb = bankBtn(a);
      if (x > bb.x && x < bb.x + bb.w && y > bb.y && y < bb.y + bb.h) {
        if (d.pot > 0) { a.add(d.pot); a.beep(1100, .25, 'triangle'); d.lv++; mkTiles(a); }
        return;
      }
      var c = Math.floor((x - L.ox) / L.s), r = Math.floor((y - L.oy) / L.s);
      if (c < 0 || r < 0 || c >= L.cols || r >= L.rows) return;
      var i = r * L.cols + c, o = d.t[i]; if (o.open) return;
      o.open = 1;
      var tcx = L.ox + (c + .5) * L.s, tcy = L.oy + (r + .5) * L.s;
      if (o.trap) {
        d.pot = 0; a.beep(160, .4, 'sawtooth'); a.shake(.027, .35); a.flash('#ff3b3b', .3);
        a.puff(tcx, tcy, { n: 20, col: '#ff8a3d', spread: 6.28, spd: a.mn * .6, size: a.mn * .012, life: .6 });
        d.t.forEach(function (q) { q.open = 1; });
        a.end(a.txt({ th: 'เจอกับดัก! คะแนนสะสมหายหมด', en: 'Trap! You lost the pot' }));
      } else { d.pot += o.v; a.beep(800, .09); a.puff(tcx, tcy, { n: 8, col: '#ffd23f', spread: 6.28, spd: a.mn * .35, size: a.mn * .009, life: .45 }); }
    },
    draw: function (g, a) {
      a.bg('#0a2440', '#1b6ca8');
      var d = a.data, L = d.LO;
      for (var i = 0; i < d.t.length; i++) {
        var c = i % L.cols, r = Math.floor(i / L.cols), o = d.t[i];
        var x = L.ox + c * L.s + 2, y = L.oy + r * L.s + 2, s = L.s - 4;
        if (!o.open) {
          if (!a.spr('tile', null, x + s / 2, y + s / 2, s)) {
            a.fillRR(x, y, s, s, L.s * .12, '#2a3f6e');
            a.text('?', x + s / 2, y + s / 2, s * .45, 'rgba(255,255,255,.45)');
          }
        } else {
          a.fillRR(x, y, s, s, L.s * .12, o.trap ? a.C.bad : 'rgba(255,215,63,.22)');
          if (o.trap) { if (!a.spr('bomb', null, x + s / 2, y + s / 2, s * .7)) a.text('✸', x + s / 2, y + s / 2, s * .5, '#fff'); }
          else if (a.spr('coin', null, x + s / 2, y + s * .42, s * .5)) a.text('+' + o.v, x + s / 2, y + s * .8, s * .24, a.C.accent);
          else a.text('+' + o.v, x + s / 2, y + s / 2, s * .34, a.C.accent);
        }
      }
      var bb = bankBtn(a);
      a.fillRR(bb.x, bb.y, bb.w, bb.h, bb.h / 2, d.pot ? a.C.good : 'rgba(255,255,255,.18)');
      a.text(a.txt({ th: 'เก็บ ' + d.pot + ' คะแนน', en: 'Bank ' + d.pot }), bb.x + bb.w / 2, bb.y + bb.h / 2, a.mn * .042, d.pot ? '#04331e' : '#fff');
      a.head(a.txt({ th: 'ด่าน ' + d.lv + ' — เปิดต่อหรือเก็บคะแนน?', en: 'Level ' + d.lv + ' — keep flipping or bank?' }));
    }
  });
  function mkTiles(a) {
    var d = a.data;
    var cols = a.port ? 4 : 6, rows = a.port ? 6 : 4;
    var s = Math.min((a.W - a.mn * .1) / cols, (a.H - a.mn * .32) / rows);
    d.LO = { cols: cols, rows: rows, s: s, ox: (a.W - cols * s) / 2, oy: a.mn * .17 };
    d.t = []; d.pot = 0;
    var traps = Math.min(8, 2 + d.lv);
    for (var i = 0; i < cols * rows; i++) d.t.push({ open: 0, trap: 0, v: a.pick([10, 20, 30, 50]) });
    var placed = 0;
    while (placed < traps) { var k = a.rndi(0, cols * rows - 1); if (!d.t[k].trap) { d.t[k].trap = 1; placed++; } }
  }
  function bankBtn(a) { var w = Math.min(a.W * .6, a.mn * .5); return { x: (a.W - w) / 2, y: a.H - a.mn * .11, w: w, h: a.mn * .08 }; }

  /* ---------- 90 ตีปิญาต้า ---------- */
  R('pinata', {
    setup: function (a) {
      a.data.LO = { cx: a.W / 2, cy: a.H * .42, r: Math.min(a.W * .18, a.mn * .17) };
      a.data.hp = 1; a.data.sw = 0; a.data.hit = 0; a.data.loot = []; a.data.done = 0; a.data.bat = null; a.data.time = 0; a.data.doneT = 0; a.data.kx = 0; a.data.ky = 0;
      a.data.LOOT = [{ k: 'candy', e: '🍬' }, { k: 'candy', e: '🍭' }, { k: 'gift', e: '🎁' }, { k: 'coin', e: '🥇' }, { k: 'star', e: '⭐' }, { k: 'gem', e: '💎' }];
    },
    update: function (dt, a) {
      var d = a.data;
      d.sw += dt * 2.2;
      if (!d.done) d.time += dt;
      else { d.doneT += dt; if (d.doneT >= 2) return a.end(a.txt({ th: 'แตกแล้ว! ใช้เวลา ' + d.time.toFixed(1) + ' วินาที', en: 'Smashed in ' + d.time.toFixed(1) + ' s' })); }
      if (d.hit > 0) d.hit -= dt;
      d.loot.forEach(function (o) { o.vy += a.mn * 1.6 * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.r += dt * 4; });
      d.loot = d.loot.filter(function (o) { return o.y < a.H + a.mn * .1; });
      if (d.bat && (d.bat.t -= dt) <= 0) d.bat = null;
      d.kx *= Math.pow(.02, dt); d.ky *= Math.pow(.02, dt);   /* แรงกระแทกดันปิญาต้าไปตามทิศไม้ แล้วคืนตัว */
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      var px = L.cx + Math.sin(d.sw) * a.mn * .12;
      if (d.done) return;
      /* ไม้เหวี่ยงเข้าหาจุดที่แตะ: สุ่มทิศที่ไม้มาจาก (ซ้าย/ขวา/บน/ล่าง เฉียง ๆ) จุดหมุนอยู่ที่ปลายด้าม */
      var from = a.rnd(0, 6.2832);
      d.bat = { x: x, y: y, from: from, t: .28, dur: .28 };
      if (Math.hypot(x - px, y - L.cy) < L.r * 1.2) {
        d.hp -= .035; d.hit = .12; a.add(5); a.beep(a.rnd(300, 500), .05, 'square');
        d.kx -= Math.cos(from) * a.mn * .05; d.ky -= Math.sin(from) * a.mn * .05;
        a.shake(.008, .1);
        a.puff(x, y, { n: 6, col: a.pick(['#ff2e88', '#ffd23f', '#00d4ff', '#2fe08a']), spread: 6.28, spd: a.mn * .4, size: a.mn * .008, life: .4 });
        if (d.hp <= 0) {
          d.done = 1; a.add(150); a.beep(1300, .4, 'triangle'); a.flash('#fff', .3); a.shake(.033, .4);
          for (var i = 0; i < 40; i++) {
            var it = a.pick(d.LOOT);
            d.loot.push({ x: px, y: L.cy, vx: a.rnd(-a.mn * .6, a.mn * .6), vy: a.rnd(-a.mn * .9, -a.mn * .2), r: 0, e: it.e, k: it.k });
          }
        }
      }
    },
    draw: function (g, a) {
      a.bg('#4a0f5e', '#ff6a3d');
      var d = a.data, L = d.LO;
      var px = L.cx + Math.sin(d.sw) * a.mn * .12 + d.kx, pyk = L.cy + d.ky;
      /* เชือกผูกที่ห่วงบนหลังปิญาต้า (ตำแหน่งวัดจากภาพ: +.113, -.272 ของขนาดภาพ) หมุนตามตัว */
      var prot = Math.sin(d.sw) * .16 + (d.hit > 0 ? a.rnd(-.08, .08) : 0), ps = L.r * 2.4;
      var lx = a.hasSpr('pinata') ? .113 * ps : 0, ly = a.hasSpr('pinata') ? -.272 * ps : -L.r;
      var rx = px + lx * Math.cos(prot) - ly * Math.sin(prot), ry = pyk + lx * Math.sin(prot) + ly * Math.cos(prot);
      if (!d.done) { g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(L.cx, 0); g.lineTo(rx, ry); g.stroke(); }
      if (!d.done) {
        g.save(); g.translate(px, pyk); g.rotate(prot);
        a.spr('pinata', '🎊', 0, 0, L.r * 2.4); g.restore();
        var bw = Math.min(a.W * .55, a.mn * .5), bx = (a.W - bw) / 2, by = a.H - a.mn * .13;
        a.fillRR(bx, by, bw, a.mn * .04, a.mn * .02, 'rgba(0,0,0,.4)');
        a.fillRR(bx, by, bw * Math.max(0, d.hp), a.mn * .04, a.mn * .02, a.C.bad);
      }
      d.loot.forEach(function (o) { a.spr(o.k, o.e, o.x, o.y, a.mn * .07, { rot: o.r }); });
      /* ไม้ตี: หมุนรอบปลายด้าม (มุมล่างขวาของภาพ) กวาดจากทิศ from เข้าหาจุดกระทบแล้วเลยไปนิด */
      if (d.bat) {
        var B = d.bat, u = 1 - B.t / B.dur, hs = a.mn * .34, bi = a.sprImg('bat'), asp = bi ? bi.width / bi.height : 1, bw = hs * asp;
        var blen = .92 * Math.sqrt(bw * bw + hs * hs), pd = blen * .85;       /* ความยาวไม้ (แนวทแยงของภาพ) จุดหมุนห่างจุดกระทบ 85% ของไม้ */
        var Px = B.x + Math.cos(B.from) * pd, Py = B.y + Math.sin(B.from) * pd;
        var ease = u < .55 ? (u / .55) * (u / .55) : 1 + (u - .55) * .5;
        var tipAng = B.from + Math.PI + (-1.1 + 1.35 * ease);        /* ทิศจากจุดหมุนไปปลายไม้ */
        var r = tipAng + 3 * Math.PI / 4;                            /* ภาพ: ปลายไม้ชี้ไปมุมบนซ้าย (-135°) */
        var cxb = Px + (-.4 * bw) * Math.cos(r) - (-.4 * hs) * Math.sin(r), cyb = Py + (-.4 * bw) * Math.sin(r) + (-.4 * hs) * Math.cos(r);
        /* รอยเหวี่ยง */
        g.save(); g.strokeStyle = 'rgba(255,255,255,' + (.5 * (1 - u)) + ')'; g.lineWidth = a.mn * .012; g.lineCap = 'round';
        g.beginPath(); g.arc(Px, Py, pd, tipAng - .5, tipAng); g.stroke(); g.restore();
        if (!a.spr('bat', null, cxb, cyb, hs, { rot: r })) { g.save(); g.translate(Px, Py); g.rotate(tipAng); a.fillRR(0, -a.mn * .012, hs * .8, a.mn * .024, a.mn * .012, '#8a5a2b'); g.restore(); }
      }
      a.text(a.txt({ th: d.time.toFixed(1) + ' วิ', en: d.time.toFixed(1) + ' s' }), a.W - a.mn * .08, a.mn * .16, a.mn * .045, 'rgba(255,255,255,.85)');
      a.head(d.done ? a.txt({ th: 'แตกแล้ว! ของรางวัลกระจายเต็มจอ', en: 'Smashed! Prizes everywhere' })
        : a.txt({ th: 'แตะรัว ๆ ให้ปิญาต้าแตก', en: 'Tap fast to break the piñata' }));
    }
  });
})();
