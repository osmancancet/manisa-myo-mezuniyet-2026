"use client";
import { motion } from "framer-motion";
import { honorsVariants } from "@/lib/motion";
import { GRADUATES } from "@/lib/graduates";
import { FACULTY } from "@/lib/data";

// "Mezunlarımızın Takdimi" — mezunlar sahneye çağrılırken o programın tüm adları
// FİLM JENERİĞİ gibi alttan üste doğru, sürekli ve sinematik olarak akar.
// Liste iki kez basılır → akış kesintisiz döner (yukarıdan çıkan alttan tekrar girer).
export default function TakdimScreen({ program, index, total }) {
  const names = GRADUATES[program.slug] || [];
  const faculty = FACULTY[program.slug] || [];   // belgeleri takdim eden hocalar
  // Akış süresi kişi sayısına göre (sinematik tempo). Tek tur = bir liste boyu.
  const duration = Math.max(22, Math.round(names.length * 0.9));

  return (
    <motion.section className="screen takdim" variants={honorsVariants} initial="initial" animate="animate" exit="exit">
      <div className="proc-counter"><b>{index + 1}</b> / {total} program</div>

      <div className="takdim-head" key={`head-${program.slug}`}>
        <div className="t-eyebrow">Mezuniyet Belgeleri Takdimi</div>
        <div className="t-program">{program.name}</div>
        <div className="t-dept">{program.department}</div>
      </div>

      {faculty.length > 0 && (
        <div className="takdim-faculty"><span>Belgeleri takdim eden hocalar:</span> {faculty.join("  ·  ")}</div>
      )}

      {names.length > 0 ? (
        <div className="credits-viewport" key={`cr-${program.slug}`}>
          <div className="credits-track" style={{ animationDuration: `${duration}s` }}>
            {[0, 1].map((dup) => (
              <ul className="credits-list" key={dup} aria-hidden={dup === 1}>
                {names.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ) : (
        <div className="takdim-empty" key={`empty-${program.slug}`}>Mezun listesi yakında eklenecek.</div>
      )}
    </motion.section>
  );
}
