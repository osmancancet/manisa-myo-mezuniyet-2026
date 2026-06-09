"use client";
import { motion } from "framer-motion";
import { screenVariants } from "@/lib/motion";
import { CEREMONY_DATA } from "@/lib/data";

export default function IntroScreen() {
  const s = CEREMONY_DATA.school;
  return (
    <motion.section className="screen intro" variants={screenVariants} initial="initial" animate="animate" exit="exit">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="intro-logo" src={s.logo} alt="Manisa Celal Bayar Üniversitesi — Teknik Bilimler MYO" />
      <div className="intro-university">{s.university}</div>
      <h1 className="intro-school">Manisa Teknik Bilimler<br />Meslek Yüksekokulu</h1>
      <div className="gold-rule" />
      <div className="intro-title">{s.introTitle}</div>
      <div className="intro-subtitle">{s.introSubtitle}</div>
      <div className="intro-quote">
        “{s.quote}”
        <span className="intro-quote-author">— {s.quoteAuthor}</span>
      </div>
    </motion.section>
  );
}
