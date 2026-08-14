/* ═══════════ الإعدادات — عدّل هون ═══════════ */
const CONFIG = {
  groom: "أحمد",
  bride: "سارة",
  // رقم واتساب لاستقبال تأكيدات الحضور (بصيغة دولية بدون +)
  whatsapp: "970590000000",
  weddingDate: new Date("2026-11-20T19:00:00+02:00"),
  venue: "قاعة حياة، نابلس",
};

/* ═══════════ أرقام هندية ═══════════ */
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const toAr = (n) => String(n).replace(/\d/g, (d) => AR_DIGITS[d]);

/* ═══════════ الدقّ على الباب ═══════════ */
const heroEl = document.getElementById("hero");
const doorScene = document.getElementById("doorScene");
const archEl = document.getElementById("arch");
const dots = document.querySelectorAll(".knock-dots span");
let knocks = 0;
let doorOpened = false;
let audioCtx = null;

function lockInviteScroll() {
  document.documentElement.classList.add("invite-locked");
  document.body.classList.add("invite-locked");
  window.scrollTo(0, 0);
}

function unlockInviteScroll() {
  document.documentElement.classList.remove("invite-locked");
  document.body.classList.remove("invite-locked");
}

lockInviteScroll();

window.addEventListener("scroll", () => {
  if (!doorOpened && window.scrollY !== 0) window.scrollTo(0, 0);
}, { passive: true });

function getCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function knockSound() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    // ضربة عميقة على الخشب
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(86, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.18);
    const g = c.createGain();
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(g).connect(c.destination);
    osc.start(t); osc.stop(t + 0.32);
    // طقّة خشب حادة
    const len = Math.floor(c.sampleRate * 0.08);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    const src = c.createBufferSource();
    src.buffer = buf;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 520; bp.Q.value = 1.0;
    const g2 = c.createGain();
    g2.gain.setValueAtTime(0.62, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    src.connect(bp).connect(g2).connect(c.destination);
    src.start(t);
  } catch (e) { /* بدون صوت */ }
}

/* صوت رفرفة الأجنحة */
function flutterSound(dur = 4.4) {
  try {
    const c = getCtx();
    const t0 = c.currentTime;
    const master = c.createGain();
    master.gain.setValueAtTime(0.9, t0);
    master.gain.exponentialRampToValueAtTime(0.001, t0 + dur + 0.25);
    master.connect(c.destination);
    const beats = Math.floor(dur / 0.072);
    for (let i = 0; i < beats; i++) {
      const t = t0 + i * 0.072 + Math.random() * 0.016;
      const len = Math.floor(c.sampleRate * 0.082);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < len; j++) {
        const p = j / len;
        const attack = Math.min(1, p / 0.11);
        const decay = Math.pow(1 - p, 1.32);
        const wingPulse = Math.sin(p * Math.PI * 3.4);
        data[j] = (Math.random() * 2 - 1) * attack * decay * (0.62 + wingPulse * 0.38);
      }
      const src = c.createBufferSource();
      src.buffer = buf;
      const hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 115;
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1350 + Math.random() * 650;
      const g = c.createGain();
      const closePass = i > beats * 0.18 && i < beats * 0.7 ? 1.28 : 1;
      const amp = 0.42 * closePass * (1 - i / beats * 0.46);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(amp, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      if (c.createStereoPanner) {
        const pan = c.createStereoPanner();
        pan.pan.setValueAtTime(Math.sin(i * 1.4) * 0.48, t);
        src.connect(hp).connect(lp).connect(g).connect(pan).connect(master);
      } else {
        src.connect(hp).connect(lp).connect(g).connect(master);
      }
      src.start(t);
    }
  } catch (e) { /* بدون صوت */ }
}

/* هديل الحمام */
function doveFlightSound(dur = 4.2) {
  try {
    const c = getCtx();
    const t0 = c.currentTime;
    const master = c.createGain();
    master.gain.setValueAtTime(0.001, t0);
    master.gain.exponentialRampToValueAtTime(0.22, t0 + 0.18);
    master.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    master.connect(c.destination);

    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const p = i / len;
      const swell = Math.sin(Math.PI * p);
      data[i] = (Math.random() * 2 - 1) * swell * 0.5;
    }

    const src = c.createBufferSource();
    src.buffer = buf;
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 180;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1050;
    const pan = c.createStereoPanner?.();
    if (pan) {
      pan.pan.setValueAtTime(-0.35, t0);
      pan.pan.linearRampToValueAtTime(0.35, t0 + dur * 0.75);
      src.connect(hp).connect(lp).connect(pan).connect(master);
    } else {
      src.connect(hp).connect(lp).connect(master);
    }
    src.start(t0);
  } catch (e) { /* no sound */ }
}

