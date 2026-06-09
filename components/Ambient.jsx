"use client";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Katmanlı canlı arka plan: gradyan mesh + ışık huzmeleri + alev motifi + kor parçacıkları.
// Renkler MCBÜ logosundan: royal lacivert + parlak azur, ara ara kırmızı kor.
export default function Ambient() {
  const [parts, setParts] = useState([]);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const arr = [];
    for (let i = 0; i < 24; i++) {
      const red = i % 5 === 0; // her 5'te 1 kırmızı kor
      arr.push({
        size: 3 + Math.random() * 11,
        left: Math.random() * 100,
        dur: 11 + Math.random() * 14,
        delay: -Math.random() * 22,
        drift: Math.random() * 9 - 4.5,
        color: red ? "var(--red-bright)" : (i % 2 ? "var(--azure-bright)" : "var(--sky)"),
      });
    }
    setParts(arr);
  }, []);

  return (
    <div className="ambient" aria-hidden="true">
      <div className="amb-mesh" />
      <div className="amb-rays" />
      <div className="amb-flame" />
      <div className="amb-embers">
        {parts.map((p, i) => (
          <span
            key={i}
            className="p"
            style={{
              width: p.size + "px",
              height: p.size + "px",
              left: p.left + "vw",
              animationDuration: p.dur + "s",
              animationDelay: p.delay + "s",
              "--drift": p.drift + "vw",
              "--pc": p.color,
            }}
          />
        ))}
      </div>
    </div>
  );
}
