  import Script from "next/script";
  
  export default function WebsiteSchema() {
    return (
      <>
  
  {/* Website Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://bestfashionllc.com",
            "name": "Best Fashion LLC",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://bestfashionllc.com/search?query={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      </>
    );  
    }