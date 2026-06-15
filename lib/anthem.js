// Geri sayım şarkısı — ANINDA başlasın diye uygulama açılışında önceden hazırlanır.
// İki kaynak: (1) yerel MP3 (champions.mp3 / seçilen dosya) — önden indirilir/tamponlanır,
// (2) YouTube (sadece ses) — oynatıcı kurulup video tampona alınır (cue).
// Geri sayım açılınca startLocalAnthem() ya da startAnthem() çağrılır → beklemeden çalar.

// Kep atma marşı (We Are the Champions) bu saniyeden başlasın (nakarat girişi).
export const ANTHEM_START = 39;

/* ---------------- yerel MP3 ---------------- */
let audio = null;
let audioUrl = null;

function ensureAudio() {
  if (!audio && typeof window !== "undefined") {
    audio = new Audio();
    audio.preload = "auto";
  }
  return audio;
}

// Yerel dosyayı önden indir (tören başında — geri sayımdan dakikalar önce tamamlanır).
function warmLocal(localFile) {
  if (!localFile) return;
  const a = ensureAudio();
  if (!a) return;
  if (audioUrl !== localFile) {
    audioUrl = localFile;
    a.src = localFile;
    try { a.load(); } catch (_) {}
  }
}

// Yerel sesi anında çal. Promise döner (reddederse çağıran YouTube'a düşer).
// Seçilen dosya (blob) yerelse her zaman çalar. Varsayılan dosya HENÜZ yeterince
// tamponlanmadıysa reddeder → büyük MP3'ün inişini beklemeden YouTube akışı anında başlar.
export function startLocalAnthem(fileOverride) {
  if (typeof window === "undefined") return Promise.reject(new Error("no-window"));
  const url = fileOverride || audioUrl;
  if (!url) return Promise.reject(new Error("no-local-file"));
  const a = ensureAudio();
  if (!a) return Promise.reject(new Error("no-audio"));
  const isBlob = !!fileOverride;
  if (isBlob && audioUrl !== fileOverride) { audioUrl = fileOverride; a.src = fileOverride; try { a.load(); } catch (_) {} }
  // readyState: 0..4. >=3 (HAVE_FUTURE_DATA) = akıcı çalacak kadar var. Blob/yerel dosya zaten anında.
  if (!isBlob && a.readyState < 3) return Promise.reject(new Error("not-buffered"));
  a.muted = false;
  a.volume = 0.95;
  try { a.currentTime = ANTHEM_START; } catch (_) {}
  return a.play();
}

export function stopLocalAnthem() {
  try { audio?.pause(); } catch (_) {}
}

export function setLocalAnthemMuted(m) {
  if (audio) audio.muted = !!m;
}

/* ---------------- YouTube (sadece ses) ---------------- */
let player = null;
let ready = false;
let pending = false;

export function preloadAnthem(videoId, localFile) {
  if (typeof window === "undefined") return;

  // (1) yerel dosyayı önden indir
  warmLocal(localFile);

  // (2) YouTube oynatıcısını kur + videoyu tampona al
  if (!videoId) return;
  const build = () => {
    if (player || !window.YT || !window.YT.Player) return;
    let host = document.getElementById("anthem-yt");
    if (!host) {
      const wrap = document.createElement("div");
      wrap.id = "anthem-yt-wrap";
      wrap.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
      host = document.createElement("div");
      host.id = "anthem-yt";
      wrap.appendChild(host);
      document.body.appendChild(wrap);
    }
    player = new window.YT.Player("anthem-yt", {
      height: "1", width: "1", videoId,
      playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1 },
      events: {
        onReady: (e) => {
          ready = true;
          try { e.target.cueVideoById(videoId); } catch (_) {}
          if (pending) { pending = false; startAnthem(); }
        },
      },
    });
  };

  if (window.YT && window.YT.Player) { build(); return; }
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { if (typeof prev === "function") prev(); build(); };
  if (!document.getElementById("yt-iframe-api")) {
    const s = document.createElement("script");
    s.id = "yt-iframe-api"; s.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(s);
  }
}

// Önceden tampona alınmış YouTube oynatıcısını anında başlat. Hazır değilse hazır olunca başlar.
export function startAnthem() {
  if (!player || !ready) { pending = true; return false; }
  try {
    player.unMute?.();
    player.setVolume?.(100);
    player.seekTo?.(ANTHEM_START, true);
    player.playVideo?.();
    return true;
  } catch (_) { return false; }
}

export function stopAnthem() {
  pending = false;
  try { player?.pauseVideo?.(); } catch (_) {}
}

export function setAnthemMuted(m) {
  try { m ? player?.mute?.() : player?.unMute?.(); } catch (_) {}
}

export function anthemReady() { return ready; }
