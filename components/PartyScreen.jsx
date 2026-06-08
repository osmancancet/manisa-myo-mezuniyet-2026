"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { screenVariants } from "@/lib/motion";
import { start as confettiStart, stop as confettiStop } from "@/lib/confetti";
import MusicPlayer from "./MusicPlayer";

export default function PartyScreen() {
  useEffect(() => {
    confettiStart();
    return () => confettiStop();
  }, []);
  return (
    <motion.section className="screen party" variants={screenVariants} initial="initial" animate="animate" exit="exit">
      <div className="disco" aria-hidden="true">
        <span className="light l1" /><span className="light l2" /><span className="light l3" />
        <span className="light l4" /><span className="light l5" />
      </div>
      <div className="party-top">
        <div className="party-eyebrow">Şimdi Eğlence Zamanı</div>
        <div className="party-title">Halay Başlasın!</div>
      </div>
      <MusicPlayer />
    </motion.section>
  );
}
