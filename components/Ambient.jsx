"use client";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export default function Ambient() {
  const [parts, setParts] = useState([]);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const arr = [];
    for (let i = 0; i < 22; i++) {
      const size = 4 + Math.random() * 12;
      arr.push({
        size,
        left: Math.random() * 100,
        dur: 10 + Math.random() * 14,
        delay: -Math.random() * 20,
        drift: Math.random() * 8 - 4,
      });
    }
    setParts(arr);
  }, []);

  return (
    <div className="ambient" aria-hidden="true">
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
          }}
        />
      ))}
    </div>
  );
}
