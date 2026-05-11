// Isolated-world content script for iCloud Mail.
//
// Receives (name, email) pairs from the MAIN-world interceptor via
// `esi-icloud-data` events, prefetches a favicon data URL for each unique
// email via the background service worker, and injects an icon next to the
// matching DOM element. Injection waits until the data URL is ready, so
// React-driven row re-renders don't show an empty wrapper while a fetch is
// in flight.

(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ICON_CLASS = ESI.ICON_CLASS || "esi-icon";
  const EVENT_NAME = "esi-icloud-data";

  // Sender display name → email (most recent value wins).
  const nameToEmail = new Map();
  // email → string (data URL) | null (fetch failed) | undefined (not yet tried)
  const emailToDataUrl = new Map();

  function prefetchFavicon(email) {
    if (emailToDataUrl.has(email)) return;
    const at = email.lastIndexOf("@");
    if (at === -1) return;
    const domain = email.slice(at + 1).toLowerCase().trim();
    // Mark as pending so we only ask once.
    emailToDataUrl.set(email, undefined);

    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
      emailToDataUrl.set(email, null);
      return;
    }
    chrome.runtime.sendMessage(
      { type: "esi-fetch-favicon", domain },
      function (response) {
        if (response && response.ok && response.dataUrl) {
          emailToDataUrl.set(email, response.dataUrl);
        } else {
          emailToDataUrl.set(email, null);
        }
        schedule();
      }
    );
  }

  function ingest(detail) {
    if (!detail || !Array.isArray(detail.pairs)) return;
    for (const { name, email } of detail.pairs) {
      if (!name || !email) continue;
      nameToEmail.set(name, email);
      prefetchFavicon(email);
    }
  }

  function injectIcon(container, email, anchor) {
    const dataUrlState = emailToDataUrl.get(email);
    // Skip until the prefetch finishes — null means we tried and failed, in
    // which case we still render with the letter fallback path.
    if (dataUrlState === undefined) return;

    const existing = container.querySelector("." + ICON_CLASS);
    if (existing && container.dataset.esiEmail === email) return;
    if (existing) existing.remove();

    const options = dataUrlState
      ? { dataUrl: dataUrlState }
      : { useDataUrl: true };
    const icon = ESI.buildIcon(email, options);
    if (!icon) return;

    if (anchor) {
      anchor.parentNode.insertBefore(icon, anchor);
    } else {
      container.insertBefore(icon, container.firstChild);
    }
    container.dataset.esiEmail = email;
  }

  // List view: each thread row has the sender display name in
  // `span.thread-participants`.
  function processListRow(row) {
    const nameEl = row.querySelector("span.thread-participants");
    if (!nameEl) return;
    const name = nameEl.textContent.trim();
    if (!name) return;
    const email = nameToEmail.get(name);
    if (!email) return;
    injectIcon(row, email, nameEl);
  }

  // Detail view: each address shows as a contact-token whose inner span
  // (`.ic-x1z554`) holds the display name.
  function processContactToken(token) {
    const nameEl = token.querySelector(".ic-x1z554");
    if (!nameEl) return;
    const name = nameEl.textContent.trim();
    if (!name) return;
    const email = nameToEmail.get(name);
    if (!email) return;
    injectIcon(token, email, null);
  }

  function processAll() {
    document.querySelectorAll("div.thread-list-item").forEach(processListRow);
    document.querySelectorAll(".contact-token").forEach(processContactToken);
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

  window.addEventListener(EVENT_NAME, function (e) {
    ingest(e.detail);
    schedule();
  });

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
