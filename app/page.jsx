"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ACTIVE_PROGRAMS, HONORS } from "@/lib/data";
import Ambient from "@/components/Ambient";
import IntroScreen from "@/components/IntroScreen";
import ProcessionScreen from "@/components/ProcessionScreen";
import HonorsScreen from "@/components/HonorsScreen";
import ClosingScreen from "@/components/ClosingScreen";
import PartyScreen from "@/components/PartyScreen";
import CountdownScreen from "@/components/CountdownScreen";

const N = ACTIVE_PROGRAMS.length;   // yürüyüş: program sayısı
const ND = HONORS.length;           // dereceler: bölüm/grup sayısı

export default function Page() {
  const [screen, setScreen] = useState(0);
  const [proc, setProc] = useState(0);
  const [honor, setHonor] = useState(0);
  const [blackout, setBlackout] = useState(false);
  const [help, setHelp] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [autoToClosing, setAutoToClosing] = useState(false); // geri sayım kapanınca Kapanış'a geç
  const lastNav = useRef(0);

  const stateRef = useRef({ screen, proc, honor, help, countdown });
  stateRef.current = { screen, proc, honor, help, countdown };

  const next = useCallback(() => {
    const s = stateRef.current;
    if (s.help) { setHelp(false); return; }
    if (s.screen === 0) setScreen(1);
    else if (s.screen === 1) { if (s.proc < N - 1) setProc(s.proc + 1); else { setHonor(0); setScreen(2); } }
    else if (s.screen === 2) { if (s.honor < ND - 1) setHonor(s.honor + 1); else { setAutoToClosing(true); setCountdown(true); } } // Dereceler bitti → kep atma geri sayımı, sonra Kapanış

    else if (s.screen === 3) setScreen(4);
  }, []);

  const prev = useCallback(() => {
    const s = stateRef.current;
    if (s.help) { setHelp(false); return; }
    if (s.screen === 1) { if (s.proc > 0) setProc(s.proc - 1); else setScreen(0); }
    else if (s.screen === 2) { if (s.honor > 0) setHonor(s.honor - 1); else { setProc(Math.max(0, N - 1)); setScreen(1); } }
    else if (s.screen === 3) { setHonor(Math.max(0, ND - 1)); setScreen(2); }
    else if (s.screen === 4) setScreen(3);
  }, []);

  const jump = useCallback((n) => {
    if (n === 1) setProc(0);
    if (n === 2) setHonor(0);
    setScreen(n);
  }, []);

  const navNext = useCallback(() => { const t = performance.now(); if (t - lastNav.current < 220) return; lastNav.current = t; next(); }, [next]);
  const navPrev = useCallback(() => { const t = performance.now(); if (t - lastNav.current < 220) return; lastNav.current = t; prev(); }, [prev]);

  function toggleFs() {
    const d = document, el = d.documentElement;
    if (!d.fullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); }
    else { (d.exitFullscreen || d.webkitExitFullscreen || (() => {})).call(d); }
  }

  useEffect(() => {
    let wl = null;
    const reqWake = () => { if (navigator.wakeLock) navigator.wakeLock.request("screen").then((l) => { wl = l; }).catch(() => {}); };
    reqWake();
    const onVis = () => { if (document.visibilityState === "visible") reqWake(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); if (wl) wl.release?.(); };
  }, []);

  useEffect(() => {
    function onKey(e) {
      const k = e.key;
      if (stateRef.current.countdown) return; // geri sayım açıkken tuşları CountdownScreen yönetir
      if (k === "c" || k === "C") { e.preventDefault(); setCountdown(true); return; }
      if (k === "ArrowRight" || k === " " || k === "PageDown" || k === "Enter") { e.preventDefault(); navNext(); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); navPrev(); }
      else if (k.length === 1 && k >= "1" && k <= "5") { jump(parseInt(k, 10) - 1); }
      else if (k === "Home") jump(0);
      else if (k === "End") jump(4);
      else if (k === "f" || k === "F") toggleFs();
      else if (k === "b" || k === "B") setBlackout((v) => !v);
      else if (k === "h" || k === "H" || k === "?") setHelp((v) => !v);
      else if (k === "Escape") setHelp(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navNext, navPrev, jump]);

  // adres sonundaki #dereceler / #kutlama gibi etiketle doğrudan ekran aç (prova için)
  useEffect(() => {
    function applyHash() {
      const h = (window.location.hash || "").replace("#", "").toLowerCase();
      if (!h) return;
      if (h.startsWith("yuruyus")) jump(1);
      else if (h.startsWith("dereceler")) {
        const m = h.match(/(\d+)/);
        setHonor(m ? Math.max(0, Math.min(ND - 1, parseInt(m[1], 10))) : 0);
        setScreen(2);
      }
      else if (h.startsWith("kapanis")) jump(3);
      else if (h.startsWith("kutlama") || h.startsWith("party")) jump(4);
      else if (h.startsWith("acilis") || h.startsWith("intro")) jump(0);
      else if (["1", "2", "3", "4", "5"].includes(h)) jump(parseInt(h, 10) - 1);
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [jump]);

  function onStageClick(e) {
    const t = e.target;
    if (stateRef.current.countdown) return; // tıklamayı CountdownScreen yönetir
    if (t.closest(".nav-arrow") || t.closest(".help-box") || t.closest(".player-area")) return;
    if (stateRef.current.help) { setHelp(false); return; }
    navNext();
  }

  function renderScreen() {
    switch (screen) {
      case 0: return <IntroScreen key="intro" />;
      case 1: return <ProcessionScreen key="proc" program={ACTIVE_PROGRAMS[proc]} index={proc} total={N} />;
      case 2: return <HonorsScreen key="honors" group={HONORS[honor]} index={honor} total={ND} />;
      case 3: return <ClosingScreen key="closing" />;
      case 4: return <PartyScreen key="party" />;
      default: return null;
    }
  }

  return (
    <main onClick={onStageClick}>
      <Ambient />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-logo" src="/assets/logo-corner.png" alt="Manisa Celal Bayar Üniversitesi — Teknik Bilimler MYO" />

      <AnimatePresence>{renderScreen()}</AnimatePresence>


      <div className="nav-arrow prev" title="Geri (←)" onClick={(e) => { e.stopPropagation(); navPrev(); }}>‹</div>
      <div className="nav-arrow next" title="İleri (→)" onClick={(e) => { e.stopPropagation(); navNext(); }}>›</div>

      {screen === 0 && (
        <div className="hint">
          <kbd>→</kbd> İleri &nbsp; <kbd>←</kbd> Geri &nbsp; <kbd>C</kbd> Geri Sayım + Şarkı &nbsp; <kbd>F</kbd> Tam Ekran &nbsp; <kbd>H</kbd> Yardım
        </div>
      )}

      {countdown && (
        <CountdownScreen
          from={10}
          onClose={() => { setCountdown(false); if (autoToClosing) { setAutoToClosing(false); setScreen(3); } }}
        />
      )}

      {blackout && <div className="blackout" />}

      {help && (
        <div className="help" onClick={() => setHelp(false)}>
          <div className="help-box" onClick={(e) => e.stopPropagation()}>
            <h2>Sunum Kontrolleri</h2>
            <table>
              <tbody>
                <tr><td><kbd>→</kbd> / <kbd>Boşluk</kbd> / tıklama</td><td>İleri</td></tr>
                <tr><td><kbd>←</kbd></td><td>Geri</td></tr>
                <tr><td><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> <kbd>5</kbd></td><td>Açılış / Yürüyüş / Dereceler / Kapanış / Kutlama</td></tr>
                <tr><td>Dereceler bitince</td><td>Geri sayım + kep atma şarkısı (We Are the Champions) <b>otomatik</b> açılır; kapanınca "Yolunuz Açık Olsun"a geçer</td></tr>
                <tr><td><kbd>C</kbd></td><td>Geri sayımı elle başlat (yedek)</td></tr>
                <tr><td><kbd>M</kbd></td><td>Geri sayım sırasında şarkıyı sustur / aç</td></tr>
                <tr><td><kbd>F</kbd></td><td>Tam ekran aç/kapat</td></tr>
                <tr><td><kbd>B</kbd></td><td>Ekranı karart</td></tr>
                <tr><td><kbd>H</kbd> / <kbd>?</kbd></td><td>Bu yardımı aç/kapat</td></tr>
              </tbody>
            </table>
            <div className="help-foot">Kapatmak için herhangi bir yere tıkla veya <kbd>Esc</kbd>.</div>
          </div>
        </div>
      )}
    </main>
  );
}
