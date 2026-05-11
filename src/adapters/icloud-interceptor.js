// MAIN-world interceptor for iCloud Mail.
//
// iCloud renders sender/recipient *names* in the DOM but keeps the actual email
// addresses out of the visible tree (it only puts them in a print-only DIV that
// is `display: none`, and even that lives in a cross-origin sandbox iframe).
// So the DOM-only strategy used by other adapters cannot reach the data.
//
// Instead this script runs in the page's MAIN world before any of iCloud's own
// scripts, wraps `fetch` and `XMLHttpRequest`, and watches for the two mail-API
// endpoints that carry sender/recipient identity:
//
//   - mailws2/v1/thread/search   (list view: threadList[].senders)
//   - mailws2/v1/message/get     (detail view: longHeader's From/To/Cc)
//
// Extracted (name, email) pairs are dispatched as a CustomEvent on `window`,
// which the isolated-world content script (icloud.js) picks up to inject the
// favicon next to the matching DOM element by name.

(function () {
  "use strict";

  const ENDPOINTS = [
    "/mailws2/v1/thread/search",
    "/mailws2/v1/message/get"
  ];
  const EVENT_NAME = "esi-icloud-data";

  function matchesEndpoint(url) {
    if (!url || typeof url !== "string") return false;
    return ENDPOINTS.some(ep => url.indexOf(ep) !== -1);
  }

  // Parse "Display Name" <user@host> or bare user@host.
  function parseAddress(raw) {
    if (!raw) return null;
    const m = raw.match(/<([^<>]+@[^<>]+)>/);
    if (m) {
      const email = m[1].trim();
      let name = raw.slice(0, raw.indexOf("<")).trim();
      if (name.startsWith('"') && name.endsWith('"')) {
        name = name.slice(1, -1).trim();
      }
      return { name: name || email, email };
    }
    const bare = raw.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (bare) return { name: bare[0], email: bare[0] };
    return null;
  }

  function extractFromHeader(longHeader, fieldName) {
    if (!longHeader) return [];
    // RFC 822: header field can span multiple folded lines.
    const re = new RegExp("^" + fieldName + ":\\s*([^\\r\\n]+(?:\\r\\n[ \\t][^\\r\\n]+)*)", "im");
    const m = longHeader.match(re);
    if (!m) return [];
    // Split on commas at the top level (mailbox-list).
    const value = m[1].replace(/\r\n[ \t]+/g, " ");
    const parts = value.split(/,(?![^<]*>)/);
    return parts.map(parseAddress).filter(Boolean);
  }

  function dispatchPairs(pairs, role) {
    if (!pairs || pairs.length === 0) return;
    const detail = { role, pairs };
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
  }

  function handleResponseText(url, text) {
    if (!text) return;
    let data;
    try { data = JSON.parse(text); } catch (e) { return; }

    if (Array.isArray(data.threadList)) {
      const pairs = [];
      for (const t of data.threadList) {
        if (!Array.isArray(t.senders)) continue;
        for (const s of t.senders) {
          const p = parseAddress(s);
          if (p) pairs.push(p);
        }
      }
      dispatchPairs(pairs, "list");
    }

    if (typeof data.longHeader === "string") {
      const from = extractFromHeader(data.longHeader, "From");
      const to = extractFromHeader(data.longHeader, "To");
      const cc = extractFromHeader(data.longHeader, "Cc");
      dispatchPairs([...from, ...to, ...cc], "detail");
    }
  }

  // ---- Wrap fetch ----
  const origFetch = window.fetch;
  window.fetch = function (input, init) {
    const promise = origFetch.apply(this, arguments);
    try {
      const url = typeof input === "string" ? input : (input && input.url) || "";
      if (matchesEndpoint(url)) {
        promise.then(response => {
          try {
            response.clone().text().then(text => handleResponseText(url, text)).catch(() => {});
          } catch (e) {}
        }, () => {});
      }
    } catch (e) {}
    return promise;
  };

  // ---- Wrap XHR ----
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__esiUrl = url;
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    const url = this.__esiUrl;
    if (matchesEndpoint(url)) {
      this.addEventListener("load", function () {
        try { handleResponseText(url, this.responseText); } catch (e) {}
      });
    }
    return origSend.apply(this, arguments);
  };
})();
