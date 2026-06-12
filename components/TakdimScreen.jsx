"use client";
import { motion } from "framer-motion";
import { honorsVariants } from "@/lib/motion";
import { GRADUATES } from "@/lib/graduates";

// "Mezunlarımızın Takdimi" — bölüm bölüm, o programın tüm mezunlarının adları ekranda
// belirir; arka planda özel şarkı (lib/data.js → MUSIC.takdim) çalar. Sıra = geçit sırası.
export default function TakdimScreen({ program, index, total }) {
  const names = GRADUATES[program.slug] || [];
  const dense = names.length > 55;                 // çok isim → küçük font, dar sütun
  const stepMs = names.length > 40 ? 16 : 28;      // kademeli beliriş hızı

  return (
    <motion.section className="screen takdim" variants={honorsVariants} initial="initial" animate="animate" exit="exit">
      <div className="proc-counter"><b>{index + 1}</b> / {total} program</div>

      <div className="takdim-head" key={`head-${program.slug}`}>
        <div className="t-eyebrow">Mezuniyet Belgeleri Takdimi</div>
        <div className="t-program">{program.name}</div>
        <div className="t-dept">{program.department}</div>
      </div>

      {names.length > 0 ? (
        <div className={`takdim-names${dense ? " dense" : ""}`} key={`names-${program.slug}`}>
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
