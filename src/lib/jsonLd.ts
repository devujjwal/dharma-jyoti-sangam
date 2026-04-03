const SITE_NAME = "Divya Jyoti";
const SITE_URL = "https://dharma-jyoti-sangam.lovable.app";

export function articleJsonLd(article: {
  title: string; slug: string; excerpt?: string; author_name?: string | null;
  published_at?: string | null; updated_at?: string; featured_image_url?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || "",
    author: { "@type": "Person", name: article.author_name || SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    url: `${SITE_URL}/articles/${article.slug}`,
    ...(article.featured_image_url && { image: article.featured_image_url }),
    ...(article.published_at && { datePublished: article.published_at }),
    ...(article.updated_at && { dateModified: article.updated_at }),
  };
}

export function templeJsonLd(temple: {
  name: string; slug: string; description?: string; latitude?: number | null;
  longitude?: number | null; city?: string | null; state?: string | null;
  image_url?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HinduTemple",
    name: temple.name,
    description: temple.description || "",
    url: `${SITE_URL}/temples/${temple.slug}`,
    ...(temple.image_url && { image: temple.image_url }),
    ...(temple.latitude && temple.longitude && {
      geo: { "@type": "GeoCoordinates", latitude: temple.latitude, longitude: temple.longitude },
    }),
    ...(temple.city && {
      address: {
        "@type": "PostalAddress",
        addressLocality: temple.city,
        ...(temple.state && { addressRegion: temple.state }),
        addressCountry: "IN",
      },
    }),
  };
}

export function festivalJsonLd(festival: {
  name: string; slug: string; description?: string; festival_date: string;
  image_url?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: festival.name,
    description: festival.description || "",
    startDate: festival.festival_date,
    url: `${SITE_URL}/festivals/${festival.slug}`,
    ...(festival.image_url && { image: festival.image_url }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: `${SITE_URL}/festivals/${festival.slug}` },
  };
}

export function vratJsonLd(vrat: {
  name: string; slug: string; description?: string; deity?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: vrat.name,
    description: vrat.description || "",
    url: `${SITE_URL}/vrat/${vrat.slug}`,
    articleSection: "Hindu Vrat & Fasting",
    ...(vrat.deity && { about: { "@type": "Thing", name: vrat.deity } }),
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}
