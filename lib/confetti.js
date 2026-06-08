// Hafif konfeti motoru (sıfır bağımlılık). İstemci tarafında çalışır.
let canvas, ctx, particles = [], running = false, burstTimer = null;
const COLORS = ["#C9A24B", "#E7C66B", "#F6F1E7", "#7A0C2E", "#A6133E", "#FFFFFF"];

function ensureCanvas() {
  if (typeof document === "undefined") return false;
  if (canvas) return true;
  canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9000;";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
  return true;
}

function resize() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawn(x, y, count, spread, power) {
  for (let i = 0; i < count; i++) {
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * spread;
    const speed = power * (0.5 + Math.random());
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      g: 0.18 + Math.random() * 0.12, size: 6 + Math.random() * 7,
      rot: Math.random() * Math.PI, vrot: (Math.random() - 0.5) * 0.3,
      color: COLORS[(particles.length + i) % COLORS.length],
      life: 1, decay: 0.006 + Math.random() * 0.006, shape: i % 3,
    });
  }
}

export function burst(opts = {}) {
  if (!ensureCanvas()) return;
  const x = opts.x != null ? opts.x : window.innerWidth / 2;
  const y = opts.y != null ? opts.y : window.innerHeight * 0.55;
  spawn(x, y, opts.count || 80, opts.spread || 1.1, opts.power || 13);
  if (!running) loop();
}

function loop() {
  running = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vrot; p.life -= p.decay;
    if (p.life <= 0 || p.y > window.innerHeight + 40) { particles.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
    ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
    if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
    else if (p.shape === 2) { ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3); }
    else { ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); }
    ctx.restore();
  }
  if (particles.length > 0) requestAnimationFrame(loop);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

export function start() {
  if (!ensureCanvas()) return;
  stop();
  const tick = () => {
    burst({ x: window.innerWidth * 0.08, y: window.innerHeight + 10, count: 60, spread: 0.9, power: 16 });
    burst({ x: window.innerWidth * 0.92, y: window.innerHeight + 10, count: 60, spread: 0.9, power: 16 });
    burst({ x: window.innerWidth * 0.5,  y: window.innerHeight + 10, count: 50, spread: 1.4, power: 18 });
  };
  tick();
  burstTimer = setInterval(tick, 1300);
}

export function stop() {
  if (burstTimer) { clearInterval(burstTimer); burstTimer = null; }
}
