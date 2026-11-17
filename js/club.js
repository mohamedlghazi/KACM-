/* KACM — page Club : Mot du président + Mission & Vision (club.html#president | #mission) */
(function () {
  "use strict";
  const { $, esc, t } = KACM;

  /* Contenu institutionnel. DRAFT = true : affiche la mention « texte provisoire ». À remplacer par les textes validés par le club. */
  const DRAFT = true;
  const PRESIDENT = {
    name: "Driss Hanifa",
    role: "Président du KACM (section football)",
    photo: "assets/club/president.jpg",
    intro: [
      "Élu à l'unanimité le 9 juillet 2023 pour un mandat de quatre ans, Driss Hanifa préside la section football du Kawkab Athletic Club de Marrakech. Il dirigeait auparavant le comité provisoire du club (2022-2023), saison de la montée en Botola Pro D2. Voici ses propos et annonces, tels que rapportés par la presse."
    ],
    pillars: [
      ["Retrouver l'élite · juillet 2023", "Après son élection, il indique à la MAP que le nouveau bureau vise la montée en Botola Pro D1 dès la saison suivante."],
      ["Former les jeunes · juillet 2023", "Il insiste sur le projet de formation : le centre de formation doit devenir un modèle national et une source de jeunes talents de Marrakech. Il attribue les difficultés financières du club au coût élevé des recrutements."],
      ["Le retour à El Harti · septembre 2025", "À l'assemblée générale du 6 septembre 2025, il annonce le retour du Kawkab dans son stade historique, El Harti, les grandes affiches (Raja, Wydad, FAR) restant programmées au Grand Stade, et la nomination de la maire de Marrakech, Fatima Zahra Mansouri, comme présidente d'honneur."]
    ],
    outro: [
      "À l'assemblée générale de juillet 2023, 29 adhérents sur 38 étaient présents. Pour la période de septembre 2022 au 30 juin 2023, les revenus du club dépassaient 11,1 millions de DH, pour environ 11 millions de dépenses."
    ],
    src: "Sources : Hespress et Elbotola (10-11 juillet 2023, déclarations à la MAP) ; Marrakech Post et Kech24 (assemblée générale du 6 septembre 2025)."
  };
  const MISSION = {
    slogan: "« Dima Kawkab » — L'esprit du KACM",
    lead: "Le KACM est bien plus qu'un club de football : il est le reflet d'une identité, d'une culture et d'une passion enracinées dans Marrakech. « Dima Kawkab », toujours Kawkab : un engagement à faire du football un vecteur d'émotions, d'ambition et de dépassement de soi.",
    values: [["Passion", "Le football est un mode de vie. Joueurs, supporters et dirigeants partagent le même amour des couleurs du club."], ["Engagement", "L'effort, la discipline et la persévérance, sur le terrain comme en dehors. Chaque match est une occasion de donner le meilleur."], ["Respect", "Envers les adversaires, les supporters et la ville : intégrité et fair-play au cœur de notre identité."], ["Solidarité", "Un club est une famille. La cohésion et l'esprit d'équipe nous permettent d'atteindre nos objectifs."]],
    visionLead: "Bâtir un modèle durable de réussite sportive et humaine : une institution solide, tournée vers la formation et ancrée dans sa communauté.",
    vision: [["Institution solide", "Développer une organisation reconnue pour son professionnalisme et son exigence sportive."], ["Formation des talents", "Former des joueurs marocains capables de renforcer l'avenir du football national."], ["Engagement communautaire", "Agir auprès des habitants de Marrakech par des initiatives sociales et sportives."], ["Rayonnement de Marrakech", "Porter haut les couleurs de la Ville Rouge et du Maroc."]],
    missionLead: "Promouvoir un football de qualité, ambitieux et ouvert à tous, en offrant une expérience unique aux joueurs, aux supporters et à la communauté.",
    mission: [["Unir", "Rassembler les habitants de Marrakech et les passionnés de football autour d'un projet commun."], ["Inspirer", "Encourager la jeunesse à rêver grand et à viser l'excellence à travers le sport."], ["Performer", "Atteindre les sommets du football national avec une culture de la gagne et du dépassement."]],
    closing: "Chaque action du club — sur le terrain comme en dehors — renforce ce triptyque : unir, inspirer et performer, au service de Marrakech."
  };
  let view = location.hash === "#mission" ? "mission" : "president";
  const note = () => (DRAFT ? `<p class="cl-draft">${t("cl.draft")}</p>` : "");

  const tabs = () => `<nav class="cl-tabs" role="tablist" aria-label="Le club">${[["president", "cl.tab1"], ["mission", "cl.tab2"]].map(([k, key]) => `<a role="tab" href="club.html#${k}" aria-selected="${view === k}">${t(key)}</a>`).join("")}</nav>`;
  function renderPresident() {
    const P = PRESIDENT;
    return `<section class="cl-pres2"><div class="wrap cl-bar2">${tabs()}</div><div class="cl-bg" role="img" aria-label="${esc(P.name)}" style="background-image:url('${esc(P.photo)}')"></div>
      <div class="wrap"><article class="cl-text"><p class="eyebrow light"><span>${t("cl.k1")}</span></p><h2>${t("cl.t1")}</h2>
        ${P.intro.map(p => `<p>${esc(p)}</p>`).join("")}
        
        <div class="cl-pillars">${P.pillars.map(([h, d], i) => `<div><b>0${i + 1}</b><h3>${esc(h)}</h3><p>${esc(d)}</p></div>`).join("")}</div>
        ${P.outro.map(p => `<p>${esc(p)}</p>`).join("")}
        <p class="cl-sign"><strong>${esc(P.name)}</strong><span>${esc(P.role)}</span></p><p class="cl-draft">${esc(P.src)}</p></article></div></section>`;
  }

  function renderMission() {
    const M = MISSION, card = ([h, d], i) => `<div class="cl-card"><b>${String(i + 1).padStart(2, "0")}</b><h3>${esc(h)}</h3><p>${esc(d)}</p></div>`;
    return `<section class="cl-hero"><div class="wrap cl-bar2">${tabs()}</div><div class="wrap"><p class="eyebrow light"><span>${t("cl.k2")}</span></p><h2>${esc(M.slogan)}</h2><p>${esc(M.lead)}</p></div></section>
      <section class="sec"><div class="wrap"><header class="cl-h"><span>1</span><h3>${t("cl.values")}</h3></header><div class="cl-grid4">${M.values.map(card).join("")}</div></div></section>
      <section class="sec sec-beige"><div class="wrap"><header class="cl-h"><span>2</span><h3>${t("cl.vision")}</h3></header><p class="cl-lead">${esc(M.visionLead)}</p><div class="cl-grid4">${M.vision.map(card).join("")}</div></div></section>
      <section class="cl-mission"><div class="wrap"><header class="cl-h light"><span>3</span><h3>${t("cl.mission")}</h3></header><p class="cl-lead">${esc(M.missionLead)}</p>
        <div class="cl-grid3">${M.mission.map(([h, d]) => `<div class="cl-big"><h3>${esc(h)}</h3><p>${esc(d)}</p></div>`).join("")}</div><p class="cl-close">${esc(M.closing)}</p>${note()}</div></section>`;
  }
  function route() {
    view = location.hash === "#mission" ? "mission" : "president";
    $("#clBody").innerHTML = view === "president" ? renderPresident() : renderMission();
    document.title = (view === "president" ? t("cl.tab1") : t("cl.tab2")) + " — KACM";
  }
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });
  KACM.onLang(route);
  KACM.applyLang();
})();
