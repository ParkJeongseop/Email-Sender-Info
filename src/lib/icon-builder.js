window.ESI = window.ESI || {};

(function () {
  const ESI = window.ESI;

  ESI.ICON_CLASS = "esi-icon";

  const PERSON_SVG_BADGE =
    '<svg viewBox="0 0 16 16" aria-hidden="true">' +
    '<circle cx="8" cy="5.5" r="3" fill="currentColor"/>' +
    '<path d="M2 14.5c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="currentColor"/>' +
    "</svg>";

  // Government emblems by ISO 3166-1 alpha-2 country code.
  // Add new countries here alongside a matching rule in getGovernmentCountry below.
  const GOV_EMBLEMS = {
    // Republic of Korea (대한민국) — emblem from Wikimedia Commons (public domain).
    // https://commons.wikimedia.org/wiki/File:Emblem_of_the_Government_of_the_Republic_of_Korea.svg
    KR:
      '<svg viewBox="0 0 173.282 173.282" aria-hidden="true">' +
      '<path fill="#fff" d="M173.282 86.65c0 47.844-38.794 86.632-86.646 86.632C38.799 173.282 0 134.494 0 86.65 0 38.788 38.799 0 86.636 0c47.852 0 86.646 38.788 86.646 86.65"/>' +
      '<path fill="#003764" d="M127.389 80.598c-13.791-9.365-31.439-5.542-40.717 8.533-7.72 11.767-19.405 13.235-23.906 13.235-14.751 0-24.824-10.367-27.818-21.095h-.01c-.039-.108-.059-.2-.09-.307-.025-.12-.056-.233-.089-.366-1.177-4.467-1.467-6.609-1.467-11.368 0-25.65 26.321-54.213 64.215-54.213 38.829 0 61.05 29.545 66.78 45.979-.107-.295-.209-.581-.291-.877-11.015-32.125-41.474-55.216-77.357-55.216-45.13 0-81.729 36.59-81.729 81.739 0 40.351 29.108 74.891 69.479 74.891 32.197 0 53.842-18.052 63.757-42.93 5.45-13.614 1.595-29.605-10.757-38.005"/>' +
      '<path fill="#e4032e" d="M164.788 62.589c-4.777-16.026-27.153-47.571-67.282-47.571-37.894 0-64.214 28.563-64.214 54.212 0 4.759.29 6.901 1.466 11.368-.489-1.951-.74-3.908-.74-5.823 0-26.721 26.741-45.227 54.248-45.227 37.218 0 67.388 30.174 67.388 67.39 0 29.173-16.785 54.437-41.179 66.565v.023c31.455-11.391 53.908-41.512 53.908-76.884 0-8.378-1.127-15.759-3.595-24.053"/>' +
      "</svg>"
  };

  // Returns ISO 3166-1 alpha-2 country code if the domain is a government one,
  // otherwise null. Currently only Republic of Korea is supported; other
  // jurisdictions (e.g. US `.gov`/`.mil`) can be added here.
  ESI.getGovernmentCountry = function (domain) {
    if (!domain) return null;
    // Republic of Korea (대한민국)
    if (domain === "korea.kr"
      || domain.endsWith(".go.kr")
      || domain.endsWith(".mil.kr")) {
      return "KR";
    }
    return null;
  };

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

    const govCountry = ESI.getGovernmentCountry(domain);
    if (govCountry && GOV_EMBLEMS[govCountry]) {
      const cc = govCountry.toLowerCase();
      wrapper.classList.add("esi-icon--gov", "esi-icon--gov-" + cc);
      const badge = document.createElement("span");
      badge.className = "esi-icon__gov-badge esi-icon__gov-badge--" + cc;
      badge.innerHTML = GOV_EMBLEMS[govCountry];
      wrapper.appendChild(badge);
    } else if (ESI.isPersonalDomain && ESI.isPersonalDomain(domain)) {
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
