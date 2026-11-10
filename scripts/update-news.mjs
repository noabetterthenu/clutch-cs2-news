import { mkdir, writeFile } from "node:fs/promises";

const RSS_URL = "https://www.hltv.org/rss/news";
const OUTPUT = "data/news.json";

function clean(value = "") {
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
const match = xml.match(new RegExp(<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>, "i"));
return match ? clean(match[1]) : "";
}

const response = await fetch(RSS_URL, {
headers: { "User-Agent": "CLUTCH-CS2-News/1.0" }
});

if (!response.ok) {
throw new Error(HLTV RSS error: ${response.status});
}

const xml = await response.text();
const entries = [...xml.matchAll(/<item(?:\s[^>])?>([\s\S]?)</item>/gi)];

const items = entries.slice(0, 30).map(([_, entry]) => ({
title: getTag(entry, "title"),
summary: getTag(entry, "description"),
url: getTag(entry, "link"),
date: getTag(entry, "pubDate"),
source: "HLTV",
tag: "CS2 NEWS"
})).filter(item => item.title && item.url);

await mkdir("data", { recursive: true });
await writeFile(
OUTPUT,
JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2)
);

console.log(Updated ${items.length} news items);
