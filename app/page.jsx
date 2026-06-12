"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { ACTIVE_PROGRAMS, HONORS, MUSIC, SPEAKERS } from "@/lib/data";
import { preloadAnthem } from "@/lib/anthem";
import { playScreenMusic, stopScreenMusic } from "@/lib/screenMusic";
import Ambient from "@/components/Ambient";
import IntroScreen from "@/components/IntroScreen";
import ProcessionScreen from "@/components/ProcessionScreen";
import SaygiScreen from "@/components/SaygiScreen";
import KonusmaScreen from "@/components/KonusmaScreen";
import HonorsScreen from "@/components/HonorsScreen";
import TsoScreen from "@/components/TsoScreen";
import TakdimScreen from "@/components/TakdimScreen";
import ClosingScreen from "@/components/ClosingScreen";
import PartyScreen from "@/components/PartyScreen";
import CountdownScreen from "@/components/CountdownScreen";
import ControlBar from "@/components/ControlBar";
import PreflightScreen from "@/components/PreflightScreen";
import AgendaOverlay from "@/components/AgendaOverlay";

const N = ACTIVE_PROGRAMS.length;   // yürüyüş: program sayısı
const ND = HONORS.length;           // dereceler: bölüm/grup sayısı

// Bir grupta kaç slayt var: her derece ayrı slayt (3. → 2. → 1.) + en son hepsi
// bir arada (podyum) slaytı. Beraberlikler (aynı rütbe) tek slaytta birlikte gelir.
// Boş grup tek slayt (placeholder podyum).
function honorStepsOf(group) {
  if (!group || !group.honors || group.honors.length === 0) return 1;
  return new Set(group.honors.map((h) => h.rank)).size + 1;
}

