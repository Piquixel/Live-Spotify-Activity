/**
 * Formats a semicolon separated string of artists into a comma separated string with an ampersand at the end
 */
export function formatArtists (artistString: string): string {
  const artists = artistString.split('; ').filter(Boolean)
  if (artists.length <= 1) return artists[0] || ''

  return artists.join(', ').replace(/, ([^,]*)$/, ' & $1')
}

/**
 * Validates if a string is a valid Discord ID Snowflake (17-19 digits)
 */
export function isValid (id: string): boolean {
  return /^\d{17,19}$/.test(id)
}
