// =====================
// League Page (Stage 1)
// =====================
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

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

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

      gsap.fromTo(row,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: idx * 0.03 }
      );
    });
}

renderLeaderboard(demoLeaderboard);

// Countdown (demo)
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

document.getElementById("myRankBtn").addEventListener("click", () => {
  const my = { tg: "@YourTelegram", name: "You", score: 845 };
  const all = demoLeaderboard.concat([my]).sort((a,b)=>b.score-a.score);
  const rank = all.findIndex(x => x.tg === my.tg) + 1;
  alert(`رتبه شما (دمو): #${rank}\nامتیاز: ${my.score}`);
});

gsap.fromTo(".logoWrap", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
gsap.fromTo(".card", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.05 });

// =====================
// Background 3D (Menu)
// =====================
initMenu3D();

function initMenu3D(){
  const canvas = document.getElementById("bg3d");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 5.2, 10.5);

  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);

  const light1 = new THREE.PointLight(0x2ef6ff, 1.2, 80);
  light1.position.set(-6, 6, 8);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xb04bff, 1.1, 80);
  light2.position.set(6, 4, 4);
  scene.add(light2);

  const grid = new THREE.GridHelper(80, 80, 0x2ef6ff, 0xb04bff);
  grid.position.y = -1.2;
  grid.material.opacity = 0.18;
  grid.material.transparent = true;
  scene.add(grid);

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

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += ((5.2 - targetY) - camera.position.y) * 0.03;
    camera.lookAt(0, 0.6, -6);

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

// =====================
// Game (Stage 2)
// =====================
const startBtn = document.getElementById("startBtn");
const gameUI = document.getElementById("gameUI");
const toast = document.getElementById("centerToast");
const endModal = document.getElementById("endModal");
const btnBackToLeague = document.getElementById("btnBackToLeague");
const btnPlayAgain = document.getElementById("btnPlayAgain");

const hudTime = document.getElementById("hudTime");
const hudScore = document.getElementById("hudScore");
const hudBest = document.getElementById("hudBest");
const endScore = document.getElementById("endScore");
const endBest = document.getElementById("endBest");

const zoneLeft = document.getElementById("zoneLeft");
const zoneRight = document.getElementById("zoneRight");

const LS_BEST = "gr_best_score_v1";

let game = null;

startBtn.addEventListener("click", () => {
  enterGame();
});

btnBackToLeague.addEventListener("click", () => {
  exitGame();
});

btnPlayAgain.addEventListener("click", () => {
  endModal.classList.add("hidden");
  game?.restart();
});

function enterGame(){
  document.body.classList.add("gameActive");
  gameUI.classList.remove("hidden");
  gameUI.setAttribute("aria-hidden","false");

  const best = Number(localStorage.getItem(LS_BEST) || "0");
  hudBest.textContent = best.toString();

  if(!game){
    game = createRunnerGame({
      durationSec: 45,
      onHud: (tLeft, score) => {
        hudTime.textContent = String(Math.ceil(tLeft));
        hudScore.textContent = String(score);
      },
      onToast: (text) => showToast(text),
      onEnd: (score) => {
        const bestNow = Math.max(best, score);
        localStorage.setItem(LS_BEST, String(bestNow));
        hudBest.textContent = String(bestNow);

        endScore.textContent = String(score);
        endBest.textContent = String(bestNow);

        endModal.classList.remove("hidden");
        gsap.fromTo(".endCard", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
      }
    });

    // Controls: Keyboard
    window.addEventListener("keydown", (e)=>{
      if(!document.body.classList.contains("gameActive")) return;
      if(e.key === "ArrowLeft") game.moveLeft();
      if(e.key === "ArrowRight") game.moveRight();
    });

    // Controls: Touch zones
    const press = (side) => {
      if(!document.body.classList.contains("gameActive")) return;
      if(side === "L") game.moveLeft();
      if(side === "R") game.moveRight();
    };

    ["pointerdown","touchstart"].forEach(evt=>{
      zoneLeft.addEventListener(evt, (e)=>{ e.preventDefault?.(); press("L"); }, { passive:false });
      zoneRight.addEventListener(evt,(e)=>{ e.preventDefault?.(); press("R"); }, { passive:false });
    });
  }

  showToast("Get Ready…");
  gsap.to(toast, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });

  game.start();
}

