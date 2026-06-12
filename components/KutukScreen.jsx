"use client";
import { motion } from "framer-motion";
import { honorsVariants } from "@/lib/motion";
import { HONORS } from "@/lib/data";

// Mezunlar Kütüğüne İsim Plaketinin Çakılması — MYO Birincisi çakar; 2.–3. eşlik eder.
// İsimler okul derecesi grubundan (HONORS → "okul") türetilir.
export default function KutukScreen() {
  const okul = HONORS.find((g) => g.key === "okul");
  const list = okul?.honors || [];
  const caker = list.find((h) => h.rank === 1);
  const eslik = list.filter((h) => h.rank !== 1).sort((a, b) => a.rank - b.rank);

  return (
    <motion.section className="screen kutuk" variants={honorsVariants} initial="initial" animate="animate" exit="exit">
      <div className="kutuk-eyebrow">Mezunlar Kütüğü</div>
      <h1 className="kutuk-title">İsim Plaketinin Çakılması</h1>
      <div className="gold-rule" />

      {caker && (
        <div className="kutuk-caker">
          <div className="kc-badge" aria-hidden="true">🏅</div>
          <div className="kc-name">{caker.name}</div>
          <div className="kc-role">Meslek Yüksekokulu Birincisi · isim plaketini kütüğe çakıyor</div>
        </div>
      )}

      {eslik.length > 0 && (
        <div className="kutuk-eslik">
          <div className="ke-label">Eşlik edenler</div>
          <div className="ke-names">
            {eslik.map((h, i) => (
              <span key={`${h.no}-${i}`}>{h.name}</span>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
