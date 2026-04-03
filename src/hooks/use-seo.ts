import { useEffect } from "react";

interface SeoOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

/** Sets document title, meta description, and optional JSON-LD. Restores defaults on unmount. */
export function useSeo({ title, description, ogImage, jsonLd }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") || "";
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImg = document.querySelector('meta[property="og:image"]');

    if (title) document.title = `${title} | Divya Jyoti`;

    if (description) {
      if (metaDesc) metaDesc.setAttribute("content", description);
      else {
        const m = document.createElement("meta");
        m.name = "description";
        m.content = description;
        document.head.appendChild(m);
      }
      if (ogDesc) ogDesc.setAttribute("content", description);
    }

    if (title && ogTitle) ogTitle.setAttribute("content", title);
    if (ogImage && ogImg) ogImg.setAttribute("content", ogImage);

    // JSON-LD structured data
    let ldScript: HTMLScriptElement | null = null;
    if (jsonLd) {
      ldScript = document.createElement("script");
      ldScript.type = "application/ld+json";
      ldScript.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(ldScript);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
      if (ldScript) ldScript.remove();
    };
  }, [title, description, ogImage, jsonLd]);
}
