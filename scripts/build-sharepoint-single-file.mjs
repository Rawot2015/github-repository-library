import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const indexPath = path.join(outDir, "index.html");
const basePathFile = path.join(root, "sharepoint-path.txt");
const targetPath = path.join(outDir, "RepoShelf.html");

if (!fs.existsSync(indexPath)) {
  throw new Error("out/index.html was not found. Run npm run build first.");
}

const basePath = fs.existsSync(basePathFile)
  ? fs.readFileSync(basePathFile, "utf8").trim().replace(/\\/+$/, "")
  : "";

function assetPath(url) {
  const clean = new URL(url, "https://sharepoint.invalid").pathname;
  let relative = clean;

  if (basePath && relative.startsWith(basePath + "/")) {
    relative = relative.slice(basePath.length);
  }

  relative = relative.replace(/^\/+/, "");
  return path.join(outDir, decodeURIComponent(relative));
}

function readAsset(url, kind) {
  const file = assetPath(url);
  if (!fs.existsSync(file)) {
    throw new Error(`Cannot inline ${kind}: ${url} -> ${file}`);
  }
  return fs.readFileSync(file, "utf8");
}

let html = fs.readFileSync(indexPath, "utf8");

// SharePoint's HTML viewer blocks external stylesheets/scripts/fonts in its srcdoc CSP.
// Inline the generated CSS and JavaScript so RepoShelf is self-contained.
html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
  const match = tag.match(/\bhref=["']([^"']+)["']/i);
  if (!match) return tag;
  let css = readAsset(match[1], "stylesheet");
  // Remove generated Google/Geist font declarations because SharePoint blocks
  // external font URLs. The app falls back to the system font stack below.
  css = css.replace(/@font-face\s*\{[^}]*\}/gi, "");
  css = css.replace(/var\(--font-geist-sans\)/g, 'Inter, "Segoe UI", Arial, sans-serif');
  css = css.replace(/var\(--font-geist-mono\)/g, '"Cascadia Mono", Consolas, monospace');
  return `<style data-reposhelf-inline="css">\n${css}\n</style>`;
});

html = html.replace(/<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi, (_tag, before, src, after) => {
  const js = readAsset(src, "script");
  return `<script${before}${after}>\n${js}\n</script>`;
});

// These are unnecessary in a single-file deployment and may trigger CSP fetches.
html = html.replace(/<link\b[^>]*rel=["'](?:preload|modulepreload|icon|shortcut icon)["'][^>]*>/gi, "");
html = html.replace(/<link\b[^>]*href=["'][^"']*favicon[^"']*["'][^>]*>/gi, "");

// Make the document self-contained even if Next emitted an absolute base URL.
html = html.replace(/<base\b[^>]*>/gi, "");

fs.writeFileSync(targetPath, html, "utf8");
console.log(`Created ${targetPath} (${fs.statSync(targetPath).size} bytes)`);
