// Ekranlar arası sinematik geçişler — her bölüm farklı karakterde.
// Reduced-motion: page.jsx'te <MotionConfig reducedMotion="user"> ile Framer otomatik sadeleştirir.

// Genel (yedek) geçiş
export const screenVariants = {
  initial: { opacity: 0, scale: 1.04, filter: "blur(12px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeInOut" } },
  exit:    { opacity: 0, scale: 0.985, filter: "blur(12px)", transition: { duration: 0.6, ease: "easeInOut" } },
};

// Açılış — görkemli, hafif zoom-out + blur açılışı
export const introVariants = {
  initial: { opacity: 0, scale: 1.08, filter: "blur(16px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.95, ease: [0.2, 0.7, 0.2, 1] } },
  exit:    { opacity: 0, scale: 1.02, filter: "blur(10px)", transition: { duration: 0.5, ease: "easeInOut" } },
};

// Yürüyüş — yatay sinematik kayma (film kesmesi hissi)
export const processionVariants = {
  initial: { opacity: 0, x: "5%", filter: "blur(10px)" },
  animate: { opacity: 1, x: "0%", filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, x: "-4%", filter: "blur(8px)", transition: { duration: 0.5, ease: "easeInOut" } },
};

// Dereceler — derinlikten yukarı yükselme
export const honorsVariants = {
  initial: { opacity: 0, y: "4%", scale: 1.03, filter: "blur(10px)" },
  animate: { opacity: 1, y: "0%", scale: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
  exit:    { opacity: 0, y: "-2%", scale: 0.99, filter: "blur(8px)", transition: { duration: 0.5, ease: "easeInOut" } },
};

// Kapanış — yavaş, yukarı süzülen yumuşak fade (duygusal)
export const closingVariants = {
  initial: { opacity: 0, y: "3%", filter: "blur(14px)" },
  animate: { opacity: 1, y: "0%", filter: "blur(0px)", transition: { duration: 1.1, ease: "easeInOut" } },
  exit:    { opacity: 0, y: "-2%", filter: "blur(10px)", transition: { duration: 0.6, ease: "easeInOut" } },
};

// Kutlama — enerjik pop
export const partyVariants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.2, 1.25, 0.4, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.4, ease: "easeInOut" } },
};

export function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
