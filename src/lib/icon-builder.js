window.ESI = window.ESI || {};

(function () {
  const ESI = window.ESI;

  ESI.ICON_CLASS = "esi-icon";

  const PERSON_SVG_BADGE =
    '<svg viewBox="0 0 16 16" aria-hidden="true">' +
    '<circle cx="8" cy="5.5" r="3" fill="currentColor"/>' +
    '<path d="M2 14.5c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="currentColor"/>' +
    "</svg>";

  ESI.getDomain = function (email) {
    const at = email.lastIndexOf("@");
    if (at === -1) return null;
    return email.slice(at + 1).toLowerCase().trim();
  };

  ESI.faviconUrl = function (domain) {
    return (
      "https://www.google.com/s2/favicons?domain=" +
      encodeURIComponent(domain) +
      "&sz=32"
    );
  };

  ESI.buildIcon = function (email) {
    const domain = ESI.getDomain(email);
    if (!domain) return null;

    const wrapper = document.createElement("span");
    wrapper.className = ESI.ICON_CLASS;
    wrapper.title = email;

    const img = document.createElement("img");
    img.className = "esi-icon__img";
    img.src = ESI.faviconUrl(domain);
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
      wrapper.classList.add("esi-icon--personal");
      const badge = document.createElement("span");
      badge.className = "esi-icon__personal-badge";
      badge.innerHTML = PERSON_SVG_BADGE;
      wrapper.appendChild(badge);
    } else {
      wrapper.classList.add("esi-icon--favicon");
    }

    return wrapper;
  };
})();
