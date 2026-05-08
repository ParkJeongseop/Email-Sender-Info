(function () {
  "use strict";

  const ESI = window.ESI || {};
  const ROW_SELECTOR = "tr.zA";
  const SENDER_SELECTOR = "span[email]";
  const ICON_CLASS = "esi-icon";
  const PERSONAL_CLASS = "esi-icon--personal";
  const FAVICON_CLASS = "esi-icon--favicon";

  const PERSON_SVG_BADGE =
    '<svg viewBox="0 0 16 16" aria-hidden="true">' +
    '<circle cx="8" cy="5.5" r="3" fill="currentColor"/>' +
    '<path d="M2 14.5c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="currentColor"/>' +
    "</svg>";

  function getDomain(email) {
    const at = email.lastIndexOf("@");
    if (at === -1) return null;
    return email.slice(at + 1).toLowerCase().trim();
  }

  function faviconUrl(domain) {
    return (
      "https://www.google.com/s2/favicons?domain=" +
      encodeURIComponent(domain) +
      "&sz=32"
    );
  }

  function buildIcon(email) {
    const domain = getDomain(email);
    if (!domain) return null;

    const wrapper = document.createElement("span");
    wrapper.className = ICON_CLASS;
    wrapper.title = email;

    const img = document.createElement("img");
    img.className = "esi-icon__img";
    img.src = faviconUrl(domain);
    img.alt = domain;
    img.width = 16;
    img.height = 16;
    img.loading = "lazy";
    img.addEventListener("error", function () {
      const letter = document.createElement("span");
      letter.className = "esi-icon__letter";
      letter.textContent = domain.charAt(0).toUpperCase();
      img.replaceWith(letter);
    });
    wrapper.appendChild(img);

    if (ESI.isPersonalDomain && ESI.isPersonalDomain(domain)) {
      wrapper.classList.add(PERSONAL_CLASS);
      const badge = document.createElement("span");
      badge.className = "esi-icon__personal-badge";
      badge.innerHTML = PERSON_SVG_BADGE;
      wrapper.appendChild(badge);
    } else {
      wrapper.classList.add(FAVICON_CLASS);
    }

    return wrapper;
  }

  function pickVisibleSender(row) {
    const candidates = row.querySelectorAll(SENDER_SELECTOR);
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

    const icon = buildIcon(email);
    if (!icon) return;

    // Insert into the sender's TD (.yX) at start — guaranteed visible block.
    const senderTd = senderEl.closest("td.yX") || senderEl.parentElement;
    senderTd.insertBefore(icon, senderTd.firstChild);

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
