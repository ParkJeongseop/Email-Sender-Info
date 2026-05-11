(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ROW_SELECTOR = 'div[data-test-id="message-list-item"]';
  const ICON_CLASS = ESI.ICON_CLASS || "esi-icon";

  const BARE_EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;

  function findSenderTitleEl(row) {
    const candidates = row.querySelectorAll("[title]");
    for (const el of candidates) {
      if (BARE_EMAIL_RE.test(el.title)) return el;
    }
    return null;
  }

  function processRow(row) {
    const senderEl = findSenderTitleEl(row);
    if (!senderEl) return;

    const email = senderEl.title;
    const existing = row.querySelector("." + ICON_CLASS);
    if (existing && row.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    senderEl.parentNode.insertBefore(icon, senderEl);
    row.dataset.esiEmail = email;
  }

  function processAll() {
    document.querySelectorAll(ROW_SELECTOR).forEach(processRow);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      processAll();
    });
  }

  function init() {
    processAll();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
