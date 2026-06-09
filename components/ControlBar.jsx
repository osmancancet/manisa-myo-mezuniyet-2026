"use client";

// Operatör kontrol çubuğu — varsayılan GİZLİ. O tuşuyla (ya da kontrol çubuğundaki ✕)
// açılıp kapanır; sürekli ekranda durmaz. Kumanda/dokunmatik dostu.
export default function ControlBar({ visible, onPrev, onNext, onCountdown, onAgenda, onPreflight, onBlackout, onFs, onHelp, onHide }) {
  const B = (label, title, fn, cls = "") => (
    <button className={`cb-btn ${cls}`} title={title} onClick={(e) => { e.stopPropagation(); fn(); }}>{label}</button>
  );

  return (
    <div className={`control-bar${visible ? "" : " hidden"}`} onClick={(e) => e.stopPropagation()}>
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
      {B("✕", "Çubuğu gizle (O)", onHide)}
    </div>
  );
}
