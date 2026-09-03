# พรอมป์วาดภาพประกอบเกม — ก๊อปวางทีละอัน

> **วิธีใช้: ก๊อปข้อความในกล่องไปวางใน ChatGPT ทีละกล่อง — อย่าอัปโหลดไฟล์นี้ทั้งไฟล์**
> ถ้าอัปไฟล์ทั้งอัน ChatGPT จะอ่านเป็นเอกสารแล้วสรุปให้ฟัง ไม่ได้วาดรูป
> ทุกกล่องข้างล่างนี้สมบูรณ์ในตัวเองแล้ว ไม่ต้องต่อหรือแก้อะไร วางแล้วกดส่งได้เลย

---

## ขั้นที่ 1 — ตั้งสไตล์ก่อน (ทำครั้งเดียว)

เปิดแชท ChatGPT **ใหม่** แล้ว **อัปโหลดรูป 3 ไฟล์นี้**

```
H:\Claude workspace\Web mini Game\assets\cards\001.png
H:\Claude workspace\Web mini Game\assets\cards\002.png
H:\Claude workspace\Web mini Game\assets\cards\004.png
```

พร้อมข้อความนี้

```
These three images are the visual style reference for my game project.
Every image I ask you to create in this chat must match this exact art style:
line weight, colour palette, shading and overall mood.

I will send you one asset request at a time. For each one, generate a single
square image. Do not combine multiple objects into one image.
Confirm you understand, then wait for my first request.
```

**สำคัญ: ทำทุกอย่างต่อจากนี้ในแชทเดิม** อย่าเปิดแชทใหม่ ไม่งั้นสไตล์จะหลุด

---

## ขั้นที่ 2 — สั่งทีละไฟล์

### แนะนำให้ลอง 2 อันนี้ก่อน แล้วส่งมาให้ผมดู

---

**1. ตัวตุ่น** → เซฟเป็น `mole.png`

```
A cute cartoon mole popping halfway out of the ground, facing the viewer straight on,
brown fur, big friendly eyes, small pink nose, tiny paws resting on the ground edge,
cheerful expression, only the upper half of the body visible.

STYLE: modern flat vector game art, bold clean outlines, bright saturated colours,
soft cel shading, playful and friendly, mobile game asset quality.
FORMAT: single centred object, square 1:1 canvas, object fills about 85% of the frame,
flat solid chroma-green background #00B140, no drop shadow on the ground,
no text, no logo, no border, no extra props.
```

---

**2. ระเบิด** → เซฟเป็น `bomb.png` (ใช้ได้ทั้งเกมตีตัวตุ่นและเกมรับผลไม้)

```
A cartoon black bomb with a short burning fuse and a bright orange spark,
round glossy body with a white highlight, clearly dangerous but still cute and playful.

STYLE: modern flat vector game art, bold clean outlines, bright saturated colours,
soft cel shading, playful and friendly, mobile game asset quality.
FORMAT: single centred object, square 1:1 canvas, object fills about 85% of the frame,
flat solid chroma-green background #00B140, no drop shadow on the ground,
no text, no logo, no border, no extra props.
```

---

### ที่เหลือ สั่งต่อเมื่อสไตล์โอเคแล้ว

**3. ลูกโป่ง** → `balloon.png` ⚠️ ต้องขาว/เทาเท่านั้น

```
A single party balloon seen from the front, teardrop shape with a small knot at the bottom.
Render it in WHITE and LIGHT GREY ONLY — a plain white balloon with soft grey shading
and one bright white highlight. Absolutely no colour, no hue, no tint of any kind.

STYLE: modern flat vector game art, bold clean outlines, soft cel shading,
playful and friendly, mobile game asset quality.
FORMAT: single centred object, square 1:1 canvas, object fills about 85% of the frame,
flat solid chroma-green background #00B140, no drop shadow on the ground,
no text, no logo, no border, no extra props.
```

**4. ดาว** → `star.png`

```
A shiny five-pointed golden star with a soft glow and a small sparkle,
rounded friendly points, glossy highlight on the upper left.

STYLE: modern flat vector game art, bold clean outlines, bright saturated colours,
soft cel shading, playful and friendly, mobile game asset quality.
FORMAT: single centred object, square 1:1 canvas, object fills about 85% of the frame,
flat solid chroma-green background #00B140, no drop shadow on the ground,
no text, no logo, no border, no extra props.
```

**5. ลูกโป่งแตก** → `pop.png`

```
A comic style pop burst of a balloon: jagged white and yellow explosion shape
with a few small rubber fragments flying outward.

STYLE: modern flat vector game art, bold clean outlines, bright saturated colours,
playful and friendly, mobile game asset quality.
FORMAT: single centred object, square 1:1 canvas, object fills about 85% of the frame,
flat solid chroma-green background #00B140, no drop shadow on the ground,
no text, no logo, no border, no extra props.
```

