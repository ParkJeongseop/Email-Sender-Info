(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ROW_SELECTOR = 'div[data-test-id="message-list-item"]';
  const MESSAGE_HEADER_SELECTOR = '[data-test-id="message-header"]';
  const ICON_CLASS = ESI.ICON_CLASS || "esi-icon";

  const BARE_EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;
  // Yahoo embeds the sender's email in the alphatar avatar's src as
  // `.../endpoints/smtp:EMAIL/photo`.
  const ALPHATAR_EMAIL_RE = /endpoints\/smtp:([^/]+@[^/]+)\//;

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

  function processMessageHeader(header) {
    // Yahoo renders the alphatar avatar with a `data-test-id="alphatar-button"`
    // wrapper for system senders but omits it for contacts. Match the img by
    // its src signature instead so both cases work.
    const img = header.querySelector('img[src*="endpoints/smtp:"]');
    if (!img) return;
    const match = (img.getAttribute("src") || "").match(ALPHATAR_EMAIL_RE);
    if (!match) return;
    let email;
    try {
      email = decodeURIComponent(match[1]);
    } catch (e) {
      email = match[1];
    }
    if (!BARE_EMAIL_RE.test(email)) return;

    const existing = header.querySelector("." + ICON_CLASS);
    if (existing && header.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    // The sender-name button is a flex container, so inserting the icon as
    // its first child keeps the icon inline with the name. If the button is
    // missing for some reason, fall back to sitting next to the alphatar img.
    const button = header.querySelector('[data-test-id="with-contact-card-anchor"]');
    if (button) {
      button.insertBefore(icon, button.firstChild);
    } else {
      img.parentNode.insertBefore(icon, img);
    }
    header.dataset.esiEmail = email;
  }

  function processAll() {
    document.querySelectorAll(ROW_SELECTOR).forEach(processRow);
    document.querySelectorAll(MESSAGE_HEADER_SELECTOR).forEach(processMessageHeader);
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