function cooSound(delay = 0) {
  try {
    const c = getCtx();
    const makeCoo = (t, f0, dur) => {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.linearRampToValueAtTime(f0 * 1.18, t + dur * 0.3);
      osc.frequency.linearRampToValueAtTime(f0 * 0.82, t + dur);
      // اهتزاز الهديل
      const lfo = c.createOscillator();
      lfo.frequency.value = 24;
      const lfoGain = c.createGain();
      lfoGain.gain.value = 22;
      lfo.connect(lfoGain).connect(osc.frequency);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.06);
      g.gain.setValueAtTime(0.16, t + dur * 0.55);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      const lp = c.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 900;
      osc.connect(lp).connect(g).connect(c.destination);
      osc.start(t); osc.stop(t + dur + 0.05);
      lfo.start(t); lfo.stop(t + dur + 0.05);
    };
    const t0 = c.currentTime + delay;
    makeCoo(t0, 340, 0.42);
    makeCoo(t0 + 0.55, 300, 0.55);
    makeCoo(t0 + 1.35, 330, 0.45);
  } catch (e) { /* بدون صوت */ }
}

doorScene.addEventListener("click", () => {
  if (doorOpened) return;
  knockSound();
  doorScene.classList.remove("knock-hit");
  void doorScene.offsetWidth;
  doorScene.classList.add("knock-hit");
  void archEl.offsetWidth; // إعادة تشغيل الأنيميشن
  if (knocks < dots.length) dots[knocks].classList.add("filled");
  knocks++;
  if (knocks >= 3) {
    doorOpened = true;
    startMusic();               // النقرة الثالثة إيماءةُ مستخدمٍ تسمح بتشغيل الصوت
    document.getElementById("knockUi").style.opacity = "0";
    heroEl.classList.add("opening");
    setTimeout(() => {
      heroEl.classList.add("opened");
      unlockInviteScroll();
      setTimeout(() => {
        spawnDoves(true);
        flutterSound(4.4);
        doveFlightSound(4.2);
      }, 600);
    }, 350);
  }
});

/* ═══════════ موسيقى الخلفية ═══════════ */
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicStarted = false;
function startMusic() {
  if (musicStarted || !bgMusic) return;
  musicStarted = true;
  bgMusic.volume = 0;
  const p = bgMusic.play();
  if (p && p.then) {
    p.then(() => {
      musicToggle.hidden = false;
      // تصعيدٌ لطيف للصوت بدل أن يبدأ فجأة
      let v = 0;
      const iv = setInterval(() => {
        v += 0.05;
        bgMusic.volume = Math.min(v, 0.55);
        if (v >= 0.55) clearInterval(iv);
      }, 120);
    }).catch(() => { musicStarted = false; });
  } else {
    musicToggle.hidden = false;
  }
}
if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    musicToggle.classList.toggle("muted", bgMusic.muted);
    musicToggle.setAttribute("aria-label", bgMusic.muted ? "تشغيل الموسيقى" : "كتم الموسيقى");
  });
}

