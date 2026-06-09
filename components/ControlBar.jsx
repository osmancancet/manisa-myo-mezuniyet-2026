"use client";
import { useEffect, useRef, useState } from "react";

// Operatör kontrol çubuğu — video oynatıcı gibi hareketsizlikte gizlenir,
// fare/dokunma/tuş ile geri gelir. Kumanda ve dokunmatik dostu.
export default function ControlBar({ onPrev, onNext, onCountdown, onAgenda, onPreflight, onBlackout, onFs, onHelp }) {
  const [vis, setVis] = useState(true);
  const t = useRef(null);

  useEffect(() => {
    const show = () => {
      setVis(true);
      clearTimeout(t.current);
      t.current = setTimeout(() => setVis(false), 3400);
    };
    show();
    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show, { passive: true });
    window.addEventListener("keydown", show);
    return () => {
      clearTimeout(t.current);
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      window.removeEventListener("keydown", show);
    };
  }, []);

  const B = (label, title, fn, cls = "") => (
    <button className={`cb-btn ${cls}`} title={title} onClick={(e) => { e.stopPropagation(); fn(); }}>{label}</button>
  );

  return (
    <div className={`control-bar${vis ? "" : " hidden"}`} onClick={(e) => e.stopPropagation()}>
      {B("‹", "Geri (←)", onPrev)}
      {B("›", "İleri (→)", onNext)}
      <span className="cb-sep" />
      {B("⏱ Geri Sayım", "Geri sayım + şarkı (C)", onCountdown, "cb-wide")}
      {B("☰ Akış", "Akış / bölüme atla (G)", onAgenda, "cb-wide")}
      {B("✓ Prova", "Ön-kontrol / prova (P)", onPreflight, "cb-wide")}
      <span className="cb-sep" />
      {B("⛶", "Tam ekran (F)", onFs)}
      {B("◐", "Karart (B)", onBlackout)}
      {B("?", "Yardım (H)", onHelp)}
    </div>
  );
}
