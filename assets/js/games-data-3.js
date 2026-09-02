/* ============================================================
   GAMES DATA — เกมที่ 66-100 (รวมเกม 2 ผู้เล่น 10 เกมท้าย)
   ============================================================ */
window.GAMES = window.GAMES.concat([
{
  id: "digger", icon: "⛏️", cat: "arcade", c1: "#7a4a12", c2: "#ffd23f", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ขุดหาสมบัติ", tag: "แตะพื้นดินขุดลงไปหาของมีค่า",
    how: ["ใต้พื้นดินซ่อนสมบัติและหินไว้เป็นตาราง","แตะช่องดินเพื่อขุดออก 1 ช่อง","เจอสมบัติได้คะแนน เจอหินเสียเวลา","ขุดให้ได้คะแนนมากที่สุดก่อนหมดเวลา"],
    custom: ["ของที่ขุดเจอเป็นสินค้าแบรนด์","สีชั้นดินแต่ละระดับ","เครื่องมือขุด","พื้นหลัง"] },
  en: { name: "Treasure Dig", tag: "Tap the soil and dig for valuables",
    how: ["Treasure and rocks are buried in a grid","Tap a soil tile to dig it out","Treasure scores points; rock costs you time","Score as much as you can before time runs out"],
    custom: ["Buried items → your products","Soil layer colors","Digging tool","Background"] }
},
{
  id: "pinball", icon: "🎱", cat: "arcade", c1: "#3b1170", c2: "#ff2e88", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "พินบอล", tag: "ตู้พินบอล 2D เต็มตู้ ดึงสปริงยิงลูกแล้วตีแป้นเก็บคะแนน",
    how: ["กดค้างเพื่อดึงสปริงที่รางขวา ยิ่งค้างนานยิ่งแรง ปล่อยนิ้วเพื่อยิงลูกขึ้นราง","ลูกวิ่งขึ้นไปตามโค้งด้านบนแล้วตกเข้าสนาม","แตะครึ่งซ้าย/ครึ่งขวาของจอเพื่อตีแป้นซ้าย-ขวา","หมุดชน +100 สลิงช็อต +25 เป้าล้ม +50 ล้มครบ 4 เป้าได้โบนัส 500","ลูกตกช่องกลางระหว่างแป้นเสีย 1 ลูก (มี 3 ลูก) ถ้าไหลกลับลงรางจะได้ยิงใหม่ฟรี"],
    custom: ["สีตู้ ขอบตู้ และพื้นสนาม","สีหมุดชน แป้นตี และสลิงช็อต","โลโก้กลางสนามแทนคำว่า PINBALL","ตำแหน่งและจำนวนเป้าล้ม"] },
  en: { name: "Pinball", tag: "A full 2D pinball table — pull the plunger, work the flippers",
    how: ["Hold to pull the plunger in the right lane — longer hold, more power — release to launch","The ball rides up the lane, round the top arch and drops into the playfield","Tap the left or right half of the screen to work that flipper","Bumpers +100, slingshots +25, drop targets +50, clear all four for a 500 bonus","Draining between the flippers costs a ball (3 total); rolling back into the lane is a free re-launch"],
    custom: ["Cabinet, rails and playfield colors","Bumper, flipper and slingshot colors","Logo in the middle of the playfield instead of PINBALL","Drop target count and placement"] }
},
{
  id: "froggy", icon: "🐸", cat: "arcade", c1: "#1c5e2f", c2: "#8fd14f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ข้ามถนน", tag: "แตะให้กระโดดข้ามเลนรถทีละก้าว",
    how: ["แตะครึ่งบนของจอเพื่อกระโดดไปข้างหน้า 1 ช่อง","แตะครึ่งล่างเพื่อถอยหลัง","หลบรถที่วิ่งสวนไป-มาในแต่ละเลน","ข้ามถึงฝั่งตรงข้าม +50 คะแนน แล้วเริ่มแถวใหม่ที่เร็วขึ้น"],
    custom: ["ตัวละครที่ข้าม","รถและยานพาหนะเป็นของแบรนด์","สีถนนและเกาะกลาง","พื้นหลัง"] },
  en: { name: "Road Cross", tag: "Hop across the traffic one lane at a time",
    how: ["Tap the top half of the screen to hop forward","Tap the bottom half to step back","Dodge the vehicles racing along each lane","Reach the far side: +50, then a faster set of lanes begins"],
    custom: ["Crossing character","Vehicles → brand objects","Road and median colors","Background"] }
},
{
  id: "climbup", icon: "🧗", cat: "arcade", c1: "#0d1b4a", c2: "#00d4ff", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ปีนหน้าผา", tag: "แตะสลับซ้าย-ขวาไต่ขึ้นไป หลบสิ่งกีดขวาง",
    how: ["ตัวละครเกาะผนังอยู่ด้านหนึ่ง","แตะเพื่อสลับไปเกาะผนังฝั่งตรงข้ามและไต่สูงขึ้น","หลบหินยื่นและนกที่ขวางทาง","ไต่สูงเท่าไหร่ คะแนนยิ่งเพิ่ม"],
    custom: ["ตัวละครนักปีน","ลายผนังหน้าผา","สิ่งกีดขวาง","ฉากพื้นหลัง"] },
  en: { name: "Wall Climb", tag: "Tap to switch walls and climb higher",
    how: ["Your climber clings to one wall","Tap to leap across to the opposite wall and gain height","Dodge the spikes and birds in the way","The higher you climb, the more you score"],
    custom: ["Climber character","Cliff wall texture","Obstacles","Background scene"] }
},
{
  id: "paintfill", icon: "🖌️", cat: "arcade", c1: "#ff2e88", c2: "#ffd23f", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ทาสีให้เต็ม", tag: "ลากนิ้วทาสีให้เต็มพื้นที่ก่อนหมดเวลา",
    how: ["พื้นที่ว่างรอให้ทาสี มีแถบบอกเปอร์เซ็นต์ที่ทาแล้ว","ลากนิ้วไปมาเพื่อทาสี","ทาได้เกิน 90% ถือว่าผ่านด่าน","ระวังจุดสีดำ ทาโดนแล้วเสียคะแนน"],
    custom: ["สีที่ใช้ทา","รูปทรงพื้นที่เป้าหมายเป็นโลโก้","ขนาดหัวแปรง","พื้นหลัง"] },
  en: { name: "Paint It", tag: "Drag to cover the area before time runs out",
    how: ["An empty area waits to be painted, with a % meter","Drag your finger back and forth to paint","Cover more than 90% to clear the level","Avoid the black spots — they cost points"],
    custom: ["Paint color","Target shape → your logo","Brush size","Background"] }
},
{
  id: "shellgame", icon: "🥤", cat: "brain", c1: "#5b1064", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "เกมสามถ้วย", tag: "จำว่าลูกบอลอยู่ถ้วยไหน แล้วเลือกให้ถูก",
    how: ["ลูกบอลถูกวางใต้ถ้วยใบหนึ่งให้เห็นก่อน","ถ้วยสลับตำแหน่งกันอย่างรวดเร็ว","แตะถ้วยที่คิดว่าลูกบอลอยู่","ตอบถูกไปรอบถัดไปที่สลับเร็วและถี่ขึ้น"],
    custom: ["รูปถ้วยและลูกบอล","ความเร็วในการสลับ","สีโต๊ะ","พื้นหลัง"] },
  en: { name: "Shell Game", tag: "Follow the ball, then pick the right cup",
    how: ["You see the ball placed under one cup","The cups shuffle around quickly","Tap the cup you think hides the ball","Get it right and the next round shuffles faster"],
    custom: ["Cup and ball artwork","Shuffle speed","Table color","Background"] }
},
{
  id: "countfast", icon: "👀", cat: "brain", c1: "#123b57", c2: "#2fe08a", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "นับให้ไว", tag: "นับจำนวนของบนจอแล้วเลือกคำตอบ",
    how: ["ไอคอนหลายชิ้นกระจายอยู่บนจอชั่วครู่","นับจำนวนไอคอนที่กำหนดให้ทัน","แตะเลือกตัวเลขที่ถูกจาก 4 ตัวเลือก","ตอบถูก +20 คะแนน รอบถัดไปของจะเยอะขึ้น"],
    custom: ["ไอคอนที่ให้นับเป็นสินค้า","สีพื้นและตัวเลือก","เวลาที่ให้ดู","พื้นหลัง"] },
  en: { name: "Count Fast", tag: "Count the items, then pick the number",
    how: ["A cluster of icons flashes on screen","Count how many of the target icon you see","Tap the right number from four choices","Correct +20; the next round adds more items"],
    custom: ["Counted icons → your products","Floor and button colors","Viewing time","Background"] }
},
{
  id: "spotpair", icon: "🔍", cat: "brain", c1: "#2a1150", c2: "#00d4ff", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "หาคู่ที่ซ้ำ", tag: "ในกองไอคอนมีแค่ 2 อันที่เหมือนกัน",
    how: ["ไอคอนหลายสิบชิ้นกระจายเต็มจอ","ในนั้นมีเพียง 1 คู่เท่านั้นที่เหมือนกันเป๊ะ","แตะทั้งสองอันให้ถูก +30 คะแนน","แตะผิด −10 คะแนน รอบถัดไปของจะเยอะขึ้น"],
    custom: ["ชุดไอคอนเป็นสินค้าแบรนด์","สีพื้นฉาก","ขนาดไอคอน","พื้นหลัง"] },
  en: { name: "Find the Pair", tag: "Only two icons in the pile are identical",
    how: ["Dozens of icons are scattered across the screen","Exactly one pair among them is identical","Tap both of them: +30 points","A wrong tap costs 10; each round adds more clutter"],
    custom: ["Icon set → your products","Scene color","Icon size","Background"] }
},
{
  id: "shadowmatch", icon: "🌓", cat: "brain", c1: "#1b1442", c2: "#7b2ff7", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "จับคู่เงา", tag: "เลือกเงาที่ตรงกับวัตถุด้านบน",
    how: ["ด้านบนแสดงวัตถุ 1 ชิ้น","ด้านล่างมีเงาดำ 4 อันให้เลือก","แตะเงาที่เป็นของวัตถุนั้น +20 คะแนน","ตอบผิด −10 คะแนน"],
    custom: ["วัตถุเป็นสินค้าของแบรนด์","สีเงาและพื้นหลังการ์ด","จำนวนตัวเลือก","พื้นหลัง"] },
  en: { name: "Shadow Match", tag: "Pick the silhouette that fits the object",
    how: ["One object is shown at the top","Four black silhouettes sit below","Tap the one that matches: +20 points","A wrong pick costs 10"],
    custom: ["Objects → your products","Silhouette and card colors","Number of choices","Background"] }
},
{
  id: "sizeorder", icon: "📏", cat: "brain", c1: "#7a5c00", c2: "#2fa86f", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เรียงขนาด", tag: "แตะเรียงจากเล็กไปใหญ่ให้ถูกลำดับ",
    how: ["มีวัตถุชนิดเดียวกันหลายขนาดวางสลับกัน","แตะไล่จากอันเล็กที่สุดไปอันใหญ่ที่สุด","เรียงถูกทั้งชุด +30 คะแนน","แตะผิดลำดับต้องเริ่มชุดนั้นใหม่"],
    custom: ["วัตถุที่ใช้เรียง","สีวัตถุแต่ละขนาด","จำนวนชิ้นต่อชุด","พื้นหลัง"] },
  en: { name: "Size Order", tag: "Tap them from smallest to largest",
    how: ["Several sizes of the same object are laid out at random","Tap them in order, smallest first","Getting the whole set right scores +30","One wrong tap restarts that set"],
    custom: ["Object used","Color per size","Items per set","Background"] }
},
{
  id: "balancescale", icon: "⚖️", cat: "brain", c1: "#0b2e4a", c2: "#ffd23f", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ชั่งให้สมดุล", tag: "เลือกน้ำหนักถ่วงให้ตาชั่งเท่ากันสองข้าง",
    how: ["ตาชั่งมีของวางอยู่ข้างหนึ่งแล้ว","เลือกตุ้มน้ำหนักจากด้านล่างมาวางอีกข้าง","วางให้น้ำหนักรวมเท่ากันเป๊ะ ตาชั่งจะนิ่ง +25 คะแนน","วางเกินหรือขาด ตาชั่งจะเอียงให้เห็น"],
    custom: ["รูปตาชั่งและตุ้มน้ำหนัก","ของที่ชั่งเป็นสินค้า","สีคานและฐาน","พื้นหลัง"] },
  en: { name: "Balance It", tag: "Add weights until both pans are level",
    how: ["One pan already holds an item","Pick weights from below and drop them on the other pan","Match the total exactly and the beam levels out: +25","Too much or too little and it tips visibly"],
    custom: ["Scale and weight artwork","Weighed item → your product","Beam and base colors","Background"] }
},
{
  id: "colorblend", icon: "🖍️", cat: "brain", c1: "#8b2fc9", c2: "#ffd23f", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ผสมสี", tag: "ปรับแถบสีให้ได้สีตรงกับเป้าหมาย",
    how: ["ด้านบนแสดงสีเป้าหมาย","มีแถบเลื่อน 3 แถบคือ แดง เขียว น้ำเงิน","ลากปรับให้สีที่ผสมได้ใกล้เคียงสีเป้าหมายที่สุด","แตะยืนยัน ยิ่งใกล้เคียงยิ่งได้คะแนนมาก"],
    custom: ["ชุดสีเป้าหมาย","สีและรูปทรงแถบเลื่อน","หน่วยที่แสดง (RGB/ชื่อสี)","พื้นหลัง"] },
  en: { name: "Color Mix", tag: "Slide the channels to match the target color",
    how: ["The target color is shown at the top","Three sliders control red, green and blue","Drag them until your mix matches as closely as possible","Confirm — the closer you get, the more you score"],
    custom: ["Target color set","Slider colors and shape","Readout style (RGB / names)","Background"] }
},
{
  id: "pathtrace", icon: "✏️", cat: "skill", c1: "#0d3b40", c2: "#00d4ff", time: 60,
  devices: ["touch","kiosk","tablet","mobile"],
  th: { name: "ลากตามเส้น", tag: "ลากนิ้วตามเส้นทางโดยไม่ให้หลุดออกนอก",
    how: ["มีเส้นทางคดเคี้ยวจากจุดเริ่มถึงจุดจบ","วางนิ้วที่จุดเขียวแล้วลากตามทาง","ลากหลุดออกนอกเส้นต้องเริ่มใหม่","ถึงปลายทางได้คะแนนตามความเร็ว"],
    custom: ["รูปทรงเส้นทาง (ทำเป็นโลโก้ได้)","สีเส้นทางและขอบ","ความกว้างของเส้น","พื้นหลัง"] },
  en: { name: "Trace the Line", tag: "Follow the path without straying off it",
    how: ["A winding path runs from start to finish","Put your finger on the green dot and follow the track","Stray outside the line and you start over","Reach the end — faster runs score more"],
    custom: ["Path shape (can be your logo)","Track and edge colors","Track width","Background"] }
},
{
  id: "memoryflash", icon: "💫", cat: "brain", c1: "#180f3d", c2: "#ff2e88", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "จำตำแหน่งไฟ", tag: "จำช่องที่สว่างขึ้น แล้วแตะให้ครบ",
    how: ["ตารางช่องจะสว่างขึ้นพร้อมกันหลายช่องชั่วครู่","จำตำแหน่งให้ได้ก่อนไฟดับ","แตะช่องที่เคยสว่างให้ครบทุกช่อง","ผ่านรอบ จำนวนช่องที่ต้องจำจะเพิ่มขึ้น"],
    custom: ["สีช่องสว่าง/ช่องปกติ","ขนาดตาราง","เอฟเฟกต์ตอนจำถูก","พื้นหลัง"] },
  en: { name: "Flash Memory", tag: "Remember which tiles lit up, then tap them",
    how: ["Several tiles flash on at once for a moment","Memorise their positions before they go dark","Tap every tile that lit up","Each round adds one more tile to remember"],
    custom: ["Lit / unlit tile colors","Grid size","Correct-tap effect","Background"] }
},
{
  id: "clockstop", icon: "🕐", cat: "action", c1: "#0b3a6b", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "หยุดนาฬิกา", tag: "หยุดเข็มให้ตรงเลขเป้าหมายพอดี",
    how: ["เข็มวิ่งรอบหน้าปัดด้วยความเร็วสูง","มีเลขเป้าหมายกำหนดไว้ให้","แตะเพื่อหยุดเข็มให้ตรงเลขนั้น","ยิ่งใกล้ยิ่งได้คะแนนมาก ตรงเป๊ะได้โบนัสใหญ่"],
    custom: ["หน้าปัดและเข็มนาฬิกา","ตัวเลขเป็นไอคอนแบรนด์","สีโซนคะแนน","พื้นหลัง"] },
  en: { name: "Stop the Clock", tag: "Halt the hand exactly on the target number",
    how: ["The hand races around the dial","A target number is highlighted","Tap to stop the hand on it","The closer you land, the more you score — dead-on gives a big bonus"],
    custom: ["Dial and hand design","Numbers → brand icons","Scoring zone colors","Background"] }
},
{
  id: "dice", icon: "🎲", cat: "luck", c1: "#1b1442", c2: "#ff6a3d", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "ทอยเต๋า", tag: "ทอยลูกเต๋า 3 ลูก ลุ้นแต้มรวม",
    how: ["แตะเพื่อเขย่าและทอยลูกเต๋า 3 ลูก","แต้มรวมกลายเป็นคะแนนของรอบนั้น","ออกเลขเหมือนกันทั้ง 3 ลูกได้โบนัสใหญ่","ทอยได้ไม่จำกัด เหมาะทำเป็นเกมลุ้นรางวัลหน้าบูธ"],
    custom: ["ลายและสีลูกเต๋า","ใส่โลโก้แทนจุดหน้าเต๋า","สีโต๊ะทอย","พื้นหลัง"] },
  en: { name: "Dice Roll", tag: "Roll three dice and chase the total",
    how: ["Tap to shake and roll three dice","The total becomes your score for that roll","Three of a kind pays a big bonus","Roll as often as you like — ideal as a booth prize draw"],
    custom: ["Dice faces and colors","Logo instead of pips","Table felt color","Background"] }
},
{
  id: "riverhop", icon: "🌊", cat: "arcade", c1: "#0a3b5e", c2: "#2ea24c", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "กบข้ามแม่น้ำ", tag: "กระโดดขึ้นใบบัวที่ลอยไปมา ให้ถึงฝั่งตรงข้าม",
    how: ["กบเริ่มที่ฝั่งล่าง ต้องข้ามแม่น้ำไปฝั่งบน","แตะกลางจอเพื่อกระโดดข้ามไปแถวถัดไป แตะขอบซ้าย-ขวาเพื่อขยับข้าง","ลงได้เฉพาะบนใบบัวที่ลอยอยู่ ลงน้ำเมื่อไหร่เสียชีวิต 1 ดวง (มี 3 ดวง)","ยืนบนใบบัวแล้วจะลอยไปกับมัน ถ้าลอยหลุดขอบจอก็เสียชีวิต","บางแถวมีเกาะหินอยู่นิ่ง ๆ ให้ยืนพักตั้งหลักได้","ถึงฝั่งตรงข้ามได้คะแนนก้อนใหญ่ แล้วเริ่มแม่น้ำใหม่ที่ไหลเร็วขึ้น"],
    custom: ["เปลี่ยนกบเป็นมาสคอตแบรนด์","สีใบบัวและรูปทรงเกาะหิน","สีแม่น้ำ ลายคลื่น และฝั่งสองข้าง","จำนวนแถวและความเร็วกระแสน้ำ"] },
  en: { name: "River Hop", tag: "Hop across on the drifting lily pads",
    how: ["The frog starts on the near bank and must reach the far side","Tap the middle to hop forward a row, tap the edges to shuffle sideways","You may only land on a lily pad — falling in the water costs one of your 3 lives","Standing on a pad means drifting with it; drift off screen and you lose a life too","Some rows have a still rock island where you can stop and regroup","Reach the far bank for a big score, then a faster river begins"],
    custom: ["Frog → your brand mascot","Lily pad colors and rock shapes","River color, wave pattern and both banks","Row count and current speed"] }
},
{
  id: "rps", icon: "✊", cat: "luck", c1: "#4b1d95", c2: "#00d4ff", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv"],
  th: { name: "เป่ายิ้งฉุบ", tag: "แข่งกับคอมพิวเตอร์ ใครชนะครบ 5 ก่อน",
    how: ["เลือก ค้อน กระดาษ หรือกรรไกร","คอมพิวเตอร์เลือกพร้อมกันแล้วเปิดผล","ชนะได้ 1 แต้ม เสมอไม่มีใครได้","ใครถึง 5 แต้มก่อนเป็นผู้ชนะ"],
    custom: ["รูปมือทั้ง 3 แบบ","สีปุ่มและกรอบ","หน้าคู่ต่อสู้เป็นมาสคอต","พื้นหลัง"] },
  en: { name: "Rock Paper Scissors", tag: "First to five wins against the computer",
    how: ["Pick rock, paper or scissors","The computer picks at the same time and reveals","A win scores a point, a draw scores nothing","First to five points takes the match"],
    custom: ["The three hand graphics","Button and frame colors","Opponent → your mascot","Background"] }
},
{
  id: "capsule", icon: "🥚", cat: "luck", c1: "#c81d6b", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "Gachapon", tag: "หมุนตู้ลุ้นแคปซูลของรางวัล",
    how: ["แตะที่ก้านหมุนของตู้","แคปซูลลูกหนึ่งจะกลิ้งออกมาจากช่อง","แตะแคปซูลเพื่อเปิดดูของข้างใน","ของหายากมีโอกาสออกน้อยกว่า"],
    custom: ["ของรางวัลในแคปซูล","สีแคปซูลและตู้","ใส่โลโก้บนหัวตู้","อัตราการออกของรางวัล"] },
  en: { name: "Gachapon", tag: "Turn the crank and see what you get",
    how: ["Tap the crank on the machine","A capsule rolls out of the chute","Tap the capsule to crack it open","Rare prizes appear less often"],
    custom: ["Prizes inside the capsules","Capsule and cabinet colors","Logo on the machine header","Drop rates"] }
},
{
  id: "hammerpower", icon: "💪", cat: "action", c1: "#5d1f0a", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","led"],
  th: { name: "ทุบวัดพลัง", tag: "แตะจังหวะให้พลังพุ่งขึ้นสูงสุด",
    how: ["แถบพลังวิ่งขึ้น-ลงอย่างรวดเร็ว","แตะเพื่อทุบในจังหวะที่แถบขึ้นสูงสุด","ลูกตุ้มจะพุ่งขึ้นตามแรงที่ทุบได้","ถึงกระดิ่งบนสุดได้โบนัสและเสียงกระดิ่ง"],
    custom: ["ตัวเสาและกระดิ่ง","สีแถบพลัง","ป้ายข้อความตามระดับพลัง","พื้นหลังงานวัด"] },
  en: { name: "Strength Meter", tag: "Time your hit for maximum power",
    how: ["A power bar sweeps up and down fast","Tap to swing when the bar peaks","The puck flies up the tower with that force","Ring the bell at the top for a bonus"],
    custom: ["Tower and bell art","Power bar colors","Rank labels per power level","Fairground background"] }
},
{
  id: "rocketlaunch", icon: "🚀", cat: "skill", c1: "#0a0a1e", c2: "#ff6a3d", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ปล่อยจรวด", tag: "แตะปล่อยเชื้อเพลิงเป็นจังหวะให้บินได้สูงสุด",
    how: ["จรวดต้องการเชื้อเพลิงเป็นจังหวะ","แตะตอนวงจังหวะซ้อนกันพอดีเพื่อเพิ่มแรงขับ","แตะพลาดจรวดจะเสียแรงและตกเร็วขึ้น","ความสูงที่ทำได้คือคะแนน"],
    custom: ["รูปจรวด","สีเปลวไฟและควัน","ชั้นบรรยากาศพื้นหลัง","ป้ายระดับความสูง"] },
  en: { name: "Rocket Launch", tag: "Tap in rhythm to burn fuel and fly higher",
    how: ["The rocket needs fuel in rhythm","Tap when the timing rings align to add thrust","Miss the beat and it loses power and falls faster","Your altitude is your score"],
    custom: ["Rocket design","Flame and smoke colors","Atmosphere layers","Altitude markers"] }
},
{
  id: "luckydraw", icon: "📦", cat: "luck", c1: "#3b1170", c2: "#2fe08a", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc","tv","led"],
  th: { name: "จับสลาก", tag: "ล้วงหยิบสลากจากกล่องลุ้นรางวัล",
    how: ["กล่องสลากเขย่าอยู่กลางจอ","แตะเพื่อล้วงหยิบสลาก 1 ใบ","สลากจะค่อย ๆ คลี่ออกให้เห็นรางวัล","จับใหม่ได้เรื่อย ๆ เหมาะทำกิจกรรมหน้าบูธ"],
    custom: ["รายการรางวัลและโอกาสออก","ลายสลากและกล่อง","ใส่โลโก้บนกล่อง","พื้นหลัง"] },
  en: { name: "Lucky Draw", tag: "Reach into the box and pull a ticket",
    how: ["The draw box shakes in the middle of the screen","Tap to pull out one ticket","The ticket unfolds to reveal your prize","Draw again as often as you like — great for booth activities"],
    custom: ["Prize list and odds","Ticket and box artwork","Logo on the box","Background"] }
},
{
  id: "horserace", icon: "🐎", cat: "luck", c1: "#1c5e2f", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","pc","tv","led"],
  th: { name: "แข่งม้า", tag: "เลือกม้าที่คิดว่าจะเข้าเส้นชัยก่อน",
    how: ["มีม้า 4 ตัวรออยู่ที่เส้นสตาร์ท","แตะเลือกม้าที่คิดว่าจะชนะ","ม้าออกวิ่งด้วยความเร็วสุ่ม ลุ้นกันจนเส้นชัย","เลือกถูกได้คะแนน เหมาะฉายขึ้นจอใหญ่ให้คนเชียร์"],
    custom: ["ตัวละครที่แข่ง (ม้า/รถ/มาสคอต)","สีเสื้อแต่ละหมายเลข","สนามและเส้นชัย","พื้นหลัง"] },
  en: { name: "Horse Race", tag: "Pick the runner you think crosses first",
    how: ["Four runners wait at the start line","Tap the one you think will win","They set off at random speeds — a real photo finish","Pick right to score; perfect on a big screen with a crowd"],
    custom: ["Runners (horses, cars, mascots)","Silks color per lane","Track and finish line","Background"] }
},
{
  id: "treasuredig", icon: "💰", cat: "luck", c1: "#0d2b4e", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เปิดแผ่นหาสมบัติ", tag: "เปิดแผ่นทีละช่องก่อนเจอกับดัก",
    how: ["ตารางแผ่นปิดซ่อนเหรียญและกับดักไว้","แตะเปิดทีละช่อง เจอเหรียญได้คะแนนสะสม","จะหยุดเก็บคะแนนเมื่อไหร่ก็ได้ด้วยปุ่มเก็บ","ถ้าเปิดเจอกับดักก่อน คะแนนที่สะสมไว้หายหมด"],
    custom: ["ของที่ซ่อนอยู่ใต้แผ่น","ลายหลังแผ่นเป็นโลโก้","สีกับดัก","พื้นหลัง"] },
  en: { name: "Press Your Luck", tag: "Keep flipping tiles — or bank before the trap",
    how: ["A grid of face-down tiles hides coins and traps","Tap to flip one at a time; coins add to your pot","Press the bank button any time to keep what you have","Hit a trap first and the whole pot is gone"],
    custom: ["Items hidden under the tiles","Tile backs → your logo","Trap color","Background"] }
},
{
  id: "pinata", icon: "🎊", cat: "action", c1: "#c81d6b", c2: "#ffd23f", time: 20,
  devices: ["touch","kiosk","tablet","mobile","led"],
  th: { name: "ตีปิญาต้า", tag: "แตะรัวให้แตกภายในเวลาที่กำหนด",
    how: ["ปิญาต้าแขวนแกว่งอยู่กลางจอ","แตะรัว ๆ ที่ตัวมันเพื่อสะสมความเสียหาย","แถบความทนทานจะลดลงเรื่อย ๆ","ตีแตกได้ของรางวัลกระจายเต็มจอ"],
    custom: ["รูปปิญาต้าเป็นมาสคอตแบรนด์","ของที่ร่วงออกมาเป็นสินค้า","สีแถบพลัง","พื้นหลังงานปาร์ตี้"] },
  en: { name: "Piñata Smash", tag: "Hammer it open before the timer runs out",
    how: ["The piñata swings in the middle of the screen","Tap it as fast as you can to pile on damage","Its durability bar drains with every hit","Crack it open and prizes burst across the screen"],
    custom: ["Piñata → your mascot","Falling goodies → your products","Health bar colors","Party background"] }
},

