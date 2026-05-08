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
      "</svg>",
    // United States of America — USA.gov portal logo from Wikimedia Commons
    // (public domain, US Government work).
    // https://commons.wikimedia.org/wiki/File:USAgov_logo.svg
    US:
      '<svg viewBox="0 0 160.5 160.2" aria-hidden="true">' +
      '<g transform="translate(-7.8 -64.6)">' +
      '<ellipse cx="88" cy="144.7" rx="79.3" ry="79.1" fill="#0f385a"/>' +
      '<path fill="#fff" d="m58.8 116.3-3 19.4s-.7 6 3 9.2c3.4 2.7 9.4 1.7 9.4 1.7s4-.7 5.5-3c1.5-2.4.4 2.8.4 2.8h8.6l4.8-30.1h-8.8l-2.6 16.9s-1.7 5.8-5.9 6.2c-4.3.4-5.3-1.4-5.6-3.9-.2-2.4 2.5-19.2 2.5-19.2z"/>' +
      '<path fill="#23c1e0" d="M49.8 94.6V118l-9.2-9.1zM116.2 153.7l6 28.7h6.3l15.2-28.8h-5.5l-11.9 22-3.8-21.8z"/>' +
      '<path fill="#fff" d="m58.8 103.4-24-.1 5.8 5.6-6.8 9.9z"/>' +
      '<path fill="#22bfde" d="M352.5 333.5a65.2 65.2 0 0 0-61.3 42.4c-13 31.8 0 64 28.9 72 29 8 63-11.2 75.9-43 13-31.7-2.1-62.4-26-69.3-4-1-13.2-2-17.5-2.1zM348 353c16.9-.7 24.1 8.2 26.2 11.1 4.4 6.1 9.1 27.5-1.9 45.5-11 17.9-36.6 23-52 14.6-15.3-8.4-15.4-33.4-4.4-51.3a39.6 39.6 0 0 1 32.1-20z" transform="matrix(.26458 0 0 .26458 7.8 64.6)"/>' +
      '<path fill="#23c1e0" d="M217 334.5c-16 .4-28.9 9.2-40.3 21.4-20.5 24.7-23.9 57-3.4 78.6 19.2 18 46.5 16.7 69-1a59.8 59.8 0 0 1-10.5 30c-14.3 12.7-26.1 14.5-39.5 11.9a89.6 89.6 0 0 1-27.2-11.9l-11.4 16.2s16.2 13.7 38 14.2c21.6.5 26.9 1.3 44.8-10a69.4 69.4 0 0 0 25.2-33.4l16.8-114.6-17.5-.2-3 17.2a49.6 49.6 0 0 0-37.7-18.4H217zm3.3 16.4c6.8-.2 15.5 4.2 20.5 8 14.1 10.9 13 37.5 0 54.5S203 433.8 189 423c-14.1-10.9-13.2-37-.1-54 7.8-10.3 20-17.9 31.4-18.1z" transform="matrix(.26458 0 0 .26458 7.8 64.6)"/>' +
      '<path fill="#fff" d="M469 193.5c-24.4 0-55 5.6-63.1 56.8-9 56.4 26.4 61 45.5 61 19.2 0 34.2-15.7 34.2-15.7l-.6 11.1h33.2l17.1-112h-29.5l-4 14.9s-.5-15.2-25.5-16l-7.4-.1zm1.1 26a26.4 33.3 23.2 0 1 8.3 1.2 26.4 33.3 23.2 0 1 13.1 39.9 26.4 33.3 23.2 0 1-36.7 22.4 26.4 33.3 23.2 0 1-13.1-40 26.4 33.3 23.2 0 1 28.4-23.5z" transform="matrix(.26458 0 0 .26458 7.8 64.6)"/>' +
      '<path fill="#fff" d="m108.2 124.8 5.7-3.7s-2.2-3.8-6.6-5.3c-4.5-1.4-9.3 0-12 1.8a9.7 9.7 0 0 0-4.2 8.2c.1 3.2 1.1 5.7 5.6 7.6 4.4 1.8 7.4 2.8 7 4.6-.5 1.7-2 2.1-5.2 2-3-.2-5.6-4.2-5.6-4.2l-6.3 4.2s2.7 3.8 5.8 5.7c3.2 1.9 9 1.6 13.5-.6 4.4-2.2 5.5-5.6 5.8-7.2.3-1.7 0-4.3-1.6-6-1.7-1.6-4.4-2.6-6.6-3.4-2.2-.9-5-2.2-4.6-4.3.4-2 2.3-3 4.4-2.7 2.2.3 4.9 3.3 4.9 3.3z"/>' +
      '</g>' +
      "</svg>"
  };

  // Returns ISO 3166-1 alpha-2 country code if the domain is a government one,
  // otherwise null. Country-specific rules below; ordering matters when one
  // pattern is a suffix of another (e.g. .mil.kr must match before .mil).
  ESI.getGovernmentCountry = function (domain) {
    if (!domain) return null;
    // Republic of Korea (대한민국)
    if (domain === "korea.kr"
      || domain.endsWith(".go.kr")
      || domain.endsWith(".mil.kr")) {
      return "KR";
    }
    // United States of America
    // .gov: federal/state/local/tribal/territorial (GSA-restricted)
    // .mil: Department of Defense (DoD-restricted)
    // .fed.us: legacy federal pattern; state.XX.us: legacy state pattern
    if (domain.endsWith(".gov")
      || domain.endsWith(".mil")
      || domain.endsWith(".fed.us")
      || /(?:^|\.)state\.[a-z]{2}\.us$/.test(domain)) {
      return "US";
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
