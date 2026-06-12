"use client";
import { motion } from "framer-motion";
import { closingVariants } from "@/lib/motion";

// Saygı Duruşu + İstiklal Marşı — sade, saygın, sessiz (marş canlı söylenir).
export default function SaygiScreen() {
  return (
    <motion.section className="screen saygi" variants={closingVariants} initial="initial" animate="animate" exit="exit">
      <div className="saygi-eyebrow">Saygı Duruşu</div>
      <h1 className="saygi-title">Saygı Duruşu ve İstiklal Marşı</h1>
      <div className="gold-rule" />
      <div className="saygi-text">
        Büyük Önder Gazi Mustafa Kemal Atatürk, aziz şehitlerimiz, ebediyete irtihal eden
        öğretim üyelerimiz ve öğrencilerimiz anısına…
      </div>
    </motion.section>
  );
}