export default function Page() {
  const [screen, setScreen] = useState(0);
  const [proc, setProc] = useState(0);
  const [honor, setHonor] = useState(0);
  const [honorStep, setHonorStep] = useState(1); // aktif bölümde kaç derece açıldı (elle reveal)
  const [takdimIdx, setTakdimIdx] = useState(0); // Mezunlarımızın Takdimi: aktif program
  const [blackout, setBlackout] = useState(false);
  const [help, setHelp] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [autoToClosing, setAutoToClosing] = useState(false); // geri sayım kapanınca Kapanış'a geç
  const [preflight, setPreflight] = useState(false);
  const [agenda, setAgenda] = useState(false);
  const [controls, setControls] = useState(false); // operatör kontrol çubuğu (O ile aç/kapat)
  const [anthemSrc, setAnthemSrc] = useState(null);   // prova ekranından seçilen şarkı (blob URL)
  const [anthemName, setAnthemName] = useState("");
  const lastNav = useRef(0);

  const stateRef = useRef({ screen, proc, honor, honorStep, takdimIdx, help, countdown, preflight, agenda });
  stateRef.current = { screen, proc, honor, honorStep, takdimIdx, help, countdown, preflight, agenda };

  const next = useCallback(() => {
    const s = stateRef.current;
    if (s.help) { setHelp(false); return; }
    if (s.screen === 0) setScreen(1);
    else if (s.screen === 1) { if (s.proc < N - 1) setProc(s.proc + 1); else { setHonor(0); setHonorStep(1); setScreen(2); } }
    else if (s.screen === 2) {
      // Önce bölümün dereceleri tek tek açılır (3. → 2. → 1.), sonra sonraki bölüme geçilir.
      const steps = honorStepsOf(HONORS[s.honor]);
      if (s.honorStep < steps) setHonorStep(s.honorStep + 1);
      else if (s.honor < ND - 1) { setHonor(s.honor + 1); setHonorStep(1); }
      else { setTakdimIdx(0); setScreen(3); } // Dereceler bitti → Mezunlarımızın Takdimi
    }
    else if (s.screen === 3) {
      // Takdim: program program ilerler; son programdan sonra kep atma geri sayımı → Kapanış.
      if (s.takdimIdx < N - 1) setTakdimIdx(s.takdimIdx + 1);
      else { setAutoToClosing(true); setCountdown(true); }
    }
    else if (s.screen === 4) setScreen(5);
  }, []);

  const prev = useCallback(() => {
    const s = stateRef.current;
    if (s.help) { setHelp(false); return; }
    if (s.screen === 1) { if (s.proc > 0) setProc(s.proc - 1); else setScreen(0); }
    else if (s.screen === 2) {
      if (s.honorStep > 1) setHonorStep(s.honorStep - 1);
      else if (s.honor > 0) { const pi = s.honor - 1; setHonor(pi); setHonorStep(honorStepsOf(HONORS[pi])); }
      else { setProc(Math.max(0, N - 1)); setScreen(1); }
    }
    else if (s.screen === 3) {
      if (s.takdimIdx > 0) setTakdimIdx(s.takdimIdx - 1);
      else { const li = Math.max(0, ND - 1); setHonor(li); setHonorStep(honorStepsOf(HONORS[li])); setScreen(2); }
    }
    else if (s.screen === 4) { setTakdimIdx(Math.max(0, N - 1)); setScreen(3); }
    else if (s.screen === 5) setScreen(4);
  }, []);

  const jump = useCallback((n) => {
    if (n === 1) setProc(0);
    if (n === 2) { setHonor(0); setHonorStep(1); }
    if (n === 3) setTakdimIdx(0);
    setScreen(n);
  }, []);

  const jumpProc = useCallback((i) => { setProc(Math.max(0, Math.min(N - 1, i))); setScreen(1); }, []);
  const jumpHonor = useCallback((i) => { setHonor(Math.max(0, Math.min(ND - 1, i))); setHonorStep(1); setScreen(2); }, []);
  const jumpTakdim = useCallback((i) => { setTakdimIdx(Math.max(0, Math.min(N - 1, i))); setScreen(3); }, []);

  const navNext = useCallback(() => { const t = performance.now(); if (t - lastNav.current < 220) return; lastNav.current = t; next(); }, [next]);
  const navPrev = useCallback(() => { const t = performance.now(); if (t - lastNav.current < 220) return; lastNav.current = t; prev(); }, [prev]);

  function toggleFs() {
    const d = document, el = d.documentElement;
    if (!d.fullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); }
    else { (d.exitFullscreen || d.webkitExitFullscreen || (() => {})).call(d); }
  }

  // kazara sekme kapatma/yenileme koruması (tören sırasında)
  useEffect(() => {
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ""; return ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // Ekran müziği: Geçit'te genel giriş müziği, Dereceler'de belge takdimi müziği,
  // Takdim'de (temsili diploma) özel parça. Geri sayım açıkken sus (marşla çakışmasın).
  // ŞİMDİLİK: Takdim müziği yalnızca Dijital Dönüşüm programında çalsın, diğerlerinde sus.
  useEffect(() => {
    let id = null;
    if (!countdown) {
      if (screen === 1) id = ACTIVE_PROGRAMS[proc]?.music || MUSIC.procession?.youtubeId;
      else if (screen === 2) id = MUSIC.honors?.youtubeId;
      else if (screen === 3 && ACTIVE_PROGRAMS[takdimIdx]?.slug === "dijital-donusum-elektronigi") id = MUSIC.takdim?.youtubeId;
    }
    if (id) playScreenMusic(id); else stopScreenMusic();
  }, [screen, proc, takdimIdx, countdown]);

  // Geri sayım şarkısını önceden hazırla: oynatıcıyı kur + videoyu tampona al (cue),
  // böylece geri sayım açılınca şarkı beklemeden (anında) başlar.
  useEffect(() => {
    const id = setTimeout(() => preloadAnthem(MUSIC.anthem?.youtubeId, MUSIC.anthem?.file), 250);
    return () => clearTimeout(id);
  }, []);

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
      const s = stateRef.current;
      // geri sayım / prova / akış açıkken tuşları o overlay yönetir
      if (s.countdown || s.preflight || s.agenda) return;
      if (k === "c" || k === "C") { e.preventDefault(); setCountdown(true); return; }
      if (k === "p" || k === "P") { e.preventDefault(); setPreflight(true); return; }
      if (k === "g" || k === "G") { e.preventDefault(); setAgenda(true); return; }
      if (k === "ArrowRight" || k === " " || k === "PageDown" || k === "Enter") { e.preventDefault(); navNext(); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); navPrev(); }
      else if (k.length === 1 && k >= "1" && k <= "6") { jump(parseInt(k, 10) - 1); }
      else if (k === "Home") jump(0);
      else if (k === "End") jump(5);
      else if (k === "o" || k === "O") setControls((v) => !v);
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
        setHonorStep(1);
        setScreen(2);
      }
      else if (h.startsWith("takdim") || h.startsWith("mezun")) jump(3);
      else if (h.startsWith("kapanis")) jump(4);
      else if (h.startsWith("kutlama") || h.startsWith("party")) jump(5);
      else if (h.startsWith("acilis") || h.startsWith("intro")) jump(0);
      else if (h.startsWith("kontrol") || h.startsWith("prova")) setPreflight(true);
      else if (["1", "2", "3", "4", "5", "6"].includes(h)) jump(parseInt(h, 10) - 1);
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [jump]);

  function onStageClick(e) {
    const t = e.target;
    const s = stateRef.current;
    if (s.countdown || s.preflight || s.agenda) return; // tıklamayı ilgili overlay yönetir
    if (t.closest(".nav-arrow") || t.closest(".help-box") || t.closest(".player-area") || t.closest(".control-bar")) return;
    if (s.help) { setHelp(false); return; }
    navNext();
  }

  function renderScreen() {
    switch (screen) {
      case 0: return <IntroScreen key="intro" />;
      case 1: return <ProcessionScreen key="proc" program={ACTIVE_PROGRAMS[proc]} index={proc} total={N} />;
      case 2: return <HonorsScreen key="honors" group={HONORS[honor]} index={honor} total={ND} revealStep={honorStep} />;
      case 3: return <TakdimScreen key="takdim" program={ACTIVE_PROGRAMS[takdimIdx]} index={takdimIdx} total={N} />;
      case 4: return <ClosingScreen key="closing" />;
      case 5: return <PartyScreen key="party" />;
      default: return null;
    }
  }

  return (
    <main onClick={onStageClick}>
      <Ambient />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-logo" src="/assets/logo-corner.png" alt="Manisa Celal Bayar Üniversitesi — Teknik Bilimler MYO" />

      <MotionConfig reducedMotion="user">
        <AnimatePresence>{renderScreen()}</AnimatePresence>
      </MotionConfig>


      <div className="nav-arrow prev" title="Geri (←)" onClick={(e) => { e.stopPropagation(); navPrev(); }}>‹</div>
      <div className="nav-arrow next" title="İleri (→)" onClick={(e) => { e.stopPropagation(); navNext(); }}>›</div>

      {screen === 0 && (
        <div className="hint">
          <kbd>→</kbd> İleri &nbsp; <kbd>←</kbd> Geri &nbsp; <kbd>C</kbd> Geri Sayım &nbsp; <kbd>O</kbd> Kontrol Çubuğu &nbsp; <kbd>G</kbd> Akış &nbsp; <kbd>P</kbd> Prova &nbsp; <kbd>H</kbd> Yardım
        </div>
      )}

      {countdown && (
        <CountdownScreen
          from={10}
          fileOverride={anthemSrc}
          onClose={() => { setCountdown(false); if (autoToClosing) { setAutoToClosing(false); setScreen(4); } }}
        />
      )}

      <ControlBar
        visible={controls}
        onPrev={navPrev}
        onNext={navNext}
        onCountdown={() => setCountdown(true)}
        onAgenda={() => setAgenda(true)}
        onPreflight={() => setPreflight(true)}
        onBlackout={() => setBlackout((v) => !v)}
        onFs={toggleFs}
        onHelp={() => setHelp((v) => !v)}
        onHide={() => setControls(false)}
      />

      {preflight && (
        <PreflightScreen
          onClose={() => setPreflight(false)}
          onAnthemFile={(url, name) => { setAnthemSrc(url); setAnthemName(name); }}
          anthemSrc={anthemSrc}
          anthemName={anthemName}
          onFs={toggleFs}
        />
      )}

      {agenda && (
        <AgendaOverlay
          screen={screen}
          proc={proc}
          honor={honor}
          takdim={takdimIdx}
          onClose={() => setAgenda(false)}
          jump={jump}
          jumpProc={jumpProc}
          jumpHonor={jumpHonor}
          jumpTakdim={jumpTakdim}
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
                <tr><td><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> <kbd>5</kbd> <kbd>6</kbd></td><td>Açılış / Yürüyüş / Dereceler / Mezun Takdimi / Kapanış / Kutlama</td></tr>
                <tr><td>Dereceler ekranı</td><td>Her <kbd>→</kbd> sıradaki dereceyi ayrı slaytta gösterir (3. → 2. → 1.), en son hepsi bir arada (podyum); sonra sonraki bölüm</td></tr>
                <tr><td>Mezunlarımızın Takdimi</td><td>Bölüm bölüm mezun adları gösterilir, özel şarkı çalar; her <kbd>→</kbd> sonraki program</td></tr>
                <tr><td>Takdim bitince</td><td>Geri sayım + kep atma şarkısı (We Are the Champions) <b>otomatik</b> açılır; kapanınca "Yolunuz Açık Olsun"a geçer</td></tr>
                <tr><td><kbd>C</kbd></td><td>Geri sayımı elle başlat (yedek)</td></tr>
                <tr><td><kbd>M</kbd></td><td>Geri sayım sırasında şarkıyı sustur / aç</td></tr>
                <tr><td><kbd>O</kbd></td><td>Operatör kontrol çubuğunu aç / kapat (varsayılan gizli)</td></tr>
                <tr><td><kbd>G</kbd></td><td>Tören akışı — bölüme/programa atla</td></tr>
                <tr><td><kbd>P</kbd></td><td>Prova / ön-kontrol (foto, müzik, internet)</td></tr>
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
