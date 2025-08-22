import { Fetch } from "@/utils/Fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "https://www.bestfashionllc.com";

export async function GET() {
  // Fetch categories data
  const categoryResponse = await Fetch("categories");

  if (!categoryResponse?.data) {
    console.error("Categories data not found");
    return new Response("Error fetching categories data", { status: 500 });
  }

  // Generating the XML sitemap
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${categoryResponse.data
          .map(({ slug }) => {
            return `
            <url>
                <loc>${BASE_URL}/${slug}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.7</priority>
            </url>
            `;
          })
          .join("")}
    </urlset>`;

  // Return raw XML sitemap
  return new Response(sitemapXML, {
    headers: { "Content-Type": "application/xml" },
  });
}
