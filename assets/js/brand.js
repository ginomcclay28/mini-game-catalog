/* ============================================================
   BRAND CONFIG  —  จุดเดียวที่ลูกค้าปรับแต่งได้
   ลูกค้าเปลี่ยนได้เฉพาะ: สี / โลโก้ / ภาพพื้นหลัง / ชื่อแบรนด์
   รูปแบบการเล่น (gameplay) คงเดิมตามราคา 9,500 บาท/เกม
   ============================================================ */
window.BRAND = {
  name: "T-STONE",
  tagline: { th: "เกมทัชสกรีนสำเร็จรูป", en: "Ready-made Touchscreen Games" },

  // โลโก้: ใส่ path รูป เช่น "assets/img/logo.png" (ถ้าเป็น null จะใช้ตัวอักษรแทน)
  logo: "assets/img/tstone-logo.svg",

  // ภาพพื้นหลังในเกม: ใส่ path รูป เช่น "assets/img/bg.jpg" (null = ใช้สีไล่เฉด)
  gameBg: null,

  // ชุดสีหลัก (ชุดนี้อิงจากสีของเว็บ T-Stone)
  colors: {
    primary:   "#ff6b57",   // สีหลัก / ปุ่ม        (coral)
    secondary: "#58d8ff",   // สีรอง                (cyan)
    accent:    "#ffd75e",   // สีเน้น / คะแนน       (yellow)
    good:      "#8cc63f",   // ถูก / สำเร็จ         (lime — สีโลโก้)
    bad:       "#ff4646",   // ผิด / พลาด
    dark:      "#10131d",   // ตัวหนังสือเข้ม       (ink)
    light:     "#ffffff",
    bgTop:     "#7658ff",   // พื้นหลังเกม บน       (violet)
    bgBottom:  "#58d8ff"    // พื้นหลังเกม ล่าง
  },

  // ราคาเริ่มต้นต่อเกม
  price: 9500,
  currency: { th: "บาท", en: "THB" },

  /* ---------- ตัวนับยอดวิว / หัวใจ ----------
     ns       = ชื่อกลุ่มข้อมูลของเว็บนี้ ถ้าเปลี่ยน ตัวเลขจะเริ่มนับใหม่ทั้งหมด
                (แนะนำให้เปลี่ยนเป็นชื่อโดเมนจริงตอนอัปขึ้นเว็บ เช่น "ginomcclay28-minigame")
     hitsPath = path ของ badge hits.sh ที่แสดงยอดวิวรายหน้า
                *** ต้องขึ้นต้นด้วยชื่อโดเมนเสมอ *** เช่น "ginomcclay28.github.io/mini-game-catalog"
                ถ้าใส่เป็นคำเปล่า ๆ hits.sh จะตอบว่า "Not a valid URI"
                (ระบบจะซ่อน badge ให้อัตโนมัติถ้ารูปแบบไม่ถูก)
     ปิดทั้งระบบได้โดยตั้ง enabled: false — เว็บยังใช้งานได้ปกติ แค่ไม่มีตัวเลข     */
  stats: {
    enabled: true,
    ns: "gino-minigame-2026",
    hitsPath: "ginomcclay28.github.io/mini-game-catalog"
  }
};
