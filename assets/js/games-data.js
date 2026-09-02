/* ============================================================
   GAMES DATA — ข้อมูล 30 เกม (ไทย / อังกฤษ)
   ============================================================ */

window.DEVICES = {
  touch:  { th: "จอทัชสกรีน 32–86 นิ้ว", en: "Touchscreen 32–86\"" },
  kiosk:  { th: "ตู้คีออสก์ / ตู้เกมแนวตั้ง", en: "Kiosk / Standing booth" },
  tablet: { th: "แท็บเล็ต / iPad", en: "Tablet / iPad" },
  mobile: { th: "มือถือ (สแกน QR เล่น)", en: "Mobile (QR to play)" },
  pc:     { th: "โน้ตบุ๊ก / PC (เมาส์)", en: "Laptop / PC (mouse)" },
  tv:     { th: "จอ TV + เมาส์ไร้สาย", en: "TV + wireless mouse" },
  led:    { th: "จอ LED ใหญ่ (ฉายคะแนน)", en: "Large LED (score wall)" }
};

window.CATS = {
  action:  { th: "แอ็กชัน / ไว",  en: "Action / Reflex" },
  luck:    { th: "เสี่ยงโชค",     en: "Luck & Prize" },
  brain:   { th: "ใช้สมอง",       en: "Brain" },
  arcade:  { th: "อาร์เคด",       en: "Arcade" },
  skill:   { th: "ทักษะ / แม่นยำ", en: "Skill / Aim" },
  versus:  { th: "2 ผู้เล่น",      en: "2 Players" }
};

