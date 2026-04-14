/**
 * Calculate reading time in minutes from HTML content.
 * Uses 225 wpm which is the average adult silent reading speed.
 */
export function calculateReadingTime(html: string): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, ' '); // strip tags
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 225);
  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return '1 min read';
  return `${minutes} min read`;
}
