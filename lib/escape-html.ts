/**
 * Escape a string for safe interpolation into HTML (email bodies,
 * server-rendered fragments). Mirrors the private helpers that already
 * exist in lib/email/team-welcome.ts and visitor-welcome.ts.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