/* ═══════════ مشاركة الدعوة ═══════════ */
const btnShare = document.getElementById("btnShare");
if (btnShare) {
  btnShare.addEventListener("click", async () => {
    const shareData = {
      title: "دعوة زفاف أحمد وسارة",
      text: "يشرّفنا حضوركم حفل زفاف أحمد وسارة 🤍\nالجمعة ٢٠ تشرين الثاني ٢٠٢٦ — قاعة حياة، نابلس",
      url: location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    const msg = encodeURIComponent(shareData.text + "\n" + shareData.url);
    window.open("https://wa.me/?text=" + msg, "_blank", "noopener");
  });
}

/* ═══════════ الحمامات ═══════════ */
const PHOTO_DOVES = [
  "public/assets/birds/dove-wings-up.png",
  "public/assets/birds/dove-wings-middle.png",
  "public/assets/birds/dove-wings-down.png",
];

const DOVE_SVG = `
<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="dvB" cx="45%" cy="38%" r="68%">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".55" stop-color="#f5f1e9"/>
      <stop offset="1" stop-color="#cfc6b6"/>
    </radialGradient>
    <linearGradient id="dvW" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".48" stop-color="#eee8dc"/>
      <stop offset="1" stop-color="#aea38f"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="2.3" flood-color="#261a14" flood-opacity=".24"/>
    </filter>
  </defs>
  <g filter="url(#soft)">
    <path class="wingB" fill="url(#dvW)" opacity=".78"
      d="M57 39 C47 20 33 8 8 4 C18 13 25 22 31 31 C22 29 14 28 6 30 C24 40 41 45 58 44 Z"/>
    <path class="wingB" d="M50 38 C39 28 30 22 19 18 M45 41 C32 37 23 35 13 35"
      fill="none" stroke="#b8ae9f" stroke-width="1" opacity=".55"/>
    <path fill="url(#dvW)" d="M34 45 C21 46 10 52 1 63 C16 62 29 56 42 48 Z"/>
    <path fill="#d8d0c1" opacity=".75" d="M36 47 C24 55 19 63 17 72 C29 66 38 58 47 49 Z"/>
    <path fill="url(#dvB)"
      d="M25 44 C40 32 63 30 82 34 C95 37 104 43 109 51 C101 60 82 65 61 63 C42 61 29 54 25 44 Z"/>
    <path fill="#b9ae9d" opacity=".35" d="M43 57 C57 63 78 61 92 54 C78 67 55 69 41 60 Z"/>
    <path fill="url(#dvB)" d="M91 41 C95 31 104 26 112 30 C119 34 120 44 113 49 C105 55 96 51 91 41 Z"/>
    <path fill="#d8a251" d="M116 36 L126 39 L116 42 C118 40 118 38 116 36 Z"/>
    <circle fill="#2d2622" cx="110" cy="34.5" r="1.8"/>
    <circle fill="#ffffff" cx="110.7" cy="33.8" r=".55"/>
    <path class="wingF" fill="url(#dvW)"
      d="M55 40 C55 23 66 9 91 0 C87 10 82 19 76 28 C84 25 92 23 101 22 C90 35 75 45 56 45 Z"/>
    <path class="wingF" d="M62 38 C70 28 77 20 85 12 M64 42 C75 37 85 34 94 31"
      fill="none" stroke="#b8ae9f" stroke-width="1" opacity=".58"/>
  </g>
</svg>`;

function spawnDoves(burst = false) {
  const wrap = document.getElementById("doves");
  const count = burst ? 7 : 2;
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className = "dove";
    const img = PHOTO_DOVES[(i + Math.floor(Math.random() * PHOTO_DOVES.length)) % PHOTO_DOVES.length];
    d.innerHTML = `<div class="dove-inner"><img src="${img}" alt=""></div>`;
    // تنطلق من وسط الباب (من جوّا) باتجاه المشاهد وللأعلى
    const startX = 38 + Math.random() * 24; // %
    const startY = 32 + Math.random() * 18; // %
    d.style.left = startX + "%";
    d.style.top = startY + "%";
    const dir = Math.random() < 0.5 ? -1 : 1;
    const lift = burst ? 290 : 230;
    const spread = burst ? 260 : 170;
    d.style.setProperty("--dx", dir * (70 + Math.random() * spread) + "px");
    d.style.setProperty("--dy", -(lift + Math.random() * 250) + "px");
    d.style.setProperty("--s0", (0.28 + Math.random() * 0.16).toFixed(2));
    d.style.setProperty("--s1", (1.0 + Math.random() * 0.48).toFixed(2));
    d.style.setProperty("--r0", (dir * -8) + "deg");
    d.style.setProperty("--r1", (dir * (10 + Math.random() * 12)) + "deg");
    d.style.setProperty("--dur", (3.1 + Math.random() * 1.55) + "s");
    d.style.setProperty("--flap", (0.16 + Math.random() * 0.07).toFixed(2) + "s");
    d.style.animationDelay = (i * (burst ? 0.11 : 0.45)) + "s";
    if (dir < 0) d.querySelector(".dove-inner").style.scale = "-1 1";
    wrap.appendChild(d);
    d.addEventListener("animationend", () => d.remove());
  }
  // حمامة أو اثنتان بين فترة وأخرى بعد الدفعة الأولى
  if (doorOpened) setTimeout(() => spawnDoves(false), 8000 + Math.random() * 5000);
}

