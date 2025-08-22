import { Fetch } from "@/utils/Fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "https://www.bestfashionllc.com";

export async function GET() {
  // Fetch products data
  const productResponse = await Fetch("products");

  if (!productResponse?.data) {
    console.error("Products data not found");
    return new Response("Error fetching products data", { status: 500 });
  }

  // Generating the XML sitemap
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${productResponse.data
          .map(({ category, slug }) => {
            return `
            <url>
                <loc>${BASE_URL}/${category.slug}/${slug}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
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
