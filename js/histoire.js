/* KACM — page Histoire : palmarès filtrable */
(function () {
  "use strict";
  const { $ } = KACM;
  const T = [
    [1958, "league", "Championnat du Maroc", "Le premier championnat national du Kawkab."],
    [1963, "cup", "Coupe du Trône", "KACM 3–2 Hassania Agadir"],
    [1964, "cup", "Coupe du Trône", "KACM 3–2 Wydad Casablanca"],
    [1965, "cup", "Coupe du Trône", "KACM 3–1 Raja Casablanca"],
    [1987, "cup", "Coupe du Trône", "KACM 4–0 Renaissance de Berkane"],
    [1991, "cup", "Coupe du Trône", "KACM 2–1 KAC Kénitra"],
    [1992, "league", "Championnat du Maroc", "Un deuxième championnat, trente-quatre ans après le premier."],
    [1993, "cup", "Coupe du Trône", "KACM 1–0 Maghreb de Fès"],
    [1996, "africa", "Coupe de la CAF", "Étoile du Sahel · aller 1–3 / retour 2–0 (3–3, buts à l'extérieur)"]
  ];
  let f = "all";
  function render() {
    $("#hisTitles").innerHTML = T.filter(x => f === "all" || x[1] === f).map(([y, , c, d]) => `<article class="his-t"><b>${y}</b><h3>${c}</h3><p>${d}</p></article>`).join("");
    document.querySelectorAll("#hisChips button").forEach(b => b.setAttribute("aria-selected", b.dataset.f === f));
  }
  document.addEventListener("click", e => { const b = e.target.closest("#hisChips button"); if (b) { f = b.dataset.f; render(); } });
  render();
  KACM.applyLang();
})();
