/** Accessible dialog lifecycle and keyboard controls shared across public modules. */
let modalTrigger = null;
const showDialogContent = openModal;
const hideDialogContent = closeModal;
openModal = html => {
  modalTrigger = document.activeElement;
  showDialogContent(html);
  const box = $("#modal .box");
  box.tabIndex = -1;
  const title = box.querySelector("h2,h3");
  if (title) { title.id = "dialog-title"; box.setAttribute("aria-labelledby", title.id); }
  (box.querySelector("input:not([type=hidden]),select,textarea,button:not(.x)") || box).focus();
};
closeModal = () => { hideDialogContent(); if (modalTrigger?.isConnected) modalTrigger.focus(); };
A.closeModal = closeModal;
document.addEventListener("click", e => { if (e.target === $("#modal")) closeModal(); });
document.addEventListener("keydown", e => {
  const modal = $("#modal");
  if (!modal.hidden && e.key === "Tab") {
    const items = $$("button:not([disabled]),a[href],input:not([type=hidden]),select,textarea,[tabindex='0']", modal).filter(el => !el.hidden && el.getClientRects().length);
    if (!items.length) return;
    if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0].focus(); }
  }
  const tab = e.target.closest('[role="tab"][data-act="mtab"]');
  if (!tab || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
  const tabs = $$('[role="tab"]', tab.closest('[role="tablist"]'));
  const index = tabs.indexOf(tab), next = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  e.preventDefault(); tabs[next].click(); tabs[next].focus();
});
