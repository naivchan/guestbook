import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("guestbook", { consistency: "strong" });
  const entries = await store.get("entries", { type: "json" }) || [];
  return new Response(JSON.stringify(entries), { status: 200 });
};
