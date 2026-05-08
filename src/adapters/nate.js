(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ROW_SELECTOR = "ol.list_body > li";
  const SENDER_LINK_SELECTOR = "a.name";
  const ICON_CLASS = ESI.ICON_CLASS || "esi-icon";

  function extractEmail(source) {
    if (!source) return null;
    // Format: "Display Name" <local@domain>
    const match = source.match(/<([^<>]+@[^<>]+)>/);
    if (!match) return null;
    const email = match[1].trim();
    return email.indexOf("@") !== -1 ? email : null;
  }

  function processRow(row) {
    const link = row.querySelector(SENDER_LINK_SELECTOR);
    if (!link) return;

    const email = extractEmail(link.title);
    if (!email) return;

    const existing = row.querySelector("." + ICON_CLASS);
    if (existing && row.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    link.insertBefore(icon, link.firstChild);
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
