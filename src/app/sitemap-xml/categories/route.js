import { Fetch } from "@/utils/Fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "https://www.bestfashionllc.com";

export async function GET() {
  try {
    // Fetch categories data
    const categoryResponse = await Fetch("categories");

    if (!categoryResponse?.data) {
      console.error("Categories data not found");
      return new Response("<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'></urlset>", {
        headers: { "Content-Type": "application/xml" },
      });
    }

    // Generate XML sitemap
    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${categoryResponse.data
            .map(({ slug, updated_at }) => {
              return `
              <url>
                  <loc>${BASE_URL}/category/${slug}</loc>
                  <lastmod>${updated_at ? new Date(updated_at).toISOString() : new Date().toISOString()}</lastmod>
                  <changefreq>weekly</changefreq>
                  <priority>0.8</priority>
              </url>`;
            })
            .join("")}
      </urlset>`;

    return new Response(sitemapXML, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating categories sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
