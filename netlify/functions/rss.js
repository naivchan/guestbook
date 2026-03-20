import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("guestbook", { consistency: "strong" });
  const allEntries = await store.get("entries", { type: "json" }) || [];
  
  // Sort by newest first
  const sortedEntries = allEntries.sort((a, b) => b.id - a.id);

  // Take only the latest 20 entries for the feed
  const feedEntries = sortedEntries.slice(0, 20);

  const itemsXml = feedEntries.map(e => `
    <item>
      <title>New message from ${e.name}</title>
      <link>https://gb.pomnavi.net/#entry-${e.id}</link>
      <description><![CDATA[${e.message}]]></description>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
      <guid isPermaLink="false">guestbook-${e.id}</guid>
    </item>`).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>pomnavi Guestbook</title>
  <link>https://gb.pomnavi.net/</link>
  <description>Latest entries from the pomnavi.net guestbook</description>
  <language>en-us</language>
  <atom:link href="https://pomnavi.net/.netlify/functions/rss" rel="self" type="application/rss+xml" />
  ${itemsXml}
</channel>
</rss>`;

  return new Response(rssXml, {
    headers: { 
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=600" // Cache for 10 minutes
    }
  });
};
