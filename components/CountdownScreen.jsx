"use client";
import { useEffect, useRef, useState } from "react";
import { burst, start as confettiStart, stop as confettiStop } from "@/lib/confetti";
import { MUSIC, COUNTDOWN_STEP_MS } from "@/lib/data";
import { startAnthem, stopAnthem, setAnthemMuted, startLocalAnthem, stopLocalAnthem, setLocalAnthemMuted } from "@/lib/anthem";

// Tören sunucuları 10'dan geriye sayarken sunumda da büyük geri sayım gösterir.
// Otomatik iner (hız data.js'ten); → / Boşluk ile elle ilerletilebilir (canlı senkron için).
// Açılır açılmaz hocanın istediği şarkı (We Are the Champions) çalar; kep atma anında devam eder.
// Önce yerel dosya (champions.mp3 / seçilen dosya) denenir, yoksa ÖNCEDEN HAZIR YouTube oynatıcısı
// anında çalar (lib/anthem.js — uygulama açılışında tampona alınır, geç başlamaz).
export default function CountdownScreen({ from = 10, onClose, fileOverride = null, stepMs = COUNTDOWN_STEP_MS }) {
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

  // otomatik sayaç — her rakam stepMs kadar ekranda kalır (data.js'ten ayarlanır)
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => stepRef.current(), stepMs);
    return () => clearTimeout(t);
  }, [n, done, stepMs]);

  // finalde konfeti + patlama
  useEffect(() => {
    if (!done) return;
    confettiStart();
    const id = requestAnimationFrame(() => {
      burst({ x: window.innerWidth / 2, y: window.innerHeight * 0.42, count: 140, spread: 2.1, power: 19 });
    });
    return () => { cancelAnimationFrame(id); confettiStop(); };
  }, [done]);

  /* ---------- ŞARKI: önceden tamponlanmış yerel dosya (anında), olmazsa hazır YouTube ---------- */
  const usingYt = useRef(false);
  const usingLocal = useRef(false);

  // açılışta şarkıyı başlat (C / ileri tuşu kullanıcı hareketi olduğundan oynatmaya izin verilir)
  useEffect(() => {
    let cancelled = false;
    const goYt = () => { if (cancelled) return; usingYt.current = true; setSource("youtube"); startAnthem(); };
    startLocalAnthem(fileOverride)
      .then(() => { if (!cancelled) { usingLocal.current = true; setSource("mp3"); } })
      .catch(goYt);
    return () => {
      cancelled = true;
      if (usingLocal.current) stopLocalAnthem();
      if (usingYt.current) stopAnthem();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sustur / aç
  useEffect(() => {
    if (usingLocal.current) setLocalAnthemMuted(muted);
    if (usingYt.current) setAnthemMuted(muted);
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
