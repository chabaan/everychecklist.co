// Pulls Articles + Items from published Google Sheet CSVs and writes
// one markdown file per article into src/content/articles/.
// No API key or token needed — both CSVs are public "Publish to web" links.
//
// Env vars required: ARTICLES_CSV_URL, ITEMS_CSV_URL
// Run manually:  npm run sync
// Run automatically before every build:  npm run build

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "src/content/articles");

function parseCSV(text) {
  // Minimal RFC4180 CSV parser (handles quoted fields with commas/newlines)
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.some((v) => v.trim() !== ""))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()])));
}

async function fetchCSV(url, label) {
  if (!url) {
    console.error(`ERROR: ${label} is not set.`);
    process.exit(1);
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`ERROR: failed to fetch ${label} (${res.status})`);
    process.exit(1);
  }
  return parseCSV(await res.text());
}

function slugifyOk(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9-_]/g, "");
}

function yamlEscape(s) {
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

async function main() {
  const articlesUrl = process.env.ARTICLES_CSV_URL || "";
  const itemsUrl = process.env.ITEMS_CSV_URL || "";

  const articles = await fetchCSV(articlesUrl, "ARTICLES_CSV_URL");
  const items = await fetchCSV(itemsUrl, "ITEMS_CSV_URL");

  const itemsBySlug = {};
  for (const row of items) {
    const slug = slugifyOk(row.slug);
    if (!slug) continue;
    (itemsBySlug[slug] ??= []).push(row);
  }
  for (const slug in itemsBySlug) {
    itemsBySlug[slug].sort(
      (a, b) =>
        (Number(a.section_order) || 0) - (Number(b.section_order) || 0) ||
        (Number(a.item_order) || 0) - (Number(b.item_order) || 0)
    );
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // clear previously generated files so removed rows don't linger
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.endsWith(".md")) fs.unlinkSync(path.join(OUT_DIR, f));
  }

  let count = 0;
  for (const a of articles) {
    const slug = slugifyOk(a.slug);
    if (!slug) continue;

    const rows = itemsBySlug[slug] || [];
    const sectionsMap = new Map();
    for (const r of rows) {
      const key = r.section_title.trim();
      if (!sectionsMap.has(key)) sectionsMap.set(key, { order: Number(r.section_order) || 0, items: [] });
      sectionsMap.get(key).items.push(r.item_text.trim());
    }
    const sections = [...sectionsMap.entries()]
      .sort((x, y) => x[1].order - y[1].order)
      .map(([title, v]) => ({ title, items: v.items }));

    const frontmatter = [
      "---",
      `title: ${yamlEscape(a.title)}`,
      `category: ${yamlEscape(a.category)}`,
      `metaDescription: ${yamlEscape(a.meta_description)}`,
      `dek: ${yamlEscape(a.dek)}`,
      `readTime: ${Number(a.read_time) || 5}`,
      `updated: ${yamlEscape(a.updated || "")}`,
      "sections:",
      ...sections.flatMap((s) => [
        `  - title: ${yamlEscape(s.title)}`,
        `    items:`,
        ...s.items.map((it) => `      - ${yamlEscape(it)}`),
      ]),
      "---",
      "",
    ].join("\n");

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), frontmatter, "utf-8");
    count++;
  }

  console.log(`Synced ${count} articles from Google Sheet into src/content/articles/`);
}

main();
