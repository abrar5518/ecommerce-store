export async function GET() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || "https://www.bestfashionllc.com";

  // Pages list with path and name 
  const pages = [
    { name: "Home", path: "/" },
    { name: "shop", path: "/shop" },
    { name: "All Categories", path: "/all-categories" },
  ];

  // Generate the XML content
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(({ path }) => {
            return `
            <url>
                <loc>${BASE_URL}${path}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>
            `;
          })
          .join("")}
    </urlset>`;

  // Return the XML with correct Content-Type header
  return new Response(sitemapXML, {
    headers: { "Content-Type": "application/xml" },
  });
}
