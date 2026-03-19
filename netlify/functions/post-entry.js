import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("guestbook", { consistency: "strong" });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const { name, message, websiteName, websiteUrl } = await req.json();
  const entries = await store.get("entries", { type: "json" }) || [];
  
  const newEntry = { 
    id: Date.now(), // Added an ID so you can target specific posts for replies
    name, 
    message, 
    websiteName: websiteName || null,
    websiteUrl: websiteUrl || null,
    adminReply: null, // Starts empty
    date: new Date() 
  };
  
  const updated = [newEntry, ...entries];
  await store.setJSON("entries", updated);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
