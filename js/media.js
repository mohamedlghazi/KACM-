/* KACM — page Média : carrousel photos (défilement automatique) */
(function () {
  "use strict";
  const { $, esc } = KACM;
  const S = [
    ["assets/reference/season-wydad.webp", "KACM–Wydad"],
    ["assets/reference/season-tanger.webp", "KACM–Ittihad Tanger"],
    ["assets/reference/season-jadida.webp", "KACM–Difaâ El Jadida"],
    ["assets/reference/season-meknes.webp", "CODM–KACM"],
    ["assets/history/history-caf-1996.webp", "Remise de la Coupe de la CAF, 1996"],
    ["assets/history/history-tifo-2012.webp", "Tifo du Kawkab, 2012"],
    ["assets/amical/a-13.jpg", "Match amical : Kawkab face à l’Amal Tiznit"],
    ["assets/amical/a-17.jpg", "Match amical : Kawkab face à l’Amal Tiznit"],
    ["assets/training/training-3.jpg", "Séance d’entraînement"],
    ["assets/training/training-4.jpg", "Séance d’entraînement"],
    ["assets/fans/fans-4.jpg", "Les supporters du Kawkab"],
    ["assets/fans/fans-6.jpg", "Les tribunes du Kawkab"]
  ];
  const root = $("#medSlider");
  let i = 0, timer = null;
  root.innerHTML = `<div class="ms-stage">${S.map(([src, cap], k) => `<figure class="ms-slide" data-k="${k}"><img src="${src}" alt="${esc(cap)}" ${k ? 'loading="lazy"' : ""}><figcaption>${esc(cap)}</figcaption></figure>`).join("")}
    <button type="button" class="ms-b prev" data-ms="-1" aria-label="Photo précédente">‹</button><button type="button" class="ms-b next" data-ms="1" aria-label="Photo suivante">›</button></div>
    <div class="ms-dots" role="tablist" aria-label="Choisir une photo">${S.map((_, k) => `<button type="button" role="tab" data-go="${k}" aria-label="Photo ${k + 1}"></button>`).join("")}</div>`;
  const slides = root.querySelectorAll(".ms-slide"), dots = root.querySelectorAll(".ms-dots button");
  function show(n) {
    i = (n + S.length) % S.length;
    slides.forEach((s, k) => s.classList.toggle("on", k === i));
    dots.forEach((d, k) => d.setAttribute("aria-selected", k === i));
  }
  function play() { stop(); if (matchMedia("(prefers-reduced-motion:reduce)").matches) return; timer = setInterval(() => show(i + 1), 4500); }
  function stop() { clearInterval(timer); }
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-ms]"), g = e.target.closest("[data-go]");
    if (b) show(i + +b.dataset.ms); else if (g) show(+g.dataset.go); else return;
    play();
  });
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", play);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", play);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
  show(0); play();
  KACM.applyLang();
})();
