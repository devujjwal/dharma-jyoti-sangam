import DOMPurify from "dompurify";

/** Sanitize HTML content from admin-entered text. Returns safe HTML string. */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "b", "i", "u", "a", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre", "span", "div", "img", "table", "thead", "tbody", "tr", "td", "th", "hr", "sup", "sub"],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class", "id", "title", "width", "height"],
    ALLOW_DATA_ATTR: false,
  });
}

/** Sanitize plain text — strip all HTML tags. */
export function sanitizeText(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
