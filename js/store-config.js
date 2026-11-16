/* KACM — configuration de la boutique.
   endpoint : URL de l'application web Google Apps Script qui reçoit les commandes (voir docs/boutique-commandes.md).
   Tant qu'elle est vide, la commande est envoyée par e-mail (mailto) au club. */
window.KACM_STORE = {
  endpoint: "",
  email: "clubkacmfoot@gmail.com",
  currency: "DH",
  shipping: 0,
  shippingNote: "Les frais de livraison éventuels sont confirmés par téléphone avant l'envoi.",
  payment: "Paiement à la livraison ou au retrait au stade"
};
