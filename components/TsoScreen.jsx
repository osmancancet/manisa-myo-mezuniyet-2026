"use client";
import { motion } from "framer-motion";
import { honorsVariants } from "@/lib/motion";
import { TSO, TSO_WINNERS } from "@/lib/data";

// TSO Hediye Çeki — bölüm birincilerine (HONORS'tan türetilir) hediye çeki takdimi.
export default function TsoScreen() {
  return (
    <motion.section className="screen tso" variants={honorsVariants} initial="initial" animate="animate" exit="exit">
      <div className="tso-head">
        <div className="t-eyebrow">{TSO.title}</div>
        <div className="t-program">{TSO.subtitle}</div>
      </div>

      <div className="tso-winners">
        {TSO_WINNERS.map((w, i) => (
          <div className="tso-winner" key={`${w.no}-${i}`} style={{ animationDelay: `${i * 90}ms` }}>
            <span className="tw-name">{w.name}</span>
            {w.program && <span className="tw-prog">{w.program}</span>}
          </div>
        ))}
      </div>

      <div className="tso-reps">Hediye çeklerini takdim eden: {TSO.reps.join(" · ")}</div>
    </motion.section>
  );
}
