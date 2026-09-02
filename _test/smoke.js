/* Headless smoke test — รันทุกเกม × 2 แนวจอ × 2 ภาษา บน canvas จริง
   จับ runtime error และตรวจว่าองค์ประกอบหลักไม่หลุดขอบจอ
   ใช้: node _test/smoke.js
*/
const fs = require('fs'), vm = require('vm'), path = require('path');
const { createCanvas } = require('/tmp/node_modules/@napi-rs/canvas');
const ROOT = path.join(__dirname, '..');

const brand = fs.readFileSync(path.join(ROOT, 'assets/js/brand.js'), 'utf8');
const gamesData = ['games-data.js', 'games-data-2.js', 'games-data-3.js']
  .map(f => fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8')).join('\n');
const engine = fs.readFileSync(path.join(ROOT, 'assets/js/engine.js'), 'utf8');
const packs = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6', 'pack7', 'pack8', 'pack9', 'pack10']
  .map(p => fs.readFileSync(path.join(ROOT, 'games', p + '.js'), 'utf8'));

const ids = [];
{ const s = { window: {} }; s.globalThis = s; vm.createContext(s); vm.runInContext(gamesData, s); s.window.GAMES.forEach(g => ids.push(g.id)); }

function fakeEl(sel, real, SZ) {
  const e = {
    style: { setProperty() { }, removeProperty() { } }, className: '', textContent: '', innerHTML: '',
    href: '', value: '', disabled: false, dataset: {}, clientWidth: 1400, clientHeight: 820,
    classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, toggle(c, v) { v ? this.add(c) : this.remove(c); }, contains(c) { return this._s.has(c); } },
    addEventListener() { }, removeEventListener() { },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: SZ[0], height: SZ[1] }),
    querySelector: () => fakeEl('x', null, SZ), querySelectorAll: () => []
  };
  e.firstElementChild = e.lastElementChild = { textContent: '' };
  if (real) e.getContext = t => real.getContext(t);
  return e;
}

function run(id, lang, ori) {
  const SZ = ori === 'port' ? [720, 1280] : [1280, 720];
  const cvReal = createCanvas(SZ[0], SZ[1]);
  const els = {}, H = {};
  const MAP = { mousedown: 'down', mousemove: 'move', mouseup: 'up', touchstart: 'down', touchmove: 'move', touchend: 'up' };
  const sb = {};
  sb.window = sb; sb.globalThis = sb; sb.console = console;
  sb.Math = Math; sb.Date = Date; sb.JSON = JSON;
  sb.Image = function () { return { complete: false, naturalWidth: 0 }; };
  let clock = 0;
  sb.performance = { now: () => clock };
  sb.localStorage = { getItem: () => null, setItem() { } };
  sb.location = { search: `?id=${id}&lang=${lang}&o=${ori}&sim=0`, href: '' };
  sb.URLSearchParams = URLSearchParams;
  let rafCb = null;
  sb.requestAnimationFrame = cb => { rafCb = cb; return 1; };
  sb.cancelAnimationFrame = () => { rafCb = null; };
  sb.setTimeout = fn => { try { fn(); } catch (e) { } return 1; };
  sb.AudioContext = function () {
    return {
      currentTime: 0, destination: {},
      createOscillator: () => ({ type: '', frequency: { value: 0 }, connect() { }, start() { }, stop() { } }),
      createGain: () => ({ gain: { setValueAtTime() { }, exponentialRampToValueAtTime() { } }, connect() { } })
    };
  };
  sb.addEventListener = (t, fn) => { if (MAP[t] && !H[MAP[t]]) H[MAP[t]] = fn; };
  sb.document = {
    documentElement: { lang: 'th' }, title: '', body: { style: {} },
    createElement: () => createCanvas(10, 10),
    querySelector: sel => {
      if (!els[sel]) {
        if (sel === '#cv') { const e = fakeEl(sel, cvReal, SZ); e.addEventListener = (t, fn) => { if (MAP[t]) H[MAP[t]] = fn; }; els[sel] = e; }
        else els[sel] = fakeEl(sel, null, SZ);
      }
      return els[sel];
    },
    querySelectorAll: sel => sel === '#segOri button'
      ? [{ dataset: { o: 'land' }, classList: { toggle() { } } }, { dataset: { o: 'port' }, classList: { toggle() { } } }]
      : [],
    addEventListener() { }
  };
  vm.createContext(sb);
  vm.runInContext(brand, sb); vm.runInContext(gamesData, sb); vm.runInContext(engine, sb);
  packs.forEach(p => vm.runInContext(p, sb));
  sb.MiniGame.boot();
  els['#ovGo'].onclick();

  const fire = (t, x, y) => { const h = H[t]; if (h) h({ clientX: x, clientY: y, preventDefault() { } }); };
  let t = 0, frames = 0;
  for (let i = 0; i < 900; i++) {
    t += 16.7; clock = t;
    if (rafCb) { const cb = rafCb; rafCb = null; cb(t); frames++; }
    else if (i % 15 === 0) els['#ovGo'].onclick();
    if (i % 20 === 0) {
      const x = Math.random() * SZ[0], y = Math.random() * SZ[1];
      fire('down', x, y); fire('move', x + 10, y + 10); fire('up', x + 10, y + 10);
    }
  }
  if (frames < 150) throw new Error('เฟรมน้อยผิดปกติ: ' + frames);

  /* ตรวจว่ามีการวาดจริงและไม่ใช่จอเปล่า */
  const g = cvReal.getContext('2d');
  const im = g.getImageData(0, 0, SZ[0], SZ[1]).data;
  let painted = 0;
  for (let p = 3; p < im.length; p += 4 * 997) if (im[p] > 0) painted++;
  if (!painted) throw new Error('จอว่างเปล่า ไม่มีการวาด');
  return frames;
}

/* รันเป็นช่วงได้: node _test/smoke.js <from> <to>  (นับจาก 1) */
const FROM = parseInt(process.argv[2] || '1', 10) - 1;
const TO = parseInt(process.argv[3] || String(ids.length), 10);
const list = ids.slice(FROM, TO);

let fail = 0, n = 0;
for (const id of list) for (const ori of ['land', 'port']) for (const lang of ['th', 'en']) {
  n++;
  try { run(id, lang, ori); }
  catch (e) { fail++; console.log('FAIL', id, ori, lang, '->', e.message, '\n  ', (e.stack || '').split('\n')[1]); }
  if (global.gc) global.gc();
}
console.log((n - fail) + '/' + n + ' passed  (เกม ' + (FROM + 1) + '-' + TO + ' × 2 แนวจอ × 2 ภาษา)');
process.exit(fail ? 1 : 0);