window.GAMES = [
/* ---------- หน้า 1 ---------- */
{
  id: "whack", icon: "🔨", cat: "action", c1: "#ff6a3d", c2: "#ffd23f", time: 30,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ตีตัวตุ่น",
    tag: "แตะให้ไว ทำคะแนนใน 30 วินาที",
    how: ["ตัวตุ่นจะโผล่ขึ้นจากหลุมแบบสุ่ม","แตะที่ตัวตุ่นให้ทันก่อนมันมุดลง +10 คะแนน","แตะโดนระเบิดสีดำ −15 คะแนน","เล่น 30 วินาที ทำคะแนนให้สูงสุด"],
    custom: ["เปลี่ยนตัวละครที่โผล่ (เช่น มาสคอตแบรนด์)","เปลี่ยนภาพพื้นดิน/หลุม","ใส่โลโก้มุมบนซ้าย","เปลี่ยนชุดสีทั้งเกม","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Whack-a-Mole",
    tag: "Tap fast, score in 30 seconds",
    how: ["Moles pop up from random holes","Tap a mole before it hides: +10 points","Tapping a bomb: −15 points","30-second run, get the highest score"],
    custom: ["Swap the pop-up character (brand mascot)","Change ground / hole artwork","Add your logo top-left","Recolor the whole game","Replace the background image"] }
},
{
  id: "balloon", icon: "🎈", cat: "action", c1: "#ff2e88", c2: "#7b2ff7", time: 30,
  devices: ["touch","kiosk","tablet","mobile","pc","led"],
  th: { name: "ปาลูกโป่ง",
    tag: "แตะลูกโป่งให้แตกก่อนลอยพ้นจอ",
    how: ["ลูกโป่งลอยขึ้นจากด้านล่างเรื่อย ๆ","แตะเพื่อทำให้แตก +10 คะแนน","ลูกโป่งสีทองพิเศษ +50 คะแนน","ระวังลูกโป่งหนามสีดำ −20 คะแนน"],
    custom: ["เปลี่ยนรูปลูกโป่งเป็นสินค้า/โลโก้","เปลี่ยนสีลูกโป่งแต่ละแบบ","ใส่โลโก้ลอยบนลูกโป่งทอง","เปลี่ยนภาพพื้นหลัง (ท้องฟ้า/งานอีเวนต์)"] },
  en: { name: "Balloon Pop",
    tag: "Pop balloons before they float away",
    how: ["Balloons rise from the bottom","Tap to pop: +10 points","Golden balloon: +50 points","Avoid the spiky black one: −20 points"],
    custom: ["Replace balloons with your product/logo","Recolor each balloon type","Put your logo on the golden balloon","Change the background scene"] }
},
{
  id: "memory", icon: "🃏", cat: "brain", c1: "#00d4ff", c2: "#2fe08a", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "จับคู่การ์ด",
    tag: "พลิกการ์ดหาคู่ที่เหมือนกัน",
    how: ["การ์ด 12 ใบคว่ำหน้าอยู่","แตะเปิดทีละ 2 ใบ","ถ้าเหมือนกันจะติดค้าง +20 คะแนน","จับคู่ครบทุกใบภายในเวลาที่กำหนด"],
    custom: ["เปลี่ยนภาพหน้าการ์ดเป็นสินค้า 6 แบบ","เปลี่ยนลายหลังการ์ดเป็นโลโก้","เปลี่ยนสีกรอบ/พื้นโต๊ะ","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Memory Match",
    tag: "Flip cards, find the pairs",
    how: ["12 cards face down","Tap to flip two at a time","Matching pair stays open: +20 points","Clear the board before time runs out"],
    custom: ["Card faces = your 6 products","Card back = your logo","Frame / table colors","Background image"] }
},
{
  id: "catchfruit", icon: "🧺", cat: "arcade", c1: "#2fe08a", c2: "#ffd23f", time: 40,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "รับผลไม้",
    tag: "ลากตะกร้ารับของที่ตกลงมา",
    how: ["ลากนิ้วซ้าย-ขวาเพื่อขยับตะกร้า","รับผลไม้ได้ +10 คะแนน","หลบระเบิด ถ้าโดนเสียชีวิต 1 ดวง","เสียครบ 3 ดวงหรือหมดเวลาจบเกม"],
    custom: ["เปลี่ยนตะกร้าเป็นถุงช้อปปิ้ง/กล่องแบรนด์","เปลี่ยนของที่ตกเป็นสินค้าจริง","ใส่โลโก้บนตะกร้า","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Catch the Drops",
    tag: "Drag the basket, catch the goods",
    how: ["Slide left/right to move the basket","Catch an item: +10 points","Dodge bombs — one hit costs a life","3 lives or time out ends the game"],
    custom: ["Basket → your shopping bag / box","Falling items → your products","Logo on the basket","Background image"] }
},
{
  id: "tapspeed", icon: "⚡", cat: "action", c1: "#ffd23f", c2: "#ff6a3d", time: 10,
  devices: ["touch","kiosk","tablet","mobile","pc","led"],
  th: { name: "กดเร็วจี๊ด",
    tag: "กดปุ่มให้ได้มากที่สุดใน 10 วินาที",
    how: ["แตะปุ่มกลางจอรัว ๆ","นับจำนวนครั้งภายใน 10 วินาที","มีแถบพลังแสดงความเร็วแบบเรียลไทม์","เหมาะทำเป็นเกมแข่งชิงรางวัลหน้าบูธ"],
    custom: ["เปลี่ยนปุ่มเป็นโลโก้/สินค้า","เปลี่ยนสีแถบพลัง","ข้อความให้กำลังใจ","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Tap Rush",
    tag: "Most taps in 10 seconds wins",
    how: ["Hammer the big button","Counts taps for 10 seconds","Live power bar shows your speed","Great for booth leaderboards"],
    custom: ["Button → your logo / product","Power-bar colors","Cheer text","Background image"] }
},
{
  id: "reaction", icon: "🚦", cat: "action", c1: "#7b2ff7", c2: "#00d4ff", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "วัดปฏิกิริยา",
    tag: "จอเปลี่ยนสีเมื่อไหร่ ให้แตะทันที",
    how: ["รอจนจอเปลี่ยนเป็นสีเขียว","แตะให้เร็วที่สุด ระบบวัดเป็นมิลลิวินาที","แตะก่อนสัญญาณถือว่าฟาวล์","เล่น 5 รอบ แล้วเฉลี่ยผล"],
    custom: ["เปลี่ยนสีสัญญาณ","เปลี่ยนไอคอนกลางจอเป็นโลโก้","ข้อความผลลัพธ์","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Reaction Test",
    tag: "Tap the instant it turns green",
    how: ["Wait for the screen to turn green","Tap as fast as you can — measured in ms","Tapping early is a foul","5 rounds, averaged"],
    custom: ["Signal colors","Center icon → your logo","Result wording","Background image"] }
},
{
  id: "simon", icon: "🎵", cat: "brain", c1: "#ff2e88", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "จำลำดับสี",
    tag: "จำแล้วกดตามลำดับให้ถูก",
    how: ["ระบบไล่ไฟทีละสี พร้อมเสียง","กดตามลำดับเดิมให้ครบ","ผ่านแต่ละรอบ ลำดับจะยาวขึ้นทีละ 1","กดผิดจบเกมทันที"],
    custom: ["เปลี่ยนสีปุ่มทั้ง 4","เปลี่ยนปุ่มเป็นไอคอนสินค้า","ใส่โลโก้กลางวงกลม","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Color Memory",
    tag: "Repeat the sequence",
    how: ["Pads light up in order with sound","Tap them back in the same order","Each round adds one more step","One mistake ends the run"],
    custom: ["Colors of the 4 pads","Pads → product icons","Logo in the center hub","Background image"] }
},
{
  id: "wheel", icon: "🎡", cat: "luck", c1: "#ff6a3d", c2: "#ff2e88", time: 0,
  devices: ["touch","kiosk","tablet","pc","tv","led"],
  th: { name: "วงล้อเสี่ยงโชค",
    tag: "หมุนวงล้อลุ้นรางวัล",
    how: ["แตะปุ่ม SPIN เพื่อหมุนวงล้อ","วงล้อค่อย ๆ ชะลอและหยุดที่ช่องรางวัล","แสดงรางวัลที่ได้พร้อมเอฟเฟกต์","เล่นซ้ำได้ไม่จำกัด"],
    custom: ["ตั้งชื่อรางวัลแต่ละช่องได้เอง","จำนวนช่อง 6/8/12 ช่อง","สีแต่ละช่อง + สีเข็ม","โลโก้ตรงดุมกลางวงล้อ","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Spin the Wheel",
    tag: "Spin to win a prize",
    how: ["Tap SPIN to launch the wheel","It decelerates and lands on a slice","Prize is revealed with effects","Replay as many times as you like"],
    custom: ["Prize label per slice","6 / 8 / 12 slices","Slice + pointer colors","Logo on the center hub","Background image"] }
},
{
  id: "slot", icon: "🎰", cat: "luck", c1: "#ffd23f", c2: "#ff2e88", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "สล็อตแมชชีน",
    tag: "หมุน 3 ช่อง ให้ออกเหมือนกัน",
    how: ["แตะปุ่ม SPIN ให้วงล้อ 3 แถวหมุน","วงล้อหยุดทีละแถวจากซ้ายไปขวา","ออกเหมือนกัน 3 ตัว = แจ็กพอต","ออกเหมือนกัน 2 ตัว = ได้รางวัลปลอบใจ"],
    custom: ["เปลี่ยนสัญลักษณ์ 6 แบบเป็นสินค้า","เปลี่ยนกรอบตู้/สีตู้","ใส่โลโก้บนหัวตู้","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Slot Machine",
    tag: "Match three to hit the jackpot",
    how: ["Tap SPIN to roll three reels","Reels stop left to right","Three of a kind = jackpot","Two of a kind = small prize"],
    custom: ["6 symbols → your products","Cabinet frame + colors","Logo on the cabinet header","Background image"] }
},
{
  id: "scratch", icon: "🎫", cat: "luck", c1: "#00d4ff", c2: "#7b2ff7", time: 0,
  devices: ["touch","kiosk","tablet","mobile"],
  th: { name: "บัตรขูด",
    tag: "ลากนิ้วขูดบัตรลุ้นรางวัล",
    how: ["ลากนิ้วบนบัตรเพื่อขูดสีเงินออก","ขูดครบ 55% ระบบจะเปิดผลให้อัตโนมัติ","ลุ้นรางวัลใต้บัตร","กดใบใหม่เพื่อเล่นซ้ำ"],
    custom: ["เปลี่ยนภาพชั้นขูด (ลายแบรนด์)","เปลี่ยนรายการรางวัล","สีบัตร/กรอบบัตร","โลโก้บนบัตร","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Scratch Card",
    tag: "Scratch to reveal your prize",
    how: ["Drag your finger to scratch the foil","At 55% scratched it auto-reveals","See what you won underneath","Tap for a fresh card"],
    custom: ["Foil artwork (brand pattern)","Prize list","Card + frame colors","Logo on the card","Background image"] }
},

/* ---------- หน้า 2 ---------- */
{
  id: "quiz", icon: "❓", cat: "brain", c1: "#7b2ff7", c2: "#ff2e88", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "ตอบคำถามชิงรางวัล",
    tag: "4 ตัวเลือก ตอบให้ถูกให้ได้มากที่สุด",
    how: ["คำถามแสดงทีละข้อ พร้อม 4 ตัวเลือก","แตะคำตอบที่คิดว่าถูก","ตอบถูก +20 คะแนน ตอบผิดข้ามข้อ","ตอบให้ได้มากที่สุดใน 60 วินาที"],
    custom: ["ใส่ชุดคำถาม-คำตอบของแบรนด์เอง","เปลี่ยนสีปุ่มตัวเลือก","ใส่โลโก้เหนือคำถาม","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Quiz Challenge",
    tag: "Four choices — how many can you get?",
    how: ["One question at a time, 4 options","Tap the answer you think is right","Correct +20, wrong skips ahead","Score as much as you can in 60s"],
    custom: ["Your own question bank","Answer-button colors","Logo above the question","Background image"] }
},
{
  id: "oddone", icon: "🔍", cat: "brain", c1: "#2fe08a", c2: "#00d4ff", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "หาตัวที่แตกต่าง",
    tag: "ในตารางมี 1 ช่องที่สีต่างจากเพื่อน",
    how: ["ตารางสี่เหลี่ยมสีเดียวกันทั้งหมด ยกเว้น 1 ช่อง","แตะช่องที่สีต่าง +15 คะแนน","ผ่านแต่ละรอบ ตารางจะถี่ขึ้นและสีต่างน้อยลง","แตะผิด −5 คะแนน"],
    custom: ["เปลี่ยนช่องสี่เหลี่ยมเป็นไอคอน/โลโก้","เปลี่ยนชุดสีที่ใช้สุ่ม","เปลี่ยนสีพื้นตาราง","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Odd One Out",
    tag: "One tile is a slightly different shade",
    how: ["A grid of identical tiles, except one","Tap the odd tile: +15 points","Each round the grid grows, the gap shrinks","Wrong tap: −5 points"],
    custom: ["Tiles → icons / your logo","Random color palette","Grid background","Background image"] }
},
{
  id: "slidepuzzle", icon: "🧩", cat: "brain", c1: "#ff6a3d", c2: "#ffd23f", time: 90,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "จิ๊กซอว์เลื่อน",
    tag: "เลื่อนชิ้นส่วนให้เรียงเป็นภาพสมบูรณ์",
    how: ["ภาพถูกตัดเป็น 9 ช่อง เว้นว่าง 1 ช่อง","แตะชิ้นที่ติดกับช่องว่างเพื่อเลื่อน","เรียงให้ครบเป็นภาพเดิมภายในเวลา","ยิ่งใช้ตาน้อย คะแนนยิ่งสูง"],
    custom: ["เปลี่ยนภาพจิ๊กซอว์เป็นภาพสินค้า/โลโก้","ขนาด 3×3 หรือ 4×4","สีกรอบชิ้นส่วน","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Slide Puzzle",
    tag: "Slide the tiles back into the picture",
    how: ["The picture is cut into 9 tiles, one blank","Tap a tile next to the blank to slide it","Restore the image before time runs out","Fewer moves = higher score"],
    custom: ["Puzzle image → your product / logo","3×3 or 4×4 grid","Tile border color","Background image"] }
},
{
  id: "breakout", icon: "🧱", cat: "arcade", c1: "#00d4ff", c2: "#2fe08a", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ทุบบล็อก",
    tag: "ลากแป้นรับลูกบอลทุบบล็อกให้หมด",
    how: ["ลากนิ้วซ้าย-ขวาเพื่อขยับแป้น","ลูกบอลเด้งไปทุบบล็อกด้านบน +10 คะแนน","ลูกตกพื้นเสียชีวิต 1 ดวง (มี 3 ดวง)","ทุบบล็อกครบทุกก้อนคือชนะ"],
    custom: ["เปลี่ยนสีบล็อกแต่ละแถว","เปลี่ยนลูกบอลเป็นโลโก้กลม","เปลี่ยนสีแป้น","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Brick Breaker",
    tag: "Bounce the ball, clear every brick",
    how: ["Slide to move the paddle","The ball bounces up and smashes bricks: +10","Missing the ball costs a life (3 total)","Clear all bricks to win"],
    custom: ["Brick color per row","Ball → round logo","Paddle color","Background image"] }
},
{
  id: "hoops", icon: "🏀", cat: "skill", c1: "#ff6a3d", c2: "#ff2e88", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ชู้ตบาส",
    tag: "ลากนิ้วเล็งแรงและทิศ แล้วปล่อยยิง",
    how: ["ลากนิ้วลงจากลูกบอลเพื่อเล็ง","เส้นประบอกแนววิถี ยิ่งลากไกลยิ่งแรง","ปล่อยนิ้วเพื่อยิง ลงห่วง +30 คะแนน","ห่วงจะเลื่อนซ้าย-ขวาเพิ่มความยาก"],
    custom: ["เปลี่ยนลูกบอลเป็นสินค้า/โลโก้","เปลี่ยนสีห่วง+แป้น","เปลี่ยนสนามพื้นหลัง","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Hoop Shot",
    tag: "Drag to aim, release to shoot",
    how: ["Drag down from the ball to aim","Dotted line shows the arc; longer drag = more power","Release to shoot — a basket is +30","The hoop slides sideways to raise difficulty"],
    custom: ["Ball → product / logo","Hoop + backboard colors","Court artwork","Background image"] }
},
{
  id: "archery", icon: "🎯", cat: "skill", c1: "#ffd23f", c2: "#2fe08a", time: 40,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ยิงเป้าธนู",
    tag: "แตะจังหวะให้ตรงวงกลางเป้า",
    how: ["เป้าเลื่อนขึ้น-ลงตลอดเวลา","แตะเพื่อยิงลูกศร","โดนวงกลาง +50 / วงกลาง ๆ +20 / วงนอก +10","ยิงพลาด 3 ครั้งจบเกม"],
    custom: ["เปลี่ยนหน้าเป้าเป็นโลโก้","สีวงเป้าแต่ละชั้น","เปลี่ยนลูกศรเป็นไอคอนอื่น","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Target Shoot",
    tag: "Time your tap for the bullseye",
    how: ["The target keeps moving up and down","Tap to fire an arrow","Bullseye +50 / mid ring +20 / outer +10","Three misses ends the game"],
    custom: ["Target face → your logo","Ring colors","Arrow → any icon","Background image"] }
},
{
  id: "flappy", icon: "🐦", cat: "arcade", c1: "#2ec7ff", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "นกบินลอดท่อ",
    tag: "แตะเพื่อบิน ลอดช่องว่างให้ได้มากที่สุด",
    how: ["แตะจอเพื่อให้ตัวละครกระพือปีกขึ้น","ปล่อยไว้ตัวละครจะร่วงลง","ลอดผ่านช่องว่างได้ +10 คะแนน","ชนท่อหรือพื้นจบเกม"],
    custom: ["เปลี่ยนตัวละครเป็นมาสคอตแบรนด์","เปลี่ยนสี/ลายท่อ","เปลี่ยนฉากพื้นหลัง (เมือง/ทะเล)","ใส่โลโก้มุมจอ"] },
  en: { name: "Flappy Flyer",
    tag: "Tap to fly, slip through the gaps",
    how: ["Tap to flap upward","Let go and gravity pulls you down","Each gap cleared: +10 points","Hitting a pipe or the ground ends the run"],
    custom: ["Character → brand mascot","Pipe color / pattern","Background scene (city, sea…)","Logo in the corner"] }
},
{
  id: "runner", icon: "🏃", cat: "arcade", c1: "#ff2e88", c2: "#7b2ff7", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "วิ่งกระโดด",
    tag: "แตะเพื่อกระโดดข้ามสิ่งกีดขวาง",
    how: ["ตัวละครวิ่งไปข้างหน้าเองตลอดเวลา","แตะจอเพื่อกระโดด","ข้ามสิ่งกีดขวางได้ +10 คะแนน","ยิ่งเล่นนานความเร็วยิ่งเพิ่ม"],
    custom: ["เปลี่ยนตัวละครวิ่ง","เปลี่ยนสิ่งกีดขวางเป็นวัตถุแบรนด์","เปลี่ยนฉาก/พื้นถนน","ใส่โลโก้บนป้ายข้างทาง"] },
  en: { name: "Jump Runner",
    tag: "Tap to jump the obstacles",
    how: ["Your character auto-runs forward","Tap anywhere to jump","Each obstacle cleared: +10 points","Speed ramps up the longer you survive"],
    custom: ["Runner character","Obstacles → brand objects","Scenery / ground","Logo on roadside signs"] }
},
{
  id: "maze", icon: "🌀", cat: "skill", c1: "#7b2ff7", c2: "#00d4ff", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เขาวงกต",
    tag: "ลากนิ้วพาตัวละครออกจากเขาวงกต",
    how: ["ลากนิ้วจากจุดเริ่มต้นสีเขียว","เดินตามทางโดยไม่ชนกำแพง","ถึงธงปลายทางเพื่อผ่านด่าน","ผ่านด่านแล้วจะสุ่มเขาวงกตใหม่ที่ยากขึ้น"],
    custom: ["เปลี่ยนตัวละครที่เดิน","เปลี่ยนสีกำแพง/ทางเดิน","เปลี่ยนไอคอนเป้าหมายเป็นสินค้า","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Maze Run",
    tag: "Drag your way out of the maze",
    how: ["Drag from the green start point","Follow the corridors without touching walls","Reach the flag to clear the level","Each new level generates a harder maze"],
    custom: ["Walking character","Wall / path colors","Goal icon → your product","Background image"] }
},
{
  id: "linematch", icon: "🔗", cat: "brain", c1: "#2fe08a", c2: "#ffd23f", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "โยงเส้นจับคู่",
    tag: "ลากเส้นจับคู่ซ้าย-ขวาให้ถูกต้อง",
    how: ["มีไอคอนคอลัมน์ซ้ายและขวาสลับตำแหน่ง","ลากนิ้วจากซ้ายไปหาคู่ที่ถูกทางขวา","จับคู่ถูก +25 คะแนน เส้นจะติดค้าง","จับคู่ครบทุกคู่เพื่อไปรอบถัดไป"],
    custom: ["เปลี่ยนไอคอนเป็นสินค้า–ราคา / โลโก้–สโลแกน","เปลี่ยนสีเส้นเชื่อม","เปลี่ยนสีการ์ดสองฝั่ง","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Line Match",
    tag: "Drag a line to connect the right pairs",
    how: ["Icons on the left, shuffled matches on the right","Drag from left to its partner on the right","Correct match: +25 and the line locks in","Clear all pairs to advance"],
    custom: ["Icons → product–price / logo–slogan","Connector line color","Card colors on both sides","Background image"] }
},

/* ---------- หน้า 3 ---------- */
{
  id: "sortbin", icon: "♻️", cat: "brain", c1: "#2fe08a", c2: "#00d4ff", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "แยกประเภทลงถัง",
    tag: "ลากของลงถังให้ถูกประเภท",
    how: ["ของจะโผล่กลางจอทีละชิ้น","ลากไปหย่อนลงถังที่ถูกประเภท","ถูก +20 คะแนน ผิด −10 คะแนน","เหมาะทำเป็นเกมให้ความรู้/CSR"],
    custom: ["เปลี่ยนของ + ถังเป็นหมวดหมู่ของแบรนด์","เปลี่ยนสีถังทั้ง 3 ใบ","ใส่โลโก้บนถัง","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Sort It Out",
    tag: "Drag each item into the right bin",
    how: ["One item appears at a time","Drag it into the matching bin","Correct +20, wrong −10","Perfect for educational / CSR activations"],
    custom: ["Items + bins → your own categories","Colors of the 3 bins","Logo on the bins","Background image"] }
},
{
  id: "stack", icon: "🏗️", cat: "skill", c1: "#ffd23f", c2: "#ff6a3d", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","led"],
  th: { name: "วางบล็อกซ้อน",
    tag: "แตะให้บล็อกตรงกันซ้อนเป็นหอสูง",
    how: ["บล็อกเลื่อนไปมาด้านบนกองหอ","แตะเพื่อวางลง ส่วนที่เกินจะหลุดหาย","วางตรงเป๊ะได้โบนัส +30 คะแนน","บล็อกเหลือ 0 ความกว้าง = จบเกม"],
    custom: ["เปลี่ยนสีไล่เฉดของบล็อกแต่ละชั้น","เปลี่ยนบล็อกเป็นกล่องสินค้า","ใส่โลโก้บนบล็อกทุกชั้น","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Stack Tower",
    tag: "Tap to drop each block dead-centre",
    how: ["A block slides above the tower","Tap to drop it — the overhang falls away","A perfect drop gives +30 bonus","When the block shrinks to nothing, it's over"],
    custom: ["Gradient color per layer","Blocks → product boxes","Logo on every block","Background image"] }
},
{
  id: "timingbar", icon: "⏱️", cat: "action", c1: "#ff2e88", c2: "#00d4ff", time: 30,
  devices: ["touch","kiosk","tablet","mobile","pc","led"],
  th: { name: "หยุดเข็มให้ตรงกลาง",
    tag: "แตะหยุดเข็มในโซนสีเขียว",
    how: ["เข็มวิ่งไป-กลับบนแถบด้วยความเร็วสูง","แตะเพื่อหยุดเข็ม","หยุดในโซนเขียว +30 / โซนเหลือง +10","ผ่านรอบ โซนเขียวจะแคบลงเรื่อย ๆ"],
    custom: ["เปลี่ยนสีโซนและเข็ม","เปลี่ยนแถบเป็นรูปทรงแบรนด์","ใส่โลโก้เหนือแถบ","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Stop the Bar",
    tag: "Tap to stop the marker in the green",
    how: ["A marker sweeps back and forth quickly","Tap to stop it","Green zone +30, yellow +10","The green zone narrows every round"],
    custom: ["Zone + marker colors","Bar shaped to your brand","Logo above the bar","Background image"] }
},
{
  id: "pianotiles", icon: "🎹", cat: "action", c1: "#1b1442", c2: "#00d4ff", time: 30,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "กดแถบดนตรี",
    tag: "แตะแถบสีที่ไหลลงมาให้ทัน",
    how: ["แถบสีไหลลงมา 4 เลน","แตะแถบก่อนที่มันจะเลยเส้นล่าง +10 คะแนน","ปล่อยหลุด 3 แถบจบเกม","ยิ่งเล่นนานยิ่งไหลเร็ว"],
    custom: ["เปลี่ยนสีแถบและเลน","เปลี่ยนเสียงโน้ต","ใส่โลโก้บนแถบ","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Music Tiles",
    tag: "Hit every tile before it drops off",
    how: ["Tiles fall down 4 lanes","Tap a tile before it passes the line: +10","Miss 3 tiles and the run ends","Speed increases as you go"],
    custom: ["Tile + lane colors","Note sounds","Logo printed on tiles","Background image"] }
},
{
  id: "snake", icon: "🐍", cat: "arcade", c1: "#2fe08a", c2: "#7b2ff7", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "งูกินหาง",
    tag: "ปัดนิ้วบังคับทิศ กินของให้ยาวขึ้น",
    how: ["ปัดนิ้วขึ้น/ลง/ซ้าย/ขวาเพื่อเปลี่ยนทิศ","กินอาหาร +10 คะแนน ตัวยาวขึ้น 1 ช่อง","ชนกำแพงหรือชนตัวเองจบเกม","เล่นได้ทั้งปัดนิ้วและปุ่มลูกศร"],
    custom: ["เปลี่ยนสีตัวงู/หัวงู","เปลี่ยนอาหารเป็นสินค้า","เปลี่ยนสีตาราง","ใส่โลโก้พื้นหลังสนาม"] },
  en: { name: "Snake",
    tag: "Swipe to steer, eat and grow",
    how: ["Swipe up/down/left/right to turn","Each pickup: +10 points and one more segment","Hitting a wall or yourself ends it","Works with swipe or arrow keys"],
    custom: ["Snake body / head colors","Food → your product","Grid color","Logo watermark on the field"] }
},
{
  id: "tictactoe", icon: "⭕", cat: "brain", c1: "#00d4ff", c2: "#ff2e88", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "โอเอกซ์",
    tag: "เล่นกับคอมพิวเตอร์ เรียง 3 ตัวชนะ",
    how: ["แตะช่องว่างเพื่อลง O","คอมพิวเตอร์จะลง X ตอบทันที","เรียงได้ 3 ตัวติดกันในแนวใดก็ชนะ","ชนะ +100 / เสมอ +30 คะแนน"],
    custom: ["เปลี่ยนสัญลักษณ์ O/X เป็นโลโก้ 2 แบรนด์","เปลี่ยนสีเส้นตาราง","เปลี่ยนสีไฮไลต์แนวชนะ","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Tic-Tac-Toe",
    tag: "Beat the computer — three in a row",
    how: ["Tap an empty cell to place your O","The computer answers with an X","Line up three in any direction to win","Win +100, draw +30"],
    custom: ["O / X → two logos or icons","Grid line color","Winning-line highlight","Background image"] }
},
{
  id: "wordscramble", icon: "🔤", cat: "brain", c1: "#ff6a3d", c2: "#7b2ff7", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เรียงตัวอักษร",
    tag: "แตะตัวอักษรเรียงให้เป็นคำที่ถูก",
    how: ["ตัวอักษรถูกสลับตำแหน่งไว้","แตะทีละตัวเพื่อเรียงลงช่องคำตอบ","เรียงถูก +30 คะแนน ไปคำถัดไป","แตะช่องคำตอบเพื่อเอาตัวอักษรคืน"],
    custom: ["ใส่ชุดคำของแบรนด์เอง (ชื่อสินค้า/สโลแกน)","เปลี่ยนสีตัวอักษรและช่อง","ใส่โลโก้เหนือคำใบ้","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Word Scramble",
    tag: "Tap the letters to spell the word",
    how: ["The letters are shuffled","Tap them in order into the answer slots","Correct word: +30 and the next one loads","Tap a slot to take a letter back"],
    custom: ["Your own word list (products, slogans)","Letter + slot colors","Logo above the hint","Background image"] }
},
{
  id: "mathquick", icon: "➗", cat: "brain", c1: "#ffd23f", c2: "#2fe08a", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "คิดเลขเร็ว",
    tag: "ตอบโจทย์เลขให้ได้มากที่สุดใน 45 วินาที",
    how: ["โจทย์บวก-ลบ-คูณ แสดงทีละข้อ","แตะเลือกคำตอบจาก 4 ตัวเลือก","ตอบถูก +15 คะแนน และได้เวลาเพิ่ม 1 วินาที","ตอบผิด −5 คะแนน"],
    custom: ["ปรับระดับความยากของโจทย์","เปลี่ยนสีปุ่มคำตอบ","ใส่โลโก้เหนือโจทย์","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Quick Math",
    tag: "As many correct answers as you can in 45s",
    how: ["Add / subtract / multiply, one at a time","Tap one of four answers","Correct +15 and +1 second on the clock","Wrong answer: −5"],
    custom: ["Difficulty level","Answer-button colors","Logo above the question","Background image"] }
},
{
  id: "giftpick", icon: "🎁", cat: "luck", c1: "#ff2e88", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv","led"],
  th: { name: "เลือกกล่องของขวัญ",
    tag: "เลือก 1 ใน 9 กล่อง ลุ้นรางวัล",
    how: ["กล่องของขวัญ 9 ใบเรียงบนจอ","แตะเลือก 1 ใบ","กล่องเปิดออกพร้อมเอฟเฟกต์ประกายไฟ","เผยรางวัลที่ซ่อนอยู่ข้างใน"],
    custom: ["ตั้งรายการรางวัลและโอกาสออกได้","เปลี่ยนรูปกล่อง/สีโบว์","ใส่โลโก้บนฝากล่อง","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Pick a Gift",
    tag: "Choose 1 of 9 boxes and win",
    how: ["Nine gift boxes on screen","Tap one to choose","It opens with a burst of confetti","Your hidden prize is revealed"],
    custom: ["Prize list and win rates","Box artwork / ribbon color","Logo on the lid","Background image"] }
},
{
  id: "hiddenobj", icon: "🔦", cat: "skill", c1: "#7b2ff7", c2: "#2fe08a", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "หาของที่ซ่อน",
    tag: "หาไอคอนเป้าหมายท่ามกลางของรก ๆ",
    how: ["ด้านบนบอกว่าต้องหาไอคอนอะไร","มีไอคอนกระจายเต็มจอปะปนกัน","แตะให้ถูกอันที่กำหนด +25 คะแนน","แตะผิด −10 คะแนน แต่ละรอบมีของเยอะขึ้น"],
    custom: ["เปลี่ยนไอคอนทั้งหมดเป็นสินค้าแบรนด์","เปลี่ยนสีพื้นฉาก","ใส่โลโก้แถบบน","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Find the Hidden",
    tag: "Spot the target icon in the clutter",
    how: ["The header tells you what to find","Dozens of icons are scattered around","Tap the right one: +25 points","Wrong tap −10; each round adds more clutter"],
    custom: ["All icons → your product art","Scene background color","Logo in the header bar","Background image"] }
}
];
