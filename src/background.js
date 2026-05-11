// Background service worker.
//
// Some mail providers (notably iCloud) serve their inbox under a strict
// Content-Security-Policy that blocks third-party images. Fetching the favicon
// from `www.google.com/s2/favicons` directly inside the page is rejected.
//
// The extension itself is not bound by the page's CSP, so this worker fetches
// favicons on behalf of content scripts and returns them as data URLs (which
// every CSP allows). Results are cached in memory per domain.

const FAVICON_BASE = "https://www.google.com/s2/favicons";

// domain -> { ok: bool, dataUrl?: string, error?: string }
const cache = new Map();

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
}

async function fetchFavicon(domain) {
  if (cache.has(domain)) return cache.get(domain);

  const url = FAVICON_BASE + "?domain=" + encodeURIComponent(domain) + "&sz=32";
  let result;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("HTTP " + response.status);
    const blob = await response.blob();
    const dataUrl = await blobToDataUrl(blob);
    result = { ok: true, dataUrl };
  } catch (e) {
    result = { ok: false, error: String(e && e.message || e) };
  }
  cache.set(domain, result);
  return result;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "esi-fetch-favicon" && typeof msg.domain === "string") {
    fetchFavicon(msg.domain).then(sendResponse);
    return true; // keep the message channel open for async sendResponse
  }
});
