"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { partyVariants } from "@/lib/motion";
import { start as confettiStart, stop as confettiStop } from "@/lib/confetti";
import MusicPlayer from "./MusicPlayer";

export default function PartyScreen() {
  useEffect(() => {
    confettiStart();
    return () => confettiStop();
  }, []);
  return (
    <motion.section className="screen party" variants={partyVariants} initial="initial" animate="animate" exit="exit">
      <div className="disco" aria-hidden="true">
        <span className="light l1" /><span className="light l2" /><span className="light l3" />
        <span className="light l4" /><span className="light l5" />
      </div>

      <div className="party-emojis" aria-hidden="true">
        {["🎉", "🎊", "🥳", "✨", "🎓", "💃", "🕺", "🎈", "⭐", "🎶"].map((e, i) => (
          <span key={i} className={`pe pe${i + 1}`}>{e}</span>
        ))}
      </div>

      <div className="party-top">
        <div className="party-eyebrow">Manisa Teknik Bilimler MYO • 2026</div>
        <div className="party-title">Halay Başlasın!</div>
        <div className="party-subtitle">Emeklerinizin şerefine — şimdi doyasıya kutlama zamanı.</div>
        <div className="party-rule" aria-hidden="true" />
      </div>

      <MusicPlayer />
    </motion.section>
  );
}
