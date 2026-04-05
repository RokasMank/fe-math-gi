/**
 * Builds a URL query string from a params object.
 * Filters out null, undefined, and empty-string values.
 *
 * @param {Record<string, any>} params
 * @returns {string} e.g. "code=ABC&school=LT"
 */
export function buildQueryString(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
}

