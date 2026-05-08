(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ROW_SELECTOR = "li.mail_item";
  const SENDER_BUTTON_SELECTOR = "button.button_sender";
  const MESSAGE_SELECTOR = ".mail_option_item.sender";
  const DETAIL_BUTTON_SELECTOR = "button.button_user";
  const ICON_CLASS = ESI.ICON_CLASS || "esi-icon";

  function extractEmail(source) {
    if (!source) return null;
    // Mailbox-like: "Name"<local@domain> (list view title)
    //            or Name <local@domain>  (detail view textContent)
    const match = source.match(/<([^<>]+@[^<>]+)>/);
    if (!match) return null;
    const email = match[1].trim();
    return email.indexOf("@") !== -1 ? email : null;
  }

  function processRow(row) {
    const btn = row.querySelector(SENDER_BUTTON_SELECTOR);
    if (!btn) return;

    const email = extractEmail(btn.title);
    if (!email) return;

    const existing = row.querySelector("." + ICON_CLASS);
    if (existing && row.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    btn.parentNode.insertBefore(icon, btn);
    row.dataset.esiEmail = email;
  }

  function processMessage(message) {
    const btn = message.querySelector(DETAIL_BUTTON_SELECTOR);
    if (!btn) return;

    const email = extractEmail(btn.textContent);
    if (!email) return;

    const existing = message.querySelector("." + ICON_CLASS);
    if (existing && message.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const icon = ESI.buildIcon(email);
    if (!icon) return;

    btn.insertBefore(icon, btn.firstChild);
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
