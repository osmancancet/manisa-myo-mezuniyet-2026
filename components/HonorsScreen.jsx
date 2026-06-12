"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { honorsVariants, prefersReducedMotion } from "@/lib/motion";
import { CEREMONY_DATA } from "@/lib/data";
import { burst } from "@/lib/confetti";

const LABELS = { 1: "Birinci", 2: "İkinci", 3: "Üçüncü", 4: "Dördüncü" };
const PLACEHOLDER = [{ rank: 1 }, { rank: 2 }, { rank: 3 }];

// Podyum yerleşimi: 2. solda — 1. ortada (yüksekte) — 3. sağda. Beraberlikler yan yana.
const PODIUM = { 1: 1, 2: 0, 3: 2 };
function toPodium(list) {
  return list
    .map((h, i) => ({ h, i }))
    .sort((a, b) => ((PODIUM[a.h.rank] ?? a.h.rank + 1) - (PODIUM[b.h.rank] ?? b.h.rank + 1)) || (a.i - b.i))
    .map((x) => x.h);
}

export default function HonorsScreen({ group, index, total, revealStep = 1 }) {
  const rowRef = useRef(null);
  const empty = !(group.honors && group.honors.length);
  const base = empty ? PLACEHOLDER : group.honors;
  const honors = toPodium(base);
  const isSchool = group.key === "okul";

  // Sıra: her derece ayrı slayt (3. → 2. → 1.), en son hepsi bir arada (podyum).
  const ranksDesc = [...new Set(base.map((h) => h.rank))].sort((a, b) => b - a);
  const podiumMode = empty || revealStep > ranksDesc.length;   // final: hepsi bir arada
  const activeRank = podiumMode ? null : ranksDesc[revealStep - 1];
  const visible = podiumMode ? honors : honors.filter((h) => h.rank === activeRank);

  useEffect(() => {
    if (prefersReducedMotion() || empty) return;
    // konfetiyi 1.'nin açıldığı slaytta ve final podyumda patlat
    if (activeRank !== 1 && !podiumMode) return;
    const id = setTimeout(() => {
      const first = rowRef.current?.querySelector(".r1 .honor-photo-wrap") || rowRef.current?.querySelector(".honor-photo-wrap");
      let x = window.innerWidth / 2, y = window.innerHeight * 0.42;
      if (first) { const r = first.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height * 0.15; }
      burst({ x, y, count: isSchool ? 60 : 34, spread: 1.6, power: 13 });
    }, 280);
    return () => clearTimeout(id);
  }, [group.key, revealStep, podiumMode, activeRank, empty, isSchool]);

  return (
    <motion.section className={`screen honors${isSchool ? " honors-school" : ""}`} variants={honorsVariants} initial="initial" animate="animate" exit="exit">
      <div className="proc-counter"><b>{index + 1}</b> / {total}</div>
      <div className="honors-head" key={`head-${group.key}`}>
        <div className="h-eyebrow">{isSchool ? "Okul Birincileri" : "Dereceye Girenler"}</div>
        <div className="h-program">{group.title}</div>
        <div className="h-dept">{group.subtitle}</div>
      </div>

      <div className={`honor-row${podiumMode ? " podium" : " solo"}`} ref={rowRef} key={`${group.key}-${revealStep}`}>
        {visible.map((h, i) => {
          const hasName = h.name && h.name.trim() !== "";
          const src = h.photo ? encodeURI(h.photo) : CEREMONY_DATA.placeholderPhoto;
          return (
            <div className={`honor-card r${h.rank}`} key={`${h.rank}-${i}`}>
              <div className="photo-glow">
                <div className="rank-badge">{h.rank}</div>
                <div className="honor-photo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={LABELS[h.rank] || ""} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = CEREMONY_DATA.placeholderPhoto; }} />
                </div>
                {h.rank === 1 && (
                  <>
                    <span className="spark s1" /><span className="spark s2" />
                    <span className="spark s3" /><span className="spark s4" />
                  </>
                )}
              </div>
              <div className="honor-label">{LABELS[h.rank] || h.rank + "."}</div>
              <div className={`honor-name${hasName ? "" : " empty"}`}>{hasName ? h.name : "—"}</div>
              {h.program && <div className="honor-program-tag">{h.program}</div>}
            </div>
          );
        })}
      </div>

      {empty && <div className="honors-empty-note">Bu bölümün dereceleri yakında eklenecek.</div>}
      {!empty && !podiumMode && (
        <div className="honors-step-hint">Sıradaki dereceyi açmak için <kbd>→</kbd></div>
      )}
    </motion.section>
  );
}
