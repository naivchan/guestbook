import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("guestbook", { consistency: "strong" });
  
  // Security check: You can add a simple password check here
  const { id, reply, password } = await req.json();
  if (password !== "YOUR_SECRET_PASSWORD") {
    return new Response("Unauthorized", { status: 401 });
  }

  const entries = await store.get("entries", { type: "json" }) || [];
  const updated = entries.map(entry => {
    if (entry.id === id) {
      return { ...entry, adminReply: reply };
    }
    return entry;
  });

  await store.setJSON("entries", updated);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
