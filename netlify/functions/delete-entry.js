import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("guestbook", { consistency: "strong" });
  const { id, password } = await req.json();

  // Security check against your Netlify Environment Variable
  if (password !== process.env.ADMIN_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  const entries = await store.get("entries", { type: "json" }) || [];
  
  // Filter out the entry with the matching ID
  const updated = entries.filter(entry => entry.id !== id);

  await store.setJSON("entries", updated);
  return new Response(JSON.stringify({ success: true }));
};
