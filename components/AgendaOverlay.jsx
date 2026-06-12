"use client";
import { useEffect } from "react";
import { ACTIVE_PROGRAMS, HONORS, SPEAKERS } from "@/lib/data";

// Tören akışı (run-of-show): bulunulan adım vurgulu, tıkla-git.
export default function AgendaOverlay({ screen, proc, honor, takdim, konusma, onClose, jump, jumpProc, jumpKonusma, jumpHonor, jumpTakdim }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "g" || e.key === "G") { e.preventDefault(); e.stopPropagation(); onClose(); }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const go = (fn) => (e) => { e.stopPropagation(); fn(); onClose(); };

  return (
    <div className="agenda" onClick={onClose}>
      <div className="agenda-box" onClick={(e) => e.stopPropagation()}>
        <h2>Tören Akışı</h2>
        <div className="agenda-cols">
          <section>
            <h3 className={`agenda-h${screen === 0 ? " cur" : ""}`} onClick={go(() => jump(0))}>1 · Açılış</h3>
          </section>

          <section>
            <h3 className={`agenda-h${screen === 1 ? " cur" : ""}`} onClick={go(() => jumpProc(0))}>2 · Mezunlar Geçidi</h3>
            <ul>
              {ACTIVE_PROGRAMS.map((p, i) => (
                <li key={p.slug} className={screen === 1 && proc === i ? "cur" : ""} onClick={go(() => jumpProc(i))}>{i + 1}. {p.name}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={`agenda-h${screen === 2 ? " cur" : ""}`} onClick={go(() => jump(2))}>3 · Saygı Duruşu ve İstiklal Marşı</h3>
            <h3 className={`agenda-h${screen === 3 ? " cur" : ""}`} onClick={go(() => jumpKonusma(0))}>4 · Konuşmalar</h3>
            <ul>
              {SPEAKERS.map((sp, i) => (
                <li key={i} className={screen === 3 && konusma === i ? "cur" : ""} onClick={go(() => jumpKonusma(i))}>{i + 1}. {sp.name}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={`agenda-h${screen === 4 ? " cur" : ""}`} onClick={go(() => jumpHonor(0))}>5 · Dereceler</h3>
            <ul>
              {HONORS.map((g, i) => (
                <li key={g.key} className={screen === 4 && honor === i ? "cur" : ""} onClick={go(() => jumpHonor(i))}>{i + 1}. {g.title}</li>
              ))}
            </ul>
            <h3 className={`agenda-h${screen === 5 ? " cur" : ""}`} onClick={go(() => jump(5))}>6 · Kütüğe Plaket Çakma</h3>
            <h3 className={`agenda-h${screen === 6 ? " cur" : ""}`} onClick={go(() => jump(6))}>7 · TSO Hediye Çeki</h3>
          </section>

          <section>
            <h3 className={`agenda-h${screen === 7 ? " cur" : ""}`} onClick={go(() => jumpTakdim(0))}>8 · Mezunlarımızın Takdimi</h3>
            <ul>
              {ACTIVE_PROGRAMS.map((p, i) => (
                <li key={p.slug} className={screen === 7 && takdim === i ? "cur" : ""} onClick={go(() => jumpTakdim(i))}>{i + 1}. {p.name}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className={`agenda-h${screen === 8 ? " cur" : ""}`} onClick={go(() => jump(8))}>9 · Kep Atma + Yolunuz Açık Olsun</h3>
            <h3 className={`agenda-h${screen === 9 ? " cur" : ""}`} onClick={go(() => jump(9))}>10 · Kutlama / Halay</h3>
          </section>
        </div>
        <div className="agenda-foot">Bir başlığa tıkla · <kbd>Esc</kbd> / <kbd>G</kbd> ile kapat</div>
      </div>
    </div>
  );
}
