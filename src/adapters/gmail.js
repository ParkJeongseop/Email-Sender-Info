(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ROW_SELECTOR = "tr.zA";
  const MESSAGE_SELECTOR = ".gE";
  const SENDER_SELECTOR = "span[email]";
  const ICON_CLASS = ESI.ICON_CLASS || "esi-icon";

  function pickVisibleSender(container) {
    const candidates = container.querySelectorAll(SENDER_SELECTOR);
    for (const el of candidates) {
      const cs = getComputedStyle(el);
      if (cs.display !== "none" && cs.visibility !== "hidden") {
        const email = el.getAttribute("email");
        if (email && email.indexOf("@") !== -1) return el;
      }
    }
    return null;
  }

  function processRow(row) {
    const senderEl = pickVisibleSender(row);
    if (!senderEl) return;

    const email = senderEl.getAttribute("email");
    const existing = row.querySelector("." + ICON_CLASS);
    if (existing && row.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    const senderTd = senderEl.closest("td.yX") || senderEl.parentElement;
    senderTd.insertBefore(icon, senderTd.firstChild);
    row.dataset.esiEmail = email;
  }

  function processMessage(message) {
    const senderEl = pickVisibleSender(message);
    if (!senderEl) return;

    const email = senderEl.getAttribute("email");
    const existing = message.querySelector("." + ICON_CLASS);
    if (existing && message.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    senderEl.parentNode.insertBefore(icon, senderEl);
    message.dataset.esiEmail = email;
  }

  function processAll() {
    document.querySelectorAll(ROW_SELECTOR).forEach(processRow);
    document.querySelectorAll(MESSAGE_SELECTOR).forEach(processMessage);
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
