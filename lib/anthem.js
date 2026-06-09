// Geri sayım şarkısı (YouTube, sadece ses) — ANINDA başlasın diye önceden hazırlanır.
// Uygulama açılışında gizli bir oynatıcı oluşturulur ve video tampona alınır (cue, ses yok).
// Geri sayım açılınca sadece startAnthem() çağrılır → beklemeden çalar.

let player = null;
let ready = false;
let pending = false;
let curId = null;

export function preloadAnthem(videoId) {
  if (typeof window === "undefined" || !videoId) return;
  curId = videoId;

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

// Önceden tampona alınmış oynatıcıyı anında başlat. Hazır değilse hazır olunca başlar.
export function startAnthem() {
  if (!player || !ready) { pending = true; return false; }
  try {
    player.unMute?.();
    player.setVolume?.(100);
    player.seekTo?.(0, true);
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
