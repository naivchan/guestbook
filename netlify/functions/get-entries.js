import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("guestbook", { consistency: "strong" });
  const allEntries = await store.get("entries", { type: "json" }) || [];
  
  // 1. Sort entries: Newest first (assuming entries have a 'date' property)
  allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 2. Pagination Logic
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 25; // Number of entries per page
  
  const totalPages = Math.ceil(allEntries.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  const pagedEntries = allEntries.slice(start, end);

  return new Response(JSON.stringify({
    entries: pagedEntries,
    totalPages: totalPages,
    currentPage: page
  }), { 
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
