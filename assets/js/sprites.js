/* ============================================================
   SPRITES — ประกาศว่าเกมไหนใช้ภาพอะไรบ้าง

   ไฟล์ภาพวางไว้ที่   assets/sprites/<ชื่อเกม>/<ชื่อไฟล์>
   ถ้ายังไม่มีไฟล์ เกมจะวาดอิโมจิแบบเดิมให้อัตโนมัติ เว็บไม่พัง
   ทยอยใส่ทีละเกม ทีละชิ้นได้เลย

   คีย์พิเศษ 2 ตัว
     bg      = ภาพพื้นหลังตอนเล่นแนวนอน  1920x1080
     bgPort  = ภาพพื้นหลังตอนเล่นแนวตั้ง  1080x1920  (ไม่ใส่ก็ได้ จะใช้ bg แทน)

   ถ้าเป็นภาพเคลื่อนไหว ใส่เป็น object แทน string
     mole: { src:'mole.png', frames:4, fps:12 }
     -> ไฟล์เป็น sprite sheet แถวเดียว 4 เฟรมกว้างเท่ากัน (เช่น 2048x512)
   ============================================================ */
window.GAME_SPRITES = {

  /* ---------- 01 ตีตัวตุ่น ---------- */
  whack: {
    mole: 'mole.png',      // ตัวตุ่น  โผล่ขึ้นจากหลุม ให้หันหน้าตรง
    bomb: 'bomb.png',      // ระเบิด   ห้ามตี
    hole: 'hole.png',      // ปากหลุม  วงรีแบน ๆ (ไม่ใส่ก็ได้ จะวาดวงรีสีน้ำตาลให้)
    hit:  'hit.png',       // เอฟเฟกต์ตอนตีโดน (ไม่ใส่ก็ได้)
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 02 ปาลูกโป่ง ---------- */
  balloon: {
    balloon: 'balloon.png',  // ลูกโป่ง 1 ใบ สีขาว/เทา เกมจะย้อมสีเองได้
    star:    'star.png',     // ดาวโบนัส
    pop:     'pop.png',      // เอฟเฟกต์ลูกโป่งแตก
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 03 จับคู่การ์ด ---------- */
  memory: {
    back: 'back.png',      // หลังการ์ด (คว่ำอยู่) จัตุรัส  ใส่โลโก้ลูกค้าได้
    i1:   'i1.png',        // หน้าการ์ด 6 แบบ พื้นโปร่ง เกมวางบนการ์ดสีเหลืองให้เอง
    i2:   'i2.png',
    i3:   'i3.png',
    i4:   'i4.png',
    i5:   'i5.png',
    i6:   'i6.png',
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 04 รับผลไม้ ---------- */
  catchfruit: {
    basket: 'basket.png',   // ตะกร้า  ผู้เล่นลากซ้ายขวา
    apple:  'apple.png',
    orange: 'orange.png',
    grape:  'grape.png',
    straw:  'strawberry.png',
    lemon:  'lemon.png',
    melon:  'watermelon.png',
    bomb:   'bomb.png',     // ระเบิด ห้ามรับ
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 05 กดเร็วจี๊ด ---------- */
  tapspeed: {
    btn:     'btn.png',      // ปุ่มยักษ์ ตอนยังไม่กด  เปลี่ยนเป็นโลโก้/สินค้าลูกค้าได้
    btnDown: 'btn-down.png', // ปุ่มตอนถูกกดยุบลง
    burst:   'burst.png',    // แสงระเบิดหลังปุ่ม (ไม่ใส่ก็ได้)
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 06 วัดปฏิกิริยา ----------
     เกมนี้ "ไม่มี" ภาพพื้นหลัง เพราะสีเต็มจอคือตัวบอกสถานะ (แดง=รอ เขียว=แตะ)
     ใส่ได้แค่ลายแสงจาง ๆ ทับสีพื้น */
  reaction: {
    lightRed:   'light-red.png',    // ไฟจราจร ดวงแดงติด = ห้ามแตะ
    lightGreen: 'light-green.png',  // ดวงเขียวติด = แตะเลย
    lightOff:   'light-off.png',    // ดับหมด ใช้ตอนโชว์ผล
    rays:       'rays.png'          // ลายแสงคอมิก โปร่ง (ไม่ใส่ก็ได้)
  },

  /* ---------- 07 จำลำดับสี ---------- */
  simon: {
    panel:  'panel.png',    // แผงรองใต้ปุ่มทั้ง 4  ใส่โลโก้ลูกค้าได้
    pad:    'pad.png',      // ปุ่ม 1 อัน สีขาว/เทา เกมย้อมสีเองทั้ง 4 สี
    padLit: 'pad-lit.png',  // ปุ่มตอนไฟติดสว่าง
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 08 วงล้อเสี่ยงโชค ----------
     ช่องรางวัลยังวาดด้วยโค้ด เพราะลูกค้าเปลี่ยนจำนวนช่อง/สี/ข้อความเองได้
     ภาพที่ใส่คือ "กรอบ" ที่วางทับช่องอีกที ตรงกลางขอบต้องโปร่ง */
  wheel: {
    rim:     'rim.png',      // ขอบวงล้อ วงแหวน ตรงกลางต้องโปร่งทะลุ
    hub:     'hub.png',      // ดุมกลางวงล้อ  ใส่โลโก้ลูกค้าได้
    pointer: 'pointer.png',  // เข็มชี้ ปลายแหลมลงล่าง
    stand:   'stand.png',    // ขาตั้งวงล้อ
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 09 สล็อตแมชชีน ----------
     วงล้อยังเลื่อนด้วยโค้ด ภาพ cabinet คือตัวตู้ที่มี "ช่องกระจก" เจาะโปร่ง
     โค้ดวาดวงล้ออยู่ข้างหลัง แล้วเอาตู้ครอบทับอีกที */
  slot: {
    cabinet: 'cabinet.png',  // ตัวตู้ ช่องกระจกตรงกลางต้องโปร่งทะลุ
    s1: 's1.png',            // สัญลักษณ์ 6 แบบ  เปลี่ยนเป็นสินค้าลูกค้าได้
    s2: 's2.png',
    s3: 's3.png',
    s4: 's4.png',
    s5: 's5.png',
    s6: 's6.png',
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 10 บัตรขูด ---------- */
  scratch: {
    foil: 'foil.jpg',   // ชั้นฟอยล์เงินที่ต้องขูดออก  เปลี่ยนเป็นลายแบรนด์ได้
    glow: 'glow.png',   // แสงทองหลังรางวัล (ไม่ใส่ก็ได้)
    gift: 'gift.png',   // กล่องของขวัญเหนือข้อความรางวัล (ไม่ใส่ก็ได้)
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 11 ตอบคำถามชิงรางวัล ---------- */
  quiz: {
    o1: 'o1.png',        // ไอคอนประจำตัวเลือก 4 ข้อ (ดาว / ข้าวหลามตัด / วงกลม / สามเหลี่ยม)
    o2: 'o2.png',
    o3: 'o3.png',
    o4: 'o4.png',
    check: 'check.png',  // ตราถูก แปะข้อที่เฉลย
    cross: 'cross.png',  // ตราผิด แปะข้อที่ตอบพลาด
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 12 หาตัวที่แตกต่าง ---------- */
  oddone: {
    tile: 'tile.png',   // ช่องในตาราง วาดเป็นสีขาว/เทา เกมย้อมสีเองทุกรอบ
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 13 จิ๊กซอว์เลื่อน ----------
     pic คือภาพต้นฉบับใบเดียว เกมตัดเป็น 9 ช่องเอง
     ลูกค้าเปลี่ยนเป็นภาพสินค้า/โลโก้ได้ ขอแค่เป็นภาพจัตุรัส */
  slidepuzzle: {
    pic: 'pic.jpg',
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 14 ทุบบล็อก ---------- */
  breakout: {
    brick: 'brick.png',   // บล็อก 1 ก้อน สีขาว/เทา เกมย้อมสีเองทีละแถว
    ball:  'ball.png',    // ลูกบอล  เปลี่ยนเป็นโลโก้กลมของลูกค้าได้
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 15 ชู้ตบาส ---------- */
  hoops: {
    hoop: 'hoop.png',   // แป้น + ห่วง + ตาข่าย ชิ้นเดียว  ปากห่วงต้องอยู่กลางเฟรมพอดี
    ball: 'ball.png',   // ลูกบาส  เปลี่ยนเป็นสินค้า/โลโก้ได้
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 16 ยิงเป้าธนู ---------- */
  archery: {
    target: 'target.png',  // หน้าเป้า วงกลม  ขอบวงต้องตรงกับเกณฑ์คะแนนในโค้ด
    arrow:  'arrow.png',   // ลูกศร วางนอน หันขวา
    bow:    'bow.png',     // คันธนู หันขวา
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 17 นกบินลอดท่อ ---------- */
  flappy: {
    bird: 'bird.png',   // ตัวละคร หันขวา  เปลี่ยนเป็นมาสคอตแบรนด์ได้
    pipe: 'pipe.png',   // ตัวท่อ แถบแนวตั้ง เกมยืดตามความสูง
    cap:  'cap.png',    // ฝาท่อ ขนาดคงที่ เกมพลิกกลับหัวให้ท่อล่างเอง
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 18 วิ่งกระโดด ---------- */
  runner: {
    runner: 'runner.png',  // ตัววิ่ง หันขวา  เปลี่ยนเป็นมาสคอตได้
    hurdle: 'hurdle.png',  // สิ่งกีดขวาง กำหนดขนาดจากความสูง
    bg:     'bg.jpg',      // ถนนต้องอยู่ล่างสุด 22% (แนวนอน) / 12% (แนวตั้ง)
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 19 เขาวงกต ---------- */
  maze: {
    hero: 'hero.png',   // ตัวละครที่เดิน
    goal: 'goal.png',   // เป้าหมายปลายทาง  เปลี่ยนเป็นสินค้าได้
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 20 โยงเส้นจับคู่ ---------- */
  linematch: {
    i1: 'i1.png',   // แอปเปิล   ลำดับต้องตรงกับ LM ใน pack2.js
    i2: 'i2.png',   // ดาว
    i3: 'i3.png',   // ปลา
    i4: 'i4.png',   // ดอกไม้
    i5: 'i5.png',   // รถ
    i6: 'i6.png',   // กล้อง
    i7: 'i7.png',   // โดนัท
    i8: 'i8.png',   // กระบองเพชร
    bg:     'bg.jpg',
    bgPort: 'bg-port.jpg'
  },

  /* ---------- 21 แยกประเภทลงถัง (ธีมรีไซเคิล) ---------- */
  sortbin: {
    binPlastic: 'bin-plastic.png', binFood: 'bin-food.png', binPaper: 'bin-paper.png',
    plastic1: 'plastic1.png', plastic2: 'plastic2.png', plastic3: 'plastic3.png',
    food1: 'food1.png', food2: 'food2.png', food3: 'food3.png',
    paper1: 'paper1.png', paper2: 'paper2.png', paper3: 'paper3.png',
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 22 วางบล็อกซ้อน ---------- */
  stack: {
    block: 'block.png',   // บล็อกขาว/เทา แท่งยาว  เกมย้อมสีทีละชั้นและยืดตามความกว้าง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 23 หยุดเข็มให้ตรงกลาง ---------- */
  timingbar: {
    needle: 'needle.png',   // เข็มชี้ ปลายลง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 24 กดแถบดนตรี ---------- */
  pianotiles: { bg: 'bg.jpg', bgPort: 'bg-port.jpg' },

  /* ---------- 25 งูกินหาง ---------- */
  snake: {
    head: 'head.png',   // หัวงู หันขวา เกมหมุนตามทิศเอง
    body: 'body.png',   // ลำตัว 1 ปล้อง กลม ๆ
    food: 'food.png',   // อาหาร  เปลี่ยนเป็นสินค้าได้
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 26 โอเอกซ์ ---------- */
  tictactoe: {
    o: 'o.png',   // ตัว O (ผู้เล่น)  เปลี่ยนเป็นโลโก้ได้
    x: 'x.png',   // ตัว X (คอม)
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 27 เรียงตัวอักษร ---------- */
  wordscramble: {
    tile: 'tile.png',   // แผ่นตัวอักษร ขาว/เทา เกมย้อมสีเอง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 28 คิดเลขเร็ว ---------- */
  mathquick: { bg: 'bg.jpg', bgPort: 'bg-port.jpg' },

  /* ---------- 29 เลือกกล่องของขวัญ ---------- */
  giftpick: {
    box:     'box.png',        // กล่องปิด
    boxOpen: 'box-open.png',   // กล่องเปิดมีแสงพุ่ง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 30 หาของที่ซ่อน ---------- */
  hiddenobj: {
    t1: 't1.png', t2: 't2.png', t3: 't3.png', t4: 't4.png',   // ตุ๊กตาหมี หุ่นยนต์ เป็ดยาง ลูกบอล
    t5: 't5.png', t6: 't6.png', t7: 't7.png', t8: 't8.png',   // จรวด ไดโนเสาร์ รถ กลอง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 31 ปาดผลไม้ ----------  ผลไม้ 5 ชนิด + ระเบิด คัดลอกมาจากเกม 04 (สไตล์เดียวกัน) */
  fruitninja: {
    melon: 'watermelon.png', apple: 'apple.png', orange: 'orange.png', grape: 'grape.png', straw: 'strawberry.png',
    kiwi: 'kiwi.png', pine: 'pineapple.png', bomb: 'bomb.png',
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 32 บีบพลาสติกกันกระแทก ---------- */
  bubblewrap: {
    bubble: 'bubble.png',   // เม็ดยังไม่แตก
    popped: 'popped.png',   // เม็ดที่แตกแล้ว
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 33 หลบอุกกาบาต ---------- */
  dodgerock: {
    ship: 'ship.png',   // ยาน หัวชี้ขึ้น  เปลี่ยนเป็นมาสคอตได้
    rock: 'rock.png',   // อุกกาบาต
    coin: 'coin.png',   // เหรียญให้เก็บ (คัดลอกมาจากเกม 34)
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 34 สลับเลน ----------  ถนนวาดด้วยโค้ด พื้นหลังคือข้างทาง */
  laneswitch: {
    car:  'car.png',    // รถ มองจากบน หัวชี้ขึ้น
    cone: 'cone.png',   // กรวยจราจร (สิ่งกีดขวาง)
    coin: 'coin.png',   // เหรียญ  เปลี่ยนเป็นโลโก้ได้
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 35 ผ่านวงสี ---------- */
  colorswitch: {
    ball: 'ball.png',   // ลูกบอลขาว/เทา เกมย้อมสีตามสีที่ต้องผ่าน
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 36 แตะให้ตรงวง ---------- */
  rhythmring: { bg: 'bg.jpg', bgPort: 'bg-port.jpg' },

  /* ---------- 37 กดสีให้ตรงกฎ ---------- */
  colorrule: { bg: 'bg.jpg', bgPort: 'bg-port.jpg' },

  /* ---------- 38 เดาะบอล ---------- */
  juggle: {
    ball: 'ball.png',   // ลูกฟุตบอล  เปลี่ยนเป็นสินค้าได้
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 39 บินลอดอุโมงค์ ---------- */
  tunnelfly: {
    plane: 'plane.png',   // เครื่องบิน หันขวา
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 40 ซิกแซก ---------- */
  zigzag: {
    ball: 'ball.png',   // ลูกบอลที่กลิ้ง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 41 ปาลูกดอกใส่ผลไม้ ---------- */
  dart: {
    melon: 'melon.png', orange: 'orange.png', kiwi: 'kiwi.png',   // ผลไม้ผ่าซีก มองจากบน
    dart: 'dart.png',   // ลูกดอก วางนอน ปลายชี้ขวา
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 42 โยนขวดให้ตั้ง ---------- */
  bottleflip: {
    bottle: 'bottle.png',   // ขวดตั้งตรง
    pad:    'pad.png',      // แท่นวาง ยืดตามความกว้าง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 43 ยิงจุดโทษ ---------- */
  penalty: {
    goal:   'goal.png',     // ประตูพร้อมตาข่าย มองตรง  ยืดให้พอดีกรอบ
    keeper: 'keeper.png',   // ผู้รักษาประตู กางแขน
    ball:   'ball.png',     // คัดลอกจากเกม 38
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 44 พัตต์กอล์ฟ ---------- */
  golfputt: {
    ball: 'ball.png',   // ลูกกอล์ฟ
    hole: 'hole.png',   // หลุม+ธง ปากหลุมอยู่ล่างสุดของเฟรม
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 45 หนังสติ๊ก ---------- */
  slingshot: {
    sling: 'sling.png',   // ง่ามหนังสติ๊ก ไม่มียาง (เกมวาดยางเอง)
    crate: 'crate.png',   // ลังไม้ ขาว/เทา เกมย้อมสี
    stone: 'stone.png',   // ก้อนหิน
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 46 ยิงปืนใหญ่ ---------- */
  cannonball: {
    barrel: 'barrel.png',   // ลำกล้อง วางนอน ปากกระบอกชี้ขวา
    base:   'base.png',     // ฐานล้อ
    wall:   'wall.png',     // แถบกำแพงอิฐแนวตั้ง ยืดตามความสูง
    target: 'target.png',   // เป้าบนขาตั้ง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 47 ตกปลา ----------  พื้นหลังต้องมีฟ้า 22% บน น้ำที่เหลือ */
  fishing: {
    boat:  'boat.png',
    fish1: 'fish1.png', fish2: 'fish2.png', fish3: 'fish3.png',   // ปลาหันซ้าย (เกมพลิกเอง)
    boot:  'boot.png',    // ขยะ ห้ามเกี่ยว
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 48 ตู้คีบตุ๊กตา ----------  p1-p4 คัดลอกจากเกม 30 */
  cranegrab: {
    claw: 'claw.png',
    p1: 'p1.png', p2: 'p2.png', p3: 'p3.png', p4: 'p4.png', p5: 'p5.png', p6: 'p6.png',
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 49 โยนห่วง ---------- */
  ringtoss: {
    ring: 'ring.png',   // ห่วง มองเฉียง เป็นวงรี
    peg:  'peg.png',    // เสา ฐานอยู่ล่างสุดของเฟรม
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 50 ปาขวาน ---------- */
  axethrow: {
    axe:    'axe.png',      // ขวาน วางนอน ใบมีดอยู่ขวา ด้ามอยู่ซ้าย
    target: 'target.png',   // เป้าไม้กลม
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 51 ดับไฟให้หมด ---------- */
  lightsout: {
    lampOn:  'lamp-on.png',    // ปุ่มไฟติด
    lampOff: 'lamp-off.png',   // ปุ่มไฟดับ  ตำแหน่ง/ขนาดต้องตรงกับ lamp-on
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 52 หอคอยฮานอย ---------- */
  hanoi: {
    disc: 'disc.png',   // จาน 1 ใบ ขาว/เทา เกมย้อมสีและยืดตามขนาด
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 53 เติมสีให้เต็ม ---------- */
  flood: { bg: 'bg.jpg', bgPort: 'bg-port.jpg' },

  /* ---------- 54 จับคู่สาม ---------- */
  match3: {
    g1: 'g1.png', g2: 'g2.png', g3: 'g3.png', g4: 'g4.png', g5: 'g5.png', g6: 'g6.png',   // อัญมณี 6 สี
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 55 รวมเลข 2048 ---------- */
  merge: {
    tile: 'tile.png',   // แผ่นสี่เหลี่ยม ขาว/เทา เกมย้อมสีตามเลข
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 56 เทน้ำแยกสี ---------- */
  watersort: {
    tube: 'tube.png',   // หลอดแก้วเปล่า โปร่งแสง วาดทับน้ำ
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 57 ต่อท่อ ---------- */
  pipe: {
    straight: 'straight.png',   // ท่อตรง แนวตั้ง
    elbow:    'elbow.png',      // ท่อโค้ง เชื่อม บน+ขวา
    tee:      'tee.png',        // ท่อสามทาง บน+ขวา+ล่าง
    cross:    'cross.png',      // ท่อสี่ทาง
    end:      'end.png',        // ท่อปลายตัน โผล่ด้านบน
    tap:      'tap.png',        // ก๊อกต้นทาง
    drain:    'drain.png',      // ท่อระบายปลายทาง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 58 เก็บกู้ระเบิด ---------- */
  minesweep: {
    tile: 'tile.png',   // ช่องที่ยังไม่เปิด
    flag: 'flag.png',   // ธง
    mine: 'mine.png',   // ระเบิด
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 59 ซูโดกุ 4×4 ----------  ใช้สัญลักษณ์แทนตัวเลข (ตามภาพปก) */
  sudoku4: {
    s1: 's1.png', s2: 's2.png', s3: 's3.png', s4: 's4.png',   // วงกลม ดาว สามเหลี่ยม ข้าวหลามตัด
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 60 เรียงตัวเลข ---------- */
  sequence: {
    dot: 'dot.png',   // จุดกลม ขาว/เทา เกมย้อมสี
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 61 Tetris ---------- */
  tetris: {
    block: 'block.png',   // บล็อกจัตุรัส ขาว/เทา เกมย้อม 7 สี
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 62 บอลตกหอ ---------- */
  towerdrop: {
    ball: 'ball.png',
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 63 กระโดดขึ้นแท่น ---------- */
  platformjump: {
    hero:     'hero.png',       // ตัวละคร หันซ้าย (เกมพลิกเอง)
    platform: 'platform.png',   // แท่นหญ้า ยาว ขอบบนคือเส้นเหยียบ
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 64 ยิงยานอวกาศ ---------- */
  spacewar: {
    ship:  'ship.png',    // ยานผู้เล่น หัวชี้ขึ้น
    enemy: 'enemy.png',   // ยานศัตรู หัวชี้ลง
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 65 ป้องกันฐาน ---------- */
  defendbase: {
    base: 'base.png',   // ป้อมกลางจอ  ใส่โลโก้ลูกค้าได้
    e1: 'e1.png', e2: 'e2.png',   // ศัตรู 2 แบบ หัวชี้ขึ้น (เกมหมุนให้หันเข้าฐาน)
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 66 ขุดหาสมบัติ ---------- */
  digger: {
    dirt: 'dirt.png',   // ช่องดินยังไม่ขุด
    gem:  'gem.png',    // เพชร (รางวัลใหญ่)
    coin: 'coin.png',   // เหรียญ (รางวัลเล็ก)
    rock: 'rock.png',   // ก้อนหิน เสียเวลา
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 67 พินบอล ---------- */
  pinball: {
    ball:   'ball.png',     // ลูกเหล็ก
    bumper: 'bumper.png',   // หมุดชนกลม
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 68 ข้ามถนน ---------- */
  froggy: {
    frog:  'frog.png',
    car:   'car.png',     // รถเก๋ง มองจากบน หันขวา
    truck: 'truck.png',   // รถบรรทุก มองจากบน หันขวา
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 69 ปีนหน้าผา ---------- */
  climbup: {
    climber: 'climber.png',   // นักปีน เกาะผนังซ้าย (หันซ้าย)
    rock:    'rock.png',      // ก้อนหินยื่นออกจากผนัง
    bird:    'bird.png',      // นก
    wall:    'wall.png',      // แถบผนังหิน เรียงต่อกันแนวตั้งได้
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  },

  /* ---------- 70 ทาสีให้เต็ม ---------- */
  paintfill: {
    roller: 'roller.png',   // ลูกกลิ้งทาสี ตามนิ้ว
    bg: 'bg.jpg', bgPort: 'bg-port.jpg'
  }

};
