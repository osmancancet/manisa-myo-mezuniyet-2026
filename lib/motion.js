// Ekranlar arası sinematik geçiş (blur + scale + opacity)
export const screenVariants = {
  initial: { opacity: 0, scale: 1.04, filter: "blur(12px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeInOut" } },
  exit:    { opacity: 0, scale: 0.985, filter: "blur(12px)", transition: { duration: 0.6, ease: "easeInOut" } },
};

export function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