**6. ตะกร้า** → `basket.png`

```
A woven wicker basket seen straight from the front, wide opening at the top,
warm golden brown weave, with a clean flat empty panel across the centre front of the
basket where a logo could be placed later. The basket is empty.

STYLE: modern flat vector game art, bold clean outlines, bright saturated colours,
soft cel shading, playful and friendly, mobile game asset quality.
FORMAT: single centred object, square 1:1 canvas, object fills about 85% of the frame,
flat solid chroma-green background #00B140, no drop shadow on the ground,
no text, no logo, no border, no extra props.
```

**7–12. ผลไม้ 6 ชนิด** → ก๊อปกล่องนี้ 6 รอบ เปลี่ยนแค่คำแรก

```
A single ripe red apple, cartoon game item, viewed from the front,
glossy highlight, small green leaf, cheerful and appetising.

STYLE: modern flat vector game art, bold clean outlines, bright saturated colours,
soft cel shading, playful and friendly, mobile game asset quality.
FORMAT: single centred object, square 1:1 canvas, object fills about 85% of the frame,
flat solid chroma-green background #00B140, no drop shadow on the ground,
no text, no logo, no border, no extra props.
```

| รอบที่ | เปลี่ยน `a single ripe red apple` เป็น | เซฟเป็น |
|---|---|---|
| 1 | a single ripe red apple | `apple.png` |
| 2 | a single ripe orange | `orange.png` |
| 3 | a single bunch of purple grapes | `grape.png` |
| 4 | a single ripe strawberry | `strawberry.png` |
| 5 | a single ripe yellow lemon | `lemon.png` |
| 6 | a single slice of watermelon | `watermelon.png` |

---

## ขั้นที่ 3 — พื้นหลัง 6 ใบ

พื้นหลัง **ไม่ต้องใช้พื้นเขียว** เพราะไม่ต้องตัดออก

**ตีตัวตุ่น — แนวนอน** → `bg.jpg`

```
A cheerful cartoon grass field on a sunny day: rolling green lawn in the lower two thirds,
bright blue sky with a few soft round clouds at the top, small bushes only near the far
left and far right edges.
IMPORTANT: keep the entire centre of the image simple and uncluttered — gameplay happens there.
Use soft mid-tone colours, nothing too bright or high contrast.

STYLE: modern flat vector game art, bright and playful.
FORMAT: 16:9 landscape wallpaper, no characters, no text, no UI elements.
```

**ตีตัวตุ่น — แนวตั้ง** → `bg-port.jpg`
> กล่องเดิม เปลี่ยนบรรทัดสุดท้ายเป็น
> `FORMAT: 9:16 vertical wallpaper, no characters, no text, no UI elements.`

**ปาลูกโป่ง — แนวนอน** → `bg.jpg`

```
A bright daytime sky with soft fluffy cartoon clouds gathered near the top and bottom edges,
gentle blue gradient, a few tiny distant birds.
IMPORTANT: keep the centre of the image clean and open — gameplay happens there.

STYLE: modern flat vector game art, bright and airy.
FORMAT: 16:9 landscape wallpaper, no characters, no text, no UI elements.
```
> แนวตั้ง: เปลี่ยนบรรทัดสุดท้ายเป็น `9:16 vertical wallpaper`

**รับผลไม้ — แนวนอน** → `bg.jpg`

```
A sunny cartoon orchard: rows of fruit trees along the left and right edges only,
green grass at the bottom, warm blue sky at the top.
IMPORTANT: the middle of the image must stay open and simple — fruit falls through there.
Use soft warm mid-tones and low contrast.

STYLE: modern flat vector game art, bright and playful.
FORMAT: 16:9 landscape wallpaper, no characters, no text, no UI elements.
```
> แนวตั้ง: เปลี่ยนบรรทัดสุดท้ายเป็น `9:16 vertical wallpaper`

---

## ขั้นที่ 4 — ส่งกลับมา

โหลดรูปจาก ChatGPT แล้ววางในโฟลเดอร์ตามเกม **ชื่อไฟล์อะไรก็ได้** ผมเปลี่ยนชื่อให้เอง

```
assets\sprites\whack\
assets\sprites\balloon\
assets\sprites\catchfruit\
```

แล้วบอกผม เดี๋ยวจัดการต่อให้ — ตัดพื้นเขียวออกเป็น PNG โปร่ง, ครอปให้อยู่กลางเฟรม,
ย่อเป็น 512px, บีบเป็น WebP, แล้วจูนขนาดกับตำแหน่งในเกมทั้งแนวนอนและแนวตั้ง
