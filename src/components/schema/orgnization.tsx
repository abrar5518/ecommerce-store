import Script from "next/script";

export default function Organization() {
  return (
    <>

      {/* Organization Schema */}
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Best Fashion LLC",
            "url": "https://bestfashionllc.com",
            "logo": "https://bestfashionllc.com/_next/image?url=%2Fassets%2Fimages%2Flogo.png&w=128&q=75", // update if different
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1 765-485-1222", // from site footer :contentReference[oaicite:1]{index=1}
              "contactType": "customer service",
              "areaServed": "Worldwide",
              "availableLanguage": ["English"]
            },
            "sameAs": [
              "https://www.facebook.com/bestfashionusa", // adjust if different
              "https://www.instagram.com/bestfashionl.l.c/?hl=en" // from UI :contentReference[oaicite:2]{index=2}
            ]
          })
        }}
      />

   
    </>
  );
}
