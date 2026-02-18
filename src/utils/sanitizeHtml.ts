/**
 * Simple HTML sanitizer that only allows safe tags (br, span, strong, em, b, i).
 * Strips all other tags including script, event handlers, etc.
 */
export const sanitizeHtml = (html: string): string => {
  // Remove script tags and their content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers (on*)
  clean = clean.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\s+on\w+\s*=\s*\S+/gi, '');
  
  // Remove dangerous tags but keep content
  const dangerousTags = ['iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'link', 'style', 'meta'];
  dangerousTags.forEach(tag => {
    clean = clean.replace(new RegExp(`<${tag}\b[^>]*>`, 'gi'), '');
    clean = clean.replace(new RegExp(`</${tag}>`, 'gi'), '');
  });
  
  // Remove javascript: URLs
  clean = clean.replace(/javascript\s*:/gi, '');
  
  return clean;
};
