"use client";
import { useEffect, useRef, useState } from "react";
import { burst, start as confettiStart, stop as confettiStop } from "@/lib/confetti";
import { MUSIC } from "@/lib/data";

// Tören sunucuları 10'dan geriye sayarken sunumda da büyük geri sayım gösterir.
// Otomatik 1 sn'de bir iner; → / Boşluk ile elle ilerletilebilir (canlı senkron için).
// Açılır açılmaz hocanın istediği şarkı (We Are the Champions) çalar; kep atma anında
// devam eder. Önce public/music/champions.mp3 denenir, yoksa YouTube'dan (sadece ses).
export default function CountdownScreen({ from = 10, onClose }) {
  const [n, setN] = useState(from);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [source, setSource] = useState(""); // "mp3" | "youtube" | ""
  const nRef = useRef(from);
  nRef.current = n;

  const stepRef = useRef(() => {});
  stepRef.current = () => {
    if (done) return;
    if (nRef.current > 1) setN(nRef.current - 1);
    else setDone(true);
  };

  // otomatik saniye sayacı
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => stepRef.current(), 1000);
    return () => clearTimeout(t);
  }, [n, done]);

  // finalde konfeti + patlama
  useEffect(() => {
    if (!done) return;
    confettiStart();
    const id = requestAnimationFrame(() => {
      burst({ x: window.innerWidth / 2, y: window.innerHeight * 0.42, count: 140, spread: 2.1, power: 19 });
    });
    return () => { cancelAnimationFrame(id); confettiStop(); };
  }, [done]);

  /* ---------- ŞARKI: önce yerel MP3, olmazsa YouTube (sadece ses) ---------- */
  const audioRef = useRef(null);
  const ytRef = useRef(null);

  function startYouTube() {
    const id = MUSIC.anthem?.youtubeId;
    if (!id || ytRef.current) return;
    setSource("youtube");
    const build = () => {
      if (ytRef.current || !window.YT || !window.YT.Player) return;
      ytRef.current = new window.YT.Player("cd-yt-audio", {
        height: "1", width: "1", videoId: id,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e) => { try { e.target.setVolume(100); e.target.playVideo(); } catch (_) {} },
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

  // açılışta şarkıyı başlat (C tuşu kullanıcı hareketi olduğundan otomatik oynatmaya izin verilir)
  useEffect(() => {
    const a = audioRef.current;
    if (a && MUSIC.anthem?.file) {
      a.src = MUSIC.anthem.file;
      a.volume = 0.95;
      a.play().then(() => setSource("mp3")).catch(() => startYouTube());
    } else {
      startYouTube();
    }
    return () => {
      if (a) { try { a.pause(); a.removeAttribute("src"); a.load(); } catch (_) {} }
      if (ytRef.current?.destroy) { try { ytRef.current.destroy(); } catch (_) {} }
      ytRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sustur / aç
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    try {
      const p = ytRef.current;
      if (p) { muted ? p.mute?.() : p.unMute?.(); }
    } catch (_) {}
  }, [muted, source]);

  // klavye: Esc kapatır, →/Boşluk/Enter elle ilerletir, M susturur, finalde herhangi bir tuş kapatır
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); onClose(); return; }
      if (e.key === "m" || e.key === "M") { e.preventDefault(); e.stopPropagation(); setMuted((v) => !v); return; }
      if (done) { e.preventDefault(); e.stopPropagation(); onClose(); return; }
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter" || e.key === "PageDown") {
        e.preventDefault(); e.stopPropagation(); stepRef.current();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [done, onClose]);

  return (
    <div className="countdown-overlay" onClick={() => (done ? onClose() : stepRef.current())}>
      <div className="cd-glow" aria-hidden="true" />

      <audio ref={audioRef} preload="none" />
      <div className="cd-yt-audio" aria-hidden="true"><div id="cd-yt-audio" /></div>

      {source && (
        <div className="cd-music" onClick={(e) => { e.stopPropagation(); setMuted((v) => !v); }}
             title="Şarkıyı sustur/aç (M)">
          <span className="cd-music-ico">{muted ? "🔇" : "🎵"}</span>
          <span className="cd-music-txt">{MUSIC.anthem?.title || "Şarkı"}</span>
        </div>
      )}

      {!done ? (
        <div className="cd-num" key={n}>
          <span className="cd-ring" aria-hidden="true" />
          <span className="cd-digit">{n}</span>
        </div>
      ) : (
        <div className="cd-finale">
          <div className="cd-caps" aria-hidden="true">
            <span>🎓</span><span>🎉</span><span>🎓</span><span>🎊</span><span>🎓</span>
          </div>
          <div className="cd-finale-title">Tebrikler Mezunlar!</div>
          <div className="cd-finale-sub">Kepler havaya! 🎓</div>
        </div>
      )}
      <div className="cd-foot">{done ? "Kapatmak için herhangi bir tuş / tıklama" : "→ veya Boşluk ile elle ilerlet · M sustur · Esc ile kapat"}</div>
    </div>
  );
}
