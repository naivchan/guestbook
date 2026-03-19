import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("guestbook", { consistency: "strong" });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { name, message } = await req.json();
  const entries = await store.get("entries", { type: "json" }) || [];
  
  const updated = [{ name, message, date: new Date() }, ...entries];
  await store.setJSON("entries", updated);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
