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
        if (d.v[0] === d.v[1] && d.v[1] === d.v[2]) { a.add(100); d.msg = a.txt({ th: 'ตองสาม! +100', en: 'TRIPLE! +100' }); a.beep(1300, .35, 'triangle'); }
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
        a.fillRR(x - L.s / 2, y - L.s / 2, L.s, L.s, L.s * .18, '#fff');
        var pips = [[], [[0, 0]], [[-1, -1], [1, 1]], [[-1, -1], [0, 0], [1, 1]],
        [[-1, -1], [1, -1], [-1, 1], [1, 1]], [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]],
        [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]][d.v[i]];
        pips.forEach(function (p) { a.circle(x + p[0] * L.s * .25, y + p[1] * L.s * .25, L.s * .08, '#1b1442'); });
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
    d.splash = .5;
    if (a.loseLife() > 0) { d.row = 0; d.x = a.W / 2; d.pad = -1; d.hop = 0; d.ht = 1; }
  }
  function riverLand(a) {
    var d = a.data, L = d.LO;
    d.row = d.trow; d.x = d.tx; d.pad = -1;
    if (d.row <= 0) return;
    if (d.row > L.rows) {                       /* ถึงฝั่งตรงข้าม */
      a.add(100 + d.round * 20); a.beep(1250, .3, 'triangle');
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
      if (dir === 0) { d.trow = Math.min(L.rows + 1, d.row + 1); d.tx = d.x; }
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
      var gr = g.createLinearGradient(0, top, 0, bot);
      gr.addColorStop(0, '#0f5f86'); gr.addColorStop(1, '#0a4767');
      g.fillStyle = gr; g.fillRect(0, top, a.W, bot - top);
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
      EM(g, '🐸', 0, 0, L.fr * 2.4); g.restore();

      a.text(a.txt({ th: 'รอบ ' + d.round + ' • แถวที่ ' + d.row + '/' + (L.rows + 1), en: 'Round ' + d.round + ' • row ' + d.row + '/' + (L.rows + 1) }),
        a.W / 2, a.H - L.bank / 2, a.mn * .036, 'rgba(255,255,255,.9)');
      a.head(a.txt({ th: 'แตะกลางจอ = กระโดดข้ามแถว • แตะขอบซ้าย-ขวา = ขยับข้าง', en: 'Tap the middle to hop forward • tap the edges to move sideways' }));
    }
  });

  /* ---------- 83 เป่ายิ้งฉุบ ---------- */
  R('rps', {
    time: 0,
    setup: function (a) { a.data.me = 0; a.data.cpu = 0; a.data.st = 'ask'; a.data.t = 0; a.data.msg = ''; a.data.pk = -1; a.data.cp = -1; },
    update: function (dt, a) {
      var d = a.data; if (d.st !== 'show') return;
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
          var r = (d.pk - d.cp + 3) % 3;
          if (r === 0) { d.msg = a.txt({ th: 'เสมอ', en: 'Draw' }); a.beep(500, .12); }
          else if (r === 1) { d.me++; a.add(20); d.msg = a.txt({ th: 'คุณชนะรอบนี้!', en: 'You win the round!' }); a.beep(1000, .18, 'triangle'); }
          else { d.cpu++; d.msg = a.txt({ th: 'คอมชนะรอบนี้', en: 'Computer wins it' }); a.beep(200, .22, 'square'); }
          d.st = 'show'; d.t = 1.3; return;
        }
      }
    },
    draw: function (g, a) {
      a.bg('#2a1150', '#0d5c8f');
      var d = a.data, E = ['✊', '✋', '✌️'];
      a.text(a.txt({ th: 'คุณ', en: 'YOU' }), a.W * .3, a.mn * .17, a.mn * .04, '#fff');
      a.text(a.txt({ th: 'คอม', en: 'CPU' }), a.W * .7, a.mn * .17, a.mn * .04, '#fff');
      a.text(d.me + '', a.W * .3, a.mn * .26, a.mn * .09, a.C.accent);
      a.text(d.cpu + '', a.W * .7, a.mn * .26, a.mn * .09, a.C.bad);
      if (d.st === 'show') {
        EM(g, E[d.pk], a.W * .3, a.H * .48, a.mn * .17);
        g.save(); g.translate(a.W * .7, a.H * .48); g.scale(-1, 1); EM(g, E[d.cp], 0, 0, a.mn * .17); g.restore();
        a.text(d.msg, a.W / 2, a.H * .64, a.mn * .06, '#fff');
      }
      for (var i = 0; i < 3; i++) {
        var b = rbtn(a, i);
        a.fillRR(b.x, b.y, b.w, b.h, b.w * .16, d.st === 'ask' ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.25)');
        EM(g, E[i], b.x + b.w / 2, b.y + b.h / 2, b.w * .5);
      }
      a.head(a.txt({ th: 'ใครถึง 5 แต้มก่อนชนะ', en: 'First to five points wins' }));
    }
  });
  function rbtn(a, i) {
    var w = Math.min(a.W * .26, a.mn * .22), gap = a.mn * .03, tot = 3 * w + 2 * gap;
    return { x: (a.W - tot) / 2 + i * (w + gap), y: a.H - a.mn * .22, w: w, h: w };
  }

  /* ---------- 84 ตู้กาชาปอง ---------- */
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
        if (d.cap.y > a.H * .78) { d.cap.y = a.H * .78; d.st = 'ready'; a.beep(700, .15); }
      }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.st === 'idle') { d.st = 'turn'; d.t = .8; d.win = ''; a.beep(350, .25, 'square'); }
      else if (d.st === 'ready') {
        var idx = Math.random() < .12 ? 4 : a.rndi(0, 5);
        d.win = d.prz[idx]; d.st = 'open'; a.beep(1200, .3, 'triangle');
      } else if (d.st === 'open') { d.st = 'idle'; d.cap = null; d.win = ''; }
    },
    draw: function (g, a) {
      a.bg('#5b1064', '#ff6a3d');
      var d = a.data;
      var mw = Math.min(a.W * .56, a.mn * .5), mx = (a.W - mw) / 2, my = a.mn * .16, mh = Math.min(a.H * .5, a.mn * .58);
      a.fillRR(mx, my, mw, mh, a.mn * .04, '#e8e8f4');
      a.fillRR(mx + mw * .08, my + mh * .08, mw * .84, mh * .48, a.mn * .03, 'rgba(120,180,255,.5)');
      for (var i = 0; i < 12; i++)
        a.circle(mx + mw * (.18 + (i % 4) * .21), my + mh * (.18 + Math.floor(i / 4) * .13), mw * .07, d.cols[i % 6]);
      a.fillRR(mx + mw * .3, my + mh * .62, mw * .4, mh * .14, a.mn * .02, '#1b1442');
      a.text(a.txt({ th: 'กาชาปอง', en: 'GACHA' }), a.W / 2, my + mh * .69, a.mn * .04, a.C.accent);
      g.save(); g.translate(a.W / 2, my + mh * .86); g.rotate(d.crank);
      a.fillRR(-a.mn * .05, -a.mn * .012, a.mn * .1, a.mn * .024, a.mn * .012, '#8d8d9e'); g.restore();
      a.circle(a.W / 2, my + mh * .86, a.mn * .02, '#5a5a6e');
      if (d.cap) {
        a.circle(d.cap.x, d.cap.y, a.mn * .07, d.cap.col);
        g.save(); a.rr(d.cap.x - a.mn * .07, d.cap.y - a.mn * .07, a.mn * .14, a.mn * .07, 0); g.clip();
        a.circle(d.cap.x, d.cap.y, a.mn * .07, 'rgba(255,255,255,.75)'); g.restore();
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
  R('hammerpower', {
    time: 0,
    setup: function (a) {
      a.data.LO = { tx: a.W / 2, top: a.mn * .16, bot: a.H - a.mn * .16 };
      a.data.p = 0; a.data.dir = 1; a.data.st = 'aim'; a.data.puck = 0; a.data.t = 0; a.data.msg = '';
    },
    update: function (dt, a) {
      var d = a.data;
      if (d.st === 'aim') { d.p += d.dir * dt * 1.5; if (d.p > 1) { d.p = 1; d.dir = -1; } if (d.p < 0) { d.p = 0; d.dir = 1; } }
      else if (d.st === 'hit') {
        d.puck += (d.power - d.puck) * Math.min(1, dt * 6);
        d.t -= dt;
        if (d.t <= 0) { d.st = 'aim'; d.puck = 0; d.msg = ''; }
      }
    },
    down: function (x, y, a) {
      var d = a.data; if (d.st !== 'aim') return;
      d.power = d.p; d.st = 'hit'; d.t = 1.6;
      var pts = Math.round(d.power * 100);
      a.add(pts);
      if (d.power > .95) { a.add(100); d.msg = a.txt({ th: 'ตีระฆัง! +100', en: 'RANG THE BELL! +100' }); a.beep(1400, .4, 'triangle'); }
      else { d.msg = '+' + pts; a.beep(300 + pts * 6, .18, 'square'); }
    },
    draw: function (g, a) {
      a.bg('#3a0f1e', '#c8461e');
      var d = a.data, L = d.LO, tw = a.mn * .13;
      a.fillRR(L.tx - tw / 2, L.top, tw, L.bot - L.top, tw * .2, 'rgba(0,0,0,.35)');
      var levels = 8;
      for (var i = 0; i < levels; i++) {
        var y = L.bot - (i + 1) * (L.bot - L.top) / levels;
        var on = d.puck > (i + .5) / levels;
        a.fillRR(L.tx - tw / 2 + 3, y + 3, tw - 6, (L.bot - L.top) / levels - 6, 4,
          on ? 'hsl(' + (i * 15) + ',85%,58%)' : 'rgba(255,255,255,.12)');
      }
      EM(g, '🔔', L.tx, L.top - a.mn * .04, a.mn * .09);
      var bw = a.mn * .05, bx = L.tx + tw, by = L.top + a.mn * .02, bh = L.bot - L.top - a.mn * .04;
      a.fillRR(bx, by, bw, bh, bw / 2, 'rgba(0,0,0,.35)');
      a.fillRR(bx, by + bh * (1 - d.p), bw, bh * d.p, bw / 2, a.C.accent);
      EM(g, '🔨', L.tx - tw, L.bot - a.mn * .04, a.mn * .1);
      if (d.msg) a.text(d.msg, a.W / 2, a.H - a.mn * .07, a.mn * .06, a.C.accent);
      a.head(d.st === 'aim' ? a.txt({ th: 'แตะตอนแถบขึ้นสูงสุด', en: 'Tap when the bar peaks' }) : a.txt({ th: 'ดูผล…', en: 'Watching…' }));
    }
  });

  /* ---------- 86 ปล่อยจรวด ---------- */
  R('rocketlaunch', {
    time: 0,
    setup: function (a) {
      a.data.LO = { Rt: a.mn * .12, Rmax: Math.min(a.W * .36, a.mn * .34) };
      a.data.r = a.data.LO.Rmax; a.data.sp = a.mn * .42; a.data.alt = 0; a.data.vy = a.mn * .3;
      a.data.msg = ''; a.data.fx = 0; a.data.fail = 0;
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      d.vy -= a.mn * .22 * dt;
      d.alt = Math.max(0, d.alt + d.vy * dt);
      a.setScore(Math.floor(d.alt / 10));
      if (d.fx > 0) d.fx -= dt;
      d.r -= d.sp * dt;
      if (d.r < L.Rt * .3) { d.r = L.Rmax; d.fail++; d.vy -= a.mn * .18; d.msg = a.txt({ th: 'พลาดจังหวะ', en: 'Missed the beat' }); a.beep(170, .2, 'square'); }
      if (d.alt <= 0 && d.vy < 0) { a.beep(140, .35, 'sawtooth'); a.end(a.txt({ th: 'จรวดตกแล้ว', en: 'The rocket came down' })); }
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      var diff = Math.abs(d.r - L.Rt);
      if (diff < L.Rt * .2) { d.vy += a.mn * .40; d.msg = a.txt({ th: 'เป๊ะ!', en: 'PERFECT!' }); a.beep(1150, .12, 'triangle'); }
      else if (diff < L.Rt * .5) { d.vy += a.mn * .22; d.msg = a.txt({ th: 'ดี', en: 'Good' }); a.beep(800, .1); }
      else { d.vy -= a.mn * .08; d.msg = a.txt({ th: 'หลุด', en: 'Off' }); a.beep(200, .16, 'square'); }
      d.r = L.Rmax; d.fx = .3; d.sp += a.mn * .012;
    },
    draw: function (g, a) {
      var alt = a.data.alt;
      var t = Math.min(1, alt / (a.mn * 12));
      a.bg('rgb(' + Math.round(80 - 70 * t) + ',' + Math.round(180 - 170 * t) + ',' + Math.round(255 - 200 * t) + ')', '#050b22');
      var d = a.data, L = d.LO, cx = a.W / 2, cy = a.H * .42;
      for (var i = 0; i < 26; i++) {
        var sx = (i * 191) % a.W, sy = ((i * 271) + alt * .3) % a.H;
        g.fillStyle = 'rgba(255,255,255,' + (t * .6) + ')'; g.fillRect(sx, sy, 2, 2);
      }
      g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .014;
      g.beginPath(); g.arc(cx, cy, L.Rt, 0, 6.29); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = a.mn * .010;
      g.beginPath(); g.arc(cx, cy, Math.max(2, d.r), 0, 6.29); g.stroke();
      /* หัวจรวดชี้ตรงขึ้น เอียงเล็กน้อยตอนกำลังตก */
      g.save(); g.translate(cx, cy); g.rotate(-Math.PI / 4 + (d.vy > 0 ? .18 : 0));
      EM(g, '🚀', 0, 0, L.Rt * 1.3); g.restore();
      if (d.fx > 0) { g.fillStyle = 'rgba(255,180,60,' + d.fx + ')'; g.beginPath(); g.arc(cx, cy + L.Rt, L.Rt * .5 * d.fx * 3, 0, 6.29); g.fill(); }
      a.text(a.txt({ th: 'ความสูง ' + Math.floor(alt / 10) + ' ม.', en: 'Altitude ' + Math.floor(alt / 10) + ' m' }),
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
      if (d.st === 'pull') { d.t -= dt; if (d.t <= 0) { d.st = 'open'; d.win = a.pick(d.prz); a.beep(1150, .3, 'triangle'); } }
    },
    down: function (x, y, a) {
      var d = a.data;
      if (d.st === 'idle') { d.st = 'pull'; d.t = .9; a.beep(400, .2, 'square'); }
      else if (d.st === 'open') { d.st = 'idle'; d.win = ''; }
    },
    draw: function (g, a) {
      a.bg('#20104a', '#2fa86f');
      var d = a.data;
      var bw = Math.min(a.W * .5, a.mn * .46), bx = (a.W - bw) / 2, by = a.H * .28, bh = bw * .8;
      g.save(); g.translate(a.W / 2, 0); g.rotate(Math.sin(d.shake) * (d.st === 'idle' ? .02 : .06)); g.translate(-a.W / 2, 0);
      a.fillRR(bx, by, bw, bh, bw * .08, '#c94f2a');
      a.fillRR(bx, by, bw, bh * .18, bw * .06, '#a33a1c');
      a.fillRR(bx + bw * .35, by + bh * .3, bw * .3, bh * .16, bw * .03, '#1b1442');
      a.text(a.txt({ th: 'จับสลาก', en: 'DRAW' }), a.W / 2, by + bh * .62, a.mn * .05, '#fff');
      g.restore();
      if (d.st === 'pull') EM(g, '✋', a.W / 2, by + bh * .35, a.mn * .1);
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
      a.data.LO = { top: a.mn * .22, lh: (a.H - a.mn * .34) / 4, finish: a.W - a.mn * .12, start: a.mn * .12 };
    },
    update: function (dt, a) {
      var d = a.data, L = d.LO;
      if (d.st !== 'race') { if (d.st === 'done') { d.t -= dt; if (d.t <= 0) { d.st = 'pick'; d.pos = [0, 0, 0, 0]; d.pick = -1; d.msg = ''; } } return; }
      for (var i = 0; i < d.n; i++) {
        d.sp[i] += (a.rnd(.6, 1.5) - d.sp[i]) * dt * 3;
        d.pos[i] += d.sp[i] * a.mn * .22 * dt;
        if (d.pos[i] >= L.finish - L.start) {
          d.st = 'done'; d.t = 2.2;
          if (i === d.pick) { a.add(100); d.msg = a.txt({ th: 'ม้าของคุณชนะ! +100', en: 'Your pick won! +100' }); a.beep(1250, .3, 'triangle'); }
          else { d.msg = a.txt({ th: 'หมายเลข ' + (i + 1) + ' เข้าก่อน', en: 'Number ' + (i + 1) + ' took it' }); a.beep(300, .2, 'square'); }
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
      var d = a.data, L = d.LO, E = ['🐎', '🐕', '🐢', '🐇'];
      var cols = ['#ff2e88', '#00d4ff', '#ffd23f', '#2fe08a'];
      for (var i = 0; i < d.n; i++) {
        var y = L.top + i * L.lh;
        g.fillStyle = i % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.10)';
        g.fillRect(0, y, a.W, L.lh);
        a.circle(a.mn * .06, y + L.lh / 2, a.mn * .035, cols[i]);
        a.text((i + 1) + '', a.mn * .06, y + L.lh / 2, a.mn * .04, '#1b1442');
        if (d.pick === i) { g.strokeStyle = a.C.accent; g.lineWidth = a.mn * .008; g.strokeRect(2, y + 2, a.W - 4, L.lh - 4); }
        EM(g, E[i], L.start + d.pos[i], y + L.lh / 2, L.lh * .6);
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
      if (o.trap) {
        d.pot = 0; a.beep(160, .4, 'sawtooth');
        d.t.forEach(function (q) { q.open = 1; });
        a.end(a.txt({ th: 'เจอกับดัก! คะแนนสะสมหายหมด', en: 'Trap! You lost the pot' }));
      } else { d.pot += o.v; a.beep(800, .09); }
    },
    draw: function (g, a) {
      a.bg('#0a2440', '#1b6ca8');
      var d = a.data, L = d.LO;
      for (var i = 0; i < d.t.length; i++) {
        var c = i % L.cols, r = Math.floor(i / L.cols), o = d.t[i];
        var x = L.ox + c * L.s + 2, y = L.oy + r * L.s + 2, s = L.s - 4;
        if (!o.open) {
          a.fillRR(x, y, s, s, L.s * .12, '#2a3f6e');
          a.text('?', x + s / 2, y + s / 2, s * .45, 'rgba(255,255,255,.45)');
        } else {
          a.fillRR(x, y, s, s, L.s * .12, o.trap ? a.C.bad : 'rgba(255,215,63,.22)');
          if (o.trap) a.text('✸', x + s / 2, y + s / 2, s * .5, '#fff');
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
      a.data.hp = 1; a.data.sw = 0; a.data.hit = 0; a.data.loot = []; a.data.done = 0;
    },
    update: function (dt, a) {
      var d = a.data;
      d.sw += dt * 2.2;
      if (d.hit > 0) d.hit -= dt;
      d.loot.forEach(function (o) { o.vy += a.mn * 1.6 * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.r += dt * 4; });
      d.loot = d.loot.filter(function (o) { return o.y < a.H + a.mn * .1; });
    },
    down: function (x, y, a) {
      var d = a.data, L = d.LO;
      var px = L.cx + Math.sin(d.sw) * a.mn * .12;
      if (d.done) return;
      if (Math.hypot(x - px, y - L.cy) < L.r * 1.2) {
        d.hp -= .035; d.hit = .12; a.add(5); a.beep(a.rnd(300, 500), .05, 'square');
        if (d.hp <= 0) {
          d.done = 1; a.add(150); a.beep(1300, .4, 'triangle');
          for (var i = 0; i < 40; i++)
            d.loot.push({ x: px, y: L.cy, vx: a.rnd(-a.mn * .6, a.mn * .6), vy: a.rnd(-a.mn * .9, -a.mn * .2), r: 0, e: a.pick(['🍬', '🍭', '🎁', '🥇', '⭐']) });
        }
      }
    },
    draw: function (g, a) {
      a.bg('#4a0f5e', '#ff6a3d');
      var d = a.data, L = d.LO;
      var px = L.cx + Math.sin(d.sw) * a.mn * .12;
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(L.cx, 0); g.lineTo(px, L.cy - L.r); g.stroke();
      if (!d.done) {
        g.save(); g.translate(px, L.cy); g.rotate(Math.sin(d.sw) * .16 + (d.hit > 0 ? a.rnd(-.08, .08) : 0));
        EM(g, '🎊', 0, 0, L.r * 2.2); g.restore();
        var bw = Math.min(a.W * .55, a.mn * .5), bx = (a.W - bw) / 2, by = a.H - a.mn * .13;
        a.fillRR(bx, by, bw, a.mn * .04, a.mn * .02, 'rgba(0,0,0,.4)');
        a.fillRR(bx, by, bw * Math.max(0, d.hp), a.mn * .04, a.mn * .02, a.C.bad);
      }
      d.loot.forEach(function (o) { g.save(); g.translate(o.x, o.y); g.rotate(o.r); EM(g, o.e, 0, 0, a.mn * .06); g.restore(); });
      a.head(d.done ? a.txt({ th: 'แตกแล้ว! ของรางวัลกระจายเต็มจอ', en: 'Smashed! Prizes everywhere' })
        : a.txt({ th: 'แตะรัว ๆ ให้ปิญาต้าแตก', en: 'Tap fast to break the piñata' }));
    }
  });
})();