/* ═══════════ الورد المتساقط ═══════════ */
const birds = [
  { image: PHOTO_DOVES[0], startX: 49, startY: 56, midX: 34, midY: 38, endX: -28, endY: 9, startScale: 0.07, midScale: 0.58, endScale: 1.45, startRotate: 4, endRotate: -15, delay: 0.25, duration: 4.6, blurStart: 0.45, blurEnd: 1.05, zIndex: 8, flip: true },
  { image: PHOTO_DOVES[1], startX: 51, startY: 56, midX: 68, midY: 39, endX: 128, endY: 11, startScale: 0.07, midScale: 0.56, endScale: 1.45, startRotate: -5, endRotate: 14, delay: 0.48, duration: 4.8, blurStart: 0.45, blurEnd: 1.05, zIndex: 8, flip: false },
  { image: PHOTO_DOVES[2], startX: 50, startY: 55, midX: 53, midY: 28, endX: 61, endY: -28, startScale: 0.06, midScale: 0.5, endScale: 1.12, startRotate: 0, endRotate: 7, delay: 0.72, duration: 4.7, blurStart: 0.5, blurEnd: 0.9, zIndex: 7, flip: false },
  { image: PHOTO_DOVES[0], startX: 48, startY: 58, midX: 24, midY: 50, endX: -42, endY: 58, startScale: 0.08, midScale: 0.72, endScale: 2.05, startRotate: 5, endRotate: -20, delay: 0.98, duration: 4.45, blurStart: 0.35, blurEnd: 1.45, zIndex: 12, flip: true },
  { image: PHOTO_DOVES[1], startX: 52, startY: 57, midX: 77, midY: 48, endX: 140, endY: 56, startScale: 0.08, midScale: 0.7, endScale: 2.0, startRotate: -3, endRotate: 18, delay: 1.18, duration: 4.55, blurStart: 0.35, blurEnd: 1.45, zIndex: 12, flip: false },
  { image: PHOTO_DOVES[2], startX: 49, startY: 57, midX: 42, midY: 31, endX: 15, endY: -24, startScale: 0.06, midScale: 0.46, endScale: 1.0, startRotate: 2, endRotate: -10, delay: 1.42, duration: 5.0, blurStart: 0.5, blurEnd: 0.85, zIndex: 6, flip: true },
  { image: PHOTO_DOVES[1], startX: 51, startY: 58, midX: 67, midY: 64, endX: 123, endY: 92, startScale: 0.08, midScale: 0.75, endScale: 2.15, startRotate: -2, endRotate: 12, delay: 1.65, duration: 4.55, blurStart: 0.35, blurEnd: 1.55, zIndex: 13, flip: false },
  { image: PHOTO_DOVES[0], startX: 50, startY: 56, midX: 28, midY: 28, endX: -26, endY: -18, startScale: 0.06, midScale: 0.5, endScale: 1.22, startRotate: 3, endRotate: -18, delay: 1.9, duration: 4.9, blurStart: 0.5, blurEnd: 1, zIndex: 7, flip: true },
  { image: PHOTO_DOVES[2], startX: 51, startY: 57, midX: 72, midY: 30, endX: 128, endY: -16, startScale: 0.06, midScale: 0.52, endScale: 1.28, startRotate: -4, endRotate: 17, delay: 2.12, duration: 4.85, blurStart: 0.5, blurEnd: 1, zIndex: 7, flip: false },
  { image: PHOTO_DOVES[1], startX: 50, startY: 56, midX: 51, midY: 42, endX: 48, endY: -34, startScale: 0.055, midScale: 0.42, endScale: 0.95, startRotate: 0, endRotate: 5, delay: 2.35, duration: 5.2, blurStart: 0.55, blurEnd: 0.85, zIndex: 6, flip: false },
];

PHOTO_DOVES.forEach((src) => {
  const img = new Image();
  img.src = src;
});

