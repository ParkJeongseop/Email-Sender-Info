// Render icons/icon.svg into PNGs at the sizes Chrome's Web Store and
// chrome.runtime require (16, 48, 128). Uses @resvg/resvg-js so we don't need
// system-level ImageMagick / Inkscape.
//
// Usage:  node scripts/build-icons.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const svg = readFileSync(resolve(root, "icons/icon.svg"), "utf8");

const SIZES = [16, 48, 128];

for (const size of SIZES) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  const png = resvg.render().asPng();
  const out = resolve(root, `icons/icon${size}.png`);
  writeFileSync(out, png);
  console.log(`wrote ${out} (${png.length} bytes)`);
}
