"use client";
import { motion } from "framer-motion";
import { honorsVariants } from "@/lib/motion";

// Konuşmalar — her → bir konuşmacı (rol · ad · ünvan). lib/data.js → SPEAKERS.
export default function KonusmaScreen({ speaker, index, total }) {
  if (!speaker) return null;
  return (
    <motion.section className="screen konusma" variants={honorsVariants} initial="initial" animate="animate" exit="exit">
      <div className="proc-counter"><b>{index + 1}</b> / {total}</div>

      <div className="konusma-card" key={`speaker-${index}`}>
        <div className="k-podium" aria-hidden="true">🎙️</div>
        <div className="k-role">{speaker.role}</div>
        <div className="k-name">{speaker.name}</div>
        <div className="k-title">{speaker.title}</div>
      </div>
    </motion.section>
  );
}