spawnDoves = function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const wrap = document.getElementById("doves");
  if (!wrap || wrap.dataset.played === "true") return;
  wrap.dataset.played = "true";

  const smallScreen = window.matchMedia("(max-width: 380px)").matches;
  const activeBirds = smallScreen ? birds.slice(0, 7) : birds;
  activeBirds.forEach((bird, i) => {
    const d = document.createElement("div");
    d.className = `dove bird-motion bird-flight bird-flight-${i + 1}`;
    // ثلاث لقطات لرفرفة الجناح (أعلى ← وسط ← أسفل) تتبدّل لتُحاكي خفقان الجناح الحقيقي
    d.innerHTML = `<div class="dove-inner">
        <img class="bird-image frame frame-1" src="${PHOTO_DOVES[0]}" alt="">
        <img class="bird-image frame frame-2" src="${PHOTO_DOVES[1]}" alt="">
        <img class="bird-image frame frame-3" src="${PHOTO_DOVES[2]}" alt="">
      </div>`;
    d.style.setProperty("--start-x", `${bird.startX}%`);
    d.style.setProperty("--start-y", `${bird.startY}%`);
    d.style.setProperty("--mid-x", `${bird.midX}%`);
    d.style.setProperty("--mid-y", `${bird.midY}%`);
    d.style.setProperty("--end-x", `${bird.endX}%`);
    d.style.setProperty("--end-y", `${bird.endY}%`);
    d.style.setProperty("--start-scale", bird.startScale);
    d.style.setProperty("--mid-scale", bird.midScale);
    d.style.setProperty("--end-scale", bird.endScale);
    d.style.setProperty("--start-rotate", `${bird.startRotate}deg`);
    d.style.setProperty("--mid-rotate", `${(bird.startRotate + bird.endRotate) / 2}deg`);
    d.style.setProperty("--end-rotate", `${bird.endRotate}deg`);
    d.style.setProperty("--delay", `${bird.delay}s`);
    d.style.setProperty("--duration", `${bird.duration}s`);
    d.style.setProperty("--blur-start", `${bird.blurStart}px`);
    d.style.setProperty("--blur-end", `${bird.blurEnd}px`);
    d.style.setProperty("--flap", `${0.42 + (i % 4) * 0.06}s`);
    d.style.zIndex = bird.zIndex;
    if (bird.flip) d.querySelectorAll("img").forEach((im) => im.classList.add("flipped"));
    wrap.appendChild(d);
    d.addEventListener("animationend", () => d.remove());
  });
};

(function petals() {
  const wrap = document.getElementById("petals");
  const glyphs = ["✿", "❀", "✾"];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = glyphs[i % glyphs.length];
    p.style.left = Math.random() * 100 + "%";
    p.style.fontSize = 9 + Math.random() * 10 + "px";
    p.style.opacity = 0.35 + Math.random() * 0.45;
    p.style.animationDuration = 7 + Math.random() * 9 + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    wrap.appendChild(p);
  }
})();

/* ═══════════ العد التنازلي ═══════════ */
function tick() {
  let diff = Math.max(0, CONFIG.weddingDate - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const mins = Math.floor(diff / 60000) % 60;
  const secs = Math.floor(diff / 1000) % 60;
  document.getElementById("cdDays").textContent = toAr(days);
  document.getElementById("cdHours").textContent = toAr(hours);
  document.getElementById("cdMins").textContent = toAr(mins);
  document.getElementById("cdSecs").textContent = toAr(secs);
}
tick();
setInterval(tick, 1000);

/* ═══════════ إظهار الأقسام عند التمرير ═══════════ */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

(function timelineFlower() {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  const flower = document.createElement("span");
  flower.className = "timeline-flower";
  flower.textContent = "✿";
  timeline.appendChild(flower);
  let currentY = 0;
  let targetY = 0;
  let rafId = null;

  function setFlowerTarget() {
    const items = Array.from(timeline.querySelectorAll(".tl-item"));
    if (items.length < 2) return;

    const timelineRect = timeline.getBoundingClientRect();
    const firstRect = items[0].getBoundingClientRect();
    const lastRect = items[items.length - 1].getBoundingClientRect();
    const viewportAnchor = window.innerHeight * 0.56;
    const progress = Math.min(1, Math.max(0, (viewportAnchor - firstRect.top) / (lastRect.top - firstRect.top)));
    const targetIndex = Math.min(items.length - 1, Math.floor(progress * items.length));
    const targetRect = items[targetIndex].getBoundingClientRect();
    targetY = targetRect.top + targetRect.height / 2 - timelineRect.top;

    if (!rafId) animateFlower();
  }

  function animateFlower() {
    currentY += (targetY - currentY) * 0.055;
    timeline.style.setProperty("--flower-y", `${currentY}px`);

    if (Math.abs(targetY - currentY) > 0.35) {
      rafId = requestAnimationFrame(animateFlower);
    } else {
      currentY = targetY;
      timeline.style.setProperty("--flower-y", `${currentY}px`);
      rafId = null;
    }
  }

  setFlowerTarget();
  currentY = targetY;
  timeline.style.setProperty("--flower-y", `${currentY}px`);
  window.addEventListener("scroll", setFlowerTarget, { passive: true });
  window.addEventListener("resize", setFlowerTarget);
})();

/* ═══════════ تقويم آيفون (ملف ICS) ═══════════ */
document.getElementById("btnIcs").addEventListener("click", () => {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding//ar",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:ahmad-sara-wedding-20261120@invitation",
    `DTSTAMP:${stamp}`,
    "DTSTART:20261120T170000Z",
    "DTEND:20261120T220000Z",
    `SUMMARY:حفل زفاف ${CONFIG.groom} و ${CONFIG.bride}`,
    `LOCATION:${CONFIG.venue}`,
    "DESCRIPTION:فتحنا باب فرحتنا.. وطارت البشائر بدعوتكم",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:تذكير بحفل الزفاف غدًا",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // على iOS تحميل blob عبر download غير موثوق — نفتح data URI فيعرض iOS "أضف إلى التقويم"
    window.location.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    return;
  }
  // بقية الأجهزة (أندرويد/ويندوز/ماك): تنزيل ملف .ics
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
});

