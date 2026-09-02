/* ============================================================
   GAMES DATA — เกมที่ 31-65
   ============================================================ */
window.GAMES = window.GAMES.concat([
{
  id: "fruitninja", icon: "🍉", cat: "action", c1: "#ff2e88", c2: "#ffd23f", time: 40,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ปาดผลไม้", tag: "ลากนิ้วผ่านผลไม้ให้ขาดกลางอากาศ",
    how: ["ผลไม้ถูกโยนขึ้นมาจากด้านล่าง","ลากนิ้วผ่านผลไม้เพื่อฟันให้ขาด +10 คะแนน","ฟันโดนหลายลูกในการลากครั้งเดียวได้โบนัสคูณ","อย่าฟันโดนระเบิด จะเสียคะแนนหนัก"],
    custom: ["เปลี่ยนผลไม้เป็นสินค้าของแบรนด์","สีรอยฟันและประกายน้ำ","พื้นหลังฉาก","ใส่โลโก้มุมจอ"] },
  en: { name: "Fruit Slice", tag: "Swipe through the fruit mid-air",
    how: ["Fruit is tossed up from below","Swipe through it to slice: +10 points","Slicing several in one swipe gives a combo bonus","Never slice the bomb — it costs you heavily"],
    custom: ["Fruit → your products","Slice trail and juice colors","Background scene","Logo in the corner"] }
},
{
  id: "bubblewrap", icon: "🔘", cat: "action", c1: "#00d4ff", c2: "#b06bff", time: 30,
  devices: ["touch","kiosk","tablet","mobile"],
  th: { name: "บีบพลาสติกกันกระแทก", tag: "กดให้แตกให้ครบทุกเม็ดเร็วที่สุด",
    how: ["แผ่นพลาสติกเต็มจอ แต่ละเม็ดกดได้ 1 ครั้ง","กดหรือลากนิ้วผ่านเพื่อให้แตก +5 คะแนน","แตกครบทั้งแผ่นจะได้แผ่นใหม่ที่เม็ดถี่ขึ้น","เล่นแล้วเพลิน เหมาะวางไว้ให้คนรอคิว"],
    custom: ["สีเม็ดและสีแผ่นรอง","รูปทรงเม็ด (กลม/สี่เหลี่ยม/โลโก้)","เสียงตอนแตก","พื้นหลัง"] },
  en: { name: "Bubble Wrap", tag: "Pop every bubble as fast as you can",
    how: ["A sheet of bubbles fills the screen","Tap or drag across to pop: +5 points","Clear the sheet and a denser one appears","Oddly satisfying — great for queue areas"],
    custom: ["Bubble and sheet colors","Bubble shape (round / square / logo)","Pop sound","Background"] }
},
{
  id: "dodgerock", icon: "☄️", cat: "arcade", c1: "#7b2ff7", c2: "#0d1b4a", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "หลบอุกกาบาต", tag: "ลากยานหลบก้อนหินให้นานที่สุด",
    how: ["ลากนิ้วเพื่อบังคับยานไปทุกทิศ","ก้อนหินร่วงลงมาเรื่อย ๆ และเร็วขึ้น","รอดได้นานเท่าไหร่ คะแนนยิ่งเพิ่ม","ชนหินครั้งเดียวจบเกม"],
    custom: ["เปลี่ยนยานเป็นมาสคอต/สินค้า","รูปทรงและสีอุกกาบาต","ฉากอวกาศพื้นหลัง","สีเส้นทางไฟท้ายยาน"] },
  en: { name: "Asteroid Dodge", tag: "Steer the ship, survive as long as you can",
    how: ["Drag to fly the ship in any direction","Rocks keep falling, faster and faster","The longer you survive the higher you score","One hit ends the run"],
    custom: ["Ship → mascot or product","Asteroid shapes and colors","Space backdrop","Engine-trail color"] }
},
{
  id: "laneswitch", icon: "🛣️", cat: "arcade", c1: "#ff6a3d", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "สลับเลน", tag: "ลากนิ้วซ้าย-ขวาเปลี่ยนเลนหลบสิ่งกีดขวาง",
    how: ["รถวิ่งอยู่บนถนน 3 เลน","วางนิ้วแล้วลากซ้าย-ขวา รถจะย้ายไปเลนที่นิ้วอยู่ (กดค้างลากได้ต่อเนื่อง)","หลบสิ่งกีดขวางที่วิ่งเข้ามา +10 คะแนน","เก็บเหรียญทองระหว่างทางได้คะแนนพิเศษ"],
    custom: ["ตัวละครที่วิ่ง","สิ่งกีดขวางเป็นวัตถุของแบรนด์","เหรียญเป็นโลโก้","สีถนนและฉากข้างทาง"] },
  en: { name: "Lane Switch", tag: "Drag left or right to change lane",
    how: ["Your car runs on a three-lane road","Press and drag sideways — the car moves to whichever lane your finger is over","Dodge the obstacles coming at you: +10","Grab gold coins on the way for bonus points"],
    custom: ["Runner character","Obstacles → brand objects","Coins → your logo","Road and roadside art"] }
},
{
  id: "colorswitch", icon: "🔵", cat: "arcade", c1: "#2fe08a", c2: "#7b2ff7", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ผ่านวงสี", tag: "แตะให้ลูกบอลลอดวงกลมตรงสีที่ตรงกัน",
    how: ["แตะจอให้ลูกบอลกระโดดขึ้น","วงกลมหมุนมี 4 สี ลูกบอลผ่านได้เฉพาะช่องที่สีตรงกับตัวเอง","ผ่านวงได้ +15 คะแนน แล้วลูกบอลจะเปลี่ยนสีใหม่","แตะโดนสีผิดจบเกมทันที"],
    custom: ["ชุดสีทั้ง 4","ขนาดและความเร็วการหมุน","ลูกบอลเป็นโลโก้","พื้นหลัง"] },
  en: { name: "Color Switch", tag: "Pass the ring only through your matching color",
    how: ["Tap to make the ball hop upward","Each spinning ring has four colors","You may only pass through the arc matching your ball: +15","Touch the wrong color and the run ends"],
    custom: ["The four-color palette","Ring size and spin speed","Ball → your logo","Background"] }
},
{
  id: "rhythmring", icon: "⭕", cat: "action", c1: "#ff2e88", c2: "#00d4ff", time: 40,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "แตะให้ตรงวง", tag: "วงแหวนหดเข้าหาเป้า แตะตอนซ้อนกันพอดี",
    how: ["วงแหวนใหญ่ค่อย ๆ หดเข้าหาวงเป้าตรงกลาง","แตะตอนวงซ้อนกันพอดีที่สุด","เป๊ะมาก +30 / เฉียด +15 / หลุด −5","ผ่านไปเรื่อย ๆ วงจะหดเร็วขึ้น"],
    custom: ["สีวงแหวนและวงเป้า","รูปกลางวงเป็นโลโก้","เอฟเฟกต์ตอนแตะเป๊ะ","พื้นหลัง"] },
  en: { name: "Perfect Ring", tag: "Tap the instant the rings line up",
    how: ["A wide ring shrinks toward the target ring","Tap when they overlap exactly","Perfect +30, close +15, miss −5","The ring shrinks faster as you go"],
    custom: ["Ring and target colors","Center mark → your logo","Perfect-hit effect","Background"] }
},
{
  id: "colorrule", icon: "🎨", cat: "brain", c1: "#ffd23f", c2: "#ff2e88", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "กดสีให้ตรงกฎ", tag: "จำสีตัวอย่างแล้วเลือกให้ถูกในเวลาสั้น",
    how: ["กรอบตัวอย่างแสดงสีเป้าหมาย 1 สี","ด้านล่างมีปุ่มสี 4 ปุ่ม","แตะปุ่มที่สีตรงกับกรอบ +15 คะแนน","ผ่านรอบ สีจะใกล้เคียงกันขึ้นเรื่อย ๆ"],
    custom: ["ชุดสีที่ใช้สุ่ม","รูปทรงกรอบและปุ่ม","ใส่โลโก้เหนือกรอบ","พื้นหลัง"] },
  en: { name: "Match the Color", tag: "Pick the swatch that matches the target",
    how: ["A frame shows one target color","Four color buttons sit below","Tap the one that matches: +15","Each round the shades get closer together"],
    custom: ["Random color palette","Frame and button shapes","Logo above the frame","Background"] }
},
{
  id: "juggle", icon: "⚽", cat: "skill", c1: "#2fe08a", c2: "#00d4ff", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เดาะบอล", tag: "แตะลูกบอลไม่ให้ตกพื้น",
    how: ["ลูกบอลตกลงมาตามแรงโน้มถ่วง","แตะที่ลูกบอลเพื่อเดาะขึ้น +1 ครั้ง","แตะเยื้องซ้าย-ขวา ลูกจะกระเด็นไปทางนั้น","ตกพื้นเมื่อไหร่จบเกม"],
    custom: ["เปลี่ยนลูกบอลเป็นสินค้า/โลโก้","สีเงาและเส้นทางลูกบอล","ฉากสนามพื้นหลัง","ตัวเลขนับแบบแบรนด์"] },
  en: { name: "Keepy Uppy", tag: "Tap the ball, never let it drop",
    how: ["Gravity pulls the ball down","Tap the ball to kick it back up: +1","Tap off-center to send it left or right","Let it hit the ground and it's over"],
    custom: ["Ball → product or logo","Shadow and trail colors","Pitch background","Brand-styled counter"] }
},
{
  id: "tunnelfly", icon: "✈️", cat: "arcade", c1: "#0d1b4a", c2: "#00d4ff", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "บินลอดอุโมงค์", tag: "ลากขึ้น-ลงพาเครื่องบินผ่านช่องแคบ",
    how: ["ลากนิ้วขึ้น-ลงเพื่อบังคับเครื่องบิน","ผนังอุโมงค์คดเคี้ยวและแคบลงเรื่อย ๆ","บินได้ไกลเท่าไหร่ คะแนนยิ่งสูง","ชนผนังจบเกม"],
    custom: ["เปลี่ยนเครื่องบินเป็นมาสคอต","สีผนังอุโมงค์","ลายพื้นหลังที่ไหลผ่าน","ไฟท้ายเครื่อง"] },
  en: { name: "Tunnel Flight", tag: "Drag up and down through the narrowing tunnel",
    how: ["Drag vertically to fly the plane","The tunnel walls twist and get tighter","The further you fly, the higher the score","Touch a wall and the run ends"],
    custom: ["Plane → your mascot","Tunnel wall colors","Scrolling background pattern","Engine glow"] }
},
{
  id: "zigzag", icon: "⚡", cat: "arcade", c1: "#ff6a3d", c2: "#7b2ff7", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ซิกแซก", tag: "แตะเพื่อเปลี่ยนทิศ อยู่บนทางให้ได้",
    how: ["ลูกบอลวิ่งไปเรื่อย ๆ บนทางเดินซิกแซก","แตะจอเพื่อสลับทิศทาง 90 องศา","อยู่บนทางได้นานเท่าไหร่ ยิ่งได้คะแนน","ตกออกนอกทางจบเกม"],
    custom: ["สีทางเดินและลูกบอล","รูปทรงลูกบอลเป็นโลโก้","สีพื้นหลัง/เงา","เอฟเฟกต์ตอนตก"] },
  en: { name: "Zigzag", tag: "Tap to turn, stay on the path",
    how: ["The ball rolls forward along a zigzag path","Tap to switch direction by 90°","Every step on the path scores","Fall off the edge and it's over"],
    custom: ["Path and ball colors","Ball → your logo","Background and shadow","Falling effect"] }
},
{
  id: "dart", icon: "🍊", cat: "skill", c1: "#c81d6b", c2: "#ffd23f", time: 40,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ปาลูกดอกใส่ผลไม้", tag: "จับจังหวะปาให้ปักขอบผลไม้ที่หมุนอยู่",
    how: ["ผลไม้ผ่าซีกหมุนอยู่กลางจอตลอดเวลา","แตะเพื่อปาลูกดอกขึ้นไปปักที่ขอบผลไม้","ถ้าปักโดนลูกดอกที่ปักอยู่ก่อนแล้วถือว่าพลาด","ปักครบตามจำนวนเพื่อผ่านรอบ แล้วเปลี่ยนเป็นผลไม้ชนิดใหม่"],
    custom: ["เปลี่ยนชนิดและสีผลไม้ (แตงโม ส้ม กีวี มะนาว แก้วมังกร)","เปลี่ยนสีลูกดอกและหางปีก","จำนวนลูกต่อรอบและความเร็วหมุน","เปลี่ยนภาพพื้นหลัง"] },
  en: { name: "Fruit Darts", tag: "Time your throw into the spinning fruit",
    how: ["A sliced fruit spins in the middle of the screen","Tap to throw a dart into its rim","Hitting a dart already stuck there is a miss","Land every dart to clear the round and get a new fruit"],
    custom: ["Fruit type and colors (watermelon, orange, kiwi, lemon, dragon fruit)","Dart body and flight colors","Darts per round and spin speed","Background image"] }
},
{
  id: "bottleflip", icon: "🧴", cat: "skill", c1: "#1b6f8c", c2: "#2fe08a", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "โยนขวดให้ตั้ง", tag: "ปัดนิ้วขึ้นให้ขวดตีลังกาแล้วลงตั้งพอดี",
    how: ["ลากนิ้วขึ้นจากขวด ยิ่งลากไกลขวดยิ่งลอยสูงและหมุนเร็ว","ลากเฉียงซ้าย-ขวาเพื่อกะระยะไปยังแท่นถัดไป","ขวดต้องลงบนแท่นในท่าตั้งตรงถึงจะนับ +50 คะแนน","ลงแล้วล้มหรือตกแท่น เสียชีวิต 1 ดวง (มี 3 ดวง)"],
    custom: ["เปลี่ยนรูปทรงและสีขวดเป็นสินค้าจริง","สีน้ำในขวดและฉลาก","สีแท่นและฉากพื้นหลัง","ใส่โลโก้บนฉลากขวด"] },
  en: { name: "Bottle Flip", tag: "Swipe up, spin the bottle, stick the landing",
    how: ["Drag upward from the bottle — a longer drag means more height and spin","Angle the drag left or right to reach the next platform","The bottle has to land upright on the platform: +50 points","Landing on its side or missing costs one of your 3 lives"],
    custom: ["Bottle shape and colors → your real product","Liquid color and label art","Platform colors and scenery","Logo on the bottle label"] }
},
{
  id: "penalty", icon: "🥅", cat: "skill", c1: "#1c5e2f", c2: "#8fd14f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ยิงจุดโทษ", tag: "ลากเล็งมุมประตู หลบมือผู้รักษาประตู",
    how: ["ลากนิ้วจากลูกบอลไปยังจุดที่อยากให้บอลไป","ผู้รักษาประตูจะพุ่งไปด้านใดด้านหนึ่ง","ยิงเข้าประตู +50 คะแนน","ยิงพลาดหรือโดนเซฟ 3 ครั้งจบเกม"],
    custom: ["ชุดผู้รักษาประตู","สีเสาประตูและตาข่าย","ลูกบอลเป็นโลโก้","สนามพื้นหลัง"] },
  en: { name: "Penalty Kick", tag: "Aim for the corner, beat the keeper",
    how: ["Drag from the ball toward where you want it to go","The keeper dives to one side","Score a goal: +50 points","Three misses or saves ends the game"],
    custom: ["Keeper kit","Goal frame and net colors","Ball → your logo","Stadium backdrop"] }
},
{
  id: "golfputt", icon: "⛳", cat: "skill", c1: "#2fa86f", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "พัตต์กอล์ฟ", tag: "ลากเล็งแรงและทิศ พัตต์ลงหลุมให้จำนวนตาน้อยที่สุด",
    how: ["ลากนิ้วจากลูกกอล์ฟไปทางที่อยากให้ลูกวิ่ง","หัวลูกศรบอกทิศ แถบด้านบนบอกแรง ยิ่งลากไกลยิ่งแรง","ลูกจะกลิ้งและชะลอลงเอง เด้งขอบสนามได้","ลงหลุมแล้วไปด่านถัดไปที่มีสิ่งกีดขวางมากขึ้น"],
    custom: ["สีสนามหญ้าและหลุม","ธงหลุมเป็นโลโก้","สิ่งกีดขวางเป็นวัตถุแบรนด์","พื้นหลัง"] },
  en: { name: "Mini Golf", tag: "Drag to aim, sink it in as few putts as possible",
    how: ["Drag from the ball toward where you want it to go","The arrow shows direction, the top bar shows power — longer drag hits harder","The ball rolls, slows down and bounces off the walls","Sink it to reach the next, harder hole"],
    custom: ["Green and cup colors","Flag → your logo","Obstacles → brand objects","Background"] }
},
{
  id: "slingshot", icon: "📦", cat: "skill", c1: "#8b2fc9", c2: "#ff6a3d", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "หนังสติ๊ก", tag: "ดึงแล้วปล่อยให้ถล่มกองเป้าหมาย",
    how: ["ลากลูกกระสุนถอยหลังเพื่อเล็ง","ปล่อยนิ้วเพื่อยิงเป็นวิถีโค้ง","โดนกล่องเป้าหมายทำให้กองถล่ม +20 ต่อกล่อง","มีกระสุน 5 นัดต่อด่าน"],
    custom: ["กระสุนเป็นมาสคอต","กล่องเป้าหมายเป็นสินค้า","สีหนังสติ๊ก","ฉากพื้นหลัง"] },
  en: { name: "Slingshot", tag: "Pull back and knock the stack down",
    how: ["Drag the projectile back to aim","Release to fire it in an arc","Each crate you topple: +20 points","Five shots per level"],
    custom: ["Projectile → your mascot","Crates → your products","Slingshot color","Background scene"] }
},
{
  id: "cannonball", icon: "💣", cat: "skill", c1: "#5b1064", c2: "#ff2e88", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ยิงปืนใหญ่", tag: "ตั้งมุมและแรงยิงข้ามกำแพงให้โดนเป้า",
    how: ["แถบมุมยิงและแถบแรงวิ่งสลับกัน","แตะครั้งแรกล็อกมุม ครั้งที่สองล็อกแรง แล้วยิงทันที","ยิงข้ามกำแพงไปโดนเป้า +40 คะแนน","เป้าจะเลื่อนไกลขึ้นทุกครั้งที่ยิงโดน"],
    custom: ["ปืนใหญ่และกระสุน","สีกำแพงและเป้า","เอฟเฟกต์ระเบิด","พื้นหลัง"] },
  en: { name: "Cannon Shot", tag: "Set the angle and power, clear the wall",
    how: ["An angle bar and a power bar sweep in turn","First tap locks the angle, second locks power and fires","Clear the wall and hit the target: +40","Each hit pushes the target further away"],
    custom: ["Cannon and shell art","Wall and target colors","Explosion effect","Background"] }
},
{
  id: "fishing", icon: "🎣", cat: "skill", c1: "#0d2b4e", c2: "#00d4ff", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ตกปลา", tag: "หย่อนเบ็ดจับจังหวะเกี่ยวปลาที่ว่ายผ่าน",
    how: ["ปลาว่ายไป-มาหลายระดับความลึก","แตะเพื่อหย่อนเบ็ดลงไป","เบ็ดโดนปลาจะเกี่ยวติดขึ้นมา ปลาใหญ่คะแนนเยอะกว่า","ระวังขยะและปลาปักเป้า จะเสียคะแนน"],
    custom: ["ชนิดปลาและสี","เปลี่ยนปลาเป็นสินค้า","สีน้ำและฉากใต้น้ำ","เรือ/คันเบ็ดเป็นแบรนด์"] },
  en: { name: "Fishing", tag: "Drop the hook and time it right",
    how: ["Fish swim back and forth at several depths","Tap to drop the hook","Hook a fish and reel it up — bigger fish score more","Avoid trash and pufferfish, they cost points"],
    custom: ["Fish types and colors","Fish → your products","Water and seabed art","Boat / rod branding"] }
},
{
  id: "cranegrab", icon: "🕹️", cat: "skill", c1: "#ff2e88", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ตู้คีบตุ๊กตา", tag: "หยุดคีบให้ตรงของ แล้วกดคีบ",
    how: ["หัวคีบเลื่อนซ้าย-ขวาอยู่ด้านบน","แตะครั้งแรกเพื่อหยุดตรงตำแหน่งที่ต้องการ","คีบจะหย่อนลงไปคีบของขึ้นมา","คีบติดได้รางวัล คีบพลาดเสีย 1 สิทธิ์ (มี 5 สิทธิ์)"],
    custom: ["ของในตู้เป็นสินค้าจริง","สีตู้และหัวคีบ","ใส่โลโก้บนกระจกตู้","พื้นหลัง"] },
  en: { name: "Claw Machine", tag: "Stop the claw over a prize, then grab",
    how: ["The claw slides left and right above the pit","Tap once to stop it where you want","It lowers and tries to grab","A catch wins a prize; a miss costs one of your 5 tries"],
    custom: ["Prizes → your real products","Cabinet and claw colors","Logo on the glass","Background"] }
},
{
  id: "ringtoss", icon: "💍", cat: "skill", c1: "#1b6f8c", c2: "#ffd23f", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "โยนห่วง", tag: "ลากเล็งแล้วปล่อยห่วงให้คล้องเสา",
    how: ["ลากนิ้วเพื่อกำหนดทิศและแรงโยน","ห่วงลอยเป็นวิถีโค้งไปหาแถวเสา","คล้องเสาได้ +30 คะแนน เสาไกลได้มากกว่า","มีห่วง 10 อันต่อรอบ"],
    custom: ["สีห่วงและเสา","ของรางวัลบนเสา","โต๊ะ/ฉากงานวัด","โลโก้บนป้าย"] },
  en: { name: "Ring Toss", tag: "Drag to aim, land the ring on a peg",
    how: ["Drag to set direction and power","The ring flies in an arc toward the pegs","Landing on a peg scores +30; far pegs score more","Ten rings per round"],
    custom: ["Ring and peg colors","Prizes on the pegs","Fairground table and scene","Logo on the signage"] }
},
{
  id: "axethrow", icon: "🎪", cat: "skill", c1: "#7a4a12", c2: "#ff6a3d", time: 40,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ปาขวาน", tag: "จับจังหวะปาขวานให้ปักกลางเป้าไม้",
    how: ["ขวานหมุนอยู่ด้านล่างจอ","แตะเพื่อปาขึ้นไปที่เป้าไม้","ปักกลางเป้า +50 / วงรอบ +20 / ขอบ +10","ปาไม่ติด 3 ครั้งจบเกม"],
    custom: ["ลายเป้าไม้เป็นโลโก้","สีขวาน","ผนังฉากพื้นหลัง","เอฟเฟกต์ตอนปัก"] },
  en: { name: "Axe Throw", tag: "Time the throw, stick it in the bullseye",
    how: ["The axe spins at the bottom of the screen","Tap to throw it at the wooden target","Bullseye +50, inner ring +20, edge +10","Three throws that don't stick ends the game"],
    custom: ["Target face → your logo","Axe colors","Back wall scene","Impact effect"] }
},
{
  id: "lightsout", icon: "💡", cat: "brain", c1: "#1b1442", c2: "#ffd23f", time: 90,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ดับไฟให้หมด", tag: "กดไฟ 1 ดวง ดวงข้าง ๆ จะสลับตาม",
    how: ["ตารางไฟ 4×4 มีบางดวงติดอยู่","กดดวงไหน ดวงนั้นและ 4 ดวงรอบข้างจะสลับติด-ดับ","เป้าหมายคือทำให้ดับทั้งกระดาน","ผ่านแล้วไปด่านที่ยากขึ้น"],
    custom: ["สีไฟติด/ไฟดับ","รูปทรงหลอดไฟหรือไอคอนแบรนด์","สีกรอบตาราง","พื้นหลัง"] },
  en: { name: "Lights Out", tag: "Tap a light and its neighbours flip too",
    how: ["A 4×4 grid with some lights on","Tapping a cell toggles it and its four neighbours","Turn every light off to win","Clear it and a harder board appears"],
    custom: ["On / off colors","Bulb shape or brand icon","Grid frame color","Background"] }
},
{
  id: "hanoi", icon: "🗼", cat: "brain", c1: "#7a2b0f", c2: "#ffd23f", time: 120,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "หอคอยฮานอย", tag: "ย้ายกองจานไปเสาขวาโดยห้ามวางจานใหญ่ทับเล็ก",
    how: ["มีจาน 4 แผ่นเรียงจากใหญ่ไปเล็กบนเสาซ้าย","แตะเสาต้นทางแล้วแตะเสาปลายทางเพื่อย้ายจานบนสุด","ห้ามวางจานใหญ่ทับจานเล็ก","ย้ายทั้งกองไปเสาขวาให้ครบ ใช้ตาน้อยยิ่งได้คะแนนมาก"],
    custom: ["สีจานแต่ละชั้น","รูปทรงเสา","จานเป็นกล่องสินค้า","พื้นหลัง"] },
  en: { name: "Tower of Hanoi", tag: "Move the stack — never a big disc on a small one",
    how: ["Four discs sit on the left peg, largest at the bottom","Tap a peg to pick up its top disc, tap another to drop it","A larger disc may never rest on a smaller one","Rebuild the stack on the right peg in as few moves as possible"],
    custom: ["Disc colors","Peg shape","Discs → product boxes","Background"] }
},
{
  id: "flood", icon: "🌊", cat: "brain", c1: "#0d3b40", c2: "#2fe08a", time: 90,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เติมสีให้เต็มกระดาน", tag: "เลือกสีทีละครั้งให้พื้นที่ของคุณขยายจนเต็ม",
    how: ["เริ่มจากช่องมุมซ้ายบนเป็นพื้นที่ของคุณ","เลือกสีจากปุ่มด้านล่าง พื้นที่ของคุณจะเปลี่ยนเป็นสีนั้น","ช่องข้างเคียงที่สีเดียวกันจะถูกดูดรวมเข้ามา","ทำให้ทั้งกระดานเป็นสีเดียวภายในจำนวนตาที่กำหนด"],
    custom: ["ชุดสี 6 สี","ขนาดกระดาน","รูปทรงช่อง","พื้นหลัง"] },
  en: { name: "Flood It", tag: "Pick colors until the whole board is yours",
    how: ["You start from the top-left tile","Pick a color and your area turns that color","Matching neighbours get absorbed into your area","Fill the whole board within the move limit"],
    custom: ["The six-color palette","Board size","Tile shape","Background"] }
},
{
  id: "match3", icon: "💎", cat: "brain", c1: "#3b1170", c2: "#00d4ff", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "จับคู่สาม", tag: "สลับช่องข้างกันให้เรียงสีเหมือนกัน 3 ช่อง",
    how: ["ตารางเต็มไปด้วยอัญมณีหลายสี","แตะช่องหนึ่งแล้วแตะช่องที่ติดกันเพื่อสลับตำแหน่ง","เรียงสีเดียวกัน 3 ช่องขึ้นไปจะระเบิดหายไป +30","อัญมณีด้านบนจะร่วงลงมาเติมช่องว่างเอง"],
    custom: ["เปลี่ยนอัญมณีเป็นไอคอนสินค้า","ชุดสี","เอฟเฟกต์ตอนระเบิด","พื้นหลังกระดาน"] },
  en: { name: "Match Three", tag: "Swap neighbours to line up three of a kind",
    how: ["The board is filled with colored gems","Tap one gem, then a neighbour, to swap them","Three or more in a row clears them: +30","Gems above fall down to fill the gaps"],
    custom: ["Gems → product icons","Color palette","Clear effect","Board background"] }
},
{
  id: "merge", icon: "🔢", cat: "brain", c1: "#ff9a5b", c2: "#ffd23f", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "2048", tag: "ปัดนิ้วให้เลขเท่ากันชนกันแล้วรวมเป็นเลขใหม่",
    how: ["ปัดนิ้วขึ้น/ลง/ซ้าย/ขวา ตัวเลขทั้งกระดานจะเลื่อนไปทางนั้น","เลขเท่ากันที่ชนกันจะรวมเป็นเลขคูณสอง","ทุกครั้งที่เลื่อนจะมีเลขใหม่โผล่มา","กระดานเต็มและเลื่อนไม่ได้อีกคือจบเกม"],
    custom: ["สีของแต่ละระดับตัวเลข","เปลี่ยนตัวเลขเป็นระดับสินค้า","สีกระดาน","พื้นหลัง"] },
  en: { name: "2048", tag: "Swipe to slide and merge equal tiles",
    how: ["Swipe in any direction and every tile slides that way","Two equal tiles that collide merge into their double","A new tile appears after every move","When the board is full and nothing can move, it's over"],
    custom: ["Color per tile level","Numbers → product tiers","Board color","Background"] }
},
{
  id: "watersort", icon: "🧪", cat: "brain", c1: "#1b6ca8", c2: "#2fe08a", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เทน้ำแยกสี", tag: "เทน้ำข้ามหลอดจนแต่ละหลอดเหลือสีเดียว",
    how: ["หลอดแก้วบรรจุน้ำหลายสีปนกัน","แตะหลอดต้นทาง แล้วแตะหลอดปลายทางเพื่อเท","เทได้เฉพาะเมื่อสีบนสุดตรงกัน หรือหลอดปลายทางว่าง","แยกให้ครบทุกสีเพื่อผ่านด่าน"],
    custom: ["ชุดสีของน้ำ","รูปทรงหลอด","สีพื้นชั้นวาง","พื้นหลัง"] },
  en: { name: "Water Sort", tag: "Pour between tubes until each holds one color",
    how: ["Test tubes hold layers of mixed colors","Tap a source tube, then a destination tube to pour","You may only pour onto the same color, or into an empty tube","Sort every color to clear the level"],
    custom: ["Liquid palette","Tube shape","Shelf color","Background"] }
},
{
  id: "pipe", icon: "🔧", cat: "brain", c1: "#0b2e4a", c2: "#ffd23f", time: 90,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ต่อท่อ", tag: "หมุนท่อให้เชื่อมจากต้นทางถึงปลายทาง",
    how: ["ตารางเต็มไปด้วยชิ้นส่วนท่อที่หมุนผิดทิศ","แตะชิ้นไหนเพื่อหมุนทีละ 90 องศา","ต่อให้น้ำไหลจากท่อสีเขียวไปถึงท่อสีแดง","เชื่อมครบท่อจะสว่างขึ้นทั้งเส้น"],
    custom: ["สีท่อและน้ำ","สีต้นทาง/ปลายทาง","ลายพื้นตาราง","พื้นหลัง"] },
  en: { name: "Pipe Connect", tag: "Rotate the pipes to link start to finish",
    how: ["The grid is full of pipe pieces facing the wrong way","Tap a piece to rotate it 90°","Build a path from the green inlet to the red outlet","A completed line lights up end to end"],
    custom: ["Pipe and water colors","Inlet / outlet colors","Grid floor pattern","Background"] }
},
{
  id: "minesweep", icon: "🚩", cat: "brain", c1: "#2b2350", c2: "#00d4ff", time: 120,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เก็บกู้ระเบิด", tag: "เปิดช่องให้ครบโดยไม่โดนระเบิด",
    how: ["ตาราง 6×6 ซ่อนระเบิดไว้ 6 ลูก","แตะสั้นเพื่อเปิดช่อง ตัวเลขบอกจำนวนระเบิดรอบข้าง","แตะค้างเพื่อปักธงตรงช่องที่คิดว่าเป็นระเบิด","เปิดช่องปลอดภัยครบทุกช่องคือชนะ"],
    custom: ["สีช่องเปิด/ปิด","ไอคอนระเบิดและธง","สีตัวเลข","พื้นหลัง"] },
  en: { name: "Minesweeper", tag: "Clear every safe square without hitting a mine",
    how: ["A 6×6 grid hides six mines","Tap to open a square — the number counts mines around it","Long-press to flag a square you think is a mine","Open every safe square to win"],
    custom: ["Open / closed tile colors","Mine and flag icons","Number colors","Background"] }
},
{
  id: "sudoku4", icon: "🧮", cat: "brain", c1: "#123b57", c2: "#2fe08a", time: 120,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ซูโดกุ 4×4", tag: "เติมเลข 1-4 ไม่ให้ซ้ำในแถว หลัก และกล่อง",
    how: ["ตาราง 4×4 มีบางช่องเติมมาให้แล้ว","แตะช่องว่างเพื่อเลือกช่อง แล้วแตะตัวเลข 1-4 ด้านล่าง","ห้ามมีเลขซ้ำในแถวเดียวกัน หลักเดียวกัน หรือกล่อง 2×2 เดียวกัน","เติมครบถูกต้องคือผ่าน"],
    custom: ["เปลี่ยนตัวเลขเป็นไอคอน 4 แบบ","สีช่องโจทย์/ช่องที่เติมเอง","สีเส้นตาราง","พื้นหลัง"] },
  en: { name: "Sudoku 4×4", tag: "Fill 1-4 with no repeats in a row, column or box",
    how: ["A 4×4 grid comes with some numbers filled in","Tap an empty cell, then tap a number from 1-4 below","No number may repeat in a row, a column, or a 2×2 box","Fill it correctly to clear the puzzle"],
    custom: ["Numbers → four icons","Given / entered cell colors","Grid line colors","Background"] }
},
{
  id: "sequence", icon: "🔟", cat: "brain", c1: "#4b1d95", c2: "#00d4ff", time: 45,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "เรียงตัวเลข", tag: "แตะเลข 1 ถึง 12 ตามลำดับให้เร็วที่สุด",
    how: ["ตัวเลขกระจายอยู่ทั่วจอแบบสุ่ม","แตะเลข 1 แล้ว 2 แล้ว 3 ไปเรื่อย ๆ ตามลำดับ","แตะถูก +10 คะแนน แตะผิด −5 คะแนน","ครบ 12 ตัวจะสุ่มชุดใหม่ที่เยอะขึ้น"],
    custom: ["สีวงกลมตัวเลข","เปลี่ยนตัวเลขเป็นลำดับโลโก้","สีพื้น","พื้นหลัง"] },
  en: { name: "Number Order", tag: "Tap 1 to 12 in order, as fast as you can",
    how: ["Numbers are scattered randomly across the screen","Tap 1, then 2, then 3 and so on","Correct tap +10, wrong tap −5","Clear all twelve and a bigger set appears"],
    custom: ["Number bubble colors","Numbers → ordered logos","Floor color","Background"] }
},
{
  id: "tetris", icon: "🟦", cat: "arcade", c1: "#0a0a1e", c2: "#00d4ff", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "Tetris", tag: "หมุนและเลื่อนบล็อกให้เต็มแถว",
    how: ["บล็อกรูปทรงต่าง ๆ ร่วงลงมาจากด้านบน","แตะซ้าย/ขวาเพื่อเลื่อน แตะกลางเพื่อหมุน","ปัดนิ้วลงเพื่อให้ตกเร็ว","เต็มแถวไหนแถวนั้นหายไป +100 คะแนน"],
    custom: ["สีบล็อกแต่ละรูปทรง","สีเส้นตารางและกรอบ","เอฟเฟกต์ตอนเคลียร์แถว","พื้นหลัง"] },
  en: { name: "Tetris", tag: "Rotate and slide the blocks to fill rows",
    how: ["Shaped blocks fall from the top","Tap left or right to move, tap the middle to rotate","Swipe down to drop fast","Every completed row clears: +100 points"],
    custom: ["Color per block shape","Grid and frame colors","Row-clear effect","Background"] }
},
{
  id: "towerdrop", icon: "🕳️", cat: "arcade", c1: "#5b0f4a", c2: "#ff6a3d", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "บอลตกหอ", tag: "ลากหมุนหอให้ลูกบอลตกผ่านช่องว่าง",
    how: ["ลูกบอลเด้งอยู่บนแป้นวงกลมที่ซ้อนกันเป็นหอ","ลากนิ้วซ้าย-ขวาเพื่อหมุนหอทั้งอัน","หาช่องว่างให้ลูกบอลตกผ่านลงไปชั้นถัดไป +10 คะแนน","ตกโดนแถบสีแดงจบเกม"],
    custom: ["สีแป้นแต่ละชั้น","สีแถบอันตราย","ลูกบอลเป็นโลโก้","พื้นหลัง"] },
  en: { name: "Helix Drop", tag: "Spin the tower, drop the ball through the gaps",
    how: ["The ball bounces on stacked circular platforms","Drag left or right to spin the whole tower","Line up a gap and let the ball fall through: +10","Landing on a red segment ends the run"],
    custom: ["Platform colors","Danger-segment color","Ball → your logo","Background"] }
},
{
  id: "platformjump", icon: "🦘", cat: "arcade", c1: "#2b1055", c2: "#7597de", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "กระโดดขึ้นแท่น", tag: "เอียงซ้าย-ขวาให้กระโดดขึ้นแท่นไปเรื่อย ๆ",
    how: ["ตัวละครกระโดดเด้งขึ้นเองเมื่อแตะแท่น","ลากหรือแตะซ้าย-ขวาเพื่อบังคับทิศ","ขึ้นได้สูงเท่าไหร่ คะแนนยิ่งเยอะ","ตกลงมาต่ำกว่าจอจบเกม"],
    custom: ["ตัวละครกระโดด","สีและลายแท่น","ฉากพื้นหลังไล่ระดับ","ไอเทมพิเศษเป็นโลโก้"] },
  en: { name: "Jump Up", tag: "Steer left and right, climb platform by platform",
    how: ["Your character bounces automatically off each platform","Drag or tap left / right to steer","The higher you climb, the more you score","Fall below the screen and it's over"],
    custom: ["Jumper character","Platform colors and patterns","Layered background scene","Power-ups → your logo"] }
},
{
  id: "spacewar", icon: "👾", cat: "arcade", c1: "#0a0a1e", c2: "#7b2ff7", time: 0,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ยิงยานอวกาศ", tag: "ลากยานหลบและยิงศัตรูที่บินลงมา",
    how: ["ลากนิ้วเพื่อบังคับยานซ้าย-ขวา ยานยิงเองอัตโนมัติ","ยิงศัตรูตกได้ลำละ 15 คะแนน","หลบกระสุนของศัตรู โดนเสียชีวิต 1 ดวง (มี 3 ดวง)","ยิ่งเล่นนานศัตรูยิ่งเยอะและเร็ว"],
    custom: ["ยานผู้เล่นและศัตรู","สีกระสุนและเอฟเฟกต์ระเบิด","ฉากอวกาศ","ไอคอนชีวิตเป็นโลโก้"] },
  en: { name: "Space Shooter", tag: "Steer, shoot, survive the waves",
    how: ["Drag to move your ship — it fires automatically","Each enemy destroyed: +15 points","Dodge their shots; a hit costs one of your 3 lives","Waves get denser and faster the longer you last"],
    custom: ["Player and enemy ships","Bullet colors and explosions","Space backdrop","Life icons → your logo"] }
},
{
  id: "defendbase", icon: "🏰", cat: "arcade", c1: "#1a1040", c2: "#ff2e88", time: 60,
  devices: ["touch","kiosk","tablet","mobile","pc"],
  th: { name: "ป้องกันฐาน", tag: "แตะทำลายศัตรูก่อนถึงฐานกลางจอ",
    how: ["ฐานของคุณอยู่กลางจอ","ศัตรูเดินเข้ามาจากทุกทิศทาง","แตะที่ศัตรูเพื่อทำลาย +15 คะแนน","ปล่อยให้ศัตรูถึงฐาน 5 ตัวจบเกม"],
    custom: ["รูปฐานเป็นโลโก้แบรนด์","ตัวศัตรูเป็นคาแรกเตอร์","สีวงพลังและเอฟเฟกต์","พื้นหลัง"] },
  en: { name: "Defend the Base", tag: "Tap the attackers before they reach the middle",
    how: ["Your base sits in the centre of the screen","Enemies close in from every direction","Tap one to destroy it: +15 points","Let five reach the base and it's over"],
    custom: ["Base → your logo","Enemies → brand characters","Shield ring colors and effects","Background"] }
}
]);
