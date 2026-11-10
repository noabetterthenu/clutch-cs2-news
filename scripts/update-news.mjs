import { mkdir, writeFile } from "node:fs/promises";

const RSS_URL = "https://www.hltv.org/rss/news";
const OUTPUT = "data/news.json";

function decodeEntities(value = "") {
return value
.replace(/<![CDATA[|]]>/g, "")
.replace(/<[^>]*>/g, " ")
.replace(/&/g, "&")
.replace(/"/g, '"')
.replace(/'|'/g, "'")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/\s+/g, " ")
.trim();
}

function getTag(xml, tag) {
const pattern = new RegExp(
"<" + tag + "(?:\s[^>])?>([\s\S]?)</" + tag + ">",
"i"
);
const match = xml.match(pattern);
return match ? decodeEntities(match[1]) : "";
}

const response = await fetch(RSS_URL, {
headers: { "User-Agent": "CLUTCH-CS2-News/1.0" }
});

if (!response.ok) {
throw new Error("HLTV RSS error: " + response.status);
}

const xml = await response.text();
file:///home/runner/work/clutch-cs2-news/clutch-cs2-news/scripts/update-news.mjs:38
xml.matchAll(/<item\b[^>]>([\s\S]?)</item>/gi)
             ^

SyntaxError: Invalid regular expression flags
    at compileSourceTextModule (node:internal/modules/esm/utils:346:16)
    at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:146:18)
    at #translate (node:internal/modules/esm/loader:497:12)
    at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:544:27)
    at async ModuleJob._link (node:internal/modules/esm/module_job:148:19)

Node.js v20.20.2
Error: Process completed with exit code 1.

const items = entries.slice(0, 30).map(function (match) {
const entry = match[1];

return {
title: getTag(entry, "title"),
summary: getTag(entry, "description"),
url: getTag(entry, "link"),
date: getTag(entry, "pubDate"),
source: "HLTV",
tag: "CS2 NEWS"
};
}).filter(function (item) {
return item.title && item.url;
});

await mkdir("data", { recursive: true });

await writeFile(
OUTPUT,
JSON.stringify({
updatedAt: new Date().toISOString(),
items: items
}, null, 2)
);

console.log("Updated " + items.length + " news items");
