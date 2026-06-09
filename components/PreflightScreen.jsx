"use client";
import { useEffect, useRef, useState } from "react";
import { ACTIVE_PROGRAMS, HONORS, MUSIC } from "@/lib/data";

function Row({ ok, label, detail }) {
  const cls = ok === null ? "warn" : ok ? "ok" : "bad";
  const ico = ok === null ? "…" : ok ? "✓" : "✕";
  return (
    <div className={`pf-row ${cls}`}>
      <span className="pf-ico">{ico}</span>
      <span className="pf-label">{label}</span>
      <span className="pf-detail">{detail}</span>
    </div>
  );
}

// Prova / ön-kontrol ekranı: tören öncesi her şeyin hazır olduğunu doğrular.
export default function PreflightScreen({ onClose, onAnthemFile, anthemSrc, anthemName, onFs }) {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [fs, setFs] = useState(false);
  const [mp3, setMp3] = useState(null); // null=kontrol, true=var, false=yok
  const [photo, setPhoto] = useState({ done: false, okC: 0, total: 0 });
  const wakeOk = typeof navigator !== "undefined" && "wakeLock" in navigator;
  const audioRef = useRef(null);

  useEffect(() => {
    const upOnline = () => setOnline(navigator.onLine);
    const upFs = () => setFs(!!document.fullscreenElement);
    window.addEventListener("online", upOnline);
    window.addEventListener("offline", upOnline);
    document.addEventListener("fullscreenchange", upFs);
    upFs();
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") { e.preventDefault(); e.stopPropagation(); onClose(); }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("online", upOnline);
      window.removeEventListener("offline", upOnline);
      document.removeEventListener("fullscreenchange", upFs);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [onClose]);

  // şarkı (mp3) testi — override seçildiyse zaten hazır
  useEffect(() => {
    if (anthemSrc) { setMp3(true); return; }
    let done = false;
    const a = new Audio();
    a.preload = "metadata";
    const ok = () => { if (!done) { done = true; setMp3(true); } };
    const bad = () => { if (!done) { done = true; setMp3(false); } };
    a.addEventListener("loadedmetadata", ok);
    a.addEventListener("error", bad);
    a.src = MUSIC.anthem.file; a.load();
    const to = setTimeout(bad, 3500);
    return () => { clearTimeout(to); a.removeAttribute("src"); };
  }, [anthemSrc]);

  // foto örneklemesi: her programın 1. yürüyüş fotoğrafı + tüm derece fotoları
  useEffect(() => {
    const samples = [];
    ACTIVE_PROGRAMS.forEach((p) => { if (p.procession && p.procession[0]) samples.push(p.procession[0]); });
    HONORS.forEach((g) => g.honors.forEach((h) => { if (h.photo) samples.push(h.photo); }));
    const total = samples.length;
    if (!total) { setPhoto({ done: true, okC: 0, total: 0 }); return; }
    let okC = 0, done = 0;
    samples.forEach((src) => {
      const img = new Image();
      const fin = (good) => { if (good) okC++; done++; if (done === total) setPhoto({ done: true, okC, total }); };
      img.onload = () => fin(true);
      img.onerror = () => fin(false);
      img.src = encodeURI(src);
    });
  }, []);

  function pickFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    onAnthemFile(URL.createObjectURL(f), f.name);
  }
  function testSound() {
    const a = audioRef.current; if (!a) return;
    a.src = anthemSrc || MUSIC.anthem.file; a.volume = 0.9;
    a.play().then(() => { setTimeout(() => { try { a.pause(); } catch (_) {} }, 2500); }).catch(() => {});
  }

  return (
    <div className="preflight" onClick={onClose}>
      <div className="pf-box" onClick={(e) => e.stopPropagation()}>
        <h2>Prova / Ön-Kontrol</h2>
        <div className="pf-list">
          <Row ok={fs} label="Tam ekran" detail={fs ? "Açık" : "Kapalı — aşağıdan aç"} />
          <Row ok={online} label="İnternet" detail={online ? "Bağlı (YouTube müzik çalışır)" : "Yok — yerel MP3 şart"} />
          <Row ok={wakeOk} label="Ekran uyumaz" detail={wakeOk ? "Destekleniyor" : "Tarayıcı desteklemiyor"} />
          <Row
            ok={mp3}
            label="Kep atma şarkısı"
            detail={mp3 === null ? "Kontrol ediliyor…" : mp3 ? (anthemSrc ? `Seçilen dosya: ${anthemName || "hazır"} (internetsiz)` : "champions.mp3 bulundu (internetsiz)") : "MP3 yok → YouTube'a düşer (internet gerekir)"}
          />
          <Row
            ok={photo.done ? photo.total > 0 && photo.okC > 0 : null}
            label="Fotoğraflar"
            detail={!photo.done ? "Taranıyor…" : photo.total === 0 ? "Tanımlı foto yok" : `${photo.okC}/${photo.total} yüklendi${photo.okC < photo.total ? " — eksikler placeholder gösterir" : ""}`}
          />
        </div>

        <div className="pf-actions">
          <label className="pf-file">🎵 Şarkı dosyası seç
            <input type="file" accept="audio/*" onChange={pickFile} />
          </label>
          <button onClick={testSound}>▶ Sesi test et</button>
          <button onClick={onFs}>⛶ Tam ekran</button>
        </div>

        {anthemSrc && <div className="pf-note">Seçilen şarkı geri sayımda internetsiz çalacak. ✓</div>}
        <div className="pf-foot">Boş alana tıkla · <kbd>Esc</kbd> / <kbd>P</kbd> ile kapat</div>
        <audio ref={audioRef} preload="none" />
      </div>
    </div>
  );
}
