"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { screenVariants } from "@/lib/motion";
import { CEREMONY_DATA } from "@/lib/data";
import { preload, isOk } from "@/lib/preload";

const INTERVAL = CEREMONY_DATA.processionPhotoIntervalMs || 5000;

export default function ProcessionScreen({ program, index, total }) {
  const aRef = useRef(null), bRef = useRef(null), progRef = useRef(null);
  const st = useRef({ cur: 0, idx: 0, kbN: 1, timer: null, shown: false });
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const layers = [aRef.current, bRef.current];
    const S = st.current;
    S.idx = 0; S.shown = false;
    let stopped = false;
    const paths = program.procession || [];

    // katmanları temizle
    layers.forEach((l) => { if (l) { l.className = "kb-layer"; l.style.backgroundImage = ""; } });

    function swap(url) {
      const next = (S.cur + 1) % 2;
      const nl = layers[next], cl = layers[S.cur];
      if (!nl || !cl) return;
      nl.style.backgroundImage = `url("${url}")`;
      nl.className = "kb-layer";
      void nl.offsetWidth;
      S.kbN = (S.kbN % 4) + 1;
      nl.classList.add("show", "kb" + S.kbN);
      cl.classList.remove("show");
      S.cur = next;
    }
    function restartProgress() {
      const b = progRef.current; if (!b) return;
      b.classList.remove("run"); void b.offsetWidth;
      b.style.animationDuration = INTERVAL + "ms";
      b.classList.add("run");
    }
    function showNext() {
      const avail = paths.filter(isOk);
      if (avail.length === 0) { setEmpty(true); return; }
      setEmpty(false);
      const url = avail[S.idx % avail.length]; S.idx++;
      S.shown = true;
      swap(url); restartProgress();
    }

    paths.forEach((u) => preload(u, () => { if (!stopped && !S.shown) showNext(); }));
    showNext();
    S.timer = setInterval(showNext, INTERVAL);
    return () => { stopped = true; clearInterval(S.timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.slug]);

  return (
    <motion.section className="screen procession" variants={screenVariants} initial="initial" animate="animate" exit="exit">
      <div className="kb-stage">
        <div ref={aRef} className="kb-layer" />
        <div ref={bRef} className="kb-layer" />
        {empty && (
          <div className="kb-empty">
            <div className="kb-empty-mark">
              <div className="kb-empty-uni">{CEREMONY_DATA.school.university}</div>
              <div className="kb-empty-school">Teknik Bilimler Meslek Yüksekokulu</div>
            </div>
          </div>
        )}
      </div>
      <div className="kb-scrim" />
      <div className="proc-counter"><b>{index + 1}</b> / {total} program</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={program.slug}
          className="proc-caption"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5 }}
        >
          <div className="proc-eyebrow">Mezunlar Geçidi</div>
          <div className="proc-program">{program.name}</div>
          <div className="proc-dept">{program.department}</div>
        </motion.div>
      </AnimatePresence>
      <div className="proc-progress"><i ref={progRef} /></div>
    </motion.section>
  );
}
