"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { screenVariants } from "@/lib/motion";
import { CEREMONY_DATA } from "@/lib/data";
import { start as confettiStart, stop as confettiStop } from "@/lib/confetti";

export default function ClosingScreen() {
  const s = CEREMONY_DATA.school;
  useEffect(() => {
    confettiStart();
    return () => confettiStop();
  }, []);
  return (
    <motion.section className="screen closing" variants={screenVariants} initial="initial" animate="animate" exit="exit">
      <div className="closing-eyebrow">{s.shortName}</div>
      <div className="gold-rule" />
      <div className="closing-title">{s.closingTitle}</div>
      <div className="closing-message">{s.closingMessage}</div>
      <div className="closing-cta">Kutlama / Halay için <kbd>→</kbd> ile devam edin</div>
    </motion.section>
  );
}
