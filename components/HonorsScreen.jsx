"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { screenVariants, prefersReducedMotion } from "@/lib/motion";
import { CEREMONY_DATA } from "@/lib/data";
import { burst } from "@/lib/confetti";

const LABELS = { 1: "Birinci", 2: "İkinci", 3: "Üçüncü", 4: "Dördüncü" };
const PLACEHOLDER = [{ rank: 1 }, { rank: 2 }, { rank: 3 }];

export default function HonorsScreen({ group, index, total }) {
  const rowRef = useRef(null);
  const empty = !(group.honors && group.honors.length);
  const honors = empty ? PLACEHOLDER : group.honors;
  const isSchool = group.key === "okul";

  useEffect(() => {
    if (prefersReducedMotion() || empty) return;
    const id = requestAnimationFrame(() => {
      const first = rowRef.current?.querySelector(".r1 .honor-photo-wrap");
      let x = window.innerWidth / 2, y = window.innerHeight * 0.42;
      if (first) { const r = first.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height * 0.15; }
      burst({ x, y, count: isSchool ? 60 : 34, spread: 1.6, power: 13 });
    });
    return () => cancelAnimationFrame(id);
  }, [group.key, empty, isSchool]);

  return (
    <motion.section className={`screen honors${isSchool ? " honors-school" : ""}`} variants={screenVariants} initial="initial" animate="animate" exit="exit">
      <div className="proc-counter"><b>{index + 1}</b> / {total}</div>
      <div className="honors-head">
        <div className="h-eyebrow">{isSchool ? "Okul Birincileri" : "Dereceye Girenler"}</div>
        <div className="h-program">{group.title}</div>
        <div className="h-dept">{group.subtitle}</div>
      </div>

      <div className="honor-row" ref={rowRef} key={group.key}>
        {honors.map((h, i) => {
          const hasName = h.name && h.name.trim() !== "";
          const src = h.photo ? encodeURI(h.photo) : CEREMONY_DATA.placeholderPhoto;
          return (
            <div className={`honor-card r${h.rank}`} key={i}>
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
    </motion.section>
  );
}
