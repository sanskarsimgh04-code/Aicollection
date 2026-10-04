/**
 * Origin and CSRF verification helper for API endpoints and actions
 */
export function verifyOrigin(originHeader: string | null | undefined, expectedAppUrl: string): boolean {
  if (!originHeader) return true; // Non-browser / same-origin requests

  try {
    const originUrl = new URL(originHeader);
    const appUrl = new URL(expectedAppUrl);
    return originUrl.hostname === appUrl.hostname;
  } catch {
    return false;
  }
}
