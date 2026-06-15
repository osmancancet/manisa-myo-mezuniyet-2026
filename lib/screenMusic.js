// EKRAN MÜZİĞİ — Geçit ve Dereceler ekranlarında arka planda (sadece ses) çalar.
// Tek gizli YouTube oynatıcısı tutulur; istenen parça değişince loadVideoById ile
// geçiş yapılır, istenmeyince duraklatılır. (anthem.js ile aynı desen.)
//
// playScreenMusic(videoId) → o parçayı çal (zaten çalıyorsa dokunma)
// stopScreenMusic()        → duraklat
//
// Not: Tarayıcı otomatik oynatma kuralları gereği sesin başlaması bir kullanıcı
// hareketi ister; ekranlar ileri/geri (→ / tıklama) ile ilerlediği için bu hareket
// mevcuttur, müzik o sayede başlar.

let player = null;
let ready = false;
let wanted = null;     // istenen videoId (veya null = duraklat)
let curLoaded = null;  // oynatıcıya yüklü olan videoId

const VOLUME = 65;

function apply(restart = false) {
  if (!player || !ready) return;
  try {
    if (wanted) {
      player.setVolume?.(VOLUME);
      player.unMute?.();
      if (curLoaded !== wanted) { player.loadVideoById(wanted); curLoaded = wanted; }
      else if (restart) { player.seekTo?.(0, true); player.playVideo?.(); } // aynı şarkı → baştan başlat
      else { player.playVideo?.(); }
    } else {
      player.pauseVideo?.();
    }
  } catch (_) { /* yoksay */ }
}

function build() {
  if (player || !window.YT || !window.YT.Player) return;
  let host = document.getElementById("screen-music-yt");
  if (!host) {
    const wrap = document.createElement("div");
    wrap.id = "screen-music-yt-wrap";
    wrap.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
    host = document.createElement("div");
    host.id = "screen-music-yt";
    wrap.appendChild(host);
    document.body.appendChild(wrap);
  }
  player = new window.YT.Player("screen-music-yt", {
    height: "1", width: "1",
    playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1 },
    events: {
      onReady: () => { ready = true; apply(); },
      onStateChange: (e) => {
        // Tek video bittiyse döngüye al (ekran açık kaldığı sürece sürsün).
        if (e.data === window.YT.PlayerState.ENDED && wanted) {
          try { player.seekTo(0, true); player.playVideo(); } catch (_) {}
        }
      },
    },
  });
}

function ensurePlayer() {
  if (typeof window === "undefined" || player) return;
  if (window.YT && window.YT.Player) { build(); return; }
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { if (typeof prev === "function") prev(); build(); };
  if (!document.getElementById("yt-iframe-api")) {
    const s = document.createElement("script");
    s.id = "yt-iframe-api"; s.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(s);
  }
}

// restart=true → aynı parça yüklüyse bile baştan sardır (Takdim'de her yeni programda).
export function playScreenMusic(videoId, restart = false) {
  wanted = videoId || null;
  if (!wanted) { apply(); return; }
  ensurePlayer();
  apply(restart);
}

export function stopScreenMusic() {
  wanted = null;
  apply();
}
