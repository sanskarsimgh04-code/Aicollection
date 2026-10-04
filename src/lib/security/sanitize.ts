/**
 * Security & Sanitization Utilities
 */

/**
 * Strips HTML tags and potential script injections from user input.
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[<>'"]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        default: return char;
      }
    })
    .trim();
}

/**
 * Normalizes and sanitizes phone numbers
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d\+\-\(\)\s]/g, '').trim();
}

/**
 * Cleans object properties shallowly
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
