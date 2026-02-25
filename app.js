// ============ داده نمونه لیدربورد (فعلاً فیک) ============
const demoLeaderboard = [
  { tg: "@NeonRunner", name: "Aria", score: 1420 },
  { tg: "@CyberWolf",  name: "Sina", score: 1310 },
  { tg: "@LagSlayer",  name: "Nika", score: 1240 },
  { tg: "@PingKing",   name: "Reza", score: 980 },
  { tg: "@ByteDash",   name: "Sara", score: 910 },
  { tg: "@Timeout",    name: "Amir", score: 860 },
  { tg: "@Error404",   name: "Mina", score: 810 },
  { tg: "@FrameDrop",  name: "Pouya", score: 770 },
  { tg: "@PacketLoss", name: "Yas", score: 730 },
  { tg: "@NeonNova",   name: "Ali", score: 690 },
  { tg: "@VioletRay",  name: "Maryam", score: 640 },
  { tg: "@CyanPulse",  name: "Hadi", score: 610 },
];

// ============ رندر لیدربورد ============
function renderLeaderboard(list){
  const el = document.getElementById("leaderboard");
  el.innerHTML = "";

  list
    .slice()
    .sort((a,b)=> b.score - a.score)
    .forEach((u, idx) => {
      const rank = idx + 1;
      const row = document.createElement("div");
      row.className = "row" + (rank===1 ? " top1" : rank===2 ? " top2" : rank===3 ? " top3" : "");

      const rankCell = document.createElement("div");
      rankCell.className = "rank";
      rankCell.innerHTML = rank <= 3
        ? `<div class="badge">${rank}</div>`
        : `${rank}`;

      const userCell = document.createElement("div");
      userCell.className = "user";
      userCell.innerHTML = `
        <div class="handle">${escapeHtml(u.tg)}</div>
        <div class="name">${escapeHtml(u.name)}</div>
      `;

      const scoreCell = document.createElement("div");
      scoreCell.className = "score";
      scoreCell.innerHTML = `<span>PTS</span>${u.score.toLocaleString("en-US")}`;

      row.append(rankCell, userCell, scoreCell);
      el.appendChild(row);

      // انیمیشن ورود نرم
      gsap.fromTo(row,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: idx * 0.03 }
      );
    });
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

renderLeaderboard(demoLeaderboard);

// ============ تایمر پایان لیگ (پایان هفته: یکشنبه 00:00 UTC مثال) ============
// فعلاً: پایان لیگ = 7 روز بعد از زمان باز شدن صفحه (برای تست)
const leagueEnd = Date.now() + 7 * 24 * 60 * 60 * 1000;

function formatRemaining(ms){
  const totalSec = Math.max(0, Math.floor(ms/1000));
  const d = Math.floor(totalSec / (24*3600));
  const h = Math.floor((totalSec % (24*3600)) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function tickCountdown(){
  const el = document.getElementById("countdownValue");
  const rem = leagueEnd - Date.now();
  el.textContent = formatRemaining(rem);
}
tickCountdown();
setInterval(tickCountdown, 1000 * 10);

// ============ دکمه‌ها ============
document.getElementById("startBtn").addEventListener("click", () => {
  // فعلاً فقط دمو — مرحله بعد صفحه بازی رو می‌سازیم
  gsap.to(".card", { duration: 0.25, scale: 0.99, ease: "power2.out", yoyo: true, repeat: 1 });
  alert("مرحله بعد: ورود به بازی سه‌بعدی (Runner) ✅");
});

document.getElementById("myRankBtn").addEventListener("click", () => {
  // فعلاً دمو: یک کاربر فرضی
  const my = { tg: "@YourTelegram", name: "You", score: 845 };
  const all = demoLeaderboard.concat([my]).sort((a,b)=>b.score-a.score);
  const rank = all.findIndex(x => x.tg === my.tg) + 1;

  alert(`رتبه شما (دمو): #${rank}\nامتیاز: ${my.score}`);
});

// ============ انیمیشن‌های نرم UI ============
gsap.fromTo(".logoWrap", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
gsap.fromTo(".card", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.05 });

// ============ پس‌زمینه Three.js (سایبری سبک و سریع) ============
init3D();

function init3D(){
  const canvas = document.getElementById("bg3d");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 5.2, 10.5);

  // نور
  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);

  const light1 = new THREE.PointLight(0x2ef6ff, 1.2, 80);
  light1.position.set(-6, 6, 8);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xb04bff, 1.1, 80);
  light2.position.set(6, 4, 4);
  scene.add(light2);

  // گرید
  const grid = new THREE.GridHelper(80, 80, 0x2ef6ff, 0xb04bff);
  grid.position.y = -1.2;
  grid.material.opacity = 0.18;
  grid.material.transparent = true;
  scene.add(grid);

  // خطوط نئونی (چند رینگ ساده)
  const rings = new THREE.Group();
  scene.add(rings);

  const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 10, 140);
  const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x2ef6ff, emissive: 0x2ef6ff, emissiveIntensity: 0.9 });
  const ringMat2 = new THREE.MeshStandardMaterial({ color: 0xb04bff, emissive: 0xb04bff, emissiveIntensity: 0.8 });

  for(let i=0;i<6;i++){
    const mesh = new THREE.Mesh(ringGeo, i%2===0 ? ringMat1 : ringMat2);
    mesh.position.set((i-2.5)*2.2, 1.0 + i*0.15, -6 - i*2.8);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.rotation.z = i * 0.35;
    mesh.material.transparent = true;
    mesh.material.opacity = 0.22;
    rings.add(mesh);
  }

  function resize(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // حرکت نرم با ماوس/لمس
  let targetX = 0, targetY = 0;
  window.addEventListener("mousemove", (e)=>{
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = nx * 0.7;
    targetY = ny * 0.25;
  }, { passive:true });

  let t = 0;
  function animate(){
    t += 0.01;

    // دوربین نرم
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += ((5.2 - targetY) - camera.position.y) * 0.03;
    camera.lookAt(0, 0.6, -6);

    // گرید و رینگ‌ها با حس جریان
    grid.position.z = (t * 3.2) % 2;
    rings.rotation.y = Math.sin(t * 0.6) * 0.15;
    rings.children.forEach((m, i) => {
      m.rotation.z += 0.002 + i*0.0002;
      m.material.opacity = 0.18 + (Math.sin(t*1.4 + i) * 0.03);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
