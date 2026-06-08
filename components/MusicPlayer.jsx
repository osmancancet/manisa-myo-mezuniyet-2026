"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MUSIC } from "@/lib/data";

function ytListId(url) {
  if (!url) return "";
  const m = url.match(/[?&]list=([^&]+)/);
  return m ? m[1] : "";
}
function buildYtSrc() {
  const listId = ytListId(MUSIC.youtubePlaylistUrl);
  if (listId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&autoplay=1&loop=1&rel=0`;
  }
  const ids = (MUSIC.youtubeIds || []).map((x) => x.id);
  if (ids.length === 0) return "";
  const list = ids.join(",");
  return `https://www.youtube-nocookie.com/embed/${ids[0]}?playlist=${list}&autoplay=1&loop=1&rel=0&modestbranding=1`;
}
function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60), x = Math.floor(s % 60);
  return m + ":" + String(x).padStart(2, "0");
}

export default function MusicPlayer() {
  const tracks = MUSIC.tracks;
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const acRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const [mode, setMode] = useState(() =>
    (typeof window !== "undefined" && window.location.hash.toLowerCase().includes("mp3")) ? "offline" : "online"
  ); // "online" | "offline"
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.9);
  const [shuffle, setShuffle] = useState(false);
  const [note, setNote] = useState("");

  // görsel ekolayzer (yerel mod)
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
        g.addColorStop(0, "#E7C66B"); g.addColorStop(1, "#ff6b8b");
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

  // temizlik
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) { audioRef.current.pause(); }
      if (acRef.current && acRef.current.state !== "closed") { acRef.current.close().catch(() => {}); }
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
      src.connect(analyser);
      analyser.connect(ac.destination);
      acRef.current = ac;
      analyserRef.current = analyser;
    } catch (e) { /* görselleştirme opsiyonel */ }
  }

  const playTrack = useCallback((i) => {
    const t = tracks[i]; if (!t) return;
    setIdx(i);
    const a = audioRef.current; if (!a) return;
    a.src = t.file; a.load();
    a.play()
      .then(() => { setupAnalyser(); if (acRef.current?.state === "suspended") acRef.current.resume(); setPlaying(true); setNote(""); })
      .catch(() => { setPlaying(false); });
  }, [tracks]);

  function toggle() {
    const a = audioRef.current; if (!a) return;
    if (!a.src) { playTrack(idx); return; }
    if (a.paused) {
      a.play().then(() => { setupAnalyser(); acRef.current?.resume(); setPlaying(true); }).catch(() => {});
    } else { a.pause(); setPlaying(false); }
  }
  function next() { playTrack(shuffle ? Math.floor(Math.random() * tracks.length) : (idx + 1) % tracks.length); }
  function prev() { playTrack((idx - 1 + tracks.length) % tracks.length); }

  const ytSrc = buildYtSrc();
  const cur = tracks[idx];

  return (
    <div className="player-area">
      <div className="mode-row player-foot">
        <div className="mode-toggle">
          <button className={mode === "online" ? "active" : ""} onClick={() => { setMode("online"); audioRef.current?.pause(); setPlaying(false); }}>YouTube (online)</button>
          <button className={mode === "offline" ? "active" : ""} onClick={() => setMode("offline")}>Yerel MP3</button>
        </div>
        <span className="player-note">
          {mode === "online"
            ? "Gerçek şarkılar YouTube'dan çalar (internet gerekir). Çalmazsa videodaki ▶ tuşuna basın."
            : "public/music/ klasörüne 01.mp3 ... 40.mp3 eklersen internetsiz çalar."}
        </span>
      </div>

      {mode === "online" ? (
        ytSrc ? (
          <div className="yt-embed">
            <iframe
              src={ytSrc}
              title="Kutlama Çalma Listesi"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="player"><div className="player-note">YouTube listesi tanımlı değil. data.js → MUSIC.youtubeIds</div></div>
        )
      ) : (
        <>
          <div className="viz-wrap"><canvas ref={canvasRef} className="viz-canvas" /></div>
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
              <button title="Önceki" onClick={prev}>⏮</button>
              <button className="play" title="Oynat/Duraklat" onClick={toggle}>{playing ? "⏸" : "▶"}</button>
              <button title="Sonraki" onClick={next}>⏭</button>
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
        onEnded={next}
        onError={() => { setPlaying(false); setNote("MP3 bulunamadı. Dosyaları public/music/ klasörüne ekle ya da YouTube moduna geç."); }}
        preload="none"
      />
    </div>
  );
}
