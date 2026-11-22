import { json } from "../../_lib/common.js";
// Country news for the home page. GDELT DOC 2.0 first, Google News RSS as fallback (both free, no key).
// Returns {fetched, articles:[{title,url,domain,seendate}], stale, source}. Cached 1 h (fresh) / 24 h (stale fallback).
const TOPIC = {
  all: "", conflict: "(war OR conflict OR attack OR military)", food: "(famine OR hunger OR \"food security\")",
  health: "(outbreak OR epidemic OR cholera OR ebola OR health)", geopolitics: "(sanctions OR tariff OR trade OR diplomacy)", business: "(economy OR investment OR business)",
};
const GN = { all: "", conflict: " war OR conflict", food: " food security OR famine", health: " outbreak OR health", geopolitics: " sanctions OR trade OR diplomacy", business: " economy OR investment OR business" };
const ts = (d) => (isNaN(d) ? "" : d.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z"));
async function gdelt(country, topic) {
  const q = `"${country}"${TOPIC[topic] ? " " + TOPIC[topic] : ""} sourcelang:english`;
  const r = await fetch("https://api.gdeltproject.org/api/v2/doc/doc?mode=artlist&format=json&maxrecords=20&sort=datedesc&timespan=24h&query=" + encodeURIComponent(q), { headers: { "user-agent": "WMM-www/1.0 (73036396@naver.com)" } });
  const t = await r.text();
  if (!r.ok || !t.trim().startsWith("{")) throw new Error("gdelt");
  return (JSON.parse(t).articles || []).map((a) => ({ title: a.title, url: a.url, domain: a.domain, seendate: a.seendate }));
}
async function gnews(country, topic) {
  const q = `"${country}"${GN[topic] || ""} when:1d`;
  const r = await fetch("https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US:en&q=" + encodeURIComponent(q), { headers: { "user-agent": "Mozilla/5.0 (WMM-www)" } });
  if (!r.ok) throw new Error("gnews");
  const x = await r.text();
  const pick = (s, t) => { const m = s.match(new RegExp("<" + t + "[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</" + t + ">")); return m ? m[1].trim() : ""; };
  const un = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return (x.match(/<item>[\s\S]*?<\/item>/g) || []).slice(0, 20).map((it) => {
    const src = it.match(/<source url="([^"]+)">([^<]*)<\/source>/);
    let title = un(pick(it, "title")); if (src && title.endsWith(" - " + un(src[2]))) title = title.slice(0, -(src[2].length + 3));
    let domain = ""; try { domain = new URL(src ? src[1] : pick(it, "link")).hostname.replace(/^www\./, ""); } catch {}
    return { title, url: un(pick(it, "link")), domain, seendate: ts(new Date(pick(it, "pubDate"))) };
  });
}
export const onRequestGet = async ({ request, waitUntil }) => {
  const q = new URL(request.url).searchParams;
  const country = (q.get("country") || "").replace(/[^\p{L}\p{N} .'-]/gu, "").slice(0, 60);
  const topic = q.get("topic") || "all";
  if (!country || !(topic in TOPIC)) return json({ error: "invalid_filter" }, 400);
  const cache = caches.default, ck = new Request("https://cache.wmm/news2?" + encodeURIComponent(country + "|" + topic));
  const hit = await cache.match(ck);
  let old = null;
  if (hit) { old = await hit.json(); if (Date.now() - old.fetched < 3600e3) return json({ ...old, stale: false, cached: true }); }
  for (const [name, fn] of [["gdelt", gdelt], ["googlenews", gnews]]) {
    try {
      const articles = await fn(country, topic);
      if (!articles.length && name === "gdelt") continue;
      const out = { fetched: Date.now(), stale: false, source: name, articles };
      const put = cache.put(ck, new Response(JSON.stringify(out), { headers: { "cache-control": "max-age=86400" } }));
      if (waitUntil) waitUntil(put); else await put;
      return json(out);
    } catch {}
  }
  if (old) return json({ ...old, stale: true });
  return json({ error: "provider_unavailable" }, 502);
};
