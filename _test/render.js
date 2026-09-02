/* เรนเดอร์ทุกเกมเป็นภาพจริง (ทั้งแนวนอน/แนวตั้ง) เพื่อตรวจ layout ด้วยตา
   ใช้: node _test/render.js <land|port> <outdir>
*/
const fs = require('fs'), vm = require('vm'), path = require('path');
const { createCanvas, GlobalFonts } = require('/tmp/node_modules/@napi-rs/canvas');
const ROOT = path.join(__dirname, '..');

['kanit-thai-400-normal', 'kanit-thai-600-normal', 'kanit-thai-700-normal',
 'kanit-latin-400-normal', 'kanit-latin-600-normal', 'kanit-latin-700-normal']
  .forEach(f => GlobalFonts.registerFromPath('/tmp/fonts/' + f + '.ttf', 'Kanit'));
require('fs').readdirSync('/tmp/fonts').filter(f => f.startsWith('em-'))
  .forEach(f => GlobalFonts.registerFromPath('/tmp/fonts/' + f, 'Segoe UI Emoji'));

const ORI = process.argv[2] || 'land';
const OUT = process.argv[3] || '/tmp/shots-' + ORI;
fs.mkdirSync(OUT, { recursive: true });
const SZ = ORI === 'port' ? [720, 1280] : [1280, 720];

const brand = fs.readFileSync(path.join(ROOT, 'assets/js/brand.js'), 'utf8');
const gamesData = ['games-data.js', 'games-data-2.js', 'games-data-3.js']
  .map(f => fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8')).join('\n');
const engine = fs.readFileSync(path.join(ROOT, 'assets/js/engine.js'), 'utf8');
const packs = ['pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6', 'pack7', 'pack8', 'pack9', 'pack10']
  .map(p => fs.readFileSync(path.join(ROOT, 'games', p + '.js'), 'utf8'));

const ids = [];
{ const s = { window: {} }; s.globalThis = s; vm.createContext(s); vm.runInContext(gamesData, s); s.window.GAMES.forEach(g => ids.push(g.id)); }

function fakeEl(sel, real) {
  const e = {
    style: { setProperty() { }, removeProperty() { } }, className: '', textContent: '', innerHTML: '', href: '', value: '',
    disabled: false, dataset: {}, clientWidth: 1400, clientHeight: 820,
    classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, toggle(c, v) { v ? this.add(c) : this.remove(c); }, contains(c) { return this._s.has(c); } },
    addEventListener() { }, removeEventListener() { },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: SZ[0], height: SZ[1] }),
    querySelector: () => fakeEl('x'), querySelectorAll: () => []
  };
  e.firstElementChild = e.lastElementChild = { textContent: '' };
  if (real) e.getContext = t => real.getContext(t);
  return e;
}

function run(id, lang) {
  const cvReal = createCanvas(SZ[0], SZ[1]);
  const els = {}; const H = {};
  const MAP = { mousedown: 'down', mousemove: 'move', mouseup: 'up', touchstart: 'down', touchmove: 'move', touchend: 'up' };
  const sb = {};
  sb.window = sb; sb.globalThis = sb; sb.console = console;
  sb.Math = Math; sb.Date = Date; sb.JSON = JSON;
  sb.Image = function () { return { complete: false, naturalWidth: 0 }; };
  let clock = 0;
  sb.performance = { now: () => clock };
  sb.localStorage = { getItem: () => null, setItem: () => { } };
  sb.location = { search: `?id=${id}&lang=${lang}&o=${ORI}&sim=0`, href: '' };
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
  function mk(sel) {
    if (sel === '#cv') { const e = fakeEl(sel, cvReal); e.addEventListener = (t, fn) => { if (MAP[t]) H[MAP[t]] = fn; }; return e; }
    return fakeEl(sel);
  }
  sb.document = {
    documentElement: { lang: 'th' }, title: '', body: { style: {} },
    createElement: () => createCanvas(10, 10),
    querySelector: sel => (els[sel] = els[sel] || mk(sel)),
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
  let t = 0;
  for (let i = 0; i < 190; i++) {
    t += 16.7; clock = t;
    if (rafCb) { const cb = rafCb; rafCb = null; cb(t); }
    /* รีสตาร์ทได้เฉพาะช่วงต้น เพื่อให้เฟรมที่จับภาพมีของอยู่บนจอจริง */
    else if (i < 100 && i % 20 === 0) els['#ovGo'].onclick();
    if (i % 9 === 0) {
      const x = SZ[0] * (0.2 + Math.random() * 0.6), y = SZ[1] * (0.25 + Math.random() * 0.6);
      fire('down', x, y); fire('move', x + 12, y + 12); fire('up', x + 12, y + 12);
    }
  }
  fs.writeFileSync(path.join(OUT, id + '.png'), cvReal.toBuffer('image/png'));
}

/* node _test/render.js <land|port> <outdir> [from] [to]  (นับจาก 1) */
const FROM = parseInt(process.argv[4] || '1', 10) - 1;
const TO = parseInt(process.argv[5] || String(ids.length), 10);
const list = ids.slice(FROM, TO);
list.forEach(id => { try { run(id, 'th'); } catch (e) { console.log('ERR', id, e.message); } });
console.log('rendered', list.length, 'to', OUT);
