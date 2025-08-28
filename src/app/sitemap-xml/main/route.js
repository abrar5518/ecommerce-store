export async function GET() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "https://www.bestfashionllc.com";

  // Static pages with custom SEO values
  const pages = [
    {
      name: "Home",
      path: "/",
      changefreq: "daily",
      priority: "1.0",
      lastmod: "2025-03-01", // manually set
    },
    {
      name: "Shop",
      path: "/shop",
      changefreq: "daily",
      priority: "0.9",
      lastmod: "2025-03-10",
    },
    {
      name: "All Categories",
      path: "/all-categories",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: "2025-03-20",
    },
  ];

  // Generate the XML
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(({ path, lastmod, changefreq, priority }) => {
            return `
            <url>
                <loc>${BASE_URL}${path}</loc>
                <lastmod>${new Date(lastmod).toISOString()}</lastmod>
                <changefreq>${changefreq}</changefreq>
                <priority>${priority}</priority>
            </url>
            `;
          })
          .join("")}
    </urlset>`;

  // Return XML
  return new Response(sitemapXML, {
    headers: { "Content-Type": "application/xml" },
  });
}
