import { Fetch } from "@/utils/Fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "https://www.bestfashionllc.com";

export async function GET() {
  try {
    // Fetch products data
    const productResponse = await Fetch("products");

    if (!productResponse?.data) {
      console.error("Products data not found");
      return new Response(
        "<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'></urlset>",
        { headers: { "Content-Type": "application/xml" } }
      );
    }

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${productResponse.data
            .map(({ category, slug, updated_at }) => {
              return `
              <url>
                  <loc>${BASE_URL}/${category.slug}/${slug}</loc>
                  <lastmod>${updated_at ? new Date(updated_at).toISOString() : new Date().toISOString()}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.9</priority>
              </url>`;
            })
            .join("")}
      </urlset>`;

    return new Response(sitemapXML, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating products sitemap:", error);
    return new Response("<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'></urlset>", {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