function exitGame(){
  document.body.classList.remove("gameActive");
  gameUI.classList.add("hidden");
  gameUI.setAttribute("aria-hidden","true");
  endModal.classList.add("hidden");
  game?.stop();
}

function showToast(text){
  toast.textContent = text;
  gsap.fromTo(toast, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" });
  gsap.to(toast, { opacity: 0, y: -8, duration: 0.28, ease: "power2.in", delay: 1.1 });
}

function createRunnerGame({ durationSec, onHud, onToast, onEnd }){
  const canvas = document.getElementById("game3d");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x070910, 8, 34);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 4.2, 8.8);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const c1 = new THREE.PointLight(0x2ef6ff, 1.2, 80); c1.position.set(-6, 6, 6); scene.add(c1);
  const c2 = new THREE.PointLight(0xb04bff, 1.1, 80); c2.position.set(6, 5, 2); scene.add(c2);

  // Ground cyber road
  const roadGeo = new THREE.PlaneGeometry(8, 200, 1, 60);
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x070910,
    roughness: 0.6,
    metalness: 0.2,
    emissive: 0x0a0f1f,
    emissiveIntensity: 0.7
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI/2;
  road.position.y = 0;
  road.position.z = -70;
  scene.add(road);

  // Lane lines (neon)
  const laneGroup = new THREE.Group();
  scene.add(laneGroup);

  function makeLine(x, color){
    const g = new THREE.BoxGeometry(0.06, 0.02, 200);
    const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.8 });
    const line = new THREE.Mesh(g, m);
    line.position.set(x, 0.01, -70);
    line.material.transparent = true;
    line.material.opacity = 0.35;
    return line;
  }
  laneGroup.add(makeLine(-1.35, 0x2ef6ff));
  laneGroup.add(makeLine( 1.35, 0xb04bff));

  // Player
  const player = new THREE.Group();
  scene.add(player);

  const bodyGeo = new THREE.BoxGeometry(0.7, 0.5, 1.1);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x101737, emissive: 0x2ef6ff, emissiveIntensity: 0.35, roughness: 0.35, metalness: 0.35 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.35;
  player.add(body);

  const coreGeo = new THREE.SphereGeometry(0.18, 20, 20);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xb04bff, emissive: 0xb04bff, emissiveIntensity: 1.0 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0.5, 0.2);
  player.add(core);

  player.position.set(0, 0, 3.6);

  // Obstacles
  const obstacles = [];
  const obstacleDefs = [
    { label: "LAG",     color: 0x2ef6ff },
    { label: "ERROR",   color: 0xff3df3 },
    { label: "TIMEOUT", color: 0xb04bff },
  ];

  function makeObstacle(){
    const pick = obstacleDefs[Math.floor(Math.random()*obstacleDefs.length)];
    const geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const mat = new THREE.MeshStandardMaterial({
      color: pick.color,
      emissive: pick.color,
      emissiveIntensity: 0.8,
      roughness: 0.25,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.45;

    // lane: -1, 0, +1
    const lane = (Math.random() < 0.33) ? -1 : (Math.random() < 0.5 ? 0 : 1);
    mesh.userData.lane = lane;
    mesh.position.x = lane * 1.35;
    mesh.position.z = -26 - Math.random()*18;

    mesh.userData.speed = 0.28 + Math.random()*0.16; // base speed
    mesh.userData.label = pick.label;

    scene.add(mesh);
    obstacles.push(mesh);
  }

  // Pre-fill
  for(let i=0;i<8;i++) makeObstacle();

  // Camera target
  const camTarget = new THREE.Vector3(0, 0.7, -6);

  // Resize
  function resize(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // Game state
  let running = false;
  let tStart = 0;
  let lastFrame = performance.now();
  let tLeft = durationSec;
  let score = 0;
  let dodges = 0;

  const lanes = [-1.35, 0, 1.35];
  let laneIndex = 1; // start center
  let targetX = lanes[laneIndex];

  function moveLeft(){ laneIndex = Math.max(0, laneIndex - 1); targetX = lanes[laneIndex]; pulsePlayer(); }
  function moveRight(){ laneIndex = Math.min(2, laneIndex + 1); targetX = lanes[laneIndex]; pulsePlayer(); }

  function pulsePlayer(){
    gsap.to(core.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.12, yoyo:true, repeat:1, ease:"power2.out" });
    gsap.to(player.rotation, { z: (laneIndex===0?-0.12:laneIndex===2?0.12:0), duration: 0.18, ease:"power2.out" });
  }

  function checkCollision(a, b){
    // AABB ساده و سریع
    const ax = a.position.x, az = a.position.z;
    const bx = b.position.x, bz = b.position.z;
    const dx = Math.abs(ax - bx);
    const dz = Math.abs(az - bz);
    return (dx < 0.75 && dz < 0.85);
  }

  function start(){
    if(running) return;
    running = true;
    tStart = performance.now();
    lastFrame = performance.now();
    tLeft = durationSec;
    score = 0;
    dodges = 0;

    // reset positions
    laneIndex = 1; targetX = lanes[laneIndex];
    player.position.x = 0;
    player.position.z = 3.6;

    obstacles.forEach((o, i) => {
      o.position.z = -26 - i*6 - Math.random()*10;
      o.position.x = (o.userData.lane || 0) * 1.35;
    });

    onToast?.("GO!");
    animate();
  }

  function stop(){
    running = false;
  }

  function restart(){
    // remove any end momentum
    start();
  }

  function end(){
    running = false;
    onEnd?.(score);
  }

  function animate(){
    if(!running) return;

    const now = performance.now();
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    // time
    const elapsed = (now - tStart) / 1000;
    tLeft = Math.max(0, durationSec - elapsed);

    // Smooth lane movement (خیلی روون)
    player.position.x += (targetX - player.position.x) * (1 - Math.pow(0.001, dt)); // nice smoothing

    // slight bobbing
    player.position.y = Math.sin(now * 0.01) * 0.03;

    // speed ramps up slightly over time
    const speedBoost = 1 + (elapsed / durationSec) * 0.55;

    // Move obstacles toward player
    obstacles.forEach((o) => {
      o.position.z += o.userData.speed * speedBoost * 10 * dt;

      // rotate for style
      o.rotation.x += 0.9 * dt;
      o.rotation.y += 0.7 * dt;

      // passed player -> respawn behind, count dodge
      if(o.position.z > 6.2){
        dodges++;
        o.userData.lane = (Math.random() < 0.33) ? -1 : (Math.random() < 0.5 ? 0 : 1);
        o.position.x = o.userData.lane * 1.35;
        o.position.z = -26 - Math.random()*18;
      }

      // collision
      if(checkCollision(player, o)){
        onToast?.(o.userData.label);
        // instant end on hit
        end();
      }
    });

    // Score: time survived + dodges
    score = Math.floor(elapsed * 20 + dodges * 12);
    onHud?.(tLeft, score);

    // Camera follow
    camera.position.x += (player.position.x * 0.25 - camera.position.x) * 0.06;
    camera.position.y += (4.2 - camera.position.y) * 0.04;
    camera.lookAt(camTarget);

    // Neon pulse on lanes
    const pulse = 0.25 + Math.sin(now * 0.004) * 0.06;
    laneGroup.children.forEach((l, i) => {
      l.material.opacity = pulse + i*0.02;
    });

    renderer.render(scene, camera);

    if(tLeft <= 0){
      end();
      return;
    }

    requestAnimationFrame(animate);
  }

  return { start, stop, restart, moveLeft, moveRight };
}
