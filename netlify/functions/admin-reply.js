import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("guestbook", { consistency: "strong" });
  const { id, reply, password } = await req.json();

  // Check if the password matches the one you set in Netlify
  if (password !== process.env.ADMIN_PASSWORD) {
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
  return new Response(JSON.stringify({ success: true }));
};