/* ═══════════ تأكيد الحضور ═══════════ */
let attend = "نعم";
let companions = 0;

const attendChoicesEl = document.getElementById("attendChoices");
if (attendChoicesEl) attendChoicesEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;
  document.querySelectorAll(".choice").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  attend = btn.dataset.val;
});

const compEl = document.getElementById("companions");
const plusBtn = document.getElementById("plusBtn");
if (plusBtn) plusBtn.addEventListener("click", () => {
  companions = Math.min(20, companions + 1);
  compEl.textContent = toAr(companions);
});
const minusBtn = document.getElementById("minusBtn");
if (minusBtn) minusBtn.addEventListener("click", () => {
  companions = Math.max(0, companions - 1);
  compEl.textContent = toAr(companions);
});

const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const msg = document.getElementById("guestMsg").value.trim();
  if (!name) return;

  if (msg) {
    addWish({ name, text: msg });
    saveWish({ name, text: msg });
  }

  const lines = [
    `تأكيد حضور — زفاف ${CONFIG.groom} و ${CONFIG.bride} 💍`,
    `الاسم: ${name}`,
    `الحضور: ${attend}`,
    `عدد المرافقين: ${companions}`,
  ];
  if (msg) lines.push(`رسالة: ${msg}`);
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank");
  e.target.reset();
  companions = 0;
  compEl.textContent = toAr(0);
});

/* ═══════════ كلمات المهنئين ═══════════ */
const AVATAR_COLORS = ["#e8b34b", "#8a6cc4", "#e2905f", "#7fae6c", "#b58ad0", "#d76f8a"];
const SEED_WISHES = [
  { name: "أم أحمد", text: "ألف مبروك، بالرفاه والبنين إن شاء الله، فرحتكم فرحتنا" },
  { name: "سلمى", text: "عقبال ما نفرح بيكم بأحلى المناسبات، دعوة بغاية الذوق 😍" },
  { name: "خالد", text: "مبارك الزواج، الله يجعل أيامكم كلها أفراح" },
  { name: "نور الهدى", text: "بيت جديد عامر بالمحبة إن شاء الله، ألف مبروك" },
  { name: "أبو علي", text: "الله يبارك لكما ويبارك عليكما ويجمع بينكما في خير" },
];

function addWish({ name, text }, prepend = true) {
  const div = document.createElement("div");
  div.className = "wish";
  const color = AVATAR_COLORS[(name.codePointAt(0) || 0) % AVATAR_COLORS.length];
  const av = document.createElement("div");
  av.className = "wish-avatar";
  av.style.background = color;
  av.textContent = name.trim().charAt(0);
  const body = document.createElement("div");
  const n = document.createElement("div");
  n.className = "wish-name";
  n.textContent = name;
  const t = document.createElement("div");
  t.className = "wish-text";
  t.textContent = text;
  body.append(n, t);
  div.append(av, body);
  const wrap = document.getElementById("wishes");
  prepend ? wrap.prepend(div) : wrap.append(div);
}

function saveWish(w) {
  const key = "wedding-wishes";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.unshift(w);
  localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
}

(function renderWishes() {
  if (!document.getElementById("wishes")) return;
  const saved = JSON.parse(localStorage.getItem("wedding-wishes") || "[]");
  SEED_WISHES.forEach((w) => addWish(w, false));
  saved.reverse().forEach((w) => addWish(w, true));
})();
