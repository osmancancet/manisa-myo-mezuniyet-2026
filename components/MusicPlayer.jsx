"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MUSIC } from "@/lib/data";

function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60), x = Math.floor(s % 60);
  return m + ":" + String(x).padStart(2, "0");
}

const EQ_BARS = Array.from({ length: 28 });

export default function MusicPlayer() {
  const tracks = MUSIC.tracks;
  const ytIds = (MUSIC.youtubeIds || []).map((x) => x.id);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const acRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const ytRef = useRef(null);

  // İnternet yoksa otomatik yerel MP3 moduna geç (#mp3 etiketi de zorlar).
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "online";
    if (window.location.hash.toLowerCase().includes("mp3")) return "offline";
    if (navigator.onLine === false) return "offline";
    return "online";
  });

  // offline (MP3) durumu
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.9);
  const [shuffle, setShuffle] = useState(false);
  const [note, setNote] = useState("");

  // online (YouTube, sadece ses) durumu
  const [ytPlaying, setYtPlaying] = useState(false);
  const [ytTitle, setYtTitle] = useState("");

  /* ---------- offline görsel ekolayzer ---------- */
  const draw = useCallback(() => {
    const canvas = canvasRef.current, analyser = analyserRef.current;
    if (canvas && analyser) {
      const c = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const w = (canvas.width = canvas.clientWidth * dpr);
      const h = (canvas.height = canvas.clientHeight * dpr);
      const bins = analyser.frequencyBinCount;
      const data = new Uint8Array(bins);
      analyser.getByteFrequencyData(data);
      c.clearRect(0, 0, w, h);
      const bw = w / bins;
      for (let i = 0; i < bins; i++) {
        const v = data[i] / 255;
        const bh = Math.max(6 * dpr, v * h);
        const g = c.createLinearGradient(0, h, 0, h - bh);
        g.addColorStop(0, "#ED4B5C"); g.addColorStop(1, "#F4F1EA");
        c.fillStyle = g;
        c.fillRect(i * bw + bw * 0.15, h - bh, bw * 0.7, bh);
      }
    }
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (mode === "offline") { rafRef.current = requestAnimationFrame(draw); }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mode, draw]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) audioRef.current.pause();
      if (acRef.current && acRef.current.state !== "closed") acRef.current.close().catch(() => {});
    };
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = vol; }, [vol]);

  function setupAnalyser() {
    if (acRef.current) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = new AC();
      const src = ac.createMediaElementSource(audioRef.current);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser); analyser.connect(ac.destination);
      acRef.current = ac; analyserRef.current = analyser;
    } catch (e) { /* görselleştirme opsiyonel */ }
  }

  const playTrack = useCallback((i) => {
    const t = tracks[i]; if (!t) return;
    setIdx(i);
    const a = audioRef.current; if (!a) return;
    a.src = t.file; a.load();
    a.play()
      .then(() => { setupAnalyser(); if (acRef.current?.state === "suspended") acRef.current.resume(); setPlaying(true); setNote(""); })
      .catch(() => setPlaying(false));
  }, [tracks]);

  function toggleOffline() {
    const a = audioRef.current; if (!a) return;
    if (!a.src) { playTrack(idx); return; }
    if (a.paused) { a.play().then(() => { setupAnalyser(); acRef.current?.resume(); setPlaying(true); }).catch(() => {}); }
    else { a.pause(); setPlaying(false); }
  }
  function nextOffline() { playTrack(shuffle ? Math.floor(Math.random() * tracks.length) : (idx + 1) % tracks.length); }
  function prevOffline() { playTrack((idx - 1 + tracks.length) % tracks.length); }

  /* ---------- online: YouTube IFrame API (SADECE SES, klip gizli) ---------- */
  useEffect(() => {
    if (mode !== "online" || ytIds.length === 0) return;
    let cancelled = false;

    function createPlayer() {
      if (cancelled || ytRef.current || !window.YT || !window.YT.Player) return;
      ytRef.current = new window.YT.Player("yt-audio", {
        height: "1", width: "1", videoId: ytIds[0],
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1, loop: 1, playlist: ytIds.join(",") },
        events: {
          onReady: (e) => { try { e.target.setVolume(100); e.target.playVideo(); } catch (_) {} },
          onStateChange: (e) => {
            setYtPlaying(e.data === window.YT.PlayerState.PLAYING);
            try { const d = e.target.getVideoData(); if (d && d.title) setYtTitle(d.title); } catch (_) {}
          },
          onError: (e) => { try { e.target.nextVideo(); } catch (_) {} },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (typeof prev === "function") prev(); createPlayer(); };
      if (!document.getElementById("yt-iframe-api")) {
        const s = document.createElement("script");
        s.id = "yt-iframe-api"; s.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      if (ytRef.current && ytRef.current.destroy) { try { ytRef.current.destroy(); } catch (_) {} }
      ytRef.current = null;
      setYtPlaying(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function ytToggle() { const p = ytRef.current; if (!p) return; if (ytPlaying) p.pauseVideo(); else p.playVideo(); }
  function ytNext() { try { ytRef.current?.nextVideo(); } catch (_) {} }
  function ytPrev() { try { ytRef.current?.previousVideo(); } catch (_) {} }

  const cur = tracks[idx];

  return (
    <div className="player-area">
      <div className="mode-row player-foot">
        <div className="mode-toggle">
          <button className={mode === "online" ? "active" : ""} onClick={() => { setMode("online"); audioRef.current?.pause(); setPlaying(false); }}>YouTube (ses)</button>
          <button className={mode === "offline" ? "active" : ""} onClick={() => setMode("offline")}>Yerel MP3</button>
        </div>
        <span className="player-note">
          {mode === "online"
            ? "Sadece ses çalar, klip gizlidir. İnternet gerekir; başlamazsa ▶ tuşuna basın."
            : "public/music/ klasörüne 01.mp3 ... 40.mp3 eklersen internetsiz çalar."}
        </span>
      </div>

      <div className="viz-wrap">
        {mode === "offline"
          ? <canvas ref={canvasRef} className="viz-canvas" />
          : <div className={`eq${ytPlaying ? "" : " paused"}`}>{EQ_BARS.map((_, i) => <i key={i} />)}</div>}
      </div>

      {mode === "online" ? (
        <>
          <div className="yt-audio-wrap" aria-hidden="true"><div id="yt-audio" /></div>
          <div className="player">
            <div className="np">
              <span className="np-n">♪</span>
              <span className="np-title">{ytTitle || "Kutlama Çalma Listesi"}</span>
            </div>
            <div className="controls">
              <button title="Önceki" onClick={ytPrev}>⏮</button>
              <button className="play" title="Oynat / Duraklat" onClick={ytToggle}>{ytPlaying ? "⏸" : "▶"}</button>
              <button title="Sonraki" onClick={ytNext}>⏭</button>
            </div>
            <div className="np-list">Önce Manisa / zeybek / çiftetelli, sonra Ankara oyun havaları çalar.</div>
          </div>
        </>
      ) : (
        <>
          <div className="player">
            <div className="np">
              <span className="np-n">{String(cur.n).padStart(2, "0")}</span>
              <span className="np-title">{cur.title}</span>
              <span className="np-artist">{cur.artist}</span>
            </div>
            <div className="seek">
              <span className="time">{fmt(time)}</span>
              <input type="range" min={0} max={dur || 0} value={time}
                onChange={(e) => { const a = audioRef.current; if (a) { a.currentTime = Number(e.target.value); setTime(Number(e.target.value)); } }} />
              <span className="time">{fmt(dur)}</span>
            </div>
            <div className="controls">
              <button className={shuffle ? "on" : ""} title="Karıştır" onClick={() => setShuffle((s) => !s)}>⤮</button>
              <button title="Önceki" onClick={prevOffline}>⏮</button>
              <button className="play" title="Oynat / Duraklat" onClick={toggleOffline}>{playing ? "⏸" : "▶"}</button>
              <button title="Sonraki" onClick={nextOffline}>⏭</button>
              <div className="volume">🔊<input type="range" min={0} max={1} step={0.01} value={vol} onChange={(e) => setVol(Number(e.target.value))} /></div>
            </div>
            {note && <div className="player-note">{note}</div>}
          </div>
          <div className="tracklist">
            {tracks.map((t, i) => (
              <div key={t.n} className={`tk${i === idx ? " active" : ""}`} onClick={() => playTrack(i)}>
                <span className="tk-n">{String(t.n).padStart(2, "0")}</span>
                <span>{t.title}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onEnded={nextOffline}
        onError={() => { setPlaying(false); setNote("MP3 bulunamadı. Dosyaları public/music/ klasörüne ekle ya da YouTube moduna geç."); }}
        preload="none"
      />
    </div>
  );
}
