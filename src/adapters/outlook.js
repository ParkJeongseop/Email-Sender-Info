(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ROW_SELECTOR = 'div[role="option"]';
  // Live Person Card hover targets — Outlook applies this class to every
  // sender / recipient mention in the detail view header.
  const PERSON_CARD_SELECTOR = '[class*="lpcCommonWeb-hoverTarget"]';
  const ICON_CLASS = ESI.ICON_CLASS || "esi-icon";

  const BARE_EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;
  const ANY_EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;

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

  function extractCardEmail(card) {
    // Recipients have aria-label = bare email
    const aria = card.getAttribute("aria-label") || "";
    let m = aria.match(ANY_EMAIL_RE);
    if (m) return m[0];
    // Sender has textContent = "Name<email@domain>"
    const text = card.textContent || "";
    m = text.match(/<([^<>]+@[^<>]+)>/);
    if (m) return m[1].trim();
    m = text.match(ANY_EMAIL_RE);
    return m ? m[0] : null;
  }

  function processCard(card) {
    // Skip cards that live inside list rows — the row processor handles those.
    if (card.closest(ROW_SELECTOR)) return;

    const email = extractCardEmail(card);
    if (!email) return;

    const existing = card.querySelector("." + ICON_CLASS);
    if (existing && card.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    card.insertBefore(icon, card.firstChild);
    card.dataset.esiEmail = email;
  }

  function processAll() {
    document.querySelectorAll(ROW_SELECTOR).forEach(processRow);
    document.querySelectorAll(PERSON_CARD_SELECTOR).forEach(processCard);
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
