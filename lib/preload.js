// Görsel ön yükleme havuzu (procession ve honors paylaşır)
const cache = {};

export function preload(url, cb) {
  if (typeof window === "undefined") return;
  let e = cache[url];
  if (e) {
    if (e.status === "ok" && cb) cb(url);
    else if (e.status === "loading" && cb) e.cbs.push(cb);
    return;
  }
  e = cache[url] = { status: "loading", cbs: cb ? [cb] : [] };
  const img = new window.Image();
  img.onload = () => { e.status = "ok"; e.cbs.forEach((f) => f(url)); e.cbs = []; };
  img.onerror = () => { e.status = "err"; e.cbs = []; };
  img.src = url;
}

export function isOk(url) {
  return cache[url] && cache[url].status === "ok";
}
