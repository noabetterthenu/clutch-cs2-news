import { mkdir, writeFile } from "node:fs/promises";

const url = "https://www.hltv.org/rss/news";

const response = await fetch(url);

if (!response.ok) {
  throw new Error("HLTV error: " + response.status);
}

const xml = await response.text();

function getText(block, tag) {
  const start = block.indexOf("<" + tag + ">");
  const end = block.indexOf("</" + tag + ">");
  if (start === -1 || end === -1) return "";
  return block.slice(start + tag.length + 2, end)
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

const entries = xml.split("<item>").slice(1);
const items = [];

for (const entry of entries.slice(0, 30)) {
  const title = getText(entry, "title");
  const link = getText(entry, "link");
  const description = getText(entry, "description");

  if (title && link) {
    items.push({
      title: title,
      url: link,
      summary: description,
      source: "HLTV",
      tag: "CS2 NEWS"
    });
  }
}

await mkdir("data", { recursive: true });

await writeFile(
  "data/news.json",
  JSON.stringify({
    updatedAt: new Date().toISOString(),
    items: items
  }, null, 2)
);

console.log("News updated:", items.length);
