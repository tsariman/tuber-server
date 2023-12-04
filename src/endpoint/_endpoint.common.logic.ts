
/**
 * Get a query parameter from a request.
 *
 * @param req 
 * @param includeQm whether to include the question mark in the returned string
 * @returns string
 */
export function get_raw_query(req: any, includeQm = false): string {
  const query = req.raw.url?.split('?')[1]
  if (!query) return ''
  return includeQm ? `?${query}` : query
}