/* ---------- 2 ผู้เล่น (แบ่งครึ่งจอ) ---------- */
{
  id: "vstug", icon: "🤝", cat: "versus", c1: "#ff2e88", c2: "#00d4ff", time: 20,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "ชักเย่อ 2 คน", tag: "กดรัวฝั่งตัวเอง ดึงเชือกให้ข้ามเส้น",
    how: ["แบ่งจอเป็น 2 ฝั่ง ผู้เล่นยืนคนละด้าน","แต่ละคนแตะรัว ๆ ในฝั่งของตัวเอง","เชือกจะเลื่อนไปทางฝั่งที่กดถี่กว่า","ดึงข้ามเส้นของอีกฝ่ายหรือมีคะแนนนำตอนหมดเวลาคือชนะ"],
    custom: ["สีประจำฝั่งทั้งสอง","ตัวละครสองฝั่ง","ลายเชือกและธงกลาง","พื้นหลัง"] },
  en: { name: "Tug of War", tag: "Both players hammer their side of the screen",
    how: ["The screen splits in two, one player per side","Each taps their own half as fast as they can","The rope slides toward whoever taps faster","Pull it past the opponent's line, or lead when time is up"],
    custom: ["Team colors","Character per side","Rope and centre flag","Background"] }
},
{
  id: "vspong", icon: "🏓", cat: "versus", c1: "#0b1d3a", c2: "#2fe08a", time: 0,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "ปิงปอง 2 คน", tag: "ลากแป้นฝั่งตัวเองรับลูกไม่ให้หลุด",
    how: ["แป้นของผู้เล่น 1 และ 2 อยู่คนละฝั่งจอ","ลากนิ้วในฝั่งของตัวเองเพื่อขยับแป้น","ลูกบอลเด้งไป-มาและเร็วขึ้นเรื่อย ๆ","ฝั่งไหนรับพลาดอีกฝั่งได้ 1 แต้ม ใครถึง 7 แต้มก่อนชนะ"],
    custom: ["สีแป้นทั้งสองฝั่ง","ลูกบอลเป็นโลโก้","เส้นแบ่งกลางสนาม","พื้นหลัง"] },
  en: { name: "Two-Player Pong", tag: "Each player drags their own paddle",
    how: ["One paddle per player, on opposite sides","Drag inside your own half to move it","The ball speeds up every rally","Miss and your opponent scores — first to 7 wins"],
    custom: ["Paddle colors","Ball → your logo","Centre line","Background"] }
},
{
  id: "vsair", icon: "🏒", cat: "versus", c1: "#1b6f8c", c2: "#ff6a3d", time: 0,
  devices: ["touch","kiosk","led"],
  th: { name: "แอร์ฮอกกี้", tag: "ลากไม้ตีลูกเข้าประตูอีกฝั่ง",
    how: ["ผู้เล่นแต่ละคนลากไม้ตีในครึ่งสนามของตัวเอง","ชนลูกฮอกกี้ให้พุ่งไปฝั่งตรงข้าม","ยิงเข้าประตูอีกฝั่งได้ 1 แต้ม","ใครถึง 5 แต้มก่อนเป็นผู้ชนะ"],
    custom: ["สีไม้ตีและลูกฮอกกี้","ลายพื้นสนามและโลโก้กลางสนาม","สีประตู","พื้นหลัง"] },
  en: { name: "Air Hockey", tag: "Drag your mallet, smash it into their goal",
    how: ["Each player drags a mallet inside their own half","Strike the puck toward the other side","Put it in their goal to score","First to 5 goals wins"],
    custom: ["Mallet and puck colors","Rink art and centre logo","Goal colors","Background"] }
},
{
  id: "vstap", icon: "👊", cat: "versus", c1: "#ff6a3d", c2: "#7b2ff7", time: 10,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "กดเร็วแข่งกัน", tag: "10 วินาที ใครกดได้มากกว่าชนะ",
    how: ["จอแบ่งครึ่ง มีปุ่มใหญ่ฝั่งละปุ่ม","นับถอยหลัง 3-2-1 แล้วเริ่มพร้อมกัน","แตะปุ่มฝั่งตัวเองรัว ๆ ใน 10 วินาที","แถบของทั้งสองฝั่งวิ่งแข่งกันแบบเรียลไทม์"],
    custom: ["ปุ่มเป็นโลโก้สองแบรนด์","สีประจำฝั่ง","ข้อความประกาศผู้ชนะ","พื้นหลัง"] },
  en: { name: "Tap Battle", tag: "Ten seconds — most taps wins",
    how: ["The screen splits, one big button per side","A 3-2-1 countdown starts both players together","Hammer your own button for ten seconds","Live bars race against each other as you go"],
    custom: ["Buttons → two logos","Team colors","Winner announcement wording","Background"] }
},
{
  id: "vsreact", icon: "🚥", cat: "versus", c1: "#c9302c", c2: "#2fe08a", time: 0,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "ดวลปฏิกิริยา", tag: "จอเขียวเมื่อไหร่ ใครแตะก่อนได้แต้ม",
    how: ["ทั้งสองฝั่งรอสัญญาณพร้อมกัน","จอเปลี่ยนเป็นสีเขียวแบบสุ่มเวลา","ใครแตะฝั่งตัวเองก่อนได้ 1 แต้ม","แตะก่อนสัญญาณถือว่าฟาวล์ อีกฝ่ายได้แต้มไป ใครถึง 5 แต้มก่อนชนะ"],
    custom: ["สีสัญญาณ","ไอคอนกลางจอเป็นโลโก้","ข้อความผลลัพธ์","พื้นหลัง"] },
  en: { name: "Reaction Duel", tag: "When it turns green, fastest finger wins",
    how: ["Both players wait for the signal together","The screen turns green after a random delay","Whoever taps their side first takes the point","Tapping early is a foul and hands the point over — first to 5 wins"],
    custom: ["Signal colors","Centre icon → your logo","Result wording","Background"] }
},
{
  id: "vssumo", icon: "🤼", cat: "versus", c1: "#7a2b0f", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "ดันตกเวที", tag: "กดรัวดันคู่ต่อสู้ให้ตกออกจากวง",
    how: ["ตัวละครสองตัวยืนประชันกันกลางวงกลม","แตะรัวฝั่งตัวเองเพื่อออกแรงดัน","ฝั่งที่กดถี่กว่าจะดันอีกฝ่ายถอยหลัง","ดันให้ตกออกนอกวงคือชนะยกนั้น ชนะ 3 ยกก่อนคือผู้ชนะ"],
    custom: ["ตัวละครสองฝั่ง","สีวงเวทีและขอบ","เอฟเฟกต์ตอนดัน","พื้นหลัง"] },
  en: { name: "Sumo Push", tag: "Tap fast and shove your rival out of the ring",
    how: ["Two characters face off in the middle of a circle","Tap your own side to push","Whoever taps faster drives the other backwards","Push them out of the ring to take the round — best of 3 wins"],
    custom: ["Character per side","Ring and edge colors","Push effects","Background"] }
},
{
  id: "vscatch", icon: "🧲", cat: "versus", c1: "#2fa86f", c2: "#00d4ff", time: 30,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "เก็บของแข่งกัน", tag: "ฝั่งใครเก็บของได้มากกว่าใน 30 วินาที",
    how: ["ของร่วงลงมาทั้งสองฝั่งของจอพร้อมกัน","ลากตะกร้าของตัวเองรับให้ได้มากที่สุด","ของดี +10 ระเบิด −15 คะแนน","หมดเวลาแล้วเทียบคะแนนสองฝั่ง"],
    custom: ["ตะกร้าสองฝั่งเป็นโลโก้","ของที่ตกเป็นสินค้า","สีเส้นแบ่งกลาง","พื้นหลัง"] },
  en: { name: "Catch Battle", tag: "Who collects more in 30 seconds?",
    how: ["Items rain down on both halves at once","Drag your own basket to catch as many as you can","Good items +10, bombs −15","When time is up the two scores are compared"],
    custom: ["Baskets → two logos","Falling items → your products","Divider color","Background"] }
},
{
  id: "vsmemory", icon: "🀄", cat: "versus", c1: "#2b1b6b", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "จับคู่ผลัดกัน", tag: "ผลัดกันเปิดการ์ด ใครจับคู่ได้มากกว่าชนะ",
    how: ["การ์ดคว่ำอยู่ตรงกลางจอ ผลัดกันเล่นทีละคน","เปิดได้ทีละ 2 ใบ ถ้าตรงกันได้ 1 แต้มและเล่นต่อ","ถ้าไม่ตรงกันจะสลับให้อีกฝ่ายเล่น","จับคู่ครบทุกใบแล้วนับแต้มตัดสิน"],
    custom: ["ภาพหน้าการ์ดเป็นสินค้า","ลายหลังการ์ดเป็นโลโก้","สีประจำผู้เล่นแต่ละฝั่ง","พื้นหลัง"] },
  en: { name: "Memory Duel", tag: "Take turns flipping — most pairs wins",
    how: ["Face-down cards sit in the middle; players alternate turns","Flip two at a time — a match scores a point and you go again","A mismatch passes the turn to the other player","When every pair is found, the higher score wins"],
    custom: ["Card faces → your products","Card backs → your logo","Player colors","Background"] }
},
{
  id: "vsshoot", icon: "🏹", cat: "versus", c1: "#123b57", c2: "#ff2e88", time: 30,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "ยิงเป้าแข่งกัน", tag: "ฝั่งใครยิงโดนเป้ามากกว่าใน 30 วินาที",
    how: ["แต่ละฝั่งมีเป้าวิ่งไปมาของตัวเอง","แตะในฝั่งของตัวเองเพื่อยิง","โดนวงกลางได้คะแนนมากกว่าวงนอก","หมดเวลาแล้วเทียบคะแนนสองฝั่ง"],
    custom: ["หน้าเป้าเป็นโลโก้สองแบรนด์","สีวงเป้า","เอฟเฟกต์ตอนยิงโดน","พื้นหลัง"] },
  en: { name: "Target Duel", tag: "Who hits more targets in 30 seconds?",
    how: ["Each side has its own moving target","Tap inside your own half to shoot","The inner rings are worth more than the outer","Highest score when the clock stops wins"],
    custom: ["Target faces → two logos","Ring colors","Hit effects","Background"] }
},
{
  id: "vsrun", icon: "🏁", cat: "versus", c1: "#8b2fc9", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","led","pc"],
  th: { name: "วิ่งแข่ง", tag: "กดสลับซ้าย-ขวารัว ๆ ให้ถึงเส้นชัยก่อน",
    how: ["ตัวละครสองตัววิ่งอยู่คนละเลน","แตะสลับซ้าย-ขวาในฝั่งของตัวเองเพื่อออกวิ่ง","สลับได้จังหวะดีจะวิ่งเร็วขึ้น กดรัวมั่วจะช้าลง","ถึงเส้นชัยก่อนเป็นผู้ชนะ"],
    custom: ["ตัวละครนักวิ่งสองฝั่ง","สีลู่วิ่งและเส้นชัย","ป้ายเชียร์ข้างสนาม","พื้นหลัง"] },
  en: { name: "Sprint Race", tag: "Alternate left-right taps to reach the line first",
    how: ["Two runners, one lane each","Tap left then right, alternating, inside your own side","Good rhythm means real speed; mashing randomly slows you down","First across the finish line wins"],
    custom: ["Runner per side","Track and finish-line colors","Trackside banners","Background"] }
}
]);
