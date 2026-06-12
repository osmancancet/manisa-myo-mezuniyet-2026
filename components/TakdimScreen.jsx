"use client";
import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { honorsVariants } from "@/lib/motion";
import { GRADUATES } from "@/lib/graduates";

// "Mezunlarımızın Takdimi" — bölüm bölüm, o programın tüm mezunlarının adları ekranda
// belirir; arka planda özel şarkı (lib/data.js → MUSIC.takdim) çalar. Sıra = geçit sırası.
// İsimler soldan sağa, satır satır akar (row-major) ve kaç kişi olursa olsun ekrana sığar:
// içerik ayrılan yüksekliğe sığana dek yazı/sütun ölçeği (--fit) küçültülür.
export default function TakdimScreen({ program, index, total }) {
  const names = GRADUATES[program.slug] || [];
  const stepMs = names.length > 40 ? 14 : 24;        // kademeli beliriş hızı
  const wrapRef = useRef(null);

  // Boya öncesi: tüm adlar dikeyde sığana kadar ölçeği düşür (en az 0.6'ya kadar).
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let s = 1;
    el.style.setProperty("--fit", "1");
    while (el.scrollHeight > el.clientHeight + 1 && s > 0.6) {
      s -= 0.04;
      el.style.setProperty("--fit", s.toFixed(2));
    }
    // pencere boyutu değişirse yeniden ölç (projeksiyon/çözünürlük güvencesi)
    const onResize = () => {
      let r = 1;
      el.style.setProperty("--fit", "1");
      while (el.scrollHeight > el.clientHeight + 1 && r > 0.6) {
        r -= 0.04;
        el.style.setProperty("--fit", r.toFixed(2));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [program.slug, names.length]);

  return (
    <motion.section className="screen takdim" variants={honorsVariants} initial="initial" animate="animate" exit="exit">
      <div className="proc-counter"><b>{index + 1}</b> / {total} program</div>

      <div className="takdim-head" key={`head-${program.slug}`}>
        <div className="t-eyebrow">Mezuniyet Belgeleri Takdimi</div>
        <div className="t-program">{program.name}</div>
        <div className="t-dept">{program.department}</div>
      </div>

      {names.length > 0 ? (
        <div className="takdim-names" ref={wrapRef} key={`names-${program.slug}`}>
          {names.map((n, i) => (
            <span className="grad-name" key={i} style={{ animationDelay: `${Math.min(i * stepMs, 1400)}ms` }}>
              {n}
            </span>
          ))}
        </div>
      ) : (
        <div className="takdim-empty" key={`empty-${program.slug}`}>Mezun listesi yakında eklenecek.</div>
      )}
    </motion.section>
  );
}
